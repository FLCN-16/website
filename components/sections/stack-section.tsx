"use client"

import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useReducedMotion } from "@/lib/reduced-motion"
import { CountUp } from "@/components/anim/count-up"
import { FadeRise } from "@/components/anim/fade-rise"

gsap.registerPlugin(ScrollTrigger)

interface StackSectionProps {
  eyebrow: string
  heading: string
  intro: string
  bigStat?: { value: string; label: string }
  disciplines: Array<{
    name: string
    tools: Array<{ name: string; maturity: "expert" | "proficient" | "learning" }>
  }>
}

const MATURITY: Array<{ label: string; filled: number }> = [
  { label: "Expert",     filled: 3 },
  { label: "Proficient", filled: 2 },
  { label: "Learning",   filled: 1 },
]

export function StackSection({
  eyebrow,
  heading,
  intro,
  bigStat,
  disciplines,
}: StackSectionProps) {
  const reduced = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const eyebrowRef = useRef<HTMLParagraphElement>(null)
  const wordsRef = useRef<HTMLDivElement>(null)
  const totalTools = disciplines.reduce((sum, d) => sum + d.tools.length, 0)
  const words = heading.split(" ")

  useGSAP(() => {
    if (reduced || !sectionRef.current) return

    // Eyebrow
    gsap.set(eyebrowRef.current, { opacity: 0, y: 12 })
    gsap.to(eyebrowRef.current, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", delay: 0.1 })

    // Heading words — set initial state then animate
    const wordEls = wordsRef.current?.querySelectorAll<HTMLElement>(".word-inner")
    if (wordEls?.length) {
      gsap.set(wordEls, { yPercent: 110 })
      gsap.to(wordEls, {
        yPercent: 0,
        duration: 0.65,
        stagger: 0.05,
        ease: "power3.out",
        delay: 0.2,
      })
    }
  }, { scope: sectionRef })

  return (
    <section ref={sectionRef} className="py-16 md:py-24 border-b border-border">
      {/* Eyebrow */}
      <p
        ref={eyebrowRef}
        className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4"
      >
        {eyebrow}
      </p>

      {/* Heading + stats */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
        {/* Word-split heading */}
        <div ref={wordsRef} className="flex flex-wrap gap-x-[0.3em] overflow-hidden">
          {words.map((word, i) => (
            <span key={i} className="overflow-hidden inline-block">
              <span className="word-inner inline-block text-4xl md:text-6xl font-bold tracking-tight leading-tight">
                {word}
              </span>
            </span>
          ))}
        </div>

        {/* Stats */}
        <div className="flex items-end gap-8 shrink-0">
          {bigStat && (
            <div className="flex flex-col gap-0.5">
              <CountUp
                value={bigStat.value}
                className="font-mono text-4xl md:text-5xl font-bold tabular-nums leading-none text-foreground"
              />
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                {bigStat.label}
              </span>
            </div>
          )}
          <div className="flex flex-col gap-0.5">
            <CountUp
              value={String(totalTools)}
              className="font-mono text-4xl md:text-5xl font-bold tabular-nums leading-none text-foreground"
            />
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Tools & Techs
            </span>
          </div>
        </div>
      </div>

      {/* Intro + maturity legend */}
      <FadeRise delay={0.3}>
        <div className="flex flex-col md:flex-row md:items-start gap-8 md:gap-16">
          <p className="text-muted-foreground leading-relaxed max-w-2xl text-sm md:text-base flex-1">
            {intro}
          </p>
          <div className="shrink-0 flex flex-col gap-2.5 pt-1">
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
              Maturity
            </p>
            {MATURITY.map(({ label, filled }) => (
              <div key={label} className="flex items-center gap-2.5">
                <span className="flex items-center gap-0.5">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className={`w-1.5 h-1.5 shrink-0 ${i < filled ? "bg-foreground" : "bg-foreground/15"}`}
                    />
                  ))}
                </span>
                <span className="font-mono text-xs text-muted-foreground">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </FadeRise>
    </section>
  )
}
