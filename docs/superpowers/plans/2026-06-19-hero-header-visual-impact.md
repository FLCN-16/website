# Hero Header Visual Impact Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a dot-matrix background, primary-color accent words in the headline, and bolder typography to the homepage hero section.

**Architecture:** All changes are self-contained in `src/components/sections/hero.tsx`. A pure `parseAccentLine` helper splits headline strings on `**...**` tokens; the dot grid is an absolutely-positioned CSS element; typography classes are updated in-place.

**Tech Stack:** React, Tailwind CSS, GSAP (via existing `MaskReveal`), Vitest

## Global Constraints

- No new npm dependencies
- No CMS schema changes
- `revalidate: false` is already set on the homepage route — no cache config changes needed
- All existing animations (`MaskReveal`, `FadeRise`, `CountUp`) must continue to work unchanged
- Tailwind utility classes only — no custom CSS files

---

### Task 1: `parseAccentLine` helper + unit tests

**Files:**
- Modify: `src/components/sections/hero.tsx` — add and export `parseAccentLine`
- Create: `src/components/sections/__tests__/hero.test.ts`

**Interfaces:**
- Produces: `parseAccentLine(text: string): Array<{ text: string; accent: boolean }>` — used in Task 3

---

- [ ] **Step 1: Create the test file**

Create `src/components/sections/__tests__/hero.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { parseAccentLine } from '../hero'

describe('parseAccentLine', () => {
  it('returns a single plain segment when there are no markers', () => {
    expect(parseAccentLine('Hello world')).toEqual([
      { text: 'Hello world', accent: false },
    ])
  })

  it('returns a single accent segment for a fully-marked string', () => {
    expect(parseAccentLine('**bold**')).toEqual([
      { text: 'bold', accent: true },
    ])
  })

  it('splits mixed text into plain and accent segments', () => {
    expect(parseAccentLine('I build **fast**, **reliable** software')).toEqual([
      { text: 'I build ', accent: false },
      { text: 'fast', accent: true },
      { text: ', ', accent: false },
      { text: 'reliable', accent: true },
      { text: ' software', accent: false },
    ])
  })

  it('returns an empty array for an empty string', () => {
    expect(parseAccentLine('')).toEqual([])
  })
})
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
pnpm test -- hero.test
```

Expected: 4 failures — `parseAccentLine` not yet defined.

- [ ] **Step 3: Add `parseAccentLine` to `hero.tsx`**

Add this export at the top of `src/components/sections/hero.tsx`, directly below the import block:

```ts
export function parseAccentLine(text: string): Array<{ text: string; accent: boolean }> {
  const parts: Array<{ text: string; accent: boolean }> = []
  const regex = /\*\*(.+?)\*\*/g
  let lastIndex = 0
  let match: RegExpExecArray | null
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ text: text.slice(lastIndex, match.index), accent: false })
    }
    parts.push({ text: match[1], accent: true })
    lastIndex = regex.lastIndex
  }
  if (lastIndex < text.length) {
    parts.push({ text: text.slice(lastIndex), accent: false })
  }
  return parts
}
```

- [ ] **Step 4: Run tests to confirm they pass**

```bash
pnpm test -- hero.test
```

Expected: 4 passing.

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/hero.tsx src/components/sections/__tests__/hero.test.ts
git commit -m "feat(hero): add parseAccentLine helper with tests"
```

---

### Task 2: Dot grid background

**Files:**
- Modify: `src/components/sections/hero.tsx` — update `<section>` and `<FadeRise>`

**Interfaces:**
- Consumes: nothing from prior tasks
- Produces: visual dot-grid layer behind hero content; `<FadeRise>` lifted to `z-10`

---

- [ ] **Step 1: Add `relative overflow-hidden` to the `<section>` and insert the dot grid div**

In `src/components/sections/hero.tsx`, update the `<section>` opening tag and add the dot grid div as its first child:

```tsx
<section id="hero" className="relative overflow-hidden pt-6 pb-16 md:pt-8 md:pb-20 lg:pb-24">
  {/* Dot grid background */}
  <div
    className="pointer-events-none absolute inset-0 z-0"
    style={{
      backgroundImage: 'radial-gradient(circle, hsl(var(--foreground) / 0.08) 1px, transparent 1px)',
      backgroundSize: '28px 28px',
      WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 40%, transparent 100%)',
      maskImage: 'linear-gradient(to bottom, black 0%, black 40%, transparent 100%)',
    }}
  />
  <FadeRise className="relative z-10">
    {/* ... existing content unchanged ... */}
  </FadeRise>
</section>
```

The only changes to `<FadeRise>` are adding `className="relative z-10"` — all children inside it are untouched in this task.

- [ ] **Step 2: Verify visually in the browser**

Start the dev server:

```bash
pnpm dev
```

Open `http://localhost:3000` and check:
- A faint dot grid is visible in the upper portion of the hero
- The grid fades to nothing before the stats strip
- All existing text, buttons, and animations look unchanged
- Dark mode: dots are still subtle (foreground at 8% opacity scales with theme)

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/hero.tsx
git commit -m "feat(hero): add dot-matrix background with bottom fade"
```

---

### Task 3: Headline accent rendering + typography upgrade

**Files:**
- Modify: `src/components/sections/hero.tsx` — update `<MaskReveal>` children and className

**Interfaces:**
- Consumes: `parseAccentLine` from Task 1

---

- [ ] **Step 1: Update the `<MaskReveal>` block**

Replace the existing `<MaskReveal>` block (the `<h1>` and its children) in `src/components/sections/hero.tsx` with:

```tsx
<MaskReveal
  as="h1"
  className="text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tighter leading-[1.1] text-balance"
>
  {headline.split("\n").map((line) => (
    <span key={line} className="block overflow-hidden">
      <span className="mask-line block">
        {parseAccentLine(line).map((seg, i) =>
          seg.accent ? (
            <span key={i} className="text-primary">{seg.text}</span>
          ) : (
            seg.text
          )
        )}
      </span>
    </span>
  ))}
</MaskReveal>
```

Changes from the original:
- `font-semibold` → `font-bold`
- `tracking-tight` → `tracking-tighter`
- Each `line` is now processed through `parseAccentLine` so `**word**` tokens render as `<span className="text-primary">`

- [ ] **Step 2: Update the CMS headline to use `**markers**`**

In Payload CMS (`/admin`), open **Site Settings → Headline** and wrap the words you want highlighted with `**double asterisks**`. Example:

```
I build **scalable**,
**high-performance** software
that ships.
```

If no words are marked, the headline renders exactly as before — plain text with no accent spans.

- [ ] **Step 3: Verify visually in the browser**

With the dev server running at `http://localhost:3000`:
- Headline is visibly bolder and tighter than before
- Marked words render in the primary color
- The `MaskReveal` slide-up animation still fires on load for all lines
- Lines without `**markers**` render as plain foreground text (regression check)
- Run the full test suite to confirm nothing broke:

```bash
pnpm test
```

Expected: all tests pass.

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/hero.tsx
git commit -m "feat(hero): accent headline words and upgrade typography weight"
```
