"use server"

import { Resend } from "resend"
import { contactSchema } from "@/lib/schemas/contact"
import { ContactNotification } from "@/emails/contact-notification"
import { ContactConfirmation } from "@/emails/contact-confirmation"
import { site } from "@/content/site"

export type ContactResult = { ok: boolean; error?: string }

export async function submitContact(data: unknown): Promise<ContactResult> {
  const parsed = contactSchema.safeParse(data)

  if (!parsed.success) {
    return { ok: false, error: "Invalid form data. Please check your inputs." }
  }

  const { name, email, inquiry, message, _honeypot } = parsed.data

  // Silently succeed to fool bots
  if (_honeypot) return { ok: true }

  // TODO (Phase 6): Insert into Payload Submissions collection
  // const payload = await getPayload({ config: payloadConfig })
  // await payload.create({
  //   collection: "submissions",
  //   data: { name, email, inquiry, message, submittedAt: new Date().toISOString() },
  // })

  if (!process.env.RESEND_API_KEY) {
    console.warn("[contact] RESEND_API_KEY not configured — skipping email send")
    return { ok: true }
  }

  const resend = new Resend(process.env.RESEND_API_KEY)
  const from = process.env.RESEND_FROM ?? `Rishabh Kumar <hello@thefalcon.dev>`
  const ownerEmail = process.env.RESEND_TO ?? site.email
  const inquiryLabel = inquiry.charAt(0).toUpperCase() + inquiry.slice(1)

  try {
    await Promise.all([
      resend.emails.send({
        from,
        to: ownerEmail,
        subject: `[thefalcon.dev] New ${inquiryLabel} inquiry from ${name}`,
        react: ContactNotification({ name, email, inquiry: inquiryLabel, message }),
      }),
      resend.emails.send({
        from,
        to: email,
        subject: "Got your message — Rishabh Kumar",
        react: ContactConfirmation({ name }),
      }),
    ])

    return { ok: true }
  } catch (err) {
    console.error("[contact] Resend error:", err)
    return { ok: false, error: "Failed to send message. Please try again or email me directly." }
  }
}
