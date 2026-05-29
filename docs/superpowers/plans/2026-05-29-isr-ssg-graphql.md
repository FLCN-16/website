# ISR / SSG via GraphQL Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert all content routes from dynamic (`ƒ`) to ISR (`●`) / static (`○`) by replacing `unstable_cache` + local Payload API with `fetch()`-based GraphQL data functions and adding route segment configs + `generateStaticParams`.

**Architecture:** A new `lib/graphql.ts` helper wraps `fetch()` to Payload's GraphQL endpoint at `NEXT_PUBLIC_SITE_URL/api/graphql` with `next: { tags, revalidate: false }` so Next.js owns the Data Cache. `lib/data.ts` is rewritten to call this helper—same return types, same `CACHE_TAGS`, same `afterChange` revalidation hooks (already wired in all collections). Dynamic routes get `generateStaticParams` using the local Payload API (in-process, always works at build time).

**Tech Stack:** Next.js 15 App Router, Payload CMS 3.x GraphQL, Vitest, TypeScript

> **Build-time note:** During `next build`, page components call `gqlFetch` which POSTs to `NEXT_PUBLIC_SITE_URL/api/graphql`. The build requires this URL to resolve to a running Payload instance. In production CI set `NEXT_PUBLIC_SITE_URL` to the deployed domain. Locally use `next dev` (not `next build`) for development.

---

## File Map

| File | Action |
|---|---|
| `lib/graphql.ts` | **Create** — `gqlFetch` helper |
| `lib/__tests__/graphql.test.ts` | **Create** — unit tests for `gqlFetch` |
| `lib/data.ts` | **Rewrite** — replace all `unstable_cache` + `getPayloadClient` with `gqlFetch` |
| `app/(site)/page.tsx` | **Modify** — add `export const revalidate = false` |
| `app/(site)/projects/page.tsx` | **Modify** — add `export const revalidate = false` |
| `app/(site)/work/page.tsx` | **Modify** — add `export const revalidate = false` |
| `app/(site)/writing/page.tsx` | **Modify** — add `export const revalidate = false` |
| `app/(site)/stack/page.tsx` | **Modify** — add `export const dynamic = 'force-static'` |
| `app/(site)/contact/page.tsx` | **Modify** — add `export const dynamic = 'force-static'` |
| `app/(site)/writing/[slug]/page.tsx` | **Modify** — add `revalidate`, `dynamicParams`, `generateStaticParams` |
| `app/(site)/work/[slug]/page.tsx` | **Modify** — add `revalidate`, `dynamicParams`, `generateStaticParams` |
| `app/(site)/legal/[slug]/page.tsx` | **Modify** — add `revalidate`, `dynamicParams`, `generateStaticParams` |
| `app/(site)/page/[slug]/page.tsx` | **Modify** — add `revalidate`, `dynamicParams`, `generateStaticParams` |

---

## Task 1: Create `lib/graphql.ts` with `gqlFetch` (TDD)

**Files:**
- Create: `lib/graphql.ts`
- Create: `lib/__tests__/graphql.test.ts`

- [ ] **Step 1.1: Write the failing tests**

Create `lib/__tests__/graphql.test.ts`:

