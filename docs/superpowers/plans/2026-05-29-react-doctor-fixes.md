# React Doctor Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Raise the React Doctor score from 72/100 by fixing all confirmed true-positive errors and high-impact warnings.

**Architecture:** Fix in 5 independent groups: (1) parallelize sequential awaits in page routes, (2) remove non-component exports from badge.tsx, (3) extract buttonVariants to its own file, (4) unexport generatePreviewPath, (5) consolidate chip-filters dropdown state into useReducer. No behavior changes, no feature work.

**Tech Stack:** Next.js 15, React 19, TypeScript, class-variance-authority (cva)

---

## False Positives — do NOT fix

- `server-auth-actions` × 2 (`contact.ts`, `talent-inquiry.ts`) — public contact forms; auth would break them by design.
- `deslop/unused-file` × 46 — component palette (shadcn-style). Needs an explicit user decision before deletion.
- `no-multi-comp` × 12 — compound-component pattern; all in unused files.
- `prefer-tag-over-role` on `reading-progress.tsx:22` — `role="progressbar"` + aria attributes is the correct ARIA pattern for a custom-styled bar. `<progress>` doesn't support the CSS width trick.
- `no-react19-deprecated-apis` / `no-danger` / carousel anti-patterns — all in unused files.
- `deslop/unused-dev-dependency` react-doctor — intentionally run via `npx`, listing it is harmless.

---

## Files Modified / Created

| File | Action |
|------|--------|
| `app/(site)/legal/[slug]/page.tsx` | Modify — parallelize `params` + `draftMode()` |
| `app/(site)/writing/[slug]/page.tsx` | Modify — parallelize `params` + `draftMode()` |
| `app/(site)/page/[slug]/page.tsx` | Modify — parallelize `params` + `draftMode()` |
| `components/ui/badge.tsx` | Modify — make `badgeVariants` private (no external consumers) |
| `components/ui/button-variants.ts` | Create — move `buttonVariants` out of button.tsx |
| `components/ui/button.tsx` | Modify — import from button-variants.ts, remove inline definition |
| `components/ui/calendar.tsx` | Modify — update import source for `buttonVariants` |
| `lib/preview.ts` | Modify — remove `export` from `generatePreviewPath` |
| `components/writing/chip-filters.tsx` | Modify — useReducer for dropdown state |

---

## Task 1: Parallelize sequential awaits in legal/[slug] page

**Files:**
- Modify: `app/(site)/legal/[slug]/page.tsx:31-32` and `:47-48`

- [ ] **Step 1: Fix `generateMetadata` in legal/[slug]**

Replace lines 31-32:
```ts
// Before
const { slug } = await params
const { isEnabled: draft } = await draftMode()

// After
const [{ slug }, { isEnabled: draft }] = await Promise.all([params, draftMode()])
```

- [ ] **Step 2: Fix `LegalPage` component in legal/[slug]**

Replace lines 47-48:
```ts
// Before
const { slug } = await params
const { isEnabled: draft } = await draftMode()

// After
const [{ slug }, { isEnabled: draft }] = await Promise.all([params, draftMode()])
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit 2>&1 | grep "legal"
```
Expected: no output (no errors in this file)

- [ ] **Step 4: Commit**

```bash
git add app/\(site\)/legal/\[slug\]/page.tsx
git commit -m "perf: parallelize params + draftMode in legal page route"
```

---

## Task 2: Parallelize sequential awaits in writing/[slug] page

**Files:**
- Modify: `app/(site)/writing/[slug]/page.tsx:30-31` and `:46-47`

- [ ] **Step 1: Fix `generateMetadata` in writing/[slug]**

Replace the two sequential awaits in `generateMetadata`:
```ts
// Before
const { slug } = await params
const { isEnabled: draft } = await draftMode()

// After
const [{ slug }, { isEnabled: draft }] = await Promise.all([params, draftMode()])
```

- [ ] **Step 2: Fix `PostPage` component in writing/[slug]**

