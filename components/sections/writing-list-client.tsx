"use client"

import { useState, useCallback } from "react"
import { useQuery } from "@tanstack/react-query"
import { Input } from "@/components/ui/input"
import { BentoCard, type Post } from "@/components/writing/bento-card"
import { FilterPanel, type ReadingTime } from "@/components/writing/filter-panel"
import { FilterDrawer } from "@/components/writing/filter-drawer"

interface WritingListClientProps {
  initialPosts: Post[]
  allTags: string[]
  allYears: string[]
}

async function fetchPosts(search: string, singleTag: string): Promise<Post[]> {
  const qs = new URLSearchParams()
  qs.set("where[status][equals]", "published")
  qs.set("limit", "50")
  qs.set("sort", "-publishedAt")
  if (search) qs.set("where[title][contains]", search)
  if (singleTag) qs.set("where[tags.tag][equals]", singleTag)

  const res = await fetch(`/api/posts?${qs.toString()}`)
  if (!res.ok) throw new Error("Failed to fetch posts")
  const data = await res.json()
  return data.docs as Post[]
}

function applyLocalFilters(
  posts: Post[],
  tags: string[],
  year: string | null,
  readingTime: ReadingTime | null,
): Post[] {
  return posts.filter((post) => {
    if (tags.length > 1) {
      const postTags = post.tags?.map((t) => t.tag) ?? []
      if (!tags.some((tag) => postTags.includes(tag))) return false
    }

    if (year) {
      if (!post.publishedAt) return false
      if (new Date(post.publishedAt).getFullYear().toString() !== year) return false
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

export function WritingListClient({ initialPosts, allTags, allYears }: WritingListClientProps) {
  const [search, setSearch] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedYear, setSelectedYear] = useState<string | null>(null)
  const [selectedReadingTime, setSelectedReadingTime] = useState<ReadingTime | null>(null)

  const serverTag = selectedTags.length === 1 ? selectedTags[0] : ""
  const isServerFiltering = search.length > 0 || serverTag.length > 0

  const { data: serverPosts } = useQuery({
    queryKey: ["posts", search, serverTag],
    queryFn: () => fetchPosts(search, serverTag),
    enabled: isServerFiltering,
    placeholderData: initialPosts,
  })

  const rawPosts = isServerFiltering ? (serverPosts ?? initialPosts) : initialPosts
  const posts = applyLocalFilters(rawPosts, selectedTags, selectedYear, selectedReadingTime)

  const activeFilterCount =
    selectedTags.length + (selectedYear ? 1 : 0) + (selectedReadingTime ? 1 : 0)

  const toggleTag = useCallback((tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    )
  }, [])

  const clearAll = useCallback(() => {
    setSelectedTags([])
    setSelectedYear(null)
    setSelectedReadingTime(null)
  }, [])

  const filterProps = {
    allTags,
    allYears,
    selectedTags,
    selectedYear,
    selectedReadingTime,
    activeFilterCount,
    onTagToggle: toggleTag,
    onYearSelect: setSelectedYear,
    onReadingTimeSelect: setSelectedReadingTime,
    onClearAll: clearAll,
  }

  const [heroPost, ...restPosts] = posts

  return (
    <div>
      {/* Search */}
      <Input
        placeholder="Search articles…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full font-mono text-sm"
      />

      {/* Mobile filter trigger */}
      <div className="flex justify-end mt-3 md:hidden">
        <FilterDrawer {...filterProps} />
      </div>

      {/* Two-zone layout */}
      <div className="flex gap-10 items-start mt-8">
        {/* Bento masonry */}
        <div className="flex-1 min-w-0">
          {posts.length === 0 ? (
            <p className="font-mono text-sm text-muted-foreground">
              No articles match your filters.
            </p>
          ) : (
            <>
              {/* Hero card */}
              {heroPost && <BentoCard post={heroPost} variant="hero" />}

              {/* Masonry grid */}
              {restPosts.length > 0 && (
                <div className="mt-4 columns-1 sm:columns-2 gap-4">
                  {restPosts.map((post) => (
                    <div key={post.id} className="break-inside-avoid mb-4">
                      <BentoCard post={post} />
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Desktop filter sidebar */}
        <aside className="hidden md:block sticky top-6 w-52 shrink-0">
          <FilterPanel {...filterProps} />
        </aside>
      </div>
    </div>
  )
}
