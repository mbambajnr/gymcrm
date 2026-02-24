'use client'

import React, { useState } from 'react'
import { X, User, Mail, Phone, Shield, ChevronRight, Key, ShieldCheck } from 'lucide-react'
import { createManager } from '../../app/admin-dashboard/actions'

interface AddManagerModalProps {
    isOpen: boolean
    onClose: () => void
}

export default function AddManagerModal({ isOpen, onClose }: AddManagerModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [tempPassword, setTempPassword] = useState('')
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
    })

    if (!isOpen) return null

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        console.log('Form submission started', formData)
        setIsSubmitting(true)
        try {
            const result = await createManager(formData)
            if (result.success) {
                setTempPassword(result.tempPassword || '')
            } else {
                alert(result.message || 'Failed to authorize manager.')
            }
        } catch (error) {
            console.error('Failed to create manager:', error)
            alert('A system error occurred. Please try again later.')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDone = () => {
        setTempPassword('')
        setFormData({ fullName: '', email: '', phone: '' })
        onClose()
    }

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[#010101]/95 backdrop-blur-md p-6">
            <div className="w-full max-w-4xl bg-[#080808] border border-white/5 rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-500">

                <div className="grid grid-cols-1 lg:grid-cols-5 min-h-[500px]">
                    {/* Left: Security Context */}
                    <div className="lg:col-span-2 p-12 bg-white/[0.02] border-r border-white/5 hidden lg:flex flex-col justify-between">
                        <div>
                            <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center mb-10 shadow-2xl shadow-white/20" />
                            <h2 className="text-3xl font-bold tracking-tight mb-6">Authorize <br /> Administration</h2>
                            <p className="text-[14px] text-zinc-500 font-medium leading-relaxed">
                                Identify and authorize a new Manager to oversee gym operations. This action creates a high-level access profile and logs the administrative event.
                            </p>
                        </div>

                        <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5">
                            <p className="text-[11px] font-bold text-zinc-600 uppercase tracking-widest mb-2">Security Note</p>
                            <p className="text-[12px] text-zinc-500 font-medium leading-relaxed italic">
                                "Credential generation is handled via secure hashing. Temporary codes expire after the first successful login."
                            </p>
                        </div>
                    </div>

                    {/* Right: Action Area */}
                    <div className="lg:col-span-3 p-12 relative flex flex-col justify-center">
                        {!tempPassword && (
                            <button
                                onClick={onClose}
                                className="absolute right-8 top-8 text-zinc-600 hover:text-white transition-colors h-10 w-10 flex items-center justify-center rounded-full hover:bg-white/5"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        )}

                        {!tempPassword ? (
                            <form onSubmit={handleSubmit} className="space-y-10 max-w-sm mx-auto w-full">
                                <div className="space-y-6">
                                    <div>
                                        <label className="text-[11px] font-bold text-zinc-600 uppercase tracking-widest mb-3 block">Manager Credentials</label>
                                        <div className="space-y-3">
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    required
                                                    disabled={isSubmitting}
                                                    className="cauras-input w-full py-4 px-6 text-[13px] outline-none"
                                                    placeholder="Legal Full Name"
                                                    value={formData.fullName}
                                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                                />
                                            </div>
                                            <div className="relative">
                                                <input
                                                    type="email"
                                                    required
                                                    disabled={isSubmitting}
                                                    className="cauras-input w-full py-4 px-6 text-[13px] outline-none"
                                                    placeholder="Corporate Email"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                />
                                            </div>
                                            <div className="relative">
                                                <input
                                                    type="tel"
                                                    required
                                                    disabled={isSubmitting}
                                                    className="cauras-input w-full py-4 px-6 text-[13px] outline-none"
                                                    placeholder="Primary Phone Number"
                                                    value={formData.phone}
                                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-white text-black py-4 rounded-2xl font-bold text-[14px] flex items-center justify-center gap-2 hover:bg-zinc-200 transition-all active:scale-[0.98] disabled:opacity-30 shadow-xl shadow-white/5"
                                >
                                    {isSubmitting ? 'Generating Authorization...' : 'Complete Authorization'}
                                    {!isSubmitting && <ChevronRight className="h-4 w-4" />}
                                </button>
                            </form>
                        ) : (
                            <div className="max-w-sm mx-auto w-full space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                                <div className="text-center">
                                    <div className="h-16 w-16 rounded-3xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-500 mx-auto mb-6">
                                        <Key className="h-8 w-8" />
                                    </div>
                                    <h3 className="text-2xl font-bold tracking-tight mb-2">Access Granted</h3>
                                    <p className="text-zinc-500 text-[14px] font-medium leading-relaxed">
                                        Share these credentials securely. The user will be required to reset their key on first entry.
                                    </p>
                                </div>

                                <div className="bg-white/[0.03] border border-white/[0.06] p-8 rounded-[24px] text-center">
                                    <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-2">Temporary Key</p>
                                    <code className="text-3xl font-bold text-white tracking-[0.1em]">{tempPassword}</code>
                                </div>

                                <button
                                    onClick={handleDone}
                                    className="w-full bg-white text-black py-4 rounded-2xl font-bold text-[14px] hover:bg-zinc-200 transition-all active:scale-95"
                                >
                                    Close Authorization Portal
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
