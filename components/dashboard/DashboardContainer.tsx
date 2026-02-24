'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import {
    Users,
    CreditCard,
    Calendar,
    LayoutDashboard,
    LogOut,
    Search,
    Plus,
    Bell,
    ArrowUpRight,
    TrendingUp,
    MoreHorizontal,
    ChevronRight,
    Mail,
    Phone,
    Clock,
    RefreshCw,
    Megaphone,
    Send
} from 'lucide-react'
import AddMemberModal from '@/components/dashboard/AddMemberModal'
import ManagerBroadcastModal from '@/components/dashboard/ManagerBroadcastModal'
import { generatePaymentLink } from '@/app/dashboard/actions'

interface Plan {
    id: string
    name: string
    price: number
    duration_days: number
    discount_percentage: number
}

interface Member {
    id: string
    name: string
    status: string
    planName: string
    expiryDate: string | null
}

interface FullMember extends Member {
    email: string
    phone: string
    created_at: string
}

interface DashboardContainerProps {
    userEmail: string | null | undefined
    plans: Plan[]
    membersCount: number
    recentMembers: Member[]
    totalRevenue: number
    allMembers: any[]
    gymName?: string | null
}

export default function DashboardContainer({
    userEmail,
    plans,
    membersCount,
    recentMembers,
    totalRevenue,
    allMembers,
    gymName
}: DashboardContainerProps) {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isBroadcastOpen, setIsBroadcastOpen] = useState(false)
    const [currentView, setCurrentView] = useState<'overview' | 'members' | 'announcements'>('overview')
    const [searchQuery, setSearchQuery] = useState('')
    const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'suspended'>('all')
    const [renewalLoading, setRenewalLoading] = useState<string | null>(null)

    const handleRenew = async (memberId: string, email: string, amount: number) => {
        setRenewalLoading(memberId)
        try {
            const result = await generatePaymentLink(memberId, amount, email)
            if (result.success && result.authorization_url) {
                window.location.href = result.authorization_url
            }
        } catch (error: any) {
            console.error('Renewal Error:', error)
            alert('Failed to generate renewal link: ' + error.message)
        } finally {
            setRenewalLoading(null)
        }
    }

    const filteredMembers = allMembers.filter(member => {
        const matchesSearch = member.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            member.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            member.phone?.includes(searchQuery)

        const matchesFilter = filterStatus === 'all' || member.status === filterStatus
        return matchesSearch && matchesFilter
    })

    const stats = [
        { label: 'Total Members', value: membersCount.toString(), trend: '+12.5%', icon: Users },
        { label: 'Active Subs', value: membersCount.toString(), trend: '+5.2%', icon: TrendingUp },
        { label: 'Monthly Revenue', value: `GH₵${totalRevenue.toLocaleString()}`, trend: '+18.4%', icon: CreditCard },
        { label: 'Completion', value: '100%', trend: '0%', icon: LayoutDashboard },
    ]

    return (
        <div className="flex min-h-screen bg-[#010101] text-white selection:bg-white/10">
            <AddMemberModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                plans={plans}
            />
            <ManagerBroadcastModal
                isOpen={isBroadcastOpen}
                onClose={() => setIsBroadcastOpen(false)}
                memberCount={membersCount}
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
                    {[
                        { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
                        { id: 'members', label: 'Gym Members', icon: Users },
                        { id: 'announcements', label: 'Announcements', icon: Megaphone },
                        { id: 'transactions', label: 'Transactions', icon: CreditCard },
                    ].map((item) => (
                        <div
                            key={item.id}
                            onClick={() => {
                                if (item.id === 'overview' || item.id === 'members' || item.id === 'announcements') {
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

                <div className="absolute bottom-8 left-8 right-8 space-y-4">
                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 grayscale">
                        <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em] mb-2">Sync Status</p>
                        <div className="flex items-center gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Live / Local</span>
                        </div>
                    </div>
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
                        <h1 className="text-sm font-semibold text-zinc-400 uppercase tracking-widest text-[10px]">Manager</h1>
                        <ChevronRight className="h-3 w-3 text-zinc-700" />
                        <h1 className="text-sm font-semibold text-white uppercase tracking-widest text-[10px]">{currentView}</h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600 group-focus-within:text-white transition-colors" />
                            <input
                                type="text"
                                placeholder="Search repository..."
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value)
                                    if (currentView !== 'members') setCurrentView('members')
                                }}
                                className="w-64 bg-white/[0.03] border border-white/[0.06] rounded-xl py-2.5 pl-11 pr-5 text-[12px] font-medium focus:border-white/10 transition-all outline-none placeholder:text-zinc-700"
                            />
                        </div>
                        <button className="h-10 w-10 flex items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.03] text-zinc-400 hover:text-white transition-all">
                            <Bell className="h-[18px] w-[18px]" />
                        </button>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="h-10 px-6 flex items-center gap-2 bg-white text-black rounded-xl text-[12px] font-bold transition-all hover:bg-zinc-200 active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.1)]"
                        >
                            <Plus className="h-4 w-4" />
                            Register Member
                        </button>
                    </div>
                </header>

                <div className="p-14 space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {currentView === 'overview' ? (
                        <>
                            {/* Welcome Header */}
                            <div className="flex items-end justify-between mb-2">
                                <div>
                                    <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-[0.3em] mb-3">Workspace Status: Operational</p>
                                    <h2 className="text-4xl font-bold tracking-tight">{gymName || 'GymFlow'} <span className="text-zinc-700 font-light mx-2">/</span> <span className="text-zinc-500">Overview</span></h2>
                                </div>
                                <div className="hidden sm:flex items-center gap-4 p-1 rounded-xl bg-white/[0.02] border border-white/5">
                                    <button className="px-4 py-1.5 rounded-lg bg-white/[0.05] text-[11px] font-bold text-white uppercase tracking-widest">Today</button>
                                    <button className="px-4 py-1.5 rounded-lg text-[11px] font-bold text-zinc-500 hover:text-white uppercase tracking-widest transition-colors">7 Days</button>
                                    <button className="px-4 py-1.5 rounded-lg text-[11px] font-bold text-zinc-500 hover:text-white uppercase tracking-widest transition-colors">30 Days</button>
                                </div>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                                {stats.map((stat, i) => (
                                    <div key={i} className="cauras-card p-7 group cursor-default hover:border-white/10 transition-colors">
                                        <div className="flex items-center justify-between mb-8">
                                            <p className="text-[12px] font-bold text-zinc-500 uppercase tracking-widest">{stat.label}</p>
                                            <div className="flex items-center gap-1 text-[11px] font-bold text-green-400 bg-green-400/5 px-2.5 py-1.5 rounded-lg border border-green-500/10">
                                                <ArrowUpRight className="h-3 w-3" />
                                                {stat.trend}
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <h3 className="text-3xl font-bold tracking-tight">{stat.value}</h3>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Main Sections */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                                {/* Member Activity Table */}
                                <div className="lg:col-span-2 cauras-card overflow-hidden">
                                    <div className="p-7 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
                                        <div className="space-y-1">
                                            <h3 className="text-lg font-bold tracking-tight">Recent Activity</h3>
                                            <p className="text-[11px] font-bold text-zinc-600 uppercase tracking-widest">Latest registry updates</p>
                                        </div>
                                        <button
                                            onClick={() => setCurrentView('members')}
                                            className="text-[11px] font-bold text-zinc-500 hover:text-white transition-colors uppercase tracking-widest"
                                        >
                                            Full Repository →
                                        </button>
                                    </div>
                                    <div className="p-0">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="bg-white/[0.02] border-b border-white/5">
                                                    <th className="p-6 text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em]">Identify</th>
                                                    <th className="p-6 text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em]">Status</th>
                                                    <th className="p-6 text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em]">Architecture</th>
                                                    <th className="p-6 text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em] text-right">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/[0.04]">
                                                {recentMembers.length > 0 ? recentMembers.map((member) => (
                                                    <tr key={member.id} className="group hover:bg-white/[0.02] transition-all">
                                                        <td className="p-6">
                                                            <div className="flex items-center gap-4">
                                                                <div className="h-10 w-10 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-[13px] font-bold text-zinc-500 group-hover:text-white transition-colors group-hover:bg-white group-hover:text-black">
                                                                    {member.name.split(' ').map(n => n[0]).join('')}
                                                                </div>
                                                                <div className="space-y-0.5">
                                                                    <p className="text-[14px] font-bold">{member.name}</p>
                                                                    <p className="text-[11px] text-zinc-600 font-medium tracking-wide">Registered {member.expiryDate ? new Date(member.expiryDate).toLocaleDateString() : 'N/A'}</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="p-6">
                                                            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${member.status === 'active' ? 'bg-green-500/5 text-green-400 border-green-500/10' : 'bg-red-500/5 text-red-400 border-red-500/10'}`}>
                                                                {member.status}
                                                            </span>
                                                        </td>
                                                        <td className="p-6 text-[13px] font-bold text-zinc-400 group-hover:text-white transition-all uppercase tracking-tight">{member.planName}</td>
                                                        <td className="p-6 text-right">
                                                            <button className="h-9 w-9 flex items-center justify-center rounded-xl bg-white/[0.03] border border-white/[0.05] hover:bg-white hover:text-black text-zinc-600 transition-all">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                )) : (
                                                    <tr>
                                                        <td colSpan={4} className="p-12 text-center text-zinc-600 text-sm font-medium italic">No recent members found in the repository.</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Resource Cards */}
                                <div className="space-y-8">
                                    <div className="cauras-card p-10 bg-gradient-to-br from-white/[0.04] to-transparent border-white/10">
                                        <div className="h-14 w-14 rounded-2xl bg-white flex items-center justify-center text-black mb-8 shadow-2xl shadow-white/20">
                                            <TrendingUp className="h-7 w-7" />
                                        </div>
                                        <h3 className="text-2xl font-bold tracking-tight mb-4">Scale your <br /> Infrastructure</h3>
                                        <p className="text-[14px] text-zinc-500 leading-relaxed mb-8 font-medium">Unlock advanced telemetry, member churn prediction, and automated broadcasting tools.</p>
                                        <button className="w-full py-4 rounded-2xl bg-white text-black text-[14px] font-bold transition-all hover:bg-zinc-200 active:scale-[0.98]">Request Upgrade</button>
                                    </div>

                                    <div className="cauras-card p-9 overflow-hidden relative">
                                        <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-zinc-600 mb-8">System Links</h3>
                                        <div className="space-y-5">
                                            {[
                                                'Export member architecture',
                                                'Configure node settings',
                                                'Automated broadcasting',
                                                'Architect support'
                                            ].map((link, i) => (
                                                <div key={i} className="flex items-center justify-between py-3 group cursor-pointer border-b border-white/[0.03] last:border-0 hover:translate-x-1 transition-transform">
                                                    <span className="text-[13px] font-bold text-zinc-500 group-hover:text-white transition-colors">{link}</span>
                                                    <ChevronRight className="h-3 w-3 text-zinc-800 group-hover:text-zinc-400 transition-all" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : currentView === 'members' ? (
                        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                                <div>
                                    <h2 className="text-5xl font-bold tracking-tight mb-2">Member Repository</h2>
                                    <p className="text-zinc-500 font-medium">Complete record of registered gym members and their status</p>
                                </div>
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="bg-white text-black px-8 py-4 rounded-2xl font-bold text-[14px] hover:bg-zinc-200 transition-all flex items-center gap-2 shadow-xl shadow-white/5"
                                >
                                    <Plus className="h-4 w-4" />
                                    Register New Member
                                </button>
                            </div>

                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 py-2 border-b border-white/5 pb-6">
                                <div className="flex bg-white/[0.02] border border-white/5 p-1 rounded-2xl w-fit">
                                    {(['all', 'active', 'suspended'] as const).map((status) => (
                                        <button
                                            key={status}
                                            onClick={() => setFilterStatus(status)}
                                            className={`px-6 py-2 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all ${filterStatus === status ? 'bg-white text-black shadow-lg shadow-white/5' : 'text-zinc-500 hover:text-white'}`}
                                        >
                                            {status}
                                        </button>
                                    ))}
                                </div>
                                <div className="text-[11px] font-bold text-zinc-600 uppercase tracking-[0.2em] bg-white/[0.02] border border-white/5 px-4 py-2 rounded-xl">
                                    Members Found: {filteredMembers.length}
                                </div>
                            </div>

                            <div className="cauras-card overflow-hidden">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-white/5 bg-white/[0.01]">
                                            <th className="px-10 py-6 text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-600">Member</th>
                                            <th className="px-10 py-6 text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-600">Contact</th>
                                            <th className="px-10 py-6 text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-600">Plan Architecture</th>
                                            <th className="px-10 py-6 text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-600">Node Status</th>
                                            <th className="px-10 py-6 text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-600 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/[0.03]">
                                        {filteredMembers.map((member) => (
                                            <tr key={member.id} className="group hover:bg-white/[0.01] transition-colors">
                                                <td className="px-10 py-8">
                                                    <div className="flex items-center gap-4">
                                                        <div className="h-12 w-12 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center font-bold text-zinc-400 group-hover:text-white transition-colors">
                                                            {member.full_name?.charAt(0) || 'M'}
                                                        </div>
                                                        <div>
                                                            <p className="text-[15px] font-bold group-hover:text-white transition-colors line-clamp-1">{member.full_name}</p>
                                                            <p className="text-[11px] font-bold text-zinc-600 uppercase tracking-widest mt-0.5">UID-{member.id.substring(0, 5)}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-10 py-8">
                                                    <div className="space-y-1.5">
                                                        <div className="flex items-center gap-2 text-zinc-500">
                                                            <Mail className="h-3 w-3" />
                                                            <span className="text-[13px] font-medium">{member.email}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-zinc-700">
                                                            <Phone className="h-3 w-3" />
                                                            <span className="text-[12px] font-medium">{member.phone}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-10 py-8">
                                                    <div className="space-y-1.5">
                                                        <p className="text-[13px] font-bold text-zinc-400 group-hover:text-white transition-all uppercase tracking-tight">{member.subscriptions?.[0]?.plans?.name || 'No Plan'}</p>
                                                        <div className="flex items-center gap-2 text-zinc-600">
                                                            <Calendar className="h-3 w-3" />
                                                            <span className="text-[11px] font-medium">Expires: {member.subscriptions?.[0]?.expiry_date ? new Date(member.subscriptions[0].expiry_date).toLocaleDateString() : 'N/A'}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-10 py-8">
                                                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${member.status === 'active' ? 'bg-green-500/5 text-green-400 border-green-500/10' : 'bg-red-500/5 text-red-400 border-red-500/10'}`}>
                                                        {member.status}
                                                    </span>
                                                </td>
                                                <td className="px-10 py-8 text-right">
                                                    <button
                                                        onClick={() => handleRenew(
                                                            member.id,
                                                            member.email,
                                                            member.subscriptions?.[0]?.plans?.price || 0
                                                        )}
                                                        disabled={renewalLoading === member.id}
                                                        className="h-10 px-4 rounded-xl border border-white/[0.06] bg-white/[0.02] text-zinc-400 hover:text-white hover:bg-white/[0.05] transition-all flex items-center justify-center gap-2 ml-auto disabled:opacity-50"
                                                    >
                                                        {renewalLoading === member.id ? (
                                                            <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                                                        ) : (
                                                            <CreditCard className="h-3.5 w-3.5" />
                                                        )}
                                                        <span className="text-[11px] font-bold uppercase tracking-wider">Renew</span>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {allMembers.length === 0 && (
                                            <tr>
                                                <td colSpan={5} className="px-10 py-32 text-center text-zinc-600 text-sm font-medium italic">
                                                    No members detected in the repository. Start by registering a member.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                                <div>
                                    <h2 className="text-5xl font-bold tracking-tight mb-2">Announcements</h2>
                                    <p className="text-zinc-500 font-medium">Broadcast news and updates to your registered member network</p>
                                </div>
                                <button
                                    onClick={() => setIsBroadcastOpen(true)}
                                    className="bg-white text-black px-8 py-4 rounded-2xl font-bold text-[14px] hover:bg-zinc-200 transition-all flex items-center gap-2 shadow-xl shadow-white/5"
                                >
                                    <Megaphone className="h-4 w-4" />
                                    Create Broadcast
                                </button>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                                <div className="lg:col-span-2 space-y-8">
                                    {[
                                        { title: 'New Treadmills Arriving', date: '2 hours ago', meta: 'Internal Broadcast', content: 'Our new fleet of motorized treadmills will be installed this Friday. Please expect minor noise.' },
                                        { title: 'Easter Holiday Hours', date: 'Yesterday', meta: 'Schedule Update', content: 'We will be closing at 2PM on Sunday for the Easter holiday. Normal hours resume Monday.' }
                                    ].map((msg, i) => (
                                        <div key={i} className="cauras-card p-10 group hover:border-white/10 transition-all">
                                            <div className="flex items-center justify-between mb-6">
                                                <div className="flex items-center gap-2">
                                                    <span className="px-3 py-1 rounded-lg bg-primary/5 text-primary text-[10px] font-bold uppercase tracking-widest border border-primary/10">{msg.meta}</span>
                                                    <span className="text-zinc-700 font-bold text-[10px] uppercase tracking-widest">•</span>
                                                    <span className="text-zinc-600 font-bold text-[10px] uppercase tracking-widest">{msg.date}</span>
                                                </div>
                                            </div>
                                            <h3 className="text-2xl font-bold tracking-tight mb-3 group-hover:text-primary transition-colors">{msg.title}</h3>
                                            <p className="text-zinc-500 font-medium leading-relaxed">{msg.content}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-8">
                                    <div className="cauras-card p-8 bg-zinc-900/40">
                                        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500 mb-6">Audience Metrics</h3>
                                        <div className="space-y-6">
                                            <div>
                                                <p className="text-[11px] font-bold text-zinc-600 uppercase tracking-widest mb-2">Total Reach</p>
                                                <p className="text-3xl font-bold tracking-tight">{membersCount} Members</p>
                                            </div>
                                            <div className="pt-6 border-t border-white/5">
                                                <p className="text-[11px] font-bold text-zinc-600 uppercase tracking-widest mb-2">Active Channels</p>
                                                <div className="flex gap-4">
                                                    <div className="flex items-center gap-2 text-[12px] font-bold text-zinc-400">
                                                        <Mail className="h-3 w-3" /> Email
                                                    </div>
                                                    <div className="flex items-center gap-2 text-[12px] font-bold text-zinc-400 opacity-30">
                                                        <Phone className="h-3 w-3" /> SMS
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
