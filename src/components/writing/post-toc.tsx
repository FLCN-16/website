"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import type { Heading } from "@/lib/lexical-headings"

interface PostTocProps {
  headings: Heading[]
}

export function PostToc({ headings }: PostTocProps) {
  const [activeId, setActiveId] = useState<string>("")
  const activeRef = useRef<HTMLAnchorElement | null>(null)

  // Derive whether the stored activeId belongs to the current headings list.
  // When headings change (new post), no heading matches and effectiveId is "".
  const effectiveId = headings.some((h) => h.id === activeId) ? activeId : ""

  useEffect(() => {
    if (headings.length < 3) return
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        }
      },
      { rootMargin: "0px 0px -70% 0px" },
    )
    for (const { id } of headings) {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    }
    return () => observer.disconnect()
  }, [headings])

  // Scroll active item into view within the TOC
  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" })
  }, [effectiveId])

  if (headings.length < 3) return null

  return (
    <nav aria-label="Table of contents" className="select-none">
      <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-4">
        On this page
      </p>

      <div className="relative flex gap-3">
        {/* Track line */}
        <div className="absolute left-0 top-0 bottom-0 w-px bg-border" />

        {/* Active highlight on track */}
        <div
          className="absolute left-0 w-px bg-primary transition-all duration-300"
          style={{
            top: `${headings.findIndex((h) => h.id === effectiveId) * 28}px`,
            height: "28px",
            opacity: effectiveId ? 1 : 0,
          }}
        />

        <ul className="flex flex-col pl-4 w-full">
          {headings.map(({ id, text, level }) => {
            const isActive = effectiveId === id
            return (
              <li key={id} style={{ height: 28 }} className="flex items-center">
                <a
                  ref={isActive ? activeRef : null}
                  href={`#${id}`}
                  className={cn(
                    "block font-mono text-xs leading-none transition-all duration-200 truncate w-full",
                    level === 3 && "pl-3 text-[11px]",
                    isActive
                      ? "text-primary font-semibold"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {text}
                </a>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}
