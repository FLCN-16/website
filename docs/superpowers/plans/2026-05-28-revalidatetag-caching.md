# revalidateTag Caching Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace time-based ISR (`export const revalidate = 60`) with tag-based cache invalidation so content changes in the Payload admin are reflected immediately on the site.

**Architecture:** All `payload.find()` calls are wrapped with `unstable_cache` and assigned tags in a central `lib/data.ts` module. Payload collection hooks call `revalidateTag()` when documents change, invalidating only the affected data. Pages become dynamic SSR (no page-level HTML caching) so HTML is always fresh once data is invalidated.

**Tech Stack:** Next.js 16 App Router, Payload CMS 3.85 (embedded/local API), `next/cache` (`unstable_cache`, `revalidateTag`), Vitest

---

## File Map

**New files:**
- `lib/cache-tags.ts` — tag name constants (single source of truth)
- `lib/data.ts` — all `payload.find()` calls wrapped in `unstable_cache`
- `lib/__tests__/cache-tags.test.ts` — unit tests for tag constants

**Modified files:**
- `collections/Posts.ts` — add `afterChange` + `afterDelete` hooks
- `collections/Work.ts` — add `afterChange` + `afterDelete` hooks
- `collections/Projects.ts` — add `afterChange` + `afterDelete` hooks
- `collections/Pages.ts` — add `afterChange` + `afterDelete` hooks
- `collections/Timeline.ts` — add `afterChange` + `afterDelete` hooks
- `collections/Education.ts` — add `afterChange` + `afterDelete` hooks
- `collections/Certifications.ts` — add `afterChange` + `afterDelete` hooks
- `app/(site)/writing/page.tsx` — use `getCachedPosts()`, remove `revalidate`
- `app/(site)/writing/[slug]/page.tsx` — use `getCachedPost()`, `getCachedRelatedPosts()`
- `app/(site)/work/page.tsx` — use `getCachedWorkEntries()`, remove `revalidate`
- `app/(site)/work/[slug]/page.tsx` — use `getCachedWorkEntries()`, remove `revalidate`
- `app/(site)/projects/page.tsx` — use `getCachedProjects()`, remove `revalidate`
- `app/(site)/page.tsx` — use all cached functions, remove `revalidate`
- `app/(site)/page/[slug]/page.tsx` — use `getCachedBasicPage()`
- `app/(site)/legal/[slug]/page.tsx` — use `getCachedLegalPage()`
- `app/llms.txt/route.ts` — use `getCachedWorkEntries()`

---

## Task 1: Cache tag constants

**Files:**
- Create: `lib/cache-tags.ts`
- Create: `lib/__tests__/cache-tags.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// lib/__tests__/cache-tags.test.ts
import { describe, it, expect } from 'vitest'
import { CACHE_TAGS } from '../cache-tags'

describe('CACHE_TAGS', () => {
  it('has correct static tag values', () => {
    expect(CACHE_TAGS.posts).toBe('posts')
    expect(CACHE_TAGS.work).toBe('work')
    expect(CACHE_TAGS.projects).toBe('projects')
    expect(CACHE_TAGS.home).toBe('home')
    expect(CACHE_TAGS.pages).toBe('pages')
    expect(CACHE_TAGS.timeline).toBe('timeline')
    expect(CACHE_TAGS.education).toBe('education')
    expect(CACHE_TAGS.certifications).toBe('certifications')
  })

  it('generates slug-scoped tags', () => {
    expect(CACHE_TAGS.post('my-slug')).toBe('post-my-slug')
    expect(CACHE_TAGS.workEntry('design-system')).toBe('work-design-system')
    expect(CACHE_TAGS.page('privacy')).toBe('page-privacy')
  })
})
```

- [ ] **Step 2: Run test — verify it fails**

```bash
npm test -- cache-tags
```

Expected: FAIL with `Cannot find module '../cache-tags'`

- [ ] **Step 3: Create `lib/cache-tags.ts`**

```ts
export const CACHE_TAGS = {
  posts: 'posts',
  post: (slug: string) => `post-${slug}`,
  work: 'work',
  workEntry: (slug: string) => `work-${slug}`,
  projects: 'projects',
  home: 'home',
  pages: 'pages',
  page: (slug: string) => `page-${slug}`,
  timeline: 'timeline',
  education: 'education',
  certifications: 'certifications',
} as const
```

- [ ] **Step 4: Run test — verify it passes**

```bash
npm test -- cache-tags
```

Expected: PASS (2 tests)

- [ ] **Step 5: Commit**