Replace the two sequential awaits in `PostPage`:
```ts
// Before
const { slug } = await params
const { isEnabled: draft } = await draftMode()

// After
const [{ slug }, { isEnabled: draft }] = await Promise.all([params, draftMode()])
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit 2>&1 | grep "writing"
```
Expected: no output

- [ ] **Step 4: Commit**

```bash
git add app/\(site\)/writing/\[slug\]/page.tsx
git commit -m "perf: parallelize params + draftMode in writing page route"
```

---

## Task 3: Parallelize sequential awaits in page/[slug] page

**Files:**
- Modify: `app/(site)/page/[slug]/page.tsx:31-32` and `:47-48`

- [ ] **Step 1: Fix `generateMetadata` in page/[slug]**

Replace the two sequential awaits in `generateMetadata`:
```ts
// Before
const { slug } = await params
const { isEnabled: draft } = await draftMode()

// After
const [{ slug }, { isEnabled: draft }] = await Promise.all([params, draftMode()])
```

- [ ] **Step 2: Fix `BasicPage` component in page/[slug]**

Replace the two sequential awaits in `BasicPage`:
```ts
// Before
const { slug } = await params
const { isEnabled: draft } = await draftMode()

// After
const [{ slug }, { isEnabled: draft }] = await Promise.all([params, draftMode()])
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit 2>&1 | grep "page/\[slug\]"
```
Expected: no output

- [ ] **Step 4: Commit**

```bash
git add app/\(site\)/page/\[slug\]/page.tsx
git commit -m "perf: parallelize params + draftMode in basic page route"
```

---

## Task 4: Fix only-export-components — badge.tsx

**Context:** `badgeVariants` is a CVA function used only within `badge.tsx` itself (no external imports). Removing the export makes it private and fixes Fast Refresh for this file.

**Files:**
- Modify: `components/ui/badge.tsx:49`

- [ ] **Step 1: Remove `badgeVariants` from the export statement**

Change line 49 from:
```ts
export { Badge, badgeVariants }
```
to:
```ts
export { Badge }
```

- [ ] **Step 2: Verify no external consumers**

```bash
grep -rn "badgeVariants" /root/Work/flcn-website --include="*.ts" --include="*.tsx" | grep -v "components/ui/badge.tsx"
```
Expected: no output

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit 2>&1 | grep "badge"
```
Expected: no output

- [ ] **Step 4: Commit**

```bash
git add components/ui/badge.tsx
git commit -m "fix: make badgeVariants private — not used outside badge.tsx"
```

---

## Task 5: Fix only-export-components — extract buttonVariants

**Context:** `buttonVariants` is a CVA function currently defined and exported in `button.tsx`. `calendar.tsx` imports it. Moving it to its own file makes `button.tsx` export only components, fixing Fast Refresh for the Button module.

**Files:**
- Create: `components/ui/button-variants.ts`
- Modify: `components/ui/button.tsx` (remove inline definition, import from new file)
- Modify: `components/ui/calendar.tsx` (update import path)

- [ ] **Step 1: Create `components/ui/button-variants.ts`**

```ts
import { cva } from "class-variance-authority"

export const buttonVariants = cva(
  "inline-flex items-center justify-center font-mono text-xs uppercase tracking-widest whitespace-nowrap transition-all cursor-pointer select-none disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:     "bg-primary text-primary-foreground hover:brightness-90",
        outline:     "border border-border bg-background hover:bg-muted",
        secondary:   "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:       "hover:bg-muted hover:text-foreground",
        link:        "text-primary underline-offset-4 hover:underline",
        destructive: "bg-destructive text-white hover:bg-destructive/90",
      },
      size: {
        default: "h-8 px-3",
        xs:      "h-6 px-2 text-[10px]",
        sm:      "h-7 px-2.5",
        lg:      "h-10 px-5",
        icon:    "size-8 rounded-sm",
        "icon-xs": "size-6 rounded-sm",
        "icon-sm": "size-7 rounded-sm",
        "icon-lg": "size-9 rounded-sm",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
)
```

- [ ] **Step 2: Update `button.tsx` — replace inline definition with import**

At the top of `button.tsx`, add:
```ts
import { buttonVariants } from "@/components/ui/button-variants"
```

Remove the block starting with the comment `// ── buttonVariants —` through the closing `}` of the `cva(...)` call (lines ~213–242 in `button.tsx`).

