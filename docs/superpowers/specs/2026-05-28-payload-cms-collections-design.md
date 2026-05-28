# Payload CMS Collections — Full Migration Design

**Date:** 2026-05-28
**Status:** Approved

---

## Overview

Migrate all dynamic content from static TypeScript files in `content/` to Payload CMS collections backed by MongoDB Atlas. Add a new `projects` collection for CV-style selected projects. Expose projects on a new `/projects` page and on the homepage.

---

## Collections

### `work` (migrated from `content/work.ts`)

Detailed case studies — problem/approach/impact format. Three existing entries: Design System Foundation, Micro-Frontend Platform, Real-Time Analytics Dashboard.

**Fields:**
- `title` — text, required, useAsTitle
- `slug` — text, required, unique
- `category` — text (e.g. "Design Systems", "Platform Engineering")
- `ord` — text (display order label: "01", "02", "03")
- `tags` — array of `{ tag: text }`
- `description` — textarea
- `cover` — upload, relation to `media`
- `status` — select (draft | published), sidebar, default: draft
- `briefing` — group:
  - `problem` — textarea
  - `approach` — array of `{ step: textarea }`
  - `impact` — textarea
  - `quote` — text
- `stack` — array of `{ name: text, role: text }`

**Access:** public read for published; authenticated for draft.

---

### `projects` (new — CV selected projects)

Lighter entries for side projects, client work, open-source, and mobile apps. Controls homepage visibility via `featured` flag.

**Fields:**
- `title` — text, required, useAsTitle
- `subtitle` — text (short tagline)
- `description` — textarea
- `category` — text (e.g. "Chrome Extension", "Agentic AI", "Mobile App", "EdTech")
- `tags` — array of `{ tag: text }`
- `liveUrl` — text (optional — Chrome Web Store, Play Store, etc.)
- `repoUrl` — text (optional — GitHub PR, repo)
- `startDate` — text (e.g. "February 2025")
- `endDate` — text (e.g. "October 2025" or leave blank for ongoing)
- `highlights` — array of `{ point: textarea }` (bullet points from CV)
- `cover` — upload, relation to `media`
- `status` — select (draft | published), sidebar, default: draft
- `featured` — checkbox, sidebar (controls homepage visibility)

**Access:** public read for published; authenticated for draft/all.

**Initial entries from CV:**
1. Study.IQ — EdTech Platform (featured)
2. Kanban Tab — Chrome Extension (featured)
3. GitHub PR Reviewer — Agentic AI System (featured)
4. Guardian Services — Security Services Platform
5. Money Hive — Flutter Finance App
6. Swallow Organics — Flutter Shopify Storefront

---

### `timeline` (migrated from `content/journey.ts`)

Work history entries displayed in chronological order on the homepage.

**Fields:**
- `company` — text, required, useAsTitle
- `role` — text, required
- `start` — text, required (year as string: "2022")
- `end` — text (year or blank for current role)
- `summary` — textarea
- `tags` — array of `{ tag: text }`
- `order` — number, sidebar (lower = displayed first; current role = 1)

**Access:** public read always.

---

### `submissions` (already exists — no changes)

Contact form submissions saved by `actions/contact.ts`. Wired and working. No schema changes needed.

---

## Pages

### `app/(site)/work/page.tsx`
Fetch published work entries from Payload, sorted by `ord`. Falls back to empty array on Payload error (same pattern as writing page).

### `app/(site)/work/[slug]/page.tsx`
Fetch single work entry by slug. Fetch all published slugs for `generateStaticParams`. Pass `prevProject` / `nextProject` as props to `ProjectBriefing` (removes direct static import from component).

### `app/(site)/page.tsx` (homepage)
Becomes async server component. Fetches:
- `timeline` — all entries, sorted by `order` asc
- `work` — published, sorted by `ord`, limit 3 (for SelectedWork section)
- `projects` — published where `featured: true`, for new homepage snippet

### `app/projects/page.tsx` (new)
New route. Fetches all published projects from Payload. Renders new `ProjectsGrid` section component.

### `app/llms.txt/route.ts`
Fetch published work entries from Payload (currently reads static `projects` array).

---

## Components

### `components/sections/project-briefing.tsx`
**Breaking change:** Remove direct import of `projects` array. Accept `prevProject` and `nextProject` as nullable props (same `Project` shape). The detail page resolves these before passing down.

### `components/sections/selected-work.tsx`
Update `Project` type import — accept the Payload-mapped shape (tags as `string[]`, briefing/stack fields). No visual changes.

### `components/sections/journey.tsx`
Update `JourneyItem` type import to match Payload-mapped shape. No visual changes.

### `components/sections/projects-grid.tsx` (new)
New section component. Renders a grid of project cards showing: title, subtitle, category, tags, date range, live/repo links, and highlights preview. Used on `/projects` page and homepage (featured subset).

---

## Type Mapping

Payload returns tags as `Array<{ id: string; tag: string }>`. All page-level fetch functions map these to `string[]` before passing to components, keeping component props clean.

```ts
tags: doc.tags?.map((t) => t.tag) ?? []
highlights: doc.highlights?.map((h) => h.point) ?? []
approach: doc.briefing?.approach?.map((a) => a.step) ?? []
```

---

## Error Handling

All Payload fetch calls wrapped in try/catch at the page level. On failure, pages render with empty arrays — same pattern as `writing/page.tsx`. No static fallback data; the empty state is the fallback.

---

## Out of Scope

- `content/stack.ts` and `content/philosophy.ts` — remain static files (not migrated)
- Seed script — data entered manually via Payload admin UI
- Email notifications for submissions — separate concern, needs `RESEND_API_KEY` env var
