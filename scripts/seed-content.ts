/**
 * One-shot Payload CMS seed script — populates Timeline, Projects, Education, Certifications.
 * Run: pnpm seed:content
 *
 * Reads env vars from .env.local automatically (MONGODB_URI, PAYLOAD_SECRET required).
 * env must be loaded before payload.config is imported (buildConfig reads process.env).
 */

import { readFileSync } from "fs"
import { resolve } from "path"
import type { Payload } from "payload"

// Synchronous env load — must run before payload.config is dynamically imported below
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

// ─── Seed helpers ─────────────────────────────────────────────────────────────

async function upsertTimeline(payload: Payload) {
  for (const entry of TIMELINE) {
    const existing = await payload.find({
      collection: "timeline",
      where: { company: { equals: entry.company } },
      limit: 1,
    })
    if (existing.docs.length) {
      await payload.update({
        collection: "timeline",
        id: existing.docs[0].id,
        data: { ...entry, tags: entry.tags.map((tag) => ({ tag })) },
      })
      console.log(`  updated: ${entry.company}`)
    } else {
      await payload.create({
        collection: "timeline",
        data: { ...entry, tags: entry.tags.map((tag) => ({ tag })) },
      })
      console.log(`  created: ${entry.company}`)
    }
  }
}

async function upsertProjects(payload: Payload) {
  for (const entry of PROJECTS) {
    const existing = await payload.find({
      collection: "projects",
      where: { title: { equals: entry.title } },
      limit: 1,
    })
    const data = {
      ...entry,
      status: "published" as const,
      tags: entry.tags.map((tag) => ({ tag })),
      highlights: entry.highlights.map((point) => ({ point })),
    }
    if (existing.docs.length) {
      await payload.update({ collection: "projects", id: existing.docs[0].id, data })
      console.log(`  updated: ${entry.title}`)
    } else {
      await payload.create({ collection: "projects", data })
      console.log(`  created: ${entry.title}`)
    }
  }
}

async function upsertEducation(payload: Payload) {
  for (const entry of EDUCATION) {
    const existing = await payload.find({
      collection: "education",
      where: {
        and: [
          { institution: { equals: entry.institution } },
          { degree: { equals: entry.degree } },
        ],
      },
      limit: 1,
    })
    if (existing.docs.length) {
      await payload.update({ collection: "education", id: existing.docs[0].id, data: entry })
      console.log(`  updated: ${entry.degree} @ ${entry.institution}`)
    } else {
      await payload.create({ collection: "education", data: entry })
      console.log(`  created: ${entry.degree} @ ${entry.institution}`)
    }
  }
}

async function upsertCertifications(payload: Payload) {
  for (const entry of CERTIFICATIONS) {
    const existing = await payload.find({
      collection: "certifications",
      where: { name: { equals: entry.name } },
      limit: 1,
    })
    if (existing.docs.length) {
      await payload.update({ collection: "certifications", id: existing.docs[0].id, data: entry })
      console.log(`  updated: ${entry.name}`)
    } else {
      await payload.create({ collection: "certifications", data: entry })
      console.log(`  created: ${entry.name}`)
    }
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  // Load env first — payload.config is dynamically imported below so buildConfig
  // runs AFTER process.env is populated
  loadEnvLocal()

  console.log("Connecting to Payload…")
  const { getPayload } = await import("payload")
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { default: config } = await import("../payload.config") as any

  const payload = await getPayload({ config })

  console.log("\nSeeding Timeline…")
  await upsertTimeline(payload)

  console.log("\nSeeding Projects…")
  await upsertProjects(payload)

  console.log("\nSeeding Education…")
  await upsertEducation(payload)

  console.log("\nSeeding Certifications…")
  await upsertCertifications(payload)

  console.log("\nDone.")
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
