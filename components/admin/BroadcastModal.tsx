'use client'

import React, { useState } from 'react'
import { X, Send, Megaphone, Users, ShieldCheck } from 'lucide-react'

interface BroadcastModalProps {
    isOpen: boolean
    onClose: () => void
}

export default function BroadcastModal({ isOpen, onClose }: BroadcastModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formData, setFormData] = useState({
        subject: '',
        message: '',
        target: 'all' as 'all' | 'managers' | 'members'
    })

    if (!isOpen) return null

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            // SIMULATION: In a real app, this would hit a broadcast action
            console.log('Broadcasting payload:', formData)
            await new Promise(resolve => setTimeout(resolve, 1500))
            alert(`Broadcast transmitted successfully to ${formData.target} nodes.`)
            onClose()
        } catch (error) {
            console.error('Broadcast failed:', error)
            alert('Failed to transmit broadcast. Check telemetry logs.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[#010101]/95 backdrop-blur-md p-6">
            <div className="w-full max-w-2xl bg-[#080808] border border-white/5 rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-500">
                <div className="p-12 relative">
                    <button
                        onClick={onClose}
                        className="absolute right-8 top-8 text-zinc-600 hover:text-white transition-colors h-10 w-10 flex items-center justify-center rounded-full hover:bg-white/5"
                    >
                        <X className="h-5 w-5" />
                    </button>

                    <div className="flex items-center gap-4 mb-10">
                        <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center shadow-2xl shadow-white/20">
                            <Megaphone className="h-6 w-6 text-black" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight">System Broadcast</h2>
                            <p className="text-[12px] text-zinc-500 font-medium uppercase tracking-widest">Global Telemetry Outbound</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-6">
                            <div>
                                <label className="text-[11px] font-bold text-zinc-600 uppercase tracking-widest mb-3 block">Target Cluster</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {(['all', 'managers', 'members'] as const).map((t) => (
                                        <button
                                            key={t}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, target: t })}
                                            className={`py-3 px-4 rounded-xl text-[11px] font-bold uppercase tracking-widest border transition-all ${formData.target === t ? 'bg-white text-black border-white' : 'bg-white/[0.02] border-white/5 text-zinc-500 hover:text-white hover:border-white/10'}`}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-[11px] font-bold text-zinc-600 uppercase tracking-widest mb-3 block">Subject Header</label>
                                    <input
                                        type="text"
                                        required
                                        className="cauras-input w-full py-4 px-6 text-[13px] outline-none"
                                        placeholder="Enter transmission subject..."
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-[11px] font-bold text-zinc-600 uppercase tracking-widest mb-3 block">Payload Message</label>
                                    <textarea
                                        required
                                        rows={5}
                                        className="cauras-input w-full py-5 px-6 text-[13px] outline-none resize-none"
                                        placeholder="Compose global announcement..."
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    ></textarea>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-6 pt-4">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1 bg-white text-black py-4 rounded-2xl font-bold text-[14px] flex items-center justify-center gap-3 hover:bg-zinc-200 transition-all active:scale-[0.98] disabled:opacity-30"
                            >
                                {isSubmitting ? 'Transmitting...' : 'Initiate Broadcast'}
                                <Send className="h-4 w-4" />
                            </button>
                            <div className="hidden sm:flex flex-col">
                                <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Security Level</span>
                                <div className="flex items-center gap-2 text-green-500">
                                    <ShieldCheck className="h-3 w-3" />
                                    <span className="text-[10px] font-bold uppercase tracking-wider">Authorized</span>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
