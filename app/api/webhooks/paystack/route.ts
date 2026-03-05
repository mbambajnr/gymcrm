import { createAdminClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(request: Request) {
    console.log('--- PAYSTACK WEBHOOK RECEIVED ---')
    const payload = await request.text()
    const signature = request.headers.get('x-paystack-signature')

    if (!signature) {
        return NextResponse.json({ error: 'No signature' }, { status: 401 })
    }

    // 1. Initial Parse to get hinted metadata (unverified)
    const eventData = JSON.parse(payload)
    const ownerId = eventData.data?.metadata?.owner_id
    const memberId = eventData.data?.metadata?.member_id

    const supabase = await createAdminClient()

    // 2. Resolve the correct Secret Key
    let secret = process.env.PAYSTACK_SECRET_KEY

    if (ownerId) {
        // Fetch owner's specific secret
        const { data: ownerProfile } = await supabase
            .from('profiles')
            .select('paystack_secret_key')
            .eq('id', ownerId)
            .single()

        if (ownerProfile?.paystack_secret_key) {
            secret = ownerProfile.paystack_secret_key
        }
    }

    if (!secret) {
        return NextResponse.json({ error: 'No secret key configured' }, { status: 401 })
    }

    // 3. Verify Signature with the resolved secret
    const hash = crypto
        .createHmac('sha512', secret)
        .update(payload)
        .digest('hex')

    if (hash !== signature) {
        console.error('Paystack Signature verification failed')
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    // 4. Handle successful charge
    if (eventData.event === 'charge.success') {
        const data = eventData.data
        const reference = data.reference
        const amount = data.amount / 100 // Convert from Pesewas to Ghana Cedi
        const email = data.customer.email

        // 5. Find the member
        // Use ID from metadata if available (safer), otherwise fall back to email
        const { data: member, error: memberError } = await supabase
            .from('members')
            .select(`
                id,
                subscriptions (
                    id,
                    plan_id,
                    expiry_date,
                    plans (
                        duration_days
                    )
                )
            `)
            .eq(memberId ? 'id' : 'email', memberId || email)
            .single()

        if (memberError || !member) {
            console.error('Member not found for webhook:', memberId || email)
            return NextResponse.json({ error: 'Member not found' }, { status: 404 })
        }

        const subscription = (member.subscriptions as any)?.[0]
        if (!subscription) {
            console.error('No subscription found for member:', member.id)
            return NextResponse.json({ error: 'No subscription' }, { status: 400 })
        }

        // 6. Calculate new expiry
        const durationDays = subscription.plans.duration_days
        const currentExpiry = new Date(subscription.expiry_date)
        const now = new Date()

        // If current expiry is in the future, start adding from there.
        // If it's already in the past (expired), start adding from today.
        const baseDate = currentExpiry > now ? currentExpiry : now
        const newExpiry = new Date(baseDate)
        newExpiry.setDate(newExpiry.getDate() + durationDays)

        // 7. Update Subscription and Log Payment
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

        // 8. Update Member Status
        await supabase
            .from('members')
            .update({ status: 'active' })
            .eq('id', member.id)

        // 9. Send Formal Receipt (Simulated)
        try {
            const { sendPaymentConfirmation } = await import('@/utils/notifications')

            // We already have ownerId from the metadata section above
            const { data: { user: owner } } = await supabase.auth.admin.getUserById(ownerId)

            const fromName = owner?.user_metadata?.broadcast_name || owner?.user_metadata?.full_name || 'Gym Operations'
            const fromEmail = owner?.user_metadata?.broadcast_email || owner?.email || ''

            await sendPaymentConfirmation(email, amount, fromName, fromEmail)
        } catch (e) {
            console.error('Receipt transmission failed:', e)
        }

        console.log('Successfully processed payment for:', email)
    }

    return NextResponse.json({ success: true })
}
