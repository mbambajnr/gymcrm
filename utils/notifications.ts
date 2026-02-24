/**
 * Notification utility for sending emails/messages
 * In a production environment, this would integrate with Resend, Postmark, or SendGrid.
 */

export async function sendEmail({
    to,
    subject,
    text,
    html
}: {
    to: string
    subject: string
    text: string
    html?: string
}) {
    // SIMULATION MODE: Logging to console
    console.log('--- EMAIL OUTBOUND ---')
    console.log(`TO: ${to}`)
    console.log(`SUBJECT: ${subject}`)
    console.log(`BODY: ${text}`)
    console.log('----------------------')

    // In production:
    // const res = await fetch('https://api.resend.com/emails', {
    //   method: 'POST',
    //   headers: { 'Authorization': `Bearer ${process.env.RESEND_API_KEY}` },
    //   body: JSON.stringify({ from: 'GymFlow <updates@gymflow.com>', to, subject, html: html || text })
    // })

    return { success: true, message: 'Email simulated successfully' }
}

export async function sendWelcomeEmail(fullName: string, email: string) {
    return sendEmail({
        to: email,
        subject: 'Welcome to GymFlow!',
        text: `Hi ${fullName}, welcome to the platform. Your digital access code is being generated.`,
        html: `<h1>Welcome, ${fullName}!</h1><p>We are excited to have you on board. Your fitness journey starts here.</p>`
    })
}

export async function sendPaymentConfirmation(email: string, amount: number) {
    return sendEmail({
        to: email,
        subject: 'Payment Confirmed - GymFlow',
        text: `Your payment of GH₵${amount.toLocaleString()} has been received. Your subscription has been active.`,
    })
}

export async function sendManagerInvite(email: string, tempPassword: string) {
    return sendEmail({
        to: email,
        subject: 'GymFlow Administration: Access Authorized',
        text: `You have been authorized as a Manager. \n\nLogin URL: http://localhost:3000/login \nAccess Key: ${tempPassword} \n\nPlease reset your password upon first entry.`,
    })
}
