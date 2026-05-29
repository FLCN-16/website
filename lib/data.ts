import { unstable_cache } from 'next/cache'
import { gqlFetch } from './graphql'
import { mapPayloadPost } from './posts'
import { CACHE_TAGS } from './cache-tags'
import { getPayloadClient } from './payload'
import type {
  Post,
  WorkEntry,
  ProjectEntry,
  TimelineEntry,
  EducationEntry,
  CertificationEntry,
} from './types'

// ─── Posts ────────────────────────────────────────────────────────────────────

const POSTS_LIST_QUERY = `
  query GetPosts {
    Posts(where: { status: { equals: "published" } }, sort: "-publishedAt", limit: 50) {
      docs {
        id title slug excerpt featured publishedAt readingTime
        cover { url width height alt }
        tags { tag }
      }
    }
  }
`

const POST_BY_SLUG_QUERY = `
  query GetPost($slug: String) {
    Posts(
      where: { AND: [{ slug: { equals: $slug } }, { status: { equals: "published" } }] }
      limit: 1
    ) {
      docs {
        id title slug excerpt featured publishedAt readingTime
        cover { url width height alt }
        tags { tag }
        body
      }
    }
  }
`

const RELATED_POSTS_QUERY = `
  query GetRelatedPosts($postSlug: String, $tags: [String]) {
    Posts(
      where: {
        AND: [
          { status: { equals: "published" } }
          { slug: { not_equals: $postSlug } }
          { tags__tag: { in: $tags } }
        ]
      }
      sort: "-publishedAt"
      limit: 3
    ) {
      docs {
        id title slug excerpt featured publishedAt readingTime
        cover { url width height alt }
        tags { tag }
      }
    }
  }
`

const RECENT_POSTS_QUERY = `
  query GetRecentPosts($excludeSlug: String) {
    Posts(
      where: {
        AND: [
          { status: { equals: "published" } }
          { slug: { not_equals: $excludeSlug } }
        ]
      }
      sort: "-publishedAt"
      limit: 6
    ) {
      docs {
        id title slug excerpt featured publishedAt readingTime
        cover { url width height alt }
        tags { tag }
      }
    }
  }
`

const SITEMAP_POSTS_QUERY = `
  query GetSitemapPosts {
    Posts(where: { status: { equals: "published" } }, sort: "-publishedAt", limit: 1000) {
      docs {
        slug
        publishedAt
        updatedAt
      }
    }
  }
`

interface RawPostDoc {
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
}

interface PostsResponse {
  Posts: { docs: RawPostDoc[] }
}

interface SinglePostResponse {
  Posts: { docs: RawPostDoc[] }
}

export async function getCachedPosts(): Promise<Post[]> {
  const data = await gqlFetch<PostsResponse>(POSTS_LIST_QUERY, undefined, [CACHE_TAGS.posts])
  return data.Posts.docs.map(mapPayloadPost)
}

export async function getCachedPost(slug: string): Promise<RawPostDoc | null> {
  const data = await gqlFetch<SinglePostResponse>(
    POST_BY_SLUG_QUERY,
    { slug },
    [CACHE_TAGS.posts, CACHE_TAGS.post(slug)]
  )
  return data.Posts.docs[0] ?? null
}

export async function getCachedRelatedPosts(
  postSlug: string,
  tags: string[]
): Promise<Post[]> {
  if (!tags.length) return _fetchRecentPosts(postSlug)

  const data = await gqlFetch<PostsResponse>(
    RELATED_POSTS_QUERY,
    { postSlug, tags },
    [CACHE_TAGS.posts]
  )

  const docs = data.Posts.docs
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
  const data = await gqlFetch<PostsResponse>(
    RECENT_POSTS_QUERY,
    { excludeSlug },
    [CACHE_TAGS.posts]
  )
  const all = data.Posts.docs.map(mapPayloadPost)
  if (!excludeSlugs) return all.slice(0, 3)
  return all.filter((p) => !excludeSlugs.has(p.slug)).slice(0, 3)
}

// ─── Work ─────────────────────────────────────────────────────────────────────

const WORK_LIST_QUERY = `
  query GetWork {
    Work(where: { status: { equals: "published" } }, sort: "ord", limit: 50) {
      docs {
        id title slug category ord description
        tags { tag }
        briefing {
          problem
          approach { step }
          impact
          quote
        }
        stack { name role }
      }
    }
  }
`

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
}

interface WorkResponse {
  Work: { docs: RawWorkDoc[] }
}

export async function getCachedWorkEntries(): Promise<WorkEntry[]> {
  const data = await gqlFetch<WorkResponse>(WORK_LIST_QUERY, undefined, [CACHE_TAGS.work])
  return data.Work.docs.map((d) => ({
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
  }))
}

// ─── Projects ─────────────────────────────────────────────────────────────────

const PROJECTS_LIST_QUERY = `
  query GetProjects {
    Projects(where: { status: { equals: "published" } }, limit: 50) {
      docs {
        id title subtitle description category featured liveUrl repoUrl startDate endDate
        tags { tag }
        highlights { point }
      }
    }
  }
`

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

interface ProjectsResponse {
  Projects: { docs: RawProjectDoc[] }
}

export async function getCachedProjects(): Promise<ProjectEntry[]> {
  const data = await gqlFetch<ProjectsResponse>(PROJECTS_LIST_QUERY, undefined, [CACHE_TAGS.projects])
  return data.Projects.docs.map((d) => ({
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
  const data = await gqlFetch<PostsResponse>(SITEMAP_POSTS_QUERY, undefined, [CACHE_TAGS.posts])
  return data.Posts.docs.map((doc) => ({
    slug: doc.slug,
    publishedAt: doc.publishedAt ?? null,
    updatedAt: doc.updatedAt,
  }))
}

// ─── Sitemap Work ─────────────────────────────────────────────────────────

const SITEMAP_WORK_QUERY = `
  query GetSitemapWork {
    Work(where: { status: { equals: "published" } }, sort: "ord", limit: 1000) {
      docs {
        slug
        updatedAt
      }
    }
  }
`

export async function getSitemapWork(): Promise<{ slug: string; updatedAt: string }[]> {
  const data = await gqlFetch<WorkResponse>(SITEMAP_WORK_QUERY, undefined, [CACHE_TAGS.work])
  return data.Work.docs.map((d) => ({ slug: d.slug, updatedAt: d.updatedAt ?? '' }))
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
