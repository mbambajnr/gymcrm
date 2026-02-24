'use client'

import React, { useState, useEffect } from 'react'
import { X, ShieldCheck, AlertCircle } from 'lucide-react'
import { updateManager } from '@/app/admin-dashboard/actions'

interface EditManagerModalProps {
    isOpen: boolean
    onClose: () => void
    manager: {
        id: string
        name: string | null
        phone: string | null
        email: string | null
    } | null
}

export default function EditManagerModal({ isOpen, onClose, manager }: EditManagerModalProps) {
    const [fullName, setFullName] = useState('')
    const [phone, setPhone] = useState('')
    const [isUpdating, setIsUpdating] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (manager) {
            setFullName(manager.name || '')
            setPhone(manager.phone || '')
        }
    }, [manager])

    if (!isOpen || !manager) return null

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsUpdating(true)
        setError(null)

        try {
            const result = await updateManager(manager.id, { fullName, phone })
            if (result.success) {
                onClose()
            } else {
                setError(result.message)
            }
        } catch {
            setError('A critical system error occurred.')
        } finally {
            setIsUpdating(false)
        }
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <div
                className="absolute inset-0 bg-[#010101]/80 backdrop-blur-md animate-in fade-in duration-300"
                onClick={onClose}
            />

            <div className="relative w-full max-w-md overflow-hidden rounded-[32px] bg-[#050505] border border-white/5 shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-in zoom-in-95 duration-300">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

                <div className="p-8">
                    <div className="mb-8 flex items-center justify-between">
                        <div className="h-12 w-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                            <ShieldCheck className="h-6 w-6" />
                        </div>
                        <button
                            onClick={onClose}
                            className="h-10 w-10 rounded-xl hover:bg-white/5 flex items-center justify-center text-zinc-500 transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="space-y-2 mb-8">
                        <h2 className="text-2xl font-bold tracking-tight">Edit Node Profile</h2>
                        <p className="text-[14px] text-zinc-500 font-medium leading-relaxed">
                            Updating authorization details for <span className="text-white">{manager.email}</span>
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-[11px] font-bold text-zinc-600 uppercase tracking-widest mb-2 px-1">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="cauras-input block w-full px-5 py-3.5 text-[14px] outline-none"
                                    placeholder="Marcus Thorne"
                                />
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold text-zinc-600 uppercase tracking-widest mb-2 px-1">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    required
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="cauras-input block w-full px-5 py-3.5 text-[14px] outline-none"
                                    placeholder="+233 XX XXX XXXX"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="flex items-center gap-3 rounded-2xl bg-red-500/10 border border-red-500/20 p-4 text-red-500">
                                <AlertCircle className="h-5 w-5 shrink-0" />
                                <p className="text-[13px] font-bold tracking-tight">{error}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isUpdating}
                            className="w-full bg-white text-black px-8 py-4 rounded-2xl font-bold text-[14px] hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-xl shadow-white/5"
                        >
                            {isUpdating ? (
                                <div className="h-4 w-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                            ) : (
                                'Save Changes'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
