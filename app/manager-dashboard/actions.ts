'use server'

import { createClient, createAdminClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getPlans() {
    // Definitive system plans as requested by user
    const standardPlans = [
        { id: 'monthly-std', name: 'Monthly Plan', price: 200, duration_days: 30, discount_percentage: 0 },
        { id: 'quarterly-std', name: 'Quarterly Plan', price: 500, duration_days: 90, discount_percentage: 10 },
        { id: 'annual-std', name: 'Annual Plan', price: 1800, duration_days: 365, discount_percentage: 20 }
    ]

    const adminSupabase = await createAdminClient()
    // Return ONLY the standard ones to the UI
    const { data: dbPlans } = await adminSupabase
        .from('plans')
        .select('*')
        .in('name', standardPlans.map(p => p.name))
        .order('price', { ascending: true })

    return dbPlans || []
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

    // 3. Create the Member using Admin Client (Starting as inactive/expired until first payment)
    const { data: member, error: memberError } = await adminSupabase
        .from('members')
        .insert({
            full_name: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            manager_id: user.id,
            status: 'expired'
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

    // 5. Create the Subscription using Admin Client (Locked at expired till hook hits)
    const { error: subError } = await adminSupabase
        .from('subscriptions')
        .insert({
            member_id: member.id,
            plan_id: plan.id,
            expiry_date: expiryDate.toISOString(),
            status: 'expired'
        })

    if (subError) {
        console.error('Subscription creation error:', subError)
        throw new Error(subError.message)
    }
    console.log('Subscription created successfully')

    // 6. Resolve Owner & Paystack Secret
    const { data: profile } = await adminSupabase
        .from('profiles')
        .select('owner_id')
        .eq('id', user.id)
        .single()

    let secret = process.env.PAYSTACK_SECRET_KEY
    let ownerId = profile?.owner_id || null

    if (ownerId) {
        const { data: ownerProfile } = await adminSupabase
            .from('profiles')
            .select('paystack_secret_key, broadcast_name, broadcast_email, gym_name')
            .eq('id', ownerId)
            .single()

        if (ownerProfile?.paystack_secret_key) {
            secret = ownerProfile.paystack_secret_key
        }

        // 7. Send Welcome Email (Simulated)
        try {
            const { sendWelcomeEmail } = await import('@/utils/notifications')
            const { data: { user: ownerUser } } = await adminSupabase.auth.admin.getUserById(ownerId)

            const fromName = ownerProfile?.broadcast_name || ownerProfile?.gym_name || 'Gym Management'
            const fromEmail = ownerProfile?.broadcast_email || ''

            await sendWelcomeEmail(formData.fullName, formData.email, fromName, fromEmail)
        } catch (e) {
            console.error('Email notify failed:', e)
        }
    }

    if (!secret) throw new Error('Gym payment system not configured.')

    // 8. Initialize Immediate Paystack Transaction
    const response = await fetch('https://api.paystack.co/transaction/initialize', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${secret}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: formData.email,
            amount: Math.round(plan.price * 100),
            currency: 'GHS',
            callback_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/manager-dashboard`,
            metadata: {
                member_id: member.id,
                owner_id: ownerId
            }
        })
    })

    const paystackData = await response.json()
    if (!paystackData.status) throw new Error(paystackData.message)

    revalidatePath('/manager-dashboard')

    return {
        success: true,
        authorization_url: paystackData.data.authorization_url
    }
}

export async function getDashboardData() {
    const supabase = await createClient()
    const adminSupabase = await createAdminClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    // Using Admin Client for full architecture view (RLS Bypass for managers)
    const { data: members, error: membersError } = await adminSupabase
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
    // Using adminSupabase to ensure payments are tracked across RLS boundaries
    const { data: payments, error: paymentsError } = await adminSupabase
        .from('payments')
        .select(`
            amount,
            member_id,
            members!inner(manager_id)
        `)
        .eq('members.manager_id', user.id)

    const totalRevenue = payments?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0

    // Calculate counts for detailed overview
    const activeMembers = members?.filter(m => m.status === 'active').length || 0
    const pendingMembers = members?.filter(m => m.status === 'suspended').length || 0

    return {
        recentMembers: (members || []).map(m => ({
            id: m.id,
            name: m.full_name,
            status: m.status,
            planName: (m.subscriptions as any)?.[0]?.plans?.name || 'No Plan',
            expiryDate: (m.subscriptions as any)?.[0]?.expiry_date || null
        })),
        totalRevenue,
        activeCount: activeMembers,
        pendingCount: pendingMembers
    }
}

export async function getTransactions() {
    const supabase = await createClient()
    const adminSupabase = await createAdminClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data: transactions, error } = await adminSupabase
        .from('payments')
        .select(`
            *,
            members!inner (
                full_name,
                email,
                manager_id
            )
        `)
        .eq('members.manager_id', user.id)
        .order('payment_date', { ascending: false })

    if (error) throw new Error(error.message)
    return transactions
}

export async function getMembers() {
    const supabase = await createClient()
    const adminSupabase = await createAdminClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data: members, error } = await adminSupabase
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
    const supabase = await createClient()
    const adminSupabase = await createAdminClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    // 1. Fetch the manager's profile to get the owner_id
    const { data: profile } = await adminSupabase
        .from('profiles')
        .select('owner_id')
        .eq('id', user.id)
        .single()

    let secret = process.env.PAYSTACK_SECRET_KEY
    let ownerId = null

    if (profile?.owner_id) {
        ownerId = profile.owner_id
        // 2. Fetch the owner's secret key
        const { data: ownerProfile } = await adminSupabase
            .from('profiles')
            .select('paystack_secret_key')
            .eq('id', ownerId)
            .single()

        if (ownerProfile?.paystack_secret_key) {
            secret = ownerProfile.paystack_secret_key
        }
    }

    if (!secret) {
        throw new Error('This gym has not configured their Paystack account. Please contact the administrator.')
    }

    try {
        const response = await fetch('https://api.paystack.co/transaction/initialize', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${secret}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                amount: Math.round(amount * 100), // Convert to Pesewas
                currency: 'GHS',
                callback_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/manager-dashboard`,
                metadata: {
                    member_id: memberId,
                    owner_id: ownerId // Pass owner_id for webhook verification
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
export async function updatePassword(newPassword: string) {
    const supabase = await createClient()
    const { error } = await supabase.auth.updateUser({
        password: newPassword
    })

    if (error) {
        console.error('Password Update Error:', error.message)
        throw new Error(error.message)
    }

    return { success: true }
}
