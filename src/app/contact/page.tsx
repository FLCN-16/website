import type { Metadata } from "next";
import dynamic from "next/dynamic";

import { createMetadata } from "@/lib/metadata";

import ContactEngagementSection from "./_components/contact-engagement-section";
import ContactPageHeader from "./_components/contact-page-header";

const ContactSection = dynamic(() => import("./_components/contact-section"));

export const metadata: Metadata = createMetadata({
  title: "Contact",
  path: "/contact",
  description:
    "Hire Rishabh Kumar — Full-Stack Technical Lead open to senior engineering and technical leadership roles. React, Next.js, Node.js, Flutter. Reply within 24h.",
  keywords: [
    "hire React developer India",
    "hire Next.js technical lead",
    "senior React engineer",
    "technical lead available",
    "contact Rishabh Kumar",
  ],
});

const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact Rishabh Kumar",
    url: "https://thefalcon.dev/contact",
    description:
      "Get in touch with Rishabh Kumar, Full-Stack Technical Lead. Available for senior engineering and technical leadership roles.",
    mainEntity: { "@id": "https://thefalcon.dev/#person" },
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://thefalcon.dev",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Contact",
        item: "https://thefalcon.dev/contact",
      },
    ],
  },
];

function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <ContactPageHeader />
      <ContactSection />
      <ContactEngagementSection />
    </>
  );
}

export default ContactPage;
