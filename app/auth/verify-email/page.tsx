'use client'

import Link from 'next/link'
import { Mail, ArrowLeft, RefreshCw, CheckCircle2 } from 'lucide-react'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { resendVerificationEmail } from '@/app/login/actions'

function VerifyEmailContent() {
    const searchParams = useSearchParams()
    const email = searchParams.get('email')

    const [countdown, setCountdown] = useState(0)
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
    const [errorMessage, setErrorMessage] = useState('')

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
            return () => clearTimeout(timer)
        }
    }, [countdown])

    const handleResend = async () => {
        if (!email) return
        setLoading(true)
        setStatus('idle')
        try {
            await resendVerificationEmail(email)
            setStatus('success')
            setCountdown(60)
        } catch (error: any) {
            setStatus('error')
            setErrorMessage(error.message || 'Failed to resend verification email.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="w-full max-w-md text-center">
            <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-500/10 border border-blue-500/20 text-blue-500 animate-in zoom-in duration-500">
                <Mail className="h-10 w-10" />
            </div>

            <h2 className="text-3xl font-bold tracking-tight mb-4">Verification Sent</h2>

            <div className="bg-white/[0.03] border border-white/5 p-6 rounded-2xl mb-8 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <p className="text-zinc-400 text-[14px] font-medium leading-relaxed relative z-10">
                    We have sent a verification link to {email ? <span className="text-white font-bold">{email}</span> : "your email address"}.
                    Please click the link to initialize your identity and proceed with the gym setup.
                </p>
            </div>

            <div className="space-y-4">
                {status === 'success' && (
                    <div className="flex items-center gap-2 justify-center p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-[12px] font-bold uppercase tracking-widest animate-in fade-in slide-in-from-top-2">
                        <CheckCircle2 className="h-4 w-4" />
                        Verification link resent successfully
                    </div>
                )}

                {status === 'error' && (
                    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-[12px] font-bold">
                        {errorMessage}
                    </div>
                )}

                <button
                    onClick={handleResend}
                    disabled={loading || countdown > 0 || !email}
                    className="flex w-full items-center justify-center gap-2 bg-white/[0.03] border border-white/10 text-white py-4 rounded-2xl font-bold text-[14px] hover:bg-white/[0.06] transition-all active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed group"
                >
                    {loading ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                        <RefreshCw className={`h-4 w-4 ${countdown > 0 ? '' : 'group-hover:rotate-180'} transition-transform duration-500`} />
                    )}
                    {countdown > 0 ? `Resend in ${countdown}s` : 'Resend Verification Email'}
                </button>

                <Link
                    href="/login"
                    className="flex w-full items-center justify-center gap-2 bg-white text-black py-4 rounded-2xl font-bold text-[14px] hover:bg-zinc-200 transition-all active:scale-[0.98] shadow-xl shadow-white/5"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Protocol
                </Link>

                <div className="pt-4">
                    <p className="text-[11px] text-zinc-600 font-bold uppercase tracking-[0.2em] mb-1">
                        Deployment Tip
                    </p>
                    <p className="text-[12px] text-zinc-500 font-medium leading-relaxed">
                        If you don&apos;t see the email within 2 minutes, check your <span className="text-zinc-400">Junk or Spam</span> folder as it might be flagged by security protocols.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default function VerifyEmailPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-[#010101] px-6">
            <Suspense fallback={<div className="text-white font-bold animate-pulse uppercase tracking-widest text-xs">Initializing Secure Channel...</div>}>
                <VerifyEmailContent />
            </Suspense>
        </div>
    )
}
