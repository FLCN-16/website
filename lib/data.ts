import { restFetch } from './rest'
import type { PayloadListResponse } from './rest'
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
  tags?: { tag?: string | null }[]
  body?: unknown
  updatedAt: string
  // meta.image resolves to an object at depth=1 (single-doc fetches) or a string ID at depth=0 (getSitemapPosts)
  meta?: {
    title?: string | null
    description?: string | null
    image?: { url?: string | null } | string | null
  } | null
}

export async function getCachedPosts(): Promise<Post[]> {
  const data = await restFetch<PayloadListResponse<RawPostDoc>>(
    'posts?where[status][equals]=published&sort=-publishedAt&limit=50&depth=1',
    [CACHE_TAGS.posts]
  )
  return data.docs.map(mapPayloadPost)
}

export async function getCachedPost(slug: string): Promise<RawPostDoc | null> {
  const params = new URLSearchParams({
    'where[and][0][slug][equals]': slug,
    'where[and][1][status][equals]': 'published',
    'limit': '1',
    'depth': '1',
  })
  const data = await restFetch<PayloadListResponse<RawPostDoc>>(
    `posts?${params}`,
    [CACHE_TAGS.posts, CACHE_TAGS.post(slug)]
  )
  return data.docs[0] ?? null
}

export async function getCachedRelatedPosts(
  postSlug: string,
  tags: string[]
): Promise<Post[]> {
  if (!tags.length) return _fetchRecentPosts(postSlug)

  const params = new URLSearchParams({
    'where[and][0][status][equals]': 'published',
    'where[and][1][slug][not_equals]': postSlug,
    'where[and][2][tags.tag][in]': tags.join(','),
    'sort': '-publishedAt',
    'limit': '3',
    'depth': '1',
  })
  const data = await restFetch<PayloadListResponse<RawPostDoc>>(
    `posts?${params}`,
    [CACHE_TAGS.posts]
  )

  const docs = data.docs
  if (docs.length >= 3) return docs.map(mapPayloadPost)

  const existing = new Set(docs.map((d) => d.slug))
  existing.add(postSlug)
  const recent = await _fetchRecentPosts(postSlug, existing)
  return [...docs.map(mapPayloadPost), ...recent].slice(0, 3)
}

async function _fetchRecentPosts(
  excludeSlug: string,
  excludeSlugs?: Set<string>
): Promise<Post[]> {
  const params = new URLSearchParams({
    'where[and][0][status][equals]': 'published',
    'where[and][1][slug][not_equals]': excludeSlug,
    'sort': '-publishedAt',
    'limit': '6',
    'depth': '1',
  })
  const data = await restFetch<PayloadListResponse<RawPostDoc>>(
    `posts?${params}`,
    [CACHE_TAGS.posts]
  )
  const all = data.docs.map(mapPayloadPost)
  if (!excludeSlugs) return all.slice(0, 3)
  return all.filter((p) => !excludeSlugs.has(p.slug)).slice(0, 3)
}

export async function getSitemapPosts(): Promise<
  { slug: string; publishedAt: string | null; updatedAt: string }[]
> {
  const data = await restFetch<PayloadListResponse<RawPostDoc>>(
    'posts?where[status][equals]=published&sort=-publishedAt&limit=1000&depth=0',
    [CACHE_TAGS.posts]
  )
  return data.docs.map((d) => ({
    slug: d.slug,
    publishedAt: d.publishedAt ?? null,
    updatedAt: d.updatedAt,
  }))
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
  updatedAt?: string
  // meta.image resolves to an object at depth=1 (single-doc fetches) or a string ID at depth=0 (getSitemapWork)
  meta?: {
    title?: string | null
    description?: string | null
    image?: { url?: string | null } | string | null
  } | null
}

// depth=1 required to resolve meta.image for SEO; also resolves cover (not mapped here, acknowledged)
export async function getCachedWorkEntries(): Promise<WorkEntry[]> {
  const data = await restFetch<PayloadListResponse<RawWorkDoc>>(
    'work?where[status][equals]=published&sort=ord&limit=50&depth=1',
    [CACHE_TAGS.work]
  )
  return data.docs.map((d) => ({
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
      meta: d.meta
        ? {
            title: d.meta.title,
            description: d.meta.description,
            image: typeof d.meta.image === 'object' ? d.meta.image : null,
          }
        : d.meta,
  }))
}

