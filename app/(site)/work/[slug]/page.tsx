// app/(site)/work/[slug]/page.tsx
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getPayloadClient } from "@/lib/payload"
import { ProjectBriefing } from "@/components/sections/project-briefing"
import { createMetadata } from "@/lib/metadata"
import type { WorkEntry } from "@/lib/types"

export const revalidate = 60

interface WorkDetailProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: WorkDetailProps): Promise<Metadata> {
  const { slug } = await params
  try {
    const entries = await fetchWorkEntries()
    const project = entries.find((p) => p.slug === slug)
    if (!project) return {}
    return createMetadata({ title: project.title, description: project.description })
  } catch {
    return {}
  }
}

export default async function WorkDetail({ params }: WorkDetailProps) {
  const { slug } = await params

  let project: WorkEntry | null = null
  let prevProject: Pick<WorkEntry, "slug" | "title"> | null = null
  let nextProject: Pick<WorkEntry, "slug" | "title"> | null = null

  try {
    const all = await fetchWorkEntries()
    const idx = all.findIndex((p) => p.slug === slug)
    if (idx === -1) notFound()
    project = all[idx]
    prevProject = idx > 0 ? { slug: all[idx - 1].slug, title: all[idx - 1].title } : null
    nextProject =
      idx < all.length - 1 ? { slug: all[idx + 1].slug, title: all[idx + 1].title } : null
  } catch {
    notFound()
  }

  if (!project) notFound()

  return (
    <ProjectBriefing project={project} prevProject={prevProject} nextProject={nextProject} />
  )
}

async function fetchWorkEntries(): Promise<WorkEntry[]> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: "work",
    where: { status: { equals: "published" } },
    sort: "ord",
    limit: 50,
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
