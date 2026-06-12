'use client'

import { useEffect } from 'react'
import { trackEvent } from '@/lib/analytics'

interface SectionTrackerProps {
  sections: string[]
  page?: string
}

export function SectionTracker({ sections, page = '/' }: SectionTrackerProps) {
  useEffect(() => {
    const remaining = new Set(sections)

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const id = entry.target.id
          if (!remaining.has(id)) continue
          remaining.delete(id)
          observer.unobserve(entry.target)
          trackEvent({ event: 'section_view', section_id: id, page })
        }
        if (remaining.size === 0) observer.disconnect()
      },
      { threshold: 0.3 },
    )

    for (const id of sections) {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    }

    return () => observer.disconnect()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return null
}
