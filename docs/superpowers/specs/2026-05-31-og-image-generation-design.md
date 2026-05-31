# OG Image Generation — Design Spec

**Date:** 2026-05-31  
**Status:** Approved

---

## Problem

`createMetadata()` in `lib/metadata.ts` only emits `openGraph.images` / `twitter.images` when an editor manually sets a cover in the CMS. Every page without a hand-set image ships with no social preview at all — even though `twitter.card` is declared `summary_large_image`. This makes shared links for `/`, `/work`, `/projects`, `/stack`, `/contact`, and any coverless post look broken on social platforms.

---

## Architecture

A single **edge-runtime route** at `GET /og` generates branded 1200×630 PNG cards on demand via `ImageResponse` from `next/og`. `createMetadata()` grows a `buildOgUrl()` helper that populates a default fallback image from the page's `title` and optional `kind` label. Hand-set CMS images continue to take precedence.

Two files change:

| File | Change |
|---|---|
| `app/og/route.tsx` | New: ImageResponse endpoint |
| `lib/metadata.ts` | Edit: default-image fallback via `buildOgUrl` |

---

## `app/og/route.tsx`

### Runtime & query params

```
GET /og?title=<encoded>&kind=<encoded>&desc=<encoded>
```

| Param | Required | Example |
|---|---|---|
| `title` | yes | `"Shipping a Syntax Highlighter"` |
| `kind` | no | `"WRITING"` / `"WORK"` / `"PROJECT"` / `"STACK"` |
| `desc` | no | Excerpt ≤160 chars (truncated at 120 in layout) |

- `runtime = "edge"` (required for `ImageResponse`).
- Returns `ImageResponse` at **1200 × 630**.
- Response headers: `Cache-Control: public, max-age=86400, s-maxage=31536000, immutable` — the image is pure function of query params so it's safe to cache forever at CDN.

### Font loading

`ImageResponse` does not inherit `next/font`. Fonts must be loaded as `ArrayBuffer`. Two strategies:

**Chosen:** Fetch at request time from a bundled `public/fonts/` directory (avoids external dependency at edge). Two fonts:
- `Inter-Regular.ttf` — body/title weight
- `Inter-SemiBold.ttf` — eyebrow/footer weight  
- `JetBrainsMono-Regular.ttf` — `kind` label

Download strategy: `fetch(new URL('/fonts/Inter-Regular.ttf', process.env.NEXT_PUBLIC_SITE_URL))` on each request. Because the response is cached edge-side, this adds negligible latency. If `NEXT_PUBLIC_SITE_URL` is unavailable at edge, fall back to the absolute production URL from `content/site.ts`.

### Card layout (dark, fixed — no theme toggle)

```
┌─────────────────────────────────────────────────────┐  630px
│                                                     │
│  ▸ WRITING                          (mono, muted)   │  top strip
│                                                     │
│                                                     │
│  Shipping a Syntax Highlighter for                  │
│  the Lexical Editor                                 │  large title
│                                                     │
│  Short excerpt text if provided…                    │  muted, smaller
│                                                     │
│─────────────────────────────────────────────────────│  1px border
│  Rishabh Kumar · thefalcon.dev      @thefalcon      │  footer
└─────────────────────────────────────────────────────┘
                                                1200px
```

Brand colors (dark theme hex equivalents):
- Background: `#0a0a0a`
- Foreground (title): `#fafafa`
- Muted (desc, footer): `#a3a3a3`
- Kind label: `#a3a3a3`
- Border line: `rgba(255,255,255,0.1)`
- `▸` glyph accent: primary green `#2ecc8e` (approximated from `oklch(0.696 0.17 162.48)`)

Title font size: 64px when `title.length < 50`, 48px when ≥50, 38px when ≥80 — prevents overflow.

Title is clamped to 3 lines maximum via `WebkitLineClamp`.

### Error handling

- Missing `title` param → 400 `text/plain` response (no image generated).
- Font fetch failure → fall through with system font (card still renders, slightly degraded).

---

## `lib/metadata.ts` changes

```ts
// new internal helper
function buildOgUrl(title: string, kind?: string, desc?: string): string {
  const params = new URLSearchParams({ title })
  if (kind) params.set('kind', kind)
  if (desc) params.set('desc', desc.slice(0, 160))
  return `${site.url}/og?${params.toString()}`
}
```

`createMetadata()` gains an optional `kind` param and uses `buildOgUrl` as the fallback:

```ts
// before:
...(image ? { images: [{ url: image }] } : {})

// after:
images: [{ url: image ?? buildOgUrl(fullTitle, kind, description) }]
```

This means:
- If a CMS image URL is passed → use it (precedence preserved).
- Otherwise → `/og?title=...&kind=...` is used automatically for all 10 callers with zero per-page changes needed.

Optionally, callers can pass `kind` to label the card (e.g. `/writing/[slug]` passes `kind: "WRITING"`). Static pages get a sensible default from their title.

---

## Per-page `kind` values

| Route | `kind` |
|---|---|
| `/` | _(none — just name/role in footer)_ |
| `/work` | `"WORK"` |
| `/work/[slug]` | `"WORK"` |
| `/projects` | `"PROJECTS"` |
| `/writing` | `"WRITING"` |
| `/writing/[slug]` | `"WRITING"` |
| `/stack` | `"STACK"` |
| `/contact` | _(none)_ |
| `/page/[slug]` | _(none)_ |
| `/legal/[slug]` | `"LEGAL"` |

Passing `kind` requires touching those callers; can be done as a follow-up if not in scope — the fallback image is valid without it.

---

## Verification

1. `npm run dev` → `GET /og?title=Hello+World&kind=WRITING` renders a valid 1200×630 PNG in browser.
2. Check page source of `/`, `/stack`, `/writing` — `og:image` and `twitter:image` metas are now populated with `/og?...` URLs.
3. A post with a CMS cover image: `og:image` uses the CMS URL, not `/og`.
4. A post without a cover image: `og:image` uses the `/og` fallback.
5. `npm run build` completes without errors (edge route + font loading).
6. `vitest` suite passes.
