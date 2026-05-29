"use client"

import { useEffect, useRef, useState } from "react"
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

  const [dropdownResults, setDropdownResults] = useState<Post[]>([])
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const [isMac] = useState(() =>
    typeof navigator !== "undefined" && navigator.platform.toUpperCase().includes("MAC")
  )

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
        setDropdownResults([])
        setDropdownOpen(false)
        setActiveIndex(-1)
        return
      }
      setIsLoading(true)
      try {
        const results = await fetchDropdownResults(search.trim())
        setDropdownResults(results)
        setDropdownOpen(true)
        setActiveIndex(-1)
      } finally {
        setIsLoading(false)
      }
    }, delay)
    return () => clearTimeout(timer)
  }, [search])

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!dropdownOpen || dropdownResults.length === 0) return
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setActiveIndex((i) => Math.min(i + 1, dropdownResults.length - 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setActiveIndex((i) => Math.max(i - 1, -1))
    } else if (e.key === "Escape") {
      setDropdownOpen(false)
      setActiveIndex(-1)
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault()
      const post = dropdownResults[activeIndex]
      if (post) window.location.href = `/writing/${post.slug}`
    }
  }

  return (
    <div className="flex flex-col gap-3 py-4 border-y border-border">
      {/* Search row */}
      <div className="flex items-center gap-3">
        <div ref={containerRef} className="relative flex-1">
          <input
            ref={inputRef}
            placeholder="Search articles…"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => dropdownResults.length > 0 && setDropdownOpen(true)}
            className="w-full font-mono text-sm h-8 min-w-0 bg-transparent px-2.5 py-1 text-xs outline-none placeholder:text-muted-foreground transition-colors pr-14"
          />
          {!search && (
            <KbdGroup className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
              <Kbd>{isMac ? "⌘" : "Ctrl"}</Kbd>
              <Kbd>S</Kbd>
            </KbdGroup>
          )}

          {/* Dropdown */}
          {dropdownOpen && (
            <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-background border border-border rounded-md shadow-lg overflow-hidden">
              {isLoading ? (
                <div className="px-3 py-2 font-mono text-xs text-muted-foreground">
                  Searching…
                </div>
              ) : dropdownResults.length === 0 ? (
                <div className="px-3 py-2 font-mono text-xs text-muted-foreground">
                  No results for &ldquo;{search}&rdquo;
                </div>
              ) : (
                dropdownResults.map((post, i) => (
                  <Link
                    key={post.id}
                    href={`/writing/${post.slug}`}
                    onClick={() => {
                      setDropdownOpen(false)
                      onSearchChange("")
                    }}
                    className={cn(
                      "flex flex-col gap-0.5 px-3 py-2 transition-colors",
                      i === activeIndex
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
        {/* Tag chips */}
        {allTags.map((tag) => {
          const active = selectedTags.includes(tag)
          return (
            <button
              type="button"
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
