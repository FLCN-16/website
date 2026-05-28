/**
 * Payload CMS seed script — wipes and repopulates all content collections.
 * Run: pnpm seed:content
 *
 * Reads env vars from .env.local automatically (MONGODB_URI, PAYLOAD_SECRET required).
 * env must be loaded before payload.config is imported (buildConfig reads process.env).
 *
 * Collections cleaned: posts, work, projects, timeline, education, certifications, submissions, search, pages
 * Collections seeded:  timeline, work, projects, education, certifications, pages
 * Skipped:             users (admin account), media (files live in R2 cloud)
 */

import { readFileSync } from "fs"
import { resolve } from "path"
import type { Payload } from "payload"

function loadEnvLocal() {
  try {
    const content = readFileSync(resolve(process.cwd(), ".env.local"), "utf8")
    for (const line of content.split("\n")) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith("#")) continue
      const eqIdx = trimmed.indexOf("=")
      if (eqIdx === -1) continue
      const key = trimmed.slice(0, eqIdx).trim()
      const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, "")
      if (key && !process.env[key]) process.env[key] = val
    }
  } catch {
    // no .env.local — rely on shell environment
  }
}

// ─── Lexical helpers ──────────────────────────────────────────────────────────

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

function textToLexical(text: string) {
  const blocks = text.split("\n\n").filter(Boolean)
  const children: LexicalNode[] = blocks.map((block) => {
    const trimmed = block.trim()
    const headingMatch = trimmed.match(/^\*\*(.+)\*\*$/)
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

// ─── Data ────────────────────────────────────────────────────────────────────

const TIMELINE = [
  {
    company: "DigiMantra Innovations Pvt. Ltd.",
    role: "Associate Technical Lead",
    start: "2022",
    end: "",
    summary:
      "Lead full-stack architecture and delivery across 2–3 concurrent client projects spanning React/Next.js frontends, Node.js/Nest.js and Python backends, and containerised deployments. Technically lead a team of 6 engineers — conducting architecture and API design reviews, reviewing 6–8 pull requests weekly, and mentoring 10+ junior and mid-level engineers.",
    tags: ["Full Stack", "Team Lead", "Next.js", "Node.js", "Python", "Nest.js", "React"],
    order: 1,
  },
  {
    company: "Erosteps Pvt. Ltd.",
    role: "Senior Full Stack Web Developer",
    start: "2017",
    end: "2022",
    summary:
      "Built and shipped 8–10 production full-stack web applications, owning both the Vue.js frontend and the Lumen (PHP) and Node.js API layers. Built and maintained CI/CD pipelines using Jenkins and Docker. Shipped 2 cross-platform mobile apps to the Google Play Store using Flutter.",
    tags: ["Full Stack", "Vue.js", "PHP", "Lumen", "Node.js", "Flutter", "Jenkins", "Docker"],
    order: 2,
  },
]

const WORK = [
  {
    slug: "design-system-foundation",
    category: "Design Systems",
    ord: "01",
    title: "Design System Foundation",
    tags: ["React", "TypeScript", "Storybook", "Tokens"],
    description:
      "A token-driven component library adopted across 5 product teams, replacing ad-hoc styling with a single source of truth for UI.",
    briefing: {
      problem:
        "The engineering org had grown to 40+ frontend engineers across 5 squads, each maintaining their own component primitives. The result was visual inconsistency, duplicated accessibility fixes, and a new-hire onboarding experience that required learning 3 different button components. Design handoffs were a recurring source of friction — Figma specs and code diverged within days of each release.",
      approach: [
        "Audited all existing UI across products and distilled a token vocabulary covering colour, spacing, typography, elevation, and motion.",
        "Built a core package of ~60 composable primitives with full TypeScript props, WAI-ARIA patterns, and dark-mode support baked in at the token level.",
        "Established a Storybook-driven development workflow with automated visual regression tests via Chromatic on every pull request.",
        "Ran weekly office hours with product designers to resolve token ambiguity and keep the Figma library in sync with published package versions.",
      ],
      impact:
        "Within six months of adoption, cross-squad UI consistency scores (measured by design QA) improved from 61% to 94%. New feature development time dropped by an estimated 25% for teams that fully migrated. The library now receives contributions from 12 engineers and has a documented governance model for breaking changes.",
      quote:
        "The design system turned UI quality from a per-squad lottery into a baseline guarantee.",
    },
    stack: [
      { name: "React", role: "Component framework" },
      { name: "TypeScript", role: "Type safety and API contracts" },
      { name: "Storybook", role: "Development environment and docs" },
      { name: "Chromatic", role: "Visual regression testing" },
      { name: "Style Dictionary", role: "Token transformation pipeline" },
    ],
    meta: {
      title: "Design System Foundation — Rishabh Kumar",
      description:
        "Token-driven component library adopted across 5 product teams — improving UI consistency from 61% to 94% and cutting feature development time by 25%.",
    },
  },
  {
    slug: "micro-frontend-platform",
    category: "Platform Engineering",
    ord: "02",
    title: "Micro-Frontend Platform",
    tags: ["Module Federation", "Webpack 5", "React", "CI/CD"],
    description:
      "Re-architected a monolithic React app into independently deployable micro-frontends, enabling 5 squads to ship without cross-team coordination.",
    briefing: {
      problem:
        "The main product application had grown to 180,000+ lines of React code managed by a single shared repository. Every release required a full regression cycle and sign-off from all five squads, which bottlenecked deployments to once a fortnight. A single breaking change in a shared utility could block unrelated teams for days, and the cold-start time for local development had reached 4 minutes.",
      approach: [
        "Mapped product domains against team ownership and defined module boundaries using Event Storming sessions with engineering leads.",
        "Implemented Webpack 5 Module Federation as the runtime integration layer, with a lightweight shell application managing routing and shared context.",
        "Built a custom CLI tool that scaffolds new micro-frontends with pre-configured CI/CD, linting, and a shared dependency contract to prevent version drift.",
        "Phased the migration over 8 months — strangler fig pattern — keeping the existing monolith live until each domain had full parity.",
      ],
      impact:
        "Deployment frequency went from bi-weekly to multiple times per day per squad. Local dev cold-start dropped from 4 minutes to 38 seconds. The shell and inter-app communication contract became the internal model for 2 additional product surfaces launched the following year.",
      quote:
        "Decoupling deployments was the single biggest multiplier on engineering velocity in the company's history.",
    },
    stack: [
      { name: "Webpack 5", role: "Module Federation host and remotes" },
      { name: "React", role: "UI framework across all micro-apps" },
      { name: "TypeScript", role: "Shared contract definitions" },
      { name: "GitHub Actions", role: "Independent CI/CD pipelines" },
      { name: "Nx", role: "Monorepo build orchestration" },
    ],
    meta: {
      title: "Micro-Frontend Platform — Rishabh Kumar",
      description:
        "Re-architected a 180k-line React monolith into independently deployable micro-frontends — taking deployment frequency from bi-weekly to multiple times per day per squad.",
    },
  },
  {
    slug: "analytics-dashboard",
    category: "Data Visualisation",
    ord: "03",
    title: "Real-Time Analytics Dashboard",
    tags: ["React", "D3.js", "WebSockets", "Performance"],
    description:
      "A high-density analytics interface rendering live metrics for 50,000+ data points with sub-100ms update latency across multiple chart types.",
    briefing: {
      problem:
        "The business intelligence team was using a third-party dashboard tool that couldn't handle the update frequency required for real-time inventory and pricing data. Charts would freeze under load, and the tool lacked the layout flexibility needed to display multi-dimension comparisons in a single viewport. The product team needed a custom solution that could sustain 30 WebSocket updates per second without dropping frames.",
      approach: [
        "Profiled rendering bottlenecks in a prototype and moved all heavy D3 computation off the main thread into Web Workers, freeing the UI thread for interaction.",
        "Implemented a double-buffer rendering strategy for time-series charts — computing the next frame while displaying the current one — achieving consistent 60fps under peak load.",
        "Designed a configurable layout system using CSS Grid and a JSON-based widget spec, allowing analysts to configure dashboard layouts without engineering support.",
        "Built a custom WebSocket connection manager with exponential back-off, reconnect logic, and a stale-data indicator to handle unreliable network conditions gracefully.",
      ],
      impact:
        "The dashboard sustained 30 updates/second at 60fps across 12 simultaneous chart instances on mid-range hardware. Analyst self-service for layout configuration reduced dashboard-change requests to the engineering team by 80%. The Web Worker architecture was subsequently extracted and open-sourced as a standalone library.",
      quote:
        "Treating rendering performance as a hard constraint from day one meant we never had to refactor our way out of a sluggish product.",
    },
    stack: [
      { name: "React", role: "Component and state layer" },
      { name: "D3.js", role: "Data transformation and SVG rendering" },
      { name: "Web Workers", role: "Off-thread computation" },
      { name: "WebSockets", role: "Real-time data transport" },
      { name: "Vitest", role: "Unit and integration testing" },
    ],
    meta: {
      title: "Real-Time Analytics Dashboard — Rishabh Kumar",
      description:
        "High-density analytics interface sustaining 30 WebSocket updates/second at 60fps — with a Web Worker rendering architecture that reduced engineering dashboard-change requests by 80%.",
    },
  },
]

const PROJECTS = [
  {
    title: "Study.IQ",
    subtitle: "EdTech Platform — 1M+ Users",
    description:
      "Led the React.js to Next.js migration and end-to-end rebuild of the checkout and payment flows — engineering backbone of a 9x web conversion lift.",
    category: "EdTech Platform",
    startDate: "February 2025",
    endDate: "October 2025",
    featured: true,
    tags: ["Next.js", "React", "Razorpay", "SEO", "TypeScript"],
    liveUrl: "",
    repoUrl: "",
    highlights: [
      "Led the React.js to Next.js migration — porting 30–40 routes, adopting App Router, refactoring to server components, and rebuilding the data-fetching layer for SSR; lifted Lighthouse Performance from ~40 to 75+.",
      "Integrated Razorpay as the primary payment gateway with Paytm and CCAvenue fallbacks — building webhook handling, retry logic, and failover on the backend — supporting a payment drop-off reduction from 9% to 4%.",
      "Built Continue Purchase Logic and rebuilt PDP, PLP, and Checkout flows end-to-end — the engineering backbone of a conversion initiative that drove a 9x web conversion lift (1.16% → 11.3%) measured by the product team.",
      "Implemented frontend SEO architecture supporting 71% organic traffic growth led by the product and SEO teams; redesigned the Homepage and built the Test Series module.",
    ],
    meta: {
      title: "Study.IQ EdTech Platform — Rishabh Kumar",
      description:
        "Next.js migration and checkout rebuild that drove a 9x conversion lift (1.16% → 11.3%) and 71% organic traffic growth for a 1M+ user EdTech platform.",
    },
  },
  {
    title: "Kanban Tab",
    subtitle: "Chrome Extension — New Tab Kanban Board",
    description:
      "Replaces the new-tab page with a unified Kanban board syncing Jira, GitHub, Asana, and Linear in real time. Built end-to-end with Manifest V3 and OAuth 2.0 flows for four integrations.",
    category: "Chrome Extension",
    startDate: "",
    endDate: "",
    featured: true,
    tags: ["Chrome Extension", "Manifest V3", "OAuth 2.0", "Jira", "GitHub", "Asana", "Linear"],
    liveUrl:
      "https://chromewebstore.google.com/detail/kanban-tab/hgigmmphphfldiiijfggneighbaiefcm",
    repoUrl: "",
    highlights: [
      "Replaces the new-tab page with a unified Kanban board syncing Jira, GitHub, Asana, and Linear in real time.",
      "Built end-to-end: Manifest V3 architecture, OAuth 2.0 flows for four integrations, and the real-time sync layer.",
    ],
    meta: {
      title: "Kanban Tab Chrome Extension — Rishabh Kumar",
      description:
        "Chrome extension that replaces the new-tab page with a unified Kanban board syncing Jira, GitHub, Asana, and Linear in real time via Manifest V3 and OAuth 2.0.",
    },
  },
  {
    title: "GitHub PR Reviewer",
    subtitle: "Agentic AI System",
    description:
      "LangChain and Mastra AI agent that ingests a GitHub PR URL, performs structured code review, and posts inline comments via the GitHub API.",
    category: "Agentic AI",
    startDate: "",
    endDate: "",
    featured: true,
    tags: ["LangChain", "Mastra AI", "GitHub API", "LLM", "Tool-Calling"],
    liveUrl: "",
    repoUrl: "",
    highlights: [
      "LangChain and Mastra AI agent that ingests a GitHub PR URL, performs structured code review, and posts inline comments via the GitHub API.",
      "Designed the prompt orchestration, tool-calling pipeline, and API integration end-to-end.",
    ],
    meta: {
      title: "GitHub PR Reviewer — Agentic AI — Rishabh Kumar",
      description:
        "LangChain and Mastra AI agent that ingests a GitHub PR URL, performs structured code review, and posts inline comments automatically via the GitHub API.",
    },
  },
  {
    title: "Guardian Services",
    subtitle: "Security Services Platform",
    description:
      "Architected and built the platform backend in Python and Flask — designing the data model, REST API, and service-scheduling logic end-to-end.",
    category: "Backend Platform",
    startDate: "",
    endDate: "",
    featured: false,
    tags: ["Python", "Flask", "REST API", "RBAC", "PostgreSQL"],
    liveUrl: "",
    repoUrl: "",
    highlights: [
      "Architected and built the platform backend in Python and Flask — designing the data model, REST API, and service-scheduling logic end-to-end.",
      "Implemented authentication, role-based access control (RBAC), and data encryption for sensitive user and service workflows.",
      "Owned the full lifecycle from API design through deployment, building service-management and scheduling features.",
    ],
    meta: {
      title: "Guardian Services Platform — Rishabh Kumar",
      description:
        "Python and Flask backend for a security services platform — data model design, REST API, RBAC, and service-scheduling logic built end-to-end.",
    },
  },
  {
    title: "Money Hive & Swallow Organics",
    subtitle: "Flutter Apps — Google Play",
    description:
      "Money Hive: Flutter finance app with multi-wallet data model, on-device AI categorisation, CSV/PDF export, and in-app purchase billing. Swallow Organics: Flutter Shopify storefront with full checkout via the Shopify Storefront API.",
    category: "Mobile Apps",
    startDate: "",
    endDate: "",
    featured: false,
    tags: ["Flutter", "Dart", "Shopify", "In-App Purchase", "Google Play"],
    liveUrl: "",
    repoUrl: "",
    highlights: [
      "Money Hive: Flutter finance app with multi-wallet data model, on-device AI categorisation, CSV/PDF export, and in-app purchase billing.",
      "Swallow Organics: Flutter Shopify storefront with full checkout via the Shopify Storefront API. Additional published apps: Dr. Maths, The Maze.",
    ],
    meta: {
      title: "Flutter Apps — Money Hive & Swallow Organics — Rishabh Kumar",
      description:
        "Two published Flutter apps — Money Hive (finance with on-device AI and in-app billing) and Swallow Organics (Shopify storefront with full checkout).",
    },
  },
  {
    title: "Next.js (vercel/next.js) — Merged Contributor",
    subtitle: "Open Source Contribution",
    description:
      "Authored and merged a fix to Next.js middleware error handling — invalid-URI requests returning HTTP 500 instead of 400. Resolved two open issues, passed 5 commits of review, merged into canary.",
    category: "Open Source",
    startDate: "",
    endDate: "",
    featured: false,
    tags: ["Next.js", "Open Source", "Middleware", "TypeScript"],
    liveUrl: "",
    repoUrl: "https://github.com/vercel/next.js/pull/36993",
    highlights: [
      "Authored and merged a fix to Next.js middleware error handling (invalid-URI requests returning HTTP 500 instead of 400). Resolved two open issues (#36964, #37025), passed 5 commits of review, merged into canary by maintainer @ijjk.",
      "Recognised as a Contributor on vercel/next.js (139k+ stars).",
    ],
    meta: {
      title: "Next.js Open Source Contribution — Rishabh Kumar",
      description:
        "Authored and merged a middleware error-handling fix to vercel/next.js — resolving two open issues and contributing to a 139k+ star repository.",
    },
  },
]

const EDUCATION = [
  {
    institution: "Amity University Online",
    degree: "Bachelor of Computer Application",
    location: "Noida, India",
    start: "",
    end: "2027",
    gpa: "CGPA 8.31 / 10",
    status: "expected",
    order: 1,
  },
  {
    institution: "GTB Computer Education",
    degree: "Diploma in Web Designing and Development",
    location: "Jalandhar, Punjab",
    start: "2016",
    end: "2017",
    gpa: "",
    status: "completed",
    order: 2,
  },
]

const CERTIFICATIONS = [
  {
    name: "MongoDB Associate Developer",
    issuer: "MongoDB",
    year: "2025",
    credentialUrl: "",
    order: 1,
  },
  {
    name: "Mastering the System Design Interview",
    issuer: "Udemy",
    year: "2025",
    credentialUrl: "",
    order: 2,
  },
  {
    name: "Legacy JavaScript Algorithms & Data Structures",
    issuer: "freeCodeCamp",
    year: "2023",
    credentialUrl: "",
    order: 3,
  },
]

const LEGAL_PAGES = [
  {
    title: "Privacy Policy",
    slug: "privacy",
    template: "legal" as const,
    lastUpdated: "2025-01-01T00:00:00.000Z",
    bodyText: `This Privacy Policy describes how thefalcon.dev ("this website", "I") handles information when you visit or use this personal portfolio site.

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
  {
    title: "Terms of Use",
    slug: "terms",
    template: "legal" as const,
    lastUpdated: "2025-01-01T00:00:00.000Z",
    bodyText: `These Terms of Use govern your access to and use of thefalcon.dev (the "Site"). By using the Site, you agree to these terms.

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
]

// ─── Clean ────────────────────────────────────────────────────────────────────

async function cleanDatabase(payload: Payload) {
  const collections = [
    "posts",
    "work",
    "projects",
    "timeline",
    "education",
    "certifications",
    "submissions",
    "search",
    "pages",
  ] as const

  for (const slug of collections) {
    try {
      const result = await payload.delete({
        collection: slug,
        where: { id: { exists: true } },
      })
      console.log(`  cleared ${slug}: ${result.docs.length} docs removed`)
    } catch {
      // collection may not have documents yet (e.g. search before first sync)
      console.log(`  skipped ${slug} (empty or not yet initialised)`)
    }
  }
}

// ─── Seed helpers ─────────────────────────────────────────────────────────────

async function seedTimeline(payload: Payload) {
  for (const entry of TIMELINE) {
    await payload.create({
      collection: "timeline",
      data: { ...entry, tags: entry.tags.map((tag) => ({ tag })) },
    })
    console.log(`  created: ${entry.company}`)
  }
}

async function seedWork(payload: Payload) {
  for (const entry of WORK) {
    await payload.create({
      collection: "work",
      data: {
        ...entry,
        status: "published" as const,
        tags: entry.tags.map((tag) => ({ tag })),
        briefing: {
          ...entry.briefing,
          approach: entry.briefing.approach.map((step) => ({ step })),
        },
      },
    })
    console.log(`  created: ${entry.title}`)
  }
}

async function seedProjects(payload: Payload) {
  for (const entry of PROJECTS) {
    await payload.create({
      collection: "projects",
      data: {
        ...entry,
        status: "published" as const,
        tags: entry.tags.map((tag) => ({ tag })),
        highlights: entry.highlights.map((point) => ({ point })),
      },
    })
    console.log(`  created: ${entry.title}`)
  }
}

async function seedEducation(payload: Payload) {
  for (const entry of EDUCATION) {
    await payload.create({ collection: "education", data: entry })
    console.log(`  created: ${entry.degree} @ ${entry.institution}`)
  }
}

async function seedCertifications(payload: Payload) {
  for (const entry of CERTIFICATIONS) {
    await payload.create({ collection: "certifications", data: entry })
    console.log(`  created: ${entry.name}`)
  }
}

async function seedLegalPages(payload: Payload) {
  for (const page of LEGAL_PAGES) {
    const { bodyText, ...rest } = page
    await payload.create({
      collection: "pages",
      data: { ...rest, body: textToLexical(bodyText) },
    })
    console.log(`  created: ${page.title}`)
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  loadEnvLocal()

  console.log("Connecting to Payload…")
  const { getPayload } = await import("payload")
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { default: config } = await import("../payload.config") as any

  const payload = await getPayload({ config })

  console.log("\nCleaning database…")
  await cleanDatabase(payload)

  console.log("\nSeeding Timeline…")
  await seedTimeline(payload)

  console.log("\nSeeding Work…")
  await seedWork(payload)

  console.log("\nSeeding Projects…")
  await seedProjects(payload)

  console.log("\nSeeding Education…")
  await seedEducation(payload)

  console.log("\nSeeding Certifications…")
  await seedCertifications(payload)

  console.log("\nSeeding Legal Pages…")
  await seedLegalPages(payload)

  console.log("\nDone.")
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
