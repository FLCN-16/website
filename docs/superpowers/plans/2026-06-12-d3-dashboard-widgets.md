# D3 Dashboard Widgets Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add four D3-powered chart widgets to the Payload CMS admin dashboard and fix the broken Recent Inquiries widget.

**Architecture:** Each D3 widget is a two-file pair: an async server component that fetches data from Payload and shapes it into a plain array, and a `'use client'` chart component that renders D3 into an SVG via `useEffect`/`useRef`. Pure data-transformation functions are exported from server components so they can be unit-tested with Vitest independently of Payload.

**Tech Stack:** Payload 3.x, Next.js 16, D3 v7, Vitest, TypeScript

---

## File Map

**Create:**
- `src/components/admin/widgets/PostsActivity.tsx` — server component; fetches published posts from last 12 months; exports `buildActivityData` pure fn
- `src/components/admin/widgets/PostsActivityChart.tsx` — `'use client'`; vertical bar chart via D3
- `src/components/admin/widgets/ContentPipeline.tsx` — server component; 6 parallel `payload.count()` calls for published/draft across Posts/Work/Projects
- `src/components/admin/widgets/ContentPipelineChart.tsx` — `'use client'`; donut chart via D3
- `src/components/admin/widgets/InquiryBreakdown.tsx` — server component; groups form-submissions by inquiry type; exports `groupByInquiry` pure fn
- `src/components/admin/widgets/InquiryBreakdownChart.tsx` — `'use client'`; horizontal bar chart via D3
- `src/components/admin/widgets/TagFrequency.tsx` — server component; counts tags across published posts; exports `countTagFrequency` pure fn
- `src/components/admin/widgets/TagFrequencyChart.tsx` — `'use client'`; horizontal bar chart via D3
- `src/components/admin/widgets/__tests__/widget-data.test.ts` — Vitest tests for the three pure data functions

**Modify:**
- `src/components/admin/widgets/RecentSubmissions.tsx` — remove form-slug lookup; query form-submissions directly
- `src/components/admin/widgets/widgets.css` — add `.flcn-chart`, `.flcn-pipeline__legend` styles
- `src/payload.config.ts` — register 4 new widgets; update `defaultLayout`

---

## Task 1: Install D3

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install runtime and types**

```bash
pnpm add d3
pnpm add -D @types/d3
```

- [ ] **Step 2: Verify TypeScript resolves D3 types**

```bash
npx tsc --noEmit 2>&1 | grep -i d3 || echo "d3 types OK"
```

