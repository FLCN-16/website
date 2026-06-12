# Advanced Analytics Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add scroll depth, section visibility, nav click, and post reading milestone tracking through the existing `trackEvent` / GTM pipeline.

**Architecture:** Four new `GTMEvent` variants extend the typed union in `analytics.ts`. A `crossedThresholds` pure helper drives both scroll-depth and reading-milestone logic and is unit-tested in isolation. Two thin client components (`ScrollDepthTracker`, `SectionTracker`) drop into the layout/homepage and render nothing. All events respect the existing consent-mode gate inside GTM.

**Tech Stack:** Next.js 16 App Router, `@next/third-parties/google` (sendGTMEvent), Vitest, TypeScript

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `src/lib/analytics.ts` | Modify | Add 4 new GTMEvent variants |
| `src/lib/hooks/use-scroll-depth.ts` | Create | `crossedThresholds` helper + `useScrollDepth` hook |
| `src/lib/__tests__/use-scroll-depth.test.ts` | Create | Unit tests for `crossedThresholds` |
| `src/components/site/scroll-depth-tracker.tsx` | Create | Thin `'use client'` wrapper that mounts the hook |
| `src/components/site/section-tracker.tsx` | Create | IntersectionObserver client component |
| `src/components/site/site-frame.tsx` | Modify | Mount `<ScrollDepthTracker />` once |
| `src/components/site/nav-links.tsx` | Modify | Add `trackEvent` call on each link click |
| `src/components/writing/reading-progress.tsx` | Modify | Accept `slug?`, fire `post_read_milestone` events |
| `src/components/sections/writing-post.tsx` | Modify | Pass `slug` prop to `<ReadingProgress>` |
| `src/app/(site)/page.tsx` | Modify | Add `<SectionTracker>` |
| `src/components/sections/hero.tsx` | Modify | Add `id="hero"` to root `<section>` |
| `src/components/sections/journey.tsx` | Modify | Add `id="journey"` to root `<section>` |
| `src/components/sections/philosophy.tsx` | Modify | Add `id="philosophy"` to root `<section>` |
| `src/components/sections/selected-work.tsx` | Modify | Add `id="selected-work"` to root `<section>` |
| `src/components/sections/projects-grid.tsx` | Modify | Add `id="projects"` to root `<section>` |
| `src/components/sections/education.tsx` | Modify | Add `id="education"` to root `<section>` |
| `src/components/sections/certifications.tsx` | Modify | Add `id="certifications"` to root `<section>` |
| `src/components/sections/cta-banner.tsx` | Modify | Add `id="cta-banner"` to root `<section>` |

---

## Task 1: Add new GTMEvent types

**Files:**
- Modify: `src/lib/analytics.ts`

- [ ] **Step 1: Add 4 new event variants to the GTMEvent union**

Open `src/lib/analytics.ts`. The current `GTMEvent` type ends with:
```ts
  | { event: 'filter_apply'; filter_type: string; filter_value: string }
```

Append four new variants so the full type becomes:

```ts
export type GTMEvent =
  | { event: 'generate_lead'; form_source: 'contact' | 'talent_dialog'; inquiry_type?: string }
  | { event: 'form_error'; form_source: 'contact' | 'talent_dialog'; error_message: string }
  | { event: 'file_download'; file_name: string; location: 'rail' | 'mobile_menu' }
  | { event: 'cta_click'; cta_label: string; cta_location: string; destination: string }
  | { event: 'outbound_click'; link_url: string; link_domain: string; context: string }
  | { event: 'popup_impression'; form_source: 'talent_dialog' }
  | { event: 'popup_dismiss'; form_source: 'talent_dialog' }
  | { event: 'search'; search_term: string }
  | { event: 'filter_apply'; filter_type: string; filter_value: string }
  | { event: 'scroll_depth'; depth: 25 | 50 | 75 | 100; page: string }
  | { event: 'section_view'; section_id: string; page: string }
  | { event: 'nav_click'; label: string; destination: string }
  | { event: 'post_read_milestone'; slug: string; milestone: 25 | 50 | 75 | 100 }
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
pnpm tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/analytics.ts
git commit -m "feat(analytics): add scroll_depth, section_view, nav_click, post_read_milestone event types"
```

---

## Task 2: useScrollDepth hook + tests

