import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendConfirmationEmail({
  to,
  name,
  designName,
}: {
  to: string
  name: string
  designName: string
}) {
  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to,
      subject: `Your request for "${designName}" was received`,
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
          <h2 style="color: #7C3AED;">Atelier Glass</h2>
          <p>Hi ${name},</p>
          <p>We received your customization request for <strong>${designName}</strong>.</p>
          <p>We'll review your request and be in touch soon!</p>
          <p style="color: #999; font-size: 12px; margin-top: 32px;">Atelier Glass — original designs, commissioned for you.</p>
        </div>
      `,
    })
  } catch (error) {
    // Log but don't throw — email failure shouldn't block the request submission
    console.error('Failed to send confirmation email:', error)
  }
}
