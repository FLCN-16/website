"use client"
import { useCallback, useRef } from "react"
import { useGSAP } from "@gsap/react"
import { gsap } from "gsap"
import { useReducedMotion } from "@/lib/reduced-motion"
import { useSectionInView } from "@/hooks/use-section-in-view"

interface CountUpProps {
  value: string
  className?: string
  duration?: number
}

export function CountUp({ value, className, duration = 1.5 }: CountUpProps) {
  const reduced = useReducedMotion()
  const { ref: inViewRef, inView } = useSectionInView(0.5)
  const spanRef = useRef<HTMLSpanElement>(null)

  const match = value.match(/^(\d+)(.*)$/)
  const num = match ? parseInt(match[1], 10) : 0
  const suffix = match ? match[2] : value

  const setRef = useCallback(
    (node: HTMLSpanElement | null) => {
      (spanRef as React.MutableRefObject<HTMLSpanElement | null>).current = node
      inViewRef(node)
    },
    [inViewRef]
  )

  useGSAP(
    () => {
      if (reduced || !inView || !spanRef.current) return
      const obj = { val: 0 }
      gsap.to(obj, {
        val: num,
        duration,
        ease: "power2.out",
        onUpdate() {
          if (spanRef.current) {
            spanRef.current.textContent = Math.round(obj.val) + suffix
          }
        },
      })
    },
    { dependencies: [inView, reduced] }
  )

  return (
    <span
      ref={setRef}
      className={className}
    >
      {reduced ? value : "0" + suffix}
    </span>
  )
}
