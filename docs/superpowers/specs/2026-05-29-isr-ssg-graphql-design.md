---
name: isr-ssg-graphql
description: Replace unstable_cache + local Payload API with fetch()-based GraphQL data layer and add route segment configs + generateStaticParams to convert all content routes from dynamic (ƒ) to ISR (●) or static (○)
metadata:
  type: project
---

# ISR / SSG via GraphQL — Design Spec

**Date:** 2026-05-29  
**Status:** Approved

---

## Problem

All 10 content routes are fully dynamic (`ƒ`). `unstable_cache` caches data at the function level but has no effect on route rendering mode. Without route segment config (`export const revalidate`) and `generateStaticParams`, Next.js renders every route on every request.

The Payload `afterChange` hooks in all collections already call `revalidateTag()` correctly — that part is correct and requires no changes.

---

## Goal

Convert all content routes to ISR (`●`) or static (`○`) without changing any component code, and replace `unstable_cache` with Next.js's native `fetch()` Data Cache.

---

## Architecture

### 1. `lib/graphql.ts` — new file

A single `gqlFetch` helper is the only new abstraction:

```ts
export async function gqlFetch<T>(
  query: string,
  variables?: Record<string, unknown>,
  tags: string[] = []
): Promise<T>
```

- Calls `${process.env.NEXT_PUBLIC_SITE_URL}/api/graphql` via POST
- Passes `next: { tags, revalidate: false }` to opt into the Next.js Data Cache
- `revalidate: false` = cache indefinitely; purged only by `revalidateTag()`
- Throws on HTTP errors or GraphQL errors (same behaviour as current local API calls)

`NEXT_PUBLIC_SITE_URL` is already defined in `.env.example` and `.env.local`.

### 2. `lib/data.ts` — full rewrite

Every function replaces its `unstable_cache(async () => payload.find(...))()` body with a `gqlFetch(QUERY, vars, [CACHE_TAGS.xyz])` call. The same cache tags are passed through so the existing `afterChange` hooks continue to invalidate correctly.

Return types and shapes are preserved exactly — no component changes required.

Functions rewritten (one-to-one):

| Function | Collections queried | Tags |
|---|---|---|
| `getCachedPosts` | `Posts` | `CACHE_TAGS.posts` |
| `getCachedPost(slug)` | `Posts` | `CACHE_TAGS.posts`, `CACHE_TAGS.post(slug)` |
| `getCachedRelatedPosts(slug, tags)` | `Posts` | `CACHE_TAGS.posts` |
| `getCachedWorkEntries` | `Work` | `CACHE_TAGS.work` |
| `getCachedProjects` | `Projects` | `CACHE_TAGS.projects` |
| `getCachedTimeline` | `Timeline` | `CACHE_TAGS.timeline` |
| `getCachedEducation` | `Education` | `CACHE_TAGS.education` |
| `getCachedCertifications` | `Certifications` | `CACHE_TAGS.certifications` |
| `getSitemapPosts` | `Posts` | `CACHE_TAGS.posts` |
| `getSitemapWork` | `Work` | `CACHE_TAGS.work` |
| `getSitemapPages` | `Pages` | `CACHE_TAGS.pages` |
| `getCachedBasicPage(slug)` | `Pages` | `CACHE_TAGS.pages`, `CACHE_TAGS.page(slug)` |
| `getCachedLegalPage(slug)` | `Pages` | `CACHE_TAGS.pages`, `CACHE_TAGS.page(slug)` |

`_fetchRecentPosts` (internal helper) is also rewritten to use `gqlFetch`.

### 3. Route segment configs

Added to page files — no component JSX changes:

