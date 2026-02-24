'use client'

import React, { useState } from 'react'
import { AlertCircle, ShieldAlert, X } from 'lucide-react'
import { deactivateManager } from '@/app/admin-dashboard/actions'

interface DeactivateManagerModalProps {
    isOpen: boolean
    onClose: () => void
    manager: {
        id: string
        name: string | null
        email: string | null
    } | null
}

export default function DeactivateManagerModal({ isOpen, onClose, manager }: DeactivateManagerModalProps) {
    const [isDeleting, setIsDeleting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    if (!isOpen || !manager) return null

    const handleDeactivate = async () => {
        setIsDeleting(true)
        setError(null)
        try {
            const result = await deactivateManager(manager.id)
            if (result.success) {
                onClose()
            } else {
                setError(result.message)
            }
        } catch {
            setError('A critical system error occurred. Please try again.')
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-[#010101]/80 backdrop-blur-md animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-md overflow-hidden rounded-[32px] bg-[#050505] border border-white/5 shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-in zoom-in-95 duration-300">
                {/* Header Decoration */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />

                <div className="p-8">
                    <div className="mb-8 flex items-center justify-between">
                        <div className="h-12 w-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500">
                            <ShieldAlert className="h-6 w-6" />
                        </div>
                        <button
                            onClick={onClose}
                            className="h-10 w-10 rounded-xl hover:bg-white/5 flex items-center justify-center text-zinc-500 transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="space-y-2 mb-8">
                        <h2 className="text-2xl font-bold tracking-tight">Deactivate Node?</h2>
                        <p className="text-[14px] text-zinc-500 font-medium leading-relaxed">
                            You are about to revoke administrative access for <span className="text-white font-bold">{manager.name || manager.email}</span>. This action is immediate and cannot be undone.
                        </p>
                    </div>

                    {error && (
                        <div className="mb-8 flex items-center gap-3 rounded-2xl bg-red-500/10 border border-red-500/20 p-4 text-red-500">
                            <AlertCircle className="h-5 w-5 shrink-0" />
                            <p className="text-[13px] font-bold tracking-tight">{error}</p>
                        </div>
                    )}

                    <div className="flex flex-col gap-3">
                        <button
                            onClick={handleDeactivate}
                            disabled={isDeleting}
                            className="w-full bg-red-500 text-white px-8 py-4 rounded-2xl font-bold text-[14px] hover:bg-red-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-red-500/10"
                        >
                            {isDeleting ? (
                                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                'Confirm Deactivation'
                            )}
                        </button>
                        <button
                            onClick={onClose}
                            disabled={isDeleting}
                            className="w-full bg-white/[0.03] border border-white/[0.08] text-white px-8 py-4 rounded-2xl font-bold text-[14px] hover:bg-white/[0.08] transition-all disabled:opacity-50"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
