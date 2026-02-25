'use server'

import { createClient, createAdminClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { sendManagerInvite } from '@/utils/notifications'

export async function createManager(formData: {
    fullName: string
    email: string
    phone: string
}) {
    // 1. Service Role Key Protection
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY === 'your_service_role_key_here') {
        return {
            success: false,
            message: 'System Error: SUPABASE_SERVICE_ROLE_KEY is missing.'
        }
    }

    try {
        const adminSupabase = await createAdminClient()
        const supabase = await createClient()
        const tempPassword = 'GF' + Math.random().toString(36).slice(-6).toUpperCase()

        // 2. Comprehensive Duplicate Checks
        // Check Auth system
        const { data: { users }, error: listError } = await adminSupabase.auth.admin.listUsers()
        if (listError) throw listError
        if (users.some(u => u.email?.toLowerCase() === formData.email.toLowerCase())) {
            return {
                success: false,
                message: `An account with ${formData.email} already exists.`
            }
        }

        // Check Profile system
        const { data: existingProfile } = await adminSupabase
            .from('profiles')
            .select('id')
            .eq('email', formData.email)
            .maybeSingle()

        if (existingProfile) {
            return {
                success: false,
                message: 'A database profile already exists for this email.'
            }
        }

        // 3. Resolve GYM association for the new manager
        const { data: { user: owner } } = await supabase.auth.getUser()
        let gymName = 'Elite Gym' // Default if owner has no gym assigned

        if (owner) {
            const { data: ownerProfile } = await adminSupabase
                .from('profiles')
                .select('gym_name')
                .eq('id', owner.id)
                .maybeSingle()

            if (ownerProfile?.gym_name) gymName = ownerProfile.gym_name
            else if (owner.user_metadata?.gym_name) gymName = owner.user_metadata.gym_name
        }

        // 4. Phase 1: Barebones Auth Creation
        // We omit name/phone here because common triggers try to insert them into profiles, 
        // which crashes if the columns don't exist in the profiles table.
        const { data: authData, error: authError } = await adminSupabase.auth.admin.createUser({
            email: formData.email,
            password: tempPassword,
            email_confirm: true,
            user_metadata: {
                role: 'manager',
                gym_name: gymName
            }
        })

        if (authError) {
            console.error('Auth Creation Phase 1 Error:', authError.message)
            return {
                success: false,
                message: `Authorization failed: ${authError.message}. This is almost certainly a database trigger crash in Supabase. Your 'handle_new_user' trigger is likely trying to insert into non-existent columns (e.g., full_name, name, or phone) in the 'profiles' table.`
            }
        }

        const userId = authData?.user?.id
        if (userId) {
            // 5. Phase 2: Enrich Metadata
            // Updates usually don't run the INSERT trigger, so we can safely add name/phone here.
            await adminSupabase.auth.admin.updateUserById(userId, {
                user_metadata: {
                    full_name: formData.fullName,
                    phone: formData.phone,
                    has_finished_setup: true
                }
            })

            // 6. Manual Profile Sync
            await adminSupabase
                .from('profiles')
                .upsert({
                    id: userId,
                    email: formData.email,
                    role: 'manager',
                    gym_name: gymName
                })

            // 7. Notification (Fire and forget)
            sendManagerInvite(formData.email, tempPassword).catch(e => console.error('Invite Error:', e))
        }

        revalidatePath('/admin-dashboard')
        return {
            success: true,
            tempPassword: tempPassword,
            message: 'Administrative Node Authorized Successfully'
        }
    } catch (error: unknown) {
        console.error('Fatal Manager Creation Error:', error)
        return {
            success: false,
            message: `Critical Error: ${error instanceof Error ? error.message : 'Unknown'}`
        }
    }
}

