import { unstable_cache } from 'next/cache'
import { getPayloadClient } from './payload'
import type { Where } from 'payload'
import { mapPayloadPost } from './posts'
import { CACHE_TAGS } from './cache-tags'
import type {
  Post,
  WorkEntry,
  ProjectEntry,
  TimelineEntry,
  EducationEntry,
  CertificationEntry,
} from './types'

// ─── Posts ────────────────────────────────────────────────────────────────────

export interface RawPostDoc {
  id: string
  title: string
  slug: string
  excerpt?: string | null
  featured?: boolean | null
  publishedAt?: string | null
  readingTime?: number | null
  cover?: { url: string; width?: number | null; height?: number | null; alt?: string | null } | null
  // string[] after the tags migration; Array<{ tag }> for docs not yet migrated
  tags?: Array<string | { tag?: string | null }> | null
  body?: unknown
  updatedAt: string
  meta?: {
    title?: string | null
    description?: string | null
    image?: { url?: string | null } | string | null
  } | null
}

const _getCachedPosts = unstable_cache(
  async (): Promise<Post[]> => {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'posts',
      where: { status: { equals: 'published' } },
      sort: '-publishedAt',
      limit: 50,
      depth: 1,
    })
    return result.docs.map((d) => mapPayloadPost(d as unknown as RawPostDoc))
  },
  ['posts'],
  { tags: [CACHE_TAGS.posts], revalidate: false }
)

export async function getCachedPosts(): Promise<Post[]> {
  return _getCachedPosts()
}

const _getCachedPost = unstable_cache(
  async (slug: string): Promise<RawPostDoc | null> => {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'posts',
      where: { and: [{ slug: { equals: slug } }, { status: { equals: 'published' } }] } as Where,
      limit: 1,
      depth: 1,
    })
    return (result.docs[0] as unknown as RawPostDoc) ?? null
  },
  ['post'],
  { tags: [CACHE_TAGS.posts], revalidate: false }
)

export const getCachedPost = (slug: string) => _getCachedPost(slug)

export async function getCachedRelatedPosts(
  postSlug: string,
  tags: string[]
): Promise<Post[]> {
  const payload = await getPayloadClient()

  if (tags.length) {
    const result = await payload.find({
      collection: 'posts',
      where: {
        and: [
          { status: { equals: 'published' } },
          { slug: { not_equals: postSlug } },
          { tags: { in: tags } },
        ],
      } as Where,
      sort: '-publishedAt',
      limit: 3,
      depth: 1,
    })
    const docs = result.docs.map((d) => mapPayloadPost(d as unknown as RawPostDoc))
    if (docs.length >= 3) return docs

    const existing = new Set(docs.map((d) => d.slug))
    existing.add(postSlug)
    const recent = await _fetchRecentPosts(postSlug, existing)
    return [...docs, ...recent].slice(0, 3)
  }

  return _fetchRecentPosts(postSlug)
}

async function _fetchRecentPosts(excludeSlug: string, excludeSlugs?: Set<string>): Promise<Post[]> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'posts',
    where: {
      and: [{ status: { equals: 'published' } }, { slug: { not_equals: excludeSlug } }],
    } as Where,
    sort: '-publishedAt',
    limit: 6,
    depth: 1,
  })
  const all = result.docs.map((d) => mapPayloadPost(d as unknown as RawPostDoc))
  if (!excludeSlugs) return all.slice(0, 3)
  return all.filter((p) => !excludeSlugs.has(p.slug)).slice(0, 3)
}

const _getSitemapPosts = unstable_cache(
  async () => {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'posts',
      where: { status: { equals: 'published' } },
      sort: '-publishedAt',
      limit: 1000,
      depth: 0,
    })
    return (result.docs as unknown as RawPostDoc[]).map((d) => ({
      slug: d.slug,
      publishedAt: d.publishedAt ?? null,
      updatedAt: d.updatedAt,
    }))
  },
  ['sitemap-posts'],
  { tags: [CACHE_TAGS.posts], revalidate: false }
)

