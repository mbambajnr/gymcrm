'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import {
    BarChart3,
    Settings,
    ShieldCheck,
    LogOut,
    Bell,
    Activity,
    Users,
    Shield,
    ChevronRight,
    Search,
    Plus,
    Clock,
    UserPlus,
    Mail,
    Phone,
    Megaphone,
    Lock,
    RefreshCw
} from 'lucide-react'
import { RevenueChart, DataPoint } from '@/components/admin/RevenueChart'
import AddManagerModal from '@/components/admin/AddManagerModal'
import BroadcastModal from '@/components/admin/BroadcastModal'
import DeactivateManagerModal from '@/components/admin/DeactivateManagerModal'
import EditManagerModal from '@/components/admin/EditManagerModal'
import { getPlatformMetrics, updateAdminPassword, updatePaystackSettings, updatePlanPricing, updateBroadcastSettings } from '@/app/admin-dashboard/actions'

interface Manager {
    id: string
    name: string | null
    email: string | null
    phone: string | null
    role: string
    conversions?: number
    last_active?: string
    created_at: string
}

interface AdminDashboardContainerProps {
    userEmail: string | null | undefined
    managers: Manager[]
    gymName?: string | null
    initialMetrics: {
        totalRevenue: number
        todayRevenue: number
        activeMembers: number
        revenueData: DataPoint[]
        telemetry: {
            dbLatency: string
            uptime: string
            status: string
            lastSync: string
        }
    }
    paystackKeys: {
        secretKey: string
        publicKey: string
    }
    initialPlans: { name: string, price: number }[]
    broadcastSettings: {
        senderName: string
        senderEmail: string
    }
}

