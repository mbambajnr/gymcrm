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
} from 'lucide-react'
import { RevenueChart, DataPoint } from '@/components/admin/RevenueChart'
import AddManagerModal from '@/components/admin/AddManagerModal'
import BroadcastModal from '@/components/admin/BroadcastModal'
import DeactivateManagerModal from '@/components/admin/DeactivateManagerModal'
import EditManagerModal from '@/components/admin/EditManagerModal'
import { getPlatformMetrics } from '@/app/admin-dashboard/actions'

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
    }
}

export default function AdminDashboardContainer({ userEmail, managers, gymName, initialMetrics }: AdminDashboardContainerProps) {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isBroadcastOpen, setIsBroadcastOpen] = useState(false)
    const [deactivatingManager, setDeactivatingManager] = useState<Manager | null>(null)
    const [editingManager, setEditingManager] = useState<Manager | null>(null)
    const [currentView, setCurrentView] = useState<'intelligence' | 'staff'>('intelligence')
    const [adminSearchQuery, setAdminSearchQuery] = useState('')
    const [metrics, setMetrics] = useState(initialMetrics)
    const [timeFilter, setTimeFilter] = useState<'12months' | '30days'>('12months')
    const [isRefreshing, setIsRefreshing] = useState(false)

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
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600 mb-4 px-4">Workspace</p>
                    {[
                        { id: 'intelligence', label: 'Intelligence', icon: BarChart3 },
                        { id: 'staff', label: 'Staff Directory', icon: Users },
                        { id: 'broadcast', label: 'Global Broadcast', icon: Megaphone },
                        { id: 'security', label: 'Platform Security', icon: ShieldCheck },
                        { id: 'health', label: 'System Health', icon: Activity },
                        { id: 'settings', label: 'Preferences', icon: Settings },
                    ].map((item) => (
                        <div
                            key={item.id}
                            onClick={() => {
                                if (item.id === 'broadcast') {
                                    setIsBroadcastOpen(true)
                                } else if (item.id === 'intelligence' || item.id === 'staff') {
                                    setCurrentView(item.id)
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
                        <h1 className="text-sm font-semibold text-zinc-400 uppercase tracking-widest text-[10px]">Root</h1>
                        <ChevronRight className="h-3 w-3 text-zinc-700" />
                        <h1 className="text-sm font-semibold text-white uppercase tracking-widest text-[10px]">{currentView === 'intelligence' ? 'Intelligence Center' : 'Staff Directory'}</h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600 group-focus-within:text-white transition-colors" />
                            <input
                                type="text"
                                placeholder="Search staff repository..."
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
                                        <span className="text-[11px] font-bold text-primary uppercase tracking-[0.3em]">Live Intelligence Active</span>
                                    </div>
                                    <h2 className="text-5xl font-bold tracking-tight mb-2">{gymName || 'Platform Audit'}</h2>
                                    <p className="text-zinc-500 font-medium">Monitoring root system activity for <span className="text-white">{userEmail}</span></p>
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
                                    { label: 'Platform Revenue', value: `GH₵${metrics.totalRevenue.toLocaleString()}`, sub: `+GH₵${metrics.todayRevenue.toLocaleString()} today` },
                                    { label: 'Active Members', value: metrics.activeMembers.toLocaleString(), sub: 'Across all branches' },
                                    { label: 'System Uptime', value: '99.98%', sub: 'Healthy status' },
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
                                            <h3 className="text-lg font-bold tracking-tight">Staff Logs</h3>
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
                                        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-4">Security Notice</h3>
                                        <p className="text-[13px] font-medium text-zinc-400 leading-relaxed">
                                            All administrative actions are logged and tied to your root identity. Ensure MFA is active on all manager accounts.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="space-y-12">
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                                <div>
                                    <h2 className="text-5xl font-bold tracking-tight mb-2">Staff Directory</h2>
                                    <p className="text-zinc-500 font-medium">Managing administrative node access for the platform</p>
                                </div>
                                <div className="text-[11px] font-bold text-zinc-600 uppercase tracking-[0.2em] bg-white/[0.02] border border-white/5 px-4 py-2 rounded-xl">
                                    Active Nodes: {filteredManagers.length} / {managers.length}
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
                                            <th className="px-10 py-6 text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-600">Administrator</th>
                                            <th className="px-10 py-6 text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-600">Contact / Node</th>
                                            <th className="px-10 py-6 text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-600 text-center">Conversions</th>
                                            <th className="px-10 py-6 text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-600">Authorization Date</th>
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
                                                                <span className={`text-[10px] font-bold uppercase tracking-widest ${manager.last_active ? 'text-green-500' : 'text-amber-500/50'}`}>
                                                                    {manager.last_active ? 'Active' : 'Pending Invite'}
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
                                                    No administrative nodes detected. Authorize a manager to begin staffing.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
