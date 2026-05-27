import type { Metadata } from "next"
import { ContactFormSection } from "@/components/sections/contact-form-section"

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Rishabh Kumar — Frontend Technical Lead open to new roles, project enquiries, and collaboration.",
}

export default function ContactPage() {
  return <ContactFormSection />
}
