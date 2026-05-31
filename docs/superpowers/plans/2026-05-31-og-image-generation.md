# OG Image Generation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Every page on thefalcon.dev automatically gets a branded 1200×630 Open Graph image for social sharing, with CMS-set cover images taking precedence over the dynamic fallback.

**Architecture:** A single Node.js API route `app/og/route.tsx` uses `ImageResponse` from `next/og` to render dark-themed branded cards from query params (`title`, `kind`, `desc`). `buildOgUrl()` is added to `lib/metadata.ts` and wired as the default `images` in `createMetadata()`, so all 10 page callers gain OG images with no per-page changes required. Passing `kind` is a labelling enhancement (separate task). Fonts are WOFF files bundled in `public/fonts/` and read via `fs/promises`.

**Tech Stack:** `next/og` (ImageResponse, Node.js runtime), WOFF fonts via `fs/promises`, vitest for unit tests.

---

## File Structure

| File | Status | Responsibility |
|---|---|---|
| `public/fonts/Inter-Regular.woff` | Create (download) | Inter 400 font binary |
| `public/fonts/Inter-SemiBold.woff` | Create (download) | Inter 600 font binary |
| `public/fonts/JetBrainsMono-Regular.woff` | Create (download) | JetBrains Mono 400 font binary |
| `lib/__tests__/og-url.test.ts` | Create | Unit tests for `buildOgUrl` + `createMetadata` image fallback |
| `lib/metadata.ts` | Modify | Export `buildOgUrl()`, add `kind?` param, default-image fallback |
| `app/og/route.tsx` | Create | ImageResponse endpoint — renders OG card from query params |
| `app/(site)/writing/[slug]/page.tsx` | Modify | Pass `kind: 'WRITING'` |
| `app/(site)/writing/page.tsx` | Modify | Pass `kind: 'WRITING'` |
| `app/(site)/work/page.tsx` | Modify | Pass `kind: 'WORK'` |
| `app/(site)/work/[slug]/page.tsx` | Modify | Pass `kind: 'WORK'` |
| `app/(site)/projects/page.tsx` | Modify | Pass `kind: 'PROJECTS'` |
| `app/(site)/stack/page.tsx` | Modify | Pass `kind: 'STACK'` |
| `app/(site)/legal/[slug]/page.tsx` | Modify | Pass `kind: 'LEGAL'` |

---

### Task 1: Download font files

**Files:**
- Create: `public/fonts/Inter-Regular.woff`
- Create: `public/fonts/Inter-SemiBold.woff`
- Create: `public/fonts/JetBrainsMono-Regular.woff`

Satori (the rendering engine behind `next/og`) supports TTF, OTF, and WOFF — not WOFF2. These fonts are served from jsDelivr at pinned versions.

- [ ] **Step 1: Download fonts**

```bash
mkdir -p public/fonts
curl -sL "https://cdn.jsdelivr.net/npm/@fontsource/inter@4.5.15/files/inter-latin-400-normal.woff" \
  -o public/fonts/Inter-Regular.woff
curl -sL "https://cdn.jsdelivr.net/npm/@fontsource/inter@4.5.15/files/inter-latin-600-normal.woff" \
  -o public/fonts/Inter-SemiBold.woff
curl -sL "https://cdn.jsdelivr.net/npm/@fontsource/jetbrains-mono@4.5.18/files/jetbrains-mono-latin-400-normal.woff" \
  -o public/fonts/JetBrainsMono-Regular.woff
```

- [ ] **Step 2: Verify files are non-empty**

```bash
ls -lh public/fonts/*.woff
```

Expected: three files, each 30–200 KB. If any file is smaller than 1 KB, the download failed — retry that curl command.

- [ ] **Step 3: Commit fonts**

```bash
git add public/fonts/
git commit -m "chore: add Inter and JetBrains Mono WOFF fonts for OG image generation"
```

---

### Task 2: Write failing tests for `buildOgUrl`

**Files:**
- Create: `lib/__tests__/og-url.test.ts`

- [ ] **Step 1: Create `lib/__tests__/og-url.test.ts`**

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'

// These tests fail until lib/metadata.ts exports buildOgUrl
// and createMetadata defaults to it when no image is passed.

