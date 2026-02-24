import Image from "next/image";
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  Activity,
  ArrowUpRight,
  Plus
} from "lucide-react";
import { createClient, createAdminClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import ClientGallery from "@/components/ClientGallery";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    // Check profile for redirection
    const adminSupabase = await createAdminClient();
    const { data: profile } = await adminSupabase
      .from('profiles')
      .select('role, gym_name')
      .eq('id', user.id)
      .single();

    const isManager = user.user_metadata?.role === 'manager' || profile?.role === 'manager';
    const hasFinishedSetup = !!profile?.gym_name;

    if (isManager) {
      return redirect('/dashboard');
    }

    if (!hasFinishedSetup) {
      return redirect('/signup/details');
    }

    return redirect('/admin-dashboard');
  }

  return (
    <div className="min-h-screen bg-[#010101] text-white selection:bg-white/10 selection:text-white">

      {/* Precision Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-[100] h-[80px] flex items-center bg-[#010101]/80 backdrop-blur-xl border-b border-white/[0.05]">
        <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between px-10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-white shadow-[0_0_40px_rgba(255,255,255,0.15)] transition-transform hover:scale-105">
              <Image
                src="/logo.png"
                alt="GymFlow Logo"
                width={40}
                height={40}
                className="h-full w-full object-contain p-1"
                priority
              />
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent">GymFlow</span>
          </div>

          <div className="hidden items-center gap-12 lg:flex">
            {['Architecture', 'Intelligence', 'Security', 'Enterprise'].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="text-[12px] font-bold text-zinc-500 hover:text-white transition-all tracking-[0.1em] uppercase">{item}</a>
            ))}
          </div>

          <div className="flex items-center gap-6">
            <a href="/login" className="text-[13px] font-bold text-zinc-500 hover:text-white transition-colors">SIGN IN</a>
            <a href="/signup" className="bg-white text-black px-7 py-2.5 rounded-full text-[13px] font-bold hover:bg-zinc-200 transition-all active:scale-95 shadow-2xl shadow-white/10 group flex items-center gap-2">
              GET STARTED
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>
        </div>
      </nav>

      <main className="flex flex-col items-center">

        {/* Cinematic Hero Section */}
        <section className="relative w-full min-h-screen flex flex-col items-center justify-center pt-[80px] pb-20 px-10 text-center">
          {/* Dynamic Background Elements */}
          <div className="absolute inset-0 -z-10 overflow-hidden bg-[#010101]">
            <div className="absolute inset-0 bg-gradient-to-b from-[#010101]/60 via-[#010101]/90 to-[#010101] z-10" />
            <Image
              src="/hero.png"
              alt="Elite Gym Environment"
              fill
              className="object-cover opacity-30 grayscale"
              priority
            />
          </div>

          {/* Elite Badge */}
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/[0.03] border border-white/[0.08] mb-12">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-500 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500"></span>
            </span>
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-[0.2em] px-1">Infrastructure for Elite Fitness</span>
            <div className="h-3 w-px bg-white/10" />
            <span className="text-[11px] font-bold text-white uppercase tracking-[0.1em] flex items-center gap-1.5 px-1">
              v2.0 LIVE
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-[80px] font-medium tracking-tight leading-[1] mb-8">
            MANAGEMENT <br />
            <span className="text-white">SIMPLIFIED.</span>
          </h1>

          <p className="text-base sm:text-lg text-zinc-400 max-w-xl mx-auto font-medium leading-relaxed mb-12">
            Orchestrate your gym&apos;s growth with our ultra-precise membership engine and automated local payment protocols.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <a href="/signup" className="w-full sm:w-auto bg-white text-black px-10 py-4 rounded-2xl font-bold text-[14px] hover:bg-white/90 transition-all active:scale-[0.98] shadow-[0_0_40px_rgba(255,255,255,0.1)] flex items-center justify-center gap-2">
              Launch Workspace
            </a>
            <a href="/signup" className="w-full sm:w-auto bg-white/[0.03] border border-white/[0.1] text-white px-10 py-4 rounded-2xl font-bold text-[14px] hover:bg-white/[0.06] transition-all flex items-center justify-center gap-2">
              View Blueprint
            </a>
          </div>

          {/* Global Infrastructure Visualization */}
          <div className="mt-16 w-full max-w-[900px] perspective-1000">
            <div className="relative group p-1 rounded-[32px] bg-gradient-to-b from-white/[0.1] to-transparent shadow-2xl transition-all duration-1000 transform hover:rotate-x-1 hover:scale-[1.01]">
              <div className="relative overflow-hidden rounded-[28px] bg-[#050505] border border-white/[0.05] aspect-[16/9] flex items-center justify-center">

                {/* VertexGuard Inspired High-Fidelity UI Preview */}
                <div className="relative w-full h-full flex bg-[#0B0C14] overflow-hidden text-white font-sans text-left">

                  {/* Subtle Sidebar */}
                  <div className="w-16 md:w-32 border-r border-white/5 p-4 flex flex-col gap-6 bg-[#0E0F19]">
                    <div className="h-4 w-full bg-purple-500/20 rounded-lg mb-4" />
                    {[1, 2, 3, 4, 5].map(i => (
                      <div key={i} className="flex flex-col gap-1.5">
                        <div className="h-1 w-full bg-white/5 rounded-full" />
                        {i === 1 && <div className="h-1 w-2/3 bg-purple-500/40 rounded-full" />}
                      </div>
                    ))}
                  </div>

                  {/* Main Dashboard Content */}
                  <div className="flex-1 p-6 flex flex-col gap-6 overflow-hidden">
                    {/* Header Row */}
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col gap-1.5">
                        <div className="h-3 w-32 bg-white/10 rounded-full" />
                        <div className="h-1.5 w-48 bg-white/5 rounded-full" />
                      </div>
                      <div className="flex gap-3">
                        <div className="h-7 w-7 rounded-full bg-white/5 border border-white/5" />
                        <div className="h-7 w-7 rounded-full bg-white/5 border border-white/5" />
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { label: 'Active Members', val: '1,284', color: 'bg-purple-500' },
                        { label: 'Revenue', val: '$12.4k', color: 'bg-blue-500' },
                        { label: 'Retention', val: '98.2%', color: 'bg-orange-500' },
                        { label: 'Growth', val: '+24%', color: 'bg-cyan-500' }
                      ].map((stat, i) => (
                        <div key={i} className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 flex flex-col gap-2 relative overflow-hidden group/card hover:bg-white/[0.05] transition-colors">
                          <div className={`h-5 w-5 rounded-lg ${stat.color}/20 flex items-center justify-center`}>
                            <div className={`h-1 w-1 rounded-full ${stat.color}`} />
                          </div>
                          <div className="text-[8px] text-zinc-500 uppercase font-black tracking-widest">{stat.label}</div>
                          <div className="text-base font-bold tracking-tight">{stat.val}</div>
                        </div>
                      ))}
                    </div>

                    {/* Charts Row */}
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 min-h-0">
                      {/* Line Chart Section */}
                      <div className="md:col-span-2 bg-white/[0.02] border border-white/5 rounded-3xl p-6 flex flex-col gap-6 relative overflow-hidden shadow-inner">
                        <div className="flex items-center justify-between z-10">
                          <div className="text-[9px] font-black text-zinc-400 uppercase tracking-widest text-shadow-sm">Infrastructure Flow</div>
                          <div className="h-5 w-14 bg-white/5 rounded-lg border border-white/5" />
                        </div>
                        {/* Abstract Graph Path */}
                        <div className="flex-1 relative mt-4">
                          <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 500 100">
                            <path
                              d="M0 80 Q 50 10, 100 60 T 200 30 T 300 70 T 400 20 T 500 50"
                              fill="none"
                              stroke="rgb(168, 85, 247)"
                              strokeWidth="3"
                              className="opacity-60"
                            />
                            <path
                              d="M0 80 Q 50 10, 100 60 T 200 30 T 300 70 T 400 20 T 500 50 V100 H0 Z"
                              fill="url(#grad2)"
                              className="opacity-10"
                            />
                            <defs>
                              <linearGradient id="grad2" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="rgb(168, 85, 247)" stopOpacity="1" />
                                <stop offset="100%" stopColor="rgb(168, 85, 247)" stopOpacity="0" />
                              </linearGradient>
                            </defs>
                          </svg>
                        </div>
                      </div>

                      {/* Circular Progress Section */}
                      <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 flex flex-col items-center justify-center gap-6">
                        <div className="relative h-24 w-24">
                          <svg className="h-full w-full rotate-[-90deg]">
                            <circle cx="48" cy="48" r="40" fill="none" stroke="currentColor" strokeWidth="5" className="text-white/5" />
                            <circle cx="48" cy="48" r="40" fill="none" stroke="currentColor" strokeWidth="7" strokeDasharray="251" strokeDashoffset="60" className="text-blue-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.3)]" />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <div className="text-xl font-bold tracking-tighter">741</div>
                            <div className="text-[6px] text-zinc-500 uppercase font-black tracking-widest">Gym Flow Score</div>
                          </div>
                        </div>
                        <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-[8px] font-black text-blue-400 tracking-widest uppercase">Elite Status</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute inset-x-0 bottom-0 h-[30%] bg-gradient-to-t from-[#010101] via-transparent to-transparent pointer-events-none" />
              </div>
            </div>
          </div>
        </section>

        {/* The Bento Grid Feature Section */}
        <section id="architecture" className="w-full max-w-[1400px] px-10 py-40">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Large Featured Card */}
            <div className="md:col-span-2 cauras-card p-12 flex flex-col justify-between overflow-hidden group min-h-[500px]">
              <div className="relative z-10">
                <div className="h-14 w-14 bg-white/[0.03] border border-white/[0.08] rounded-2xl flex items-center justify-center mb-8 text-white group-hover:bg-white group-hover:text-black transition-all">
                  <Zap className="h-7 w-7" />
                </div>
                <h3 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Automated Billing <br /> Protocol</h3>
                <p className="text-lg text-zinc-500 max-w-md font-medium leading-relaxed group-hover:text-zinc-300 transition-colors">
                  Eliminate manual tracking. Our engine calculates subscriptions and triggers Paystack links directly to member devices.
                </p>
              </div>
              <div className="mt-8 flex items-center gap-4 py-3 px-5 bg-white/[0.03] border border-white/5 rounded-2xl w-fit">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest leading-none">99.9% Sync Accuracy</span>
              </div>
              <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity pointer-events-none">
                <ShieldCheck className="h-[400px] w-[400px] translate-x-32 -translate-y-32" />
              </div>
            </div>

            {/* Vertical Small Card */}
            <div className="cauras-card p-10 bg-gradient-to-br from-white/[0.04] to-transparent flex flex-col justify-between group">
              <div>
                <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center mb-10 shadow-2xl shadow-white/10">
                  <Plus className="h-6 w-6 text-black" />
                </div>
                <h3 className="text-2xl font-bold mb-4 tracking-tight">Rapid <br /> Onboarding</h3>
                <p className="text-[14px] text-zinc-500 font-medium leading-relaxed group-hover:text-zinc-300 transition-colors">
                  Register new athletes in under 12 seconds with our optimized entry system.
                </p>
              </div>
              <div className="pt-8 border-t border-white/5 flex items-center justify-between">
                <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Entry Time</span>
                <span className="text-lg font-bold">12s</span>
              </div>
            </div>

            {/* Vertical Small Card 2 */}
            <div className="cauras-card p-10 flex flex-col justify-between group">
              <div>
                <div className="h-12 w-12 bg-white/[0.03] border border-white/[0.08] rounded-2xl flex items-center justify-center mb-10 group-hover:bg-white group-hover:text-black transition-all">
                  <Activity className="h-6 w-6 text-zinc-500 group-hover:text-black" />
                </div>
                <h3 className="text-2xl font-bold mb-4 tracking-tight">Health <br /> Diagnostics</h3>
                <p className="text-[14px] text-zinc-500 font-medium leading-relaxed">
                  Monitor membership retention and financial health in one single, high-fidelity view.
                </p>
              </div>
              <div className="pt-8 border-t border-white/5">
                <div className="flex gap-2">
                  {[1, 1, 1, 2, 3, 2, 1].map((h, i) => (
                    <div key={i} className={`flex-1 rounded-sm transition-all duration-700 ${i === 6 ? 'bg-primary h-8' : 'bg-white/10'}`} style={{ height: `${h * 8}px` }} />
                  ))}
                </div>
              </div>
            </div>

            {/* Medium Card */}
            <div className="md:col-span-2 cauras-card p-12 bg-[#050505] overflow-hidden group">
              <div className="flex flex-col md:flex-row gap-12 items-center">
                <div className="flex-1 space-y-6">
                  <h3 className="text-3xl font-bold tracking-tight">Intelligence for <br /> Decision Makers</h3>
                  <p className="text-[15px] text-zinc-500 font-medium leading-relaxed">
                    From monthly growth archives to live revenue stream monitoring, every detail is captured.
                  </p>
                  <button className="text-[13px] font-bold text-white flex items-center gap-2 group/btn">
                    Explore Analytics <ArrowUpRight className="h-4 w-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                  </button>
                </div>
                <div className="flex-1 w-full p-6 bg-white/[0.02] border border-white/[0.05] rounded-3xl group-hover:bg-white/[0.04] transition-all">
                  <div className="space-y-4">
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full w-2/3 bg-white transition-all duration-1000 group-hover:w-full" />
                    </div>
                    <div className="h-2 w-3/4 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full w-1/2 bg-white/40 transition-all duration-1000 group-hover:w-3/4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <ClientGallery />

        {/* The Impact Quote Section */}
        <section className="w-full max-w-5xl px-10 py-60 text-center">
          <p className="text-[11px] font-bold text-primary uppercase tracking-[0.4em] mb-12">Performance Standard</p>
          <h2 className="text-4xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-20 italic">
            &quot;GymFlow didn&apos;t just automate my business; it redefined the way my athletes interact with our technology.&quot;
          </h2>
          <div className="flex flex-col items-center">
            <div className="h-16 w-16 rounded-full bg-white/[0.05] border border-white/10 mb-6" />
            <p className="text-[14px] font-bold tracking-widest uppercase">Marcus Thorne</p>
            <p className="text-[12px] font-medium text-zinc-600 uppercase tracking-widest mt-1">Founder, Apex Fitness Labs</p>
          </div>
        </section>

        {/* Global Conversion Card */}
        <section className="w-full max-w-[1400px] px-10 py-40">
          <div className="cauras-card relative overflow-hidden bg-gradient-to-b from-white/[0.06] to-transparent p-20 md:p-40 text-center border-white/[0.1]">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-full bg-white/[0.03] blur-[120px] rounded-full -z-10" />

            <h2 className="text-6xl md:text-[120px] font-bold tracking-tighter leading-none mb-16">
              SCALE <br /> BEYOND.
            </h2>

            <p className="text-xl text-zinc-500 max-w-2xl mx-auto font-medium mb-16">
              Join the next generation of gym owners moving away from manual work and towards autonomous growth.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <a href="/signup" className="bg-white text-black px-12 py-5 rounded-2xl font-bold text-[17px] hover:bg-zinc-200 transition-all active:scale-95 shadow-3xl shadow-white/10">
                Launch Free Workspace
              </a>
              <button className="text-[15px] font-bold text-zinc-500 hover:text-white transition-all flex items-center gap-2 group">
                Consult with Architect <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </section>

      </main>

      {/* Corporate Footer */}
      <footer className="border-t border-white/5 px-10 py-32 bg-[#010101]">
        <div className="mx-auto flex flex-col md:flex-row max-w-[1400px] justify-between gap-20">

          <div className="max-w-sm space-y-10">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-white">
                <Image
                  src="/logo.png"
                  alt="GymFlow Logo"
                  width={36}
                  height={36}
                  className="h-full w-full object-contain p-0.5"
                />
              </div>
              <span className="text-xl font-bold tracking-tight">GymFlow</span>
            </div>
            <p className="text-[15px] text-zinc-500 font-medium leading-relaxed">
              The infrastructure layer for modern fitness entrepreneurs. Designed in Nigeria for the global performance standard.
            </p>
            <div className="flex items-center gap-6 grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all">
              <div className="h-6 w-24 bg-zinc-800 rounded-lg" />
              <div className="h-6 w-24 bg-zinc-800 rounded-lg" />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-16">
            {[
              { title: 'Protocol', links: ['Cloud Sync', 'Edge Security', 'API'] },
              { title: 'Enterprise', links: ['Multi-Branch', 'Custom Audit', 'SLA'] },
              { title: 'Resources', links: ['Academy', 'Blueprints', 'Community'] },
              { title: 'Legal', links: ['Sovereignty', 'Terms', 'Privacy'] },
            ].map((col) => (
              <div key={col.title} className="space-y-8">
                <h4 className="text-[11px] font-bold text-zinc-700 uppercase tracking-[0.2em]">{col.title}</h4>
                <ul className="space-y-5">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-[13px] font-bold text-zinc-500 hover:text-white transition-colors tracking-tight">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mx-auto max-w-[1400px] mt-32 pt-12 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-4 text-[12px] font-bold text-zinc-700 uppercase tracking-[0.1em]">
            <span>Status: Operational</span>
            <div className="h-1 w-1 rounded-full bg-green-500" />
            <span>Uptime: 99.99%</span>
          </div>
          <p className="text-[12px] font-bold text-zinc-800 uppercase tracking-widest leading-none">© 2026 GymFlow Infrastructure Inc.</p>
        </div>
      </footer>

    </div>
  );
}
