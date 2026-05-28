# Writing Page Editorial Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the flat bento-card writing index and bare detail page into an editorial / magazine-style experience with a featured hero, year-grouped post rows, chip filters, cover images, sticky TOC, scroll progress, and related posts.

**Architecture:** The list page gets a featured-first layout (cover-image hero, then year-section rows) with a horizontal chip strip replacing the sidebar. The detail page gains a two-column grid with a sticky TOC column on large screens, a fixed reading-progress bar, cover image, and a related posts strip. All new display components are thin UI over the same Payload data layer; data fetching stays server-side RSC.

**Tech Stack:** Next.js 15 (RSC + Client Components), Payload CMS (posts collection), TanStack Query (client-side search refetch), Tailwind CSS, shadcn/ui primitives (Badge, Input, Separator), next/image with Cloudflare R2 loader, GSAP via FadeRise, Vitest (node env — pure-function tests only).

---

## File Map

**New files:**
- `lib/types.ts` — add `Post` interface (cover, featured)
- `lib/lexical-headings.ts` — extract H2/H3 from Lexical JSON, return `{ id, text, level }[]`
- `components/writing/post-type.ts` — re-exports `Post` type (so imports don't need updating across multiple places — single source of truth)
- `components/writing/featured-card.tsx` — hero two-column card with cover image
- `components/writing/post-row.tsx` — horizontal thumbnail-left row card (no-thumbnail fallback)
- `components/writing/chip-filters.tsx` — chip strip: search input + tag chips + reading-time chips + sort select + clear
- `components/writing/post-toc.tsx` — sticky TOC sidebar (client component, ≥3 headings only)
- `components/writing/reading-progress.tsx` — fixed-top 2px progress bar driven by scroll
- `components/writing/related-posts.tsx` — 3-column strip of PostRow cards
- `lib/__tests__/lexical-headings.test.ts` — tests for heading extraction

**Modified files:**
- `collections/Posts.ts` — add `featured` boolean field
- `lib/types.ts` — add `Post` interface
- `app/(site)/writing/page.tsx` — depth 1, include cover+featured, pick hero, pass to WritingList
- `app/(site)/writing/[slug]/page.tsx` — fetchRelated, pass cover+related to WritingPost
- `components/sections/writing-list.tsx` — new editorial header + pass heroPost + posts
- `components/sections/writing-list-client.tsx` — chip strip, year grouping, search OR excerpt
- `components/sections/writing-post.tsx` — cover, grid layout, TOC, progress, related strip

**Deleted files:**
- `components/writing/bento-card.tsx`
- `components/writing/filter-panel.tsx`
- `components/writing/filter-drawer.tsx`
- `app/writing/` (empty stray directory — `rmdir`)

---

### Task 1: Add `featured` field to Posts collection

**Files:**
- Modify: `collections/Posts.ts`

- [ ] **Step 1: Add featured boolean field after the status field**

In `collections/Posts.ts`, insert after the closing brace of the `status` field object (after line 62, the `admin: { position: "sidebar" }` closing block):

```typescript
    {
      name: "featured",
      type: "checkbox",
      defaultValue: false,
      admin: {
        position: "sidebar",
        description: "Pin this post as the featured article on the Writing index.",
      },
    },
```

The fields array order should be: title, slug, excerpt, cover, tags, status, **featured**, publishedAt, readingTime, body, seo.

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /root/Work/flcn-website && pnpm tsc --noEmit 2>&1 | head -30
```

Expected: no errors (or only pre-existing unrelated errors).

- [ ] **Step 3: Commit**

```bash
git add collections/Posts.ts
git commit -m "feat(posts): add featured boolean field to Posts collection"
```

---

### Task 2: Add `Post` type to `lib/types.ts`

**Files:**
- Modify: `lib/types.ts`

- [ ] **Step 1: Append Post interface to lib/types.ts**

Add at the end of `lib/types.ts`:

```typescript
export interface PostCover {
  url: string
  width: number
  height: number
  alt?: string | null
}

export interface Post {
  id: string
  title: string
  slug: string
  excerpt?: string | null
  cover?: PostCover | null
  tags?: Array<{ tag: string }> | null
  publishedAt?: string | null
  readingTime?: number | null
  featured?: boolean | null
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /root/Work/flcn-website && pnpm tsc --noEmit 2>&1 | head -30
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add lib/types.ts
git commit -m "feat(types): add Post interface with cover and featured fields"
```

---

### Task 3: Update list-page data fetching (`app/(site)/writing/page.tsx`)

**Files:**
- Modify: `app/(site)/writing/page.tsx`

- [ ] **Step 1: Rewrite the page file**

Replace the entire content of `app/(site)/writing/page.tsx` with:

```typescript
import { getPayloadClient } from "@/lib/payload";
import { WritingList } from "@/components/sections/writing-list";
import { createMetadata } from "@/lib/metadata";
import type { Post } from "@/lib/types";

export const metadata = createMetadata({
  title: "Writing",
  description: "Articles and thoughts on frontend engineering, architecture, and building at scale.",
});

export const revalidate = 60;

export default async function WritingIndex() {
  let posts: Post[] = [];

  try {
    posts = await fetchPosts();
  } catch {
    // Payload not available (missing env vars in dev) — show empty state
  }

  const heroPost = pickHero(posts);

  return <WritingList posts={posts} heroPost={heroPost} />;
}

function pickHero(posts: Post[]): Post | null {
  // Prefer editor-flagged featured post with a cover image
  const featured = posts.find((p) => p.featured && p.cover);
  if (featured) return featured;
  // Fall back to most-recent post with a cover
  return posts.find((p) => p.cover) ?? null;
}

async function fetchPosts(): Promise<Post[]> {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "posts",
    where: { status: { equals: "published" } },
    sort: "-publishedAt",
    limit: 50,
    depth: 1,
  });
  return result.docs.map((doc) => {
    const cover = doc.cover as
      | { url?: string; width?: number; height?: number; alt?: string }
      | null
      | undefined;
    return {
      id: String(doc.id),
      title: doc.title,
      slug: doc.slug,
      excerpt: doc.excerpt ?? null,
      cover:
        cover && typeof cover === "object" && cover.url
          ? {
              url: cover.url,
              width: cover.width ?? 800,
              height: cover.height ?? 450,
              alt: cover.alt ?? null,
            }
          : null,
      tags: doc.tags ?? null,
      publishedAt: doc.publishedAt ?? null,
      readingTime: doc.readingTime ?? null,
      featured: doc.featured ?? null,
    };
  });
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /root/Work/flcn-website && pnpm tsc --noEmit 2>&1 | head -30
```

Expected: no errors (WritingList will show a type error until Task 5 — that's fine).

- [ ] **Step 3: Commit**

```bash
git add app/\(site\)/writing/page.tsx
git commit -m "feat(writing): update list page to depth 1 with cover, featured, and hero selection"
```

---

### Task 4: Update detail-page data fetching (`app/(site)/writing/[slug]/page.tsx`)

**Files:**
- Modify: `app/(site)/writing/[slug]/page.tsx`

- [ ] **Step 1: Rewrite the slug page file**

Replace the entire content with:

```typescript
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPayloadClient } from "@/lib/payload";
import { WritingPost } from "@/components/sections/writing-post";
import { createMetadata } from "@/lib/metadata";
import type { Post, PostCover } from "@/lib/types";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const post = await fetchPost(slug);
    if (!post) return { title: "Not Found" };
    return createMetadata({
      title: post.seo?.title ?? post.title,
      description: post.seo?.description ?? post.excerpt ?? undefined,
    });
  } catch {
    return { title: slug };
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;

  let post: Awaited<ReturnType<typeof fetchPost>>;
  try {
    post = await fetchPost(slug);
  } catch {
    notFound();
  }

  if (!post) notFound();

  const relatedPosts = await fetchRelated(post).catch(() => []);

  const cover = post.cover as
    | { url?: string; width?: number; height?: number; alt?: string }
    | null
    | undefined;

  const coverResolved: PostCover | null =
    cover && typeof cover === "object" && cover.url
      ? {
          url: cover.url,
          width: cover.width ?? 800,
          height: cover.height ?? 450,
          alt: cover.alt ?? null,
        }
      : null;

  return (
    <WritingPost
      title={post.title}
      publishedAt={post.publishedAt ?? undefined}
      readingTime={post.readingTime ?? undefined}
      tags={post.tags ?? undefined}
      body={post.body}
      cover={coverResolved}
      related={relatedPosts}
    />
  );
}

