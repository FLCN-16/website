import { gqlFetch } from './graphql'
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

const TIMELINE_QUERY = `
  query GetTimeline {
    Timeline(sort: "order", limit: 20) {
      docs {
        id company role start end summary order
        tags { tag }
      }
    }
  }
`

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

interface TimelineResponse {
  Timeline: { docs: RawTimelineDoc[] }
}

export async function getCachedTimeline(): Promise<TimelineEntry[]> {
  const data = await gqlFetch<TimelineResponse>(TIMELINE_QUERY, undefined, [CACHE_TAGS.timeline])
  return data.Timeline.docs.map((d) => ({
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

const EDUCATION_QUERY = `
  query GetEducation {
    Education(sort: "order", limit: 20) {
      docs {
        id institution degree location start end gpa status order
      }
    }
  }
`

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

interface EducationResponse {
  Education: { docs: RawEducationDoc[] }
}

export async function getCachedEducation(): Promise<EducationEntry[]> {
  const data = await gqlFetch<EducationResponse>(EDUCATION_QUERY, undefined, [CACHE_TAGS.education])
  return data.Education.docs.map((d) => ({
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

const CERTIFICATIONS_QUERY = `
  query GetCertifications {
    Certifications(sort: "order", limit: 20) {
      docs {
        id name issuer year credentialUrl order
      }
    }
  }
`

interface RawCertificationDoc {
  id: string
  name: string
  issuer: string
  year: string
  credentialUrl?: string | null
  order?: number | null
}

interface CertificationsResponse {
  Certifications: { docs: RawCertificationDoc[] }
}

export async function getCachedCertifications(): Promise<CertificationEntry[]> {
  const data = await gqlFetch<CertificationsResponse>(CERTIFICATIONS_QUERY, undefined, [CACHE_TAGS.certifications])
  return data.Certifications.docs.map((d) => ({
    id: String(d.id),
    name: d.name,
    issuer: d.issuer,
    year: d.year,
    credentialUrl: d.credentialUrl ?? undefined,
    order: d.order ?? undefined,
  }))
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

// ─── Sitemap Pages ────────────────────────────────────────────────────────

const SITEMAP_PAGES_QUERY = `
  query GetSitemapPages {
    Pages(limit: 1000) {
      docs {
        slug template lastUpdated updatedAt
      }
    }
  }
`

interface RawPageDoc {
  id?: string
  title?: string
  slug: string
  template: string
  lastUpdated?: string | null
  updatedAt: string
  body?: unknown
}

interface PagesResponse {
  Pages: { docs: RawPageDoc[] }
}

export async function getSitemapPages(): Promise<
  {
    slug: string
    template: 'legal' | 'basic'
    lastUpdated: string | null
    updatedAt: string
  }[]
> {
  const data = await gqlFetch<PagesResponse>(SITEMAP_PAGES_QUERY, undefined, [CACHE_TAGS.pages])
  return data.Pages.docs.map((d) => ({
    slug: d.slug,
    template: d.template as 'legal' | 'basic',
    lastUpdated: d.lastUpdated ?? null,
    updatedAt: d.updatedAt,
  }))
}

// ─── Pages ────────────────────────────────────────────────────────────────────

const PAGE_BY_SLUG_QUERY = `
  query GetPage($slug: String, $template: String) {
    Pages(
      where: { AND: [{ slug: { equals: $slug } }, { template: { equals: $template } }] }
      limit: 1
    ) {
      docs {
        id title slug template lastUpdated updatedAt body
      }
    }
  }
`

export async function getCachedBasicPage(slug: string) {
  const data = await gqlFetch<PagesResponse>(
    PAGE_BY_SLUG_QUERY,
    { slug, template: 'basic' },
    [CACHE_TAGS.pages, CACHE_TAGS.page(slug)]
  )
  return data.Pages.docs[0] ?? null
}

export async function getCachedLegalPage(slug: string) {
  const data = await gqlFetch<PagesResponse>(
    PAGE_BY_SLUG_QUERY,
    { slug, template: 'legal' },
    [CACHE_TAGS.pages, CACHE_TAGS.page(slug)]
  )
  return data.Pages.docs[0] ?? null
}
