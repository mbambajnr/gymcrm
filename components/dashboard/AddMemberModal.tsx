'use client'

import React, { useState, useEffect } from 'react'
import { X, User, Mail, Phone, CreditCard, ChevronRight, CheckCircle2 } from 'lucide-react'
import { registerMember } from '@/app/dashboard/actions'

interface Plan {
    id: string
    name: string
    price: number
    duration_days: number
    discount_percentage: number
}

interface AddMemberModalProps {
    isOpen: boolean
    onClose: () => void
    plans: Plan[]
}

export default function AddMemberModal({ isOpen, onClose, plans }: AddMemberModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        planId: '',
    })

    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)
    const [finalPrice, setFinalPrice] = useState(0)

    useEffect(() => {
        const plan = plans.find(p => p.id === formData.planId)
        if (plan) {
            const discount = (plan.price * plan.discount_percentage) / 100
            setSelectedPlan(plan)
            setFinalPrice(plan.price - discount)
        }
    }, [formData.planId, plans])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            await registerMember(formData)
            onClose()
            setFormData({ fullName: '', email: '', phone: '', planId: '' })
        } catch (error: any) {
            console.error('Registration failed:', error)
            alert(error.message || 'Failed to register member. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[#010101]/95 backdrop-blur-md p-6">
            <div className="w-full max-w-4xl bg-[#080808] border border-white/5 rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">

                <div className="grid grid-cols-1 lg:grid-cols-5 h-full">
                    {/* Left: Branding & Info (2 cols) */}
                    <div className="lg:col-span-2 p-12 bg-white/[0.02] border-r border-white/5 hidden lg:flex flex-col justify-between">
                        <div>
                            <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center mb-10 shadow-xl shadow-white/10" />
                            <h2 className="text-3xl font-bold tracking-tight mb-4">Onboard new <br /> member</h2>
                            <p className="text-[14px] text-zinc-500 font-medium leading-relaxed">
                                Register a new student to the platform. They will receive an automated welcome email with their digital access code.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <CheckCircle2 className="h-5 w-5 text-zinc-700" />
                                <p className="text-[13px] text-zinc-500 font-medium">Automatic expiry calculation</p>
                            </div>
                            <div className="flex gap-4">
                                <CheckCircle2 className="h-5 w-5 text-zinc-700" />
                                <p className="text-[13px] text-zinc-500 font-medium">Instant payment confirmation</p>
                            </div>
                            <div className="flex gap-4">
                                <CheckCircle2 className="h-5 w-5 text-zinc-700" />
                                <p className="text-[13px] text-zinc-500 font-medium">Digital member ID generation</p>
                            </div>
                        </div>
                    </div>

                    {/* Right: Form (3 cols) */}
                    <div className="lg:col-span-3 p-12 relative">
                        <button
                            onClick={onClose}
                            className="absolute right-8 top-8 text-zinc-600 hover:text-white transition-colors h-10 w-10 flex items-center justify-center rounded-full hover:bg-white/5"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        <form onSubmit={handleSubmit} className="space-y-10 max-w-md mx-auto">
                            <div className="space-y-6">
                                <div>
                                    <label className="text-[11px] font-bold text-zinc-600 uppercase tracking-widest mb-3 block">Personal Details</label>
                                    <div className="space-y-3">
                                        <div className="relative">
                                            <input
                                                type="text"
                                                required
                                                disabled={isSubmitting}
                                                className="cauras-input w-full py-4 px-6 text-[13px] outline-none"
                                                placeholder="Full Name"
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
                                                placeholder="Email Address"
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
                                                placeholder="Phone Number"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[11px] font-bold text-zinc-600 uppercase tracking-widest mb-3 block">Select Membership</label>
                                    <div className="grid grid-cols-1 gap-3">
                                        {plans.map((plan) => (
                                            <label
                                                key={plan.id}
                                                className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${formData.planId === plan.id ? 'bg-primary/5 border-primary/20 text-white' : 'bg-white/[0.02] border-white/5 text-zinc-500 hover:border-white/10'}`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <input
                                                        type="radio"
                                                        name="plan"
                                                        className="hidden"
                                                        value={plan.id}
                                                        checked={formData.planId === plan.id}
                                                        onChange={() => setFormData({ ...formData, planId: plan.id })}
                                                    />
                                                    <div className={`h-4 w-4 rounded-full border flex items-center justify-center ${formData.planId === plan.id ? 'border-primary' : 'border-zinc-700'}`}>
                                                        {formData.planId === plan.id && <div className="h-2 w-2 rounded-full bg-primary" />}
                                                    </div>
                                                    <div className="space-y-0.5">
                                                        <p className="text-[14px] font-semibold">{plan.name}</p>
                                                        <p className="text-[11px] font-medium opacity-60">Duration: {plan.duration_days} days</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[14px] font-bold">GH₵{plan.price.toLocaleString()}</p>
                                                    {plan.discount_percentage > 0 && (
                                                        <p className="text-[10px] font-bold text-green-500">Save {plan.discount_percentage}%</p>
                                                    )}
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-white/5">
                                <div className="flex items-center justify-between mb-6 px-1">
                                    <span className="text-[13px] font-medium text-zinc-500">Total payable</span>
                                    <span className="text-2xl font-bold text-white tracking-tight">GH₵{finalPrice.toLocaleString()}</span>
                                </div>
                                <button
                                    type="submit"
                                    disabled={isSubmitting || !formData.planId}
                                    className="w-full bg-white text-black py-4 rounded-2xl font-bold text-[14px] flex items-center justify-center gap-2 hover:bg-zinc-200 transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed shadow-xl shadow-white/5"
                                >
                                    {isSubmitting ? 'Processing...' : 'Complete Registration'}
                                    {!isSubmitting && <ChevronRight className="h-4 w-4" />}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
