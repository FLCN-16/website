# Error Pages Design

**Date:** 2026-05-28
**Status:** Approved

## Overview

Add three error pages that cover all failure modes in the Next.js App Router: a global 404 for unmatched root paths, a site-scoped 404 for `notFound()` calls within the `(site)` route group, and a site-scoped runtime error boundary.

## Files

| File | Triggered when | Layout |
|---|---|---|
| `app/not-found.tsx` | Path doesn't match any route | Standalone (no SiteFrame) |
| `app/(site)/not-found.tsx` | `notFound()` called in a site route | `(site)` layout — includes Rail + nav |
| `app/(site)/error.tsx` | Uncaught runtime error in a site route | `(site)` layout — includes Rail + nav |

## Design Language

Follows the existing maintenance page pattern (`app/maintenance/page.tsx`):

- Identity block: `site.name` (semibold sans) + `site.role` (mono, muted)
- Status pill: border pill, animated pulse dot, mono label
- Body copy: `text-sm text-muted-foreground`
- Links: mono, muted, hover to foreground

**Standalone 404** (`app/not-found.tsx`): full-screen centered, same shell as maintenance page. Dot color red (`text-destructive`), label `404 NOT FOUND`, message "The page you're looking for doesn't exist.", link back to `/`.

**Site-scoped 404** (`app/(site)/not-found.tsx`): renders inside the Rail layout. No identity block (Rail already shows it). Mono `404` large heading, description, back link.

**Site-scoped error** (`app/(site)/error.tsx`): client component (Next.js requirement). Receives `error` and `reset` props. Mono `500` heading, description, two actions: "Try again" (calls `reset()`) and back link to `/`.

## Metadata

All error pages set `robots: { index: false, follow: false }`.

- Standalone 404 title: `"Not Found — {site.name}"`
- Site-scoped 404 exports metadata with `title: "Not Found"`
- Site-scoped error: no static metadata export (client component limitation — handled by parent layout)

## Error Component Props

```ts
// app/(site)/error.tsx
"use client"
interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}
```

`error.digest` is logged to console in development for traceability. Not shown to users.

## No New Dependencies

All styling uses existing Tailwind classes and design tokens. No new packages required.