async function fetchPost(slug: string) {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "posts",
    where: {
      slug: { equals: slug },
      status: { equals: "published" },
    },
    limit: 1,
    depth: 1,
  });
  return result.docs[0] ?? null;
}

async function fetchRelated(post: { slug: string; tags?: Array<{ tag: string }> | null }): Promise<Post[]> {
  if (!post.tags?.length) return fetchRecent(post.slug);

  const payload = await getPayloadClient();
  const tagValues = post.tags.map((t) => t.tag);

  const result = await payload.find({
    collection: "posts",
    where: {
      and: [
        { status: { equals: "published" } },
        { slug: { not_equals: post.slug } },
        { "tags.tag": { in: tagValues } },
      ],
    },
    sort: "-publishedAt",
    limit: 3,
    depth: 1,
  });

  const docs = result.docs;
  if (docs.length >= 3) return docs.map(mapPost);

  // top up with recent posts excluding what we already have
  const existing = new Set(docs.map((d) => d.slug));
  existing.add(post.slug);
  const recent = await fetchRecent(post.slug, existing);
  const combined = [...docs.map(mapPost), ...recent].slice(0, 3);
  return combined;
}

async function fetchRecent(excludeSlug: string, excludeSlugs?: Set<string>): Promise<Post[]> {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "posts",
    where: {
      and: [
        { status: { equals: "published" } },
        { slug: { not_equals: excludeSlug } },
      ],
    },
    sort: "-publishedAt",
    limit: 6,
    depth: 1,
  });
  const all = result.docs.map(mapPost);
  if (!excludeSlugs) return all.slice(0, 3);
  return all.filter((p) => !excludeSlugs.has(p.slug)).slice(0, 3);
}

