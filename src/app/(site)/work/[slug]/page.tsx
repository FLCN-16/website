import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPayloadClient } from '@/lib/payload'
import { getCachedWorkEntries, getCachedSiteSettings } from '@/lib/data'
import { ProjectBriefing } from '@/components/sections/project-briefing'
import { createMetadata, resolveMetaImage } from '@/lib/metadata'
import { JsonLd } from '@/components/structured-data/json-ld'
import { breadcrumbSchema, personRef } from '@/lib/structured-data'
import { buildIdentity } from '@/lib/site-identity'
import type { WorkEntry } from '@/lib/types'

interface WorkDetailProps {
  params: Promise<{ slug: string }>
}

export const revalidate = false
export const dynamicParams = true

export async function generateStaticParams() {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'work',
    where: { status: { equals: 'published' } },
    limit: 1000,
    depth: 0,
  })
  return result.docs.map((doc) => ({ slug: String(doc.slug) }))
}

export async function generateMetadata({ params }: WorkDetailProps): Promise<Metadata> {
  const { slug } = await params
  try {
    const [entries, settings] = await Promise.all([getCachedWorkEntries(), getCachedSiteSettings()])
    const project = entries.find((p) => p.slug === slug)
    if (!project) return {}
    const identity = buildIdentity(settings)
    return createMetadata({
      kind: 'WORK',
      type: 'article',
      title: project.meta?.title || project.title,
      description: project.meta?.description || project.description,
      image: resolveMetaImage(project.meta?.image) ?? resolveMetaImage(project.cover),
      path: `/work/${slug}`,
      identity,
    })
  } catch {
    return {}
  }
}

export default async function WorkDetail({ params }: WorkDetailProps) {
  const { slug } = await params

  let project: WorkEntry | null = null
  let prevProject: Pick<WorkEntry, 'slug' | 'title'> | null = null
  let nextProject: Pick<WorkEntry, 'slug' | 'title'> | null = null

  try {
    const all = await getCachedWorkEntries()
    const idx = all.findIndex((p) => p.slug === slug)
    if (idx !== -1) {
      project = all[idx]
      prevProject = idx > 0 ? { slug: all[idx - 1].slug, title: all[idx - 1].title } : null
      nextProject =
        idx < all.length - 1
          ? { slug: all[idx + 1].slug, title: all[idx + 1].title }
          : null
    }
  } catch {
    // Payload not available
  }

  if (!project) notFound()

  const settings = await getCachedSiteSettings().catch(() => null)
  const identity = buildIdentity(settings)

  const workSchema = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: project.meta?.description || project.description,
    url: `${identity.url}/work/${slug}`,
    author: personRef(identity),
    inLanguage: 'en',
    ...(project.tags.length ? { keywords: project.tags.join(', ') } : {}),
  }

  const breadcrumbs = breadcrumbSchema(identity, [
    { name: 'Home', path: '/' },
    { name: 'Work', path: '/work' },
    { name: project.title },
  ])

  return (
    <>
      <JsonLd data={workSchema} />
      <JsonLd data={breadcrumbs} />
      <ProjectBriefing project={project} prevProject={prevProject} nextProject={nextProject} />
    </>
  )
}
