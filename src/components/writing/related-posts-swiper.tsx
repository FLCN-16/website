"use client"

import { useState, useRef } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { A11y, Keyboard } from "swiper/modules"
import type { Swiper as SwiperType } from "swiper"
import { PostCard } from "./post-card"
import type { Post } from "@/lib/types"
import "swiper/css"

interface RelatedPostsSwiperProps {
  posts: Post[]
}

export function RelatedPostsSwiper({ posts }: RelatedPostsSwiperProps) {
  const swiperRef = useRef<SwiperType | null>(null)
  const [current, setCurrent] = useState(0)
  const [isBeginning, setIsBeginning] = useState(true)
  const [isEnd, setIsEnd] = useState(false)

  if (posts.length === 0) return null

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
          {posts.map((post, i) => (
            <button
              key={post.id}
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