describe('buildOgUrl', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  it('returns a URL pointing to /og with a title param', async () => {
    const { buildOgUrl } = await import('../metadata')
    const url = buildOgUrl('Hello World')
    expect(url).toMatch(/\/og\?/)
    expect(url).toContain('title=Hello+World')
  })

  it('includes kind when provided', async () => {
    const { buildOgUrl } = await import('../metadata')
    const url = buildOgUrl('My Post', 'WRITING')
    expect(url).toContain('kind=WRITING')
  })

  it('omits kind when not provided', async () => {
    const { buildOgUrl } = await import('../metadata')
    const url = buildOgUrl('My Post')
    expect(url).not.toContain('kind=')
  })

  it('truncates desc to 160 characters', async () => {
    const { buildOgUrl } = await import('../metadata')
    const long = 'A'.repeat(200)
    const url = buildOgUrl('Title', undefined, long)
    const desc = new URL(url).searchParams.get('desc')!
    expect(desc.length).toBe(160)
  })

  it('omits desc when not provided', async () => {
    const { buildOgUrl } = await import('../metadata')
    const url = buildOgUrl('Title')
    expect(url).not.toContain('desc=')
  })
})

describe('createMetadata — image fallback', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  it('sets og:image to a /og URL when no image is passed', async () => {
    const { createMetadata } = await import('../metadata')
    const meta = createMetadata({ title: 'Stack' })
    const images = (meta.openGraph as Record<string, unknown>)?.images as { url: string }[]
    expect(Array.isArray(images)).toBe(true)
    expect(images[0].url).toContain('/og?')
    expect(images[0].url).toContain('title=')
  })

  it('uses the provided image when passed, ignoring /og fallback', async () => {
    const { createMetadata } = await import('../metadata')
    const meta = createMetadata({ title: 'Post', image: 'https://cdn.example.com/cover.jpg' })
    const images = (meta.openGraph as Record<string, unknown>)?.images as { url: string }[]
    expect(images[0].url).toBe('https://cdn.example.com/cover.jpg')
  })
})
```

- [ ] **Step 2: Run the tests — confirm they fail**

```bash
pnpm test -- lib/__tests__/og-url.test.ts
```

Expected: FAIL — `buildOgUrl is not a function` (not yet exported).

---

### Task 3: Update `lib/metadata.ts`

**Files:**
- Modify: `lib/metadata.ts`

- [ ] **Step 1: Replace the contents of `lib/metadata.ts`**

```typescript
import type { Metadata } from "next"
import { site } from "@/content/site"

export function buildOgUrl(title: string, kind?: string, desc?: string): string {
  const params = new URLSearchParams({ title })
  if (kind) params.set('kind', kind)
  if (desc) params.set('desc', desc.slice(0, 160))
  return `${site.url}/og?${params.toString()}`
}