```ts
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'

// Module is imported after stubbing fetch so the env var is read at call time
const SITE_URL = 'http://localhost:3000'

describe('gqlFetch', () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_SITE_URL = SITE_URL
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    delete process.env.NEXT_PUBLIC_SITE_URL
  })

  it('POSTs to /api/graphql on the configured site URL', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: { Posts: { docs: [] } } }),
    })
    vi.stubGlobal('fetch', mockFetch)

    const { gqlFetch } = await import('../graphql')
    await gqlFetch('{ Posts { docs { id } } }')

    expect(mockFetch).toHaveBeenCalledWith(
      `${SITE_URL}/api/graphql`,
      expect.objectContaining({ method: 'POST' })
    )
  })

  it('sends Content-Type: application/json', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: {} }),
    })
    vi.stubGlobal('fetch', mockFetch)

    const { gqlFetch } = await import('../graphql')
    await gqlFetch('{ Test }')

    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: { 'Content-Type': 'application/json' },
      })
    )
  })

  it('attaches cache tags to the next option', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: {} }),
    })
    vi.stubGlobal('fetch', mockFetch)

    const { gqlFetch } = await import('../graphql')
    await gqlFetch('{ Test }', undefined, ['posts', 'post-hello'])

    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        next: expect.objectContaining({ tags: ['posts', 'post-hello'], revalidate: false }),
      })
    )
  })

  it('returns the data field on success', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: { Posts: { docs: [{ id: '1' }] } } }),
    }))

    const { gqlFetch } = await import('../graphql')
    const result = await gqlFetch<{ Posts: { docs: Array<{ id: string }> } }>('{ Posts { docs { id } } }')

    expect(result).toEqual({ Posts: { docs: [{ id: '1' }] } })
  })

  it('throws when HTTP status is not ok', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      status: 503,
      statusText: 'Service Unavailable',
    }))

    const { gqlFetch } = await import('../graphql')
    await expect(gqlFetch('{ Test }')).rejects.toThrow('503')
  })

  it('throws the first GraphQL error message', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: null, errors: [{ message: 'Field "bad" not found' }] }),
    }))

    const { gqlFetch } = await import('../graphql')
    await expect(gqlFetch('{ bad }')).rejects.toThrow('Field "bad" not found')
  })
})
```

- [ ] **Step 1.2: Run tests and confirm they all fail**

```bash
cd /root/Work/flcn-website && pnpm test lib/__tests__/graphql.test.ts
```

Expected: 6 failures — `gqlFetch` not defined yet.

- [ ] **Step 1.3: Implement `lib/graphql.ts`**

Create `lib/graphql.ts`:

```ts
interface GqlResponse<T> {
  data: T
  errors?: Array<{ message: string }>
}

export async function gqlFetch<T>(
  query: string,
  variables?: Record<string, unknown>,
  tags: string[] = []
): Promise<T> {
  const url = `${process.env.NEXT_PUBLIC_SITE_URL}/api/graphql`

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
    next: { tags, revalidate: false },
  })

  if (!res.ok) {
    throw new Error(`GraphQL request failed: ${res.status} ${res.statusText}`)
  }

  const json: GqlResponse<T> = await res.json()

  if (json.errors?.length) {
    throw new Error(json.errors[0].message)
  }

  return json.data
}
```

- [ ] **Step 1.4: Run tests and confirm all pass**

```bash
cd /root/Work/flcn-website && pnpm test lib/__tests__/graphql.test.ts
```

Expected: 6 passing.

- [ ] **Step 1.5: Commit**

```bash
cd /root/Work/flcn-website && git add lib/graphql.ts lib/__tests__/graphql.test.ts && git commit -m "feat(cache): add gqlFetch helper for Next.js-native GraphQL data cache"
```

---

## Task 2: Rewrite `lib/data.ts` — posts functions

Rewrite `getCachedPosts`, `getCachedPost`, `getCachedRelatedPosts`, `_fetchRecentPosts`, and `getSitemapPosts`. Return types are preserved exactly.

**Files:**
- Modify: `lib/data.ts`

- [ ] **Step 2.1: Replace the posts section of `lib/data.ts`**

Remove the `import { unstable_cache }` line and the `import { getPayloadClient }` import if it will no longer be used after all tasks. For now, keep the `getPayloadClient` import — it will be removed in Task 4 when all functions are migrated.

Replace the **entire posts section** (lines 1–112 of the current `lib/data.ts`) with the following. The rest of the file (Work, Projects, etc.) is left unchanged for now.

```ts
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
  {
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
  {
    Posts(where: { status: { equals: "published" } }, sort: "-publishedAt", limit: 1000) {
      docs {
        slug
        publishedAt
        updatedAt
      }
    }
  }
`

interface PostsResponse {
  Posts: { docs: unknown[] }
}

export async function getCachedPosts(): Promise<Post[]> {
  const data = await gqlFetch<PostsResponse>(POSTS_LIST_QUERY, undefined, [CACHE_TAGS.posts])
  return data.Posts.docs.map(mapPayloadPost)
}

