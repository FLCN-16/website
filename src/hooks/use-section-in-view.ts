"use client"
import { useCallback, useRef, useState } from "react"

export function useSectionInView(threshold = 0.15) {
  const [inView, setInView] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)

  const ref = useCallback(
    (node: HTMLElement | null) => {
      if (observerRef.current) {
        observerRef.current.disconnect()
        observerRef.current = null
      }
      if (!node) return
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setInView(true)
            observer.disconnect()
          }
        },
        { threshold }
      )
      observer.observe(node)
      observerRef.current = observer
    },
    [threshold]
  )

  return { ref, inView }
}
