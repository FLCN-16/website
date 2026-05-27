# Writing Listing Page — Redesign Spec

**Date:** 2026-05-27
**Status:** Approved

---

## Overview

Redesign the `/writing` listing page with improved UI/UX: a prominent search bar, a masonry bento grid of post cards, and a persistent filter sidebar (desktop) / bottom drawer (mobile) supporting tag, year, and reading-time filters.

---

## 1. Page Layout

Two zones below the existing page header ("Writing / Articles & Thoughts"):

```
┌─────────────────────────────────────────────────────┐
│  [  Search articles…                            🔍 ] │  ← full width
├───────────────────────────────────┬─────────────────┤
│                                   │                 │
│   Masonry Bento Grid (~70%)       │  Filter Sidebar │
│                                   │  (~30%, sticky) │
│                                   │                 │
└───────────────────────────────────┴─────────────────┘
```

**Mobile (`< md`):** Single column. Search stays at top. A right-aligned `"Filters (n)"` pill button sits below the search bar and opens a bottom drawer. Masonry collapses to 1 column.

---

## 2. Search Bar

- Full-width input with search icon, placeholder `"Search articles…"`
- Debounced 300ms, filters posts by title match
- Works in conjunction with sidebar filters (AND logic — all active filters apply simultaneously)
- Stays in the top header area, not inside the filter sidebar

---

## 3. Masonry Bento Grid

### Layout

- CSS `columns: 2` within the grid area (SSR-safe, no JS library)
- `break-inside: avoid` on each card
- Latest post renders as a **full-width hero card above** the masonry columns
- Mobile: `columns: 1`, hero card remains above

```
┌─────────────────────────────────────┐
│  HERO CARD (full width, tinted)     │
└─────────────────────────────────────┘
┌──────────────┐  ┌──────────────────┐
│ Card A       │  │ Card B           │
│ (tall)       │  │ (short)          │
│              │  ├──────────────────┤
│              │  │ Card C           │
├──────────────┤  │ (medium)         │
│ Card D       │  │                  │
└──────────────┘  └──────────────────┘
```

Card heights vary organically by content — no fixed sizing.

### Hero Card

- Background: `bg-primary/5 border-primary/20` (faint cyan tint)
- Title: `text-2xl`, semibold
- Excerpt: 3 lines visible
- All tags shown
- Date + reading time in meta row

### Standard Cards

- Background: `bg-background border-border`
- Title: `text-lg`, semibold
- Excerpt: 2 lines visible
- Up to 2 tags shown
- Date + reading time in meta row

### Hover State (all cards)

- `shadow-md` lift
- Title color → `text-primary`
- Transition: `duration-200 ease-out`

### Graceful Degradation

- ≤ 2 filtered results: equal-width medium cards, no hero
- 1 result: single full-width card
- 0 results: empty state message ("No articles match your filters.")

---

## 4. Filter Sidebar

### Desktop (sticky right panel, ~240px)

```
┌─────────────────────────┐
│ Filters          Clear  │
├─────────────────────────┤
│ TAGS                    │
│ [design] [systems]      │
│ [performance] [dx] ...  │
├─────────────────────────┤
│ YEAR                    │
│ ○ 2025                  │
│ ○ 2024                  │
│ ○ 2023                  │
├─────────────────────────┤
│ READING TIME            │
│ [Short <5m]             │
│ [Medium 5–15m]          │
│ [Long >15m]             │
└─────────────────────────┘
```

- **Tags:** Multi-select chip toggles. Active = `bg-primary text-primary-foreground`
- **Year:** Single-select radio-style list. Years derived from published post dates
- **Reading time:** Single-select three-button group. Ranges: short ≤5 min, medium 6–15 min, long >15 min
- **"Filters" header:** Shows active filter count badge when any filter is active
- **"Clear" link:** Appears only when ≥1 filter active; resets all filters
- Label style: mono, xs, uppercase, muted-foreground (matches site conventions)

### Mobile (bottom drawer)

- `"Filters (n)"` pill button below search bar, right-aligned
- `n` = total active filter count; hidden when 0
- Tapping opens a `<Sheet>` (bottom) with the same `FilterPanel` UI inside
- "Apply" button at bottom of drawer closes it

---

## 5. API / Data Changes

**`/api/posts` query params (new):**

| Param | Type | Behavior |
|---|---|---|
| `year` | `string` (e.g. `"2025"`) | Filter posts where `publishedAt` year matches |
| `readingTime` | `"short" \| "medium" \| "long"` | short ≤5, medium 6–15, long >15 |

Existing params (`search`, `tag`) remain unchanged.

All filtering is **server-side**: `WritingListClient` uses React Query to call `/api/posts` with the active filter params as query string. No client-side array filtering.

**Server component (`writing/page.tsx`):** Extract unique years from fetched posts and pass to client as `years: string[]`.

---

## 6. Component Structure

### Modified Files

| File | Change |
|---|---|
| `app/(site)/writing/page.tsx` | Extract `years[]` from posts, pass to `WritingList` |
| `components/sections/writing-list.tsx` | Accept + forward `years` prop to client component |
| `components/sections/writing-list-client.tsx` | Full rework: two-zone layout, masonry grid, filter state, mobile drawer trigger |

### New Files

| File | Purpose |
|---|---|
| `components/writing/bento-card.tsx` | Single post card; `variant="hero" \| "standard"` prop |
| `components/writing/filter-panel.tsx` | Filter UI (tags, year, reading time); shared between desktop sidebar and mobile drawer |
| `components/writing/filter-drawer.tsx` | Mobile bottom sheet wrapping `FilterPanel` |

### State (lives in `writing-list-client.tsx`)

```ts
const [search, setSearch] = useState("")
const [selectedTags, setSelectedTags] = useState<string[]>([])
const [selectedYear, setSelectedYear] = useState<string | null>(null)
const [selectedReadingTime, setSelectedReadingTime] = useState<"short" | "medium" | "long" | null>(null)
```

All state passed as props + callbacks into `FilterPanel`.

---

## 7. Out of Scope

- Post images / cover photos (no image field on current cards)
- Sorting options (newest-first is sufficient for now)
- Pagination (50-post limit from Payload is adequate)
- Animated masonry reflow on filter change