**Files:**
- Create: `src/lib/hooks/use-scroll-depth.ts`
- Create: `src/lib/__tests__/use-scroll-depth.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/lib/__tests__/use-scroll-depth.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { crossedThresholds } from '@/lib/hooks/use-scroll-depth'

describe('crossedThresholds', () => {
  it('returns empty array when pct is below all thresholds', () => {
    expect(crossedThresholds(10, [25, 50, 75, 100], new Set())).toEqual([])
  })

  it('returns thresholds crossed for the first time', () => {
    expect(crossedThresholds(60, [25, 50, 75, 100], new Set())).toEqual([25, 50])
  })

  it('skips already-fired thresholds', () => {
    const fired = new Set([25, 50])
    expect(crossedThresholds(60, [25, 50, 75, 100], fired)).toEqual([])
  })

  it('fires 100 when pct reaches exactly 100', () => {
    expect(crossedThresholds(100, [25, 50, 75, 100], new Set())).toEqual([25, 50, 75, 100])
  })

  it('fires partial remaining thresholds when some already fired', () => {
    const fired = new Set([25])
    expect(crossedThresholds(55, [25, 50, 75, 100], fired)).toEqual([50])
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
pnpm test src/lib/__tests__/use-scroll-depth.test.ts
```

Expected: FAIL — `crossedThresholds` is not defined.

- [ ] **Step 3: Implement the hook**

Create `src/lib/hooks/use-scroll-depth.ts`:

```ts
'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { trackEvent } from '@/lib/analytics'

const DEFAULT_THRESHOLDS = [25, 50, 75, 100] as const

/** Returns thresholds in `thresholds` that `pct` has reached but are not in `fired`. */
export function crossedThresholds(
  pct: number,
  thresholds: number[],
  fired: Set<number>,
): number[] {
  return thresholds.filter((t) => pct >= t && !fired.has(t))
}

export function useScrollDepth(thresholds: number[] = [...DEFAULT_THRESHOLDS]): void {
  const pathname = usePathname()
  const thresholdsRef = useRef(thresholds)

  useEffect(() => {
    const fired = new Set<number>()
    const ts = thresholdsRef.current
    let rafId: number | null = null

    function onScroll() {
      if (rafId !== null) return
      rafId = requestAnimationFrame(() => {
        rafId = null
        const el = document.documentElement
        const total = el.scrollHeight - el.clientHeight
        if (total <= 0) return
        const pct = (el.scrollTop / total) * 100
        for (const depth of crossedThresholds(pct, ts, fired)) {
          fired.add(depth)
          trackEvent({ event: 'scroll_depth', depth: depth as 25 | 50 | 75 | 100, page: pathname })
        }
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (rafId !== null) cancelAnimationFrame(rafId)
    }
  }, [pathname]) // reset fired Set on every page navigation
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
pnpm test src/lib/__tests__/use-scroll-depth.test.ts
```

Expected: 5 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/hooks/use-scroll-depth.ts src/lib/__tests__/use-scroll-depth.test.ts
git commit -m "feat(analytics): add useScrollDepth hook with crossedThresholds helper"
```

---

## Task 3: ScrollDepthTracker component + SiteFrame wiring

**Files:**
- Create: `src/components/site/scroll-depth-tracker.tsx`
- Modify: `src/components/site/site-frame.tsx`

- [ ] **Step 1: Create the ScrollDepthTracker component**

Create `src/components/site/scroll-depth-tracker.tsx`:

```tsx
'use client'

import { useScrollDepth } from '@/lib/hooks/use-scroll-depth'

export function ScrollDepthTracker() {
  useScrollDepth()
  return null
}
```

- [ ] **Step 2: Mount it in SiteFrame**

Open `src/components/site/site-frame.tsx`. Current content:

```tsx
import { Rail } from "@/components/site/rail";
import { MobileHeader } from "@/components/site/mobile-header";
import { Footer } from "@/components/site/footer";

export function SiteFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Rail />
      <div className="flex flex-col flex-1 min-w-0 lg:ml-[240px]">
        <MobileHeader />
        <main className="flex-1 px-6 py-12 md:px-12 md:py-16">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  )
}
```

Replace with:

```tsx
import { Rail } from "@/components/site/rail";
import { MobileHeader } from "@/components/site/mobile-header";
import { Footer } from "@/components/site/footer";
import { ScrollDepthTracker } from "@/components/site/scroll-depth-tracker";

export function SiteFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <ScrollDepthTracker />
      <Rail />
      <div className="flex flex-col flex-1 min-w-0 lg:ml-[240px]">
        <MobileHeader />
        <main className="flex-1 px-6 py-12 md:px-12 md:py-16">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
