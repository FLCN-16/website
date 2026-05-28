"use client"

import { useReducedMotion } from "@/lib/reduced-motion"

export function BackToTop() {
  const reduced = useReducedMotion()

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" })}
      className="group inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring rounded-sm"
    >
      <span className="motion-safe:transition-transform motion-safe:group-hover:-translate-y-0.5">↑</span>
      BACK TO TOP
    </button>
  )
}
