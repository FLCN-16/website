/**
 * Legal page content + Lexical conversion helpers.
 * Single source of truth used by scripts/seed-content.ts and one-off MCP upserts.
 *
 * bodyText conventions (see textToLexical):
 *   - blocks separated by blank lines
 *   - a block that is entirely **bold** becomes an h2 heading
 *   - inline **bold** is supported inside paragraphs; no lists/links (URLs as plain text)
 */

type LexicalTextNode = {
  detail: number; format: number; mode: string; style: string; text: string; type: "text"; version: number;
}

type LexicalNode =
  | { type: "heading"; tag: string; children: LexicalTextNode[]; direction: string; format: string; indent: number; version: number }
  | { type: "paragraph"; children: LexicalTextNode[]; direction: string; format: string; indent: number; version: number; textFormat: number }

function parseInline(text: string): LexicalTextNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.filter(Boolean).map((part) => {
    const isBold = part.startsWith("**") && part.endsWith("**")
    return {
      detail: 0,
      format: isBold ? 1 : 0,
      mode: "normal",
      style: "",
      text: isBold ? part.slice(2, -2) : part,
      type: "text" as const,
      version: 1,
    }
  })
}

export function textToLexical(text: string) {
  const blocks = text.split("\n\n").filter(Boolean)
  const children: LexicalNode[] = blocks.map((block) => {
    const trimmed = block.trim()
    const headingMatch = trimmed.match(/^\*\*([^*]+)\*\*$/)
    if (headingMatch) {
      return {
        children: [{ detail: 0, format: 0, mode: "normal", style: "", text: headingMatch[1], type: "text" as const, version: 1 }],
        direction: "ltr",
        format: "",
        indent: 0,
        type: "heading" as const,
        tag: "h2",
        version: 1,
      }
    }
    return {
      children: parseInline(trimmed),
      direction: "ltr",
      format: "",
      indent: 0,
      type: "paragraph" as const,
      version: 1,
      textFormat: 0,
    }
  })
  return {
    root: {
      children,
      direction: "ltr" as const,
      format: "" as const,
      indent: 0,
      type: "root" as const,
      version: 1,
    },
  }
}

