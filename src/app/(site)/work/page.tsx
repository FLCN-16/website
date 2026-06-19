import { getCachedWorkEntries, getCachedSiteSettings } from '@/lib/data'
import { SelectedWork } from '@/components/sections/selected-work'
import { createMetadata } from '@/lib/metadata'
import { buildIdentity } from '@/lib/site-identity'
import { JsonLd } from '@/components/structured-data/json-ld'
import { graph, collectionPageNode, breadcrumbNode } from '@/lib/structured-data'
import type { WorkEntry } from '@/lib/types'

export const revalidate = false

export async function generateMetadata() {
  const settings = await getCachedSiteSettings()
  const identity = buildIdentity(settings)
  return createMetadata({
    kind: 'WORK',
    title: 'Work',
    description: 'Selected projects from 9+ years of full-stack engineering.',
    path: '/work',
    identity,
  })
}

export default async function WorkIndex() {
  const [projects, settings] = await Promise.all([
    getCachedWorkEntries().catch((): WorkEntry[] => []),
    getCachedSiteSettings().catch(() => null),
  ])
  const identity = buildIdentity(settings)

  return (
    <>
      <JsonLd data={graph([
        collectionPageNode(identity, {
          path: '/work',
          name: 'Work',
          description: 'Selected projects from 9+ years of full-stack engineering.',
          items: projects.map((p, i) => ({
            name: p.title,
            url: `${identity.url}/work/${p.slug}`,
            description: p.description ?? undefined,
            imageUrl: p.cover?.url ?? undefined,
            position: i + 1,
          })),
        }),
        breadcrumbNode(identity, [
          { name: 'Home', path: '/' },
          { name: 'Work', path: '/work' },
        ], '/work'),
      ])} />
      <div className="pt-6 pb-10">
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
