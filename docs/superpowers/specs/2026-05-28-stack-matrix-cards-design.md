# Stack Matrix — Discipline Cards Redesign

## Problem

The current `StackMatrix` renders a flat table with 40+ rows. The discipline column repeats the same name for every tool row (with a faded ghost for subsequent rows), which reads as broken and visually cluttered.

## Goal

Replace the flat table with a responsive card grid where each discipline is its own card, making the matrix scannable and visually grouped.

## Design

### Layout

- Responsive CSS grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4`
- One card per discipline (7 disciplines total)

### Card Structure

Each card uses the existing design token `bg-card border border-border rounded-lg p-4`:

1. **Header** — discipline name styled `font-mono text-xs uppercase tracking-widest text-muted-foreground mb-3`
2. **Tool rows** — each tool is a row with `border-b border-border` separator (last row has no border). Two columns:
   - Left: tool name in `font-mono text-xs`
   - Right: `MaturityDots` component (unchanged)

### MaturityDots

Unchanged — `●●●` expert, `●●○` proficient, `●○○` learning with `text-primary` / `text-muted-foreground` coloring.

### Unchanged

- `StackSection` badge grid above the matrix — untouched
- `content/stack.ts` data — untouched
- `MaturityDots` component — untouched

## Scope

Single file change: `components/sections/stack-matrix.tsx`. No data, API, or layout changes.
