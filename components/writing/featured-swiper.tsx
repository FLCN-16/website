"use client"

import { useState, useRef } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { A11y, Keyboard, Autoplay } from "swiper/modules"
import type { Swiper as SwiperType } from "swiper"
import { FeaturedCard } from "./featured-card"
import type { Post } from "@/lib/types"
import "swiper/css"

interface FeaturedSwiperProps {
  posts: Post[]
}

export function FeaturedSwiper({ posts }: FeaturedSwiperProps) {
  const [current, setCurrent] = useState(0)
  const swiperRef = useRef<SwiperType | null>(null)

  if (posts.length === 0) return null
  if (posts.length === 1) return <FeaturedCard post={posts[0]} wide />

  return (
    <div className="space-y-3 w-full min-w-0">
      <div className="relative w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden">
        <Swiper
          modules={[A11y, Keyboard, Autoplay]}
          keyboard={{ enabled: true }}
          slidesPerView={1}
          loop
          autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
          onSwiper={(s) => { swiperRef.current = s }}
          onSlideChange={(s) => setCurrent(s.realIndex)}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        >
          {posts.map((post) => (
            <SwiperSlide key={post.id}>
              <FeaturedCard post={post} wide />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Pill indicators + counter */}
      <div className="flex items-center justify-between px-1">
        <div className="flex gap-1.5 items-center">
          {posts.map((post, i) => (
            <button
              key={post.id}
              type="button"
              onClick={() => swiperRef.current?.slideToLoop(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-1 rounded-full transition-all duration-300 cursor-pointer ${
                i === current
                  ? "w-6 bg-foreground"
                  : "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/60"
              }`}
            />
          ))}
        </div>
        <span className="font-mono text-xs text-muted-foreground tabular-nums">
          {String(current + 1).padStart(2, "0")} / {String(posts.length).padStart(2, "0")}
        </span>
      </div>
    </div>
  )
}
