'use client'
import Link from 'next/link'
import { AlertCircle, ArrowLeft } from 'lucide-react'
import { use } from 'react'

export default function ErrorPage({
    searchParams,
}: {
    searchParams: Promise<{ message?: string }>
}) {
    const params = use(searchParams)
    const errorMessage = params.message || "The requested operation could not be completed. This is likely due to a missing database column (e.g., gym_name) or a connection timeout."

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#010101] px-6">
            <div className="w-full max-w-md text-center">
                <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-3xl bg-red-500/10 border border-red-500/20 text-red-500">
                    <AlertCircle className="h-10 w-10" />
                </div>

                <h2 className="text-3xl font-bold tracking-tight mb-4">System Interruption</h2>
                <div className="bg-white/[0.03] border border-white/5 p-6 rounded-2xl mb-12">
                    <p className="text-zinc-400 text-[14px] font-medium leading-relaxed">
                        {errorMessage}
                    </p>
                </div>

                <div className="space-y-4">
                    <Link
                        href="/login"
                        className="flex w-full items-center justify-center gap-2 bg-white text-black py-4 rounded-2xl font-bold text-[14px] hover:bg-zinc-200 transition-all active:scale-[0.98]"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Login
                    </Link>
                    <p className="text-[12px] text-zinc-600 font-medium">
                        If you are the developer, check the server console for the specific error trace.
                    </p>
                </div>
            </div>
        </div>
    )
}