```bash
git add lib/cache-tags.ts lib/__tests__/cache-tags.test.ts
git commit -m "feat(cache): add cache tag constants"
```

---

## Task 2: Centralized cached data layer

**Files:**
- Create: `lib/data.ts`

- [ ] **Step 1: Create `lib/data.ts`**

```ts
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
    ['related-posts', postSlug],
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
    { tags: [CACHE_TAGS.work, CACHE_TAGS.home], revalidate: false }
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
    { tags: [CACHE_TAGS.projects, CACHE_TAGS.home], revalidate: false }
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
    { tags: [CACHE_TAGS.timeline, CACHE_TAGS.home], revalidate: false }
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
    { tags: [CACHE_TAGS.education, CACHE_TAGS.home], revalidate: false }
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
    { tags: [CACHE_TAGS.certifications, CACHE_TAGS.home], revalidate: false }
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
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit 2>&1 | grep "lib/data"
```

Expected: no output (no errors in data.ts)

- [ ] **Step 3: Commit**

```bash
git add lib/data.ts
git commit -m "feat(cache): add centralized cached data layer"
```

---

## Task 3: Posts collection hook

**Files:**
- Modify: `collections/Posts.ts`

The existing `beforeChange` hook calculates `readingTime`. We add `afterChange` and `afterDelete` hooks that call `revalidateTag`. Both are wrapped in `try/catch` to no-op safely outside the Next.js request context (e.g., seed scripts).

- [ ] **Step 1: Update `collections/Posts.ts`**

Replace the entire file:

```ts
import type { CollectionConfig } from 'payload'
import { revalidateTag } from 'next/cache'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { CACHE_TAGS } from '@/lib/cache-tags'

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'featured', 'publishedAt'],
  },
  access: {
    read: ({ req }) => {
      if (req.user) return true
      return { status: { equals: 'published' } }
    },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL-friendly identifier, e.g. my-post-title',
      },
    },
    {
      name: 'excerpt',
      type: 'textarea',
    },
    {
      name: 'cover',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'tags',
      type: 'array',
      fields: [
        {
          name: 'tag',
          type: 'text',
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Pin this post as the featured article on the Writing index.',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'readingTime',
      type: 'number',
      admin: {
        position: 'sidebar',
        description: 'Estimated reading time in minutes (auto-calculated on save)',
        readOnly: false,
      },
    },
    {
      name: 'body',
      type: 'richText',
      editor: lexicalEditor(),
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        if (data.body) {
          const text = JSON.stringify(data.body)
          const wordCount = text.split(/\s+/).length
          data.readingTime = Math.max(1, Math.ceil(wordCount / 200))
        }
        return data
      },
    ],
    afterChange: [
      ({ doc }) => {
        try {
          revalidateTag(CACHE_TAGS.posts)
          if (doc.slug) revalidateTag(CACHE_TAGS.post(String(doc.slug)))
        } catch {
          // not in Next.js request context
        }
        return doc
      },
    ],
    afterDelete: [
      ({ doc }) => {
        try {
          revalidateTag(CACHE_TAGS.posts)
          if (doc.slug) revalidateTag(CACHE_TAGS.post(String(doc.slug)))
        } catch {
          // not in Next.js request context
        }
      },
    ],
  },
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit 2>&1 | grep "collections/Posts"
```

Expected: no output

- [ ] **Step 3: Commit**

```bash
git add collections/Posts.ts
git commit -m "feat(cache): revalidate posts tags on Payload save/delete"
```

---

## Task 4: Work collection hook

**Files:**
- Modify: `collections/Work.ts`

Work changes must invalidate `work`, `work-{slug}`, and `home` (the homepage shows a work preview).

- [ ] **Step 1: Update `collections/Work.ts`**

Add imports and hooks to the existing config. Replace the entire file:

