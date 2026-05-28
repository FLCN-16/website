"use client"
import { useCallback, useRef } from "react"
import { useGSAP } from "@gsap/react"
import { gsap } from "gsap"
import { useReducedMotion } from "@/lib/reduced-motion"
import { useSectionInView } from "@/hooks/use-section-in-view"

interface FadeRiseProps {
  children: React.ReactNode
  className?: string
  delay?: number
  duration?: number
  y?: number
}

export function FadeRise({
  children,
  className,
  delay = 0,
  duration = 0.6,
  y = 24,
}: FadeRiseProps) {
  const reduced = useReducedMotion()
  const { ref: inViewRef, inView } = useSectionInView()
  const containerRef = useRef<HTMLDivElement>(null)

  const setRef = useCallback(
    (node: HTMLDivElement | null) => {
      (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node
      inViewRef(node)
    },
    [inViewRef]
  )

  useGSAP(
    () => {
      if (reduced || !inView || !containerRef.current) return
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y },
        { opacity: 1, y: 0, duration, delay, ease: "power2.out" }
      )
    },
    { dependencies: [inView, reduced], scope: containerRef }
  )

  return (
    <div
      ref={setRef}
      className={className}
      style={!reduced && !inView ? { opacity: 0 } : undefined}
    >
      {children}
    </div>
  )
}
