import { updateProfile } from '../../login/actions'
import Image from 'next/image'
import { ShieldCheck } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function DetailsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return redirect('/login')
    }

    // Check if setup is already finished
    const { data: profile } = await supabase
        .from('profiles')
        .select('gym_name, role')
        .eq('id', user.id)
        .single()

    if (profile?.gym_name) {
        if (profile.role === 'manager') {
            return redirect('/dashboard')
        }
        return redirect('/admin-dashboard')
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#010101] px-6 selection:bg-white/10 selection:text-white">
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
                    <h2 className="text-3xl font-bold tracking-tight mb-2">Finalize Setup</h2>
                    <p className="text-[14px] text-zinc-500 font-medium">Configure your administrative profile</p>
                </div>

                <form className="space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="fullName" className="block text-[11px] font-bold text-zinc-600 uppercase tracking-widest mb-2 px-1">
                                Full Name
                            </label>
                            <input
                                id="fullName"
                                name="fullName"
                                type="text"
                                required
                                className="cauras-input block w-full px-5 py-3.5 text-[14px] outline-none"
                                placeholder="Marcus Thorne"
                            />
                        </div>
                        <div>
                            <label htmlFor="gymName" className="block text-[11px] font-bold text-zinc-600 uppercase tracking-widest mb-2 px-1">
                                Gym / Organization Name
                            </label>
                            <input
                                id="gymName"
                                name="gymName"
                                type="text"
                                required
                                className="cauras-input block w-full px-5 py-3.5 text-[14px] outline-none"
                                placeholder="Apex Fitness Labs"
                            />
                        </div>
                        <div>
                            <label htmlFor="phone" className="block text-[11px] font-bold text-zinc-600 uppercase tracking-widest mb-2 px-1">
                                Personal Phone Number
                            </label>
                            <input
                                id="phone"
                                name="phone"
                                type="tel"
                                required
                                className="cauras-input block w-full px-5 py-3.5 text-[14px] outline-none"
                                placeholder="+234 ..."
                            />
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            formAction={updateProfile}
                            className="w-full bg-white text-black py-4 rounded-2xl font-bold text-[14px] hover:bg-zinc-200 transition-all active:scale-[0.98] shadow-xl shadow-white/5"
                        >
                            Activate Workspace
                        </button>
                    </div>
                </form>

                <div className="mt-12 pt-8 border-t border-white/[0.04]">
                    <div className="flex items-center justify-center gap-2 text-zinc-700">
                        <ShieldCheck className="h-4 w-4" />
                        <span className="text-[11px] font-bold uppercase tracking-widest">Ownership Verified</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
