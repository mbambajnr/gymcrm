import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import {
    Users,
    CreditCard,
    Calendar,
    TrendingUp,
    LogOut,
    Search,
    Plus,
    Bell
} from 'lucide-react'

export default async function DashboardPage() {
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
                    <span className="text-xl font-bold tracking-tighter">Gym CRM</span>
                </div>

                <nav className="space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-4 px-2">Management</p>
                    {[
                        { label: 'Overview', icon: TrendingUp, active: true },
                        { label: 'Members', icon: Users },
                        { label: 'Payments', icon: CreditCard },
                        { label: 'Classes', icon: Calendar },
                    ].map((item, i) => (
                        <div
                            key={i}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${item.active ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}
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
                        <h1 className="text-3xl font-black tracking-tighter sm:text-4xl lg:text-5xl">Manager Dashboard</h1>
                        <p className="text-zinc-500 font-medium mt-2">Welcome back, {user.email}</p>
                    </div>
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                        <div className="relative flex-1 sm:flex-none">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                            <input
                                type="text"
                                placeholder="Search members..."
                                className="w-full sm:w-64 bg-zinc-900/50 border border-white/5 rounded-full py-2.5 pl-11 pr-4 text-sm focus:border-white/20 transition-all outline-none"
                            />
                        </div>
                        <button className="h-10 w-10 flex items-center justify-center rounded-full bg-zinc-900 border border-white/5 text-zinc-500 hover:text-white transition-all">
                            <Bell className="h-5 w-5" />
                        </button>
                        <button className="flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-full text-sm font-black transition-all hover:bg-zinc-200 active:scale-95 shadow-lg shadow-white/5">
                            <Plus className="h-4 w-4" />
                            Add Member
                        </button>
                    </div>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {[
                        { label: 'Total Members', value: '1,284', trend: '+12%', icon: Users },
                        { label: 'Active Plans', value: '842', trend: '+5%', icon: Calendar },
                        { label: 'Monthly Revenue', value: '$42,500', trend: '+18%', icon: CreditCard },
                        { label: 'Pending Payments', value: '12', trend: '-2%', icon: Bell },
                    ].map((stat, i) => (
                        <div key={i} className="bg-zinc-950/50 border border-white/5 p-6 rounded-3xl hover:border-white/10 transition-all group">
                            <div className="flex items-center justify-between mb-4">
                                <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/5 text-zinc-400 group-hover:text-white transition-colors">
                                    <stat.icon className="h-5 w-5" />
                                </div>
                                <span className={`text-[11px] font-black px-2 py-1 rounded-full ${stat.trend.startsWith('+') ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                    {stat.trend}
                                </span>
                            </div>
                            <p className="text-zinc-500 text-[11px] font-black uppercase tracking-widest mb-1">{stat.label}</p>
                            <h3 className="text-2xl font-black">{stat.value}</h3>
                        </div>
                    ))}
                </div>

                {/* Placeholder Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-zinc-950/50 border border-white/5 rounded-[32px] p-8 h-96 flex flex-col items-center justify-center text-center">
                        <div className="h-20 w-20 rounded-2xl bg-white/5 flex items-center justify-center mb-6">
                            <TrendingUp className="h-10 w-10 text-zinc-500" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Registration Trends</h3>
                        <p className="text-zinc-600 max-w-sm">Detailed charts and analytics will appear here once you have more member data.</p>
                    </div>
                    <div className="bg-zinc-950/50 border border-white/5 rounded-[32px] p-8 shrink-0">
                        <h3 className="text-lg font-bold mb-6">Recent Activities</h3>
                        <div className="space-y-6">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="flex gap-4">
                                    <div className="h-10 w-10 rounded-full bg-white/5 flex-shrink-0" />
                                    <div className="space-y-1">
                                        <p className="text-sm font-bold">New member registered</p>
                                        <p className="text-xs text-zinc-600 font-medium">2 minutes ago</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
