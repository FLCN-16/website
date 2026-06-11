import { ContactFormSection } from "@/components/sections/contact-form-section"
import { createMetadata } from "@/lib/metadata"
import { getCachedSiteSettings } from "@/lib/data"
import { buildIdentity } from "@/lib/site-identity"

export const dynamic = 'force-static'

export async function generateMetadata() {
  const settings = await getCachedSiteSettings()
  const identity = buildIdentity(settings)
  return createMetadata({
    title: "Contact",
    description:
      "Get in touch with Rishabh Kumar — Frontend Technical Lead open to new roles, project enquiries, and collaboration.",
    path: '/contact',
    identity,
  })
}

export default function ContactPage() {
  return <ContactFormSection />
}
