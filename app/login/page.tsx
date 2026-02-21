import { login, signup } from './actions'
import Image from 'next/image'

export default function LoginPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-black px-6">
            <div className="w-full max-w-md space-y-8 rounded-[2rem] border border-white/10 bg-zinc-900/50 p-10 backdrop-blur-xl">
                <div className="text-center">
                    <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-2xl">
                        <Image
                            src="/logo.png"
                            alt="Gym CRM Logo"
                            width={96}
                            height={96}
                            className="h-full w-full object-contain"
                            priority
                        />
                    </div>
                    <h2 className="text-3xl font-black tracking-tighter">Welcome to Gym CRM</h2>
                    <p className="mt-2 text-zinc-500 font-medium">Please sign in to your account</p>
                </div>

                <form className="mt-8 space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-bold text-zinc-400 uppercase tracking-widest mb-2 px-1">
                                Email Address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="block w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-zinc-600 focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
                                placeholder="you@example.com"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-bold text-zinc-400 uppercase tracking-widest mb-2 px-1">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="block w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-zinc-600 focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 pt-2">
                        <button
                            formAction={login}
                            className="w-full rounded-full bg-white px-6 py-4 text-sm font-black text-black hover:bg-zinc-200 transition-all active:scale-95 shadow-xl shadow-white/5"
                        >
                            Log in
                        </button>
                        <button
                            formAction={signup}
                            className="w-full rounded-full border border-white/10 bg-white/5 px-6 py-4 text-sm font-black text-white hover:bg-white/10 transition-all active:scale-95"
                        >
                            Sign up
                        </button>
                    </div>
                </form>

                <p className="text-center text-xs text-zinc-600 font-medium mt-6">
                    By signing in, you agree to our Terms of Service.
                </p>
            </div>
        </div>
    )
}
