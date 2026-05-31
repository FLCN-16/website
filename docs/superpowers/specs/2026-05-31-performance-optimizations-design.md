# Performance Optimizations — Design Spec

**Date:** 2026-05-31  
**Status:** Approved

---

## Problem

The site has accumulated dead dependencies (~700KB of unused libraries in `node_modules`) and no manual code splitting beyond Next.js's automatic page-level splits. Three components — `SplashScreen`, `TalentInquiryDialog`, and `FeaturedSwiper` — load their bundles on every page or route despite being conditional/modal/decorative. No `dynamic()` imports exist anywhere.

---

## Scope

Two areas, independent of each other:

1. **Dependency + dead-file cleanup** — remove unused packages and their wrapper components
2. **Dynamic imports** — defer three non-critical client components using `next/dynamic`

Preload/prefetch hints are explicitly out of scope: `next/image` with `priority` already generates `<link rel="preload">` for hero images, and `<Link>` prefetches routes in production automatically.

---

## Section 1: Dependency & Dead File Cleanup

### Packages to remove from `package.json`

| Package | Why unused |
|---|---|
| `three` | No imports anywhere in the codebase |
| `@react-three/fiber` | No imports anywhere |
| `@react-three/drei` | No imports anywhere |
| `recharts` | Only `components/ui/chart.tsx` imports it — that file is never used |
| `embla-carousel-react` | Only `components/ui/carousel.tsx` imports it — that file is never used |

Remove with:
```bash
pnpm remove three @react-three/fiber @react-three/drei recharts embla-carousel-react
```

### Files to delete

| File | Why |
|---|---|
| `components/ui/chart.tsx` | Wraps `recharts` — not imported by any page or component |
| `components/ui/carousel.tsx` | Wraps `embla-carousel-react` — not imported by any page or component |

Verify with `grep -r "from.*chart\|from.*carousel" app/ components/` before deleting — must return zero results from page/section components.

---

## Section 2: Dynamic Imports

### 2a. `SplashScreen` — `app/(site)/layout.tsx`

**Current:** Statically imported; mounted on every route; checks `pathname === '/'` internally to decide whether to show. GSAP splash timeline ships in every page's JS.

**Change:** Replace static import with `dynamic()`:

```tsx
// before
import { SplashScreen } from '@/components/site/splash-screen'

// after
import dynamic from 'next/dynamic'
const SplashScreen = dynamic(
  () => import('@/components/site/splash-screen').then(m => ({ default: m.SplashScreen })),
  { ssr: false, loading: () => null }
)
```

**Why safe:** `SplashScreen` has no SSR output (it's a pure client animation). `loading: () => null` means no layout shift. The component still mounts on `/` on the client — behaviour is identical.

### 2b. `TalentInquiryDialog` — `app/(site)/layout.tsx`

**Current:** Statically imported; mounted on every route; only opens on user interaction.

**Change:**

```tsx
// before
import { TalentInquiryDialog } from '@/components/site/talent-inquiry-dialog'

// after
const TalentInquiryDialog = dynamic(
  () => import('@/components/site/talent-inquiry-dialog').then(m => ({ default: m.TalentInquiryDialog })),
  { ssr: false, loading: () => null }
)
```

**Why safe:** The CMS form data is fetched server-side in the layout and passed as props — the fetch is unaffected. The dialog has no SSR output (it's a modal). `ssr: false` means the component hydrates after initial paint, which is invisible to users since the dialog only opens on click.

### 2c. `FeaturedSwiper` — `components/sections/writing-list-client.tsx`

**Current:** Statically imported; Swiper (~100KB) loads as part of the `/writing` page bundle whether or not featured posts exist.

**Change:** In `writing-list-client.tsx`, replace the static import:

```tsx
// before
import { FeaturedSwiper } from '@/components/writing/featured-swiper'

// after
import dynamic from 'next/dynamic'
const FeaturedSwiper = dynamic(
  () => import('@/components/writing/featured-swiper').then(m => ({ default: m.FeaturedSwiper })),
  { ssr: false, loading: () => null }
)
```

**Why safe:** `FeaturedSwiper` is already conditionally rendered (only when `featuredPosts.length > 0`). It has no SSR output. The dynamic import simply defers the Swiper bundle until the carousel is actually rendered client-side.

---

## Files Changed

| File | Change |
|---|---|
| `package.json` | Remove 5 packages |
| `pnpm-lock.yaml` | Updated by pnpm automatically |
| `components/ui/chart.tsx` | Delete |
| `components/ui/carousel.tsx` | Delete |
| `app/(site)/layout.tsx` | Convert 2 static imports → `dynamic()` |
| `components/sections/writing-list-client.tsx` | Convert 1 static import → `dynamic()` |

---

## Verification

1. `pnpm install` completes without errors after package removal
2. `grep -r "from.*three\|from.*recharts\|from.*embla" app/ components/ lib/` — zero results
3. `pnpm build` compiles cleanly (no missing-module errors)
4. Home page (`/`): splash screen still plays on first visit; absent on repeat visits (sessionStorage)
5. All pages: talent dialog still opens correctly when triggered
6. `/writing`: Swiper carousel still renders when featured posts exist
7. `pnpm test` — all 31 tests pass
