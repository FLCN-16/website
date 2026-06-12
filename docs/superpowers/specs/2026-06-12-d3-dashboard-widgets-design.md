# D3 Dashboard Widgets — Design Spec

**Date:** 2026-06-12  
**Branch:** develop

## Overview

Add four D3-powered chart widgets to the Payload CMS admin dashboard, and fix the broken Recent Inquiries widget. The dashboard currently has three plain widgets (ContentStats, RecentPosts, RecentSubmissions). This work adds visual data storytelling: publishing cadence, content pipeline health, inquiry type breakdown, and tag frequency.

---

## Architecture

### Server / Client split

Each D3 widget is a **two-file pair**:

| File | Role |
|------|------|
| `WidgetName.tsx` | Async React Server Component. Fetches data from Payload via `req.payload`. Shapes data into a plain serialisable array. Passes it as a prop to the chart component. |
| `WidgetNameChart.tsx` | `'use client'` component. Holds a `useRef<SVGSVGElement>`. Runs D3 imperatively in `useEffect` — select, clear, redraw on every data change. |

This matches the existing widget pattern (all current widgets are async server components). Payload renders the server component on request; D3 only runs in the browser.

### D3 approach

Option A: D3 directly in client components. `useEffect` + `useRef` — D3 selects the SVG ref and mutates the DOM directly. Full `d3` package installed.

### Theming

Colors are read at render time from Payload's CSS custom properties via:
```ts
getComputedStyle(document.documentElement).getPropertyValue('--theme-text')
```
This ensures charts respect both light and dark admin themes automatically.

### Dependencies

- `d3` — runtime
- `@types/d3` — dev

---

## Widgets

### 1. Posts Activity

- **Files**: `PostsActivity.tsx`, `PostsActivityChart.tsx`
- **Chart type**: Vertical bar chart, 12-month rolling window
- **Data**: Published posts from the last 12 months, grouped by `publishedAt` month. Server fetches all published posts in the window, reduces to `{ month: string, count: number }[]`.
- **Dashboard size**: `full`

### 2. Content Pipeline

- **Files**: `ContentPipeline.tsx`, `ContentPipelineChart.tsx`
- **Chart type**: Donut chart with total count in the centre
- **Data**: Published vs Draft counts across Posts, Work, and Projects — 6 `payload.count()` calls in parallel. Produces `{ label: string, count: number }[]`.
- **Dashboard size**: `small`

### 3. Inquiry Breakdown

- **Files**: `InquiryBreakdown.tsx`, `InquiryBreakdownChart.tsx`
- **Chart type**: Horizontal bar chart
- **Data**: All form-submissions grouped by `inquiry` field value (New Project / Consulting / Full-time / Other / unknown). No form slug filter.
- **Dashboard size**: `small`

### 4. Tag Frequency

- **Files**: `TagFrequency.tsx`, `TagFrequencyChart.tsx`
- **Chart type**: Horizontal bar chart, top 10 tags
- **Data**: All published posts, `tags` arrays flattened and counted. Produces `{ tag: string, count: number }[]` sorted descending, capped at 10.
- **Dashboard size**: `medium`

---

## Bug Fix — Recent Inquiries

**Problem**: `RecentSubmissions.tsx` queries the `forms` collection for `slug: 'contact'`. This lookup fails silently (returns no form), causing the `where` clause to fall back to no filter — but the subsequent query still returns nothing because the form-id filter path is broken.

**Fix**: Remove the form slug lookup entirely. Query `form-submissions` directly with no `where` filter, sorted by `-createdAt`, limit 5. This site has one form.

---

## Dashboard Layout

```
payload.config.ts  →  admin.dashboard.widgets + defaultLayout
```

New widget registrations (added alongside existing three):
- `posts-activity` — `PostsActivity` — minWidth `medium`
- `content-pipeline` — `ContentPipeline` — minWidth `small`
- `inquiry-breakdown` — `InquiryBreakdown` — minWidth `small`
- `tag-frequency` — `TagFrequency` — minWidth `medium`

Updated `defaultLayout`:
```ts
[
  { widgetSlug: 'posts-activity',    width: 'full'   },
  { widgetSlug: 'content-pipeline',  width: 'small'  },
  { widgetSlug: 'tag-frequency',     width: 'medium' },
  { widgetSlug: 'inquiry-breakdown', width: 'small'  },
  { widgetSlug: 'recent-posts',      width: 'medium' },
  { widgetSlug: 'recent-submissions',width: 'medium' },
  { widgetSlug: 'content-stats',     width: 'full'   },
  { widgetSlug: 'collections',       width: 'full'   },
]
```

Note: `collections` is a Payload built-in widget (existing in the current layout) — kept at the bottom.

---

## File Changeset

**Create:**
```
src/components/admin/widgets/PostsActivity.tsx
src/components/admin/widgets/PostsActivityChart.tsx
src/components/admin/widgets/ContentPipeline.tsx
src/components/admin/widgets/ContentPipelineChart.tsx
src/components/admin/widgets/InquiryBreakdown.tsx
src/components/admin/widgets/InquiryBreakdownChart.tsx
src/components/admin/widgets/TagFrequency.tsx
src/components/admin/widgets/TagFrequencyChart.tsx
```

**Modify:**
```
src/components/admin/widgets/RecentSubmissions.tsx  — remove form slug lookup
src/components/admin/widgets/widgets.css            — add .flcn-chart sizing class
src/payload.config.ts                               — register widgets + update defaultLayout
package.json / pnpm-lock.yaml                       — add d3 + @types/d3
```
