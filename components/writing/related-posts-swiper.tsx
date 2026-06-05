"use client"

import { useState, useRef } from "react"
import { useQuery } from "@tanstack/react-query"
import { Swiper, SwiperSlide } from "swiper/react"
import { A11y, Keyboard } from "swiper/modules"
import type { Swiper as SwiperType } from "swiper"
import { PostCard } from "./post-card"
import type { Post } from "@/lib/types"
import "swiper/css"

interface RelatedPostsSwiperProps {
  currentSlug: string
  tags: string[]
}

async function fetchRelatedPosts(slug: string, tags: string[]): Promise<Post[]> {
  const params = new URLSearchParams({
    "where[and][0][status][equals]": "published",
    "where[and][1][slug][not_equals]": slug,
    "sort": "-publishedAt",
    "limit": "9",
    "depth": "1",
  })
  if (tags.length > 0) {
    params.set("where[and][2][tags.tag][in]", tags.join(","))
  }
  const res = await fetch(`/api/posts?${params}`)
  if (!res.ok) throw new Error("Failed to fetch related posts")
  const data = await res.json()
  return data.docs as Post[]
}

function SkeletonCard() {
  return (
    <div className="border border-border overflow-hidden animate-pulse">
      <div className="aspect-[16/9] bg-muted" />
      <div className="p-4 flex flex-col gap-2">
        <div className="h-2.5 w-16 bg-muted rounded" />
        <div className="h-4 w-full bg-muted rounded" />
        <div className="h-4 w-3/4 bg-muted rounded" />
        <div className="h-2.5 w-24 bg-muted rounded mt-2 pt-2 border-t border-border/60" />
      </div>
    </div>
  )
}

export function RelatedPostsSwiper({ currentSlug, tags }: RelatedPostsSwiperProps) {
  const swiperRef = useRef<SwiperType | null>(null)
  const [current, setCurrent] = useState(0)
  const [isBeginning, setIsBeginning] = useState(true)
  const [isEnd, setIsEnd] = useState(false)

  const { data: posts, isLoading } = useQuery({
    queryKey: ["related-posts", currentSlug, tags],
    queryFn: () => fetchRelatedPosts(currentSlug, tags),
    staleTime: 60_000,
  })

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    )
  }

  if (!posts || posts.length === 0) return null

  function updateNavState(swiper: SwiperType) {
    setIsBeginning(swiper.isBeginning)
    setIsEnd(swiper.isEnd)
    setCurrent(swiper.realIndex)
  }

  return (
    <div className="space-y-4 w-full min-w-0">
      <Swiper
        modules={[A11y, Keyboard]}
        keyboard={{ enabled: true }}
        slidesPerView={1}
        spaceBetween={16}
        breakpoints={{
          640: { slidesPerView: 2, spaceBetween: 20 },
          1024: { slidesPerView: 3, spaceBetween: 24 },
        }}
        onSwiper={(s) => {
          swiperRef.current = s
          updateNavState(s)
        }}
        onSlideChange={updateNavState}
        className="w-full min-w-0"
      >
        {posts.map((post) => (
          <SwiperSlide key={post.id} className="h-auto self-stretch">
            <PostCard post={post} className="h-full" />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Controls */}
      <div className="flex items-center justify-between px-0.5">
        <div className="flex gap-1.5 items-center">
          {posts.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => swiperRef.current?.slideTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-1 rounded-full transition-all duration-300 cursor-pointer ${
                i === current
                  ? "w-6 bg-foreground"
                  : "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/60"
              }`}
            />
          ))}
        </div>

        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-muted-foreground tabular-nums">
            {String(current + 1).padStart(2, "0")} / {String(posts.length).padStart(2, "0")}
          </span>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => swiperRef.current?.slidePrev()}
              disabled={isBeginning}
              aria-label="Previous"
              className="font-mono text-sm text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-200 px-1"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => swiperRef.current?.slideNext()}
              disabled={isEnd}
              aria-label="Next"
              className="font-mono text-sm text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-200 px-1"
            >
              →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
