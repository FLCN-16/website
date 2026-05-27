# Writing Listing Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign `/writing` with a prominent search bar, masonry bento grid of post cards, and a persistent filter sidebar (tags · year · reading time) on desktop / bottom-sheet on mobile.

**Architecture:** Five tasks build bottom-up — card → filter panel → filter drawer → client rework → server wrapper update. The client component owns all filter state and passes it as props to stateless panel/drawer components. Filtering is hybrid: `search` and single-tag queries go server-side via `/api/posts`; multi-tag OR, year, and reading-time ranges are applied client-side on the returned slice (≤50 posts, safe for a portfolio). Tasks 4 and 5 are ordered so the client accepts `allYears` before the server wrapper passes it — no intermediate type errors.

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind CSS v4, shadcn/ui (`Sheet`, `Separator`, `Badge`, `Input`), TanStack Query v5, TypeScript.

---

## File Map

| Action | Path | Responsibility |
|---|---|---|
| Create | `components/writing/bento-card.tsx` | Single post card — `hero` or `standard` variant |
| Create | `components/writing/filter-panel.tsx` | Filter UI (tags, year, reading time) — stateless |
| Create | `components/writing/filter-drawer.tsx` | Mobile bottom-sheet wrapping `FilterPanel` |
| Modify | `components/sections/writing-list.tsx` | Extract years, widen layout, forward `allYears` |
| Modify | `components/sections/writing-list-client.tsx` | Full rework: two-zone layout, masonry, filter state |

---

## Task 1: BentoCard component

**Files:**
- Create: `components/writing/bento-card.tsx`

- [ ] **Step 1: Create the file**

```tsx
// components/writing/bento-card.tsx
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export interface Post {
  id: string
  title: string
  slug: string
  excerpt?: string
  tags?: Array<{ tag: string }>
  publishedAt?: string
  readingTime?: number
}

interface BentoCardProps {
  post: Post
  variant?: "hero" | "standard"
}

function formatDate(iso?: string) {
  if (!iso) return "—"
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export function BentoCard({ post, variant = "standard" }: BentoCardProps) {
  const isHero = variant === "hero"
  const visibleTags = isHero ? post.tags : post.tags?.slice(0, 2)

  return (
    <Link
      href={`/writing/${post.slug}`}
      className={cn(
        "group flex flex-col gap-3 rounded-xl border p-5 transition-all duration-200 hover:shadow-md",
        isHero
          ? "bg-primary/5 border-primary/20"
          : "bg-background border-border",
      )}
    >
      <h2
        className={cn(
          "font-semibold tracking-tight group-hover:text-primary transition-colors",
          isHero ? "text-2xl" : "text-lg",
        )}
      >
        {post.title}
      </h2>

      {post.excerpt && (
        <p
          className={cn(
            "text-sm text-muted-foreground",
            isHero ? "line-clamp-3" : "line-clamp-2",
          )}
        >
          {post.excerpt}
        </p>
      )}

      <div className="mt-auto flex flex-wrap items-center gap-3">
        <span className="font-mono text-xs text-muted-foreground">
          {formatDate(post.publishedAt)}
        </span>
        {post.readingTime !== undefined && (
          <span className="font-mono text-xs text-muted-foreground">
            {post.readingTime} min read
          </span>
        )}
        {visibleTags && visibleTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {visibleTags.map(({ tag }) => (
              <Badge key={tag} variant="secondary" className="font-mono text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit --skipLibCheck 2>&1 | grep -v ".next/"
```

Expected: no output (clean).

- [ ] **Step 3: Commit**

```bash
git add components/writing/bento-card.tsx
git commit -m "feat(writing): add BentoCard component (hero + standard variants)"
```

---

## Task 2: FilterPanel component

**Files:**
- Create: `components/writing/filter-panel.tsx`

- [ ] **Step 1: Create the file**

