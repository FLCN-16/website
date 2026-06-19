# Hero Header Visual Impact — Design Spec

**Date:** 2026-06-19
**Status:** Approved

## Goal

Increase the visual impact of the homepage hero section through two complementary treatments: a dot-matrix background pattern and typographic accent coloring on key headline words.

## Scope

Single file change: `src/components/sections/hero.tsx`
No new dependencies. No CMS schema changes.

---

## 1. Dot Grid Background

### Implementation

The hero `<section>` gains `relative overflow-hidden`. An absolutely-positioned `<div>` is inserted as the first child, behind all content:

```
position: absolute, inset-0, pointer-events-none, z-0
background-image: radial-gradient(circle, hsl(var(--foreground) / 0.08) 1px, transparent 1px)
background-size: 28px 28px
mask-image: linear-gradient(to bottom, black 0%, black 40%, transparent 100%)
-webkit-mask-image: (same)
```

### Behavior

- Dots: 1px diameter, 28px grid spacing, 8% foreground opacity
- The mask fades dots to fully transparent before the stats strip so the bottom of the section stays clean
- `pointer-events-none` ensures the overlay never intercepts clicks
- All existing content sits above the dot layer via `relative z-10` on the content wrapper

---

## 2. Headline Accent Word Parsing

### Parser

A pure helper `parseAccentLine(text: string)` splits a string on `**...**` tokens:

```
"I build **fast**, **reliable** software"
→ [
    { text: "I build ", accent: false },
    { text: "fast", accent: true },
    { text: ", ", accent: false },
    { text: "reliable", accent: true },
    { text: " software", accent: false },
  ]
```

Returns `Array<{ text: string; accent: boolean }>`.

### Rendering

Inside `MaskReveal`, each headline line is processed through `parseAccentLine`. Segments render inline:
- `accent: true` → `<span className="text-primary">`
- `accent: false` → plain text node

The existing `mask-line` wrapper and slide-up GSAP entrance animation are unaffected — they still wrap the full line.

### CMS Usage

No schema change required. To accent words, update the headline text in Payload CMS to wrap target words in `**double asterisks**`. Example:

```
I build **scalable**,
**high-performance** software
that ships.
```

---

## 3. Typography Upgrade

Two class changes on the headline `<h1>`:

| Before | After |
|--------|-------|
| `font-semibold` | `font-bold` |
| `tracking-tight` | `tracking-tighter` |

Size scale, `text-balance`, and `leading-[1.1]` are unchanged.

---

## Architecture

All changes are self-contained in `hero.tsx`. No new components, no new files, no dependency additions.

```
hero.tsx
├── parseAccentLine()        ← new pure helper (top of file)
├── dot grid <div>           ← new absolute element inside <section>
├── <section> className      ← add relative overflow-hidden
├── content wrapper          ← add relative z-10
└── <h1> className           ← font-bold + tracking-tighter
```

---

## Non-Goals

- No avatar, photo, or right-side visual element
- No canvas or animated dot grid
- No CMS schema changes
- No new npm dependencies