pnpm tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/site/scroll-depth-tracker.tsx src/components/site/site-frame.tsx
git commit -m "feat(analytics): mount ScrollDepthTracker in SiteFrame"
```

---

## Task 4: SectionTracker component + homepage section IDs

**Files:**
- Create: `src/components/site/section-tracker.tsx`
- Modify: `src/app/(site)/page.tsx`
- Modify: `src/components/sections/hero.tsx`
- Modify: `src/components/sections/journey.tsx`
- Modify: `src/components/sections/philosophy.tsx`
- Modify: `src/components/sections/selected-work.tsx`
- Modify: `src/components/sections/projects-grid.tsx`
- Modify: `src/components/sections/education.tsx`
- Modify: `src/components/sections/certifications.tsx`
- Modify: `src/components/sections/cta-banner.tsx`

- [ ] **Step 1: Create SectionTracker component**

Create `src/components/site/section-tracker.tsx`:

```tsx
'use client'

import { useEffect } from 'react'
import { trackEvent } from '@/lib/analytics'

interface SectionTrackerProps {
  sections: string[]
  page?: string
}

export function SectionTracker({ sections, page = '/' }: SectionTrackerProps) {
  useEffect(() => {
    const remaining = new Set(sections)

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const id = entry.target.id
          if (!remaining.has(id)) continue
          remaining.delete(id)
          observer.unobserve(entry.target)
          trackEvent({ event: 'section_view', section_id: id, page })
        }
        if (remaining.size === 0) observer.disconnect()
      },
      { threshold: 0.3 },
    )

    for (const id of sections) {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    }

    return () => observer.disconnect()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return null
}
```

- [ ] **Step 2: Add id to each homepage section root element**

**`src/components/sections/hero.tsx` — line 60:**
Change `<section className="pt-6 pb-16 md:pt-8 md:pb-20 lg:pb-24">` to:
```tsx
<section id="hero" className="pt-6 pb-16 md:pt-8 md:pb-20 lg:pb-24">
```

**`src/components/sections/journey.tsx` — line 16:**
Change `<section className="py-16 md:py-20 lg:py-24">` to:
```tsx
<section id="journey" className="py-16 md:py-20 lg:py-24">
```

**`src/components/sections/philosophy.tsx` — line 11:**
Change `<section className="py-16 md:py-20 lg:py-24">` to:
```tsx
<section id="philosophy" className="py-16 md:py-20 lg:py-24">
```

**`src/components/sections/selected-work.tsx` — root `<section>` element:**
Add `id="selected-work"` to the existing `<section>` opening tag.

**`src/components/sections/projects-grid.tsx` — root `<section>` element (line 130):**
Add `id="projects"` to the existing `<section>` opening tag.

**`src/components/sections/education.tsx` — line 45:**
Change `<section className="py-16 md:py-20 lg:py-24">` to:
```tsx
<section id="education" className="py-16 md:py-20 lg:py-24">
```

**`src/components/sections/certifications.tsx` — line 55:**
Change `<section className="py-16 md:py-20 lg:py-24">` to:
```tsx
<section id="certifications" className="py-16 md:py-20 lg:py-24">
```

**`src/components/sections/cta-banner.tsx` — line 21:**
Change `<section className="py-20 md:py-24 lg:py-28 border-t border-border">` to:
```tsx
<section id="cta-banner" className="py-20 md:py-24 lg:py-28 border-t border-border">
```

- [ ] **Step 3: Add SectionTracker to the homepage**

Open `src/app/(site)/page.tsx`. Add the import at the top with the other imports:

```tsx
import { SectionTracker } from '@/components/site/section-tracker'
```

In the return JSX, add `<SectionTracker>` after `<JsonLd data={personSchema(identity)} />`:

```tsx
return (
  <>
    <JsonLd data={personSchema(identity)} />
    <SectionTracker
      sections={['hero', 'journey', 'philosophy', 'selected-work', 'projects', 'education', 'certifications', 'cta-banner']}
      page="/"
    />
    <Hero ... />
    ...
  </>
)
```

- [ ] **Step 4: Verify TypeScript compiles**

```bash
pnpm tsc --noEmit
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add \
  src/components/site/section-tracker.tsx \
  src/app/(site)/page.tsx \
  src/components/sections/hero.tsx \
  src/components/sections/journey.tsx \
  src/components/sections/philosophy.tsx \
  src/components/sections/selected-work.tsx \
  src/components/sections/projects-grid.tsx \
  src/components/sections/education.tsx \
  src/components/sections/certifications.tsx \
  src/components/sections/cta-banner.tsx
