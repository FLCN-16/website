# Splash Screen — Design Spec

**Date:** 2026-05-28
**Branch:** website-v2

## Overview

Add a GSAP-animated splash screen that plays once per browser session on the first visit to the landing page (`/`). It overlays the page content, animates the site handle letter-by-letter, then fades out to reveal the site.

## Architecture

A single `"use client"` component `SplashScreen` is added to `app/(site)/layout.tsx`, rendered above `<SiteFrame>`. It mounts on every `(site)` page but self-disables instantly on any page other than `/` and on subsequent visits within the same session.

**Guard conditions (checked on mount, in order):**
1. `window.location.pathname !== '/'` → return null immediately
2. `sessionStorage.getItem('splash_seen')` is set → return null
3. Otherwise: render overlay and run animation

After the animation completes, the component sets `sessionStorage.setItem('splash_seen', '1')` and removes the overlay from the DOM via a React state update.

**File:** `components/site/splash-screen.tsx` — self-contained, no external state.

## Reduced Motion

If `prefers-reduced-motion` is set (detected via the existing `useReducedMotion()` hook from `lib/reduced-motion.ts`), the splash is skipped entirely — the guard returns null without setting `sessionStorage`, so accessibility preferences are respected and the splash never blocks content.

## Visual Design

- **Background:** `bg-background` (inherits site dark/light theme CSS variable, matches the page background so the transition is seamless)
- **Overlay:** `position: fixed, inset: 0, z-index: 9999` — sits above all page content
- **Text:** "THE FALCON" in `font-mono font-bold`, white (`text-foreground`), large size (~`text-4xl md:text-5xl`)
- **Sub-label:** "thefalcon.dev" in `font-mono text-xs text-muted-foreground`, tracking-widest, appears after the main text

## GSAP Animation Timeline (~2.2s total)

Each letter of "THE FALCON" is wrapped in an `overflow-hidden` span containing an inner span that is the animated target. This produces a mask-reveal effect (same technique as the existing `MaskReveal` component).

| Step | Target | From | To | Duration | Delay/Stagger |
|------|--------|------|----|----------|---------------|
| 1 | Letter spans | `yPercent: 100` | `yPercent: 0` | `0.6s` | stagger `0.06s`, `ease: power3.out` |
| 2 | Domain label | `opacity: 0` | `opacity: 1` | `0.4s` | after letters complete |
| 3 | Hold | — | — | `0.4s` | — |
| 4 | Overlay | `opacity: 1` | `opacity: 0` | `0.5s` | after hold |
| 5 | On complete | Set `sessionStorage`, call `setDone(true)` to unmount overlay | — | — | — |

Uses `useGSAP` from `@gsap/react` (already installed), consistent with existing animation components.

## Integration Point

`app/(site)/layout.tsx` — add `<SplashScreen />` as the first child inside the `<body>` element, before `<ThemeProvider>` wrapping to ensure it renders above everything:

```tsx
<body className="min-h-full flex flex-col bg-background text-foreground">
  <ThemeProvider ...>
    <SplashScreen />
    <QueryProvider>
      <SiteFrame>{children}</SiteFrame>
    </QueryProvider>
    <Toaster position="bottom-right" />
  </ThemeProvider>
</body>
```

## What Is Not In Scope

- CMS-controlled toggle for the splash (not requested)
- Per-page splash screens (landing page only)
- Cookie-based tracking (sessionStorage only)
- Custom splash content from CMS
- Any splash on mobile vs desktop differentiation
