import { getCachedProjects, getCachedSiteSettings } from '@/lib/data'
import { ProjectsGrid } from '@/components/sections/projects-grid'
import { createMetadata } from '@/lib/metadata'
import { buildIdentity } from '@/lib/site-identity'
import { JsonLd } from '@/components/structured-data/json-ld'
import { graph, collectionPageNode, breadcrumbNode } from '@/lib/structured-data'
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
  const [projects, settings] = await Promise.all([
    getCachedProjects().catch((): ProjectEntry[] => []),
    getCachedSiteSettings().catch(() => null),
  ])
  const identity = buildIdentity(settings)

  return (
    <>
      <JsonLd data={graph([
        collectionPageNode(identity, {
          path: '/projects',
          name: 'Projects',
          description: 'Side projects, Chrome extensions, mobile apps, and open-source contributions.',
          items: projects.map((p, i) => ({
            name: p.title,
            url: p.liveUrl ?? p.repoUrl ?? `${identity.url}/projects`,
            description: p.description ?? p.subtitle ?? undefined,
            position: i + 1,
          })),
        }),
        breadcrumbNode(identity, [
          { name: 'Home', path: '/' },
          { name: 'Projects', path: '/projects' },
        ], '/projects'),
      ])} />
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