```ts
import type { CollectionConfig } from 'payload'
import { revalidateTag } from 'next/cache'
import { CACHE_TAGS } from '@/lib/cache-tags'

export const Work: CollectionConfig = {
  slug: 'work',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'ord', 'status'],
  },
  access: {
    read: ({ req }) => {
      if (req.user) return true
      return { status: { equals: 'published' } }
    },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL-friendly identifier, e.g. design-system-foundation',
      },
    },
    {
      name: 'category',
      type: 'text',
      admin: {
        description: 'e.g. Design Systems, Platform Engineering',
      },
    },
    {
      name: 'ord',
      type: 'text',
      admin: {
        description: 'Display order label: 01, 02, 03',
      },
    },
    {
      name: 'tags',
      type: 'array',
      fields: [
        {
          name: 'tag',
          type: 'text',
        },
      ],
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'cover',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'briefing',
      type: 'group',
      fields: [
        {
          name: 'problem',
          type: 'textarea',
        },
        {
          name: 'approach',
          type: 'array',
          fields: [
            {
              name: 'step',
              type: 'textarea',
            },
          ],
        },
        {
          name: 'impact',
          type: 'textarea',
        },
        {
          name: 'quote',
          type: 'text',
        },
      ],
    },
    {
      name: 'stack',
      type: 'array',
      fields: [
        {
          name: 'name',
          type: 'text',
        },
        {
          name: 'role',
          type: 'text',
        },
      ],
    },
  ],
  hooks: {
    afterChange: [
      ({ doc }) => {
        try {
          revalidateTag(CACHE_TAGS.work)
          revalidateTag(CACHE_TAGS.home)
          if (doc.slug) revalidateTag(CACHE_TAGS.workEntry(String(doc.slug)))
        } catch {
          // not in Next.js request context
        }
        return doc
      },
    ],
    afterDelete: [
      ({ doc }) => {
        try {
          revalidateTag(CACHE_TAGS.work)
          revalidateTag(CACHE_TAGS.home)
          if (doc.slug) revalidateTag(CACHE_TAGS.workEntry(String(doc.slug)))
        } catch {
          // not in Next.js request context
        }
      },
    ],
  },
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit 2>&1 | grep "collections/Work"
```

Expected: no output

- [ ] **Step 3: Commit**

```bash
git add collections/Work.ts
git commit -m "feat(cache): revalidate work tags on Payload save/delete"
```

---

## Task 5: Projects collection hook

**Files:**
- Modify: `collections/Projects.ts`

Projects changes must invalidate `projects` and `home` (homepage shows featured projects).

- [ ] **Step 1: Update `collections/Projects.ts`**

Replace the entire file:

```ts
import type { CollectionConfig } from 'payload'
import { revalidateTag } from 'next/cache'
import { CACHE_TAGS } from '@/lib/cache-tags'

export const Projects: CollectionConfig = {
  slug: 'projects',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'featured', 'status'],
  },
  access: {
    read: ({ req }) => {
      if (req.user) return true
      return { status: { equals: 'published' } }
    },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'subtitle',
      type: 'text',
      admin: {
        description: 'Short tagline shown below title',
      },
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'category',
      type: 'text',
      admin: {
        description: 'e.g. Chrome Extension, Agentic AI, Mobile App',
      },
    },
    {
      name: 'tags',
      type: 'array',
      fields: [
        {
          name: 'tag',
          type: 'text',
        },
      ],
    },
    {
      name: 'liveUrl',
      type: 'text',
      admin: {
        description: 'Chrome Web Store, Play Store, or live URL',
      },
    },
    {
      name: 'repoUrl',
      type: 'text',
      admin: {
        description: 'GitHub repo or PR URL',
      },
    },
    {
      name: 'startDate',
      type: 'text',
      admin: {
        description: 'e.g. February 2025',
      },
    },
    {
      name: 'endDate',
      type: 'text',
      admin: {
        description: 'e.g. October 2025 — leave blank for ongoing',
      },
    },
    {
      name: 'highlights',
      type: 'array',
      fields: [
        {
          name: 'point',
          type: 'textarea',
        },
      ],
      admin: {
        description: 'Bullet points from CV — 2–4 highlights',
      },
    },
    {
      name: 'cover',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Show on homepage featured section',
      },
    },
  ],
  hooks: {
    afterChange: [
      ({ doc }) => {
        try {
          revalidateTag(CACHE_TAGS.projects)
          revalidateTag(CACHE_TAGS.home)
        } catch {
          // not in Next.js request context
        }
        return doc
      },
    ],
    afterDelete: [
      ({ doc }) => {
        try {
          revalidateTag(CACHE_TAGS.projects)
          revalidateTag(CACHE_TAGS.home)
        } catch {
          // not in Next.js request context
        }
      },
    ],
  },
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit 2>&1 | grep "collections/Projects"
```

Expected: no output

- [ ] **Step 3: Commit**

```bash
git add collections/Projects.ts
git commit -m "feat(cache): revalidate projects tags on Payload save/delete"
```

---

## Task 6: Pages collection hook

**Files:**
- Modify: `collections/Pages.ts`

Pages changes must invalidate `pages` and `page-{slug}`.

- [ ] **Step 1: Update `collections/Pages.ts`**

Replace the entire file:

