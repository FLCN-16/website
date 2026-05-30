import { ContactFormSection } from "@/components/sections/contact-form-section"
import { createMetadata } from "@/lib/metadata"

export const dynamic = 'force-static'

export const metadata = createMetadata({
  title: "Contact",
  description:
    "Get in touch with Rishabh Kumar — Frontend Technical Lead open to new roles, project enquiries, and collaboration.",
  path: '/contact',
})

export default function ContactPage() {
  return <ContactFormSection />
}
