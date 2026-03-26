"use server";

import { z } from "zod";

import ConfirmationEmail from "@/emails/confirmation";
import ContactEmail from "@/emails/contact";
import { resend } from "@/lib/resend";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Invalid email"),
  message: z.string().min(10, "Message too short"),
});

type State = { success?: boolean; error?: string };

export async function sendContactEmail(_prev: State, formData: FormData): Promise<State> {
  const parsed = schema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  });

  if (!parsed.success) return { error: parsed.error.message };

  const { name, email, message } = parsed.data;

  const [notification, confirmation] = await Promise.all([
    // To me — new message notification
    resend.emails.send({
      from: "Contact <noreply@thefalcon.dev>",
      to: "hello@thefalcon.dev",
      replyTo: email,
      subject: `New message from ${name}`,
      react: ContactEmail({ name, email, message }),
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