export function createMetadata({
  title,
  description,
  image,
  path,
  absolute = false,
  kind,
}: {
  title: string
  description?: string
  image?: string
  path?: string
  absolute?: boolean
  kind?: string
}): Metadata {
  const fullTitle = `${title} — ${site.name}`
  const resolvedTitle = absolute ? ({ absolute: title } as Metadata["title"]) : title
  const ogImage = image ?? buildOgUrl(title, kind, description)

  return {
    metadataBase: new URL(site.url),
    title: resolvedTitle,
    description,
    authors: [{ name: site.name, url: site.url }],
    creator: site.name,
    ...(path ? { alternates: { canonical: `${site.url}${path}` } } : {}),
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: site.name,
      title: fullTitle,
      description,
      images: [{ url: ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      creator: `@${site.handle}`,
      title: fullTitle,
      description,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}
```

- [ ] **Step 2: Run the tests — confirm they pass**

```bash
pnpm test -- lib/__tests__/og-url.test.ts
```

Expected: all 7 tests PASS.

- [ ] **Step 3: Confirm the full test suite still passes**

```bash
pnpm test
```

Expected: all existing tests plus the 7 new ones pass.

- [ ] **Step 4: Commit**

```bash
git add lib/metadata.ts lib/__tests__/og-url.test.ts
git commit -m "feat: add buildOgUrl helper and automatic OG image fallback in createMetadata"
```

---

### Task 4: Create the OG image route

**Files:**
- Create: `app/og/route.tsx`

`loadFont` reads WOFF files from `public/fonts/` via `fs/promises`. This uses the Node.js runtime (default for App Router API routes — no `runtime` export needed). `process.cwd()` at runtime is the project root.

- [ ] **Step 1: Create `app/og/route.tsx`**

```tsx
import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'
import { readFile } from 'fs/promises'
import path from 'path'
import { site } from '@/content/site'

export const dynamic = 'force-dynamic'

async function loadFont(filename: string): Promise<ArrayBuffer> {
  const fontPath = path.join(process.cwd(), 'public', 'fonts', filename)
  const buf = await readFile(fontPath)
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer
}

function titleFontSize(title: string): number {
  if (title.length < 50) return 64
  if (title.length < 80) return 48
  return 38
}

export async function GET(req: NextRequest): Promise<Response> {
  const { searchParams } = req.nextUrl
  const title = searchParams.get('title')
  const kind = searchParams.get('kind') ?? ''
  const desc = searchParams.get('desc') ?? ''

  if (!title) {
    return new Response('title param is required', { status: 400 })
  }

  const [interRegular, interSemiBold, jetbrainsMono] = await Promise.all([
    loadFont('Inter-Regular.woff'),
    loadFont('Inter-SemiBold.woff'),
    loadFont('JetBrainsMono-Regular.woff'),
  ])

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#0a0a0a',
          padding: '60px 72px',
        }}
      >
        {/* Kind label */}
        {kind ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '40px' }}>
            <span style={{ color: '#2ecc8e', fontSize: '14px', fontFamily: '"JetBrains Mono"' }}>▸</span>
            <span
              style={{
                color: '#a3a3a3',
                fontSize: '13px',
                fontFamily: '"JetBrains Mono"',
                letterSpacing: '0.15em',
              }}
            >
              {kind}
            </span>
          </div>
        ) : (
          <div style={{ marginBottom: '40px', height: '21px', display: 'flex' }} />
        )}

        {/* Title + description */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div
            style={{
              color: '#fafafa',
              fontSize: `${titleFontSize(title)}px`,
              fontWeight: 600,
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
              fontFamily: '"Inter"',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {title}
          </div>

          {desc ? (
            <div
              style={{
                color: '#737373',
                fontSize: '20px',
                marginTop: '24px',
                lineHeight: 1.5,
                fontFamily: '"Inter"',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {desc}
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            paddingTop: '28px',
            marginTop: '32px',
          }}
        >
          <div style={{ color: '#a3a3a3', fontSize: '16px', fontFamily: '"Inter"' }}>
            {site.name} · {site.url.replace('https://', '')}
          </div>
          <div style={{ color: '#525252', fontSize: '14px', fontFamily: '"JetBrains Mono"' }}>
            @{site.handle}
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'Inter', data: interRegular, weight: 400, style: 'normal' },
        { name: 'Inter', data: interSemiBold, weight: 600, style: 'normal' },
        { name: 'JetBrains Mono', data: jetbrainsMono, weight: 400, style: 'normal' },
      ],
      headers: {
        'Cache-Control': 'public, max-age=86400, s-maxage=31536000, immutable',
      },
    }
  )
}
```

- [ ] **Step 2: Start dev server and verify the route renders**

```bash
pnpm dev
```

Open in a browser:
```
http://localhost:3000/og?title=Hello+World&kind=WRITING
```

Expected: 1200×630 dark image with "▸ WRITING" mono label, large white "Hello World" title, footer with "Rishabh Kumar · thefalcon.dev" and "@thefalcon".

- [ ] **Step 3: Test with long title and description**

```
http://localhost:3000/og?title=Leading+Full-Stack+Engineering+Teams+Across+the+Entire+Product+Lifecycle&kind=WORK&desc=9+years+shipping+production+systems+across+web+mobile+and+browser+extensions
```

Expected: title at 48px, wraps to 2–3 lines cleanly, description in muted gray below.

- [ ] **Step 4: Test 400 on missing title**

```bash
curl -si "http://localhost:3000/og" | head -3
```

Expected: `HTTP/1.1 400 Bad Request`

- [ ] **Step 5: Commit**

```bash
git add app/og/route.tsx
git commit -m "feat: add /og dynamic OG image route (1200x630, dark-themed, branded)"
```

---

### Task 5: Wire `kind` into page-level callers

**Files:**
- Modify: `app/(site)/writing/[slug]/page.tsx`
- Modify: `app/(site)/writing/page.tsx`
- Modify: `app/(site)/work/page.tsx`
- Modify: `app/(site)/work/[slug]/page.tsx`
- Modify: `app/(site)/projects/page.tsx`
- Modify: `app/(site)/stack/page.tsx`
- Modify: `app/(site)/legal/[slug]/page.tsx`

Each change is a one-line `kind` addition inside the existing `createMetadata({...})` call.

- [ ] **Step 1: `app/(site)/writing/[slug]/page.tsx`**

Find the `createMetadata({` call inside `generateMetadata` and add `kind: 'WRITING'`:

```typescript
    return createMetadata({
      title: post.meta?.title || post.title,
      description: (post.meta?.description || post.excerpt) ?? undefined,
      image: typeof post.meta?.image === 'object' ? post.meta?.image?.url ?? undefined : undefined,
      path: `/writing/${slug}`,
      kind: 'WRITING',
    })
```

- [ ] **Step 2: `app/(site)/writing/page.tsx`**

```typescript
export const metadata = createMetadata({
  title: 'Writing',
  description: 'Articles and thoughts on frontend engineering, architecture, and building at scale.',
  path: '/writing',
  kind: 'WRITING',
})
```

- [ ] **Step 3: `app/(site)/work/page.tsx`**

```typescript
export const metadata = createMetadata({
  title: 'Work',
  description: 'Selected projects from 9+ years of full-stack engineering.',
  path: '/work',
  kind: 'WORK',
})
```

- [ ] **Step 4: `app/(site)/work/[slug]/page.tsx`**

Find `createMetadata({` inside `generateMetadata` and add `kind: 'WORK'`:

```typescript
    return createMetadata({
      title: project.meta?.title ?? project.title,
      description: project.meta?.description ?? project.description ?? undefined,
      image: typeof project.meta?.image === 'object' ? project.meta?.image?.url ?? undefined : undefined,
      path: `/work/${slug}`,
      kind: 'WORK',
    })
```

- [ ] **Step 5: `app/(site)/projects/page.tsx`**

```typescript
export const metadata = createMetadata({
  title: 'Projects',
  description: 'Side projects, Chrome extensions, mobile apps, and open-source contributions.',
  path: '/projects',
  kind: 'PROJECTS',
})
```

- [ ] **Step 6: `app/(site)/stack/page.tsx`**

```typescript
export const metadata = createMetadata({
  title: "Stack",
  description: stack.intro,
  path: '/stack',
  kind: 'STACK',
})
```

- [ ] **Step 7: `app/(site)/legal/[slug]/page.tsx`**

Find the `createMetadata({` call inside `generateMetadata` and add `kind: 'LEGAL'`. Exact call shape will vary — add `kind: 'LEGAL'` as a new property.

- [ ] **Step 8: Commit**

```bash
git add \
  "app/(site)/writing/[slug]/page.tsx" \
  "app/(site)/writing/page.tsx" \
  "app/(site)/work/page.tsx" \
  "app/(site)/work/[slug]/page.tsx" \
  "app/(site)/projects/page.tsx" \
  "app/(site)/stack/page.tsx" \
  "app/(site)/legal/[slug]/page.tsx"
git commit -m "feat: pass kind label to createMetadata for typed OG image cards"
```

---

### Task 6: Full verification

- [ ] **Step 1: Run the full test suite**

```bash
pnpm test
```

Expected: all tests pass (7 new ones + all existing).

- [ ] **Step 2: Check og:image meta on a static page**

With dev server running:

```bash
curl -s "http://localhost:3000/stack" | grep -E 'og:image|twitter:image'
```

Expected (something like):
```html
<meta property="og:image" content="https://thefalcon.dev/og?title=Stack&amp;kind=STACK"/>
<meta name="twitter:image" content="https://thefalcon.dev/og?title=Stack&amp;kind=STACK"/>
```

- [ ] **Step 3: Confirm CMS image precedence on a work entry**

```bash
# Replace <slug> with any published work entry that has a cover image set in CMS
curl -s "http://localhost:3000/work/<slug>" | grep 'og:image'
```

Expected: the `content` attribute is the R2/CDN URL (e.g. `media.thefalcon.dev/...`), NOT an `/og?` URL.

- [ ] **Step 4: Confirm /og fallback for a work entry without a CMS image**

```bash
curl -s "http://localhost:3000/work/<slug-without-cover>" | grep 'og:image'
```

Expected: `content` contains `/og?title=...&kind=WORK`.

- [ ] **Step 5: Build check**

```bash
pnpm build
```

Expected: clean build, no TypeScript errors.
