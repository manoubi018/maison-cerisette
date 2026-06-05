import "server-only"

import { HttpError } from "@/lib/errors/http-error"

const RESEND_API_URL = "https://api.resend.com/emails"

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;")
}

function getResendConfig() {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM

  if (!apiKey) {
    throw new HttpError(500, "Missing RESEND_API_KEY in .env.local")
  }

  if (!from) {
    throw new HttpError(500, "Missing RESEND_FROM in .env.local")
  }

  return { apiKey, from }
}

function buildVerificationEmailHtml(verificationUrl: string) {
  const escapedUrl = escapeHtml(verificationUrl)

  return `
    <!DOCTYPE html>
    <html lang="fr">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Verification email</title>
      </head>
      <body style="margin:0;padding:24px;background:#f4f7fb;font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:24px;overflow:hidden;border:1px solid #dbe3ee;">
          <tr>
            <td style="padding:32px;background:linear-gradient(135deg,#0f172a 0%,#1e293b 100%);color:#ffffff;">
              <p style="margin:0 0 12px;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#cbd5e1;">Maison Cerisette</p>
              <h1 style="margin:0;font-size:30px;line-height:1.2;">Confirmez votre adresse email</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;">
              <p style="margin:0 0 16px;font-size:16px;line-height:1.7;">Bonjour,</p>
              <p style="margin:0 0 24px;font-size:16px;line-height:1.8;color:#475569;">
                Cliquez sur le bouton ci-dessous pour verifier votre adresse email et terminer la creation de votre compte.
              </p>
              <p style="margin:0 0 24px;text-align:center;">
                <a href="${escapedUrl}" style="display:inline-block;padding:14px 28px;border-radius:12px;background:#7c2d12;color:#ffffff;text-decoration:none;font-weight:700;">
                  Verifier mon email
                </a>
              </p>
              <p style="margin:0;font-size:14px;line-height:1.7;color:#64748b;">
                Ce lien expire dans 15 minutes. Si vous n'etes pas a l'origine de cette demande, vous pouvez ignorer cet email.
              </p>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `
}

export async function sendVerificationEmail(input: {
  to: string
  verificationUrl: string
}) {
  const { apiKey, from } = getResendConfig()

  const response = await fetch(RESEND_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: input.to,
      subject: "Verifiez votre adresse email",
      html: buildVerificationEmailHtml(input.verificationUrl),
    }),
  })

  if (!response.ok) {
    const payload = await response.text().catch(() => "")
    throw new HttpError(502, "Email delivery failed", payload)
  }
}
