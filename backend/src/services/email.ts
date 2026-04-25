import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = process.env.EMAIL_FROM ?? 'FormCraft <noreply@formcraft.app>'

export async function sendNewResponseEmail(opts: {
  to: string
  formTitle: string
  formId: string
  responseId: string
}) {
  if (!process.env.RESEND_API_KEY) return

  const dashboardUrl = `${process.env.FRONTEND_URL ?? 'http://localhost:5173'}/responses`

  await resend.emails.send({
    from: FROM,
    to: opts.to,
    subject: `New response on "${opts.formTitle}"`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:24px">
          <div style="background:#6c63ff;border-radius:6px;width:28px;height:28px;display:flex;align-items:center;justify-content:center">
            <span style="color:white;font-weight:bold;font-size:14px">F</span>
          </div>
          <span style="font-weight:700;font-size:15px;color:#1a1d2e">FormCraft</span>
        </div>
        <h1 style="font-size:20px;font-weight:700;color:#1a1d2e;margin:0 0 8px">New response received</h1>
        <p style="font-size:14px;color:#5c6075;margin:0 0 24px">
          Someone just submitted a response to <strong>${opts.formTitle}</strong>.
        </p>
        <a href="${dashboardUrl}"
           style="display:inline-block;background:#6c63ff;color:white;text-decoration:none;border-radius:8px;padding:10px 24px;font-size:14px;font-weight:600">
          View responses →
        </a>
        <p style="font-size:11px;color:#9399ae;margin-top:32px">
          You're receiving this because you own this form. Manage notification preferences in Settings.
        </p>
      </div>
    `,
  })
}
