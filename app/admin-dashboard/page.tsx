import { createClient, createAdminClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import AdminDashboardContainer from '@/components/admin/AdminDashboardContainer'
import { getManagers, getPlatformMetrics } from './actions'

export default async function AdminDashboardPage() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return redirect('/login')
    }

    // Role-based protection: only admins allowed
    const adminSupabase = await createAdminClient()
    const { data: profile } = await adminSupabase
        .from('profiles')
        .select('role, gym_name')
        .eq('id', user.id)
        .single()

    if (profile?.role !== 'admin' && user.email !== 'balikakingadam@gmail.com') {
        return redirect('/dashboard')
    }

    const [managers, initialMetrics] = await Promise.all([
        getManagers(),
        getPlatformMetrics('12months')
    ])

    return (
        <AdminDashboardContainer
            userEmail={user.email}
            managers={managers.map(m => ({
                ...m,
                email: m.email ?? null
            }))}
            gymName={profile?.gym_name}
            initialMetrics={initialMetrics}
        />
    )
}
