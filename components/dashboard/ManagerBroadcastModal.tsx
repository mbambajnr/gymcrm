'use client'

import React, { useState } from 'react'
import { X, Send, Megaphone, ShieldCheck, Info } from 'lucide-react'

interface ManagerBroadcastModalProps {
    isOpen: boolean
    onClose: () => void
    memberCount: number
}

export default function ManagerBroadcastModal({ isOpen, onClose, memberCount }: ManagerBroadcastModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formData, setFormData] = useState({
        subject: '',
        message: '',
        priority: 'normal' as 'normal' | 'high'
    })

    if (!isOpen) return null

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            // SIMULATION: In a real app, this would hit a broadcast action scoped to manager's members
            console.log('Manager Broadcasting payload:', formData)
            await new Promise(resolve => setTimeout(resolve, 1500))
            alert(`Broadcast transmitted to all ${memberCount} members successfully.`)
            onClose()
            setFormData({ subject: '', message: '', priority: 'normal' })
        } catch (error) {
            console.error('Broadcast failed:', error)
            alert('Failed to transmit broadcast. Please try again.')
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
                            <h2 className="text-2xl font-bold tracking-tight">Member Broadcast</h2>
                            <p className="text-[12px] text-zinc-500 font-medium uppercase tracking-widest text-primary">Direct Communication to {memberCount} Active Nodes</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-6">
                            <div>
                                <label className="text-[11px] font-bold text-zinc-600 uppercase tracking-widest mb-3 block">Priority Level</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {(['normal', 'high'] as const).map((p) => (
                                        <button
                                            key={p}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, priority: p })}
                                            className={`py-3 px-4 rounded-xl text-[11px] font-bold uppercase tracking-widest border transition-all ${formData.priority === p ? 'bg-white text-black border-white' : 'bg-white/[0.02] border-white/5 text-zinc-500 hover:text-white hover:border-white/10'}`}
                                        >
                                            {p} Priority
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-[11px] font-bold text-zinc-600 uppercase tracking-widest mb-3 block">Announcement Subject</label>
                                    <input
                                        type="text"
                                        required
                                        className="cauras-input w-full py-4 px-6 text-[13px] outline-none"
                                        placeholder="e.g. Schedule Update, New Equipment..."
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-[11px] font-bold text-zinc-600 uppercase tracking-widest mb-3 block">Message Content</label>
                                    <textarea
                                        required
                                        rows={5}
                                        className="cauras-input w-full py-5 px-6 text-[13px] outline-none resize-none"
                                        placeholder="Enter details for your members..."
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    ></textarea>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-start gap-4 mb-2">
                            <Info className="h-5 w-5 text-zinc-600 mt-0.5" />
                            <p className="text-[12px] text-zinc-500 leading-relaxed font-medium">
                                This message will be dispatched to all members currently registered under your management node.
                            </p>
                        </div>

                        <div className="flex items-center gap-6 pt-4">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1 bg-white text-black py-4 rounded-2xl font-bold text-[14px] flex items-center justify-center gap-3 hover:bg-zinc-200 transition-all active:scale-[0.98] disabled:opacity-30"
                            >
                                {isSubmitting ? 'Dispatching...' : 'Send Announcement'}
                                <Send className="h-4 w-4" />
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
