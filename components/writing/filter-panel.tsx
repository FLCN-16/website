// components/writing/filter-panel.tsx
"use client"

import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

export type ReadingTime = "short" | "medium" | "long"

export interface FilterPanelProps {
  allTags: string[]
  allYears: string[]
  selectedTags: string[]
  selectedYear: string | null
  selectedReadingTime: ReadingTime | null
  activeFilterCount: number
  onTagToggle: (tag: string) => void
  onYearSelect: (year: string | null) => void
  onReadingTimeSelect: (rt: ReadingTime | null) => void
  onClearAll: () => void
}

const READING_TIME_OPTIONS: Array<{ value: ReadingTime; label: string }> = [
  { value: "short", label: "Short  <5m" },
  { value: "medium", label: "Medium  5–15m" },
  { value: "long", label: "Long  >15m" },
]

export function FilterPanel({
  allTags,
  allYears,
  selectedTags,
  selectedYear,
  selectedReadingTime,
  activeFilterCount,
  onTagToggle,
  onYearSelect,
  onReadingTimeSelect,
  onClearAll,
}: FilterPanelProps) {
  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
        </span>
        {activeFilterCount > 0 && (
          <button
            onClick={onClearAll}
            className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      <Separator />

      {/* Tags */}
      <div className="flex flex-col gap-3">
        <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Tags
        </span>
        <div className="flex flex-wrap gap-2">
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
          {allTags.length === 0 && (
            <span className="font-mono text-xs text-muted-foreground">No tags yet</span>
          )}
        </div>
      </div>

      {allYears.length > 0 && (
        <>
          <Separator />
          {/* Year */}
          <div className="flex flex-col gap-2">
            <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              Year
            </span>
            <ul className="flex flex-col gap-1">
              {allYears.map((year) => (
                <li key={year}>
                  <button
                    onClick={() => onYearSelect(year === selectedYear ? null : year)}
                    className={cn(
                      "font-mono text-sm transition-colors",
                      selectedYear === year
                        ? "font-medium text-primary"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {year}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}

      <Separator />

      {/* Reading Time */}
      <div className="flex flex-col gap-3">
        <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Reading Time
        </span>
        <div className="flex flex-col gap-1.5">
          {READING_TIME_OPTIONS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() =>
                onReadingTimeSelect(value === selectedReadingTime ? null : value)
              }
              className={cn(
                "text-left font-mono text-sm transition-colors",
                selectedReadingTime === value
                  ? "font-medium text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
