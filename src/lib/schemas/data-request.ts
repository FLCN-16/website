import { z } from "zod"

export const REQUEST_TYPE_OPTIONS = [
  { value: "access", label: "Access my data (Art. 15)" },
  { value: "rectification", label: "Correct my data (Art. 16)" },
  { value: "erasure", label: "Delete my data (Art. 17)" },
  { value: "restriction", label: "Restrict processing (Art. 18)" },
  { value: "portability", label: "Export my data (Art. 20)" },
  { value: "objection", label: "Object to processing (Art. 21)" },
  { value: "withdraw-consent", label: "Withdraw consent (Art. 7)" },
  { value: "automated-decision", label: "Automated decisions / Other (Art. 22)" },
] as const

export const dataRequestSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  requestType: z.enum(
    [
      "access",
      "rectification",
      "erasure",
      "restriction",
      "portability",
      "objection",
      "withdraw-consent",
      "automated-decision",
    ],
    { error: "Please select a request type" }
  ),
  details: z
    .string()
    .min(20, "Please provide at least 20 characters of detail")
    .max(2000, "Details must be under 2000 characters"),
  consent: z.literal(true, {
    error: "You must confirm you are the data subject (or authorised to act on their behalf)",
  }),
  _honeypot: z.string().max(0, "").optional(),
})

export type DataRequestFormData = z.infer<typeof dataRequestSchema>
