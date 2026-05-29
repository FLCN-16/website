"use server"

import { Resend } from "resend"
import { z } from "zod"

const schema = z.object({
  email: z.string().email(),
})

export type SubscribeResult = { ok: boolean; error?: string }

export async function subscribe(data: unknown): Promise<SubscribeResult> {
  const parsed = schema.safeParse(data)
  if (!parsed.success) return { ok: false, error: "Enter a valid email address." }

  const { email } = parsed.data

  if (!process.env.RESEND_API_KEY || !process.env.RESEND_AUDIENCE_ID) {
    console.warn("[subscribe] RESEND_API_KEY or RESEND_AUDIENCE_ID not configured")
    return { ok: false, error: "Subscription unavailable right now." }
  }

  const resend = new Resend(process.env.RESEND_API_KEY)

  try {
    await resend.contacts.create({
      email,
      audienceId: process.env.RESEND_AUDIENCE_ID,
      unsubscribed: false,
    })
    return { ok: true }
  } catch (err) {
    console.error("[subscribe] Resend error:", err)
    return { ok: false, error: "Failed to subscribe. Please try again." }
  }
}
