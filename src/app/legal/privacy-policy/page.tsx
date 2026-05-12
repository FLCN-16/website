import type { Metadata } from "next";
import Link from "next/link";

import { createMetadata } from "@/lib/metadata";

import { LegalPage, LegalSection } from "../_components/legal-page";

export const metadata: Metadata = createMetadata({
  title: "Privacy Policy",
  path: "/legal/privacy-policy",
  description: "How thefalcon.dev handles your data.",
  noIndex: true,
});

const sections = [
  { id: "§01", slug: "overview", title: "Overview" },
  { id: "§02", slug: "data-collected", title: "Data Collected" },
  { id: "§03", slug: "data-usage", title: "Data Usage" },
  { id: "§04", slug: "cookies", title: "Cookies" },
  { id: "§05", slug: "third-party", title: "Third-Party Services" },
  { id: "§06", slug: "your-rights", title: "Your Rights" },
  { id: "§07", slug: "retention", title: "Data Retention" },
  { id: "§08", slug: "changes", title: "Policy Changes" },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      filename="privacy-policy.md"
      title="Privacy Policy"
      docType="LEGAL_DOC"
      scope="DATA_PRIVACY"
      revision="January 2026"
      sections={sections}
      relatedLabel="Terms of Use"
      relatedHref="/legal/terms"
    >
      <LegalSection id="§01" slug="overview" title="Overview">
        <p>
          thefalcon.dev is a personal portfolio website. This policy documents what limited data is
          collected when you visit or use the contact form, and how it is handled. No data is sold
          or shared with third parties for commercial purposes.
        </p>
      </LegalSection>

      <LegalSection id="§02" slug="data-collected" title="Data Collected">
        <p>This site collects minimal data:</p>
        <ul>
          <li>
            <code>contact_form</code> — name, email address, and message content you voluntarily
            provide. Used solely to respond to your enquiry.
          </li>
          <li>
            <code>analytics</code> — if Google Tag Manager is active, anonymised usage data (pages
            visited, browser type, approximate location) may be collected. No personally
            identifiable information is collected.
          </li>
          <li>
            <code>server_logs</code> — standard web server logs (IP address, request path,
            timestamp) retained by the hosting provider for security and diagnostics.
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="§03" slug="data-usage" title="Data Usage">
        <ul>
          <li>Respond to messages submitted via the contact form.</li>
          <li>Understand how visitors use the site and improve its content.</li>
          <li>Maintain the security and performance of the site.</li>
        </ul>
        <p>
          Contact form data is processed via Resend and is not stored beyond what is necessary to
          deliver and respond to your message.
        </p>
      </LegalSection>

      <LegalSection id="§04" slug="cookies" title="Cookies">
        <p>
          This site may set cookies through Google Tag Manager / Google Analytics for analytics
          purposes. These cookies do not identify you personally. You can disable cookies in your
          browser settings at any time.
        </p>
      </LegalSection>

      <LegalSection id="§05" slug="third-party" title="Third-Party Services">
        <ul>
          <li>
            <code>resend</code> — email delivery for contact form submissions.
          </li>
          <li>
            <code>google_tag_manager</code> — anonymised site analytics. Subject to{" "}
            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
              Google&apos;s Privacy Policy
            </a>
            .
          </li>
          <li>
            <code>vercel</code> — hosting provider. Subject to{" "}
            <a
              href="https://vercel.com/legal/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
            >
              Vercel&apos;s Privacy Policy
            </a>
            .
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="§06" slug="your-rights" title="Your Rights">
        <p>
          You may request access to, correction of, or deletion of any personal data held about you
          by contacting me directly via the <Link href="/contact">contact page</Link>. Requests will
          be handled within 30 days.
        </p>
      </LegalSection>

      <LegalSection id="§07" slug="retention" title="Data Retention">
        <p>
          Contact form submissions are retained only as long as necessary to respond to your
          enquiry. Analytics data is retained per Google Analytics default settings (26 months) and
          can be adjusted upon request.
        </p>
      </LegalSection>

      <LegalSection id="§08" slug="changes" title="Policy Changes">
        <p>
          This policy may be updated from time to time. The revision date in the file header
          reflects the most recent change. Continued use of the site after changes constitutes
          acceptance of the updated policy.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
