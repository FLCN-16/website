import { unstable_cache } from 'next/cache'
import { getPayloadClient } from './payload'
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

export async function getCachedPosts(): Promise<Post[]> {
  return unstable_cache(
    async () => {
      const payload = await getPayloadClient()
      const result = await payload.find({
        collection: 'posts',
        where: { status: { equals: 'published' } },
        sort: '-publishedAt',
        limit: 50,
        depth: 1,
      })
      return result.docs.map(mapPayloadPost)
    },
    ['posts-list'],
    { tags: [CACHE_TAGS.posts], revalidate: false }
  )()
}

export async function getCachedPost(slug: string) {
  return unstable_cache(
    async () => {
      const payload = await getPayloadClient()
      const result = await payload.find({
        collection: 'posts',
        where: {
          and: [
            { slug: { equals: slug } },
            { status: { equals: 'published' } },
          ],
        },
        limit: 1,
        depth: 1,
      })
      return result.docs[0] ?? null
    },
    ['post', slug],
    { tags: [CACHE_TAGS.posts, CACHE_TAGS.post(slug)], revalidate: false }
  )()
}

export async function getCachedRelatedPosts(
  postSlug: string,
  tags: string[]
): Promise<Post[]> {
  return unstable_cache(
    async () => {
      if (!tags.length) return _fetchRecentPosts(postSlug)

      const payload = await getPayloadClient()
      const result = await payload.find({
        collection: 'posts',
        where: {
          and: [
            { status: { equals: 'published' } },
            { slug: { not_equals: postSlug } },
            { 'tags.tag': { in: tags } },
          ],
        },
        sort: '-publishedAt',
        limit: 3,
        depth: 1,
      })

      const docs = result.docs
      if (docs.length >= 3) return docs.map(mapPayloadPost)

      const existing = new Set(docs.map((d) => d.slug))
      existing.add(postSlug)
      const recent = await _fetchRecentPosts(postSlug, existing)
      return [...docs.map(mapPayloadPost), ...recent].slice(0, 3)
    },
    ['related-posts', postSlug, ...tags.slice().sort()],
    { tags: [CACHE_TAGS.posts], revalidate: false }
  )()
}

async function _fetchRecentPosts(
  excludeSlug: string,
  excludeSlugs?: Set<string>
): Promise<Post[]> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'posts',
    where: {
      and: [
        { status: { equals: 'published' } },
        { slug: { not_equals: excludeSlug } },
      ],
    },
    sort: '-publishedAt',
    limit: 6,
    depth: 1,
  })
  const all = result.docs.map(mapPayloadPost)
  if (!excludeSlugs) return all.slice(0, 3)
  return all.filter((p) => !excludeSlugs.has(p.slug)).slice(0, 3)
}

// ─── Work ─────────────────────────────────────────────────────────────────────

export async function getCachedWorkEntries(): Promise<WorkEntry[]> {
  return unstable_cache(
    async () => {
      const payload = await getPayloadClient()
      const result = await payload.find({
        collection: 'work',
        where: { status: { equals: 'published' } },
        sort: 'ord',
        limit: 50,
        depth: 0,
      })
      return result.docs.map((doc) => ({
        id: String(doc.id),
        slug: doc.slug,
        title: doc.title,
        category: doc.category ?? '',
        ord: doc.ord ?? '',
        tags: doc.tags?.map((t: { tag?: string | null }) => t.tag ?? '') ?? [],
        description: doc.description ?? '',
        briefing: {
          problem:
            (doc.briefing as { problem?: string } | null)?.problem ?? '',
          approach: (
            (doc.briefing as { approach?: { step?: string }[] } | null)
              ?.approach ?? []
          ).map((a) => a.step ?? ''),
          impact:
            (doc.briefing as { impact?: string } | null)?.impact ?? '',
          quote: (doc.briefing as { quote?: string } | null)?.quote ?? '',
        },
        stack: (
          (doc.stack as { name?: string; role?: string }[] | null) ?? []
        ).map((s) => ({
          name: s.name ?? '',
          role: s.role ?? '',
        })),
      }))
    },
    ['work-entries'],
    { tags: [CACHE_TAGS.work], revalidate: false }
  )()
}

// ─── Projects ─────────────────────────────────────────────────────────────────

export async function getCachedProjects(): Promise<ProjectEntry[]> {
  return unstable_cache(
    async () => {
      const payload = await getPayloadClient()
      const result = await payload.find({
        collection: 'projects',
        where: { status: { equals: 'published' } },
        limit: 50,
        depth: 0,
      })
      return result.docs.map((doc) => ({
        id: String(doc.id),
        title: doc.title,
        subtitle: doc.subtitle ?? undefined,
        description: doc.description ?? undefined,
        category: doc.category ?? undefined,
        tags:
          doc.tags?.map((t: { tag?: string | null }) => t.tag ?? '') ?? [],
        liveUrl: doc.liveUrl ?? undefined,
        repoUrl: doc.repoUrl ?? undefined,
        startDate: doc.startDate ?? undefined,
        endDate: doc.endDate ?? undefined,
        highlights:
          doc.highlights?.map(
            (h: { point?: string | null }) => h.point ?? ''
          ) ?? [],
        featured: doc.featured ?? false,
      }))
    },
    ['projects-list'],
    { tags: [CACHE_TAGS.projects], revalidate: false }
  )()
}

// ─── Timeline ─────────────────────────────────────────────────────────────────

