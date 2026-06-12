"use client"
import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import { gsap } from "gsap"
import { useReducedMotion } from "@/lib/reduced-motion"

interface MaskRevealProps {
  children: React.ReactNode
  as?: keyof React.JSX.IntrinsicElements
  className?: string
  delay?: number
  duration?: number
  stagger?: number
}

export function MaskReveal({
  children,
  as: Tag = "div",
  className,
  delay = 0,
  duration = 0.7,
  stagger = 0.08,
}: MaskRevealProps) {
  const reduced = useReducedMotion()
  const containerRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (reduced || !containerRef.current) return
      const lines = containerRef.current.querySelectorAll(".mask-line")
      if (!lines.length) return
      gsap.fromTo(
        lines,
        { yPercent: 110 },
        { yPercent: 0, duration, delay, stagger, ease: "power3.out" }
      )
    },
    { scope: containerRef }
  )

  const content =
    typeof children === "string" ? (
      <span className="block overflow-hidden">
        <span className="mask-line block">{children}</span>
      </span>
    ) : (
      children
    )

  // Use a typed intermediate to avoid JSX dynamic tag issues
  const Component = Tag as React.ElementType
  return (
    <Component
      ref={containerRef}
      className={className}
    >
      {content}
    </Component>
  )
}
