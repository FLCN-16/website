# revalidateTag Caching Design

**Date:** 2026-05-28  
**Status:** Approved

## Problem

Pages currently use `export const revalidate = 60` (time-based ISR). Data fetched via Payload's local API (`payload.find()`) bypasses Next.js's native fetch cache, so tag-based invalidation is not wired up. Content changes in the Payload admin are not reflected until the 60-second timer expires.

## Goal

Replace time-based revalidation with tag-based cache invalidation. When a document is saved or deleted in the Payload admin, only the affected pages are revalidated — immediately and precisely.

---

## Architecture

### Layer 1: Tag Constants — `lib/cache-tags.ts`

Single source of truth for all cache tag strings. Prevents typos and makes it easy to audit what tags exist.

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

---

### Layer 2: Cached Data Functions — `lib/data.ts`

All `payload.find()` calls wrapped with `unstable_cache` and assigned tags. Pages import these functions instead of calling `getPayloadClient()` inline.

`revalidate: false` — time-based revalidation is disabled; tags are the only trigger.

**Functions:**

| Function | Tags | Used by |
|---|---|---|
| `getCachedPosts()` | `posts` | `/writing` |
| `getCachedPost(slug)` | `posts`, `post-{slug}` | `/writing/[slug]` |
| `getCachedRelatedPosts(slug)` | `posts` | `/writing/[slug]` |
| `getCachedWorkEntries()` | `work`, `home` | `/work`, `/work/[slug]`, `/` (sliced to 3), `/llms.txt` |
| `getCachedProjects()` | `projects`, `home` | `/projects`, `/` (filtered to featured) |
| `getCachedTimeline()` | `timeline`, `home` | `/` |
| `getCachedEducation()` | `education`, `home` | `/` |
| `getCachedCertifications()` | `certifications`, `home` | `/` |
| `getCachedPage(slug)` | `pages`, `page-{slug}` | `/page/[slug]`, `/legal/[slug]` |

For per-slug functions, `unstable_cache` is called with the slug baked into the cache key array, e.g. `['post', slug]`, so each slug gets its own cache entry.

The home page shares the same cache entries as the list pages (`getCachedWorkEntries`, `getCachedProjects`) — it just slices or filters the result client-side. No separate home-specific fetch functions needed.

---

### Layer 3: Collection Hooks — revalidation in collection configs

Each Payload collection gets `afterChange` and `afterDelete` hooks that call `revalidateTag()` from `next/cache`.

All calls are wrapped in `try/catch` to safely no-op in non-Next.js contexts (seed scripts, `payload generate:types`, CLI).

**Invalidation map:**

| Collection | Tags invalidated on change/delete |
|---|---|
| `posts` | `posts`, `post-{slug}` |
| `work` | `work`, `work-{slug}`, `home` |
| `projects` | `projects`, `home` |
| `pages` | `pages`, `page-{slug}` |
| `timeline` | `timeline`, `home` |
| `education` | `education`, `home` |
| `certifications` | `certifications`, `home` |

Hook location: inline in each collection file (no separate hooks directory needed).

---

## Page Changes

All pages:
- Remove `export const revalidate = 60`
- Remove inline `fetchXxx()` functions
- Import and call the corresponding `getCachedXxx()` from `lib/data.ts`

No rendering logic changes.

---

## Files

**New:**
- `lib/cache-tags.ts`
- `lib/data.ts`

**Modified:**
- `collections/Posts.ts`
- `collections/Work.ts`
- `collections/Projects.ts`
- `collections/Pages.ts`
- `collections/Timeline.ts`
- `collections/Education.ts`
- `collections/Certifications.ts`
- `app/(site)/page.tsx`
- `app/(site)/writing/page.tsx`
- `app/(site)/writing/[slug]/page.tsx`
- `app/(site)/work/page.tsx`
- `app/(site)/work/[slug]/page.tsx`
- `app/(site)/projects/page.tsx`
- `app/(site)/page/[slug]/page.tsx`
- `app/(site)/legal/[slug]/page.tsx`
- `app/llms.txt/route.ts`

---

## Non-Goals

- No API route for webhook-based revalidation (Payload is co-located; hooks are sufficient)
- No change to `app/(site)/contact/page.tsx` or `app/(site)/stack/page.tsx` (no Payload data)
- No change to Payload admin or auth
