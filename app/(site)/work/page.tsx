// app/(site)/work/page.tsx
import { getPayloadClient } from "@/lib/payload"
import { SelectedWork } from "@/components/sections/selected-work"
import { createMetadata } from "@/lib/metadata"
import type { WorkEntry } from "@/lib/types"

export const metadata = createMetadata({
  title: "Work",
  description: "Selected projects from 9+ years of full-stack engineering.",
})

export const revalidate = 60

export default async function WorkIndex() {
  let projects: WorkEntry[] = []

  try {
    projects = await fetchWorkEntries()
  } catch {
    // Payload not available — show empty state
  }

  return (
    <>
      <div className="pt-6 pb-10 border-b border-border">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-3">
          Selected Work
        </p>
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight leading-tight">
          Things I&apos;ve built.
        </h1>
        <p className="text-muted-foreground mt-4 max-w-2xl leading-relaxed">
          Three in-depth case studies spanning platform architecture, design systems,
          and data visualisation: each one a lesson in trade-offs, leadership, and craft.
        </p>
      </div>

      <SelectedWork projects={projects} variant="list" showSectionHeader={false} />
    </>
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
    tags: doc.tags?.map((t) => t.tag ?? "") ?? [],
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
