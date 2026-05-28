# Error Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add global 404, site-scoped 404, and site-scoped runtime error pages that match the existing design language.

**Architecture:** Three new files, zero new dependencies. Root `app/not-found.tsx` uses a standalone full-screen layout (matching the maintenance page). `app/(site)/not-found.tsx` and `app/(site)/error.tsx` inherit the `(site)` layout which already provides Rail, nav, and footer via `SiteFrame`. The error boundary is a client component (Next.js requirement) that receives `error` and `reset` props.

**Tech Stack:** Next.js App Router, Tailwind CSS, existing design tokens (`text-foreground`, `text-muted-foreground`, `border-border`, `text-destructive`), `content/site.ts` for identity data.

---

### Task 1: Root-level 404 (`app/not-found.tsx`)

**Files:**
- Create: `app/not-found.tsx`

This page is shown when a request path matches no route at all (not caught by any route group). It uses the standalone shell — just `ThemeProvider` wrapping a centered layout, same as the maintenance page. The `app/layout.tsx` provides `<html>` and `<body>` automatically.

- [ ] **Step 1: Create `app/not-found.tsx`**

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: `Not Found — ${site.name}`,
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm flex flex-col gap-6">
        {/* Identity */}
        <div className="flex flex-col gap-1">
          <span className="font-sans font-semibold text-sm text-foreground">
            {site.name}
          </span>
          <span className="font-mono text-xs text-muted-foreground">
            {site.role}
          </span>
        </div>

        {/* Status pill */}
        <div className="inline-flex w-fit items-center gap-1.5 rounded-full border border-border px-2.5 py-1">
          <span className="text-destructive text-xs leading-none">●</span>
          <span className="font-mono text-xs text-muted-foreground">404 NOT FOUND</span>
        </div>

        {/* Message */}
        <p className="font-sans text-sm text-muted-foreground leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>

        {/* Back link */}
        <Link
          href="/"
          className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Back home
        </Link>
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
pnpm tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add app/not-found.tsx
git commit -m "feat(errors): add root-level 404 page"
```

---

### Task 2: Site-scoped 404 (`app/(site)/not-found.tsx`)

**Files:**
- Create: `app/(site)/not-found.tsx`

This is triggered when `notFound()` is called inside any `(site)` route (e.g., `/writing/[slug]` when a post doesn't exist). It inherits the full `(site)` layout — Rail sidebar, mobile header, footer — so the user still has navigation available.

- [ ] **Step 1: Create `app/(site)/not-found.tsx`**

```tsx
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Not Found",
  robots: { index: false, follow: false },
};

export default function SiteNotFound() {
  return (
    <div className="flex flex-col gap-8 max-w-lg">
      {/* Code */}
      <span className="font-mono text-xs text-muted-foreground">404</span>

      {/* Heading */}
      <div className="flex flex-col gap-2">
        <h1 className="font-sans font-semibold text-lg text-foreground">
          Page not found
        </h1>
        <p className="font-sans text-sm text-muted-foreground leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
      </div>

      {/* Back link */}
      <Link
        href="/"
        className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors w-fit"
      >
        ← Back home
      </Link>
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
pnpm tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add "app/(site)/not-found.tsx"
git commit -m "feat(errors): add site-scoped 404 page"
```

---

### Task 3: Site-scoped error boundary (`app/(site)/error.tsx`)

**Files:**
- Create: `app/(site)/error.tsx`

Next.js requires error boundary files to be client components. It receives two props: `error` (the thrown `Error` with an optional `.digest` for server-side tracing) and `reset` (a function that re-renders the failed subtree). This page also inherits the full `(site)` layout.

- [ ] **Step 1: Create `app/(site)/error.tsx`**

```tsx
"use client";

import { useEffect } from "react";
import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function SiteError({ error, reset }: ErrorProps) {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.error("[SiteError]", error.digest ?? error.message);
    }
  }, [error]);

  return (
    <div className="flex flex-col gap-8 max-w-lg">
      {/* Code */}
      <span className="font-mono text-xs text-muted-foreground">500</span>

      {/* Heading */}
      <div className="flex flex-col gap-2">
        <h1 className="font-sans font-semibold text-lg text-foreground">
          Something went wrong
        </h1>
        <p className="font-sans text-sm text-muted-foreground leading-relaxed">
          An unexpected error occurred. You can try again or return home.
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <button
          onClick={reset}
          className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Try again ↺
        </button>
        <span className="text-border text-xs">·</span>
        <Link
          href="/"
          className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Back home
        </Link>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
pnpm tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add "app/(site)/error.tsx"
git commit -m "feat(errors): add site-scoped error boundary"
```

---

### Task 4: Visual verification

- [ ] **Step 1: Start the dev server**

```bash
pnpm dev
```

- [ ] **Step 2: Trigger the root 404**

Navigate to `http://localhost:3000/this-path-does-not-exist-at-all`.

Expected: full-screen centered layout with identity block, red `●` pill labeled `404 NOT FOUND`, message, and "← Back home" link. No Rail or nav sidebar.

- [ ] **Step 3: Trigger the site-scoped 404**

Navigate to `http://localhost:3000/writing/slug-that-does-not-exist`.

Expected: Rail sidebar visible, content area shows `404` mono label, "Page not found" heading, description, and "← Back home" link.

- [ ] **Step 4: Verify "← Back home" links**

Click each back link. Expected: navigates to `/` (home page).

- [ ] **Step 5: Verify dark mode**

Toggle dark mode via the theme button in the Rail. Expected: all three pages adapt correctly (background, text, border colors all switch).

- [ ] **Step 6: Final commit if any adjustments were made**

```bash
git add -p
git commit -m "fix(errors): visual adjustments after review"
```

---

### Task 5: Trigger error boundary manually (development only)

The error boundary (`app/(site)/error.tsx`) can't be triggered via navigation — it requires a thrown error inside a route. Verify it works by temporarily forcing an error.

- [ ] **Step 1: Temporarily break a site page**

Open `app/(site)/page.tsx`. At the top of the `Home` component body, add:

```ts
throw new Error("test error boundary");
```

- [ ] **Step 2: Navigate to home**

Navigate to `http://localhost:3000/`.

Expected: Rail visible, content area shows `500` mono label, "Something went wrong" heading, "Try again ↺" and "← Back home" actions.

- [ ] **Step 3: Test "Try again"**

Click "Try again ↺". Expected: attempts re-render (will error again since the throw is still there — that's fine, confirms the button calls `reset()`).

- [ ] **Step 4: Revert the temporary throw**

Remove the `throw` line from `app/(site)/page.tsx`.

- [ ] **Step 5: Verify home page is back to normal**

Navigate to `http://localhost:3000/`. Expected: normal home page renders.
