# Footer Mobile Layout — Design Spec

**Date:** 2026-06-16
**File:** `src/components/site/footer.tsx`
**Scope:** Mobile-only layout fix. Desktop (`md:` and above) is unchanged.

## Problem

The footer has three rows. Row 2 contains 5 nav links and 5 legal links in a `justify-between flex-wrap` container. On narrow mobile viewports these items wrap unpredictably into a jumbled pile. Overall vertical spacing (`gap-3` / 12px) is also too tight when content stacks.

## Approach

Stack all sections vertically on mobile. Each row collapses to full-width blocks, left-aligned, with increased gap. On `md+` everything reverts to the current side-by-side `justify-between` layout.

## Changes

### Outer container gap
- `gap-3` → `gap-5` (applies at all breakpoints; 20px gives each section room to breathe)

### Row 1 — copyright + location
- Mobile: `flex-col gap-1` — copyright line, location line, both left-aligned
- `md+`: `flex-row items-center justify-between` (current behaviour)
- New classes: `flex flex-col gap-1 md:flex-row md:items-center md:justify-between`

### Row 2 — nav links + legal links
- Mobile: `flex-col gap-3` — nav links block, then legal links block, both full-width left-aligned
- `md+`: `flex-row items-center justify-between` (current behaviour)
- New classes: `flex flex-col gap-3 md:flex-row md:items-center md:justify-between`
- Inner link groups (`flex flex-wrap items-center gap-4`) unchanged

### Row 3 — socials + back-to-top
- No change. `flex items-center justify-between` works correctly at all widths.

## Mobile layout result

```
© 2026 DOMAIN
CITY · TIMEZONE

ABOUT  WORK  STACK  WRITING  CONTACT

Privacy  Terms  Cookies  Data Request  Cookie Settings

GH  LI  IG                         [Back to top]
```

## Constraints

- No new components or abstractions — changes are class-level only
- No desktop regressions — all changes gated behind mobile-first defaults with `md:` overrides
