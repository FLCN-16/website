# Maintenance Mode Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a CMS-controlled maintenance mode to the portfolio site that redirects all public pages to a branded maintenance page while keeping the Payload admin panel accessible.

**Architecture:** A `maintenanceMode` group field is added to the existing `SiteSettings` Payload global. The `(site)/layout.tsx` server component checks this setting via `getPayload()` and calls `redirect('/maintenance')` when enabled. The maintenance page lives at `app/maintenance/` outside the `(site)` route group, so it is naturally exempt from the redirect and the `/admin` routes are untouched.

**Tech Stack:** Next.js 15 (App Router, server components), Payload CMS 3.x, Tailwind CSS, TypeScript

---

## File Map

| File | Action | Purpose |
|------|--------|---------|
| `globals/SiteSettings.ts` | Modify | Add `maintenanceMode` group field |
| `app/(site)/layout.tsx` | Modify | Fetch settings, redirect if maintenance enabled |
| `app/maintenance/layout.tsx` | Create | Minimal HTML shell with fonts + ThemeProvider |
| `app/maintenance/page.tsx` | Create | Branded maintenance page, reads custom message from CMS |

---

### Task 1: Add `maintenanceMode` field group to SiteSettings

**Files:**
- Modify: `globals/SiteSettings.ts`

After the `maintenanceMode` group is added, `pnpm payload generate:types` will regenerate `payload-types.ts` so the new fields are typed.

- [ ] **Step 1: Add the `maintenanceMode` group to the `fields` array in `SiteSettings`**

Open `globals/SiteSettings.ts`. In the `fields` array, after the closing brace of the `availability` group object (around line 132), add:

```ts
// ── Maintenance Mode ──────────────────────────────────────────────────────
{
  name: "maintenanceMode",
  type: "group",
  label: "Maintenance Mode",
  admin: {
    description: "When enabled, all public pages redirect to the maintenance page.",
  },
  fields: [
    {
      name: "enabled",
      type: "checkbox",
      label: "Enable maintenance mode",
      defaultValue: false,
    },
    {
      name: "message",
      type: "textarea",
      label: "Maintenance message",
      defaultValue: "We're doing some work on the site. We'll be back shortly.",
      admin: {
        description: "Displayed on the maintenance page.",
        rows: 3,
      },
    },
  ],
},
```

- [ ] **Step 2: Regenerate Payload types**

```bash
pnpm payload generate:types
```

Expected: `payload-types.ts` is updated. Look for `maintenanceMode?: { enabled?: boolean | null; message?: string | null; }` inside the `SiteSettings` type.

- [ ] **Step 3: Commit**

```bash
git add globals/SiteSettings.ts payload-types.ts
git commit -m "feat(cms): add maintenanceMode field group to SiteSettings"
```

---

### Task 2: Add maintenance redirect to `(site)/layout.tsx`

**Files:**
- Modify: `app/(site)/layout.tsx`

The `(site)/layout.tsx` is an async server component. It already imports fonts and sets up providers. We add a check at the top of the `SiteLayout` function body using `getPayload()` directly, consistent with the pattern in `components/site/site-frame.tsx`.

- [ ] **Step 1: Add the redirect check to `SiteLayout`**

Open `app/(site)/layout.tsx`. Add two imports after the existing import block:

```ts
import { redirect } from "next/navigation";
import { getPayload } from "payload";
import config from "@payload-config";
```

Then, inside the `SiteLayout` function body, add this block **before** the `return` statement:

```ts
try {
  const payload = await getPayload({ config });
  const settings = await payload.findGlobal({ slug: "site-settings" });
  const mm = settings.maintenanceMode as { enabled?: boolean | null } | null | undefined;
  if (mm?.enabled) {
    redirect("/maintenance");
  }
} catch {
  // If CMS is unreachable, proceed normally — don't block the site
}
```

The full function signature becomes:

```ts
export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  try {
    const payload = await getPayload({ config });
    const settings = await payload.findGlobal({ slug: "site-settings" });
    const mm = settings.maintenanceMode as { enabled?: boolean | null } | null | undefined;
    if (mm?.enabled) {
      redirect("/maintenance");
    }
  } catch {
    // If CMS is unreachable, proceed normally
  }

  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      {/* ... rest of existing JSX unchanged ... */}
    </html>
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
git add "app/(site)/layout.tsx"
git commit -m "feat(site): redirect to /maintenance when maintenance mode is enabled"
```

---

### Task 3: Create maintenance layout

**Files:**
- Create: `app/maintenance/layout.tsx`

This is a minimal layout that provides the HTML shell with fonts and ThemeProvider — matching the site's look — but without `SiteFrame` (no nav, rail, or footer). It mirrors the structure of `app/(site)/layout.tsx` but stripped to the essentials.

- [ ] **Step 1: Create `app/maintenance/layout.tsx`**

```tsx
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "../globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { site } from "@/content/site";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: `Maintenance — ${site.name}`,
  robots: { index: false, follow: false },
};

export default function MaintenanceLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
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
git add app/maintenance/layout.tsx
git commit -m "feat(maintenance): add maintenance layout with fonts and theme"
```

---

### Task 4: Create maintenance page

**Files:**
- Create: `app/maintenance/page.tsx`

A server component that fetches the `maintenanceMode.message` from CMS and renders a centered, branded page matching the site's design language — same status pill style as the rail, same font variables, same colour tokens.

- [ ] **Step 1: Create `app/maintenance/page.tsx`**

```tsx
import { getPayload } from "payload";
import config from "@payload-config";
import { site } from "@/content/site";

export const dynamic = "force-dynamic";

async function getMessage(): Promise<string> {
  try {
    const payload = await getPayload({ config });
    const settings = await payload.findGlobal({ slug: "site-settings" });
    const mm = settings.maintenanceMode as { message?: string | null } | null | undefined;
    return mm?.message || "We're doing some work on the site. We'll be back shortly.";
  } catch {
    return "We're doing some work on the site. We'll be back shortly.";
  }
}

export default async function MaintenancePage() {
  const message = await getMessage();

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

        {/* Status pill — same style as rail.tsx */}
        <div className="inline-flex w-fit items-center gap-1.5 rounded-full border border-border px-2.5 py-1">
          <span className="text-primary text-xs leading-none motion-safe:animate-pulse">●</span>
          <span className="font-mono text-xs text-muted-foreground">UNDER MAINTENANCE</span>
        </div>

        {/* Message */}
        <p className="font-sans text-sm text-muted-foreground leading-relaxed">
          {message}
        </p>

        {/* Footer note */}
        <span className="font-mono text-xs text-muted-foreground/60">
          Check back soon.
        </span>
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
git add app/maintenance/page.tsx
git commit -m "feat(maintenance): add branded maintenance page"
```

---

### Task 5: Manual verification

- [ ] **Step 1: Start the dev server**

```bash
pnpm dev
```

- [ ] **Step 2: Verify normal behaviour (maintenance OFF)**

Open `http://localhost:3000`. The site should load normally. Open `http://localhost:3000/maintenance` — it should render the maintenance page directly (it is always accessible).

- [ ] **Step 3: Enable maintenance mode in the CMS**

Open `http://localhost:3000/admin`. Navigate to **Globals → Site Settings**. Check **Enable maintenance mode** and save.

- [ ] **Step 4: Verify redirect**

Open `http://localhost:3000` in a new tab. Expected: redirected to `http://localhost:3000/maintenance`. Try `/writing`, `/work`, `/projects` — all should redirect. Try `http://localhost:3000/admin` — expected: admin loads normally, no redirect.

- [ ] **Step 5: Verify custom message**

In the CMS, update the **Maintenance message** field to a custom string and save. Reload `http://localhost:3000/maintenance`. Expected: the new message is displayed.

- [ ] **Step 6: Disable maintenance mode**

Uncheck **Enable maintenance mode** in the CMS and save. Reload `http://localhost:3000`. Expected: site loads normally.

- [ ] **Step 7: Final commit (if any cleanup needed)**

```bash
git add -p
git commit -m "chore: cleanup after maintenance mode verification"
```