export async function getManagers() {
    const adminSupabase = await createAdminClient()

    // 1. Fetch users from auth
    const { data: { users }, error: authError } = await adminSupabase.auth.admin.listUsers()
    if (authError) {
        console.error('Error fetching managers:', authError.message)
        return []
    }

    // 2. Fetch conversion counts from members table
    const { data: counts } = await adminSupabase
        .from('members')
        .select('manager_id')

    // Create a lookup map for conversions
    const conversionMap: { [key: string]: number } = {}
    counts?.forEach(member => {
        if (member.manager_id) {
            conversionMap[member.manager_id] = (conversionMap[member.manager_id] || 0) + 1
        }
    })

    // 3. Filter and map
    return users
        .filter(user => user.user_metadata?.role === 'manager')
        .map(user => ({
            id: user.id,
            name: user.user_metadata?.full_name || 'System Manager',
            email: user.email,
            phone: user.user_metadata?.phone || 'No phone',
            role: 'manager',
            conversions: conversionMap[user.id] || 0,
            last_active: user.last_sign_in_at,
            created_at: user.created_at
        }))
}
export async function getPlatformMetrics(filter: '12months' | '30days') {
    const adminSupabase = await createAdminClient()

    // 1. Fetch Total Revenue
    const { data: payments } = await adminSupabase
        .from('payments')
        .select('amount, created_at')
        .eq('status', 'success')

    // 2. Fetch Active Members
    const { count: activeMembers } = await adminSupabase
        .from('members')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active')

    // 3. Process Revenue Data for Chart
    const revenueData = processRevenueData(payments || [], filter)

    const totalRevenue = payments?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0
    const today = new Date().toISOString().split('T')[0]
    const todayRevenue = payments
        ?.filter(p => (p.created_at as string).startsWith(today))
        .reduce((sum, p) => sum + (p.amount || 0), 0) || 0

    return {
        totalRevenue,
        todayRevenue,
        activeMembers: activeMembers || 0,
        revenueData
    }
}

function processRevenueData(payments: { amount: number, created_at: string }[], filter: '12months' | '30days') {
    if (filter === '30days') {
        // Daily revenue for last 30 days
        const last30Days: { [key: string]: number } = {}
        for (let i = 29; i >= 0; i--) {
            const date = new Date()
            date.setDate(date.getDate() - i)
            const dateStr = date.toISOString().split('T')[0]
            last30Days[dateStr] = 0
        }

        payments.forEach(p => {
            const dateStr = (p.created_at as string).split('T')[0]
            if (last30Days[dateStr] !== undefined) {
                last30Days[dateStr] += p.amount
            }
        })

        return Object.entries(last30Days).map(([date, amount]) => ({
            month: date.split('-').slice(1).join('/'), // MM/DD
            revenue: amount
        }))
    } else {
        // Monthly revenue for last 12 months
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        const yearData: { [key: string]: number } = {}

        // Last 6 months for display (keeping it compact like the mock)
        const currentMonth = new Date().getMonth()
        for (let i = 5; i >= 0; i--) {
            const m = (currentMonth - i + 12) % 12
            yearData[months[m]] = 0
        }

        payments.forEach(p => {
            const date = new Date(p.created_at)
            const monthName = months[date.getMonth()]
            if (yearData[monthName] !== undefined) {
                yearData[monthName] += p.amount
            }
        })

        return Object.entries(yearData).map(([name, amount]) => ({
            month: name,
            revenue: amount
        }))
    }
}
export async function deactivateManager(managerId: string) {
    const adminSupabase = await createAdminClient()

    try {
        const { error } = await adminSupabase.auth.admin.deleteUser(managerId)

        if (error) {
            console.error('User deletion failed:', error.message)
            return {
                success: false,
                message: `Failed to deactivate node: ${error.message}`
            }
        }

        // The profile will be deleted automatically if there's a cascade,
        // but we'll explicitly delete it just in case.
        await adminSupabase
            .from('profiles')
            .delete()
            .eq('id', managerId)

        revalidatePath('/admin-dashboard')

        return {
            success: true,
            message: 'Administrative Node Deactivated'
        }
    } catch (error: unknown) {
        console.error('Deactivation error:', error)
        const message = error instanceof Error ? error.message : 'Unknown error occurred'
        return {
            success: false,
            message: `System Error: ${message}`
        }
    }
}

export async function updateManager(managerId: string, formData: {
    fullName: string
    phone: string
}) {
    const adminSupabase = await createAdminClient()

    try {
        const { error } = await adminSupabase.auth.admin.updateUserById(managerId, {
            user_metadata: {
                full_name: formData.fullName,
                phone: formData.phone,
                role: 'manager'
            }
        })

        if (error) {
            console.error('User update failed:', error.message)
            return {
                success: false,
                message: `Failed to update node: ${error.message}`
            }
        }

        revalidatePath('/admin-dashboard')

        return {
            success: true,
            message: 'Administrative Node Updated'
        }
    } catch (error: unknown) {
        console.error('Update error:', error)
        const message = error instanceof Error ? error.message : 'Unknown error occurred'
        return {
            success: false,
            message: `System Error: ${message}`
        }
    }
}