```tsx
// components/writing/filter-panel.tsx
"use client"

import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

export type ReadingTime = "short" | "medium" | "long"

export interface FilterPanelProps {
  allTags: string[]
  allYears: string[]
  selectedTags: string[]
  selectedYear: string | null
  selectedReadingTime: ReadingTime | null
  activeFilterCount: number
  onTagToggle: (tag: string) => void
  onYearSelect: (year: string | null) => void
  onReadingTimeSelect: (rt: ReadingTime | null) => void
  onClearAll: () => void
}

const READING_TIME_OPTIONS: Array<{ value: ReadingTime; label: string }> = [
  { value: "short", label: "Short  <5m" },
  { value: "medium", label: "Medium  5–15m" },
  { value: "long", label: "Long  >15m" },
]

export function FilterPanel({
  allTags,
  allYears,
  selectedTags,
  selectedYear,
  selectedReadingTime,
  activeFilterCount,
  onTagToggle,
  onYearSelect,
  onReadingTimeSelect,
  onClearAll,
}: FilterPanelProps) {
  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
        </span>
        {activeFilterCount > 0 && (
          <button
            onClick={onClearAll}
            className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      <Separator />

      {/* Tags */}
      <div className="flex flex-col gap-3">
        <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Tags
        </span>
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => {
            const active = selectedTags.includes(tag)
            return (
              <button
                key={tag}
                onClick={() => onTagToggle(tag)}
                className={cn(
                  "rounded-full border px-2.5 py-1 font-mono text-xs transition-colors",
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-muted-foreground hover:text-foreground",
                )}
              >
                {tag}
              </button>
            )
          })}
          {allTags.length === 0 && (
            <span className="font-mono text-xs text-muted-foreground">No tags yet</span>
          )}
        </div>
      </div>

      {allYears.length > 0 && (
        <>
          <Separator />
          {/* Year */}
          <div className="flex flex-col gap-2">
            <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              Year
            </span>
            <ul className="flex flex-col gap-1">
              {allYears.map((year) => (
                <li key={year}>
                  <button
                    onClick={() => onYearSelect(year === selectedYear ? null : year)}
                    className={cn(
                      "font-mono text-sm transition-colors",
                      selectedYear === year
                        ? "font-medium text-primary"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {year}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}

      <Separator />

      {/* Reading Time */}
      <div className="flex flex-col gap-3">
        <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Reading Time
        </span>
        <div className="flex flex-col gap-1.5">
          {READING_TIME_OPTIONS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() =>
                onReadingTimeSelect(value === selectedReadingTime ? null : value)
              }
              className={cn(
                "text-left font-mono text-sm transition-colors",
                selectedReadingTime === value
                  ? "font-medium text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit --skipLibCheck 2>&1 | grep -v ".next/"
```

Expected: no output.

- [ ] **Step 3: Commit**

```bash
git add components/writing/filter-panel.tsx
git commit -m "feat(writing): add FilterPanel component (tags, year, reading time)"
```

---

## Task 3: FilterDrawer (mobile bottom-sheet)

**Files:**
- Create: `components/writing/filter-drawer.tsx`

- [ ] **Step 1: Create the file**

```tsx
// components/writing/filter-drawer.tsx
"use client"

import {
  Sheet,
  SheetContent,
  SheetClose,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { FilterPanel, type FilterPanelProps } from "./filter-panel"

export function FilterDrawer(props: FilterPanelProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="rounded-full border border-border px-3 py-1.5 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground">
          Filters{props.activeFilterCount > 0 ? ` (${props.activeFilterCount})` : ""}
        </button>
      </SheetTrigger>
      <SheetContent side="bottom" className="max-h-[80vh] overflow-y-auto">
        <SheetHeader className="pb-2">
          <SheetTitle>Filters</SheetTitle>
        </SheetHeader>
        <div className="px-4 pb-4">
          <FilterPanel {...props} />
        </div>
        <div className="border-t border-border p-4">
          <SheetClose asChild>
            <button className="w-full rounded-lg bg-foreground py-2.5 font-mono text-xs text-background transition-colors hover:opacity-90">
              Apply
            </button>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  )
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit --skipLibCheck 2>&1 | grep -v ".next/"
```

Expected: no output.

- [ ] **Step 3: Commit**

```bash
git add components/writing/filter-drawer.tsx
git commit -m "feat(writing): add FilterDrawer mobile bottom-sheet"
```

---

## Task 4: Rework WritingListClient

**Files:**
- Modify: `components/sections/writing-list-client.tsx`

Full replacement. Owns all filter state, renders two-zone layout (masonry + sidebar), delegates filter UI to `FilterPanel` and `FilterDrawer`.

**Filter strategy:**
- `search` and single-tag are server-side (React Query → `/api/posts`)
- Multi-tag OR, year, and readingTime are applied client-side via `applyLocalFilters`
- This is safe: the server returns ≤50 posts; local filtering is instant

**Files:**
- Modify: `components/sections/writing-list-client.tsx`

