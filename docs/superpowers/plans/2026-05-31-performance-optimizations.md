# Performance Optimizations Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove ~700KB of dead dependencies and defer three non-critical client components (SplashScreen, TalentInquiryDialog, FeaturedSwiper) off the critical render path using `next/dynamic`.

**Architecture:** Two independent changes: (1) strip unused packages from `package.json` and delete their dead wrapper files; (2) convert three static imports to `dynamic(() => import(...), { ssr: false, loading: () => null })` so their bundles only download when the components actually render on the client. No component internals change.

**Tech Stack:** `next/dynamic` (already in `next` — no new deps), pnpm, vitest.

---

## File Structure

| File | Change |
|---|---|
| `package.json` | Remove 6 packages (`three`, `@react-three/fiber`, `@react-three/drei`, `@types/three`, `recharts`, `embla-carousel-react`) |
| `components/ui/chart.tsx` | Delete (only consumer of `recharts`) |
| `components/ui/carousel.tsx` | Delete (only consumer of `embla-carousel-react`) |
| `app/(site)/layout.tsx` | Replace static imports of `SplashScreen` + `TalentInquiryDialog` with `dynamic()` |
| `components/sections/writing-list-client.tsx` | Replace static import of `FeaturedSwiper` with `dynamic()` |

---

### Task 1: Remove unused dependencies and dead files

**Files:**
- Modify: `package.json`
- Delete: `components/ui/chart.tsx`
- Delete: `components/ui/carousel.tsx`

- [ ] **Step 1: Verify the dead files are not imported anywhere**

```bash
grep -r "from.*ui/chart\|from.*ui/carousel" app/ components/ lib/ --include="*.tsx" --include="*.ts" | grep -v "chart.tsx\|carousel.tsx"
```

Expected: **no output**. If any lines appear, do not delete those files — report BLOCKED.

- [ ] **Step 2: Remove unused packages**

```bash
pnpm remove three @react-three/fiber @react-three/drei @types/three recharts embla-carousel-react
```

Expected output includes lines like `Packages: -6 ...` and ends with `Done`. If pnpm errors on any package name, check spelling against `package.json` and adjust.

- [ ] **Step 3: Verify packages are gone from package.json**

```bash
grep -E "three|react-three|recharts|embla" package.json
```

Expected: **no output**.

- [ ] **Step 4: Delete dead UI files**

```bash
rm components/ui/chart.tsx components/ui/carousel.tsx
```

- [ ] **Step 5: Confirm files are gone**

```bash
ls components/ui/chart.tsx components/ui/carousel.tsx 2>&1
```

Expected: `No such file or directory` for both.

- [ ] **Step 6: Run the test suite**

```bash
pnpm test
```

Expected: all 31 tests pass. If any test imports from `chart` or `carousel`, it will fail here — report BLOCKED.

- [ ] **Step 7: Commit**

```bash
git add package.json pnpm-lock.yaml components/ui/chart.tsx components/ui/carousel.tsx
git commit -m "chore: remove unused three.js, recharts, embla-carousel deps and dead UI files"
```

---

### Task 2: Dynamic import SplashScreen and TalentInquiryDialog in layout

**Files:**
- Modify: `app/(site)/layout.tsx`

The current file has these two static imports at lines 13–14:
```tsx
import { SplashScreen } from "@/components/site/splash-screen";
import { TalentInquiryDialog } from "@/components/site/talent-inquiry-dialog";
```

- [ ] **Step 1: Replace the two static imports with dynamic imports**

In `app/(site)/layout.tsx`, find and replace the two lines above with:

```tsx
import dynamic from "next/dynamic";

const SplashScreen = dynamic(
  () => import("@/components/site/splash-screen").then((m) => ({ default: m.SplashScreen })),
  { ssr: false, loading: () => null }
);

const TalentInquiryDialog = dynamic(
  () => import("@/components/site/talent-inquiry-dialog").then((m) => ({ default: m.TalentInquiryDialog })),
  { ssr: false, loading: () => null }
);
```

Place this block where the two static imports were (lines 13–14). The `import dynamic from "next/dynamic"` line goes first. The rest of the file is unchanged.

- [ ] **Step 2: Verify the file has no remaining static import of SplashScreen or TalentInquiryDialog**

```bash
grep "^import.*SplashScreen\|^import.*TalentInquiryDialog" "app/(site)/layout.tsx"
```

Expected: **no output**.

- [ ] **Step 3: Run the test suite**

```bash
pnpm test
```

Expected: all 31 tests pass.

- [ ] **Step 4: Commit**

```bash
git add "app/(site)/layout.tsx"
git commit -m "perf: dynamic import SplashScreen and TalentInquiryDialog to defer off critical path"
```

---

### Task 3: Dynamic import FeaturedSwiper in writing-list-client

**Files:**
- Modify: `components/sections/writing-list-client.tsx`

The current file has this static import at line 5:
```tsx
import { FeaturedSwiper } from "@/components/writing/featured-swiper"
```

- [ ] **Step 1: Replace the static import with a dynamic import**

In `components/sections/writing-list-client.tsx`, find and replace line 5 with:

```tsx
import dynamic from "next/dynamic"

const FeaturedSwiper = dynamic(
  () => import("@/components/writing/featured-swiper").then((m) => ({ default: m.FeaturedSwiper })),
  { ssr: false, loading: () => null }
)
```

The rest of the file is unchanged. `FeaturedSwiper` is used at line 170 (`<FeaturedSwiper posts={featuredPosts} />`) — that call site stays exactly as-is.

- [ ] **Step 2: Verify no remaining static import of FeaturedSwiper**

```bash
grep "^import.*FeaturedSwiper" components/sections/writing-list-client.tsx
```

Expected: **no output**.

- [ ] **Step 3: Run the test suite**

```bash
pnpm test
```

Expected: all 31 tests pass.

- [ ] **Step 4: Commit**

```bash
git add components/sections/writing-list-client.tsx
git commit -m "perf: dynamic import FeaturedSwiper to defer Swiper bundle off /writing critical path"
```

---

### Task 4: Full verification

- [ ] **Step 1: Run the full test suite**

```bash
pnpm test
```

Expected: 5 test files, 31 tests, all pass.

- [ ] **Step 2: Build check**

```bash
pnpm build
```

Expected: TypeScript compiles cleanly. The pre-existing sitemap prerender failure (`ECONNREFUSED localhost:3000`) is unrelated to this work — ignore it if it appears. Any NEW errors about missing modules (`three`, `recharts`, `embla-carousel-react`, `chart`, `carousel`) are blockers — report them.

- [ ] **Step 3: Smoke-test the dev server**

Start the dev server:
```bash
pnpm dev
```

Check the home page:
```bash
curl -s http://localhost:3000/ | grep -c "html"
```
Expected: `1` (page renders).

Check the writing page:
```bash
curl -s http://localhost:3000/writing | grep -c "html"
```
Expected: `1`.

- [ ] **Step 4: Confirm no references to removed packages remain**

```bash
grep -r "from.*three\|from.*recharts\|from.*embla-carousel" app/ components/ lib/ --include="*.tsx" --include="*.ts"
```

Expected: **no output**.
