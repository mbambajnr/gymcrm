import { signup } from '../login/actions'
import Image from 'next/image'
import { ShieldCheck, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function SignupPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-[#010101] px-6 selection:bg-white/10 selection:text-white">
            <Link
                href="/"
                className="absolute top-10 left-10 flex items-center gap-2 text-[11px] font-bold text-zinc-500 hover:text-white transition-colors uppercase tracking-widest"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to Protocol
            </Link>

            <div className="w-full max-w-sm">
                <div className="text-center mb-12">
                    <div className="mx-auto mb-8 flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                        <Image
                            src="/logo.png"
                            alt="Gym CRM Logo"
                            width={56}
                            height={56}
                            className="h-full w-full object-contain"
                            priority
                        />
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight mb-2">Owner Registration</h2>
                    <p className="text-[14px] text-zinc-500 font-medium">Initialize your gym&apos;s digital infrastructure</p>
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
                                Secure Access Key
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
                            formAction={signup}
                            className="w-full bg-white text-black py-4 rounded-2xl font-bold text-[14px] hover:bg-zinc-200 transition-all active:scale-[0.98] shadow-xl shadow-white/5"
                        >
                            Initialize Infrastructure
                        </button>
                        <p className="text-center text-[12px] text-zinc-500">
                            Already have an account?{' '}
                            <Link href="/login" className="text-white hover:underline">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </form>

                <div className="mt-12 pt-8 border-t border-white/[0.04]">
                    <div className="flex items-center justify-center gap-2 text-zinc-700">
                        <ShieldCheck className="h-4 w-4" />
                        <span className="text-[11px] font-bold uppercase tracking-widest">Enterprise Grade Security</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
