export interface LegalDocument {
  title: string;
  lastUpdated: string;
  body: string;
}

export interface Legal {
  privacy: LegalDocument;
  terms: LegalDocument;
}

export const legal: Legal = {
  privacy: {
    title: "Privacy Policy",
    lastUpdated: "2025-01-01",
    body: `This Privacy Policy describes how thefalcon.dev ("this website", "I") handles information when you visit or use this personal portfolio site.

**What data is collected**

The only personal data collected on this site is information you voluntarily submit through the contact form: your name, email address, and the message you choose to send. This data is used solely to respond to your enquiry and is not stored in a database beyond what is necessary to reply. No data is sold, shared with third parties, or used for marketing purposes.

**Cookies and local storage**

This site does not use tracking cookies or analytics of any kind. A single entry is written to your browser's localStorage to remember your preferred colour theme (light or dark). This value never leaves your device and contains no personally identifiable information.

**Third-party services**

This site is hosted on Vercel. Vercel may collect standard server access logs (IP address, request path, timestamp) as part of normal hosting operations. Please refer to Vercel's privacy policy at vercel.com/legal/privacy-policy for details on their data handling.

**Your rights**

If you have submitted a contact form and wish to have that correspondence deleted, please email hello@thefalcon.dev and I will remove it promptly.

**Changes to this policy**

This policy may be updated occasionally. The "last updated" date at the top of this page will reflect any changes. Continued use of the site after changes constitutes acceptance of the revised policy.

**Contact**

For any privacy-related questions, reach out at hello@thefalcon.dev.`,
  },
  terms: {
    title: "Terms of Use",
    lastUpdated: "2025-01-01",
    body: `These Terms of Use govern your access to and use of thefalcon.dev (the "Site"). By using the Site, you agree to these terms.

**Content and intellectual property**

All written content, code samples, and design on this Site are the personal work of Rishabh Kumar unless otherwise noted. You may share links to any page on this Site freely. You may quote brief excerpts with clear attribution. You may not reproduce substantial portions of the content, pass off any of the work as your own, or use the content for commercial purposes without prior written permission.

**Accuracy**

The information on this Site — including employment history, project descriptions, and technical content — is provided in good faith and to the best of my knowledge. I make no warranties about the completeness or accuracy of any information and accept no liability for errors or omissions.

**External links**

The Site may contain links to third-party websites. These links are provided for convenience only. I have no control over the content of those sites and accept no responsibility for them or for any loss or damage arising from your use of them.

**Limitation of liability**

To the fullest extent permitted by applicable law, I am not liable for any indirect, incidental, or consequential damages arising out of your use of this Site or your inability to use it.

**Governing law**

These terms are governed by the laws of India. Any disputes arising in connection with these terms shall be subject to the jurisdiction of courts in Punjab, India.

**Changes to these terms**

These terms may be updated from time to time. The "last updated" date above will reflect any revisions. Continued use of the Site after changes constitutes acceptance of the updated terms.

**Contact**

For any questions about these terms, contact hello@thefalcon.dev.`,
  },
};
