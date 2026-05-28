"use client"

import { useRef, useState, useEffect } from "react"
import { useGSAP } from "@gsap/react"
import { gsap } from "gsap"
import { useReducedMotion } from "@/lib/reduced-motion"
import { site } from "@/content/site"

const WORDS = ["THE", "FALCON"]
const DOMAIN = site.url.replace("https://", "")

export function SplashScreen() {
  const reduced = useReducedMotion()
  const [visible, setVisible] = useState(false)
  const [done, setDone] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const domainRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (reduced) return
    if (window.location.pathname !== "/") return
    if (sessionStorage.getItem("splash_seen")) return
    setVisible(true)
  }, [reduced])

  useGSAP(
    () => {
      if (!visible || !containerRef.current || !domainRef.current) return

      const letters = containerRef.current.querySelectorAll<HTMLElement>(".splash-letter")
      const domain = domainRef.current

      gsap
        .timeline({
          onComplete: () => {
            sessionStorage.setItem("splash_seen", "1")
            setDone(true)
          },
        })
        .fromTo(
          letters,
          { yPercent: 100 },
          { yPercent: 0, duration: 0.6, stagger: 0.06, ease: "power3.out" }
        )
        .fromTo(domain, { opacity: 0 }, { opacity: 1, duration: 0.4 }, ">")
        .to({}, { duration: 0.4 })
        .to(containerRef.current, { opacity: 0, duration: 0.5 })
    },
    { dependencies: [visible], scope: containerRef }
  )

  if (!visible || done) return null

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] bg-background flex flex-col items-center justify-center gap-4"
    >
      <div className="flex items-center gap-[0.6em]">
        {WORDS.map((word) => (
          <div key={word} className="flex">
            {word.split("").map((letter) => (
              <span key={letter} className="overflow-hidden inline-block">
                <span className="splash-letter inline-block font-mono font-bold text-4xl md:text-5xl text-foreground">
                  {letter}
                </span>
              </span>
            ))}
          </div>
        ))}
      </div>
      <span
        ref={domainRef}
        className="font-mono text-xs text-muted-foreground tracking-[0.25em] uppercase"
        style={{ opacity: 0 }}
      >
        {DOMAIN}
      </span>
    </div>
  )
}
