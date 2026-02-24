'use server'

import { createClient, createAdminClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getPlans() {
    const supabase = await createClient()
    const { data: plans, error } = await supabase
        .from('plans')
        .select('*')
        .order('price', { ascending: true })

    if (error) throw new Error(error.message)
    return plans
}

export async function registerMember(formData: {
    fullName: string
    email: string
    phone: string
    planId: string
}) {
    const supabase = await createClient()
    const adminSupabase = await createAdminClient()

    // 1. Get the current user (Manager)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')
    console.log('Registering member for manager:', user.id)

    // 2. Fetch the plan details to calculate expiry
    const { data: plan, error: planError } = await supabase
        .from('plans')
        .select('*')
        .eq('id', formData.planId)
        .single()

    if (planError || !plan) {
        console.error('Plan fetch error:', planError)
        throw new Error('Selected plan not found')
    }
    console.log('Plan found:', plan.name)

    // 3. Create the Member using Admin Client
    const { data: member, error: memberError } = await adminSupabase
        .from('members')
        .insert({
            full_name: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            manager_id: user.id,
            status: 'active'
        })
        .select()
        .single()

    if (memberError) {
        console.error('Member creation error:', memberError)
        throw new Error(memberError.message)
    }
    console.log('Member created:', member.id)

    // 4. Calculate Expiry Date
    const expiryDate = new Date()
    expiryDate.setDate(expiryDate.getDate() + plan.duration_days)

    // 5. Create the Subscription using Admin Client
    const { error: subError } = await adminSupabase
        .from('subscriptions')
        .insert({
            member_id: member.id,
            plan_id: plan.id,
            expiry_date: expiryDate.toISOString(),
            status: 'active'
        })

    if (subError) {
        console.error('Subscription creation error:', subError)
        throw new Error(subError.message)
    }
    console.log('Subscription created successfully')

    // 6. Send Welcome Email (Simulated)
    try {
        const { sendWelcomeEmail } = await import('@/utils/notifications')
        await sendWelcomeEmail(formData.email, formData.fullName)
    } catch (e) {
        console.error('Email notify failed:', e)
    }

    revalidatePath('/dashboard')
    return { success: true }
}

export async function getDashboardData() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    // Fetch members assigned to this manager
    const { data: members, error: membersError } = await supabase
        .from('members')
        .select(`
            id,
            full_name,
            status,
            subscriptions (
                expiry_date,
                plans (
                    name,
                    price
                )
            )
        `)
        .eq('manager_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5)

    if (membersError) throw new Error(membersError.message)

    // Calculate total revenue from payments table
    // Fetch payments for members belonging to this manager
    const { data: payments, error: paymentsError } = await supabase
        .from('payments')
        .select(`
            amount,
            member_id,
            members!inner(manager_id)
        `)
        .eq('members.manager_id', user.id)

    const totalRevenue = payments?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0

    return {
        recentMembers: members.map(m => ({
            id: m.id,
            name: m.full_name,
            status: m.status,
            planName: (m.subscriptions as any)?.[0]?.plans?.name || 'No Plan',
            expiryDate: (m.subscriptions as any)?.[0]?.expiry_date || null
        })),
        totalRevenue,
        membersCount: members.length // This is just for the recent list, we fetch total count in page.tsx
    }
}

export async function getMembers() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data: members, error } = await supabase
        .from('members')
        .select(`
            *,
            subscriptions (
                *,
                plans (*)
            )
        `)
        .eq('manager_id', user.id)
        .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)
    return members
}

export async function generatePaymentLink(memberId: string, amount: number, email: string) {
    const secret = process.env.PAYSTACK_SECRET_KEY
    if (!secret) throw new Error('Paystack Secret Key is missing')

    try {
        const response = await fetch('https://api.paystack.co/transaction/initialize', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${secret}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                amount: amount * 100, // Convert to Pesewas
                currency: 'GHS',
                metadata: {
                    member_id: memberId
                }
            })
        })

        const data = await response.json()
        if (!data.status) throw new Error(data.message)

        return {
            success: true,
            authorization_url: data.data.authorization_url,
            reference: data.data.reference
        }
    } catch (error: any) {
        console.error('Paystack Initialize Error:', error)
        throw new Error(error.message || 'Failed to initialize payment')
    }
}