export async function getCachedTimeline(): Promise<TimelineEntry[]> {
  return unstable_cache(
    async () => {
      const payload = await getPayloadClient()
      const result = await payload.find({
        collection: 'timeline',
        sort: 'order',
        limit: 20,
        depth: 0,
      })
      return result.docs.map((doc) => ({
        id: String(doc.id),
        company: doc.company,
        role: doc.role,
        start: doc.start,
        end: doc.end ?? null,
        summary: doc.summary ?? undefined,
        tags:
          doc.tags?.map((t: { tag?: string | null }) => t.tag ?? '') ?? [],
        order: doc.order ?? undefined,
      }))
    },
    ['timeline'],
    { tags: [CACHE_TAGS.timeline], revalidate: false }
  )()
}

// ─── Education ────────────────────────────────────────────────────────────────

export async function getCachedEducation(): Promise<EducationEntry[]> {
  return unstable_cache(
    async () => {
      const payload = await getPayloadClient()
      const result = await payload.find({
        collection: 'education',
        sort: 'order',
        limit: 20,
        depth: 0,
      })
      return result.docs.map((doc) => ({
        id: String(doc.id),
        institution: doc.institution,
        degree: doc.degree,
        location: doc.location ?? undefined,
        start: doc.start ?? undefined,
        end: doc.end ?? undefined,
        gpa: doc.gpa ?? undefined,
        status: (doc.status as EducationEntry['status']) ?? undefined,
        order: doc.order ?? undefined,
      }))
    },
    ['education'],
    { tags: [CACHE_TAGS.education], revalidate: false }
  )()
}

// ─── Certifications ───────────────────────────────────────────────────────────

export async function getCachedCertifications(): Promise<CertificationEntry[]> {
  return unstable_cache(
    async () => {
      const payload = await getPayloadClient()
      const result = await payload.find({
        collection: 'certifications',
        sort: 'order',
        limit: 20,
        depth: 0,
      })
      return result.docs.map((doc) => ({
        id: String(doc.id),
        name: doc.name,
        issuer: doc.issuer,
        year: doc.year,
        credentialUrl: doc.credentialUrl ?? undefined,
        order: doc.order ?? undefined,
      }))
    },
    ['certifications'],
    { tags: [CACHE_TAGS.certifications], revalidate: false }
  )()
}

// ─── Sitemap fetchers ─────────────────────────────────────────────────────────

export async function getSitemapPosts(): Promise<
  { slug: string; publishedAt: string | null; updatedAt: string }[]
> {
  return unstable_cache(
    async () => {
      const payload = await getPayloadClient()
      const result = await payload.find({
        collection: 'posts',
        where: { status: { equals: 'published' } },
        sort: '-publishedAt',
        pagination: false,
        depth: 0,
      })
      return result.docs.map((doc) => ({
        slug: String(doc.slug),
        publishedAt: doc.publishedAt ? String(doc.publishedAt) : null,
        updatedAt: String(doc.updatedAt),
      }))
    },
    ['sitemap-posts'],
    { tags: [CACHE_TAGS.posts], revalidate: false }
  )()
}

export async function getSitemapWork(): Promise<
  { slug: string; updatedAt: string }[]
> {
  return unstable_cache(
    async () => {
      const payload = await getPayloadClient()
      const result = await payload.find({
        collection: 'work',
        where: { status: { equals: 'published' } },
        sort: 'ord',
        pagination: false,
        depth: 0,
      })
      return result.docs.map((doc) => ({
        slug: String(doc.slug),
        updatedAt: String(doc.updatedAt),
      }))
    },
    ['sitemap-work'],
    { tags: [CACHE_TAGS.work], revalidate: false }
  )()
}

export async function getSitemapPages(): Promise<
  {
    slug: string
    template: 'legal' | 'basic'
    lastUpdated: string | null
    updatedAt: string
  }[]
> {
  return unstable_cache(
    async () => {
      const payload = await getPayloadClient()
      const result = await payload.find({
        collection: 'pages',
        pagination: false,
        depth: 0,
      })
      return result.docs.map((doc) => ({
        slug: String(doc.slug),
        template: doc.template as 'legal' | 'basic',
        lastUpdated: doc.lastUpdated ? String(doc.lastUpdated) : null,
        updatedAt: String(doc.updatedAt),
      }))
    },
    ['sitemap-pages'],
    { tags: [CACHE_TAGS.pages], revalidate: false }
  )()
}

// ─── Pages ────────────────────────────────────────────────────────────────────

export async function getCachedBasicPage(slug: string) {
  return unstable_cache(
    async () => {
      const payload = await getPayloadClient()
      const result = await payload.find({
        collection: 'pages',
        where: {
          and: [
            { slug: { equals: slug } },
            { template: { equals: 'basic' } },
          ],
        },
        limit: 1,
      })
      return result.docs[0] ?? null
    },
    ['page-basic', slug],
    { tags: [CACHE_TAGS.pages, CACHE_TAGS.page(slug)], revalidate: false }
  )()
}

export async function getCachedLegalPage(slug: string) {
  return unstable_cache(
    async () => {
      const payload = await getPayloadClient()
      const result = await payload.find({
        collection: 'pages',
        where: {
          and: [
            { slug: { equals: slug } },
            { template: { equals: 'legal' } },
          ],
        },
        limit: 1,
      })
      return result.docs[0] ?? null
    },
    ['page-legal', slug],
    { tags: [CACHE_TAGS.pages, CACHE_TAGS.page(slug)], revalidate: false }
  )()
}