Full replacement. Owns all filter state, renders two-zone layout (masonry + sidebar), delegates filter UI to `FilterPanel` and `FilterDrawer`.

**Filter strategy:**
- `search` and single-tag are server-side (React Query → `/api/posts`)
- Multi-tag OR, year, and readingTime are applied client-side via `applyLocalFilters`
- This is safe: the server returns ≤50 posts; local filtering is instant

- [ ] **Step 1: Replace the file contents**

```tsx
// components/sections/writing-list-client.tsx
"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Input } from "@/components/ui/input"
import { BentoCard, type Post } from "@/components/writing/bento-card"
import { FilterPanel, type ReadingTime } from "@/components/writing/filter-panel"
import { FilterDrawer } from "@/components/writing/filter-drawer"

interface WritingListClientProps {
  initialPosts: Post[]
  allTags: string[]
  allYears: string[]
}

async function fetchPosts(search: string, singleTag: string): Promise<Post[]> {
  const qs = new URLSearchParams()
  qs.set("where[status][equals]", "published")
  qs.set("limit", "50")
  qs.set("sort", "-publishedAt")
  if (search) qs.set("where[title][contains]", search)
  if (singleTag) qs.set("where[tags.tag][equals]", singleTag)

  const res = await fetch(`/api/posts?${qs.toString()}`)
  if (!res.ok) throw new Error("Failed to fetch posts")
  const data = await res.json()
  return data.docs as Post[]
}

function applyLocalFilters(
  posts: Post[],
  tags: string[],
  year: string | null,
  readingTime: ReadingTime | null,
): Post[] {
  return posts.filter((post) => {
    if (tags.length > 1) {
      const postTags = post.tags?.map((t) => t.tag) ?? []
      if (!tags.some((tag) => postTags.includes(tag))) return false
    }

    if (year) {
      if (!post.publishedAt) return false
      if (new Date(post.publishedAt).getFullYear().toString() !== year) return false
    }

    if (readingTime && post.readingTime !== undefined) {
      const rt = post.readingTime
      if (readingTime === "short" && rt > 5) return false
      if (readingTime === "medium" && (rt <= 5 || rt > 15)) return false
      if (readingTime === "long" && rt <= 15) return false
    }

    return true
  })
}

export function WritingListClient({ initialPosts, allTags, allYears }: WritingListClientProps) {
  const [search, setSearch] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedYear, setSelectedYear] = useState<string | null>(null)
  const [selectedReadingTime, setSelectedReadingTime] = useState<ReadingTime | null>(null)

  const serverTag = selectedTags.length === 1 ? selectedTags[0] : ""
  const isServerFiltering = search.length > 0 || serverTag.length > 0

  const { data: serverPosts } = useQuery({
    queryKey: ["posts", search, serverTag],
    queryFn: () => fetchPosts(search, serverTag),
    enabled: isServerFiltering,
    placeholderData: initialPosts,
  })

  const rawPosts = isServerFiltering ? (serverPosts ?? initialPosts) : initialPosts
  const posts = applyLocalFilters(rawPosts, selectedTags, selectedYear, selectedReadingTime)

  const activeFilterCount =
    selectedTags.length + (selectedYear ? 1 : 0) + (selectedReadingTime ? 1 : 0)

  function toggleTag(tag: string) {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    )
  }

  function clearAll() {
    setSelectedTags([])
    setSelectedYear(null)
    setSelectedReadingTime(null)
  }

  const filterProps = {
    allTags,
    allYears,
    selectedTags,
    selectedYear,
    selectedReadingTime,
    activeFilterCount,
    onTagToggle: toggleTag,
    onYearSelect: setSelectedYear,
    onReadingTimeSelect: setSelectedReadingTime,
    onClearAll: clearAll,
  }

  const [heroPost, ...restPosts] = posts

  return (
    <div>
      {/* Search */}
      <Input
        placeholder="Search articles…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="font-mono text-sm"
      />

      {/* Mobile filter trigger */}
      <div className="flex justify-end mt-3 md:hidden">
        <FilterDrawer {...filterProps} />
      </div>

      {/* Two-zone layout */}
      <div className="flex gap-10 items-start mt-8">
        {/* Bento masonry */}
        <div className="flex-1 min-w-0">
          {posts.length === 0 ? (
            <p className="font-mono text-sm text-muted-foreground">
              No articles match your filters.
            </p>
          ) : (
            <>
              {/* Hero card */}
              {heroPost && <BentoCard post={heroPost} variant="hero" />}

              {/* Masonry grid */}
              {restPosts.length > 0 && (
                <div className="mt-4 columns-1 sm:columns-2 gap-4">
                  {restPosts.map((post) => (
                    <div key={post.id} className="break-inside-avoid mb-4">
                      <BentoCard post={post} />
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Desktop filter sidebar */}
        <aside className="hidden md:block sticky top-6 w-52 shrink-0">
          <FilterPanel {...filterProps} />
        </aside>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Type-check (must be clean)**

```bash
npx tsc --noEmit --skipLibCheck 2>&1 | grep -v ".next/"
```

Expected: no output.

- [ ] **Step 3: Verify the page builds**

```bash
cd /root/Work/flcn-website && npx next build 2>&1 | tail -20
```

Expected: build completes without errors (writing route compiled).

- [ ] **Step 4: Commit**

```bash
git add components/sections/writing-list-client.tsx
git commit -m "feat(writing): masonry bento grid + filter sidebar with tag/year/reading-time filters"
```

---

## Task 5: Update WritingList server component

**Files:**
- Modify: `components/sections/writing-list.tsx`

Add `extractYears`, remove `max-w-3xl` wrapper so the two-column layout has space to breathe, pass `allYears` to client.

- [ ] **Step 1: Replace the file contents**

```tsx
// components/sections/writing-list.tsx
import { FadeRise } from "@/components/anim/fade-rise"
import { WritingListClient } from "./writing-list-client"

