# Advanced Analytics — Design Spec

**Date:** 2026-06-12
**Approach:** Code-driven event tracking (Approach 2 — pure code, no GTM config changes)

## Context

GTM + GA4 are already live. The site already has:
- `trackEvent()` utility with a typed `GTMEvent` union (`src/lib/analytics.ts`)
- GDPR consent mode (`src/lib/consent.ts` + `CookieConsent` component)
- Events firing for: form submissions, outbound links, resume downloads, CTA clicks, search/filters, talent dialog

This spec extends that foundation with four new tracking categories.

## New Event Types

Four entries added to the `GTMEvent` union in `src/lib/analytics.ts`:

```ts
| { event: 'scroll_depth'; depth: 25 | 50 | 75 | 100; page: string }
| { event: 'section_view'; section_id: string; page: string }
| { event: 'nav_click'; label: string; destination: string }
| { event: 'post_read_milestone'; slug: string; milestone: 25 | 50 | 75 | 100 }
```

All flow through the existing `trackEvent()` — no new dispatch mechanism needed.

## New Hooks

### `useScrollDepth(thresholds: number[] = [25, 50, 75, 100])`

`src/lib/hooks/use-scroll-depth.ts`

- Passive scroll listener on `window`
- Tracks fired thresholds in a `Set` — each threshold fires exactly once per mount
- Computes `scrollTop / (scrollHeight - clientHeight) * 100` on each tick
- Reads `pathname` via `usePathname()` (Next.js App Router hook)
- Fires `scroll_depth` with `{ depth, page: pathname }` for each newly crossed threshold
- Cleans up listener on unmount

### `useSectionVisible(ref, sectionId, page)`

Not needed as a standalone hook — absorbed into `SectionTracker` (see below).

## New Components

### `ScrollDepthTracker` — `src/components/site/scroll-depth-tracker.tsx`

`'use client'` component. Calls `useScrollDepth()` with default thresholds. Renders nothing. Placed once in `SiteFrame` so it covers every page automatically.

### `SectionTracker` — `src/components/site/section-tracker.tsx`

`'use client'` component. Takes `sections: string[]` (list of element IDs). On mount, creates one `IntersectionObserver` (threshold: 0.3) over all listed elements via `document.getElementById`. When any section first becomes 30% visible, fires `section_view` with `{ section_id, page: '/' }` and stops observing that element. Renders nothing.

Placed in the homepage (`app/(site)/page.tsx`).

## Wiring

### Scroll depth

- Add `<ScrollDepthTracker />` to `src/components/site/site-frame.tsx`
- Covers all pages automatically

### Section visibility (homepage only)

- Add `id` to the root element of each homepage section:
  - `Hero` → `id="hero"`
  - `Journey` → `id="journey"`
  - `Philosophy` → `id="philosophy"`
  - `SelectedWork` → `id="selected-work"`
  - `ProjectsGrid` → `id="projects"`
  - `Education` → `id="education"`
  - `Certifications` → `id="certifications"`
  - `CtaBanner` → `id="cta-banner"`
- Add `<SectionTracker sections={['hero','journey','philosophy','selected-work','projects','education','certifications','cta-banner']} />` to `app/(site)/page.tsx`

### Nav clicks

- In `src/components/site/nav-links.tsx`, add `onClick` to each `<Link>`:
  ```ts
  onClick={() => {
    trackEvent({ event: 'nav_click', label, destination: href })
    onNavigate?.()
  }}
  ```
- Covers both desktop rail and mobile header (both use `<NavLinks>`)

### Post reading milestones

- Extend `src/components/writing/reading-progress.tsx`:
  - Accept optional `slug?: string` prop
  - Add a `Set<number>` of fired milestones
  - In the existing RAF loop, check pct against [25, 50, 75, 100] and fire `post_read_milestone` for each newly crossed value
- Pass `slug` from the post page (`app/(site)/writing/[slug]/page.tsx`) to `<ReadingProgress>`

## Files Touched

| File | Change |
|------|--------|
| `src/lib/analytics.ts` | 4 new event types in `GTMEvent` union |
| `src/lib/hooks/use-scroll-depth.ts` | New hook |
| `src/components/site/scroll-depth-tracker.tsx` | New client component |
| `src/components/site/section-tracker.tsx` | New client component |
| `src/components/site/site-frame.tsx` | Add `<ScrollDepthTracker />` |
| `src/components/site/nav-links.tsx` | Add `onClick` tracking to each link |
| `src/components/writing/reading-progress.tsx` | Accept `slug`, fire milestone events |
| `src/app/(site)/writing/[slug]/page.tsx` | Pass `slug` to `<ReadingProgress>` |
| `src/app/(site)/page.tsx` | Add `<SectionTracker>`, add `id` to sections |
| 8 homepage section components | Add `id` to root element |

## Out of Scope

- GTM Enhanced Measurement configuration (already live, no changes needed)
- New consent UI (existing cookie banner covers all new events)
- Tests (event hooks are thin wrappers over browser APIs; tested by observing GA4 DebugView)
