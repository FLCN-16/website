"use server";

import fs from "fs/promises";
import path from "path";
import { z } from "zod";

import ConfirmationEmail from "@/emails/confirmation";
import ContactEmail from "@/emails/contact";
import { resend } from "@/lib/resend";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Invalid email"),
  inquiry: z.string().optional(),
  message: z.string().min(10, "Message too short"),
  company: z.string().optional(),
});

type State = { success?: boolean; error?: string };

const RESUME_PATH = path.join(process.cwd(), "public", "files", "rishabh-kumar-resume.pdf");

export async function sendContactEmail(_prev: State, formData: FormData): Promise<State> {
  const parsed = schema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    inquiry: formData.get("inquiry"),
    message: formData.get("message"),
    company: formData.get("company"),
  });

  if (!parsed.success) return { error: parsed.error.message };

  const { name, email, inquiry, message, company } = parsed.data;
  if (company) return { success: true };

  // Read CV — non-blocking; attach if available
  let resumeBuffer: Buffer | undefined;
  try {
    resumeBuffer = await fs.readFile(RESUME_PATH);
  } catch {
    // File not found or unreadable — send without attachment
  }

  const [notification, confirmation] = await Promise.all([
    // To me — new message notification + CV attached
    resend.emails.send({
      from: "Contact <noreply@thefalcon.dev>",
      to: process.env.EMAIL_TO!,
      replyTo: email,
      subject: `New message from ${name}`,
      react: ContactEmail({ name, email, inquiry, message }),
      ...(resumeBuffer && {
        attachments: [
          {
            filename: "Rishabh_Kumar_Resume.pdf",
            content: resumeBuffer,
          },
        ],
      }),
    }),
    // To sender — confirmation receipt
    resend.emails.send({
      from: "The Falcon <noreply@thefalcon.dev>",
      to: email,
      subject: "Got your message",
      react: ConfirmationEmail({ name, message }),
    }),
  ]);

  if (notification.error || confirmation.error) {
    return { error: "Failed to send. Please try again." };
  }

  return { success: true };
}
