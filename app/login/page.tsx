import { login } from './actions'
import Image from 'next/image'
import { ShieldCheck, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function LoginPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-[#010101] px-6 selection:bg-white/10 selection:text-white">
            <Link
                href="/"
                className="absolute top-6 left-6 md:top-10 md:left-10 flex items-center gap-2 text-[10px] md:text-[11px] font-bold text-zinc-500 hover:text-white transition-colors uppercase tracking-widest z-[110]"
            >
                <ArrowLeft className="h-3.5 w-3.5 md:h-4 md:w-4" />
                Back to homepage
            </Link>
            <div className="w-full max-w-sm">
                <div className="text-center mb-12">
                    <Link href="/" className="mx-auto mb-8 flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-[0_0_30px_rgba(255,255,255,0.1)] transition-transform hover:scale-105 active:scale-95">
                        <Image
                            src="/logo.png"
                            alt="Gym CRM Logo"
                            width={56}
                            height={56}
                            className="h-full w-full object-contain"
                            priority
                        />
                    </Link>
                    <h2 className="text-3xl font-bold tracking-tight mb-2">GymFlow Entry</h2>
                    <p className="text-[14px] text-zinc-500 font-medium">Owners & Managers: Authenticate to access workspace</p>
                </div>

                <form className="space-y-8">
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-[11px] font-bold text-zinc-600 uppercase tracking-widest mb-2 px-1">
                                Corporate Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="cauras-input block w-full px-5 py-3.5 text-[14px] outline-none"
                                placeholder="name@company.com"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-[11px] font-bold text-zinc-600 uppercase tracking-widest mb-2 px-1">
                                Access Key
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="cauras-input block w-full px-5 py-3.5 text-[14px] outline-none"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <div className="space-y-4 pb-2">
                        <button
                            formAction={login}
                            className="w-full bg-white text-black py-4 rounded-2xl font-bold text-[14px] hover:bg-zinc-200 transition-all active:scale-[0.98] shadow-xl shadow-white/5"
                        >
                            Sign In
                        </button>
                        <p className="text-center text-[12px] text-zinc-500 font-medium">
                            New Gym Owner?{' '}
                            <Link href="/signup" className="text-white hover:underline">
                                Register Workspace
                            </Link>
                        </p>
                    </div>
                </form>

                <div className="mt-12 pt-8 border-t border-white/[0.04] space-y-4">
                    <div className="flex items-center justify-center gap-2 text-zinc-700">
                        <ShieldCheck className="h-4 w-4" />
                        <span className="text-[11px] font-bold uppercase tracking-widest">End-to-End Encrypted</span>
                    </div>
                    <p className="text-center text-[10px] font-bold text-zinc-800 uppercase tracking-[0.2em]">
                        Developed in Ghana • Serving Africa
                    </p>
                </div>
            </div>
        </div>
    )
}