```ts
import type { CollectionConfig } from 'payload'
import { revalidateTag } from 'next/cache'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { CACHE_TAGS } from '@/lib/cache-tags'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'template', 'slug'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL-friendly identifier, e.g. privacy, terms, about',
      },
    },
    {
      name: 'template',
      type: 'select',
      required: true,
      options: [
        { label: 'Legal', value: 'legal' },
        { label: 'Basic', value: 'basic' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'lastUpdated',
      type: 'date',
      admin: {
        position: 'sidebar',
        condition: (data) => data.template === 'legal',
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    {
      name: 'body',
      type: 'richText',
      required: true,
      editor: lexicalEditor(),
    },
  ],
  hooks: {
    afterChange: [
      ({ doc }) => {
        try {
          revalidateTag(CACHE_TAGS.pages)
          if (doc.slug) revalidateTag(CACHE_TAGS.page(String(doc.slug)))
        } catch {
          // not in Next.js request context
        }
        return doc
      },
    ],
    afterDelete: [
      ({ doc }) => {
        try {
          revalidateTag(CACHE_TAGS.pages)
          if (doc.slug) revalidateTag(CACHE_TAGS.page(String(doc.slug)))
        } catch {
          // not in Next.js request context
        }
      },
    ],
  },
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit 2>&1 | grep "collections/Pages"
```

Expected: no output

- [ ] **Step 3: Commit**

```bash
git add collections/Pages.ts
git commit -m "feat(cache): revalidate pages tags on Payload save/delete"
```

---

## Task 7: Timeline, Education, Certifications hooks

**Files:**
- Modify: `collections/Timeline.ts`
- Modify: `collections/Education.ts`
- Modify: `collections/Certifications.ts`

All three collections feed only the homepage, so they invalidate their own tag plus `home`.

- [ ] **Step 1: Update `collections/Timeline.ts`**

Replace the entire file:

```ts
import type { CollectionConfig } from 'payload'
import { revalidateTag } from 'next/cache'
import { CACHE_TAGS } from '@/lib/cache-tags'

export const Timeline: CollectionConfig = {
  slug: 'timeline',
  admin: {
    useAsTitle: 'company',
    defaultColumns: ['company', 'role', 'start', 'end', 'order'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'company',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'text',
      required: true,
    },
    {
      name: 'start',
      type: 'text',
      required: true,
      admin: {
        description: 'Year as string: 2022',
      },
    },
    {
      name: 'end',
      type: 'text',
      admin: {
        description: 'Year or leave blank for current role',
      },
    },
    {
      name: 'summary',
      type: 'textarea',
    },
    {
      name: 'tags',
      type: 'array',
      fields: [
        {
          name: 'tag',
          type: 'text',
        },
      ],
    },
    {
      name: 'order',
      type: 'number',
      admin: {
        position: 'sidebar',
        description: 'Lower = displayed first. Current role = 1.',
      },
    },
  ],
  hooks: {
    afterChange: [
      ({ doc }) => {
        try {
          revalidateTag(CACHE_TAGS.timeline)
          revalidateTag(CACHE_TAGS.home)
        } catch {
          // not in Next.js request context
        }
        return doc
      },
    ],
    afterDelete: [
      () => {
        try {
          revalidateTag(CACHE_TAGS.timeline)
          revalidateTag(CACHE_TAGS.home)
        } catch {
          // not in Next.js request context
        }
      },
    ],
  },
}
```

- [ ] **Step 2: Update `collections/Education.ts`**

Replace the entire file:

```ts
import type { CollectionConfig } from 'payload'
import { revalidateTag } from 'next/cache'
import { CACHE_TAGS } from '@/lib/cache-tags'

export const Education: CollectionConfig = {
  slug: 'education',
  admin: {
    useAsTitle: 'degree',
    defaultColumns: ['degree', 'institution', 'start', 'end', 'status', 'order'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'institution',
      type: 'text',
      required: true,
    },
    {
      name: 'degree',
      type: 'text',
      required: true,
    },
    {
      name: 'location',
      type: 'text',
    },
    {
      name: 'start',
      type: 'text',
      admin: {
        description: 'Year as string: 2016',
      },
    },
    {
      name: 'end',
      type: 'text',
      admin: {
        description: 'Year as string: 2017 — leave blank for ongoing',
      },
    },
    {
      name: 'gpa',
      type: 'text',
      admin: {
        description: 'e.g. CGPA 8.31 / 10',
      },
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Completed', value: 'completed' },
        { label: 'Ongoing', value: 'ongoing' },
        { label: 'Expected', value: 'expected' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'order',
      type: 'number',
      admin: {
        position: 'sidebar',
        description: 'Lower = displayed first.',
      },
    },
  ],
  hooks: {
    afterChange: [
      ({ doc }) => {
        try {
          revalidateTag(CACHE_TAGS.education)
          revalidateTag(CACHE_TAGS.home)
        } catch {
          // not in Next.js request context
        }
        return doc
      },
    ],
    afterDelete: [
      () => {
        try {
          revalidateTag(CACHE_TAGS.education)
          revalidateTag(CACHE_TAGS.home)
        } catch {
          // not in Next.js request context
        }
      },
    ],
  },
}
```