Expected: no d3-related errors (project may have other pre-existing errors — that's fine).

- [ ] **Step 3: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "chore: add d3 and @types/d3"
```

---

## Task 2: Fix RecentSubmissions

**Files:**
- Modify: `src/components/admin/widgets/RecentSubmissions.tsx`

- [ ] **Step 1: Remove the form-slug lookup**

Open `src/components/admin/widgets/RecentSubmissions.tsx`. Replace the entire body of `RecentSubmissions` with:

```tsx
export default async function RecentSubmissions({ req }: Props) {
  const { docs } = await req.payload.find({
    collection: 'form-submissions',
    limit: 5,
    sort: '-createdAt',
    depth: 0,
  })

  const submissions = docs as SubmissionRow[]

  return (
    <div className="flcn-widget">
      <div className="flcn-widget__header">
        <h3 className="flcn-widget__title">Recent Inquiries</h3>
        <Link className="flcn-widget__action" href="/admin/collections/form-submissions">
          View all
        </Link>
      </div>
      {submissions.length === 0 ? (
        <p className="flcn-widget__empty">No inquiries yet.</p>
      ) : (
        <ul className="flcn-list">
          {submissions.map((submission) => {
            const name = getField(submission.submissionData, 'name')
            const email = getField(submission.submissionData, 'email')
            const inquiry = getField(submission.submissionData, 'inquiry')
            return (
              <li key={submission.id} className="flcn-list__item">
                <Link className="flcn-list__link" href={`/admin/collections/form-submissions/${submission.id}`}>
                  <span className="flcn-list__main">
                    <span className="flcn-list__title">
                      {name ?? '—'} · {email ?? '—'}
                    </span>
                    <span className="flcn-list__meta">{formatDate(submission.createdAt)}</span>
                  </span>
                  {inquiry && (
                    <span className="flcn-pill flcn-pill--neutral">
                      {INQUIRY_LABELS[inquiry] ?? inquiry}
                    </span>
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
```

(Keep all existing imports, type definitions, `INQUIRY_LABELS`, `getField`, and `formatDate` — only the function body changes.)

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit 2>&1 | grep "RecentSubmissions" || echo "OK"
```

Expected: no errors referencing `RecentSubmissions.tsx`.

- [ ] **Step 3: Commit**

```bash
git add src/components/admin/widgets/RecentSubmissions.tsx
git commit -m "fix(admin): remove stale form-slug lookup in RecentSubmissions"
```

---

## Task 3: Add chart CSS

**Files:**
- Modify: `src/components/admin/widgets/widgets.css`

- [ ] **Step 1: Append chart styles**

Add to the end of `src/components/admin/widgets/widgets.css`:

```css
/* D3 chart container */
.flcn-chart {
  display: block;
  overflow: visible;
}

/* Content Pipeline legend */
.flcn-pipeline__legend {
  display: flex;
  gap: calc(var(--base) * 0.8);
  flex-wrap: wrap;
  margin-top: calc(var(--base) * 0.2);
}

.flcn-pipeline__legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.78rem;
  color: var(--theme-elevation-600);
}

.flcn-pipeline__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.flcn-pipeline__dot--published { background: #22c55e; }
.flcn-pipeline__dot--draft     { background: #f59e0b; }
```

- [ ] **Step 2: Commit**

```bash
git add src/components/admin/widgets/widgets.css
git commit -m "style(admin): add D3 chart base styles"
```

---

## Task 4: Posts Activity widget

**Files:**
- Create: `src/components/admin/widgets/PostsActivity.tsx`
- Create: `src/components/admin/widgets/PostsActivityChart.tsx`
- Create: `src/components/admin/widgets/__tests__/widget-data.test.ts` (partial — adds `buildActivityData` tests)

- [ ] **Step 1: Write failing test for `buildActivityData`**

Create `src/components/admin/widgets/__tests__/widget-data.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { buildActivityData } from '../PostsActivity'

describe('buildActivityData', () => {
  it('returns 12 slots', () => {
    const result = buildActivityData([], new Date('2026-06-12'))
    expect(result).toHaveLength(12)
  })

  it('first slot is 12 months ago, last slot is current month', () => {
    const now = new Date('2026-06-12')
    const result = buildActivityData([], now)
    expect(result[0].month).toBe('2025-07')
    expect(result[11].month).toBe('2026-06')
  })

  it('counts posts in correct month slot', () => {
    const docs = [
      { publishedAt: '2026-06-01T00:00:00.000Z' },
      { publishedAt: '2026-06-15T00:00:00.000Z' },
      { publishedAt: '2026-04-10T00:00:00.000Z' },
    ]
    const result = buildActivityData(docs, new Date('2026-06-12'))
    const june = result.find(m => m.month === '2026-06')!
    const april = result.find(m => m.month === '2026-04')!
    expect(june.count).toBe(2)
    expect(april.count).toBe(1)
  })

  it('ignores posts with null publishedAt', () => {
    const docs = [{ publishedAt: null }, { publishedAt: undefined }]
    const result = buildActivityData(docs as never, new Date('2026-06-12'))
    expect(result.every(m => m.count === 0)).toBe(true)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
pnpm test -- widget-data
```

Expected: FAIL — `buildActivityData` is not defined.

- [ ] **Step 3: Create `PostsActivity.tsx`**

```tsx
import React from 'react'
import type { PayloadRequest } from 'payload'
import { PostsActivityChart } from './PostsActivityChart'
import './widgets.css'

export type MonthData = { month: string; count: number }

type Props = { req: PayloadRequest }

export function buildActivityData(
  docs: Array<{ publishedAt?: string | null }>,
  now: Date,
): MonthData[] {
  const slots: MonthData[] = Array.from({ length: 12 }, (_, i) => {
    const d = new Date(now)
    d.setMonth(d.getMonth() - (11 - i))
    return {
      month: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
      count: 0,
    }
  })

  for (const doc of docs) {
    if (!doc.publishedAt) continue
    const d = new Date(doc.publishedAt)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    const slot = slots.find(m => m.month === key)
    if (slot) slot.count++
  }

  return slots
}

export default async function PostsActivity({ req }: Props) {
  const { payload } = req

  const twelveMonthsAgo = new Date()
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11)
  twelveMonthsAgo.setDate(1)
  twelveMonthsAgo.setHours(0, 0, 0, 0)

  const { docs } = await payload.find({
    collection: 'posts',
    where: {
      and: [
        { status: { equals: 'published' } },
        { publishedAt: { greater_than_equal: twelveMonthsAgo.toISOString() } },
      ],
    },
    limit: 1000,
    depth: 0,
    select: { publishedAt: true },
  })

  const data = buildActivityData(docs as Array<{ publishedAt?: string | null }>, new Date())

  return (
    <div className="flcn-widget">
      <div className="flcn-widget__header">
        <h3 className="flcn-widget__title">Publishing Activity</h3>
        <span className="flcn-widget__action">Last 12 months</span>
      </div>
      <PostsActivityChart data={data} />
    </div>
  )
}
```

- [ ] **Step 4: Create `PostsActivityChart.tsx`**

```tsx
'use client'
import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import type { MonthData } from './PostsActivity'

export function PostsActivityChart({ data }: { data: MonthData[] }) {
  const ref = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const svg = d3.select(ref.current)
    svg.selectAll('*').remove()

    const cs = getComputedStyle(document.documentElement)
    const textColor = cs.getPropertyValue('--theme-elevation-600').trim() || '#888'
    const barColor = cs.getPropertyValue('--theme-elevation-400').trim() || '#999'
    const gridColor = cs.getPropertyValue('--theme-elevation-100').trim() || '#eee'

    const margin = { top: 10, right: 12, bottom: 36, left: 28 }
    const W = Math.max(ref.current.clientWidth, 320) - margin.left - margin.right
    const H = 180 - margin.top - margin.bottom

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`)

    const x = d3.scaleBand().domain(data.map(d => d.month)).range([0, W]).padding(0.3)
    const y = d3.scaleLinear().domain([0, d3.max(data, d => d.count) ?? 1]).nice().range([H, 0])

    // Dashed grid lines
    g.append('g')
      .call(d3.axisLeft(y).tickSize(-W).tickFormat(() => '').ticks(4))
      .call(g => g.select('.domain').remove())
      .call(g =>
        g
          .selectAll('.tick line')
          .attr('stroke', gridColor)
          .attr('stroke-dasharray', '2,3'),
      )

    // Bars
    g.selectAll('.bar')
      .data(data)
      .join('rect')
      .attr('x', d => x(d.month)!)
      .attr('y', d => y(d.count))
      .attr('width', x.bandwidth())
      .attr('height', d => H - y(d.count))
      .attr('fill', barColor)
      .attr('rx', 2)

    // X axis — abbreviated month name
    g.append('g')
      .attr('transform', `translate(0,${H})`)
      .call(
        d3.axisBottom(x).tickFormat(raw => {
          const [yr, mo] = (raw as string).split('-')
          return new Date(+yr, +mo - 1).toLocaleString('default', { month: 'short' })
        }),
      )
      .call(g => g.select('.domain').remove())
      .call(g => g.selectAll('.tick line').remove())
      .call(g => g.selectAll('text').attr('fill', textColor).style('font-size', '11px'))

    // Y axis
    g.append('g')
      .call(d3.axisLeft(y).ticks(4).tickFormat(d3.format('d')))
      .call(g => g.select('.domain').remove())
      .call(g => g.selectAll('.tick line').remove())
      .call(g => g.selectAll('text').attr('fill', textColor).style('font-size', '11px'))
  }, [data])

  return <svg ref={ref} className="flcn-chart" style={{ width: '100%', height: 180 }} />
}
```

- [ ] **Step 5: Run tests**

```bash
pnpm test -- widget-data
```

Expected: all 4 `buildActivityData` tests PASS.

- [ ] **Step 6: Type-check**

```bash
npx tsc --noEmit 2>&1 | grep -E "PostsActivity|PostsActivityChart" || echo "OK"
```

Expected: no errors from these two files.

- [ ] **Step 7: Commit**

```bash
git add src/components/admin/widgets/PostsActivity.tsx \
        src/components/admin/widgets/PostsActivityChart.tsx \
        src/components/admin/widgets/__tests__/widget-data.test.ts
git commit -m "feat(admin): add PostsActivity D3 bar chart widget"
```

---

## Task 5: Content Pipeline widget

**Files:**
- Create: `src/components/admin/widgets/ContentPipeline.tsx`
- Create: `src/components/admin/widgets/ContentPipelineChart.tsx`

(No pure data function to test here — the server component is just 6 parallel count calls with trivial arithmetic.)

- [ ] **Step 1: Create `ContentPipeline.tsx`**

```tsx
import React from 'react'
import type { PayloadRequest } from 'payload'
import { ContentPipelineChart } from './ContentPipelineChart'
import './widgets.css'

export type PipelineItem = { label: string; count: number }

type Props = { req: PayloadRequest }

export default async function ContentPipeline({ req }: Props) {
  const { payload } = req

  const [postsPublished, postsDraft, workPublished, workDraft, projectsPublished, projectsDraft] =
    await Promise.all([
      payload.count({ collection: 'posts', where: { status: { equals: 'published' } } }),
      payload.count({ collection: 'posts', where: { status: { equals: 'draft' } } }),
      payload.count({ collection: 'work', where: { status: { equals: 'published' } } }),
      payload.count({ collection: 'work', where: { status: { equals: 'draft' } } }),
      payload.count({ collection: 'projects', where: { status: { equals: 'published' } } }),
      payload.count({ collection: 'projects', where: { status: { equals: 'draft' } } }),
    ])

  const data: PipelineItem[] = [
    {
      label: 'Published',
      count:
        postsPublished.totalDocs + workPublished.totalDocs + projectsPublished.totalDocs,
    },
    {
      label: 'Draft',
      count: postsDraft.totalDocs + workDraft.totalDocs + projectsDraft.totalDocs,
    },
  ]

  return (
    <div className="flcn-widget">
      <div className="flcn-widget__header">
        <h3 className="flcn-widget__title">Content Pipeline</h3>
      </div>
      <ContentPipelineChart data={data} />
      <div className="flcn-pipeline__legend">
        {data.map(item => (
          <div key={item.label} className="flcn-pipeline__legend-item">
            <span
              className={`flcn-pipeline__dot flcn-pipeline__dot--${item.label.toLowerCase()}`}
            />
            <span>
              {item.label}: {item.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create `ContentPipelineChart.tsx`**

```tsx
'use client'
import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import type { PipelineItem } from './ContentPipeline'

const SLICE_COLORS = ['#22c55e', '#f59e0b']

export function ContentPipelineChart({ data }: { data: PipelineItem[] }) {
  const ref = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const svg = d3.select(ref.current)
    svg.selectAll('*').remove()

    const W = Math.max(ref.current.clientWidth, 120)
    const H = 150
    const radius = Math.min(W, H) / 2 - 8
    const innerRadius = radius * 0.62
    const total = data.reduce((s, d) => s + d.count, 0)

    const g = svg.append('g').attr('transform', `translate(${W / 2},${H / 2})`)

    const pie = d3.pie<PipelineItem>().value(d => d.count || 0.001).sort(null)
    const arc = d3.arc<d3.PieArcDatum<PipelineItem>>()
      .innerRadius(innerRadius)
      .outerRadius(radius)

    g.selectAll('.arc')
      .data(pie(data))
      .join('path')
      .attr('d', arc)
      .attr('fill', (_, i) => SLICE_COLORS[i] ?? '#ccc')

    g.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '-0.15em')
      .style('font-size', '1.5rem')
      .style('font-weight', '700')
      .style('fill', 'var(--theme-text)')
      .text(total)

    g.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '1.1em')
      .style('font-size', '0.72rem')
      .style('fill', 'var(--theme-elevation-500)')
      .text('items')
  }, [data])

  return <svg ref={ref} className="flcn-chart" style={{ width: '100%', height: 150 }} />
}
```

- [ ] **Step 3: Type-check**

```bash
npx tsc --noEmit 2>&1 | grep -E "ContentPipeline" || echo "OK"
```

- [ ] **Step 4: Commit**

```bash
git add src/components/admin/widgets/ContentPipeline.tsx \
        src/components/admin/widgets/ContentPipelineChart.tsx
git commit -m "feat(admin): add ContentPipeline D3 donut chart widget"
```

---

## Task 6: Inquiry Breakdown widget

**Files:**
- Create: `src/components/admin/widgets/InquiryBreakdown.tsx`
- Create: `src/components/admin/widgets/InquiryBreakdownChart.tsx`
- Modify: `src/components/admin/widgets/__tests__/widget-data.test.ts`

- [ ] **Step 1: Write failing tests for `groupByInquiry`**

Append to `src/components/admin/widgets/__tests__/widget-data.test.ts`:

```ts
import { groupByInquiry } from '../InquiryBreakdown'

describe('groupByInquiry', () => {
  it('returns empty array when no submissions', () => {
    expect(groupByInquiry([])).toEqual([])
  })

  it('maps known inquiry keys to display labels', () => {
    const docs = [
      { submissionData: [{ field: 'inquiry', value: 'project' }] },
      { submissionData: [{ field: 'inquiry', value: 'project' }] },
      { submissionData: [{ field: 'inquiry', value: 'consulting' }] },
    ]
    const result = groupByInquiry(docs)
    const project = result.find(r => r.type === 'New Project')
    const consult = result.find(r => r.type === 'Consulting')
    expect(project?.count).toBe(2)
    expect(consult?.count).toBe(1)
  })

  it('sorts by count descending', () => {
    const docs = [
      { submissionData: [{ field: 'inquiry', value: 'other' }] },
      { submissionData: [{ field: 'inquiry', value: 'project' }] },
      { submissionData: [{ field: 'inquiry', value: 'project' }] },
      { submissionData: [{ field: 'inquiry', value: 'project' }] },
    ]
    const result = groupByInquiry(docs)
    expect(result[0].type).toBe('New Project')
  })

  it('falls back to raw key for unknown inquiry values', () => {
    const docs = [{ submissionData: [{ field: 'inquiry', value: 'sponsorship' }] }]
    const result = groupByInquiry(docs)
    expect(result[0].type).toBe('sponsorship')
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
pnpm test -- widget-data
```

Expected: FAIL — `groupByInquiry` is not defined.

- [ ] **Step 3: Create `InquiryBreakdown.tsx`**

```tsx
import React from 'react'
import type { PayloadRequest } from 'payload'
import { InquiryBreakdownChart } from './InquiryBreakdownChart'
import './widgets.css'

export type InquiryData = { type: string; count: number }

type SubmissionField = { field?: string | null; value?: string | null }

const INQUIRY_LABELS: Record<string, string> = {
  project: 'New Project',
  consulting: 'Consulting',
  fulltime: 'Full-time',
  other: 'Other',
}

export function groupByInquiry(
  docs: Array<{ submissionData?: SubmissionField[] | null }>,
): InquiryData[] {
  const counts: Record<string, number> = {}

  for (const doc of docs) {
    const val = doc.submissionData?.find(f => f.field === 'inquiry')?.value ?? 'other'
    counts[val] = (counts[val] ?? 0) + 1
  }

  return Object.entries(counts)
    .map(([key, count]) => ({ type: INQUIRY_LABELS[key] ?? key, count }))
    .sort((a, b) => b.count - a.count)
}

type Props = { req: PayloadRequest }

export default async function InquiryBreakdown({ req }: Props) {
  const { payload } = req

  const { docs } = await payload.find({
    collection: 'form-submissions',
    limit: 500,
    depth: 0,
  })

  const data = groupByInquiry(docs as Array<{ submissionData?: SubmissionField[] | null }>)

  return (
    <div className="flcn-widget">
      <div className="flcn-widget__header">
        <h3 className="flcn-widget__title">Inquiry Breakdown</h3>
      </div>
      {data.length === 0 ? (
        <p className="flcn-widget__empty">No inquiries yet.</p>
      ) : (
        <InquiryBreakdownChart data={data} />
      )}
    </div>
  )
}
```

- [ ] **Step 4: Create `InquiryBreakdownChart.tsx`**

```tsx
'use client'
import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import type { InquiryData } from './InquiryBreakdown'

export function InquiryBreakdownChart({ data }: { data: InquiryData[] }) {
  const ref = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const svg = d3.select(ref.current)
    svg.selectAll('*').remove()

    const cs = getComputedStyle(document.documentElement)
    const textColor = cs.getPropertyValue('--theme-elevation-600').trim() || '#888'
    const barColor = cs.getPropertyValue('--theme-elevation-400').trim() || '#999'

    const labelWidth = 96
    const margin = { top: 4, right: 36, bottom: 4, left: labelWidth }
    const W = Math.max(ref.current.clientWidth, 180) - margin.left - margin.right
    const rowH = 28
    const H = data.length * rowH

    svg.attr('height', H + margin.top + margin.bottom)

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`)

    const y = d3.scaleBand().domain(data.map(d => d.type)).range([0, H]).padding(0.25)
    const x = d3.scaleLinear().domain([0, d3.max(data, d => d.count) ?? 1]).nice().range([0, W])

    g.selectAll('.label')
      .data(data)
      .join('text')
      .attr('x', -8)
      .attr('y', d => (y(d.type) ?? 0) + y.bandwidth() / 2)
      .attr('text-anchor', 'end')
      .attr('dominant-baseline', 'middle')
      .style('font-size', '12px')
      .style('fill', textColor)
      .text(d => d.type)

    g.selectAll('.bar')
      .data(data)
      .join('rect')
      .attr('y', d => y(d.type) ?? 0)
      .attr('x', 0)
      .attr('height', y.bandwidth())
      .attr('width', d => x(d.count))
      .attr('fill', barColor)
      .attr('rx', 2)

    g.selectAll('.val')
      .data(data)
      .join('text')
      .attr('x', d => x(d.count) + 5)
      .attr('y', d => (y(d.type) ?? 0) + y.bandwidth() / 2)
      .attr('dominant-baseline', 'middle')
      .style('font-size', '12px')
      .style('fill', textColor)
      .text(d => d.count)
  }, [data])

  return <svg ref={ref} className="flcn-chart" style={{ width: '100%', minHeight: 32 }} />
}
```

- [ ] **Step 5: Run tests**

```bash
pnpm test -- widget-data
```

Expected: all `buildActivityData` tests (4) and all `groupByInquiry` tests (4) PASS.

- [ ] **Step 6: Type-check**

```bash
npx tsc --noEmit 2>&1 | grep -E "InquiryBreakdown" || echo "OK"
```

- [ ] **Step 7: Commit**

```bash
git add src/components/admin/widgets/InquiryBreakdown.tsx \
        src/components/admin/widgets/InquiryBreakdownChart.tsx \
        src/components/admin/widgets/__tests__/widget-data.test.ts
git commit -m "feat(admin): add InquiryBreakdown D3 horizontal bar chart widget"
```

---

## Task 7: Tag Frequency widget

**Files:**
- Create: `src/components/admin/widgets/TagFrequency.tsx`
- Create: `src/components/admin/widgets/TagFrequencyChart.tsx`
- Modify: `src/components/admin/widgets/__tests__/widget-data.test.ts`

- [ ] **Step 1: Write failing tests for `countTagFrequency`**

Append to `src/components/admin/widgets/__tests__/widget-data.test.ts`:

```ts
import { countTagFrequency } from '../TagFrequency'

describe('countTagFrequency', () => {
  it('returns empty array for no posts', () => {
    expect(countTagFrequency([])).toEqual([])
  })

  it('counts tags correctly', () => {
    const docs = [
      { tags: ['typescript', 'react'] },
      { tags: ['typescript', 'nextjs'] },
      { tags: ['react'] },
    ]
    const result = countTagFrequency(docs)
    expect(result.find(t => t.tag === 'typescript')?.count).toBe(2)
    expect(result.find(t => t.tag === 'react')?.count).toBe(2)
    expect(result.find(t => t.tag === 'nextjs')?.count).toBe(1)
  })

  it('sorts by count descending', () => {
    const result = countTagFrequency([{ tags: ['a'] }, { tags: ['b', 'b'] }])
    expect(result[0].tag).toBe('b')
  })

  it('caps at 10 results', () => {
    const docs = Array.from({ length: 15 }, (_, i) => ({ tags: [`tag-${i}`] }))
    expect(countTagFrequency(docs)).toHaveLength(10)
  })

  it('skips empty tag strings', () => {
    const docs = [{ tags: ['', 'valid', ''] }]
    const result = countTagFrequency(docs)
    expect(result).toHaveLength(1)
    expect(result[0].tag).toBe('valid')
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
pnpm test -- widget-data
```

Expected: FAIL — `countTagFrequency` is not defined.

- [ ] **Step 3: Create `TagFrequency.tsx`**

```tsx
import React from 'react'
import type { PayloadRequest } from 'payload'
import { TagFrequencyChart } from './TagFrequencyChart'
import './widgets.css'

export type TagData = { tag: string; count: number }

export function countTagFrequency(docs: Array<{ tags?: string[] | null }>): TagData[] {
  const counts: Record<string, number> = {}

  for (const doc of docs) {
    for (const tag of doc.tags ?? []) {
      if (tag) counts[tag] = (counts[tag] ?? 0) + 1
    }
  }

  return Object.entries(counts)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)
}

type Props = { req: PayloadRequest }

export default async function TagFrequency({ req }: Props) {
  const { payload } = req

  const { docs } = await payload.find({
    collection: 'posts',
    where: { status: { equals: 'published' } },
    limit: 1000,
    depth: 0,
    select: { tags: true },
  })

  const data = countTagFrequency(docs as Array<{ tags?: string[] | null }>)

  return (
    <div className="flcn-widget">
      <div className="flcn-widget__header">
        <h3 className="flcn-widget__title">Tag Frequency</h3>
        <span className="flcn-widget__action">Top 10</span>
      </div>
      {data.length === 0 ? (
        <p className="flcn-widget__empty">No tags yet.</p>
      ) : (
        <TagFrequencyChart data={data} />
      )}
    </div>
  )
}
```

- [ ] **Step 4: Create `TagFrequencyChart.tsx`**

```tsx
'use client'
import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import type { TagData } from './TagFrequency'

export function TagFrequencyChart({ data }: { data: TagData[] }) {
  const ref = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const svg = d3.select(ref.current)
    svg.selectAll('*').remove()

    const cs = getComputedStyle(document.documentElement)
    const textColor = cs.getPropertyValue('--theme-elevation-600').trim() || '#888'
    const barColor = cs.getPropertyValue('--theme-elevation-400').trim() || '#999'

    const labelWidth = 104
    const margin = { top: 4, right: 36, bottom: 4, left: labelWidth }
    const W = Math.max(ref.current.clientWidth, 180) - margin.left - margin.right
    const rowH = 24
    const H = data.length * rowH

    svg.attr('height', H + margin.top + margin.bottom)

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`)

    const y = d3.scaleBand().domain(data.map(d => d.tag)).range([0, H]).padding(0.25)
    const x = d3.scaleLinear().domain([0, d3.max(data, d => d.count) ?? 1]).nice().range([0, W])

    g.selectAll('.label')
      .data(data)
      .join('text')
      .attr('x', -8)
      .attr('y', d => (y(d.tag) ?? 0) + y.bandwidth() / 2)
      .attr('text-anchor', 'end')
      .attr('dominant-baseline', 'middle')
      .style('font-size', '12px')
      .style('fill', textColor)
      .text(d => d.tag)

    g.selectAll('.bar')
      .data(data)
      .join('rect')
      .attr('y', d => y(d.tag) ?? 0)
      .attr('x', 0)
      .attr('height', y.bandwidth())
      .attr('width', d => x(d.count))
      .attr('fill', barColor)
      .attr('rx', 2)

    g.selectAll('.val')
      .data(data)
      .join('text')
      .attr('x', d => x(d.count) + 5)
      .attr('y', d => (y(d.tag) ?? 0) + y.bandwidth() / 2)
      .attr('dominant-baseline', 'middle')
      .style('font-size', '12px')
      .style('fill', textColor)
      .text(d => d.count)
  }, [data])

  return <svg ref={ref} className="flcn-chart" style={{ width: '100%', minHeight: 32 }} />
}
```

- [ ] **Step 5: Run all tests**

```bash
pnpm test -- widget-data
```

Expected: all 13 tests PASS (4 `buildActivityData` + 4 `groupByInquiry` + 5 `countTagFrequency`).

- [ ] **Step 6: Type-check**

```bash
npx tsc --noEmit 2>&1 | grep -E "TagFrequency" || echo "OK"
```

- [ ] **Step 7: Commit**

```bash
git add src/components/admin/widgets/TagFrequency.tsx \
        src/components/admin/widgets/TagFrequencyChart.tsx \
        src/components/admin/widgets/__tests__/widget-data.test.ts
git commit -m "feat(admin): add TagFrequency D3 horizontal bar chart widget"
```

---

## Task 8: Register widgets in Payload config

**Files:**
- Modify: `src/payload.config.ts`

- [ ] **Step 1: Add 4 new widget entries to the `widgets` array**

In `src/payload.config.ts`, find `admin.dashboard.widgets` and add after the existing 3 entries:

```ts
{
  slug: 'posts-activity',
  label: 'Publishing Activity',
  Component: '/components/admin/widgets/PostsActivity',
  minWidth: 'medium',
},
{
  slug: 'content-pipeline',
  label: 'Content Pipeline',
  Component: '/components/admin/widgets/ContentPipeline',
  minWidth: 'small',
},
{
  slug: 'inquiry-breakdown',
  label: 'Inquiry Breakdown',
  Component: '/components/admin/widgets/InquiryBreakdown',
  minWidth: 'small',
},
{
  slug: 'tag-frequency',
  label: 'Tag Frequency',
  Component: '/components/admin/widgets/TagFrequency',
  minWidth: 'medium',
},
```

- [ ] **Step 2: Replace `defaultLayout`**

Replace the existing `defaultLayout` array with:

```ts
defaultLayout: [
  { widgetSlug: 'posts-activity',     width: 'full'   },
  { widgetSlug: 'content-pipeline',   width: 'small'  },
  { widgetSlug: 'tag-frequency',      width: 'medium' },
  { widgetSlug: 'inquiry-breakdown',  width: 'small'  },
  { widgetSlug: 'recent-posts',       width: 'medium' },
  { widgetSlug: 'recent-submissions', width: 'medium' },
  { widgetSlug: 'content-stats',      width: 'full'   },
  { widgetSlug: 'collections',        width: 'full'   },
],
```

- [ ] **Step 3: Type-check**

```bash
npx tsc --noEmit 2>&1 | grep "payload.config" || echo "OK"
```

- [ ] **Step 4: Build to verify**

```bash
pnpm build 2>&1 | tail -20
```

Expected: build completes without errors (warnings about large bundle sizes from D3 are acceptable).

- [ ] **Step 5: Commit**

```bash
git add src/payload.config.ts
git commit -m "feat(admin): register D3 widgets and update dashboard layout"
```

---

## Task 9: Regenerate import map

Payload's import map must be regenerated whenever new `Component` paths are added.

**Files:**
- Auto-generated: `src/app/(payload)/admin/importMap.js`

- [ ] **Step 1: Run the importmap generator**

The project's `generate:importmap` script is broken on Node 24 (known issue — use the workaround from project memory). Use the temp `.mts` script approach:

Check if `src/scripts/generate-importmap.mts` already exists:

```bash
ls src/scripts/generate-importmap.mts 2>/dev/null && echo "exists" || echo "missing"
```

If missing, create `src/scripts/generate-importmap.mts`:

```ts
import { generateImportMap } from '@payloadcms/next/utilities'
import configPromise from '../payload.config'

const config = await configPromise
await generateImportMap(config)
console.log('Import map generated.')
```

Run it:

```bash
npx tsx src/scripts/generate-importmap.mts
```

Expected: `Import map generated.` with no errors.

- [ ] **Step 2: Verify the new widgets appear in the import map**

```bash
grep -E "PostsActivity|ContentPipeline|InquiryBreakdown|TagFrequency" \
  src/app/\(payload\)/admin/importMap.js | wc -l
```

Expected: `4` (one match per widget).

- [ ] **Step 3: Commit**

```bash
git add src/app/\(payload\)/admin/importMap.js src/scripts/generate-importmap.mts
git commit -m "chore: regenerate admin import map with D3 widgets"
```

---

## Task 10: Visual verification

- [ ] **Step 1: Start the dev server**

```bash
pnpm dev
```

- [ ] **Step 2: Open the admin dashboard**

Navigate to `http://localhost:3000/admin` and log in.

- [ ] **Step 3: Verify each widget renders**

Check the following, in order:
1. **Publishing Activity** — bar chart visible at the top, 12 labelled month bars, no console errors
2. **Content Pipeline** — donut chart visible with total in centre, legend shows Published/Draft counts
3. **Tag Frequency** — horizontal bars visible with tag labels; if no tags exist, shows "No tags yet."
4. **Inquiry Breakdown** — horizontal bars visible; if no submissions, shows "No inquiries yet."
5. **Recent Inquiries** — shows submissions list (no longer empty due to the form-slug fix)

- [ ] **Step 4: Toggle admin theme (light ↔ dark)**

Charts should repaint with appropriate colours when the theme toggles. If they don't repaint, note it — this is a known limitation of `useEffect`-based D3 (colours are read on mount, not on theme change). This is acceptable for now.
