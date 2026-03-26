"use server";

import { z } from "zod";

import HiringEmail from "@/emails/hiring";
import { resend } from "@/lib/resend";

const schema = z.object({
  email: z.email("Invalid email address"),
  jd: z.string().optional(),
});

export type HiringState = { success?: boolean; error?: string };

export async function sendHiringEmail(
  _prev: HiringState,
  formData: FormData,
): Promise<HiringState> {
  const parsed = schema.safeParse({
    email: formData.get("email"),
    jd: formData.get("jd") ?? "",
  });

  if (!parsed.success) return { error: parsed.error.message };

  const { email, jd } = parsed.data;

  // Handle optional JD file attachment
  const jdFile = formData.get("jdFile");
  let attachment: { filename: string; content: Buffer } | undefined;
  if (jdFile instanceof File && jdFile.size > 0) {
    const bytes = await jdFile.arrayBuffer();
    attachment = {
      filename: jdFile.name,
      content: Buffer.from(bytes),
    };
  }

  const { error } = await resend.emails.send({
    from: "Hiring Alert <noreply@thefalcon.dev>",
    to: "hello@thefalcon.dev",
    replyTo: email,
    subject: `🔴 [HIGH PRIORITY] Hiring opportunity from ${email}`,
    react: HiringEmail({
      email,
      jd: jd ?? "",
      hasAttachment: !!attachment,
      attachmentName: attachment?.filename,
    }),
    headers: {
      "X-Priority": "1",
      "X-MSMail-Priority": "High",
      Importance: "High",
    },
    ...(attachment && {
      attachments: [attachment],
    }),
  });

  if (error) return { error: "Failed to send. Please try again." };

  return { success: true };
}
