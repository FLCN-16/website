# Rich Text Styling & TOC Layout — Design Spec

**Date:** 2026-05-29
**Branch:** fix/server-action-manifest-registration

---

## Problem

`@tailwindcss/typography` is not installed, so the `prose prose-neutral dark:prose-invert` wrapper classes applied around every `<RichText>` render have no effect. The Payload Lexical default converters emit bare `<h2>`, `<p>`, `<ul>` etc. with zero styling, making post bodies look visually flat and undifferentiated.

Additionally:
- The Table of Contents (TOC) sits on the **left** of the post body but should be on the **right**.
- TOC anchor clicks do not smooth-scroll.

---

## Approach

**Custom Tailwind converters** — a shared JSX converter file that overrides every Lexical node type with explicit Tailwind utility classes drawn from the site's existing design tokens. No new dependencies.

Rejected alternative: `@tailwindcss/typography` — opinionated defaults that conflict with the site's dark mode OKLCH color tokens and custom font variables.

---

## Architecture

### 1. New file: `components/writing/richtext-converters.tsx`

A single exported `richTextConverters` function matching the `JSXConvertersFunction` signature from `@payloadcms/richtext-lexical/react`. It spreads `defaultConverters` and overrides each node type.

**Converter map:**

| Node type | Tag | Tailwind classes |
|---|---|---|
| `h1` | `<h1>` | `text-3xl font-semibold tracking-tight mt-12 mb-5 scroll-mt-24` |
| `h2` | `<h2>` | `text-2xl font-semibold tracking-tight mt-10 mb-4 scroll-mt-24` + anchor `id` |
| `h3` | `<h3>` | `text-xl font-semibold tracking-tight mt-8 mb-3 scroll-mt-24` + anchor `id` |
| `h4` | `<h4>` | `text-lg font-semibold tracking-tight mt-6 mb-2 scroll-mt-24` |
| `h5` | `<h5>` | `text-base font-semibold tracking-tight mt-4 mb-2 scroll-mt-24` |
| `h6` | `<h6>` | `text-sm font-semibold tracking-tight mt-4 mb-2 scroll-mt-24` |
| `paragraph` | `<p>` | `text-base leading-relaxed mb-5 text-foreground` |
| `ul` | `<ul>` | `list-disc ml-6 mb-5 space-y-1.5` |
| `ol` | `<ol>` | `list-decimal ml-6 mb-5 space-y-1.5` |
| `listitem` | `<li>` | `leading-relaxed` |
| `quote` | `<blockquote>` | `border-l-4 border-primary/40 pl-4 italic text-muted-foreground my-6` |
| `link` / `autolink` | `<a>` | `text-primary underline underline-offset-2 hover:text-primary/80 transition-colors` |
| `horizontalrule` | `<hr>` | `border-t border-border my-8` |
| inline `code` (text node) | `<code>` | `font-mono text-sm bg-muted px-1.5 py-0.5 rounded text-foreground` |
| `upload` (image) | `<img>` / `<picture>` | `rounded-lg my-6 w-full h-auto` + optional caption |
| `upload` (non-image) | `<a>` | `text-primary underline underline-offset-2` |

Notes:
- `scroll-mt-24` on headings offsets the sticky nav bar so TOC anchors land correctly.
- The existing `headingConverter` (slug-id injection) in `writing-post.tsx` is folded into this shared converter — h2 and h3 get anchor IDs; h4–h6 do not (not shown in TOC).
- The `text` converter is overridden only to style inline `<code>` marks; bold/italic/underline/strikethrough keep their default browser semantics via `<strong>`/`<em>`/`<span>`.
- The `link` converter is a factory (`LinkJSXConverter` takes `internalDocToHref`); the custom converter handles internal links with a fallback `href="#"`.

### 2. Update `<RichText>` usages (3 files)

| File | Change |
|---|---|
| `components/sections/writing-post.tsx` | Replace inline `headingConverter` + `converters` prop with `richTextConverters`. Remove dead `prose` wrapper div. |
| `app/(site)/page/[slug]/page.tsx` | Add `converters={richTextConverters}` to `<RichText>`. Remove dead `prose` wrapper div. |
| `app/(site)/legal/[slug]/page.tsx` | Add `converters={richTextConverters}` to `<RichText>`. Remove dead `prose` wrapper div. |

### 3. TOC position: left → right

In `components/sections/writing-post.tsx`:

- Grid columns: `lg:grid-cols-[12rem_minmax(0,42rem)]` → `lg:grid-cols-[minmax(0,1fr)_14rem]`
- Move `<aside>` **after** the body `<div>` in JSX so DOM order matches visual order (body first, TOC second).
- Keep `sticky top-24` and `hidden lg:block` on the aside.

### 4. Smooth scroll

Add `scroll-behavior: smooth` to the `html` selector in `app/globals.css` inside the `@layer base` block. This covers TOC anchor clicks and any other in-page navigation globally.

---

## Files Changed

```
components/writing/richtext-converters.tsx   (new)
components/sections/writing-post.tsx         (modified)
app/(site)/page/[slug]/page.tsx              (modified)
app/(site)/legal/[slug]/page.tsx             (modified)
app/globals.css                              (modified)
```

---

## Out of Scope

- Code block (`pre`/`code` block nodes) — Payload's default code block renderer is kept; syntax highlighting is a separate concern.
- Table nodes — not currently used in content; `TableJSXConverter` default is kept.
- Check-list items — kept as default; no current content uses them.
- Installing `@tailwindcss/typography` — explicitly rejected.
