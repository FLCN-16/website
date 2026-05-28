"use client"

import { useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useGSAP } from "@gsap/react"
import { gsap } from "gsap"
import { NAV_LINKS, isNavLinkActive } from "@/lib/navigation"
import { useReducedMotion } from "@/lib/reduced-motion"

interface NavLinksProps {
  onNavigate?: () => void
}

export function NavLinks({ onNavigate }: NavLinksProps) {
  const pathname = usePathname()
  const reduced = useReducedMotion()
  const navRef = useRef<HTMLElement>(null)
  const barRef = useRef<HTMLDivElement>(null)
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([])
  const hasMounted = useRef(false)

  const activeIndex = NAV_LINKS.findIndex(({ href }) => isNavLinkActive(href, pathname))

  useGSAP(
    () => {
      const bar = barRef.current
      if (!bar) return

      if (activeIndex === -1) {
        gsap.to(bar, { opacity: 0, duration: reduced ? 0 : 0.2 })
        return
      }

      const link = linkRefs.current[activeIndex]
      if (!link) return

      const y = link.offsetTop
      const h = link.offsetHeight

      if (!hasMounted.current) {
        gsap.set(bar, { y, height: h, opacity: 1 })
        hasMounted.current = true
      } else if (reduced) {
        gsap.set(bar, { y, height: h, opacity: 1 })
      } else {
        gsap.to(bar, { y, height: h, opacity: 1, duration: 0.35, ease: "power3.out" })
      }
    },
    { dependencies: [activeIndex, reduced], scope: navRef }
  )

  return (
    <nav ref={navRef} className="relative flex flex-col gap-1 flex-1">
      {/* Sliding active indicator */}
      <div
        ref={barRef}
        aria-hidden
        className="absolute left-0 w-0.5 bg-primary rounded-full opacity-0"
      />

      {NAV_LINKS.map(({ num, label, href }, i) => {
        const isActive = activeIndex === i

        return (
          <Link
            key={href}
            href={href}
            ref={(el) => { linkRefs.current[i] = el }}
            onClick={onNavigate}
            aria-current={isActive ? "page" : undefined}
            className="group flex items-center gap-2 py-1 pl-3 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring rounded-sm"
          >
            <span
              className={[
                "font-mono text-xs transition-colors",
                isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground",
              ].join(" ")}
            >
              {num}
            </span>
            <span
              className={[
                "font-mono text-xs transition-colors",
                isActive ? "text-foreground font-medium" : "text-muted-foreground group-hover:text-foreground",
              ].join(" ")}
            >
              <span className="inline-block motion-safe:transition-transform motion-safe:group-hover:translate-x-0.5">
                {label}
              </span>
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