Change the export line from:
```ts
export { Button, buttonVariants }
export type { ButtonProps }
```
to:
```ts
export { Button }
export { buttonVariants } from "@/components/ui/button-variants"
export type { ButtonProps }
```

- [ ] **Step 3: Update `calendar.tsx` — import buttonVariants from new location**

In `components/ui/calendar.tsx`, change:
```ts
import { Button, buttonVariants } from "@/components/ui/button"
```
to:
```ts
import { Button } from "@/components/ui/button"
import { buttonVariants } from "@/components/ui/button-variants"
```

- [ ] **Step 4: Verify TypeScript compiles**

```bash
npx tsc --noEmit 2>&1 | grep -E "button|calendar"
```
Expected: no output

- [ ] **Step 5: Commit**

```bash
git add components/ui/button-variants.ts components/ui/button.tsx components/ui/calendar.tsx
git commit -m "fix: extract buttonVariants to own file — fixes Fast Refresh for Button module"
```

---

## Task 6: Unexport generatePreviewPath

**Context:** `generatePreviewPath` is only used internally by `generatePreviewUrl` in the same file. Removing the export hides implementation detail.

**Files:**
- Modify: `lib/preview.ts:2`

- [ ] **Step 1: Remove export keyword**

Change line 2:
```ts
// Before
export function generatePreviewPath({

// After
function generatePreviewPath({
```

- [ ] **Step 2: Verify no external consumers**

```bash
grep -rn "generatePreviewPath" /root/Work/flcn-website --include="*.ts" --include="*.tsx" | grep -v "lib/preview.ts"
```
Expected: no output

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit 2>&1 | grep "preview"
```
Expected: no output

- [ ] **Step 4: Commit**

```bash
git add lib/preview.ts
git commit -m "fix: make generatePreviewPath private — used only within lib/preview.ts"
```

---

## Task 7: Refactor chip-filters.tsx dropdown state to useReducer

**Context:** The component has 5 `useState` calls and 4 cascading setState calls in a single effect. Four of the five state values all describe dropdown state and always change together. Combining them into a reducer fixes both `prefer-useReducer` and `no-cascading-set-state` warnings.

**Files:**
- Modify: `components/writing/chip-filters.tsx`

- [ ] **Step 1: Add reducer types and function above the ChipFilters component**

After the existing `SORT_OPTIONS` constant (around line 23), add:

```ts
type DropdownState = {
  results: Post[]
  open: boolean
  loading: boolean
  activeIndex: number
}

type DropdownAction =
  | { type: 'CLEAR' }
  | { type: 'LOADING' }
  | { type: 'RESULTS'; results: Post[] }
  | { type: 'OPEN' }
  | { type: 'CLOSE' }
  | { type: 'NAVIGATE'; direction: 1 | -1; max: number }

const initialDropdown: DropdownState = {
  results: [],
  open: false,
  loading: false,
  activeIndex: -1,
}

function dropdownReducer(state: DropdownState, action: DropdownAction): DropdownState {
  switch (action.type) {
    case 'CLEAR':
      return initialDropdown
    case 'LOADING':
      return { ...state, loading: true }
    case 'RESULTS':
      return { results: action.results, open: true, loading: false, activeIndex: -1 }
    case 'OPEN':
      return { ...state, open: true }
    case 'CLOSE':
      return { ...state, open: false, activeIndex: -1 }
    case 'NAVIGATE':
      return {
        ...state,
        activeIndex: Math.max(-1, Math.min(state.activeIndex + action.direction, action.max)),
      }
    default:
      return state
  }
}
```

- [ ] **Step 2: Replace the 4 dropdown useState calls with useReducer**

In the component body, change:
```ts
// Before (lines ~69-73)
const [dropdownResults, setDropdownResults] = useState<Post[]>([])
const [dropdownOpen, setDropdownOpen] = useState(false)
const [isLoading, setIsLoading] = useState(false)
const [activeIndex, setActiveIndex] = useState(-1)
const [isMac, setIsMac] = useState(true)