| Route file | Exports added | Build result |
|---|---|---|
| `app/(site)/page.tsx` | `export const revalidate = false` | `●` ISR |
| `app/(site)/projects/page.tsx` | `export const revalidate = false` | `●` ISR |
| `app/(site)/work/page.tsx` | `export const revalidate = false` | `●` ISR |
| `app/(site)/work/[slug]/page.tsx` | `export const revalidate = false`<br>`export const dynamicParams = true` | `●` ISR |
| `app/(site)/writing/page.tsx` | `export const revalidate = false` | `●` ISR |
| `app/(site)/writing/[slug]/page.tsx` | `export const revalidate = false`<br>`export const dynamicParams = true` | `●` ISR |
| `app/(site)/legal/[slug]/page.tsx` | `export const revalidate = false`<br>`export const dynamicParams = true` | `●` ISR |
| `app/(site)/page/[slug]/page.tsx` | `export const revalidate = false`<br>`export const dynamicParams = true` | `●` ISR |
| `app/(site)/stack/page.tsx` | `export const dynamic = 'force-static'` | `○` Static |
| `app/(site)/contact/page.tsx` | `export const dynamic = 'force-static'` | `○` Static |

`dynamicParams = true` means slugs published after the last build render on demand and are cached as ISR entries — no redeploy required for new content.

### 4. `generateStaticParams` — local Payload API

Added to the four dynamic-slug routes. Calls `getPayloadClient()` directly (in-process, no HTTP) to enumerate slugs at build time. This avoids the HTTP chicken-and-egg problem (no server running during `next build`).

```
/writing/[slug]  → all published posts
/work/[slug]     → all published work entries
/legal/[slug]    → all pages where template = 'legal'
/page/[slug]     → all pages where template = 'basic'
```

### 5. Revalidation — no changes needed

Payload `afterChange` hooks already call `revalidateTag(tag)` directly (in-process). These purge the `fetch()` Data Cache entries tagged with matching tags identically to how they purged `unstable_cache` entries. No new webhook endpoint, no new Payload config.

---

## Data flow after migration

```
Build time
  generateStaticParams (local Payload API) → slug list
  page renders → gqlFetch → Payload GraphQL → Data Cache (tagged, revalidate=false)
  pre-rendered HTML stored in Full Route Cache

Runtime (cache hit)
  request → Full Route Cache hit → response (no DB)

Runtime (after revalidateTag)
  Payload save → afterChange hook → revalidateTag('posts')
  → marks fetch() cache entries stale
  next request → ISR re-render → gqlFetch → Payload GraphQL
  → new HTML cached again
```

---

## Out of scope

- `/contact` — becomes `○` static (already no Payload data, form is client-side)
- `/stack` — becomes `○` static (pulls from `content/stack.ts`, no Payload)
- `/admin`, `/api`, `/maintenance`, `/sitemap`, `/llms.txt` — not touched
- GraphQL authentication — Payload collections already have `read` access rules that allow public reads for published content; no auth header needed for public queries
- Error handling — preserved as-is (try/catch in page components, empty-state fallback)

---

## Files changed

| File | Change |
|---|---|
| `lib/graphql.ts` | **New** — `gqlFetch` helper |
| `lib/data.ts` | **Rewrite** — swap `unstable_cache` + local API for `gqlFetch` |
| `app/(site)/page.tsx` | Add `revalidate` export |
| `app/(site)/projects/page.tsx` | Add `revalidate` export |
| `app/(site)/stack/page.tsx` | Add `dynamic` export |
| `app/(site)/contact/page.tsx` | Add `dynamic` export |
| `app/(site)/work/page.tsx` | Add `revalidate` export |
| `app/(site)/work/[slug]/page.tsx` | Add `revalidate`, `dynamicParams`, `generateStaticParams` |
| `app/(site)/writing/page.tsx` | Add `revalidate` export |
| `app/(site)/writing/[slug]/page.tsx` | Add `revalidate`, `dynamicParams`, `generateStaticParams` |
| `app/(site)/legal/[slug]/page.tsx` | Add `revalidate`, `dynamicParams`, `generateStaticParams` |
| `app/(site)/page/[slug]/page.tsx` | Add `revalidate`, `dynamicParams`, `generateStaticParams` |