- [ ] **Step 3: Update `collections/Certifications.ts`**

Replace the entire file:

```ts
import type { CollectionConfig } from 'payload'
import { revalidateTag } from 'next/cache'
import { CACHE_TAGS } from '@/lib/cache-tags'

export const Certifications: CollectionConfig = {
  slug: 'certifications',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'issuer', 'year', 'order'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'issuer',
      type: 'text',
      required: true,
    },
    {
      name: 'year',
      type: 'text',
      required: true,
      admin: {
        description: 'Year as string: 2025',
      },
    },
    {
      name: 'credentialUrl',
      type: 'text',
      admin: {
        description: 'Optional verification link',
      },
    },
    {
      name: 'order',
      type: 'number',
      admin: {
        position: 'sidebar',
        description: 'Lower = displayed first.',
      },
    },
  ],
  hooks: {
    afterChange: [
      ({ doc }) => {
        try {
          revalidateTag(CACHE_TAGS.certifications)
          revalidateTag(CACHE_TAGS.home)
        } catch {
          // not in Next.js request context
        }
        return doc
      },
    ],
    afterDelete: [
      () => {
        try {
          revalidateTag(CACHE_TAGS.certifications)
          revalidateTag(CACHE_TAGS.home)
        } catch {
          // not in Next.js request context
        }
      },
    ],
  },
}
```

- [ ] **Step 4: Verify TypeScript compiles**

```bash
npx tsc --noEmit 2>&1 | grep -E "collections/(Timeline|Education|Certifications)"
```

Expected: no output

- [ ] **Step 5: Commit**

```bash
git add collections/Timeline.ts collections/Education.ts collections/Certifications.ts
git commit -m "feat(cache): revalidate timeline/education/certifications tags on save/delete"
```

---

## Task 8: Update `/writing` page

**Files:**
- Modify: `app/(site)/writing/page.tsx`

Remove `export const revalidate = 60` and the inline `fetchPosts` function. Import `getCachedPosts` from `lib/data.ts`.

- [ ] **Step 1: Replace `app/(site)/writing/page.tsx`**

```tsx
import { getCachedPosts } from '@/lib/data'
import { WritingList } from '@/components/sections/writing-list'
import { createMetadata } from '@/lib/metadata'
import type { Post } from '@/lib/types'

export const metadata = createMetadata({
  title: 'Writing',
  description: 'Articles and thoughts on frontend engineering, architecture, and building at scale.',
})

export default async function WritingIndex() {
  let posts: Post[] = []

  try {
    posts = await getCachedPosts()
  } catch {
    // Payload not available — show empty state
  }

  const heroPost = pickHero(posts)

  return <WritingList posts={posts} heroPost={heroPost} />
}

function pickHero(posts: Post[]): Post | null {
  const featured = posts.find((p) => p.featured && p.cover)
  if (featured) return featured
  return posts.find((p) => p.cover) ?? null
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit 2>&1 | grep "writing/page"
```

Expected: no output

- [ ] **Step 3: Commit**

```bash
git add "app/(site)/writing/page.tsx"
git commit -m "feat(cache): wire /writing page to cached data layer"
```

---

## Task 9: Update `/writing/[slug]` page

**Files:**
- Modify: `app/(site)/writing/[slug]/page.tsx`

Remove inline fetch functions. Use `getCachedPost` and `getCachedRelatedPosts` from `lib/data.ts`. `resolvePostCover` is still imported from `lib/posts.ts`.

- [ ] **Step 1: Replace `app/(site)/writing/[slug]/page.tsx`**

```tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCachedPost, getCachedRelatedPosts } from '@/lib/data'
import { WritingPost } from '@/components/sections/writing-post'
import { createMetadata } from '@/lib/metadata'
import { resolvePostCover } from '@/lib/posts'

interface PostPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params
  try {
    const post = await getCachedPost(slug)
    if (!post) return { title: 'Not Found' }
    return createMetadata({
      title: (post.meta as { title?: string })?.title ?? post.title,
      description: (post.meta as { description?: string })?.description ?? post.excerpt ?? undefined,
    })
  } catch {
    return { title: slug }
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params

  let post: Awaited<ReturnType<typeof getCachedPost>> | undefined
  try {
    post = await getCachedPost(slug)
  } catch {
    // Payload unavailable — fall through to notFound below
  }

  if (!post) notFound()

  const postTags = post.tags?.map((t: { tag?: string | null }) => t.tag ?? '') ?? []
  const relatedPosts = await getCachedRelatedPosts(post.slug, postTags).catch(() => [])

  const coverResolved = resolvePostCover(post.cover)

  return (
    <WritingPost
      title={post.title}
      publishedAt={post.publishedAt ?? undefined}
      readingTime={post.readingTime ?? undefined}
      tags={post.tags?.map((t: { tag?: string | null }) => ({ tag: t.tag ?? '' }))}
      body={post.body}
      cover={coverResolved}
      related={relatedPosts}
    />
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit 2>&1 | grep "writing/\[slug\]"
```

Expected: no output

- [ ] **Step 3: Commit**

```bash
git add "app/(site)/writing/[slug]/page.tsx"
git commit -m "feat(cache): wire /writing/[slug] page to cached data layer"
```

---

## Task 10: Update `/work` and `/work/[slug]` pages

**Files:**
- Modify: `app/(site)/work/page.tsx`
- Modify: `app/(site)/work/[slug]/page.tsx`

Both pages use the same `getCachedWorkEntries()` call — they share the same cache entry.

- [ ] **Step 1: Replace `app/(site)/work/page.tsx`**

```tsx
import { getCachedWorkEntries } from '@/lib/data'
import { SelectedWork } from '@/components/sections/selected-work'
import { createMetadata } from '@/lib/metadata'
import type { WorkEntry } from '@/lib/types'

export const metadata = createMetadata({
  title: 'Work',
  description: 'Selected projects from 9+ years of full-stack engineering.',
})

export default async function WorkIndex() {
  let projects: WorkEntry[] = []

  try {
    projects = await getCachedWorkEntries()
  } catch {
    // Payload not available — show empty state
  }

  return (
    <>
      <div className="pt-6 pb-10 border-b border-border">
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
```

- [ ] **Step 2: Replace `app/(site)/work/[slug]/page.tsx`**

```tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCachedWorkEntries } from '@/lib/data'
import { ProjectBriefing } from '@/components/sections/project-briefing'
import { createMetadata } from '@/lib/metadata'
import type { WorkEntry } from '@/lib/types'

interface WorkDetailProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: WorkDetailProps): Promise<Metadata> {
  const { slug } = await params
  try {
    const entries = await getCachedWorkEntries()
    const project = entries.find((p) => p.slug === slug)
    if (!project) return {}
    return createMetadata({ title: project.title, description: project.description })
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

  return (
    <ProjectBriefing project={project} prevProject={prevProject} nextProject={nextProject} />
  )
}
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit 2>&1 | grep -E "work/(page|\[slug\])"
```

Expected: no output

- [ ] **Step 4: Commit**

```bash
git add "app/(site)/work/page.tsx" "app/(site)/work/[slug]/page.tsx"
git commit -m "feat(cache): wire /work pages to cached data layer"
```

---

## Task 11: Update `/projects` page

**Files:**
- Modify: `app/(site)/projects/page.tsx`

- [ ] **Step 1: Replace `app/(site)/projects/page.tsx`**

```tsx
import { getCachedProjects } from '@/lib/data'
import { ProjectsGrid } from '@/components/sections/projects-grid'
import { createMetadata } from '@/lib/metadata'
import type { ProjectEntry } from '@/lib/types'

export const metadata = createMetadata({
  title: 'Projects',
  description: 'Side projects, Chrome extensions, mobile apps, and open-source contributions.',
})

export default async function ProjectsIndex() {
  let projects: ProjectEntry[] = []

  try {
    projects = await getCachedProjects()
  } catch {
    // Payload not available — show empty state
  }

  return (
    <>
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
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit 2>&1 | grep "projects/page"
```

Expected: no output

- [ ] **Step 3: Commit**

```bash
git add "app/(site)/projects/page.tsx"
git commit -m "feat(cache): wire /projects page to cached data layer"
```

---

## Task 12: Update home page (`/`)

**Files:**
- Modify: `app/(site)/page.tsx`