export async function getSitemapPosts(): Promise<
  { slug: string; publishedAt: string | null; updatedAt: string }[]
> {
  return _getSitemapPosts()
}

// ─── Work ─────────────────────────────────────────────────────────────────────

interface RawWorkDoc {
  id: string
  title: string
  slug: string
  category?: string | null
  ord?: string | null
  description?: string | null
  tags?: Array<{ tag?: string | null }> | null
  briefing?: {
    problem?: string | null
    approach?: Array<{ step?: string | null }> | null
    impact?: string | null
    quote?: string | null
  } | null
  stack?: Array<{ name?: string | null; role?: string | null }> | null
  cover?: { url?: string | null; width?: number | null; height?: number | null; alt?: string | null } | null
  updatedAt?: string
  meta?: {
    title?: string | null
    description?: string | null
    image?: { url?: string | null; width?: number | null; height?: number | null; alt?: string | null } | string | null
  } | null
}

function mapWorkDoc(d: RawWorkDoc): WorkEntry {
  return {
    id: String(d.id),
    slug: d.slug,
    title: d.title,
    category: d.category ?? '',
    ord: d.ord ?? '',
    tags: d.tags?.map((t) => t.tag ?? '') ?? [],
    description: d.description ?? '',
    briefing: {
      problem: d.briefing?.problem ?? '',
      approach: d.briefing?.approach?.map((a) => a.step ?? '') ?? [],
      impact: d.briefing?.impact ?? '',
      quote: d.briefing?.quote ?? '',
    },
    stack: (d.stack ?? []).map((s) => ({ name: s.name ?? '', role: s.role ?? '' })),
    cover: typeof d.cover === 'object' ? d.cover : null,
    meta: d.meta
      ? {
          title: d.meta.title,
          description: d.meta.description,
          image: typeof d.meta.image === 'object' ? d.meta.image : null,
        }
      : d.meta,
  }
}

const _getCachedWorkEntries = unstable_cache(
  async (): Promise<WorkEntry[]> => {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'work',
      where: { status: { equals: 'published' } },
      sort: 'ord',
      limit: 50,
      depth: 1,
    })
    return (result.docs as unknown as RawWorkDoc[]).map(mapWorkDoc)
  },
  ['work-entries'],
  { tags: [CACHE_TAGS.work], revalidate: false }
)

export async function getCachedWorkEntries(): Promise<WorkEntry[]> {
  return _getCachedWorkEntries()
}

const _getSitemapWork = unstable_cache(
  async () => {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'work',
      where: { status: { equals: 'published' } },
      sort: 'ord',
      limit: 1000,
      depth: 0,
    })
    return (result.docs as unknown as RawWorkDoc[]).map((d) => ({
      slug: d.slug,
      updatedAt: d.updatedAt ?? '',
    }))
  },
  ['sitemap-work'],
  { tags: [CACHE_TAGS.work], revalidate: false }
)

export async function getSitemapWork(): Promise<{ slug: string; updatedAt: string }[]> {
  return _getSitemapWork()
}

// ─── Projects ─────────────────────────────────────────────────────────────────

interface RawProjectDoc {
  id: string
  title: string
  subtitle?: string | null
  description?: string | null
  category?: string | null
  featured?: boolean | null
  liveUrl?: string | null
  repoUrl?: string | null
  startDate?: string | null
  endDate?: string | null
  tags?: Array<{ tag?: string | null }> | null
  highlights?: Array<{ point?: string | null }> | null
}

