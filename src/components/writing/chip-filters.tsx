"use client"

import { useEffect, useReducer, useRef } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Kbd, KbdGroup } from "@/components/ui/kbd"
import type { Post } from "@/lib/types"

export type SortOption = "newest" | "oldest" | "longest" | "shortest"
export type ReadingTime = "short" | "medium" | "long"

const READING_TIME_OPTIONS: Array<{ value: ReadingTime; label: string; sub: string }> = [
  { value: "short", label: "Quick read", sub: "<5 min" },
  { value: "medium", label: "Medium read", sub: "5–15 min" },
  { value: "long", label: "Long read", sub: ">15 min" },
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

const isMac = typeof navigator !== "undefined" && navigator.platform.toUpperCase().includes("MAC")

type DropdownState = {
  results: Post[]
  open: boolean
  loading: boolean
  activeIndex: number
}

type DropdownAction =
  | { type: "SEARCH_START" }
  | { type: "SEARCH_CLEAR" }
  | { type: "SEARCH_DONE"; results: Post[] }
  | { type: "CLOSE" }
  | { type: "OPEN_IF_HAS_RESULTS" }
  | { type: "MOVE_DOWN" }
  | { type: "MOVE_UP" }

const initialDropdown: DropdownState = { results: [], open: false, loading: false, activeIndex: -1 }

function dropdownReducer(state: DropdownState, action: DropdownAction): DropdownState {
  switch (action.type) {
    case "SEARCH_START":      return { ...state, loading: true }
    case "SEARCH_CLEAR":      return initialDropdown
    case "SEARCH_DONE":       return { results: action.results, open: true, loading: false, activeIndex: -1 }
    case "CLOSE":             return { ...state, open: false, activeIndex: -1 }
    case "OPEN_IF_HAS_RESULTS": return state.results.length > 0 ? { ...state, open: true } : state
    case "MOVE_DOWN":         return { ...state, activeIndex: Math.min(state.activeIndex + 1, state.results.length - 1) }
    case "MOVE_UP":           return { ...state, activeIndex: Math.max(state.activeIndex - 1, -1) }
  }
}

async function fetchDropdownResults(query: string): Promise<Post[]> {
  const qs = new URLSearchParams()
  qs.set("where[status][equals]", "published")
  qs.set("limit", "6")
  qs.set("sort", "-publishedAt")
  qs.set("depth", "1")
  qs.set("where[or][0][title][contains]", query)
  qs.set("where[or][1][excerpt][contains]", query)
  const res = await fetch(`/api/posts?${qs.toString()}`)
  if (!res.ok) return []
  const data = await res.json()
  return data.docs as Post[]
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
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [dropdown, dispatch] = useReducer(dropdownReducer, initialDropdown)

  // Cmd/Ctrl+S focuses the input
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [])

  // Debounce search → fetch dropdown results
  useEffect(() => {
    const delay = search.trim() ? 300 : 0
    const timer = setTimeout(async () => {
      if (!search.trim()) {
        dispatch({ type: "SEARCH_CLEAR" })
        return
      }
      dispatch({ type: "SEARCH_START" })
      const results = await fetchDropdownResults(search.trim())
      dispatch({ type: "SEARCH_DONE", results })
    }, delay)
    return () => clearTimeout(timer)
  }, [search])

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        dispatch({ type: "CLOSE" })
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!dropdown.open || dropdown.results.length === 0) return
    if (e.key === "ArrowDown") {
      e.preventDefault()
      dispatch({ type: "MOVE_DOWN" })
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      dispatch({ type: "MOVE_UP" })
    } else if (e.key === "Escape") {
      dispatch({ type: "CLOSE" })
    } else if (e.key === "Enter" && dropdown.activeIndex >= 0) {
      e.preventDefault()
      const post = dropdown.results[dropdown.activeIndex]
      if (post) window.location.href = `/writing/${post.slug}`
    }
  }

  return (
    <div className="flex flex-col gap-3 py-4 border-y border-border -mx-6 px-6 md:-mx-12 md:px-12">
      {/* Search row */}
      <div className="flex items-center gap-3">
        <div ref={containerRef} className="relative flex-1">
          <input
            ref={inputRef}
            aria-label="Search articles"
            placeholder="Search articles…"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => dispatch({ type: "OPEN_IF_HAS_RESULTS" })}
            className="w-full font-mono text-sm h-8 min-w-0 bg-transparent px-2.5 py-1 text-xs outline-none placeholder:text-muted-foreground transition-colors pr-14"
          />
          {!search && (
            <KbdGroup className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
              <Kbd>{isMac ? "⌘" : "Ctrl"}</Kbd>
              <Kbd>S</Kbd>
            </KbdGroup>
          )}

          {/* Dropdown */}
          {dropdown.open && (
            <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-background border border-border rounded-md shadow-lg overflow-hidden">
              {dropdown.loading ? (
                <div className="px-3 py-2 font-mono text-xs text-muted-foreground">
                  Searching…
                </div>
              ) : dropdown.results.length === 0 ? (
                <div className="px-3 py-2 font-mono text-xs text-muted-foreground">
                  No results for &ldquo;{search}&rdquo;
                </div>
              ) : (
                dropdown.results.map((post, i) => (
                  <Link
                    key={post.id}
                    href={`/writing/${post.slug}`}
                    onClick={() => {
                      dispatch({ type: "CLOSE" })
                      onSearchChange("")
                    }}
                    className={cn(
                      "flex flex-col gap-0.5 px-3 py-2 transition-colors",
                      i === dropdown.activeIndex
                        ? "bg-muted text-foreground"
                        : "hover:bg-muted/60 text-foreground",
                    )}
                  >
                    <span className="font-mono text-xs font-medium truncate">{post.title}</span>
                    {post.excerpt && (
                      <span className="font-mono text-xs text-muted-foreground truncate">
                        {post.excerpt}
                      </span>
                    )}
                  </Link>
                ))
              )}
            </div>
          )}
        </div>

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
            type="button"
            onClick={onClearAll}
            className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors shrink-0"
          >
            Clear ({activeFilterCount})
          </button>
        )}
      </div>

      {/* Chips row — always rendered so reading-time chips are always visible */}
      <div className="flex flex-wrap gap-2 items-center">
        {/* Reading time chips */}
        {READING_TIME_OPTIONS.map(({ value, label, sub }) => {
          const active = selectedReadingTime === value
          return (
            <button
              type="button"
              key={value}
              title={sub}
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
    </div>
  )
}
