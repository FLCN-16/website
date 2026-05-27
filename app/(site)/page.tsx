// app/(site)/page.tsx
import { getPayloadClient } from "@/lib/payload"
import { Hero } from "@/components/sections/hero"
import { Journey } from "@/components/sections/journey"
import { Philosophy } from "@/components/sections/philosophy"
import { SelectedWork } from "@/components/sections/selected-work"
import { ProjectsGrid } from "@/components/sections/projects-grid"
import { CtaBanner } from "@/components/sections/cta-banner"
import { site } from "@/content/site"
import { philosophy } from "@/content/philosophy"
import { createMetadata } from "@/lib/metadata"
import type { WorkEntry, ProjectEntry, TimelineEntry } from "@/lib/types"

export const revalidate = 60

export const metadata = createMetadata({
  title: "About",
  description: site.subheadline,
})

export default async function Home() {
  let workEntries: WorkEntry[] = []
  let featuredProjects: ProjectEntry[] = []
  let timelineItems: TimelineEntry[] = []

  try {
    const [workResult, projectsResult, timelineResult] = await Promise.allSettled([
      fetchWork(),
      fetchFeaturedProjects(),
      fetchTimeline(),
    ])
    if (workResult.status === "fulfilled") workEntries = workResult.value
    if (projectsResult.status === "fulfilled") featuredProjects = projectsResult.value
    if (timelineResult.status === "fulfilled") timelineItems = timelineResult.value
  } catch {
    // Payload not available — show empty state
  }

  return (
    <>
      <Hero
        eyebrow={site.eyebrow}
        headline={site.headline}
        subheadline={site.subheadline}
        status={site.status}
        stats={site.stats}
        primaryCta={{ label: "View My Work", href: "/work" }}
        secondaryCta={{ label: "Get In Touch", href: "/contact" }}
      />
      <Journey items={timelineItems} />
      <Philosophy
        eyebrow={philosophy.eyebrow}
        heading={philosophy.heading}
        pillars={philosophy.pillars}
      />
      <SelectedWork projects={workEntries} showViewAll />
      {featuredProjects.length > 0 && (
        <ProjectsGrid projects={featuredProjects} showViewAll />
      )}
      <CtaBanner
        eyebrow="Let's work together"
        heading="Open to new opportunities"
        body="I'm selectively exploring senior frontend and tech-lead roles at product companies. If you're building something ambitious and care about craft, let's talk."
        primaryCta={{ label: "Get In Touch", href: "/contact" }}
        secondaryCta={{ label: "View My Stack", href: "/stack" }}
      />
    </>
  )
}

async function fetchWork(): Promise<WorkEntry[]> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: "work",
    where: { status: { equals: "published" } },
    sort: "ord",
    limit: 3,
    depth: 0,
  })
  return result.docs.map((doc) => ({
    id: String(doc.id),
    slug: doc.slug,
    title: doc.title,
    category: doc.category ?? "",
    ord: doc.ord ?? "",
    tags: doc.tags?.map((t: { tag?: string }) => t.tag ?? "") ?? [],
    description: doc.description ?? "",
    briefing: {
      problem: (doc.briefing as { problem?: string } | null)?.problem ?? "",
      approach:
        ((doc.briefing as { approach?: { step?: string }[] } | null)?.approach ?? []).map(
          (a) => a.step ?? ""
        ),
      impact: (doc.briefing as { impact?: string } | null)?.impact ?? "",
      quote: (doc.briefing as { quote?: string } | null)?.quote ?? "",
    },
    stack: ((doc.stack as { name?: string; role?: string }[] | null) ?? []).map((s) => ({
      name: s.name ?? "",
      role: s.role ?? "",
    })),
  }))
}

async function fetchFeaturedProjects(): Promise<ProjectEntry[]> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: "projects",
    where: {
      and: [{ status: { equals: "published" } }, { featured: { equals: true } }],
    },
    limit: 6,
    depth: 0,
  })
  return result.docs.map((doc) => ({
    id: String(doc.id),
    title: doc.title,
    subtitle: doc.subtitle ?? undefined,
    description: doc.description ?? undefined,
    category: doc.category ?? undefined,
    tags: doc.tags?.map((t: { tag?: string }) => t.tag ?? "") ?? [],
    liveUrl: doc.liveUrl ?? undefined,
    repoUrl: doc.repoUrl ?? undefined,
    startDate: doc.startDate ?? undefined,
    endDate: doc.endDate ?? undefined,
    highlights: doc.highlights?.map((h: { point?: string }) => h.point ?? "") ?? [],
    featured: doc.featured ?? false,
  }))
}

async function fetchTimeline(): Promise<TimelineEntry[]> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: "timeline",
    sort: "order",
    limit: 20,
    depth: 0,
  })
  return result.docs.map((doc) => ({
    id: String(doc.id),
    company: doc.company,
    role: doc.role,
    start: doc.start,
    end: doc.end ?? null,
    summary: doc.summary ?? undefined,
    tags: doc.tags?.map((t: { tag?: string }) => t.tag ?? "") ?? [],
    order: doc.order ?? undefined,
  }))
}