function mapPost(doc: Record<string, unknown>): Post {
  const cover = doc.cover as
    | { url?: string; width?: number; height?: number; alt?: string }
    | null
    | undefined;
  return {
    id: String(doc.id),
    title: doc.title as string,
    slug: doc.slug as string,
    excerpt: (doc.excerpt as string | null) ?? null,
    cover:
      cover && typeof cover === "object" && cover.url
        ? {
            url: cover.url,
            width: cover.width ?? 800,
            height: cover.height ?? 450,
            alt: cover.alt ?? null,
          }
        : null,
    tags: (doc.tags as Array<{ tag: string }> | null) ?? null,
    publishedAt: (doc.publishedAt as string | null) ?? null,
    readingTime: (doc.readingTime as number | null) ?? null,
    featured: (doc.featured as boolean | null) ?? null,
  };
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /root/Work/flcn-website && pnpm tsc --noEmit 2>&1 | head -30
```

- [ ] **Step 3: Commit**

```bash
git add "app/(site)/writing/[slug]/page.tsx"
git commit -m "feat(writing): add fetchRelated and cover to detail page data layer"
```

---

### Task 5: `lexical-headings.ts` utility + tests

**Files:**
- Create: `lib/lexical-headings.ts`
- Create: `lib/__tests__/lexical-headings.test.ts`

- [ ] **Step 1: Write the failing test**

Create `lib/__tests__/lexical-headings.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { extractHeadings } from "../lexical-headings";

const makeDoc = (children: unknown[]) => ({ root: { children } });

describe("extractHeadings", () => {
  it("returns empty array for null/undefined body", () => {
    expect(extractHeadings(null)).toEqual([]);
    expect(extractHeadings(undefined)).toEqual([]);
  });

  it("returns empty array when root has no children", () => {
    expect(extractHeadings(makeDoc([]))).toEqual([]);
  });

  it("extracts h2 headings", () => {
    const body = makeDoc([
      { type: "heading", tag: "h2", children: [{ text: "Section One" }] },
    ]);
    expect(extractHeadings(body)).toEqual([
      { id: "section-one", text: "Section One", level: 2 },
    ]);
  });

  it("extracts h3 headings", () => {
    const body = makeDoc([
      { type: "heading", tag: "h3", children: [{ text: "Sub Section" }] },
    ]);
    expect(extractHeadings(body)).toEqual([
      { id: "sub-section", text: "Sub Section", level: 3 },
    ]);
  });

  it("ignores h1 and h4 headings", () => {
    const body = makeDoc([
      { type: "heading", tag: "h1", children: [{ text: "Title" }] },
      { type: "heading", tag: "h4", children: [{ text: "Minor" }] },
    ]);
    expect(extractHeadings(body)).toEqual([]);
  });

  it("ignores non-heading nodes", () => {
    const body = makeDoc([
      { type: "paragraph", children: [{ text: "Hello" }] },
      { type: "heading", tag: "h2", children: [{ text: "Real Heading" }] },
    ]);
    expect(extractHeadings(body)).toEqual([
      { id: "real-heading", text: "Real Heading", level: 2 },
    ]);
  });

  it("slugifies text with special characters", () => {
    const body = makeDoc([
      { type: "heading", tag: "h2", children: [{ text: "Hello, World! (2026)" }] },
    ]);
    expect(extractHeadings(body)).toEqual([
      { id: "hello-world-2026", text: "Hello, World! (2026)", level: 2 },
    ]);
  });

  it("concatenates multiple text children", () => {
    const body = makeDoc([
      {
        type: "heading",
        tag: "h2",
        children: [{ text: "Hello " }, { text: "World" }],
      },
    ]);
    expect(extractHeadings(body)).toEqual([
      { id: "hello-world", text: "Hello World", level: 2 },
    ]);
  });

  it("returns mixed h2 and h3 in document order", () => {
    const body = makeDoc([
      { type: "heading", tag: "h2", children: [{ text: "Alpha" }] },
      { type: "paragraph", children: [{ text: "content" }] },
      { type: "heading", tag: "h3", children: [{ text: "Beta" }] },
      { type: "heading", tag: "h2", children: [{ text: "Gamma" }] },
    ]);
    expect(extractHeadings(body)).toEqual([
      { id: "alpha", text: "Alpha", level: 2 },
      { id: "beta", text: "Beta", level: 3 },
      { id: "gamma", text: "Gamma", level: 2 },
    ]);
  });
});
```

- [ ] **Step 2: Run the test to confirm it fails**

```bash
cd /root/Work/flcn-website && pnpm vitest run lib/__tests__/lexical-headings.test.ts 2>&1 | tail -20
```

Expected: FAIL — `Cannot find module '../lexical-headings'`

- [ ] **Step 3: Implement `lib/lexical-headings.ts`**

Create `lib/lexical-headings.ts`:

```typescript
export interface Heading {
  id: string
  text: string
  level: 2 | 3
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function textContent(children: any[]): string {
  if (!Array.isArray(children)) return ""
  return children.map((c) => (typeof c?.text === "string" ? c.text : "")).join("")
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function extractHeadings(body: any): Heading[] {
  if (!body?.root?.children) return []
  const headings: Heading[] = []
  for (const node of body.root.children) {
    if (node?.type !== "heading") continue
    if (node.tag !== "h2" && node.tag !== "h3") continue
    const text = textContent(node.children)
    if (!text) continue
    headings.push({ id: slugify(text), text, level: node.tag === "h2" ? 2 : 3 })
  }
  return headings
}
```

- [ ] **Step 4: Run the tests and confirm they pass**

```bash
cd /root/Work/flcn-website && pnpm vitest run lib/__tests__/lexical-headings.test.ts 2>&1 | tail -20
```

Expected: all tests PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/lexical-headings.ts lib/__tests__/lexical-headings.test.ts
git commit -m "feat(writing): add lexical-headings utility with tests"
```

---

### Task 6: `FeaturedCard` component

**Files:**
- Create: `components/writing/featured-card.tsx`

- [ ] **Step 1: Create the component**

Create `components/writing/featured-card.tsx`:

```typescript
import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { Post } from "@/lib/types"

function formatDate(iso?: string | null) {
  if (!iso) return "—"
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

interface FeaturedCardProps {
  post: Post
  className?: string
}

export function FeaturedCard({ post, className }: FeaturedCardProps) {
  return (
    <Link
      href={`/writing/${post.slug}`}
      className={cn(
        "group grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-0 rounded-xl border border-border overflow-hidden transition-all duration-200 hover:shadow-lg dark:hover:shadow-none",
        className,
      )}
    >
      {/* Cover */}
      {post.cover && (
        <div className="relative aspect-[4/3] md:aspect-auto md:h-full min-h-[220px] overflow-hidden">
          <Image
            src={post.cover.url}
            alt={post.cover.alt ?? post.title}
            fill
            sizes="(max-width: 768px) 100vw, 55vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            priority
          />
        </div>
      )}

      {/* Content */}
      <div className="flex flex-col gap-4 p-6 md:p-8 bg-card">
        {/* Eyebrow */}
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Featured
        </p>

        <div className="flex-1 flex flex-col gap-3">
          <h2 className="font-sans text-2xl md:text-3xl font-semibold tracking-tight leading-snug group-hover:text-primary transition-colors duration-200">
            {post.title}
          </h2>

          {post.excerpt && (
            <p className="text-base text-muted-foreground leading-relaxed line-clamp-4">
              {post.excerpt}
            </p>
          )}
        </div>

        {/* Meta row */}
        <div className="mt-auto flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-xs text-muted-foreground">
              {formatDate(post.publishedAt)}
            </span>
            {post.readingTime && (
              <span className="font-mono text-xs text-muted-foreground">
                {post.readingTime} min read
              </span>
            )}
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {post.tags.map(({ tag }) => (
                <Badge key={tag} variant="secondary" className="font-mono text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          <span className="font-mono text-xs text-primary mt-1">
            Read article →
          </span>
        </div>
      </div>
    </Link>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /root/Work/flcn-website && pnpm tsc --noEmit 2>&1 | head -20
```

- [ ] **Step 3: Commit**

```bash
git add components/writing/featured-card.tsx
git commit -m "feat(writing): add FeaturedCard editorial hero component"
```

---

### Task 7: `PostRow` component

**Files:**
- Create: `components/writing/post-row.tsx`

- [ ] **Step 1: Create the component**

Create `components/writing/post-row.tsx`:

```typescript
import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { Post } from "@/lib/types"

function formatDate(iso?: string | null) {
  if (!iso) return "—"
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

interface PostRowProps {
  post: Post
  className?: string
}

export function PostRow({ post, className }: PostRowProps) {
  return (
    <Link
      href={`/writing/${post.slug}`}
      className={cn(
        "group flex gap-4 py-5 border-b border-border last:border-b-0 transition-colors hover:bg-muted/30",
        className,
      )}
    >
      {/* Thumbnail — only when cover is present */}
      {post.cover && (
        <div className="relative shrink-0 w-24 h-24 md:w-36 md:h-24 rounded-md overflow-hidden">
          <Image
            src={post.cover.url}
            alt={post.cover.alt ?? post.title}
            fill
            sizes="(max-width: 768px) 96px, 144px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}

      {/* Text */}
      <div className="flex flex-col gap-1.5 min-w-0 flex-1">
        <h3 className="font-sans text-base font-semibold tracking-tight leading-snug group-hover:text-primary transition-colors duration-200 line-clamp-2">
          {post.title}
        </h3>

        {post.excerpt && (
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {post.excerpt}
          </p>
        )}

        <div className="mt-auto flex flex-wrap items-center gap-2 pt-1">
          <span className="font-mono text-xs text-muted-foreground">
            {formatDate(post.publishedAt)}
          </span>
          {post.readingTime && (
            <>
              <span className="text-muted-foreground/40">·</span>
              <span className="font-mono text-xs text-muted-foreground">
                {post.readingTime} min
              </span>
            </>
          )}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 ml-auto">
              {post.tags.slice(0, 2).map(({ tag }) => (
                <Badge key={tag} variant="secondary" className="font-mono text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /root/Work/flcn-website && pnpm tsc --noEmit 2>&1 | head -20
```

- [ ] **Step 3: Commit**

```bash
git add components/writing/post-row.tsx
git commit -m "feat(writing): add PostRow horizontal list card with optional thumbnail"
```

---

### Task 8: `ChipFilters` component

**Files:**
- Create: `components/writing/chip-filters.tsx`

- [ ] **Step 1: Create the component**

Create `components/writing/chip-filters.tsx`:

```typescript
"use client"

import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export type SortOption = "newest" | "oldest" | "longest" | "shortest"
export type ReadingTime = "short" | "medium" | "long"

const READING_TIME_OPTIONS: Array<{ value: ReadingTime; label: string }> = [
  { value: "short", label: "<5m" },
  { value: "medium", label: "5–15m" },
  { value: "long", label: ">15m" },
]

const SORT_OPTIONS: Array<{ value: SortOption; label: string }> = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "longest", label: "Longest" },
  { value: "shortest", label: "Shortest" },
]

export interface ChipFiltersProps {
  search: string
  allTags: string[]
  selectedTags: string[]
  selectedReadingTime: ReadingTime | null
  sort: SortOption
  activeFilterCount: number
  onSearchChange: (value: string) => void
  onTagToggle: (tag: string) => void
  onReadingTimeSelect: (rt: ReadingTime | null) => void
  onSortChange: (sort: SortOption) => void
  onClearAll: () => void
}

export function ChipFilters({
  search,
  allTags,
  selectedTags,
  selectedReadingTime,
  sort,
  activeFilterCount,
  onSearchChange,
  onTagToggle,
  onReadingTimeSelect,
  onSortChange,
  onClearAll,
}: ChipFiltersProps) {
  return (
    <div className="flex flex-col gap-3 py-4 border-y border-border">
      {/* Search row */}
      <div className="flex items-center gap-3">
        <Input
          placeholder="Search articles…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="max-w-xs font-mono text-sm"
        />

        {/* Sort */}
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className="ml-auto font-mono text-xs bg-transparent border border-border rounded-full px-3 py-1.5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          {SORT_OPTIONS.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>

        {activeFilterCount > 0 && (
          <button
            onClick={onClearAll}
            className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors shrink-0"
          >
            Clear ({activeFilterCount})
          </button>
        )}
      </div>

      {/* Chips row */}
      {(allTags.length > 0 || true) && (
        <div className="flex flex-wrap gap-2 items-center">
          {/* Tag chips */}
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

          {/* Divider between tags and reading time */}
          {allTags.length > 0 && (
            <span className="text-border select-none">|</span>
          )}

          {/* Reading time chips */}
          {READING_TIME_OPTIONS.map(({ value, label }) => {
            const active = selectedReadingTime === value
            return (
              <button
                key={value}
                onClick={() => onReadingTimeSelect(active ? null : value)}
                className={cn(
                  "rounded-full border px-2.5 py-1 font-mono text-xs transition-colors",
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-muted-foreground hover:text-foreground",
                )}
              >
                {label}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /root/Work/flcn-website && pnpm tsc --noEmit 2>&1 | head -20
```

- [ ] **Step 3: Commit**

```bash
git add components/writing/chip-filters.tsx
git commit -m "feat(writing): add ChipFilters horizontal filter strip"
```

---

### Task 9: `PostToc` component

**Files:**
- Create: `components/writing/post-toc.tsx`

- [ ] **Step 1: Create the component**

Create `components/writing/post-toc.tsx`:

```typescript
"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import type { Heading } from "@/lib/lexical-headings"

interface PostTocProps {
  headings: Heading[]
}

export function PostToc({ headings }: PostTocProps) {
  const [activeId, setActiveId] = useState<string>("")

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        }
      },
      { rootMargin: "0px 0px -70% 0px" },
    )

    for (const { id } of headings) {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    }

    return () => observer.disconnect()
  }, [headings])

  if (headings.length < 3) return null

  return (
    <nav aria-label="Table of contents">
      <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-4">
        In this article
      </p>
      <ul className="flex flex-col gap-2">
        {headings.map(({ id, text, level }) => (
          <li key={id} className={cn(level === 3 && "pl-3")}>
            <a
              href={`#${id}`}
              className={cn(
                "block font-mono text-xs leading-relaxed transition-colors",
                activeId === id
                  ? "text-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /root/Work/flcn-website && pnpm tsc --noEmit 2>&1 | head -20
```

- [ ] **Step 3: Commit**

```bash
git add components/writing/post-toc.tsx
git commit -m "feat(writing): add PostToc sticky sidebar with IntersectionObserver active tracking"
```

---

### Task 10: `ReadingProgress` component

**Files:**
- Create: `components/writing/reading-progress.tsx`

- [ ] **Step 1: Create the component**

Create `components/writing/reading-progress.tsx`:

```typescript
"use client"

import { useEffect, useState } from "react"

export function ReadingProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    function onScroll() {
      const el = document.documentElement
      const scrolled = el.scrollTop
      const total = el.scrollHeight - el.clientHeight
      setProgress(total > 0 ? (scrolled / total) * 100 : 0)
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      className="fixed top-0 left-0 z-50 h-[2px] bg-primary transition-[width] duration-100"
      style={{ width: `${progress}%` }}
    />
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /root/Work/flcn-website && pnpm tsc --noEmit 2>&1 | head -20
```

- [ ] **Step 3: Commit**

```bash
git add components/writing/reading-progress.tsx
git commit -m "feat(writing): add ReadingProgress fixed-top scroll indicator"
```

---

### Task 11: `RelatedPosts` component

**Files:**
- Create: `components/writing/related-posts.tsx`

- [ ] **Step 1: Create the component**

Create `components/writing/related-posts.tsx`:

```typescript
import { PostRow } from "./post-row"
import { Separator } from "@/components/ui/separator"
import type { Post } from "@/lib/types"

interface RelatedPostsProps {
  posts: Post[]
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) return null

  return (
    <div className="mt-16">
      <Separator className="mb-8" />
      <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-6">
        More writing
      </p>
      <div className="grid md:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div key={post.id} className="border border-border rounded-xl overflow-hidden">
            <PostRow post={post} className="px-4 py-4 border-b-0" />
          </div>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /root/Work/flcn-website && pnpm tsc --noEmit 2>&1 | head -20
```

- [ ] **Step 3: Commit**

```bash
git add components/writing/related-posts.tsx
git commit -m "feat(writing): add RelatedPosts strip using PostRow cards"
```

---

### Task 12: Rewrite `WritingListClient` with chip filters and year sections

**Files:**
- Modify: `components/sections/writing-list-client.tsx`

- [ ] **Step 1: Rewrite the file**

Replace the entire content of `components/sections/writing-list-client.tsx` with:

```typescript
"use client"

import { useState, useCallback, useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { FeaturedCard } from "@/components/writing/featured-card"
import { PostRow } from "@/components/writing/post-row"
import { ChipFilters, type SortOption, type ReadingTime } from "@/components/writing/chip-filters"
import type { Post } from "@/lib/types"

interface WritingListClientProps {
  initialPosts: Post[]
  heroPost: Post | null
  allTags: string[]
}

async function fetchPostsRemote(search: string, singleTag: string): Promise<Post[]> {
  const qs = new URLSearchParams()
  qs.set("where[status][equals]", "published")
  qs.set("limit", "50")
  qs.set("sort", "-publishedAt")
  qs.set("depth", "1")
  if (search) {
    qs.set("where[or][0][title][contains]", search)
    qs.set("where[or][1][excerpt][contains]", search)
  }
  if (singleTag) qs.set("where[tags.tag][equals]", singleTag)

  const res = await fetch(`/api/posts?${qs.toString()}`)
  if (!res.ok) throw new Error("Failed to fetch posts")
  const data = await res.json()
  return data.docs as Post[]
}

function applyLocalFilters(
  posts: Post[],
  tags: string[],
  readingTime: ReadingTime | null,
): Post[] {
  return posts.filter((post) => {
    if (tags.length > 1) {
      const postTags = post.tags?.map((t) => t.tag) ?? []
      if (!tags.some((tag) => postTags.includes(tag))) return false
    }
    if (readingTime) {
      if (post.readingTime == null) return false
      const rt = post.readingTime
      if (readingTime === "short" && rt > 5) return false
      if (readingTime === "medium" && (rt <= 5 || rt > 15)) return false
      if (readingTime === "long" && rt <= 15) return false
    }
    return true
  })
}

function applySorting(posts: Post[], sort: SortOption): Post[] {
  const copy = [...posts]
  if (sort === "newest") copy.sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""))
  if (sort === "oldest") copy.sort((a, b) => (a.publishedAt ?? "").localeCompare(b.publishedAt ?? ""))
  if (sort === "longest") copy.sort((a, b) => (b.readingTime ?? 0) - (a.readingTime ?? 0))
  if (sort === "shortest") copy.sort((a, b) => (a.readingTime ?? 0) - (b.readingTime ?? 0))
  return copy
}

function groupByYear(posts: Post[]): Array<{ year: string; posts: Post[] }> {
  const map = new Map<string, Post[]>()
  for (const post of posts) {
    const year = post.publishedAt
      ? new Date(post.publishedAt).getFullYear().toString()
      : "Unknown"
    if (!map.has(year)) map.set(year, [])
    map.get(year)!.push(post)
  }
  // Descending year order
  return Array.from(map.entries())
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([year, posts]) => ({ year, posts }))
}

export function WritingListClient({ initialPosts, heroPost, allTags }: WritingListClientProps) {
  const [search, setSearch] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedReadingTime, setSelectedReadingTime] = useState<ReadingTime | null>(null)
  const [sort, setSort] = useState<SortOption>("newest")

  const serverTag = selectedTags.length === 1 ? selectedTags[0] : ""
  const isServerFiltering = search.length > 0 || serverTag.length > 0

  const { data: serverPosts } = useQuery({
    queryKey: ["posts", search, serverTag],
    queryFn: () => fetchPostsRemote(search, serverTag),
    enabled: isServerFiltering,
    placeholderData: initialPosts,
  })

  const rawPosts = isServerFiltering ? (serverPosts ?? initialPosts) : initialPosts
  const filtered = applyLocalFilters(rawPosts, selectedTags, selectedReadingTime)
  const sorted = applySorting(filtered, sort)

  // Exclude hero from the row list to avoid duplication
  const rowPosts = heroPost
    ? sorted.filter((p) => p.id !== heroPost.id)
    : sorted

  const isFiltering = search.length > 0 || selectedTags.length > 0 || selectedReadingTime !== null
  const grouped = useMemo(
    () => (isFiltering || sort !== "newest" ? null : groupByYear(rowPosts)),
    [rowPosts, isFiltering, sort],
  )

  const activeFilterCount =
    selectedTags.length + (selectedReadingTime ? 1 : 0) + (search ? 1 : 0)

  const toggleTag = useCallback((tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    )
  }, [])

  const clearAll = useCallback(() => {
    setSearch("")
    setSelectedTags([])
    setSelectedReadingTime(null)
    setSort("newest")
  }, [])

  return (
    <div>
      <ChipFilters
        search={search}
        allTags={allTags}
        selectedTags={selectedTags}
        selectedReadingTime={selectedReadingTime}
        sort={sort}
        activeFilterCount={activeFilterCount}
        onSearchChange={setSearch}
        onTagToggle={toggleTag}
        onReadingTimeSelect={setSelectedReadingTime}
        onSortChange={setSort}
        onClearAll={clearAll}
      />

      {/* Featured hero — only when not actively filtering */}
      {!isFiltering && heroPost && (
        <div className="mt-8">
          <FeaturedCard post={heroPost} />
        </div>
      )}

      {/* Post list */}
      <div className="mt-8">
        {rowPosts.length === 0 ? (
          <p className="font-mono text-sm text-muted-foreground">
            No articles match your filters.
          </p>
        ) : grouped ? (
          /* Year-section layout (no active filter, newest sort) */
          grouped.map(({ year, posts: yearPosts }) => (
            <div key={year} className="mb-10">
              <div className="flex items-center gap-4 mb-2">
                <span className="font-mono text-sm font-medium text-muted-foreground">
                  {year}
                </span>
                <div className="flex-1 h-px bg-border" />
              </div>
              <div>
                {yearPosts.map((post) => (
                  <PostRow key={post.id} post={post} />
                ))}
              </div>
            </div>
          ))
        ) : (
          /* Flat list when filtering or sorting differently */
          <div>
            {rowPosts.map((post) => (
              <PostRow key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /root/Work/flcn-website && pnpm tsc --noEmit 2>&1 | head -30
```

- [ ] **Step 3: Commit**

```bash
git add components/sections/writing-list-client.tsx
git commit -m "feat(writing): rewrite WritingListClient with chip filters, year sections, and sort"
```

---

### Task 13: Rewrite `WritingList` server wrapper

**Files:**
- Modify: `components/sections/writing-list.tsx`

- [ ] **Step 1: Rewrite the file**

Replace the entire content of `components/sections/writing-list.tsx` with:

```typescript
import { FadeRise } from "@/components/anim/fade-rise"
import { WritingListClient } from "./writing-list-client"
import type { Post } from "@/lib/types"

interface WritingListProps {
  posts: Post[]
  heroPost: Post | null
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

export function WritingList({ posts, heroPost }: WritingListProps) {
  const allTags = extractTags(posts)

  return (
    <section className="py-20 md:py-28">
      <FadeRise>
        <div className="pb-10 border-b border-border mb-0">
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-3">
            Writing
          </p>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight leading-tight">
            Articles & Thoughts.
          </h1>
          <p className="text-muted-foreground mt-4 max-w-2xl leading-relaxed">
            Essays on frontend engineering, system design, and the craft of building software
            that lasts.
          </p>
        </div>
        <WritingListClient initialPosts={posts} heroPost={heroPost} allTags={allTags} />
      </FadeRise>
    </section>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /root/Work/flcn-website && pnpm tsc --noEmit 2>&1 | head -20
```

- [ ] **Step 3: Commit**

```bash
git add components/sections/writing-list.tsx
git commit -m "feat(writing): update WritingList with editorial header and hero prop"
```

---

### Task 14: Rewrite `WritingPost` detail component

**Files:**
- Modify: `components/sections/writing-post.tsx`

Lexical RichText `converters` prop is used to override how individual node types are rendered. We use it to inject `id` attributes on h2/h3 nodes so TOC anchor links work.

- [ ] **Step 1: Rewrite the file**

Replace the entire content of `components/sections/writing-post.tsx` with:

```typescript
"use client";

import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { extractHeadings } from "@/lib/lexical-headings";
import { PostToc } from "@/components/writing/post-toc";
import { ReadingProgress } from "@/components/writing/reading-progress";
import { RelatedPosts } from "@/components/writing/related-posts";
import type { PostCover, Post } from "@/lib/types";

interface WritingPostProps {
  title: string;
  publishedAt?: string;
  readingTime?: number;
  tags?: Array<{ tag: string }>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body: any;
  cover?: PostCover | null;
  related?: Post[];
}

function formatDate(iso?: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

// Heading converter — injects id so TOC anchors work
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function HeadingConverter({ node, nodesToJSX, Serialize }: any) {
  const tag = node.tag as string;
  if (tag !== "h2" && tag !== "h3") {
    return nodesToJSX({ nodes: node.children });
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const text = (node.children as any[])
    .map((c: any) => (typeof c?.text === "string" ? c.text : ""))
    .join("");
  const id = slugify(text);
  const Tag = tag as "h2" | "h3";
  return (
    <Tag id={id}>
      <Serialize nodes={node.children} />
    </Tag>
  );
}

export function WritingPost({
  title,
  publishedAt,
  readingTime,
  tags,
  body,
  cover,
  related = [],
}: WritingPostProps) {
  const headings = extractHeadings(body);
  const showToc = headings.length >= 3;

  return (
    <>
      <ReadingProgress />

      <article className="py-16 md:py-24 max-w-4xl">
        {/* Back link */}
        <Link
          href="/writing"
          className="font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors mb-10 inline-block"
        >
          ← Writing
        </Link>

        {/* Cover image */}
        {cover && (
          <div className="relative aspect-[16/9] rounded-xl overflow-hidden mb-8">
            <Image
              src={cover.url}
              alt={cover.alt ?? title}
              fill
              sizes="(max-width: 1024px) 100vw, 896px"
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Meta */}
        <div className="mb-4 flex items-center gap-4 flex-wrap">
          {publishedAt && (
            <span className="font-mono text-xs text-muted-foreground">
              {formatDate(publishedAt)}
            </span>
          )}
          {readingTime && (
            <span className="font-mono text-xs text-muted-foreground">
              {readingTime} min read
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="font-sans text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight mb-4 leading-tight">
          {title}
        </h1>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-10">
            {tags.map(({ tag }) => (
              <Badge key={tag} variant="secondary" className="font-mono text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Two-column: TOC + prose */}
        <div className={showToc ? "lg:grid lg:grid-cols-[12rem_minmax(0,42rem)] lg:gap-12" : undefined}>
          {/* TOC — sticky left column on lg+ */}
          {showToc && (
            <aside className="hidden lg:block">
              <div className="sticky top-24">
                <PostToc headings={headings} />
              </div>
            </aside>
          )}

          {/* Body */}
          {body && (
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              <RichText
                data={body}
                converters={{
                  heading: HeadingConverter,
                }}
              />
            </div>
          )}
        </div>

        {/* Related posts */}
        <RelatedPosts posts={related} />
      </article>
    </>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /root/Work/flcn-website && pnpm tsc --noEmit 2>&1 | head -30
```

Note: `@payloadcms/richtext-lexical/react`'s `converters` prop types may differ from this usage. If there's a type error on the `converters` prop, cast it: `converters={{ heading: HeadingConverter as any }}` or check the installed Payload version's `RichText` API. If the `converters` API doesn't accept a `heading` key with that signature, the fallback is to skip the converter and use CSS `scroll-margin-top` on heading elements targeted by `id`, manually walking the DOM — but try the converter approach first.

- [ ] **Step 3: Commit**

```bash
git add components/sections/writing-post.tsx
git commit -m "feat(writing): redesign WritingPost with cover, TOC, progress bar, and related posts"
```

---

### Task 15: Delete obsolete files and stray directory

**Files:**
- Delete: `components/writing/bento-card.tsx`
- Delete: `components/writing/filter-panel.tsx`
- Delete: `components/writing/filter-drawer.tsx`
- Delete: `app/writing/` (empty directory)

- [ ] **Step 1: Confirm nothing else imports the deleted files**

```bash
cd /root/Work/flcn-website && grep -r "bento-card\|filter-panel\|filter-drawer" --include="*.tsx" --include="*.ts" . | grep -v node_modules
```

Expected: no results (after tasks 12–14 removed all consumers).

- [ ] **Step 2: Confirm the stray app/writing directory is truly empty**

```bash
find /root/Work/flcn-website/app/writing -type f 2>/dev/null | wc -l
```

Expected: `0`

- [ ] **Step 3: Delete the files and directory**

```bash
cd /root/Work/flcn-website && \
  rm components/writing/bento-card.tsx \
     components/writing/filter-panel.tsx \
     components/writing/filter-drawer.tsx && \
  rmdir app/writing/\[slug\] app/writing
```

- [ ] **Step 4: Verify TypeScript still compiles**

```bash
cd /root/Work/flcn-website && pnpm tsc --noEmit 2>&1 | head -20
```

- [ ] **Step 5: Run all tests**

```bash
cd /root/Work/flcn-website && pnpm vitest run 2>&1 | tail -20
```

Expected: all tests pass.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "chore(writing): remove obsolete bento-card, filter-panel, filter-drawer, and stray app/writing"
```

---

### Task 16: End-to-end verification

- [ ] **Step 1: Start the dev server**

```bash
cd /root/Work/flcn-website && pnpm dev 2>&1 &
```

Wait ~15s for the server to be ready.

- [ ] **Step 2: Check the writing index with gstack**

Use the `gstack` skill to:
- Navigate to `http://localhost:3000/writing`
- Take a screenshot at 1280px wide — confirm: editorial header, chip filter strip, hero card (if a featured+cover post exists), year sections
- Resize to 375px wide — confirm hero stacks vertically, chips wrap, rows are readable

- [ ] **Step 3: Check a detail page**

Navigate to `http://localhost:3000/writing/<any-slug>`:
- Confirm ReadingProgress bar appears at top
- Confirm cover image renders (if present)
- Confirm title, meta, tags
- Confirm TOC appears on desktop ≥lg (if ≥3 headings exist)
- Confirm related posts strip at bottom
- Scroll to bottom — verify progress bar reaches 100%

- [ ] **Step 4: Verify no regressions on other routes**

Navigate to `/`, `/work`, `/projects` — confirm they load without errors.

- [ ] **Step 5: Final build check**

```bash
cd /root/Work/flcn-website && pnpm build 2>&1 | tail -30
```

Expected: build completes without errors.