export default function AdminDashboardContainer({
    userEmail,
    managers,
    gymName,
    initialMetrics,
    paystackKeys: initialPaystackKeys,
    initialPlans,
    broadcastSettings: initialBroadcastSettings
}: AdminDashboardContainerProps) {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isBroadcastOpen, setIsBroadcastOpen] = useState(false)
    const [deactivatingManager, setDeactivatingManager] = useState<Manager | null>(null)
    const [editingManager, setEditingManager] = useState<Manager | null>(null)
    const [currentView, setCurrentView] = useState<'intelligence' | 'staff' | 'security' | 'health' | 'settings'>('intelligence')
    const [adminSearchQuery, setAdminSearchQuery] = useState('')
    const [metrics, setMetrics] = useState(initialMetrics)
    const [timeFilter, setTimeFilter] = useState<'12months' | '30days'>('12months')
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [adminNewPassword, setAdminNewPassword] = useState('')
    const [adminPasswordLoading, setAdminPasswordLoading] = useState(false)
    const [paystackKeys, setKeys] = useState(initialPaystackKeys)
    const [paystackLoading, setPaystackLoading] = useState(false)
    const [planRates, setPlanRates] = useState(initialPlans)
    const [plansLoading, setPlansLoading] = useState(false)
    const [broadcastSettings, setBroadcastSettings] = useState(initialBroadcastSettings)
    const [broadcastSettingsLoading, setBroadcastSettingsLoading] = useState(false)
    const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

    const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
        setNotification({ message, type })
        setTimeout(() => setNotification(null), 5000)
    }

    const handlePaystackUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        setPaystackLoading(true)
        try {
            await updatePaystackSettings(paystackKeys)
            showNotification('Paystack configuration synchronized. Your workspace is now authorized to process real-time payments.')
        } catch (error: any) {
            showNotification('Authorization failed: ' + error.message, 'error')
        } finally {
            setPaystackLoading(false)
        }
    }

    const handleAdminPasswordUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        if (adminNewPassword.length < 6) return alert('Password must be at least 6 characters')
        setAdminPasswordLoading(true)
        try {
            await updateAdminPassword(adminNewPassword)
            showNotification('Root access key updated successfully. Your security architecture has been hardened.')
            setAdminNewPassword('')
        } catch (error: any) {
            showNotification('Security update failed: ' + error.message, 'error')
        } finally {
            setAdminPasswordLoading(false)
        }
    }

    const handlePlanUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        setPlansLoading(true)
        try {
            await updatePlanPricing(planRates)
            showNotification('Subscription architecture updated. New rates are now active across all nodes.')
        } catch (error: any) {
            showNotification('Update failed: ' + error.message, 'error')
        } finally {
            setPlansLoading(false)
        }
    }

    const handleBroadcastSettingsUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        setBroadcastSettingsLoading(true)
        try {
            await updateBroadcastSettings(broadcastSettings)
            showNotification('Broadcast protocol updated. All future announcements will be sent using these credentials.')
        } catch (error: any) {
            showNotification('Update failed: ' + error.message, 'error')
        } finally {
            setBroadcastSettingsLoading(false)
        }
    }

    const handleFilterChange = async (newFilter: '12months' | '30days') => {
        setTimeFilter(newFilter)
        setIsRefreshing(true)
        try {
            const newMetrics = await getPlatformMetrics(newFilter)
            setMetrics(newMetrics)
        } catch (error) {
            console.error('Failed to update metrics:', error)
        } finally {
            setIsRefreshing(false)
        }
    }

    const filteredManagers = managers.filter(manager =>
        manager.name?.toLowerCase().includes(adminSearchQuery.toLowerCase()) ||
        manager.email?.toLowerCase().includes(adminSearchQuery.toLowerCase()) ||
        manager.phone?.includes(adminSearchQuery)
    )


    return (
        <div className="flex min-h-screen bg-[#010101] text-white selection:bg-white/10">
            <AddManagerModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
            <BroadcastModal
                isOpen={isBroadcastOpen}
                onClose={() => setIsBroadcastOpen(false)}
            />
            <DeactivateManagerModal
                isOpen={!!deactivatingManager}
                onClose={() => setDeactivatingManager(null)}
                manager={deactivatingManager}
            />
            <EditManagerModal
                isOpen={!!editingManager}
                onClose={() => setEditingManager(null)}
                manager={editingManager}
            />

            {/* Notification Toast */}
            {notification && (
                <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[200] animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className={`px-6 py-4 rounded-2xl border flex items-center gap-4 shadow-2xl backdrop-blur-xl ${notification.type === 'success'
                        ? 'bg-green-500/10 border-green-500/20 text-green-400'
                        : 'bg-red-500/10 border-red-500/20 text-red-400'
                        }`}>
                        {notification.type === 'success' ? (
                            <ShieldCheck className="h-5 w-5" />
                        ) : (
                            <Activity className="h-5 w-5" />
                        )}
                        <span className="text-sm font-bold tracking-tight">{notification.message}</span>
                    </div>
                </div>
            )}

            {/* Sidebar */}
            <aside className="sticky top-0 h-screen hidden lg:flex w-[300px] flex-col border-r border-white/5 bg-[#050505] p-8 z-50">
                <div className="flex items-center gap-2.5 mb-14 px-2">
                    <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-white shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                        <Image
                            src="/logo.png"
                            alt="Gym CRM Logo"
                            width={36}
                            height={36}
                            className="h-full w-full object-contain"
                        />
                    </div>
                    <span className="text-lg font-bold tracking-tight">{gymName || 'GymFlow'}</span>
                </div>

                <nav className="space-y-1.5">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600 mb-4 px-4">Management</p>
                    {[
                        { id: 'intelligence', label: 'Business Insights', icon: BarChart3 },
                        { id: 'staff', label: 'Staff directory', icon: Users },
                        { id: 'broadcast', label: 'Announcements', icon: Megaphone },
                        { id: 'security', label: 'Account Security', icon: ShieldCheck },
                        { id: 'health', label: 'System Status', icon: Activity },
                        { id: 'settings', label: 'General Settings', icon: Settings },
                    ].map((item) => (
                        <div
                            key={item.id}
                            onClick={() => {
                                if (item.id === 'broadcast') {
                                    setIsBroadcastOpen(true)
                                } else if (item.id === 'intelligence' || item.id === 'staff' || item.id === 'security' || item.id === 'health' || item.id === 'settings') {
                                    setCurrentView(item.id as any)
                                }
                            }}
                            className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all cursor-pointer group ${currentView === item.id ? 'bg-white/5 text-white shadow-[inset_0_0_20px_rgba(255,255,255,0.02)]' : 'text-zinc-500 hover:text-white hover:bg-white/[0.03]'}`}
                        >
                            <item.icon className={`h-[18px] w-[18px] ${currentView === item.id ? 'text-white' : 'text-zinc-600 group-hover:text-zinc-400'}`} />
                            <span className="text-sm font-medium">{item.label}</span>
                        </div>
                    ))}
                </nav>

                <div className="absolute bottom-8 left-8 right-8">
                    <form action="/auth/signout" method="post">
                        <button
                            type="submit"
                            className="flex w-full items-center gap-3 px-4 py-3 rounded-2xl text-zinc-500 hover:text-red-400 hover:bg-red-400/5 transition-all outline-none"
                        >
                            <LogOut className="h-[18px] w-[18px]" />
                            <span className="text-sm font-medium">Log out</span>
                        </button>
                    </form>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-h-screen bg-[#010101] overflow-x-hidden">
                {/* Top Nav */}
                <header className="h-[80px] border-b border-white/5 flex items-center justify-between px-10 glass-nav sticky top-0 z-40">
                    <div className="flex items-center gap-4">
                        <h1 className="text-sm font-semibold text-zinc-400 uppercase tracking-widest text-[10px]">Admin</h1>
                        <ChevronRight className="h-3 w-3 text-zinc-700" />
                        <h1 className="text-sm font-semibold text-white uppercase tracking-widest text-[10px]">
                            {currentView === 'intelligence' ? 'Dashboard Overview' :
                                currentView === 'staff' ? 'Staff Directory' :
                                    currentView === 'security' ? 'Security Settings' :
                                        currentView === 'health' ? 'System Status' : 'Settings'}
                        </h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600 group-focus-within:text-white transition-colors" />
                            <input
                                type="text"
                                placeholder="Search staff members..."
                                value={adminSearchQuery}
                                onChange={(e) => {
                                    setAdminSearchQuery(e.target.value)
                                    if (currentView !== 'staff') setCurrentView('staff')
                                }}
                                className="w-64 bg-white/[0.03] border border-white/[0.06] rounded-xl py-2.5 pl-11 pr-5 text-[13px] font-medium focus:border-white/10 transition-all outline-none placeholder:text-zinc-700"
                            />
                        </div>
                        <button className="h-10 w-10 flex items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.03] text-zinc-400 hover:text-white transition-all">
                            <Bell className="h-[18px] w-[18px]" />
                        </button>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="h-10 px-5 flex items-center gap-2 bg-white text-black rounded-xl text-[13px] font-bold transition-all hover:bg-zinc-200 active:scale-95 shadow-lg shadow-white/5"
                        >
                            <UserPlus className="h-4 w-4" />
                            Invite Manager
                        </button>
                    </div>
                </header>

                <div className="p-14 space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {currentView === 'intelligence' ? (
                        <>
                            {/* Header Section */}
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="h-2 w-2 rounded-full bg-primary animate-pulse"></div>
                                        <span className="text-[11px] font-bold text-primary uppercase tracking-[0.3em]">Live Overview Active</span>
                                    </div>
                                    <h2 className="text-5xl font-bold tracking-tight mb-2">{gymName || 'Gym Overview'}</h2>
                                    <p className="text-zinc-500 font-medium">Monitoring activity for <span className="text-white">{userEmail}</span></p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="cauras-card flex items-center gap-6 px-6 py-4">
                                        <div className="text-center">
                                            <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-1">Managers</p>
                                            <p className="text-lg font-bold">{managers.length}</p>
                                        </div>
                                        <div className="w-px h-8 bg-white/5"></div>
                                        <div className="text-center">
                                            <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-1">Response</p>
                                            <p className="text-lg font-bold">24ms</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* KPI Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {[
                                    { label: 'Total Revenue', value: `GH₵${metrics.totalRevenue.toLocaleString()}`, sub: `+GH₵${metrics.todayRevenue.toLocaleString()} today` },
                                    { label: 'Active Members', value: metrics.activeMembers.toLocaleString(), sub: 'Across all branches' },
                                    { label: 'System Uptime', value: metrics.telemetry.uptime, sub: 'Service status' },
                                ].map((stat, i) => (
                                    <div key={i} className="cauras-card p-10 group overflow-hidden relative">
                                        <p className="text-[12px] font-bold text-zinc-600 uppercase tracking-[0.2em] mb-4">{stat.label}</p>
                                        <h3 className="text-4xl font-bold tracking-tight mb-2">{stat.value}</h3>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[12px] font-bold text-green-400 uppercase tracking-wider">{stat.sub}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Chart & Tables */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                                <div className="lg:col-span-2 space-y-8">
                                    <div className="cauras-card p-8 min-h-[400px]">
                                        <div className="flex items-center justify-between mb-10">
                                            <div>
                                                <h3 className="text-xl font-bold tracking-tight mb-1">Revenue Stream</h3>
                                                <p className="text-[13px] text-zinc-500 font-medium">{timeFilter === '12months' ? 'Consolidated growth for 2026' : 'Real-time performance metrics'}</p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                {isRefreshing && <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />}
                                                <select
                                                    value={timeFilter}
                                                    onChange={(e) => handleFilterChange(e.target.value as '12months' | '30days')}
                                                    className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-[12px] font-semibold outline-none focus:border-white/20"
                                                >
                                                    <option value="12months">Last 12 Months</option>
                                                    <option value="30days">Last 30 Days</option>
                                                </select>
                                            </div>
                                        </div>
                                        <RevenueChart data={metrics.revenueData} />
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    <div className="cauras-card p-8">
                                        <div className="flex items-center justify-between mb-8">
                                            <h3 className="text-lg font-bold tracking-tight">Recent Staff</h3>
                                            <button onClick={() => setIsModalOpen(true)} className="h-8 w-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all">
                                                <Plus className="h-4 w-4" />
                                            </button>
                                        </div>
                                        <div className="space-y-6">
                                            {managers.slice(0, 3).map((manager) => (
                                                <div key={manager.id} className="flex gap-4 group">
                                                    <div className="h-10 w-10 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-zinc-500 group-hover:text-white transition-colors">
                                                        <Shield className="h-5 w-5" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between mb-0.5">
                                                            <p className="text-[13px] font-bold">Manager Created</p>
                                                            <span className="text-[10px] text-zinc-700 font-bold uppercase tracking-wider">
                                                                {new Date(manager.created_at).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                        <p className="text-[11px] text-zinc-500 font-medium">{manager.name || 'System Manager'}</p>
                                                    </div>
                                                </div>
                                            ))}
                                            {managers.length === 0 && (
                                                <p className="text-[12px] text-zinc-600 italic">No recent staff activity logged.</p>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => setCurrentView('staff')}
                                            className="w-full mt-8 py-3 rounded-xl border border-white/5 bg-white/[0.02] text-[12px] font-bold text-zinc-500 hover:text-white hover:bg-white/5 transition-all text-center"
                                        >
                                            View Staff Directory
                                        </button>
                                    </div>

                                    <div className="cauras-card p-8 bg-primary/5 border-primary/10">
                                        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-4">Security Note</h3>
                                        <p className="text-[13px] font-medium text-zinc-400 leading-relaxed">
                                            All staff actions are monitored for security. ensure all team members set strong passwords.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : currentView === 'security' ? (
                        <div className="max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <div className="mb-12">
                                <h2 className="text-5xl font-bold tracking-tight mb-3">Security Settings</h2>
                                <p className="text-zinc-500 font-medium">Manage your admin password and account security.</p>
                            </div>

                            <div className="cauras-card p-10 space-y-10 border-white/10 max-w-xl">
                                <div>
                                    <h3 className="text-[11px] font-bold text-zinc-600 uppercase tracking-[0.2em] mb-6">Change Admin Password</h3>
                                    <form onSubmit={handleAdminPasswordUpdate} className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest px-1">New Password</label>
                                            <div className="relative">
                                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
                                                <input
                                                    type="password"
                                                    required
                                                    value={adminNewPassword}
                                                    onChange={(e) => setAdminNewPassword(e.target.value)}
                                                    placeholder="Minimum 6 characters"
                                                    className="cauras-input w-full pl-14 pr-6 py-4 text-sm font-medium outline-none bg-white/[0.03] border border-white/10 rounded-xl"
                                                />
                                            </div>
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={adminPasswordLoading || !adminNewPassword}
                                            className="w-full bg-white text-black py-4 rounded-xl font-bold text-[13px] hover:bg-zinc-200 transition-all active:scale-95 disabled:opacity-30 flex items-center justify-center gap-2"
                                        >
                                            {adminPasswordLoading ? 'Saving Changes...' : 'Update Password'}
                                            {!adminPasswordLoading && <RefreshCw className="h-3.5 w-3.5" />}
                                        </button>
                                    </form>
                                </div>

                                <div className="pt-8 border-t border-white/5">
                                    <div className="flex gap-4 p-5 rounded-2xl bg-white/[0.02] border border-white/5">
                                        <div className="h-10 w-10 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                            <ShieldCheck className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-[13px] font-bold mb-1">Security Reminder</p>
                                            <p className="text-[12px] text-zinc-500 leading-relaxed font-medium">
                                                Changing your admin password will log you out of all other sessions for security.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : currentView === 'health' ? (
                        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <div>
                                <h2 className="text-5xl font-bold tracking-tight mb-2">System Status</h2>
                                <p className="text-zinc-500 font-medium">Real-time update on platform performance and service health.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="cauras-card p-10">
                                    <p className="text-[12px] font-bold text-zinc-600 uppercase tracking-[0.2em] mb-4">Database Speed</p>
                                    <h3 className="text-4xl font-bold tracking-tight text-primary mb-2">{metrics.telemetry.dbLatency}</h3>
                                    <p className="text-[12px] font-bold text-green-400 uppercase tracking-wider">Fast Connection</p>
                                </div>
                                <div className="cauras-card p-10">
                                    <p className="text-[12px] font-bold text-zinc-600 uppercase tracking-[0.2em] mb-4">Uptime</p>
                                    <h3 className="text-4xl font-bold tracking-tight mb-2">{metrics.telemetry.uptime}</h3>
                                    <p className="text-[12px] font-bold text-zinc-500 uppercase tracking-wider">Reliable Access</p>
                                </div>
                                <div className="cauras-card p-10">
                                    <p className="text-[12px] font-bold text-zinc-600 uppercase tracking-[0.2em] mb-4">Current Status</p>
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                                        <h3 className="text-2xl font-bold tracking-tight uppercase tracking-widest">{metrics.telemetry.status}</h3>
                                    </div>
                                    <p className="text-[12px] font-bold text-zinc-500 uppercase tracking-wider">Everything is working well</p>
                                </div>
                            </div>

                            <div className="cauras-card p-10">
                                <h3 className="text-xl font-bold tracking-tight mb-8">Feature Status</h3>
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between py-4 border-b border-white/5">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center">
                                                <Activity className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold">App Access</p>
                                                <p className="text-[12px] text-zinc-500">General app connectivity</p>
                                            </div>
                                        </div>
                                        <span className="text-[11px] font-bold text-green-500 uppercase tracking-widest bg-green-500/10 px-3 py-1 rounded-lg">Healthy</span>
                                    </div>
                                    <div className="flex items-center justify-between py-4 border-b border-white/5">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center">
                                                <Shield className="h-5 w-5 text-blue-500" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold">Security Service</p>
                                                <p className="text-[12px] text-zinc-500">Logins & Account Protection</p>
                                            </div>
                                        </div>
                                        <span className="text-[11px] font-bold text-green-500 uppercase tracking-widest bg-green-500/10 px-3 py-1 rounded-lg">Healthy</span>
                                    </div>
                                    <div className="flex items-center justify-between py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center">
                                                <Clock className="h-5 w-5 text-amber-500" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold">Data Sync</p>
                                                <p className="text-[12px] text-zinc-500">Auto-updating records</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Last Updated</p>
                                            <p className="text-[12px] font-bold text-white">{new Date(metrics.telemetry.lastSync).toLocaleTimeString()}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : currentView === 'settings' ? (
                        <div className="max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <div className="mb-12">
                                <h2 className="text-4xl font-bold tracking-tight mb-3">Platform Preferences</h2>
                                <p className="text-zinc-500 font-medium">Configure global workspace settings and administrative defaults.</p>
                            </div>

                            <div className="cauras-card p-10 space-y-12">
                                <div>
                                    <h3 className="text-[11px] font-bold text-zinc-600 uppercase tracking-[0.2em] mb-6">Branding Architecture</h3>
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest px-1">Organization Name</label>
                                            <input
                                                type="text"
                                                defaultValue={gymName || ''}
                                                className="cauras-input w-full px-6 py-4 text-sm font-medium outline-none bg-white/[0.03] border border-white/10 rounded-xl"
                                                readOnly
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-10 border-t border-white/5">
                                    <h3 className="text-[11px] font-bold text-zinc-600 uppercase tracking-[0.2em] mb-6">Payment Integration (Paystack)</h3>
                                    <p className="text-[12px] text-zinc-500 mb-6 font-medium">Link your Paystack account to receive payments directly. Keys can be found in your Paystack Dashboard under Settings → API Keys.</p>

                                    <form onSubmit={handlePaystackUpdate} className="space-y-6">
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest px-1">Secret Key</label>
                                                <input
                                                    type="password"
                                                    value={paystackKeys.secretKey}
                                                    onChange={(e) => setKeys({ ...paystackKeys, secretKey: e.target.value })}
                                                    placeholder="sk_live_..."
                                                    className="cauras-input w-full px-6 py-4 text-sm font-medium outline-none bg-white/[0.03] border border-white/10 rounded-xl"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest px-1">Public Key</label>
                                                <input
                                                    type="text"
                                                    value={paystackKeys.publicKey}
                                                    onChange={(e) => setKeys({ ...paystackKeys, publicKey: e.target.value })}
                                                    placeholder="pk_live_..."
                                                    className="cauras-input w-full px-6 py-4 text-sm font-medium outline-none bg-white/[0.03] border border-white/10 rounded-xl"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={paystackLoading}
                                            className="w-full bg-white text-black py-4 rounded-xl font-bold text-[13px] hover:bg-zinc-200 transition-all active:scale-[0.98] shadow-lg shadow-white/5 flex items-center justify-center gap-2"
                                        >
                                            {paystackLoading ? 'Syncing...' : 'Authorize Paystack Integration'}
                                            {!paystackLoading && <RefreshCw className="h-4 w-4" />}
                                        </button>
                                    </form>
                                </div>

                                <div className="pt-10 border-t border-white/5">
                                    <h3 className="text-[11px] font-bold text-zinc-600 uppercase tracking-[0.2em] mb-6">Plan Pricing Architecture</h3>
                                    <form onSubmit={handlePlanUpdate} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            {planRates.map((plan, index) => (
                                                <div key={plan.name} className="space-y-2">
                                                    <label className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest px-1">{plan.name}</label>
                                                    <div className="relative">
                                                        <span className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-600 font-bold text-sm">GH₵</span>
                                                        <input
                                                            type="number"
                                                            value={plan.price}
                                                            onChange={(e) => {
                                                                const newRates = [...planRates]
                                                                newRates[index].price = Number(e.target.value)
                                                                setPlanRates(newRates)
                                                            }}
                                                            className="cauras-input w-full pl-16 pr-6 py-4 text-sm font-bold outline-none bg-white/[0.03] border border-white/10 rounded-xl"
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={plansLoading}
                                            className="w-full bg-white text-black py-4 rounded-xl font-bold text-[13px] hover:bg-zinc-200 transition-all active:scale-[0.98] shadow-lg shadow-white/5 flex items-center justify-center gap-2"
                                        >
                                            {plansLoading ? 'Updating Rates...' : 'Apply New Pricing Model'}
                                            {!plansLoading && <Activity className="h-4 w-4" />}
                                        </button>
                                    </form>
                                </div>

                                <div className="pt-10 border-t border-white/5">
                                    <h3 className="text-[11px] font-bold text-zinc-600 uppercase tracking-[0.2em] mb-6">Broadcast Identity Settings</h3>
                                    <form onSubmit={handleBroadcastSettingsUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest px-1">Sender Display Name</label>
                                            <input
                                                type="text"
                                                value={broadcastSettings.senderName}
                                                onChange={(e) => setBroadcastSettings({ ...broadcastSettings, senderName: e.target.value })}
                                                placeholder="e.g. Elite Gym Support"
                                                className="cauras-input w-full px-6 py-4 text-sm font-medium outline-none bg-white/[0.03] border border-white/10 rounded-xl"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest px-1">Reply-To Address</label>
                                            <input
                                                type="email"
                                                value={broadcastSettings.senderEmail}
                                                onChange={(e) => setBroadcastSettings({ ...broadcastSettings, senderEmail: e.target.value })}
                                                placeholder="e.g. support@elitegym.com"
                                                className="cauras-input w-full px-6 py-4 text-sm font-medium outline-none bg-white/[0.03] border border-white/10 rounded-xl"
                                                required
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <button
                                                type="submit"
                                                disabled={broadcastSettingsLoading}
                                                className="w-full bg-white/5 text-white/50 hover:text-white hover:bg-white/10 py-4 rounded-xl font-bold text-[13px] border border-white/5 transition-all flex items-center justify-center gap-2"
                                            >
                                                {broadcastSettingsLoading ? 'Updating Protocol...' : 'Save Identity Configuration'}
                                                {!broadcastSettingsLoading && <Shield className="h-4 w-4" />}
                                            </button>
                                        </div>
                                    </form>
                                </div>

                                <div className="pt-10 border-t border-white/5">
                                    <h3 className="text-[11px] font-bold text-zinc-600 uppercase tracking-[0.2em] mb-6">Notification Protocols</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5">
                                            <div>
                                                <p className="text-sm font-bold">Invite Automation</p>
                                                <p className="text-[12px] text-zinc-500">Send automatic emails to new managers</p>
                                            </div>
                                            <div className="h-6 w-11 rounded-full bg-primary relative cursor-pointer shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                                                <div className="absolute right-1 top-1 h-4 w-4 rounded-full bg-white shadow-sm"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-10 border-t border-white/5">
                                    <button
                                        disabled
                                        className="w-full bg-white/5 text-zinc-500 py-4 rounded-xl font-bold text-[13px] border border-white/5 cursor-not-allowed"
                                    >
                                        Experimental Settings Locked
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-12">
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                                <div>
                                    <h2 className="text-5xl font-bold tracking-tight mb-2">Staff Directory</h2>
                                    <p className="text-zinc-500 font-medium">Manage your team accounts and platform access</p>
                                </div>
                                <div className="text-[11px] font-bold text-zinc-600 uppercase tracking-[0.2em] bg-white/[0.02] border border-white/5 px-4 py-2 rounded-xl">
                                    Active Accounts: {filteredManagers.length} / {managers.length}
                                </div>
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="bg-white text-black px-8 py-4 rounded-2xl font-bold text-[14px] hover:bg-zinc-200 transition-all flex items-center gap-2 shadow-xl shadow-white/5"
                                >
                                    <UserPlus className="h-4 w-4" />
                                    Authorize New Manager
                                </button>
                            </div>

                            <div className="cauras-card overflow-hidden">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-white/5 bg-white/[0.01]">
                                            <th className="px-10 py-6 text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-600">Staff Member</th>
                                            <th className="px-10 py-6 text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-600">Contact Information</th>
                                            <th className="px-10 py-6 text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-600 text-center">New Memberships</th>
                                            <th className="px-10 py-6 text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-600">Joined Date</th>
                                            <th className="px-10 py-6 text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-600 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/[0.03]">
                                        {filteredManagers.map((manager) => (
                                            <tr key={manager.id} className="group hover:bg-white/[0.01] transition-colors">
                                                <td className="px-10 py-8">
                                                    <div className="flex items-center gap-4">
                                                        <div className="h-12 w-12 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center font-bold text-zinc-400 group-hover:text-white transition-colors">
                                                            {manager.name?.charAt(0) || 'M'}
                                                        </div>
                                                        <div>
                                                            <p className="text-[15px] font-bold group-hover:text-white transition-colors line-clamp-1">{manager.name}</p>
                                                            <div className="flex items-center gap-2 mt-0.5">
                                                                <p className="text-[11px] font-bold text-primary uppercase tracking-widest">{manager.role}</p>
                                                                <span className="h-1 w-1 rounded-full bg-zinc-800" />
                                                                <span className={`text-[10px] font-bold uppercase tracking-widest ${manager.last_active ? 'text-green-500' : 'text-amber-500/40'}`}>
                                                                    {manager.last_active
                                                                        ? `Active • Last Seen ${new Date(manager.last_active).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} at ${new Date(manager.last_active).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                                                                        : 'Awaiting Activation'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-10 py-8">
                                                    <div className="space-y-1.5">
                                                        <div className="flex items-center gap-2 text-zinc-500">
                                                            <Mail className="h-3 w-3" />
                                                            <span className="text-[13px] font-medium">{manager.email}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-zinc-700">
                                                            <Phone className="h-3 w-3" />
                                                            <span className="text-[12px] font-medium">{manager.phone || 'No phone'}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-10 py-8 text-center">
                                                    <div className="inline-flex h-9 min-w-[36px] items-center justify-center rounded-lg bg-primary/10 border border-primary/20 px-3">
                                                        <span className="text-[14px] font-bold text-primary">{manager.conversions || 0}</span>
                                                    </div>
                                                </td>
                                                <td className="px-10 py-8">
                                                    <div className="flex items-center gap-2 text-zinc-500">
                                                        <Clock className="h-3 w-3" />
                                                        <span className="text-[13px] font-medium">{new Date(manager.created_at).toLocaleDateString()}</span>
                                                    </div>
                                                </td>
                                                <td className="px-10 py-8 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => setEditingManager(manager)}
                                                            className="h-10 w-10 rounded-xl border border-white/[0.06] bg-white/[0.02] text-zinc-700 hover:text-white hover:bg-white/[0.05] transition-all flex items-center justify-center"
                                                            title="Edit Manager"
                                                        >
                                                            <Settings className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => setDeactivatingManager(manager)}
                                                            className="h-10 w-10 rounded-xl border border-white/[0.06] bg-white/[0.02] text-zinc-700 hover:text-red-400 hover:bg-red-400/5 hover:border-red-400/20 transition-all flex items-center justify-center"
                                                            title="Deactivate Manager"
                                                        >
                                                            <LogOut className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        {managers.length === 0 && (
                                            <tr>
                                                <td colSpan={4} className="px-10 py-32 text-center text-zinc-600 text-sm font-medium italic">
                                                    No staff members found. Invite a manager to get started.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </main >
        </div >
    )
}