const _getCachedProjects = unstable_cache(
  async (): Promise<ProjectEntry[]> => {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'projects',
      where: { status: { equals: 'published' } },
      limit: 50,
      depth: 0,
    })
    return (result.docs as unknown as RawProjectDoc[]).map((d) => ({
      id: String(d.id),
      title: d.title,
      subtitle: d.subtitle ?? undefined,
      description: d.description ?? undefined,
      category: d.category ?? undefined,
      tags: d.tags?.map((t) => t.tag ?? '') ?? [],
      liveUrl: d.liveUrl ?? undefined,
      repoUrl: d.repoUrl ?? undefined,
      startDate: d.startDate ?? undefined,
      endDate: d.endDate ?? undefined,
      highlights: d.highlights?.map((h) => h.point ?? '') ?? [],
      featured: d.featured ?? false,
    }))
  },
  ['projects'],
  { tags: [CACHE_TAGS.projects], revalidate: false }
)

export async function getCachedProjects(): Promise<ProjectEntry[]> {
  return _getCachedProjects()
}

// ─── Timeline ─────────────────────────────────────────────────────────────────

interface RawTimelineDoc {
  id: string
  company: string
  role: string
  start: string
  end?: string | null
  summary?: string | null
  tags?: Array<{ tag?: string | null }> | null
  order?: number | null
}

const _getCachedTimeline = unstable_cache(
  async (): Promise<TimelineEntry[]> => {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'timeline',
      sort: 'order',
      limit: 20,
      depth: 0,
    })
    return (result.docs as unknown as RawTimelineDoc[]).map((d) => ({
      id: String(d.id),
      company: d.company,
      role: d.role,
      start: d.start,
      end: d.end ?? null,
      summary: d.summary ?? undefined,
      tags: d.tags?.map((t) => t.tag ?? '') ?? [],
      order: d.order ?? undefined,
    }))
  },
  ['timeline'],
  { tags: [CACHE_TAGS.timeline], revalidate: false }
)

export async function getCachedTimeline(): Promise<TimelineEntry[]> {
  return _getCachedTimeline()
}

// ─── Education ────────────────────────────────────────────────────────────────

interface RawEducationDoc {
  id: string
  institution: string
  degree: string
  location?: string | null
  start?: string | null
  end?: string | null
  gpa?: string | null
  status?: string | null
  order?: number | null
}

const _getCachedEducation = unstable_cache(
  async (): Promise<EducationEntry[]> => {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'education',
      sort: 'order',
      limit: 20,
      depth: 0,
    })
    return (result.docs as unknown as RawEducationDoc[]).map((d) => ({
      id: String(d.id),
      institution: d.institution,
      degree: d.degree,
      location: d.location ?? undefined,
      start: d.start ?? undefined,
      end: d.end ?? undefined,
      gpa: d.gpa ?? undefined,
      status: (d.status as EducationEntry['status']) ?? undefined,
      order: d.order ?? undefined,
    }))
  },
  ['education'],
  { tags: [CACHE_TAGS.education], revalidate: false }
)

export async function getCachedEducation(): Promise<EducationEntry[]> {
  return _getCachedEducation()
}

// ─── Certifications ───────────────────────────────────────────────────────────

interface RawCertificationDoc {
  id: string
  name: string
  issuer: string
  year: string
  credentialUrl?: string | null
  order?: number | null
}

const _getCachedCertifications = unstable_cache(
  async (): Promise<CertificationEntry[]> => {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'certifications',
      sort: 'order',
      limit: 20,
      depth: 0,
    })
    return (result.docs as unknown as RawCertificationDoc[]).map((d) => ({
      id: String(d.id),
      name: d.name,
      issuer: d.issuer,
      year: d.year,
      credentialUrl: d.credentialUrl ?? undefined,
      order: d.order ?? undefined,
    }))
  },
  ['certifications'],
  { tags: [CACHE_TAGS.certifications], revalidate: false }
)

export async function getCachedCertifications(): Promise<CertificationEntry[]> {
  return _getCachedCertifications()
}

// ─── Pages ────────────────────────────────────────────────────────────────────

export interface RawPageDoc {
  id?: string
  title?: string
  slug: string
  template: string
  lastUpdated?: string | null
  updatedAt: string
  body?: unknown
  meta?: {
    title?: string | null
    description?: string | null
    image?: { url?: string | null } | string | null
  } | null
}

