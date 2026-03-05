/**
 * Notification utility for sending emails/messages
 * In a production environment, this would integrate with Resend, Postmark, or SendGrid.
 */

const APP_URL = 'http://localhost:3000'

// --- Cinematic Email Wrapper ---
const emailWrapper = (content: string, gymName?: string) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { background-color: #010101; color: #ffffff; font-family: 'Inter', Helvetica, sans-serif; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; padding: 40px; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 24px; background-color: #010101; }
        .logo { width: 48px; height: 48px; background: #ffffff; border-radius: 12px; margin-bottom: 32px; padding: 4px; }
        h1 { font-size: 32px; font-weight: 700; letter-spacing: -0.04em; margin-bottom: 24px; color: #ffffff; }
        p { color: #888888; font-size: 16px; line-height: 1.6; margin-bottom: 24px; }
        .btn { display: inline-block; background-color: #ffffff; color: #000000; text-decoration: none; padding: 14px 28px; border-radius: 12px; font-weight: 700; font-size: 14px; margin: 32px 0; }
        .footer { margin-top: 40px; padding-top: 24px; border-top: 1px solid rgba(255, 255, 255, 0.05); color: #333333; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; }
        .code-block { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 24px; margin: 24px 0; }
        .code-label { color: #555555; text-transform: uppercase; font-size: 10px; font-weight: 900; letter-spacing: 0.1em; margin-bottom: 8px; }
        .code-value { color: #ffffff; font-family: monospace; font-size: 24px; font-weight: 700; }
    </style>
</head>
<body>
    <div className="container">
        <div className="logo">
           <img src="${APP_URL}/logo.png" width="48" height="48" style="display:block" />
        </div>
        ${content}
        <div className="footer">${gymName || 'GymFlow Infrastructure'} Protocol v2.0</div>
    </div>
</body>
</html>
`

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
    console.log('\n--- EMAIL OUTBOUND (CINEMATIC SIMULATION) ---')
    console.log(`TO: ${to}`)
    console.log(`SUBJECT: ${subject}`)
    console.log(`PREVIEW: ${text.substring(0, 100)}...`)
    console.log('---------------------------------------------\n')

    // In production, send the HTML wrapper
    const finalHtml = html || emailWrapper(`<p>${text}</p>`)

    // Production logic placeholder (e.g., Resend API)
    return { success: true, message: 'Email simulated successfully' }
}

export async function sendWelcomeEmail(fullName: string, email: string, fromName?: string, fromEmail?: string) {
    const html = emailWrapper(`
        <h1>Management Active.</h1>
        <p>Welcome to the core, ${fullName}. Your gym's infrastructure is now live and synchronized.</p>
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.05);">
           <p style="font-size: 10px; font-weight: 900; text-transform: uppercase; color: #555; letter-spacing: 0.2em; margin-bottom: 4px;">AUTHORIZED BY</p>
           <p style="font-size: 14px; color: #fff; font-weight: 700; margin: 0;">${fromName || 'System'}</p>
        </div>
        <a href="${APP_URL}/login" className="btn">Access Terminal</a>
    `, fromName)
    return sendEmail({
        to: email,
        subject: 'GymFlow | Infrastructure Initialized',
        text: `Welcome ${fullName}, your digital access is ready.`,
        html
    })
}

export async function sendPaymentConfirmation(email: string, amount: number, fromName?: string, fromEmail?: string) {
    const html = emailWrapper(`
        <h1>Receipt: Transaction Confirmed.</h1>
        <p>This is a formal acknowledgement of your payment. Your membership access has been synchronized and extended.</p>
        
        <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 24px; margin: 24px 0;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                <span style="color: #555; font-size: 10px; font-weight: 900; text-transform: uppercase;">Amount Paid</span>
                <span style="color: #fff; font-weight: 700;">GH₵${amount.toLocaleString()}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                <span style="color: #555; font-size: 10px; font-weight: 900; text-transform: uppercase;">Transaction ID</span>
                <span style="color: #ccc; font-family: monospace;">GYM-TX-${Math.floor(Math.random() * 1000000)}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
                <span style="color: #555; font-size: 10px; font-weight: 900; text-transform: uppercase;">Date</span>
                <span style="color: #ccc;">${new Date().toLocaleDateString('en-GB')}</span>
            </div>
        </div>

        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.05);">
           <p style="font-size: 10px; font-weight: 900; text-transform: uppercase; color: #555; letter-spacing: 0.2em; margin-bottom: 4px;">MERCHANT</p>
           <p style="font-size: 14px; color: #fff; font-weight: 700; margin: 0;">${fromName || 'Gym Operations'}</p>
           <p style="font-size: 12px; color: #888; margin-top: 2px;">${fromEmail || ''}</p>
        </div>
        <a href="${APP_URL}/manager-dashboard" className="btn">Download Ledger</a>
    `, fromName)
    return sendEmail({
        to: email,
        subject: `GymFlow | Payment Confirmed: GH₵${amount}`,
        text: `Payment of GH₵${amount} confirmed.`,
        html
    })
}

export async function sendManagerInvite(email: string, tempPassword: string, fromName?: string) {
    const html = emailWrapper(`
        <h1>Access Authorized.</h1>
        <p>You have been designated as a <strong>Manager</strong> for your gym's digital workspace.</p>
        <div className="code-block">
           <div className="code-label">TEMPORARY ACCESS KEY</div>
           <div className="code-value">${tempPassword}</div>
        </div>
        <p>Enter this key at the terminal to activate your session. You will be required to define your own security protocol upon arrival.</p>
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.05);">
           <p style="font-size: 10px; font-weight: 900; text-transform: uppercase; color: #555; letter-spacing: 0.2em; margin-bottom: 4px;">INVITED BY</p>
           <p style="font-size: 14px; color: #fff; font-weight: 700; margin: 0;">${fromName || 'Gym Owner'}</p>
        </div>
        <a href="${APP_URL}/login" className="btn">Initialize Entry</a>
    `, fromName)
    return sendEmail({
        to: email,
        subject: 'GymFlow | Authorization Granted',
        text: `Manager authorization granted. Temporary key: ${tempPassword}`,
        html
    })
}
export async function sendBroadcastEmail({
    to,
    subject,
    message,
    fromName,
    fromEmail
}: {
    to: string
    subject: string
    message: string
    fromName: string
    fromEmail: string
}) {
    const html = emailWrapper(`
        <h1>Announcement.</h1>
        <p>${message}</p>
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.05);">
           <p style="font-[10px]; font-weight: 900; text-transform: uppercase; color: #555; letter-spacing: 0.2em; margin-bottom: 4px;">SENT BY</p>
           <p style="font-[14px]; color: #fff; font-weight: 700; margin: 0;">${fromName}</p>
           <p style="font-[12px]; color: #888; margin-top: 2px;">${fromEmail}</p>
        </div>
    `, fromName)
    return sendEmail({
        to,
        subject: `GymFlow | ${subject}`,
        text: message,
        html
    })
}