export async function getCachedPost(slug: string) {
  const data = await gqlFetch<PostsResponse>(
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

  const existing = new Set(docs.map((d: unknown) => (d as { slug: string }).slug))
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

export async function getSitemapPosts(): Promise<
  { slug: string; publishedAt: string | null; updatedAt: string }[]
> {
  const data = await gqlFetch<PostsResponse>(SITEMAP_POSTS_QUERY, undefined, [CACHE_TAGS.posts])
  return data.Posts.docs.map((doc) => {
    const d = doc as { slug: string; publishedAt?: string | null; updatedAt: string }
    return {
      slug: d.slug,
      publishedAt: d.publishedAt ?? null,
      updatedAt: d.updatedAt,
    }
  })
}
```

Keep the rest of the file (Work through Pages sections) unchanged for now.

- [ ] **Step 2.2: Run the full test suite**

```bash
cd /root/Work/flcn-website && pnpm test
```

Expected: all existing tests pass (cache-tags, lexical-headings, cloudflare-image-loader, graphql).

- [ ] **Step 2.3: Commit**

```bash
cd /root/Work/flcn-website && git add lib/data.ts && git commit -m "feat(cache): migrate posts data functions to gqlFetch"
```

---

## Task 3: Rewrite `lib/data.ts` — work, projects, and sitemap-work

Replace `getCachedWorkEntries`, `getCachedProjects`, and `getSitemapWork` with `gqlFetch` versions.

**Files:**
- Modify: `lib/data.ts`

- [ ] **Step 3.1: Replace the Work and Projects sections**

Find and replace the `// ─── Work` section through the end of the `// ─── Projects` section and `getSitemapWork`:

```ts
// ─── Work ─────────────────────────────────────────────────────────────────────

const WORK_LIST_QUERY = `
  {
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

interface WorkResponse {
  Work: { docs: unknown[] }
}

export async function getCachedWorkEntries(): Promise<WorkEntry[]> {
  const data = await gqlFetch<WorkResponse>(WORK_LIST_QUERY, undefined, [CACHE_TAGS.work])
  return data.Work.docs.map((doc) => {
    const d = doc as {
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
    }
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
    }
  })
}

// ─── Projects ─────────────────────────────────────────────────────────────────

const PROJECTS_LIST_QUERY = `
  {
    Projects(where: { status: { equals: "published" } }, limit: 50) {
      docs {
        id title subtitle description category featured liveUrl repoUrl startDate endDate
        tags { tag }
        highlights { point }
      }
    }
  }
`

interface ProjectsResponse {
  Projects: { docs: unknown[] }
}

export async function getCachedProjects(): Promise<ProjectEntry[]> {
  const data = await gqlFetch<ProjectsResponse>(PROJECTS_LIST_QUERY, undefined, [CACHE_TAGS.projects])
  return data.Projects.docs.map((doc) => {
    const d = doc as {
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
    return {
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
    }
  })
}

// ─── Sitemap Work ──────────────────────────────────────────────────────────────

const SITEMAP_WORK_QUERY = `
  {
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
  return data.Work.docs.map((doc) => {
    const d = doc as { slug: string; updatedAt: string }
    return { slug: d.slug, updatedAt: d.updatedAt }
  })
}
```

- [ ] **Step 3.2: Run tests**

```bash
cd /root/Work/flcn-website && pnpm test
```

Expected: all pass.

- [ ] **Step 3.3: Commit**

```bash
cd /root/Work/flcn-website && git add lib/data.ts && git commit -m "feat(cache): migrate work and projects data functions to gqlFetch"
```

---

## Task 4: Rewrite `lib/data.ts` — timeline, education, certifications, pages, sitemap-pages

Replace all remaining `unstable_cache` functions. After this task, `unstable_cache` and the `getPayloadClient` import are fully removed from `lib/data.ts`.

**Files:**
- Modify: `lib/data.ts`

- [ ] **Step 4.1: Replace the remaining sections**

Replace the Timeline section through the end of the file:

```ts
// ─── Timeline ─────────────────────────────────────────────────────────────────

const TIMELINE_QUERY = `
  {
    Timeline(sort: "order", limit: 20) {
      docs {
        id company role start end summary order
        tags { tag }
      }
    }
  }
`

interface TimelineResponse {
  Timeline: { docs: unknown[] }
}

export async function getCachedTimeline(): Promise<TimelineEntry[]> {
  const data = await gqlFetch<TimelineResponse>(TIMELINE_QUERY, undefined, [CACHE_TAGS.timeline])
  return data.Timeline.docs.map((doc) => {
    const d = doc as {
      id: string
      company: string
      role: string
      start: string
      end?: string | null
      summary?: string | null
      tags?: Array<{ tag?: string | null }> | null
      order?: number | null
    }
    return {
      id: String(d.id),
      company: d.company,
      role: d.role,
      start: d.start,
      end: d.end ?? null,
      summary: d.summary ?? undefined,
      tags: d.tags?.map((t) => t.tag ?? '') ?? [],
      order: d.order ?? undefined,
    }
  })
}

// ─── Education ────────────────────────────────────────────────────────────────

const EDUCATION_QUERY = `
  {
    Education(sort: "order", limit: 20) {
      docs {
        id institution degree location start end gpa status order
      }
    }
  }
`

interface EducationResponse {
  Education: { docs: unknown[] }
}

export async function getCachedEducation(): Promise<EducationEntry[]> {
  const data = await gqlFetch<EducationResponse>(EDUCATION_QUERY, undefined, [CACHE_TAGS.education])
  return data.Education.docs.map((doc) => {
    const d = doc as {
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
    return {
      id: String(d.id),
      institution: d.institution,
      degree: d.degree,
      location: d.location ?? undefined,
      start: d.start ?? undefined,
      end: d.end ?? undefined,
      gpa: d.gpa ?? undefined,
      status: (d.status as EducationEntry['status']) ?? undefined,
      order: d.order ?? undefined,
    }
  })
}

// ─── Certifications ───────────────────────────────────────────────────────────

const CERTIFICATIONS_QUERY = `
  {
    Certifications(sort: "order", limit: 20) {
      docs {
        id name issuer year credentialUrl order
      }
    }
  }
`

interface CertificationsResponse {
  Certifications: { docs: unknown[] }
}

export async function getCachedCertifications(): Promise<CertificationEntry[]> {
  const data = await gqlFetch<CertificationsResponse>(CERTIFICATIONS_QUERY, undefined, [CACHE_TAGS.certifications])
  return data.Certifications.docs.map((doc) => {
    const d = doc as {
      id: string
      name: string
      issuer: string
      year: string
      credentialUrl?: string | null
      order?: number | null
    }
    return {
      id: String(d.id),
      name: d.name,
      issuer: d.issuer,
      year: d.year,
      credentialUrl: d.credentialUrl ?? undefined,
      order: d.order ?? undefined,
    }
  })
}

// ─── Sitemap Pages ────────────────────────────────────────────────────────────

const SITEMAP_PAGES_QUERY = `
  {
    Pages(limit: 1000) {
      docs {
        slug template lastUpdated updatedAt
      }
    }
  }
`

interface PagesResponse {
  Pages: { docs: unknown[] }
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
  return data.Pages.docs.map((doc) => {
    const d = doc as {
      slug: string
      template: string
      lastUpdated?: string | null
      updatedAt: string
    }
    return {
      slug: d.slug,
      template: d.template as 'legal' | 'basic',
      lastUpdated: d.lastUpdated ?? null,
      updatedAt: d.updatedAt,
    }
  })
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
```

- [ ] **Step 4.2: Remove the now-unused imports from the top of `lib/data.ts`**

Delete these two lines from the top of `lib/data.ts`:
```ts
import { unstable_cache } from 'next/cache'
import { getPayloadClient } from './payload'
```

> `getPayloadClient` will be used again in `generateStaticParams` functions (Tasks 6–8), but those live in the page files, not `lib/data.ts`.

- [ ] **Step 4.3: Run the full test suite**

```bash
cd /root/Work/flcn-website && pnpm test
```

Expected: all pass.

- [ ] **Step 4.4: Run the TypeScript compiler to catch type errors**

```bash
cd /root/Work/flcn-website && pnpm tsc --noEmit 2>&1 | head -40
```

Expected: no errors. Fix any type mismatches before continuing.

- [ ] **Step 4.5: Commit**

```bash
cd /root/Work/flcn-website && git add lib/data.ts && git commit -m "feat(cache): complete gqlFetch migration — remove unstable_cache from lib/data.ts"
```

---

## Task 5: Add route segment configs to non-slug pages

Six pages need exports added. No component JSX changes. These are independent one-liner additions.

**Files:**
- Modify: `app/(site)/page.tsx`
- Modify: `app/(site)/projects/page.tsx`
- Modify: `app/(site)/work/page.tsx`
- Modify: `app/(site)/writing/page.tsx`
- Modify: `app/(site)/stack/page.tsx`
- Modify: `app/(site)/contact/page.tsx`

- [ ] **Step 5.1: Add `revalidate = false` to the home page**

In `app/(site)/page.tsx`, add after the last import line (before the `export const metadata` line):

```ts
export const revalidate = false
```

- [ ] **Step 5.2: Add `revalidate = false` to `/projects`**

In `app/(site)/projects/page.tsx`, add after the last import:

```ts
export const revalidate = false
```

- [ ] **Step 5.3: Add `revalidate = false` to `/work`**

In `app/(site)/work/page.tsx`, add after the last import:

```ts
export const revalidate = false
```

- [ ] **Step 5.4: Add `revalidate = false` to `/writing`**

In `app/(site)/writing/page.tsx`, add after the last import:

```ts
export const revalidate = false
```

- [ ] **Step 5.5: Add `dynamic = 'force-static'` to `/stack`**

In `app/(site)/stack/page.tsx`, add after the last import:

```ts
export const dynamic = 'force-static'
```

- [ ] **Step 5.6: Add `dynamic = 'force-static'` to `/contact`**

In `app/(site)/contact/page.tsx`, add after the last import:

```ts
export const dynamic = 'force-static'
```

- [ ] **Step 5.7: Run tests and typecheck**

```bash
cd /root/Work/flcn-website && pnpm test && pnpm tsc --noEmit 2>&1 | head -20
```

Expected: all pass, no type errors.

- [ ] **Step 5.8: Commit**

```bash
cd /root/Work/flcn-website && git add app/\(site\)/page.tsx app/\(site\)/projects/page.tsx app/\(site\)/work/page.tsx app/\(site\)/writing/page.tsx app/\(site\)/stack/page.tsx app/\(site\)/contact/page.tsx && git commit -m "feat(isr): add route segment configs to non-slug pages"
```

---

## Task 6: Add `generateStaticParams` + configs to `/writing/[slug]`

**Files:**
- Modify: `app/(site)/writing/[slug]/page.tsx`

- [ ] **Step 6.1: Add exports and `generateStaticParams` to the writing slug page**

Open `app/(site)/writing/[slug]/page.tsx`. Add these three exports after the last import:

```ts
import { getPayloadClient } from '@/lib/payload'

export const revalidate = false
export const dynamicParams = true

export async function generateStaticParams() {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'posts',
    where: { status: { equals: 'published' } },
    limit: 1000,
    depth: 0,
  })
  return result.docs.map((doc) => ({ slug: String(doc.slug) }))
}
```

The `import { getPayloadClient }` line goes with the other imports at the top of the file.

The three `export const` lines and `generateStaticParams` function go immediately after all imports, before `generateMetadata`.

- [ ] **Step 6.2: Run tests and typecheck**

```bash
cd /root/Work/flcn-website && pnpm test && pnpm tsc --noEmit 2>&1 | head -20
```

Expected: all pass.

- [ ] **Step 6.3: Commit**

```bash
cd /root/Work/flcn-website && git add "app/(site)/writing/[slug]/page.tsx" && git commit -m "feat(isr): add generateStaticParams and revalidate config to /writing/[slug]"
```

---

## Task 7: Add `generateStaticParams` + configs to `/work/[slug]`

**Files:**
- Modify: `app/(site)/work/[slug]/page.tsx`

- [ ] **Step 7.1: Add exports and `generateStaticParams` to the work slug page**

Open `app/(site)/work/[slug]/page.tsx`. Add at the top with imports:

```ts
import { getPayloadClient } from '@/lib/payload'
```

Then add after all imports:

```ts
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
```

- [ ] **Step 7.2: Run tests and typecheck**

```bash
cd /root/Work/flcn-website && pnpm test && pnpm tsc --noEmit 2>&1 | head -20
```

Expected: all pass.

- [ ] **Step 7.3: Commit**

```bash
cd /root/Work/flcn-website && git add "app/(site)/work/[slug]/page.tsx" && git commit -m "feat(isr): add generateStaticParams and revalidate config to /work/[slug]"
```

---

## Task 8: Add `generateStaticParams` + configs to `/legal/[slug]` and `/page/[slug]`

**Files:**
- Modify: `app/(site)/legal/[slug]/page.tsx`
- Modify: `app/(site)/page/[slug]/page.tsx`

- [ ] **Step 8.1: Update `/legal/[slug]`**

Open `app/(site)/legal/[slug]/page.tsx`. Add with imports:

```ts
import { getPayloadClient } from '@/lib/payload'
```

Add after all imports:

```ts
export const revalidate = false
export const dynamicParams = true

export async function generateStaticParams() {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'pages',
    where: { template: { equals: 'legal' } },
    limit: 100,
    depth: 0,
  })
  return result.docs.map((doc) => ({ slug: String(doc.slug) }))
}
```

- [ ] **Step 8.2: Update `/page/[slug]`**

Open `app/(site)/page/[slug]/page.tsx`. Add with imports:

```ts
import { getPayloadClient } from '@/lib/payload'
```

Add after all imports:

```ts
export const revalidate = false
export const dynamicParams = true

export async function generateStaticParams() {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'pages',
    where: { template: { equals: 'basic' } },
    limit: 100,
    depth: 0,
  })
  return result.docs.map((doc) => ({ slug: String(doc.slug) }))
}
```

- [ ] **Step 8.3: Run tests and typecheck**

```bash
cd /root/Work/flcn-website && pnpm test && pnpm tsc --noEmit 2>&1 | head -20
```

Expected: all pass.

- [ ] **Step 8.4: Commit**

```bash
cd /root/Work/flcn-website && git add "app/(site)/legal/[slug]/page.tsx" "app/(site)/page/[slug]/page.tsx" && git commit -m "feat(isr): add generateStaticParams and revalidate config to legal and page slug routes"
```

---

## Task 9: Verify build output

Confirm the route map shows `●` and `○` symbols as expected.

**Files:** None (read-only verification)

- [ ] **Step 9.1: Run `next build` with the site URL set to a running Payload instance**

> If running locally with the dev server active on :3000, open a **separate terminal** and start it first: `pnpm dev`. Then in this terminal:

```bash
cd /root/Work/flcn-website && NEXT_PUBLIC_SITE_URL=http://localhost:3000 pnpm build 2>&1 | grep -E "^(├|└|┌|│|Route)"
```

- [ ] **Step 9.2: Confirm the route table matches the target**

Expected output (symbols matter):

```
Route (app)
┌ ○ /_not-found
├ ● /
├ ○ /contact
├ ● /legal/[slug]
│ └ /legal/<your-slugs>
├ ● /page/[slug]
│ └ /page/<your-slugs>
├ ● /projects
├ ○ /stack
├ ● /work
├ ● /work/[slug]
│ └ /work/<your-slugs>
├ ● /writing
└ ● /writing/[slug]
  └ /writing/<your-slugs>
```

If a route still shows `ƒ`, check:
1. The page file is missing the `revalidate` or `dynamic` export
2. The page has a `cookies()`, `headers()`, or other dynamic API call — search with `grep -n "cookies\|headers\|searchParams" app/(site)/...`

- [ ] **Step 9.3: Verify the GraphQL queries work against the Payload schema**

If any route fails to build with a GraphQL error (e.g., `Field "tags__tag" not found`), the filter field name may differ. Check the correct name at: `http://localhost:3000/api/graphql-playground`

Common adjustments needed:
- `tags__tag` → may need to be `tags__tag` (Payload 3.x double-underscore convention) — if this fails, try the Payload GraphQL playground to inspect the correct input type name
- `AND` operator → must be uppercase; Payload 3.x GraphQL uses `AND` and `OR`

- [ ] **Step 9.4: Final commit if any build-time fixes were needed**

```bash
cd /root/Work/flcn-website && git add -p && git commit -m "fix(isr): adjust GraphQL query fields for Payload schema compatibility"
```

(Only needed if Step 9.3 found issues.)
