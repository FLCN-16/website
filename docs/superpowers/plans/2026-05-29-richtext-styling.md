# Rich Text Styling & TOC Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Style every Payload Lexical rich text node with explicit Tailwind utility classes, move the TOC to the right of post body, and enable smooth scroll on TOC anchor links.

**Architecture:** A single shared `richTextConverters` function (matching `JSXConvertersFunction`) replaces bare default converters in all three `<RichText>` render sites. The smooth scroll is a one-line CSS addition. The TOC layout flip is a grid column/order change in `writing-post.tsx`.

**Tech Stack:** React 19, Next.js 15, `@payloadcms/richtext-lexical/react`, Tailwind CSS v4, Vitest

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `components/writing/richtext-converters.tsx` | **Create** | All JSX converters for every Lexical node type |
| `components/sections/writing-post.tsx` | **Modify** | Use shared converters; TOC on right; remove dead `prose` wrapper and inline `headingConverter` |
| `app/(site)/page/[slug]/page.tsx` | **Modify** | Use shared converters; remove dead `prose` wrapper |
| `app/(site)/legal/[slug]/page.tsx` | **Modify** | Use shared converters; remove dead `prose` wrapper |
| `app/globals.css` | **Modify** | Add `scroll-behavior: smooth` to `html` |

---

## Task 1: Smooth scroll

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Add `scroll-behavior: smooth` to the `html` rule**

Open `app/globals.css`. Inside the `@layer base` block, the `html` rule does not yet exist — add it:

```css
@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
  button:not(:disabled), [role="button"]:not(:disabled) {
    cursor: pointer;
  }
  html {
    @apply font-sans;
    scroll-behavior: smooth;
  }
}
```

- [ ] **Step 2: Verify lint passes**

```bash
pnpm run lint
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add app/globals.css
git commit -m "feat: enable smooth scroll for TOC anchor navigation"
```

---

## Task 2: Create shared rich text converters

**Files:**
- Create: `components/writing/richtext-converters.tsx`

- [ ] **Step 1: Create the file with all node converters**

```tsx
import { NodeFormat } from "@payloadcms/richtext-lexical"
import type { JSXConvertersFunction } from "@payloadcms/richtext-lexical/react"

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function headingText(node: any): string {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (node.children as any[])
    .map((c: any) => (typeof c?.text === "string" ? c.text : ""))
    .join("")
}

const HEADING_CLASSES: Record<string, string> = {
  h1: "text-3xl font-semibold tracking-tight mt-12 mb-5 scroll-mt-24",
  h2: "text-2xl font-semibold tracking-tight mt-10 mb-4 scroll-mt-24",
  h3: "text-xl font-semibold tracking-tight mt-8 mb-3 scroll-mt-24",
  h4: "text-lg font-semibold tracking-tight mt-6 mb-2 scroll-mt-24",
  h5: "text-base font-semibold tracking-tight mt-4 mb-2 scroll-mt-24",
  h6: "text-sm font-semibold tracking-tight mt-4 mb-2 scroll-mt-24",
}

export const richTextConverters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  heading: ({ node, nodesToJSX }: any) => {
    const tag = node.tag as "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
    const children = nodesToJSX({ nodes: node.children })
    const id =
      tag === "h2" || tag === "h3"
        ? slugify(headingText(node)) || undefined
        : undefined
    const Tag = tag
    return (
      <Tag id={id} className={HEADING_CLASSES[tag]}>
        {children}
      </Tag>
    )
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  paragraph: ({ node, nodesToJSX }: any) => {
    const children = nodesToJSX({ nodes: node.children })
    if (!children?.length) return <p><br /></p>
    return <p className="text-base leading-relaxed mb-5">{children}</p>
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  list: ({ node, nodesToJSX }: any) => {
    const children = nodesToJSX({ nodes: node.children })
    if (node.tag === "ol") {
      return <ol className="list-decimal ml-6 mb-5 space-y-1.5">{children}</ol>
    }
    return <ul className="list-disc ml-6 mb-5 space-y-1.5">{children}</ul>
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  listitem: ({ node, nodesToJSX }: any) => {
    const children = nodesToJSX({ nodes: node.children })
    return <li className="leading-relaxed">{children}</li>
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  quote: ({ node, nodesToJSX }: any) => {
    const children = nodesToJSX({ nodes: node.children })
    return (
      <blockquote className="border-l-4 border-primary/40 pl-4 italic text-muted-foreground my-6">
        {children}
      </blockquote>
    )
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  link: ({ node, nodesToJSX }: any) => {
    const children = nodesToJSX({ nodes: node.children })
    const rel = node.fields.newTab ? "noopener noreferrer" : undefined
    const target = node.fields.newTab ? "_blank" : undefined
    let href: string = node.fields.url ?? "#"
    if (node.fields.linkType === "internal") {
      const slug = node.fields.doc?.value?.slug
      href = slug ? `/${slug}` : "#"
    }
    return (
      <a
        href={href}
        rel={rel}
        target={target}
        className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors"
      >
        {children}
      </a>
    )
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  autolink: ({ node, nodesToJSX }: any) => {
    const children = nodesToJSX({ nodes: node.children })
    const rel = node.fields.newTab ? "noopener noreferrer" : undefined
    const target = node.fields.newTab ? "_blank" : undefined
    return (
      <a
        href={node.fields.url as string}
        rel={rel}
        target={target}
        className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors"
      >
        {children}
      </a>
    )
  },

  horizontalrule: <hr className="border-t border-border my-8" />,

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  text: ({ node }: any) => {
    let text: React.ReactNode = node.text as string
    if (node.format & NodeFormat.IS_BOLD) text = <strong>{text}</strong>
    if (node.format & NodeFormat.IS_ITALIC) text = <em>{text}</em>
    if (node.format & NodeFormat.IS_STRIKETHROUGH)
      text = <span style={{ textDecoration: "line-through" }}>{text}</span>
    if (node.format & NodeFormat.IS_UNDERLINE)
      text = <span style={{ textDecoration: "underline" }}>{text}</span>
    if (node.format & NodeFormat.IS_CODE)
      text = (
        <code className="font-mono text-sm bg-muted px-1.5 py-0.5 rounded text-foreground">
          {text}
        </code>
      )
    if (node.format & NodeFormat.IS_SUBSCRIPT) text = <sub>{text}</sub>
    if (node.format & NodeFormat.IS_SUPERSCRIPT) text = <sup>{text}</sup>
    return text
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  upload: ({ node }: any) => {
    if (typeof node.value !== "object") return null
    const doc = node.value as {
      url: string
      filename: string
      mimeType: string
      width?: number
      height?: number
      alt?: string
    }
    const alt: string = node.fields?.alt || doc?.alt || ""
    const { url } = doc

    if (!doc.mimeType?.startsWith("image")) {
      return (
        <a
          href={url}
          rel="noopener noreferrer"
          className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors"
        >
          {doc.filename}
        </a>
      )
    }

    return (
      <figure className="my-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={url}
          alt={alt}
          width={doc.width}
          height={doc.height}
          className="rounded-lg w-full h-auto"
        />
        {alt && (
          <figcaption className="mt-2 text-center text-sm text-muted-foreground font-mono">
            {alt}
          </figcaption>
        )}
      </figure>
    )
  },
})
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
pnpm exec tsc --noEmit
```

