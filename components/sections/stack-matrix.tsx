"use client"

import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useReducedMotion } from "@/lib/reduced-motion"
import { cn } from "@/lib/utils"

gsap.registerPlugin(ScrollTrigger)

interface StackMatrixProps {
  disciplines: Array<{
    name: string
    tools: Array<{ name: string; maturity: "expert" | "proficient" | "learning" }>
  }>
}

const MATURITY_FILLED: Record<"expert" | "proficient" | "learning", number> = {
  expert:     3,
  proficient: 2,
  learning:   1,
}

function MaturityDots({ maturity }: { maturity: "expert" | "proficient" | "learning" }) {
  const filled = MATURITY_FILLED[maturity]
  return (
    <span className="flex items-center gap-0.5" aria-label={maturity}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={`w-1.5 h-1.5 shrink-0 ${i < filled ? "bg-foreground" : "bg-foreground/15"}`}
        />
      ))}
    </span>
  )
}

export function StackMatrix({ disciplines }: StackMatrixProps) {
  const reduced = useReducedMotion()
  const gridRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (reduced || !gridRef.current) return

    const cards = gridRef.current.querySelectorAll<HTMLElement>(".stack-card")

    gsap.set(cards, { opacity: 0, x: 80 })

    ScrollTrigger.create({
      trigger: gridRef.current,
      start: "top 85%",
      once: true,
      onEnter: () => {
        gsap.to(cards, {
          opacity: 1,
          x: 0,
          duration: 1,
          delay: 0.6,
          stagger: 0.1,
          ease: "elastic.out(1, 0.6)",
        })
      },
    })

    // Magnetic hover
    const cleanups: (() => void)[] = []

    // Shimmer sweep — staggered per card
    cards.forEach((card, i) => {
      const shimmer = card.querySelector<HTMLElement>(".glass-shimmer")
      if (shimmer) {
        gsap.to(shimmer, {
          x: "200%",
          duration: 2.2,
          ease: "power1.inOut",
          repeat: -1,
          repeatDelay: 3 + i * 0.8,
          delay: 1.5 + i * 0.4,
        })
      }
    })

    // Magnetic + cursor-reactive glow
    cards.forEach((card) => {
      const STRENGTH = 0.05
      function onMove(e: MouseEvent) {
        const rect = card.getBoundingClientRect()
        const cx = rect.left + rect.width / 2
        const cy = rect.top + rect.height / 2
        const dx = (e.clientX - cx) * STRENGTH
        const dy = (e.clientY - cy) * STRENGTH
        gsap.to(card, { x: dx, y: dy, duration: 0.4, ease: "power2.out", overwrite: "auto" })
      }

      function onLeave() {
        gsap.to(card, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.5)", overwrite: "auto" })
      }

      card.addEventListener("mousemove", onMove)
      card.addEventListener("mouseleave", onLeave)
      cleanups.push(() => {
        card.removeEventListener("mousemove", onMove)
        card.removeEventListener("mouseleave", onLeave)
      })
    })

    return () => cleanups.forEach((fn) => fn())
  }, { scope: gridRef })

  return (
    <div className="py-8">
      <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {disciplines.map((discipline) => (
          <div
            key={discipline.name}
            className="stack-card relative overflow-hidden p-4"
            style={{
              background: "linear-gradient(145deg, rgba(0,0,0,0.45) 0%, rgba(10,10,15,0.25) 50%, rgba(0,0,0,0.4) 100%)",
              backdropFilter: "blur(48px) saturate(160%) brightness(0.75)",
              WebkitBackdropFilter: "blur(48px) saturate(160%) brightness(0.75)",
              border: "1px solid rgba(255,255,255,0.07)",
              boxShadow: [
                "0 0 0 1px rgba(0,0,0,0.5)",
                "0 8px 32px rgba(0,0,0,0.6)",
                "0 24px 64px rgba(0,0,0,0.4)",
                "0 0 80px rgba(0,0,0,0.3)",
                "inset 0 1px 0 rgba(255,255,255,0.1)",
                "inset 0 -1px 0 rgba(0,0,0,0.4)",
                "inset 1px 0 0 rgba(255,255,255,0.04)",
              ].join(", "),
            }}
          >
            {/* Top specular edge */}
            <div
              className="glass-specular pointer-events-none absolute inset-x-0 top-0 h-[1px]"
              style={{ background: "linear-gradient(90deg, transparent 5%, rgba(255,255,255,0.18) 40%, rgba(255,255,255,0.28) 55%, rgba(255,255,255,0.12) 75%, transparent 95%)" }}
            />
            {/* Shimmer sweep */}
            <div
              className="glass-shimmer pointer-events-none absolute inset-0"
              style={{
                background: "linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.04) 50%, transparent 65%)",
                transform: "translateX(-100%)",
              }}
            />
            {/* Bottom dark vignette */}
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2"
              style={{ background: "linear-gradient(to top, rgba(0,0,0,0.35), transparent)" }}
            />
            <p className="relative font-mono text-xs uppercase tracking-widest text-muted-foreground mb-3">
              {discipline.name}
            </p>
            <div className="relative">
              {discipline.tools.map((tool, toolIndex) => (
                <div
                  key={`${discipline.name}-${tool.name}`}
                  className={cn(
                    "flex items-center justify-between py-2",
                    toolIndex !== discipline.tools.length - 1 && "border-b border-white/8"
                  )}
                >
                  <span className="font-mono text-xs">{tool.name}</span>
                  <MaturityDots maturity={tool.maturity} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
