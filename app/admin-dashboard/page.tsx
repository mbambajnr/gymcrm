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
        .select('role, gym_name, paystack_secret_key, paystack_public_key')
        .eq('id', user.id)
        .single()

    if (profile?.role !== 'admin' && user.email !== 'balikakingadam@gmail.com') {
        return redirect('/manager-dashboard')
    }

    const [managers, initialMetrics, initialPlans] = await Promise.all([
        getManagers(),
        getPlatformMetrics('12months'),
        adminSupabase.from('plans').select('name, price').in('name', ['Monthly Plan', 'Quarterly Plan', 'Annual Plan'])
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
            paystackKeys={{
                secretKey: profile?.paystack_secret_key || '',
                publicKey: profile?.paystack_public_key || ''
            }}
            initialPlans={initialPlans.data || []}
            broadcastSettings={{
                senderName: user?.user_metadata?.broadcast_name || user?.user_metadata?.full_name || '',
                senderEmail: user?.user_metadata?.broadcast_email || user?.email || ''
            }}
        />
    )
}