const _getSitemapPages = unstable_cache(
  async () => {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'pages',
      limit: 1000,
      depth: 0,
    })
    return (result.docs as unknown as RawPageDoc[]).map((d) => ({
      slug: d.slug,
      template: d.template as 'legal' | 'basic',
      lastUpdated: d.lastUpdated ?? null,
      updatedAt: d.updatedAt,
    }))
  },
  ['sitemap-pages'],
  { tags: [CACHE_TAGS.pages], revalidate: false }
)

export async function getSitemapPages(): Promise<
  { slug: string; template: 'legal' | 'basic'; lastUpdated: string | null; updatedAt: string }[]
> {
  return _getSitemapPages()
}

const _getCachedBasicPage = unstable_cache(
  async (slug: string): Promise<RawPageDoc | null> => {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'pages',
      where: { and: [{ slug: { equals: slug } }, { template: { equals: 'basic' } }] } as Where,
      limit: 1,
      depth: 1,
    })
    return (result.docs[0] as unknown as RawPageDoc) ?? null
  },
  ['basic-page'],
  { tags: [CACHE_TAGS.pages], revalidate: false }
)

export const getCachedBasicPage = (slug: string) => _getCachedBasicPage(slug)

const _getCachedLegalPage = unstable_cache(
  async (slug: string): Promise<RawPageDoc | null> => {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'pages',
      where: { and: [{ slug: { equals: slug } }, { template: { equals: 'legal' } }] } as Where,
      limit: 1,
      depth: 1,
    })
    return (result.docs[0] as unknown as RawPageDoc) ?? null
  },
  ['legal-page'],
  { tags: [CACHE_TAGS.pages], revalidate: false }
)

export const getCachedLegalPage = (slug: string) => _getCachedLegalPage(slug)

// ─── Site Settings ────────────────────────────────────────────────────────────

export interface RawSiteSettings {
  availability?: { available?: boolean | null; label?: string | null } | null
  headline?: string | null
  subheadline?: string | null
  eyebrow?: string | null
  stats?: Array<{ value: string; label: string }> | null
  identity?: {
    name?: string | null
    handle?: string | null
    role?: string | null
    location?: string | null
    timezone?: string | null
    email?: string | null
    siteUrl?: string | null
    description?: string | null
    alternateName?: string | null
    addressCity?: string | null
    addressRegion?: string | null
    addressCountry?: string | null
  } | null
  socials?: Array<{ platform: string; url: string; label?: string | null }> | null
  philosophy?: Array<{ title: string; body: string }> | null
  resume?: { url?: string | null; filename?: string | null } | null
}

const _getCachedSiteSettings = unstable_cache(
  async (): Promise<RawSiteSettings | null> => {
    const payload = await getPayloadClient()
    const result = await payload.findGlobal({ slug: 'site-settings', depth: 1 })
    return result as unknown as RawSiteSettings
  },
  ['site-settings'],
  { tags: [CACHE_TAGS.home], revalidate: false }
)

export async function getCachedSiteSettings(): Promise<RawSiteSettings | null> {
  try {
    return await _getCachedSiteSettings()
  } catch {
    return null
  }
}

// ─── Draft/Preview Fetchers ───────────────────────────────────────────────────

export async function getPreviewPost(slug: string): Promise<RawPostDoc | null> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'posts',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 1,
    overrideAccess: true,
  })
  return (result.docs[0] as unknown as RawPostDoc) ?? null
}

export async function getPreviewPage(slug: string, template?: string): Promise<RawPageDoc | null> {
  const payload = await getPayloadClient()
  const where: Where = { slug: { equals: slug } }
  if (template) where.template = { equals: template }
  const result = await payload.find({
    collection: 'pages',
    where,
    limit: 1,
    depth: 1,
    overrideAccess: true,
  })
  return (result.docs[0] as unknown as RawPageDoc) ?? null
}
