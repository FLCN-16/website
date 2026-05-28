"use client"

import { useState, useCallback, useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { FeaturedCard } from "@/components/writing/featured-card"
import { PostRow } from "@/components/writing/post-row"
import { ChipFilters, type SortOption, type ReadingTime } from "@/components/writing/chip-filters"
import type { Post } from "@/lib/types"

interface WritingListClientProps {
  initialPosts: Post[]
  heroPost: Post | null
  allTags: string[]
}

async function fetchPostsRemote(search: string, singleTag: string): Promise<Post[]> {
  const qs = new URLSearchParams()
  qs.set("where[status][equals]", "published")
  qs.set("limit", "50")
  qs.set("sort", "-publishedAt")
  qs.set("depth", "1")
  if (search) {
    qs.set("where[or][0][title][contains]", search)
    qs.set("where[or][1][excerpt][contains]", search)
  }
  if (singleTag) qs.set("where[tags.tag][equals]", singleTag)

  const res = await fetch(`/api/posts?${qs.toString()}`)
  if (!res.ok) throw new Error("Failed to fetch posts")
  const data = await res.json()
  return data.docs as Post[]
}

function applyLocalFilters(
  posts: Post[],
  tags: string[],
  readingTime: ReadingTime | null,
): Post[] {
  return posts.filter((post) => {
    if (tags.length > 0) {
      const postTags = post.tags?.map((t) => t.tag) ?? []
      if (!tags.some((tag) => postTags.includes(tag))) return false
    }
    if (readingTime) {
      if (post.readingTime == null) return false
      const rt = post.readingTime
      if (readingTime === "short" && rt > 5) return false
      if (readingTime === "medium" && (rt <= 5 || rt > 15)) return false
      if (readingTime === "long" && rt <= 15) return false
    }
    return true
  })
}

function applySorting(posts: Post[], sort: SortOption): Post[] {
  const copy = [...posts]
  if (sort === "newest") copy.sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""))
  if (sort === "oldest") copy.sort((a, b) => (a.publishedAt ?? "").localeCompare(b.publishedAt ?? ""))
  if (sort === "longest") copy.sort((a, b) => (b.readingTime ?? 0) - (a.readingTime ?? 0))
  if (sort === "shortest") copy.sort((a, b) => (a.readingTime ?? 0) - (b.readingTime ?? 0))
  return copy
}

function groupByYear(posts: Post[]): Array<{ year: string; posts: Post[] }> {
  const map = new Map<string, Post[]>()
  for (const post of posts) {
    const year = post.publishedAt
      ? new Date(post.publishedAt).getFullYear().toString()
      : "Unknown"
    if (!map.has(year)) map.set(year, [])
    map.get(year)!.push(post)
  }
  // Descending year order
  return Array.from(map.entries())
    .sort(([a], [b]) => {
      if (a === "Unknown") return 1
      if (b === "Unknown") return -1
      return b.localeCompare(a)
    })
    .map(([year, posts]) => ({ year, posts }))
}

export function WritingListClient({ initialPosts, heroPost, allTags }: WritingListClientProps) {
  const [search, setSearch] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedReadingTime, setSelectedReadingTime] = useState<ReadingTime | null>(null)
  const [sort, setSort] = useState<SortOption>("newest")

  const serverTag = selectedTags.length === 1 ? selectedTags[0] : ""
  const isServerFiltering = search.length > 0 || serverTag.length > 0

  const { data: serverPosts } = useQuery({
    queryKey: ["posts", search, serverTag],
    queryFn: () => fetchPostsRemote(search, serverTag),
    enabled: isServerFiltering,
    placeholderData: initialPosts,
  })

  const rawPosts = isServerFiltering ? (serverPosts ?? initialPosts) : initialPosts
  const filtered = applyLocalFilters(rawPosts, selectedTags, selectedReadingTime)
  const sorted = applySorting(filtered, sort)

  // Exclude hero from the row list to avoid duplication
  const rowPosts = heroPost
    ? sorted.filter((p) => p.id !== heroPost.id)
    : sorted

  const isFiltering = search.length > 0 || selectedTags.length > 0 || selectedReadingTime !== null
  const grouped = useMemo(
    () => (isFiltering || sort !== "newest" ? null : groupByYear(rowPosts)),
    [rowPosts, isFiltering, sort],
  )

  const activeFilterCount =
    selectedTags.length + (selectedReadingTime ? 1 : 0) + (search ? 1 : 0)

  const toggleTag = useCallback((tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    )
  }, [])

  const clearAll = useCallback(() => {
    setSearch("")
    setSelectedTags([])
    setSelectedReadingTime(null)
    setSort("newest")
  }, [])

  return (
    <div>
      <ChipFilters
        search={search}
        allTags={allTags}
        selectedTags={selectedTags}
        selectedReadingTime={selectedReadingTime}
        sort={sort}
        activeFilterCount={activeFilterCount}
        onSearchChange={setSearch}
        onTagToggle={toggleTag}
        onReadingTimeSelect={setSelectedReadingTime}
        onSortChange={setSort}
        onClearAll={clearAll}
      />

      {/* Featured hero — only when not actively filtering */}
      {!isFiltering && sort === "newest" && heroPost && (
        <div className="mt-8">
          <FeaturedCard post={heroPost} />
        </div>
      )}

      {/* Post list */}
      <div className="mt-8">
        {rowPosts.length === 0 ? (
          <p className="font-mono text-sm text-muted-foreground">
            No articles match your filters.
          </p>
        ) : grouped ? (
          /* Year-section layout (no active filter, newest sort) */
          grouped.map(({ year, posts: yearPosts }) => (
            <div key={year} className="mb-10">
              <div className="flex items-center gap-4 mb-2">
                <span className="font-mono text-sm font-medium text-muted-foreground">
                  {year}
                </span>
                <div className="flex-1 h-px bg-border" />
              </div>
              <div>
                {yearPosts.map((post) => (
                  <PostRow key={post.id} post={post} />
                ))}
              </div>
            </div>
          ))
        ) : (
          /* Flat list when filtering or sorting differently */
          <div>
            {rowPosts.map((post) => (
              <PostRow key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
