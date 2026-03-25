// actions/send-email.ts
"use server";

import { z } from "zod";
import { resend } from "@/lib/resend";
import ContactEmail from "@/emails/contact";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Invalid email"),
  message: z.string().min(10, "Message too short"),
});

type State = { success?: boolean; error?: string };

export async function sendContactEmail(
  _prev: State,
  formData: FormData,
): Promise<State> {
  const parsed = schema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  });

  if (!parsed.success) return { error: parsed.error.message };

  const { name, email, message } = parsed.data;

  const { error } = await resend.emails.send({
    from: "Contact <noreply@yourdomain.com>",
    to: "you@yourcompany.com",
    replyTo: email,
    subject: `New message from ${name}`,
    react: ContactEmail({ name, email, message }),
  });

  if (error) return { error: "Failed to send. Please try again." };
  return { success: true };
}
