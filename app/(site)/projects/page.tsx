// app/(site)/projects/page.tsx
import { getPayloadClient } from "@/lib/payload"
import { ProjectsGrid } from "@/components/sections/projects-grid"
import { createMetadata } from "@/lib/metadata"
import type { ProjectEntry } from "@/lib/types"

export const metadata = createMetadata({
  title: "Projects",
  description: "Side projects, Chrome extensions, mobile apps, and open-source contributions.",
})

export const revalidate = 60

export default async function ProjectsIndex() {
  let projects: ProjectEntry[] = []

  try {
    projects = await fetchProjects()
  } catch {
    // Payload not available — show empty state
  }

  return (
    <>
      <div className="pt-6 pb-10 border-b border-border">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-3">
          Projects
        </p>
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight leading-tight">
          Things I&apos;ve shipped.
        </h1>
        <p className="text-muted-foreground mt-4 max-w-2xl leading-relaxed">
          Side projects, client work, Chrome extensions, mobile apps, and open-source contributions.
        </p>
      </div>
      <ProjectsGrid projects={projects} showSectionHeader={false} />
    </>
  )
}

async function fetchProjects(): Promise<ProjectEntry[]> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: "projects",
    where: { status: { equals: "published" } },
    limit: 50,
    depth: 0,
  })
  return result.docs.map((doc) => ({
    id: String(doc.id),
    title: doc.title,
    subtitle: doc.subtitle ?? undefined,
    description: doc.description ?? undefined,
    category: doc.category ?? undefined,
    tags: doc.tags?.map((t) => t.tag ?? "") ?? [],
    liveUrl: doc.liveUrl ?? undefined,
    repoUrl: doc.repoUrl ?? undefined,
    startDate: doc.startDate ?? undefined,
    endDate: doc.endDate ?? undefined,
    highlights: doc.highlights?.map((h) => h.point ?? "") ?? [],
    featured: doc.featured ?? false,
  }))
}
