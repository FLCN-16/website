import type { Metadata } from "next";

import { createMetadata } from "@/lib/metadata";

import ContactPageHeader from "./_components/contact-page-header";
import ContactSection from "./_components/contact-section";

export const metadata: Metadata = createMetadata({
  title: "Contact",
  path: "/contact",
  description:
    "Get in touch — collaboration, consulting, or open source. Front-End Technical Lead available for new opportunities.",
});

function ContactPage() {
  return (
    <>
      <ContactPageHeader />
      <ContactSection />
    </>
  );
}

export default ContactPage;