// After
const [dropdown, dispatch] = useReducer(dropdownReducer, initialDropdown)
const [isMac, setIsMac] = useState(true)
```

Also remove the `useState` import (keep `useReducer` and `useRef`, `useEffect`):
```ts
import { useEffect, useReducer, useRef, useState } from "react"
```

- [ ] **Step 3: Update the debounced search useEffect**

Replace lines ~92-111:
```ts
useEffect(() => {
  if (!search.trim()) {
    dispatch({ type: 'CLEAR' })
    return
  }
  const timer = setTimeout(async () => {
    dispatch({ type: 'LOADING' })
    try {
      const results = await fetchDropdownResults(search.trim())
      dispatch({ type: 'RESULTS', results })
    } catch {
      dispatch({ type: 'CLOSE' })
    }
  }, 300)
  return () => clearTimeout(timer)
}, [search])
```

- [ ] **Step 4: Update the outside-click useEffect**

Replace `setDropdownOpen(false)`:
```ts
useEffect(() => {
  const handler = (e: MouseEvent) => {
    if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
      dispatch({ type: 'CLOSE' })
    }
  }
  document.addEventListener("mousedown", handler)
  return () => document.removeEventListener("mousedown", handler)
}, [])
```

- [ ] **Step 5: Update `handleKeyDown`**

Replace lines ~124-140:
```ts
const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (!dropdown.open || dropdown.results.length === 0) return
  if (e.key === "ArrowDown") {
    e.preventDefault()
    dispatch({ type: 'NAVIGATE', direction: 1, max: dropdown.results.length - 1 })
  } else if (e.key === "ArrowUp") {
    e.preventDefault()
    dispatch({ type: 'NAVIGATE', direction: -1, max: dropdown.results.length - 1 })
  } else if (e.key === "Escape") {
    dispatch({ type: 'CLOSE' })
  } else if (e.key === "Enter" && dropdown.activeIndex >= 0) {
    e.preventDefault()
    const post = dropdown.results[dropdown.activeIndex]
    if (post) window.location.href = `/writing/${post.slug}`
  }
}
```

- [ ] **Step 6: Update JSX to use `dropdown.*` instead of individual state variables**

In the JSX (search input and dropdown):
- `dropdownResults` → `dropdown.results`
- `dropdownOpen` → `dropdown.open`
- `isLoading` → `dropdown.loading`
- `activeIndex` → `dropdown.activeIndex`

Input `onFocus` handler:
```tsx
onFocus={() => dropdown.results.length > 0 && dispatch({ type: 'OPEN' })}
```

Dropdown Link's `onClick`:
```tsx
onClick={() => {
  dispatch({ type: 'CLOSE' })
  onSearchChange("")
}}
```

The `i === activeIndex` comparison in the map:
```tsx
i === dropdown.activeIndex
```

- [ ] **Step 7: Verify TypeScript compiles**

```bash
npx tsc --noEmit 2>&1 | grep "chip-filters"
```
Expected: no output

- [ ] **Step 8: Run React Doctor to confirm score improvement**

```bash
npx react-doctor@latest --verbose --diff
```
Expected: `chip-filters.tsx` no longer triggers `prefer-useReducer` or `no-cascading-set-state`

- [ ] **Step 9: Commit**

```bash
git add components/writing/chip-filters.tsx
git commit -m "refactor: consolidate chip-filters dropdown state into useReducer"
```

---

## Final Validation

- [ ] **Run full React Doctor scan**

```bash
npx react-doctor@latest --verbose
```
Expected score: ≥ 80/100. The 8 errors should drop to 0 (badge + button only-export fixed; button-group / toggle / navigation-menu / tabs errors are in unused files and can only be removed once those files are deleted — track this with the user).

- [ ] **TypeScript clean build**

```bash
npx tsc --noEmit
```
Expected: no errors