git commit -m "feat(analytics): add SectionTracker to homepage with section ids"
```

---

## Task 5: Nav click tracking

**Files:**
- Modify: `src/components/site/nav-links.tsx`

- [ ] **Step 1: Add trackEvent import**

Open `src/components/site/nav-links.tsx`. Add to the existing imports:

```tsx
import { trackEvent } from '@/lib/analytics'
```

- [ ] **Step 2: Add onClick tracking to each nav Link**

Find the `<Link>` inside `NAV_LINKS.map`. Currently:

```tsx
<Link
  key={href}
  href={href}
  ref={(el) => { linkRefs.current[i] = el }}
  onClick={onNavigate}
  ...
>
```

Replace `onClick={onNavigate}` with an inline handler:

```tsx
<Link
  key={href}
  href={href}
  ref={(el) => { linkRefs.current[i] = el }}
  onClick={() => {
    trackEvent({ event: 'nav_click', label, destination: href })
    onNavigate?.()
  }}
  ...
>
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
pnpm tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/site/nav-links.tsx
git commit -m "feat(analytics): track nav_click events in NavLinks"
```

---

## Task 6: Post reading milestones

**Files:**
- Modify: `src/components/writing/reading-progress.tsx`
- Modify: `src/components/sections/writing-post.tsx`

- [ ] **Step 1: Extend ReadingProgress to accept a slug and fire milestone events**

Open `src/components/writing/reading-progress.tsx`. Current full file:

```tsx
"use client"

import { useEffect, useRef } from "react"

export function ReadingProgress() {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let rafId: number | null = null

    function onScroll() {
      if (rafId !== null) return
      rafId = requestAnimationFrame(() => {
        rafId = null
        const el = document.documentElement
        const total = el.scrollHeight - el.clientHeight
        const pct = total > 0 ? (el.scrollTop / total) * 100 : 0
        if (barRef.current) {
          barRef.current.style.width = `${pct}%`
          barRef.current.setAttribute("aria-valuenow", String(Math.round(pct)))
        }
      })
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      if (rafId !== null) cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <div
      ref={barRef}
      role="progressbar"
      aria-valuenow={0}
      aria-valuemin={0}
      aria-valuemax={100}
      className="fixed top-0 left-0 z-50 h-[2px] bg-primary"
      style={{ width: "0%" }}
    />
  )
}
```

Replace entirely with:

```tsx
"use client"

import { useEffect, useRef } from "react"
import { trackEvent } from "@/lib/analytics"

const MILESTONES = [25, 50, 75, 100] as const

interface ReadingProgressProps {
  slug?: string
}

export function ReadingProgress({ slug }: ReadingProgressProps) {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let rafId: number | null = null
    const fired = new Set<number>()

    function onScroll() {
      if (rafId !== null) return
      rafId = requestAnimationFrame(() => {
        rafId = null
        const el = document.documentElement
        const total = el.scrollHeight - el.clientHeight
        const pct = total > 0 ? (el.scrollTop / total) * 100 : 0
        if (barRef.current) {
          barRef.current.style.width = `${pct}%`
          barRef.current.setAttribute("aria-valuenow", String(Math.round(pct)))
        }
        if (slug) {
          for (const milestone of MILESTONES) {
            if (pct >= milestone && !fired.has(milestone)) {
              fired.add(milestone)
              trackEvent({ event: 'post_read_milestone', slug, milestone })
            }
          }
        }
      })
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      if (rafId !== null) cancelAnimationFrame(rafId)
    }
  }, [slug])

  return (
    <div
      ref={barRef}
      role="progressbar"
      aria-valuenow={0}
      aria-valuemin={0}
      aria-valuemax={100}
      className="fixed top-0 left-0 z-50 h-[2px] bg-primary"
      style={{ width: "0%" }}
    />
  )
}
```

- [ ] **Step 2: Pass slug from WritingPost**

Open `src/components/sections/writing-post.tsx`. Find the line:

```tsx
<ReadingProgress />
```

Replace with:

```tsx
<ReadingProgress slug={slug} />
```

The `slug` variable is already destructured from `WritingPostProps` at the top of the function — no additional changes needed.

- [ ] **Step 3: Verify TypeScript compiles**

```bash
pnpm tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Run the full test suite**

```bash
pnpm test
```

Expected: all tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/components/writing/reading-progress.tsx src/components/sections/writing-post.tsx
git commit -m "feat(analytics): fire post_read_milestone events from ReadingProgress"
```

---

## Verification

After all tasks, open the site locally and enable GA4 DebugView (Chrome extension or `?gtm_debug=true`):

1. Scroll a page slowly → see `scroll_depth` events at 25/50/75/100
2. Scroll the homepage → see `section_view` events per section as each enters view
3. Click a nav link → see `nav_click` with label + destination
4. Open a blog post and scroll through → see `post_read_milestone` events at each threshold
