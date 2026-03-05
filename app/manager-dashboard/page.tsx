import { createClient, createAdminClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import DashboardContainer from '@/components/dashboard/DashboardContainer'
import { getPlans, getDashboardData, getMembers, getTransactions } from './actions'

export default async function DashboardPage() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return redirect('/login')
    }

    // Role-based protection
    const adminSupabase = await createAdminClient()
    const { data: profile } = await adminSupabase
        .from('profiles')
        .select('role, gym_name')
        .eq('id', user.id)
        .single()

    if (profile?.role === 'admin' || user.email === 'balikakingadam@gmail.com') {
        return redirect('/admin-dashboard')
    }

    const [plans, dashboardData, allMembers, transactions] = await Promise.all([
        getPlans(),
        getDashboardData(),
        getMembers(),
        getTransactions()
    ])

    // Fetch total member count for the stat card
    const { count } = await supabase
        .from('members')
        .select('*', { count: 'exact', head: true })
        .eq('manager_id', user.id)

    return (
        <DashboardContainer
            userEmail={user.email}
            plans={plans}
            membersCount={count || 0}
            activeCount={dashboardData.activeCount}
            pendingCount={dashboardData.pendingCount}
            recentMembers={dashboardData.recentMembers}
            totalRevenue={dashboardData.totalRevenue}
            allMembers={allMembers}
            transactions={transactions}
            gymName={profile?.gym_name}
        />
    )
}
