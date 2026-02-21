import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-primary/30">

      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-[100] border-b border-white/5 bg-black/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg bg-white shadow-lg">
              <Image
                src="/logo.png"
                alt="Gym CRM Logo"
                width={40}
                height={40}
                className="h-full w-full object-contain"
                priority
              />
            </div>
            <span className="text-xl font-bold tracking-tighter sm:text-2xl">Gym CRM</span>
          </div>

          <div className="hidden items-center gap-10 md:flex">
            <a href="#features" className="text-sm font-semibold text-zinc-400 hover:text-white transition-colors">Features</a>
            <a href="#benefits" className="text-sm font-semibold text-zinc-400 hover:text-white transition-colors">Benefits</a>
            <a href="#pricing" className="text-sm font-semibold text-zinc-400 hover:text-white transition-colors">Pricing</a>
          </div>

          <div className="flex items-center gap-5">
            <a href="/login" className="hidden text-sm font-semibold text-zinc-400 hover:text-white transition-colors lg:block">Log in</a>
            <a href="/login" className="rounded-full bg-white px-6 py-2.5 text-sm font-bold text-black hover:bg-zinc-200 transition-all active:scale-95">
              Start Building
            </a>
          </div>
        </div>
      </nav>

      <main className="flex flex-col items-center overflow-x-hidden">

        {/* Hero Section - Fixed Visibility */}
        <section className="relative flex w-full flex-col items-center px-6 pt-56 pb-24 text-center sm:pt-64 md:pt-72 lg:pt-80">
          {/* Background Ambient Glows */}
          <div className="absolute top-[10%] left-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-primary/20 blur-[130px]" />
          <div className="absolute top-[30%] right-0 -z-10 h-[400px] w-[400px] rounded-full bg-secondary/10 blur-[120px]" />

          {/* Badge */}
          <div className="mb-10 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[12px] font-bold uppercase tracking-widest text-zinc-300 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
            </span>
            Integrated with Paystack
          </div>

          {/* Headline */}
          <h1 className="mb-10 max-w-6xl px-4 text-5xl font-black leading-[1.05] tracking-tight sm:text-7xl lg:text-9xl">
            Automate your Gym <br />
            <span className="bg-gradient-to-r from-primary via-white to-secondary bg-clip-text text-transparent italic">
              Experience.
            </span>
          </h1>

          {/* Subtext */}
          <p className="mb-14 max-w-3xl px-4 text-lg font-medium leading-relaxed text-zinc-400 sm:text-xl lg:text-2xl">
            The all-in-one CRM to track memberships, automate Paystack payment links, and grow your community without the manual work.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col items-center gap-5 px-4 sm:flex-row">
            <a href="/login" className="w-full rounded-full bg-primary px-10 py-5 text-lg font-black text-white shadow-2xl shadow-primary/30 transition-all hover:scale-105 hover:bg-primary/90 active:scale-95 sm:w-auto">
              Get Started for Free
            </a>
            <a href="/login" className="w-full rounded-full border border-white/10 bg-white/5 px-10 py-5 text-lg font-black text-white backdrop-blur-md transition-all hover:bg-white/10 active:scale-95 sm:w-auto">
              Schedule a Demo
            </a>
          </div>

          {/* Hero Image - Dashboard Preview */}
          <div className="mt-32 w-full max-w-6xl px-4">
            <div className="relative group p-2 rounded-[2.5rem] border border-white/10 bg-zinc-900 shadow-2xl transition-transform hover:scale-[1.01] duration-700">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary opacity-20 blur-2xl transition-opacity group-hover:opacity-30 rounded-[2.5rem]" />
              <div className="relative overflow-hidden rounded-[2rem]">
                <Image
                  src="/dashboard.png"
                  alt="Gym CRM Dashboard"
                  width={1400}
                  height={900}
                  className="w-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-700"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* Feature Grid Section */}
        <section id="features" className="max-w-7xl px-8 py-32 sm:py-48">
          <div className="mb-24 flex flex-col items-center text-center">
            <h2 className="mb-8 text-4xl font-black sm:text-6xl">Powerful Automation.</h2>
            <p className="max-w-2xl text-lg font-medium text-zinc-500 sm:text-xl">
              Focus on training your members while our CRM handles the administrative heavy lifting.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
            {[
              {
                title: "Smart Tracking",
                desc: "Automatically calculate expiry dates based on registration and plan type. Never miss a renewal again.",
                icon: "⚡",
                color: "bg-blue-500/10 text-blue-400"
              },
              {
                title: "Paystack Links",
                desc: "Generate secure payment links automatically. Members pay directly from their reminder messages.",
                icon: "�",
                color: "bg-purple-500/10 text-purple-400"
              },
              {
                title: "Active Broadcasts",
                desc: "Send personalized announcements, holiday hours, or new class schedules to your entire community.",
                icon: "�",
                color: "bg-accent/10 text-accent"
              }
            ].map((f, i) => (
              <div key={i} className="group rounded-[2rem] border border-white/5 bg-zinc-900/30 p-10 transition-all hover:border-white/10 hover:bg-zinc-900/50">
                <div className={`mb-8 flex h-16 w-16 items-center justify-center rounded-2xl text-3xl shadow-lg transition-transform group-hover:scale-110 ${f.color}`}>
                  {f.icon}
                </div>
                <h3 className="mb-5 text-2xl font-bold">{f.title}</h3>
                <p className="text-lg leading-relaxed text-zinc-500 transition-colors group-hover:text-zinc-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Impact Section - Fixed Alignment */}
        <section id="benefits" className="w-full max-w-7xl px-8 py-32 sm:py-48">
          <div className="grid grid-cols-1 items-center gap-20 lg:grid-cols-2">
            <div className="order-2 lg:order-1">
              <div className="relative overflow-hidden rounded-[3rem] border border-white/10 shadow-3xl">
                <Image
                  src="/hero.png"
                  alt="Modern Gym"
                  width={800}
                  height={600}
                  className="w-full object-cover transition-transform duration-[3s] hover:scale-110"
                />
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="mb-10 text-4xl font-black leading-tight sm:text-6xl">Defined for the <br /> modern gym owner.</h2>
              <p className="mb-12 text-xl font-medium text-zinc-400 leading-relaxed">
                We've combined decades of fitness management experience with state-of-the-art technology to build a CRM that actually works.
              </p>
              <div className="space-y-6">
                {[
                  "90%+ on-time renewal rates with automated alerts",
                  "Secure Paystack integration",
                  "Mobile-responsive dashboard for management on the go",
                  "Daily automated overdue reminders"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/20 text-primary">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    <span className="text-lg font-bold text-zinc-200">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Global CTA Section */}
        <section className="w-full max-w-7xl px-8 py-40">
          <div className="relative overflow-hidden rounded-[4rem] bg-gradient-to-br from-primary via-secondary to-accent p-12 text-center md:p-32 shadow-3xl">
            <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]" />
            <div className="relative z-10">
              <h2 className="mb-10 text-5xl font-black tracking-tighter sm:text-8xl">Stop chasing, <br /> start scaling.</h2>
              <p className="mb-14 mx-auto max-w-2xl text-xl font-medium text-white/90">
                Join hundreds of fitness entrepreneurs who have automated their membership management today.
              </p>
              <button className="rounded-full bg-white px-12 py-6 text-xl font-black text-black shadow-2xl transition-all hover:scale-105 active:scale-95">
                Launch Gym CRM Now
              </button>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 px-8 py-20 bg-zinc-950/50">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-between gap-10 md:flex-row">
            <div className="flex items-center gap-3">
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
            <p className="text-sm font-bold uppercase tracking-widest text-zinc-500">© 2026 Gym CRM Inc. All rights reserved.</p>
            <div className="flex gap-8 text-sm font-bold text-zinc-400">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
