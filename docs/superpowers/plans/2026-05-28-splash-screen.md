# Splash Screen Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a GSAP-animated full-screen splash that plays once per session on the landing page, revealing the site handle "THE FALCON" letter-by-letter before fading out.

**Architecture:** A single `"use client"` `SplashScreen` component mounts in `(site)/layout.tsx` and self-disables instantly via `window.location.pathname` and `sessionStorage` checks — no-op on all inner pages and after the first visit. The overlay renders above all site chrome (`z-[9999]`), GSAP animates a mask-reveal letter stagger followed by a full-overlay fade-out, then the component unmounts.

**Tech Stack:** Next.js 15 App Router, GSAP 3 + `@gsap/react` (already installed), React `useEffect` + `useState`, `useReducedMotion` hook (existing), Tailwind CSS

---

## File Map

| File | Action | Purpose |
|------|--------|---------|
| `components/site/splash-screen.tsx` | Create | Self-contained splash component with GSAP timeline |
| `app/(site)/layout.tsx` | Modify | Add `<SplashScreen />` inside `<ThemeProvider>` |

---

### Task 1: Create `SplashScreen` component

**Files:**
- Create: `components/site/splash-screen.tsx`

The component follows the exact same patterns as `components/anim/mask-reveal.tsx` (overflow-hidden letter wrapping + `useGSAP`) and `components/anim/fade-rise.tsx` (early-return on `useReducedMotion`).

**Animation timeline (~2.2s):**
1. Letters: `yPercent: 100 → 0`, duration `0.6s`, stagger `0.06s`, `ease: "power3.out"`
2. Domain label: `opacity: 0 → 1`, duration `0.4s`, after letters
3. Hold `0.4s`
4. Overlay: `opacity: 1 → 0`, duration `0.5s` — on complete: set `sessionStorage`, call `setDone(true)`

- [ ] **Step 1: Create the component file**

Create `components/site/splash-screen.tsx` with the following content:

```tsx
"use client"

import { useRef, useState, useEffect } from "react"
import { useGSAP } from "@gsap/react"
import { gsap } from "gsap"
import { useReducedMotion } from "@/lib/reduced-motion"
import { site } from "@/content/site"

const WORDS = ["THE", "FALCON"]
const DOMAIN = site.url.replace("https://", "")

export function SplashScreen() {
  const reduced = useReducedMotion()
  const [visible, setVisible] = useState(false)
  const [done, setDone] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const domainRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (reduced) return
    if (window.location.pathname !== "/") return
    if (sessionStorage.getItem("splash_seen")) return
    setVisible(true)
  }, [reduced])

  useGSAP(
    () => {
      if (!visible || !containerRef.current || !domainRef.current) return

      const letters = containerRef.current.querySelectorAll<HTMLElement>(".splash-letter")
      const domain = domainRef.current

      gsap
        .timeline({
          onComplete: () => {
            sessionStorage.setItem("splash_seen", "1")
            setDone(true)
          },
        })
        .fromTo(
          letters,
          { yPercent: 100 },
          { yPercent: 0, duration: 0.6, stagger: 0.06, ease: "power3.out" }
        )
        .fromTo(domain, { opacity: 0 }, { opacity: 1, duration: 0.4 }, ">")
        .to({}, { duration: 0.4 })
        .to(containerRef.current, { opacity: 0, duration: 0.5 })
    },
    { dependencies: [visible], scope: containerRef }
  )

  if (!visible || done) return null

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] bg-background flex flex-col items-center justify-center gap-4"
    >
      <div className="flex items-center gap-[0.6em]">
        {WORDS.map((word, wi) => (
          <div key={wi} className="flex">
            {word.split("").map((letter, li) => (
              <span key={li} className="overflow-hidden inline-block">
                <span className="splash-letter inline-block font-mono font-bold text-4xl md:text-5xl text-foreground">
                  {letter}
                </span>
              </span>
            ))}
          </div>
        ))}
      </div>
      <span
        ref={domainRef}
        className="font-mono text-xs text-muted-foreground tracking-[0.25em] uppercase"
        style={{ opacity: 0 }}
      >
        {DOMAIN}
      </span>
    </div>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
pnpm tsc --noEmit
```

Expected: no errors. If you see errors about `@gsap/react` or `gsap` types, they are already installed — check `node_modules/@gsap` exists.

- [ ] **Step 3: Commit**

```bash
git add components/site/splash-screen.tsx
git commit -m "feat(site): add SplashScreen component with GSAP letter stagger"
```

---

### Task 2: Add `SplashScreen` to `(site)/layout.tsx`

**Files:**
- Modify: `app/(site)/layout.tsx`

Add `<SplashScreen />` as the first child inside `<ThemeProvider>`, before `<QueryProvider>`. This ensures the theme CSS variables (`bg-background`, `text-foreground`) are applied when the overlay renders.

The current `(site)/layout.tsx` body looks like this (lines 62–75):

```tsx
<body className="min-h-full flex flex-col bg-background text-foreground">
  <ThemeProvider
    attribute="class"
    defaultTheme="system"
    enableSystem
    disableTransitionOnChange
  >
    <QueryProvider>
      <SiteFrame>{children}</SiteFrame>
    </QueryProvider>
    <Toaster position="bottom-right" />
  </ThemeProvider>
</body>
```

- [ ] **Step 1: Add the import**

In `app/(site)/layout.tsx`, add this import after the existing site imports:

```tsx
import { SplashScreen } from "@/components/site/splash-screen";
```

- [ ] **Step 2: Add `<SplashScreen />` inside `<ThemeProvider>`**

Replace the `<ThemeProvider>` block so it reads:

```tsx
<ThemeProvider
  attribute="class"
  defaultTheme="system"
  enableSystem
  disableTransitionOnChange
>
  <SplashScreen />
  <QueryProvider>
    <SiteFrame>{children}</SiteFrame>
  </QueryProvider>
  <Toaster position="bottom-right" />
</ThemeProvider>
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
pnpm tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add "app/(site)/layout.tsx"
git commit -m "feat(site): mount SplashScreen in site layout"
```

---

### Task 3: Manual verification

- [ ] **Step 1: Start the dev server**

```bash
pnpm dev
```

- [ ] **Step 2: Clear sessionStorage and verify splash plays**

Open `http://localhost:3000` in a fresh browser tab (or open DevTools → Application → Storage → Session Storage → clear all).

Expected:
- Dark full-screen overlay appears immediately
- "THE" letters stagger up one-by-one, then "FALCON" letters follow
- "thefalcon.dev" fades in below
- After ~2.2s total the overlay fades out, revealing the landing page
- `sessionStorage` now has key `splash_seen = "1"`

- [ ] **Step 3: Verify splash does NOT replay in the same session**

Reload `http://localhost:3000` without closing the tab.

Expected: no splash — landing page renders immediately.

- [ ] **Step 4: Verify splash does NOT play on inner pages**

Navigate directly to `http://localhost:3000/writing` or `http://localhost:3000/work` in a new tab (with sessionStorage cleared).

Expected: no splash on any page other than `/`.

- [ ] **Step 5: Verify reduced motion is respected**

In DevTools → Rendering → Emulate CSS media → `prefers-reduced-motion: reduce`.

Clear sessionStorage, reload `http://localhost:3000`.

Expected: splash is skipped entirely — landing page renders immediately.

- [ ] **Step 6: Verify dark mode**

Toggle to dark mode (via site's theme toggle), clear sessionStorage, reload.

Expected: overlay background matches the page background (`bg-background` in dark mode = near-black), letters are white (`text-foreground`).
