import { z } from "zod"

export const INQUIRY_OPTIONS = [
  { value: "role", label: "Open Role" },
  { value: "project", label: "Project Enquiry" },
  { value: "collab", label: "Collaboration" },
  { value: "other", label: "Something Else" },
] as const

export const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  inquiry: z.enum(["role", "project", "collab", "other"], {
    error: "Please select an inquiry type",
  }),
  message: z.string().min(20, "Message must be at least 20 characters"),
  _honeypot: z.string().max(0, "").optional(),
})

export type ContactFormData = z.infer<typeof contactSchema>
