import type { Metadata } from "next";
import Link from "next/link";

import { createMetadata } from "@/lib/metadata";

import { LegalPage, LegalSection } from "../_components/legal-page";

export const metadata: Metadata = createMetadata({
  title: "Terms of Use",
  path: "/legal/terms",
  description: "Terms governing use of thefalcon.dev.",
  noIndex: true,
});

const sections = [
  { id: "§01", slug: "acceptance", title: "Acceptance" },
  { id: "§02", slug: "ip", title: "Intellectual Property" },
  { id: "§03", slug: "permitted", title: "Permitted Use" },
  { id: "§04", slug: "prohibited", title: "Prohibited Use" },
  { id: "§05", slug: "disclaimer", title: "Disclaimer" },
  { id: "§06", slug: "liability", title: "Limitation of Liability" },
  { id: "§07", slug: "ext-links", title: "External Links" },
  { id: "§08", slug: "changes", title: "Term Changes" },
];

export default function TermsPage() {
  return (
    <LegalPage
      filename="terms-of-use.md"
      title="Terms of Use"
      docType="LEGAL_DOC"
      scope="USAGE_TERMS"
      revision="January 2026"
      sections={sections}
      relatedLabel="Privacy Policy"
      relatedHref="/legal/privacy-policy"
    >
      <LegalSection id="§01" slug="acceptance" title="Acceptance">
        <p>
          By accessing thefalcon.dev you agree to these terms. If you do not agree, please do not
          use the site.
        </p>
      </LegalSection>

      <LegalSection id="§02" slug="ip" title="Intellectual Property">
        <p>
          All content on this site — including text, design, code, and imagery — is the intellectual
          property of thefalcon.dev unless otherwise stated. You may not reproduce, distribute, or
          create derivative works without explicit written permission.
        </p>
        <p>
          Open source code published via linked repositories is subject to the licence specified in
          each repository.
        </p>
      </LegalSection>

      <LegalSection id="§03" slug="permitted" title="Permitted Use">
        <p>You may use this site to:</p>
        <ul>
          <li>View portfolio work and technical content.</li>
          <li>Send a message via the contact form for professional enquiries.</li>
          <li>Share links to pages on this site.</li>
        </ul>
      </LegalSection>

      <LegalSection id="§04" slug="prohibited" title="Prohibited Use">
        <p>You may not:</p>
        <ul>
          <li>Scrape, crawl, or harvest content from this site in bulk.</li>
          <li>Use the contact form to send spam or unsolicited commercial messages.</li>
          <li>
            Attempt to gain unauthorised access to any part of the site or its infrastructure.
          </li>
          <li>Misrepresent any content from this site as your own work.</li>
        </ul>
      </LegalSection>

      <LegalSection id="§05" slug="disclaimer" title="Disclaimer">
        <p>
          This site is provided &quot;as is&quot; without warranties of any kind. While every effort
          is made to keep content accurate and up to date, no guarantee is made regarding
          completeness, accuracy, or fitness for a particular purpose. Use of information on this
          site is at your own risk.
        </p>
      </LegalSection>

      <LegalSection id="§06" slug="liability" title="Limitation of Liability">
        <p>
          To the fullest extent permitted by law, thefalcon.dev shall not be liable for any direct,
          indirect, incidental, or consequential damages arising from your use of, or inability to
          use, this site or its content.
        </p>
      </LegalSection>

      <LegalSection id="§07" slug="ext-links" title="External Links">
        <p>
          This site may contain links to third-party websites. These are provided for convenience
          only. No endorsement of linked content is implied, and no responsibility is accepted for
          the content or practices of external sites.
        </p>
      </LegalSection>

      <LegalSection id="§08" slug="changes" title="Term Changes">
        <p>
          These terms may be updated at any time. The revision date in the file header reflects the
          most recent change. Continued use of the site after changes constitutes acceptance of the
          updated terms. For questions, reach out via the <Link href="/contact">contact page</Link>.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