export const LEGAL_PAGES = [
  {
    title: "Privacy Policy",
    slug: "privacy",
    template: "legal" as const,
    lastUpdated: "2026-06-10T00:00:00.000Z",
    bodyText: `This Privacy Policy explains how personal data is handled when you visit thefalcon.dev (the "Site"), the personal portfolio of Rishabh Kumar. For visitors in the European Economic Area (EEA) and the United Kingdom, Rishabh Kumar is the data controller under the GDPR and UK GDPR. Under India's Digital Personal Data Protection Act, 2023 (DPDP Act), the equivalent role is data fiduciary.

**Who is responsible for your data**

Rishabh Kumar, Jalandhar, Punjab, India. For anything related to your personal data, contact hello@thefalcon.dev. I aim to respond to all privacy requests within 30 days.

**What data is collected, why, and on what legal basis**

**Contact form.** If you use the contact form, I collect your name, email address, the inquiry type you select, and your message. This data is stored in the Site's database (MongoDB Atlas) and delivered to my inbox by the email service Resend; you also receive an automatic confirmation email. Legal basis: legitimate interest in responding to enquiries and, where your message concerns work, steps taken prior to entering into a contract (GDPR Art. 6(1)(b) and 6(1)(f)).

**Talent and hiring inquiries.** If you use the hiring inquiry dialog, I collect your email address, the role or pitch you describe, and any document you choose to attach (for example a job description). This is stored in the Site's database (MongoDB Atlas) and delivered to my inbox by Resend. Legal basis: steps taken prior to entering into a contract and legitimate interest (GDPR Art. 6(1)(b) and 6(1)(f)).

**Newsletter.** If you subscribe to the newsletter, your email address is stored with Resend, the service that also sends the newsletter, and is used solely to send you new posts published on this Site. Legal basis: your consent (GDPR Art. 6(1)(a)). Every newsletter contains an unsubscribe link; unsubscribing takes effect immediately and no further newsletters will be sent; you can additionally request full deletion of your address at any time.

**Analytics.** The Site uses Google Tag Manager and Google Analytics to understand how the Site is used: pages visited, approximate location at city level, device type, and interactions such as searches and downloads. The Tag Manager script loads in consent-denied mode: your browser requests it from Google's servers (which involves your IP address), but no analytics cookies are set and no identifiers are collected unless you click Accept in the cookie banner. Advertising storage and ad-personalisation signals are permanently disabled on this Site, regardless of your choice. Legal basis: your consent (GDPR Art. 6(1)(a)), which you can withdraw at any time via Cookie settings in the footer. Details are in the Cookie Policy at thefalcon.dev/legal/cookies.

**Server logs.** The hosting infrastructure records standard access logs (IP address, requested URL, timestamp, user agent) for security, abuse prevention, and operational monitoring. Legal basis: legitimate interest in running the Site securely (GDPR Art. 6(1)(f)).

**Cookies and local storage**

The Site stores a small number of items in your browser: your theme preference, your cookie-consent choice, and one-time interface flags (a splash-screen marker and a hiring-popup marker). All are strictly necessary and contain no personal identifiers. Analytics cookies are set only after you opt in. The full list, with purposes and durations, is in the Cookie Policy at thefalcon.dev/legal/cookies.

**Service providers**

The Site relies on a small set of providers that process data on my behalf:

**Vercel Inc.** (USA) hosts the Site and serves its pages, processing standard server logs. See vercel.com/legal/privacy-policy.

**MongoDB, Inc.** (USA) provides MongoDB Atlas, the managed database that stores Site content, contact form submissions, and hiring-inquiry submissions. See mongodb.com/legal/privacy-policy.

**Cloudflare, Inc.** (USA) stores and delivers the Site's images and files (R2); serving a file involves processing the requesting IP address. See cloudflare.com/privacypolicy.

**Resend** (Plus Five Five, Inc., USA) sends transactional email and the newsletter, and stores newsletter subscriber addresses. See resend.com/legal/privacy-policy.

**Google LLC** (USA) provides Google Tag Manager and Google Analytics. The script loads in consent-denied mode; analytics measurement and cookies are enabled only after you consent. See policies.google.com/privacy.

Fonts are self-hosted with the Site's build, so visiting the Site makes no request to Google Fonts or any other font service.

**International data transfers**

I am based in India, and the providers above operate primarily in the United States. Where personal data of EEA or UK visitors is transferred outside those regions, it is protected by appropriate safeguards: the EU–US Data Privacy Framework where the provider is certified, and/or the European Commission's Standard Contractual Clauses.

**How long data is kept**

Contact form and hiring inquiry data is kept for as long as needed to handle the conversation and is reviewed and deleted within 24 months at the latest. Newsletter addresses are kept until you unsubscribe. Google Analytics data is retained for 14 months. Server logs are kept by the hosting providers for short operational windows under their own policies. You can request earlier deletion of any of your data at any time.

**Your rights in the EEA and UK (GDPR / UK GDPR)**

You have the right to access your personal data; to have it corrected or erased; to restrict or object to its processing; to receive it in a portable format; and to withdraw consent at any time without affecting processing that happened before withdrawal. To exercise any of these rights, email hello@thefalcon.dev. You also have the right to lodge a complaint with your local data protection supervisory authority.

**Your rights in India (DPDP Act, 2023)**

You have the right to access a summary of the personal data processed about you, to correction and erasure, to grievance redressal, and to nominate another individual to exercise your rights on your behalf in case of death or incapacity. Requests and grievances sent to hello@thefalcon.dev will be addressed promptly.

**Your rights in California (CCPA / CPRA)**

California residents have the right to know what personal information is collected, to access and delete it, to correct it, and to opt out of its sale or sharing. This Site does not sell personal information and does not share it for cross-context behavioural advertising. You will not be discriminated against for exercising any of these rights. Requests: hello@thefalcon.dev.

**Children**

The Site is not directed at children, and I do not knowingly collect personal data from anyone under 16. If you believe a child has submitted personal data, contact me and it will be deleted.

**Security**

All traffic to the Site is encrypted in transit (TLS). Data is stored with reputable providers using access controls, and access to submissions and subscriber lists is limited to me.

**Automated decision-making**

The Site performs no profiling and makes no automated decisions that produce legal or similarly significant effects on you.

**Changes to this policy**

This policy may be updated as the Site or legislation changes; the "last updated" date above reflects the latest revision. Material changes to how consent-based data is used will trigger a fresh consent request.

**Contact**

For any privacy-related question or request, email hello@thefalcon.dev.`,
  },
  {
    title: "Terms of Use",
    slug: "terms",
    template: "legal" as const,
    lastUpdated: "2026-06-10T00:00:00.000Z",
    bodyText: `These Terms of Use (the "Terms") govern your access to and use of thefalcon.dev (the "Site"), the personal portfolio of Rishabh Kumar. By using the Site, you agree to these Terms. If you do not agree, please do not use the Site.

**Content and intellectual property**

All written content, code samples, imagery, and design on the Site are the personal work of Rishabh Kumar unless otherwise noted. You may link to any page freely and quote brief excerpts with clear attribution. You may not reproduce substantial portions of the content, present any of the work as your own, or use the content for commercial purposes without prior written permission. Code snippets published in posts may be used in your own projects unless a different licence is stated alongside them.

**Acceptable use**

You agree not to misuse the Site. In particular, you must not attempt to gain unauthorised access to the Site, its admin area, or its infrastructure; submit forms with false, misleading, or unlawful content; use the contact or hiring forms to send unsolicited marketing or spam; scrape content at a volume that degrades the Site; or introduce malware or other harmful code.

**Forms and submissions**

Information you submit through the contact or hiring forms must be accurate and lawful. Submissions are handled as described in the Privacy Policy at thefalcon.dev/legal/privacy.

**Newsletter**

The newsletter is free. By subscribing you agree to receive emails when new posts are published. You can unsubscribe at any time using the link included in every email; no further newsletters will be sent after that, and you can request full deletion of your address. Newsletter data handling is described in the Privacy Policy.

**Accuracy of information**

The information on the Site — including employment history, project descriptions, and technical content — is provided in good faith and to the best of my knowledge, for general information only. It does not constitute professional advice. I make no warranties about completeness or accuracy and accept no liability for errors or omissions.

**External links**

The Site links to third-party websites for convenience only. I have no control over their content and accept no responsibility for them or for any loss or damage arising from your use of them.

**Availability**

I aim to keep the Site available and secure, but it is provided "as is" and "as available", without warranties of any kind. Any part of it may be changed, suspended, or discontinued at any time without notice.

**Limitation of liability**

To the fullest extent permitted by applicable law, I am not liable for any indirect, incidental, special, or consequential damages, or any loss of data, profits, or goodwill, arising out of your use of, or inability to use, the Site. Nothing in these Terms excludes liability that cannot be excluded under applicable law.

**Privacy**

Use of the Site is also subject to the Privacy Policy (thefalcon.dev/legal/privacy) and the Cookie Policy (thefalcon.dev/legal/cookies), which explain how personal data and cookies are handled.

**Governing law**

These Terms are governed by the laws of India. Any dispute arising in connection with them is subject to the exclusive jurisdiction of the courts of Punjab, India.

**Changes to these Terms**

These Terms may be updated from time to time; the "last updated" date above reflects the latest revision. Continued use of the Site after changes constitutes acceptance of the updated Terms.

**Contact**

Questions about these Terms: hello@thefalcon.dev.`,
  },
  {
    title: "Cookie Policy",
    slug: "cookies",
    template: "legal" as const,
    lastUpdated: "2026-06-10T00:00:00.000Z",
    bodyText: `This Cookie Policy explains what is stored in your browser when you use thefalcon.dev (the "Site") and how you can control it. It supplements the Privacy Policy at thefalcon.dev/legal/privacy.

**What cookies and local storage are**

Cookies are small text files a website places in your browser. Local storage is a similar browser feature for storing small values. Both can be strictly necessary (required for the site to work as you asked) or optional (such as analytics, which require your consent).

**Strictly necessary storage**

These items are required for the Site to function and do not need consent. None of them contain personal identifiers, and none leave your device.

**theme** (localStorage) — remembers your light or dark theme preference. Kept until you clear your browser data.

**splash_seen** (sessionStorage) — remembers that you have already seen the intro splash animation in this browser session so it does not replay on every page. Cleared automatically when the browser session ends.

**talent_popup_seen** (localStorage) — remembers that the hiring popup has already been shown so it is not shown repeatedly. Kept until you clear your browser data.

**flcn-consent-v1** (localStorage) — records your cookie-consent choice and when you made it, so you are not asked again on every visit. Kept until you clear your browser data or change your choice.

**Analytics storage (requires your consent)**

With your consent, Google Tag Manager loads Google Analytics 4, which sets cookies such as:

**_ga** — distinguishes visitors. Expires after 2 years.

**_ga_(container id)** — keeps session state for this Site's Analytics property. Expires after 2 years.

These cookies are set by Google LLC. Details: policies.google.com/technologies/cookies.

**How consent works on this Site**

The Site uses Google Consent Mode v2. By default, all analytics and advertising storage is set to "denied": no analytics cookies are set and no identifiers are collected. If you click Accept in the consent banner, consent is updated to "granted" and the cookies above are enabled. Advertising-related signals (ad storage, ad user data, ad personalisation) are never enabled, regardless of your choice. If you click Decline or ignore the banner, consent stays denied; Google may still receive basic, cookieless pings that contain no identifiers and are not used to profile you.

**Changing your mind**

You can change or withdraw your consent at any time by clicking "Cookie settings" in the Site footer, which reopens the consent banner. Withdrawing consent stops analytics cookies from that point on; existing cookies can be deleted through your browser settings, which also let you block cookies entirely.

**Contact**

Questions about this policy: hello@thefalcon.dev.`,
  },
]