Expected: no errors related to `richtext-converters.tsx`.

- [ ] **Step 3: Commit**

```bash
git add components/writing/richtext-converters.tsx
git commit -m "feat: add custom Tailwind-styled Lexical rich text converters"
```

---

## Task 3: Update `writing-post.tsx` — converters + TOC on right

**Files:**
- Modify: `components/sections/writing-post.tsx`

The file currently:
- Has an inline `headingConverter` function (lines 147–157) — delete it
- Has a `converters` prop using that function — replace with `richTextConverters`
- Has `prose prose-neutral dark:prose-invert max-w-none` on the body wrapper div — remove
- Has a two-column grid with TOC on left: `lg:grid-cols-[12rem_minmax(0,42rem)]`, `<aside>` before body — flip both

- [ ] **Step 1: Replace the full file content**

```tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { richTextConverters } from "@/components/writing/richtext-converters";
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

const EMPTY_RELATED: Post[] = [];

function formatDate(iso?: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function WritingPost({
  title,
  publishedAt,
  readingTime,
  tags,
  body,
  cover,
  related = EMPTY_RELATED,
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

        {/* Body + TOC: body left, TOC sticky right on lg+ */}
        <div
          className={
            showToc
              ? "lg:grid lg:grid-cols-[minmax(0,1fr)_14rem] lg:gap-12"
              : undefined
          }
        >
          {/* Body */}
          {body && (
            <div>
              <RichText data={body} converters={richTextConverters} />
            </div>
          )}

          {/* TOC — sticky right column on lg+ */}
          {showToc && (
            <aside className="hidden lg:block">
              <div className="sticky top-24">
                <PostToc headings={headings} />
              </div>
            </aside>
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
pnpm exec tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/sections/writing-post.tsx
git commit -m "feat: use richTextConverters in writing post; move TOC to right"
```

---

## Task 4: Update `page/[slug]/page.tsx`

**Files:**
- Modify: `app/(site)/page/[slug]/page.tsx`

- [ ] **Step 1: Replace the `<RichText>` block**

Find this block (lines 68–70):

```tsx
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <RichText data={page.body as Parameters<typeof RichText>[0]['data']} />
        </div>
```

Replace with:

```tsx
        <RichText
          data={page.body as Parameters<typeof RichText>[0]['data']}
          converters={richTextConverters}
        />
```

- [ ] **Step 2: Add import at top of file** (after the existing imports):

```tsx
import { richTextConverters } from '@/components/writing/richtext-converters'
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
pnpm exec tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add app/(site)/page/\[slug\]/page.tsx
git commit -m "feat: apply richTextConverters to basic pages"
```

---

## Task 5: Update `legal/[slug]/page.tsx`

**Files:**
- Modify: `app/(site)/legal/[slug]/page.tsx`

- [ ] **Step 1: Replace the `<RichText>` block**

Find this block (lines 84–86):

```tsx
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <RichText data={page.body as Parameters<typeof RichText>[0]['data']} />
        </div>
```

Replace with:

```tsx
        <RichText
          data={page.body as Parameters<typeof RichText>[0]['data']}
          converters={richTextConverters}
        />
```

- [ ] **Step 2: Add import at top of file** (after existing imports):

```tsx
import { richTextConverters } from '@/components/writing/richtext-converters'
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
pnpm exec tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add app/(site)/legal/\[slug\]/page.tsx
git commit -m "feat: apply richTextConverters to legal pages"
```

---

## Task 6: Final build verification

- [ ] **Step 1: Run full Next.js build**

```bash
pnpm run build
```

Expected: build completes successfully with no TypeScript errors. Ignore any pre-existing warnings unrelated to the changed files.

- [ ] **Step 2: Run lint**

```bash
pnpm run lint
```

Expected: no errors.
