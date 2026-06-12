"use client"

import { useEffect, useRef } from "react"
import { trackEvent } from "@/lib/analytics"

const MILESTONES = [25, 50, 75, 100] as const

interface ReadingProgressProps {
  slug?: string
}

export function ReadingProgress({ slug }: ReadingProgressProps) {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let rafId: number | null = null
    const fired = new Set<number>()

    function onScroll() {
      if (rafId !== null) return
      rafId = requestAnimationFrame(() => {
        rafId = null
        const el = document.documentElement
        const total = el.scrollHeight - el.clientHeight
        const pct = total > 0 ? (el.scrollTop / total) * 100 : 0
        if (barRef.current) {
          barRef.current.style.width = `${pct}%`
          barRef.current.setAttribute("aria-valuenow", String(Math.round(pct)))
        }
        if (slug) {
          for (const milestone of MILESTONES) {
            if (pct >= milestone && !fired.has(milestone)) {
              fired.add(milestone)
              trackEvent({ event: 'post_read_milestone', slug, milestone })
            }
          }
        }
      })
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      if (rafId !== null) cancelAnimationFrame(rafId)
    }
  }, [slug])

  return (
    <div
      ref={barRef}
      role="progressbar"
      aria-valuenow={0}
      aria-valuemin={0}
      aria-valuemax={100}
      className="fixed top-0 left-0 z-50 h-[2px] bg-primary"
      style={{ width: "0%" }}
    />
  )
}
