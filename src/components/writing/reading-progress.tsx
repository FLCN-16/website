"use client"

import { useEffect, useRef } from "react"

export function ReadingProgress() {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let rafId: number | null = null

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
      })
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      if (rafId !== null) cancelAnimationFrame(rafId)
    }
  }, [])

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
