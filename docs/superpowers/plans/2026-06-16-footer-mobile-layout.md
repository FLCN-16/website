# Footer Mobile Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix the footer on mobile so all sections stack vertically with proper spacing instead of wrapping chaotically.

**Architecture:** Three targeted class changes in a single file — outer gap, Row 1 flex direction, Row 2 flex direction. All changes are mobile-first defaults overridden at `md:`. No new components, no logic changes.

**Tech Stack:** Next.js, Tailwind CSS, React

---

### Task 1: Apply mobile layout classes to footer

**Files:**
- Modify: `src/components/site/footer.tsx`

This is purely a Tailwind class change — no logic, no tests. Verification is visual.

- [ ] **Step 1: Update outer container gap**

In `src/components/site/footer.tsx`, line 29, change:

```tsx
<div className="flex flex-col gap-3">
```

to:

```tsx
<div className="flex flex-col gap-5">
```

- [ ] **Step 2: Update Row 1 (copyright + location) to stack on mobile**

Line 31, change:

```tsx
<div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1">
```

to:

```tsx
<div className="flex flex-col gap-1 md:flex-row md:flex-wrap md:items-center md:justify-between md:gap-x-6">
```

- [ ] **Step 3: Update Row 2 (nav + legal) to stack on mobile**

Line 41, change:

```tsx
<div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
```

to:

```tsx
<div className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center md:justify-between md:gap-x-6">
```

- [ ] **Step 4: Verify visually**

Run the dev server:

```bash
pnpm dev
```

Open `http://localhost:3000` in a browser. Use DevTools to simulate a mobile viewport (e.g. iPhone SE at 375px wide). Confirm:

- Spacing between sections feels open (not cramped)
- Copyright appears on its own line, location below it, both left-aligned
- Nav links appear as a full-width row, left-aligned
- Legal links appear as a full-width row below nav links, left-aligned
- Socials (left) and Back to Top (right) remain side-by-side

Also confirm at `md` (768px+) that the layout is identical to before these changes.

- [ ] **Step 5: Commit**

```bash
git add src/components/site/footer.tsx
git commit -m "fix(footer): stack sections vertically on mobile"
```
