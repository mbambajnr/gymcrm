import { createAdminClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(request: Request) {
    const payload = await request.text()
    const signature = request.headers.get('x-paystack-signature')
    const secret = process.env.PAYSTACK_SECRET_KEY

    // 1. Verify Signature
    if (!signature || !secret) {
        return NextResponse.json({ error: 'No signature or secret' }, { status: 401 })
    }

    const hash = crypto
        .createHmac('sha512', secret)
        .update(payload)
        .digest('hex')

    if (hash !== signature) {
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const event = JSON.parse(payload)

    // 2. Handle successful charge
    if (event.event === 'charge.success') {
        const data = event.data
        const reference = data.reference
        const amount = data.amount / 100 // Convert from Pesewas to Ghana Cedi
        const email = data.customer.email

        const supabase = await createAdminClient()

        // 3. Find the member
        const { data: member, error: memberError } = await supabase
            .from('members')
            .select(`
                id,
                subscriptions (
                    id,
                    plan_id,
                    plans (
                        duration_days
                    )
                )
            `)
            .eq('email', email)
            .single()

        if (memberError || !member) {
            console.error('Member not found for webhook:', email)
            return NextResponse.json({ error: 'Member not found' }, { status: 404 })
        }

        const subscription = (member.subscriptions as any)?.[0]
        if (!subscription) {
            console.error('No subscription found for member:', member.id)
            return NextResponse.json({ error: 'No subscription' }, { status: 400 })
        }

        // 4. Calculate new expiry
        const durationDays = subscription.plans.duration_days
        const newExpiry = new Date()
        newExpiry.setDate(newExpiry.setDate(newExpiry.getDate() + durationDays))

        // 5. Update Subscription and Log Payment in transaction
        // Use a simple sequential update for now
        const { error: subUpdateError } = await supabase
            .from('subscriptions')
            .update({
                expiry_date: newExpiry.toISOString(),
                status: 'active'
            })
            .eq('id', subscription.id)

        if (subUpdateError) {
            console.error('Subscription update error:', subUpdateError.message)
            return NextResponse.json({ error: 'Sub update failed' }, { status: 500 })
        }

        const { error: paymentError } = await supabase
            .from('payments')
            .insert({
                member_id: member.id,
                amount: amount,
                payment_reference: reference,
                status: 'success'
            })

        if (paymentError) {
            console.error('Payment log error:', paymentError.message)
        }

        // 6. Update Member Status
        await supabase
            .from('members')
            .update({ status: 'active' })
            .eq('id', member.id)

        console.log('Successfully processed payment for:', email)
    }

    return NextResponse.json({ success: true })
}
