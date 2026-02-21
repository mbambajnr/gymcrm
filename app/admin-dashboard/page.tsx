import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import {
    BarChart3,
    Settings,
    ShieldCheck,
    LogOut,
    Search,
    Zap,
    Bell,
    Activity
} from 'lucide-react'

import { RevenueChart } from '@/components/admin/RevenueChart'

export default async function AdminDashboardPage() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return redirect('/login')
    }

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Sidebar Placeholder */}
            <aside className="fixed left-0 top-0 hidden h-full w-64 border-r border-white/5 bg-zinc-950/50 p-6 lg:block">
                <div className="flex items-center gap-3 mb-12 px-2">
                    <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded bg-white">
                        <Image
                            src="/logo.png"
                            alt="Gym CRM Logo"
                            width={32}
                            height={32}
                            className="h-full w-full object-contain"
                        />
                    </div>
                    <span className="text-xl font-bold tracking-tighter">Admin Portal</span>
                </div>

                <nav className="space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-4 px-2">Operations</p>
                    {[
                        { label: 'Intelligence', icon: BarChart3, active: true },
                        { label: 'Security', icon: ShieldCheck },
                        { label: 'System Health', icon: Activity },
                        { label: 'Settings', icon: Settings },
                    ].map((item, i) => (
                        <div
                            key={i}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${item.active ? 'bg-primary/20 text-primary' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}
                        >
                            <item.icon className="h-5 w-5" />
                            <span className="text-sm font-bold">{item.label}</span>
                        </div>
                    ))}
                </nav>

                <div className="absolute bottom-10 left-6 right-6">
                    <form action="/auth/signout" method="post">
                        <button
                            type="submit"
                            className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-zinc-500 hover:text-red-500 hover:bg-red-500/5 transition-all outline-none"
                        >
                            <LogOut className="h-5 w-5" />
                            <span className="text-sm font-bold">Sign out</span>
                        </button>
                    </form>
                </div>
            </aside>

            {/* Main Content */}
            <main className="lg:ml-64 p-8 sm:p-12">
                <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-12">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="h-2 w-2 rounded-full bg-primary shadow-[0_0_10px_rgba(0,122,255,0.8)] animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">System Monitoring Active</span>
                        </div>
                        <h1 className="text-3xl font-black tracking-tighter sm:text-4xl lg:text-5xl">Intelligence Center</h1>
                        <p className="text-zinc-500 font-medium mt-2">Platform Root Audit: {user.email}</p>
                    </div>
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                        <button className="h-12 w-12 flex items-center justify-center rounded-full bg-zinc-900 border border-white/5 text-zinc-500 hover:text-white transition-all">
                            <Bell className="h-5 w-5" />
                        </button>
                        <button className="flex items-center gap-3 bg-primary text-white px-8 py-3.5 rounded-full text-sm font-black transition-all hover:bg-primary/80 active:scale-95 shadow-2xl shadow-primary/20">
                            <Zap className="h-4 w-4" />
                            Run Global Sync
                        </button>
                    </div>
                </header>

                {/* Key Performance Indicators */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                    {[
                        { label: 'Registered Members', value: '2,482', trend: '↑ 12.4%', detail: 'Growth from Last Month' },
                        { label: 'Gross Revenue (Monthly)', value: '$67,400', trend: '↑ 18.2%', detail: 'Accumulated in June' },
                        { label: 'Conversion Rate', value: '42.8%', trend: '↑ 5.1%', detail: 'Payment link engagement' },
                    ].map((stat, i) => (
                        <div key={i} className="bg-zinc-950/80 border border-white/10 p-8 rounded-[40px] hover:border-primary/30 hover:bg-zinc-900/50 transition-all cursor-default group">
                            <p className="text-zinc-500 text-xs font-black uppercase tracking-widest mb-4 group-hover:text-primary transition-colors">{stat.label}</p>
                            <h3 className="text-5xl font-black mb-4 tracking-tighter group-hover:scale-[1.02] transition-transform">{stat.value}</h3>
                            <div className="flex items-center justify-between">
                                <span className="text-green-500 text-[11px] font-black uppercase shadow-green-500/20">{stat.trend}</span>
                                <span className="text-zinc-600 text-[10px] font-medium italic">{stat.detail}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Revenue Bar Chart (Main Growth Tracker) */}
                    <div className="lg:col-span-2">
                        <RevenueChart />
                    </div>

                    {/* Historical Comparison Table */}
                    <div className="bg-zinc-950/50 border border-white/5 rounded-[40px] p-8">
                        <h3 className="text-lg font-bold mb-6 tracking-tight">Growth Archive</h3>
                        <div className="space-y-6">
                            {[
                                { month: 'May 2026', rev: '$55,000', members: '2,140', growth: '+8.2%' },
                                { month: 'April 2026', rev: '$61,000', members: '2,010', growth: '+15.4%' },
                                { month: 'March 2026', rev: '$48,000', members: '1,890', growth: '-4.2%' },
                                { month: 'February 2026', rev: '$52,000', members: '1,750', growth: '+12.1%' },
                            ].map((row, i) => (
                                <div key={i} className="flex items-center justify-between py-4 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors px-2 rounded-xl">
                                    <div>
                                        <p className="text-sm font-bold">{row.month}</p>
                                        <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-widest mt-1">{row.members} members</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-black text-white">{row.rev}</p>
                                        <p className={`text-[10px] font-black mt-1 ${row.growth.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                                            {row.growth}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-8 py-3.5 rounded-2xl border border-white/10 text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-white hover:bg-white/5 transition-all">
                            Export Detailed PDF Report
                        </button>
                    </div>
                </div>
            </main>
        </div>
    )
}
