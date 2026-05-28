# Maintenance Mode — Design Spec

**Date:** 2026-05-28  
**Branch:** website-v2

## Overview

Add a CMS-controlled maintenance mode toggle to the portfolio site. When enabled, all public `(site)` routes redirect to a branded maintenance page. The Payload CMS admin panel remains fully accessible at all times.

## CMS Config

**File:** `globals/SiteSettings.ts`

Add a `maintenanceMode` group field alongside the existing `availability` group:

```ts
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
}
```

## Routing

**File:** `app/(site)/layout.tsx`

At the top of the server component:
1. Call `getPayload({ config })` to get a Payload instance.
2. Fetch the `site-settings` global.
3. If `maintenanceMode.enabled === true`, call `redirect('/maintenance')`.

The `/maintenance` page lives outside the `(site)` route group, so the redirect does not loop. The `(payload)` route group (`/admin`) is entirely separate and unaffected.

## Maintenance Page

### Layout — `app/maintenance/layout.tsx`

Minimal HTML shell: sets up `<html>` with font variables (`--font-inter`, `--font-jetbrains-mono`) and `suppressHydrationWarning`. No `SiteFrame` — no nav, rail, or footer.

Includes `ThemeProvider` so dark/light theme and CSS variables work correctly.

### Page — `app/maintenance/page.tsx`

Server component that:
1. Fetches `site-settings` global via `getPayload()`.
2. Reads `maintenanceMode.message`.
3. Renders a centered, full-height page matching the site's design language:
   - Site name / logo mark
   - Status indicator (e.g. a pulsing dot + "UNDER MAINTENANCE" badge in the same style as the availability badge)
   - The custom CMS message
   - A subtle note (e.g. "Check back soon")

Styling uses Tailwind and the site's existing CSS variables (`bg-background`, `text-foreground`, `border`, etc.) for full theme consistency.

## Access Rules

| Route | Maintenance mode on | Maintenance mode off |
|---|---|---|
| `/` and all `(site)` routes | → redirect `/maintenance` | Normal |
| `/maintenance` | Renders normally | Renders normally (no guard) |
| `/admin` and all `(payload)` routes | Accessible | Accessible |

## What Is Not In Scope

- IP allowlisting or bypass tokens
- Environment variable override
- Estimated return time field (message field covers this)
- API route protection (no public API routes in current codebase)