export async function getSitemapWork(): Promise<{ slug: string; updatedAt: string }[]> {
  const data = await restFetch<PayloadListResponse<RawWorkDoc>>(
    'work?where[status][equals]=published&sort=ord&limit=1000&depth=0',
    [CACHE_TAGS.work]
  )
  return data.docs.map((d) => ({ slug: d.slug, updatedAt: d.updatedAt ?? '' }))
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

export async function getCachedProjects(): Promise<ProjectEntry[]> {
  const data = await restFetch<PayloadListResponse<RawProjectDoc>>(
    'projects?where[status][equals]=published&limit=50&depth=0',
    [CACHE_TAGS.projects]
  )
  return data.docs.map((d) => ({
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

export async function getCachedTimeline(): Promise<TimelineEntry[]> {
  const data = await restFetch<PayloadListResponse<RawTimelineDoc>>(
    'timeline?sort=order&limit=20&depth=0',
    [CACHE_TAGS.timeline]
  )
  return data.docs.map((d) => ({
    id: String(d.id),
    company: d.company,
    role: d.role,
    start: d.start,
    end: d.end ?? null,
    summary: d.summary ?? undefined,
    tags: d.tags?.map((t) => t.tag ?? '') ?? [],
    order: d.order ?? undefined,
  }))
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

export async function getCachedEducation(): Promise<EducationEntry[]> {
  const data = await restFetch<PayloadListResponse<RawEducationDoc>>(
    'education?sort=order&limit=20&depth=0',
    [CACHE_TAGS.education]
  )
  return data.docs.map((d) => ({
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

export async function getCachedCertifications(): Promise<CertificationEntry[]> {
  const data = await restFetch<PayloadListResponse<RawCertificationDoc>>(
    'certifications?sort=order&limit=20&depth=0',
    [CACHE_TAGS.certifications]
  )
  return data.docs.map((d) => ({
    id: String(d.id),
    name: d.name,
    issuer: d.issuer,
    year: d.year,
    credentialUrl: d.credentialUrl ?? undefined,
    order: d.order ?? undefined,
  }))
}

// ─── Sitemap Pages ────────────────────────────────────────────────────────────

interface RawPageDoc {
  id?: string
  title?: string
  slug: string
  template: string
  lastUpdated?: string | null
  updatedAt: string
  body?: unknown
  // meta.image resolves to an object at depth=1 (single-doc fetches) or a string ID at depth=0 (getSitemapPages)
  meta?: {
    title?: string | null
    description?: string | null
    image?: { url?: string | null } | string | null
  } | null
}

export async function getSitemapPages(): Promise<
  { slug: string; template: 'legal' | 'basic'; lastUpdated: string | null; updatedAt: string }[]
> {
  const data = await restFetch<PayloadListResponse<RawPageDoc>>(
    'pages?limit=1000&depth=0',
    [CACHE_TAGS.pages]
  )
  return data.docs.map((d) => ({
    slug: d.slug,
    template: d.template as 'legal' | 'basic',
    lastUpdated: d.lastUpdated ?? null,
    updatedAt: d.updatedAt,
  }))
}

// ─── Pages ────────────────────────────────────────────────────────────────────

export async function getCachedBasicPage(slug: string): Promise<RawPageDoc | null> {
  const params = new URLSearchParams({
    'where[and][0][slug][equals]': slug,
    'where[and][1][template][equals]': 'basic',
    'limit': '1',
    'depth': '1',
  })
  const data = await restFetch<PayloadListResponse<RawPageDoc>>(
    `pages?${params}`,
    [CACHE_TAGS.pages, CACHE_TAGS.page(slug)]
  )
  return data.docs[0] ?? null
}

export async function getCachedLegalPage(slug: string): Promise<RawPageDoc | null> {
  const params = new URLSearchParams({
    'where[and][0][slug][equals]': slug,
    'where[and][1][template][equals]': 'legal',
    'limit': '1',
    'depth': '1',
  })
  const data = await restFetch<PayloadListResponse<RawPageDoc>>(
    `pages?${params}`,
    [CACHE_TAGS.pages, CACHE_TAGS.page(slug)]
  )
  return data.docs[0] ?? null
}

// ─── Site Settings ────────────────────────────────────────────────────────────

export interface RawSiteSettings {
  availability?: { available?: boolean | null; label?: string | null } | null
  headline?: string | null
  subheadline?: string | null
  eyebrow?: string | null
  stats?: { value: string; label: string }[] | null
}

export async function getCachedSiteSettings(): Promise<RawSiteSettings | null> {
  try {
    return await restFetch<RawSiteSettings>('globals/site-settings', [CACHE_TAGS.home])
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
  return (result.docs[0] as RawPostDoc) ?? null
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
  return (result.docs[0] as RawPageDoc) ?? null
}
