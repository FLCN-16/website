"use server"

import { Resend } from "resend"
import { getPayload } from "payload"
import config from "@payload-config"
import { site } from "@/content/site"
import { TalentInquiryNotification } from "@/emails/talent-inquiry-notification"

export type TalentInquiryResult = { ok: boolean; error?: string }

export async function submitTalentInquiry(formData: FormData): Promise<TalentInquiryResult> {
  const formId = formData.get("formId")
  // Field names must match the Payload admin form exactly: "email" and "pitch"
  const email = formData.get("email")
  const pitch = formData.get("pitch")
  const jdFile = formData.get("jdFile")

  if (typeof formId !== "string" || typeof email !== "string" || !email) {
    return { ok: false, error: "Invalid submission data." }
  }

  const pitchText = typeof pitch === "string" ? pitch.trim() : ""
  const file = jdFile instanceof File && jdFile.size > 0 ? jdFile : null

  try {
    const payload = await getPayload({ config })

    // Fetch form to read enabled flag
    const form = await payload.findByID({
      collection: "forms",
      id: formId,
    }) as { id: string; enabled?: boolean | null }

    // Conditionally write DB entry
    if (form.enabled !== false) {
      await payload.create({
        collection: "form-submissions",
        data: {
          form: formId,
          submissionData: [
            { field: "email", value: email },
            { field: "pitch", value: pitchText },
          ],
        },
      })
    }

    // Always send email
    if (!process.env.RESEND_API_KEY) {
      console.warn("[talent-inquiry] RESEND_API_KEY not set — skipping email")
      return { ok: true }
    }

    const resend = new Resend(process.env.RESEND_API_KEY)
    const from = process.env.RESEND_FROM ?? `Rishabh Kumar <hello@thefalcon.dev>`
    const to = process.env.RESEND_TO ?? site.email

    let attachments: { filename: string; content: Buffer }[] | undefined
    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer())
      attachments = [{ filename: file.name, content: buffer }]
    }

    await resend.emails.send({
      from,
      to,
      subject: "[thefalcon.dev] New talent inquiry",
      react: TalentInquiryNotification({
        email,
        pitchText,
        fileName: file?.name ?? null,
      }),
      attachments,
    })

    return { ok: true }
  } catch (err) {
    console.error("[talent-inquiry] Error:", err)
    return { ok: false, error: "Failed to send. Please email me directly." }
  }
}