interface Post {
  id: string
  title: string
  slug: string
  excerpt?: string
  tags?: Array<{ tag: string }>
  publishedAt?: string
  readingTime?: number
}

interface WritingListProps {
  posts: Post[]
}

function extractTags(posts: Post[]): string[] {
  const seen = new Set<string>()
  for (const post of posts) {
    for (const { tag } of post.tags ?? []) {
      seen.add(tag)
    }
  }
  return Array.from(seen).sort()
}

function extractYears(posts: Post[]): string[] {
  const seen = new Set<string>()
  for (const post of posts) {
    if (post.publishedAt) {
      seen.add(new Date(post.publishedAt).getFullYear().toString())
    }
  }
  return Array.from(seen).sort((a, b) => Number(b) - Number(a))
}

export function WritingList({ posts }: WritingListProps) {
  const allTags = extractTags(posts)
  const allYears = extractYears(posts)

  return (
    <section className="py-20 md:py-28">
      <FadeRise>
        <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-2">
          Writing
        </p>
        <h1 className="font-sans text-4xl font-semibold tracking-tight mb-8">
          Articles & Thoughts
        </h1>
        <WritingListClient initialPosts={posts} allTags={allTags} allYears={allYears} />
      </FadeRise>
    </section>
  )
}
```

- [ ] **Step 2: Type-check (must be clean — Task 4 already updated the client)**

```bash
npx tsc --noEmit --skipLibCheck 2>&1 | grep -v ".next/"
```

Expected: no output.

- [ ] **Step 3: Verify the page builds**

```bash
cd /root/Work/flcn-website && npx next build 2>&1 | tail -20
```

Expected: build completes without errors.

- [ ] **Step 4: Commit**

```bash
git add components/sections/writing-list.tsx
git commit -m "feat(writing): extract years, widen layout in WritingList server component"
```

---

## Spec Coverage Check

| Spec requirement | Task |
|---|---|
| Prominent full-width search bar | Task 5 |
| Masonry bento grid (CSS columns) | Task 5 |
| Hero card (latest post, tinted) | Task 1 + Task 5 |
| Standard cards (border, hover lift + primary title) | Task 1 |
| Graceful degradation (0/1/2 posts) | Task 5 (0 = empty state; 1–2 = hero only or hero + 1 card) |
| Tag filter (multi-select) | Task 2 + Task 5 |
| Year filter (single-select) | Task 2 + Task 5 |
| Reading time filter (short/medium/long) | Task 2 + Task 5 |
| Active filter count badge | Task 2 + Task 5 |
| Clear all filters | Task 2 + Task 5 |
| Desktop sticky sidebar | Task 3 header → Task 5 layout |
| Mobile bottom-sheet drawer | Task 3 |
| "Filters (n)" pill trigger on mobile | Task 3 |
| All filtering server-side / hybrid | Task 5 (`fetchPosts` + `applyLocalFilters`) |
| Layout widens (no max-w-3xl) | Task 4 |