The home page aggregates 5 collections. Remove `export const revalidate = 60` and all inline `fetchXxx` functions. Use cached functions from `lib/data.ts`. Work preview is sliced to 3; featured projects are filtered from the full projects list.

- [ ] **Step 1: Replace `app/(site)/page.tsx`**

```tsx
import {
  getCachedWorkEntries,
  getCachedProjects,
  getCachedTimeline,
  getCachedEducation,
  getCachedCertifications,
} from '@/lib/data'
import { Hero } from '@/components/sections/hero'
import { Journey } from '@/components/sections/journey'
import { Philosophy } from '@/components/sections/philosophy'
import { SelectedWork } from '@/components/sections/selected-work'
import { ProjectsGrid } from '@/components/sections/projects-grid'
import { Education } from '@/components/sections/education'
import { Certifications } from '@/components/sections/certifications'
import { CtaBanner } from '@/components/sections/cta-banner'
import { site } from '@/content/site'
import { philosophy } from '@/content/philosophy'
import { createMetadata } from '@/lib/metadata'
import type { WorkEntry, ProjectEntry, TimelineEntry, EducationEntry, CertificationEntry } from '@/lib/types'

export const metadata = createMetadata({
  title: 'About',
  description: site.subheadline,
})

export default async function Home() {
  let workEntries: WorkEntry[] = []
  let allProjects: ProjectEntry[] = []
  let timelineItems: TimelineEntry[] = []
  let educationItems: EducationEntry[] = []
  let certificationItems: CertificationEntry[] = []

  const [workResult, projectsResult, timelineResult, educationResult, certificationsResult] =
    await Promise.allSettled([
      getCachedWorkEntries(),
      getCachedProjects(),
      getCachedTimeline(),
      getCachedEducation(),
      getCachedCertifications(),
    ])

  if (workResult.status === 'fulfilled') workEntries = workResult.value
  if (projectsResult.status === 'fulfilled') allProjects = projectsResult.value
  if (timelineResult.status === 'fulfilled') timelineItems = timelineResult.value
  if (educationResult.status === 'fulfilled') educationItems = educationResult.value
  if (certificationsResult.status === 'fulfilled') certificationItems = certificationsResult.value

  const featuredProjects = allProjects.filter((p) => p.featured).slice(0, 6)

  return (
    <>
      <Hero
        eyebrow={site.eyebrow}
        headline={site.headline}
        subheadline={site.subheadline}
        status={site.status}
        stats={site.stats}
        primaryCta={{ label: 'View My Work', href: '/work' }}
        secondaryCta={{ label: 'Get In Touch', href: '/contact' }}
      />
      <Journey items={timelineItems} />
      <Philosophy
        eyebrow={philosophy.eyebrow}
        heading={philosophy.heading}
        pillars={philosophy.pillars}
      />
      <SelectedWork projects={workEntries.slice(0, 3)} showViewAll />
      {featuredProjects.length > 0 && (
        <ProjectsGrid projects={featuredProjects} showViewAll />
      )}
      <Education items={educationItems} />
      <Certifications items={certificationItems} />
      <CtaBanner
        eyebrow="Let's work together"
        heading="Open to new opportunities"
        body="I'm selectively exploring senior full-stack and tech-lead roles at product companies. If you're building something ambitious and care about craft, let's talk."
        primaryCta={{ label: 'Get In Touch', href: '/contact' }}
        secondaryCta={{ label: 'View My Stack', href: '/stack' }}
      />
    </>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit 2>&1 | grep '"(site)/page"'
```

Expected: no output

- [ ] **Step 3: Commit**

```bash
git add "app/(site)/page.tsx"
git commit -m "feat(cache): wire home page to cached data layer"
```

---

## Task 13: Update `/page/[slug]` and `/legal/[slug]` pages

**Files:**
- Modify: `app/(site)/page/[slug]/page.tsx`
- Modify: `app/(site)/legal/[slug]/page.tsx`

- [ ] **Step 1: Replace `app/(site)/page/[slug]/page.tsx`**

```tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { getCachedBasicPage } from '@/lib/data'
import { createMetadata } from '@/lib/metadata'

interface BasicPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: BasicPageProps): Promise<Metadata> {
  const { slug } = await params
  try {
    const page = await getCachedBasicPage(slug)
    if (!page) return { title: 'Not Found' }
    return createMetadata({ title: page.title })
  } catch {
    return { title: slug }
  }
}

export default async function BasicPage({ params }: BasicPageProps) {
  const { slug } = await params

  let page: Awaited<ReturnType<typeof getCachedBasicPage>> | undefined
  try {
    page = await getCachedBasicPage(slug)
  } catch {
    // Payload unavailable — fall through to notFound below
  }

  if (!page) notFound()

  return (
    <div className="max-w-3xl">
      <h1 className="font-sans text-4xl font-semibold tracking-tight mb-8">
        {page.title}
      </h1>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <RichText data={page.body} />
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Replace `app/(site)/legal/[slug]/page.tsx`**

```tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { getCachedLegalPage } from '@/lib/data'
import { createMetadata } from '@/lib/metadata'

interface LegalPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: LegalPageProps): Promise<Metadata> {
  const { slug } = await params
  try {
    const page = await getCachedLegalPage(slug)
    if (!page) return { title: 'Not Found' }
    return createMetadata({ title: page.title })
  } catch {
    return { title: slug }
  }
}

export default async function LegalPage({ params }: LegalPageProps) {
  const { slug } = await params

  let page: Awaited<ReturnType<typeof getCachedLegalPage>> | undefined
  try {
    page = await getCachedLegalPage(slug)
  } catch {
    // Payload unavailable — fall through to notFound below
  }

  if (!page) notFound()

  const lastUpdated = page.lastUpdated
    ? new Date(page.lastUpdated).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : null

  return (
    <div className="max-w-3xl">
      <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-4">
        Legal
      </p>
      <h1 className="font-sans text-4xl font-semibold tracking-tight mb-2">
        {page.title}
      </h1>
      {lastUpdated && (
        <p className="text-sm text-muted-foreground mb-8">
          Last updated {lastUpdated}
        </p>
      )}
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <RichText data={page.body} />
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit 2>&1 | grep -E "(page/\[slug\]|legal/\[slug\])"
```

Expected: no output

- [ ] **Step 4: Commit**

```bash
git add "app/(site)/page/[slug]/page.tsx" "app/(site)/legal/[slug]/page.tsx"
git commit -m "feat(cache): wire page/legal slug pages to cached data layer"
```

---

## Task 14: Update `/llms.txt` route

**Files:**
- Modify: `app/llms.txt/route.ts`

- [ ] **Step 1: Replace `app/llms.txt/route.ts`**

```ts
import { NextResponse } from 'next/server'
import { getCachedWorkEntries } from '@/lib/data'
import { site } from '@/content/site'
import { stack } from '@/content/stack'

export async function GET() {
  let workEntries = await getCachedWorkEntries().catch(() => [])

  const lines: string[] = [
    `# ${site.name}`,
    `> ${site.role} based in ${site.location}. ${site.subheadline}`,
    '',
    `Contact: ${site.email}`,
    '',
    '## Pages',
    `- [About](${site.url}/): Introduction, career stats, work philosophy, and experience timeline.`,
    `- [Work](${site.url}/work): Selected project case studies covering problem, approach, impact, and stack.`,
    `- [Projects](${site.url}/projects): Side projects, Chrome extensions, mobile apps, and open-source contributions.`,
    `- [Stack](${site.url}/stack): Full tool and technology breakdown with proficiency levels.`,
    `- [Writing](${site.url}/writing): Articles on frontend engineering, architecture, and building at scale.`,
    `- [Contact](${site.url}/contact): Enquiry form and direct contact details.`,
    '',
    '## Selected Work',
    ...workEntries.map(
      (p) => `- [${p.title}](${site.url}/work/${p.slug}): ${p.description}`
    ),
    '',
    '## Stack Highlights',
    ...stack.disciplines.map(
      (d) =>
        `- ${d.name}: ${d.tools
          .flatMap((t) =>
            t.maturity === 'expert' || t.maturity === 'proficient' ? [t.name] : []
          )
          .join(', ')}`
    ),
  ]

  return new NextResponse(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit 2>&1 | grep "llms.txt"
```

Expected: no output

- [ ] **Step 3: Commit**

```bash
git add "app/llms.txt/route.ts"
git commit -m "feat(cache): wire llms.txt route to cached data layer"
```

---

## Task 15: Full verification

- [ ] **Step 1: Run all tests**

```bash
npm test
```

Expected: all tests pass (including the new cache-tags tests)

- [ ] **Step 2: Full TypeScript check**

```bash
npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 3: Build check**

```bash
npm run build 2>&1 | tail -30
```

Expected: build completes successfully, no type errors

- [ ] **Step 4: Final commit (if any stragglers)**

```bash
git status
```

If clean, nothing to do. If any files remain unstaged, add and commit them.
