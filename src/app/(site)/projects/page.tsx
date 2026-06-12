import { getCachedProjects, getCachedSiteSettings } from '@/lib/data'
import { ProjectsGrid } from '@/components/sections/projects-grid'
import { createMetadata } from '@/lib/metadata'
import { buildIdentity } from '@/lib/site-identity'
import type { ProjectEntry } from '@/lib/types'

export const revalidate = false

export async function generateMetadata() {
  const settings = await getCachedSiteSettings()
  const identity = buildIdentity(settings)
  return createMetadata({
    kind: 'PROJECTS',
    title: 'Projects',
    description: 'Side projects, Chrome extensions, mobile apps, and open-source contributions.',
    path: '/projects',
    identity,
  })
}

export default async function ProjectsIndex() {
  let projects: ProjectEntry[] = []

  try {
    projects = await getCachedProjects()
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
