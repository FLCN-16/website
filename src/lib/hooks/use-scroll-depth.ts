'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { trackEvent } from '@/lib/analytics'

const DEFAULT_THRESHOLDS = [25, 50, 75, 100] as const

/** Returns thresholds in `thresholds` that `pct` has reached but are not in `fired`. */
export function crossedThresholds(
  pct: number,
  thresholds: number[],
  fired: Set<number>,
): number[] {
  return thresholds.filter((t) => pct >= t && !fired.has(t))
}

export function useScrollDepth(thresholds: number[] = [...DEFAULT_THRESHOLDS]): void {
  const pathname = usePathname()
  const thresholdsRef = useRef(thresholds)
  thresholdsRef.current = thresholds

  useEffect(() => {
    const fired = new Set<number>()
    const ts = thresholdsRef.current
    let rafId: number | null = null

    function onScroll() {
      if (rafId !== null) return
      rafId = requestAnimationFrame(() => {
        rafId = null
        const el = document.documentElement
        const total = el.scrollHeight - el.clientHeight
        if (total <= 0) return
        const pct = (el.scrollTop / total) * 100
        for (const depth of crossedThresholds(pct, ts, fired)) {
          fired.add(depth)
          trackEvent({ event: 'scroll_depth', depth: depth as 25 | 50 | 75 | 100, page: pathname })
        }
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (rafId !== null) cancelAnimationFrame(rafId)
    }
  }, [pathname]) // reset fired Set on every page navigation
}
