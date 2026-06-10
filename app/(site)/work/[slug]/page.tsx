import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPayloadClient } from '@/lib/payload'
import { getCachedWorkEntries } from '@/lib/data'
import { ProjectBriefing } from '@/components/sections/project-briefing'
import { createMetadata } from '@/lib/metadata'
import { JsonLd } from '@/components/structured-data/json-ld'
import { breadcrumbSchema, personRef } from '@/lib/structured-data'
import { site } from '@/content/site'
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
    const entries = await getCachedWorkEntries()
    const project = entries.find((p) => p.slug === slug)
    if (!project) return {}
    return createMetadata({
      kind: 'WORK',
      title: project.meta?.title || project.title,
      description: project.meta?.description || project.description,
      image: typeof project.meta?.image === 'object' ? project.meta?.image?.url ?? undefined : undefined,
      path: `/work/${slug}`,
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

  const workSchema = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: project.meta?.description || project.description,
    url: `${site.url}/work/${slug}`,
    author: personRef(),
    inLanguage: 'en',
    ...(project.tags.length ? { keywords: project.tags.join(', ') } : {}),
  }

  const breadcrumbs = breadcrumbSchema([
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
