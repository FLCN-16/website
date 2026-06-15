"use server"

import { Resend } from "resend"
import { getPayload } from "payload"
import config from "@payload-config"
import { dataRequestSchema, REQUEST_TYPE_OPTIONS } from "@/lib/schemas/data-request"
import { DataRequestNotification } from "@/emails/data-request-notification"
import { DataRequestConfirmation } from "@/emails/data-request-confirmation"
import { getCachedSiteSettings } from "@/lib/data"
import { buildIdentity } from "@/lib/site-identity"

export type DataRequestResult = { ok: boolean; error?: string }

export async function submitDataRequest(data: unknown): Promise<DataRequestResult> {
  const parsed = dataRequestSchema.safeParse(data)

  if (!parsed.success) {
    return { ok: false, error: "Invalid form data. Please check your inputs." }
  }

  const { name, email, requestType, details, _honeypot } = parsed.data

  // Silently succeed to fool bots
  if (_honeypot) return { ok: true }

  const requestTypeLabel =
    REQUEST_TYPE_OPTIONS.find((o) => o.value === requestType)?.label ?? requestType

  const settings = await getCachedSiteSettings().catch(() => null)
  const identity = buildIdentity(settings)

  try {
    const payload = await getPayload({ config })
    const { docs } = await payload.find({
      collection: "forms",
      where: { slug: { equals: "data-request" } },
      limit: 1,
    })
    if (docs[0]) {
      await payload.create({
        collection: "form-submissions",
        data: {
          form: docs[0].id,
          submissionData: [
            { field: "name", value: name },
            { field: "email", value: email },
            { field: "requestType", value: requestType },
            { field: "details", value: details },
            { field: "consent", value: "confirmed" },
          ],
        },
      })
    }
  } catch (err) {
    console.error("[data-request] Failed to save submission to Payload:", err)
  }

  if (!process.env.RESEND_API_KEY) {
    console.warn("[data-request] RESEND_API_KEY not configured — skipping email send")
    return { ok: true }
  }

  const resend = new Resend(process.env.RESEND_API_KEY)
  const from = process.env.RESEND_FROM ?? `Rishabh Kumar <hello@thefalcon.dev>`
  const ownerEmail = process.env.RESEND_TO ?? identity.email

  try {
    await Promise.all([
      resend.emails.send({
        from,
        to: ownerEmail,
        subject: `[thefalcon.dev] Data Subject Request (${requestTypeLabel}) from ${name}`,
        react: DataRequestNotification({ name, email, requestType: requestTypeLabel, details }),
      }),
      resend.emails.send({
        from,
        to: email,
        subject: "Your data request has been received — Rishabh Kumar",
        react: DataRequestConfirmation({ name, requestType: requestTypeLabel }),
      }),
    ])

    return { ok: true }
  } catch (err) {
    console.error("[data-request] Resend error:", err)
    return { ok: false, error: "Failed to submit your request. Please try again or email me directly." }
  }
}
