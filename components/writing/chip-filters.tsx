"use client"

import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export type SortOption = "newest" | "oldest" | "longest" | "shortest"
export type ReadingTime = "short" | "medium" | "long"

const READING_TIME_OPTIONS: Array<{ value: ReadingTime; label: string }> = [
  { value: "short", label: "<5m" },
  { value: "medium", label: "5–15m" },
  { value: "long", label: ">15m" },
]

const SORT_OPTIONS: Array<{ value: SortOption; label: string }> = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "longest", label: "Longest" },
  { value: "shortest", label: "Shortest" },
]

export interface ChipFiltersProps {
  search: string
  allTags: string[]
  selectedTags: string[]
  selectedReadingTime: ReadingTime | null
  sort: SortOption
  activeFilterCount: number
  onSearchChange: (value: string) => void
  onTagToggle: (tag: string) => void
  onReadingTimeSelect: (rt: ReadingTime | null) => void
  onSortChange: (sort: SortOption) => void
  onClearAll: () => void
}

export function ChipFilters({
  search,
  allTags,
  selectedTags,
  selectedReadingTime,
  sort,
  activeFilterCount,
  onSearchChange,
  onTagToggle,
  onReadingTimeSelect,
  onSortChange,
  onClearAll,
}: ChipFiltersProps) {
  return (
    <div className="flex flex-col gap-3 py-4 border-y border-border">
      {/* Search row */}
      <div className="flex items-center gap-3">
        <Input
          placeholder="Search articles…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="max-w-xs font-mono text-sm"
        />

        {/* Sort */}
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className="ml-auto font-mono text-xs bg-transparent border border-border rounded-full px-3 py-1.5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          {SORT_OPTIONS.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>

        {activeFilterCount > 0 && (
          <button
            onClick={onClearAll}
            className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors shrink-0"
          >
            Clear ({activeFilterCount})
          </button>
        )}
      </div>

      {/* Chips row */}
      {(allTags.length > 0 || true) && (
        <div className="flex flex-wrap gap-2 items-center">
          {/* Tag chips */}
          {allTags.map((tag) => {
            const active = selectedTags.includes(tag)
            return (
              <button
                key={tag}
                onClick={() => onTagToggle(tag)}
                className={cn(
                  "rounded-full border px-2.5 py-1 font-mono text-xs transition-colors",
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-muted-foreground hover:text-foreground",
                )}
              >
                {tag}
              </button>
            )
          })}

          {/* Divider between tags and reading time */}
          {allTags.length > 0 && (
            <span className="text-border select-none">|</span>
          )}

          {/* Reading time chips */}
          {READING_TIME_OPTIONS.map(({ value, label }) => {
            const active = selectedReadingTime === value
            return (
              <button
                key={value}
                onClick={() => onReadingTimeSelect(active ? null : value)}
                className={cn(
                  "rounded-full border px-2.5 py-1 font-mono text-xs transition-colors",
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-muted-foreground hover:text-foreground",
                )}
              >
                {label}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
