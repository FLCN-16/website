"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import type { Heading } from "@/lib/lexical-headings"

interface PostTocProps {
  headings: Heading[]
}

export function PostToc({ headings }: PostTocProps) {
  const [activeId, setActiveId] = useState<string>("")

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

  if (headings.length < 3) return null

  return (
    <nav aria-label="Table of contents">
      <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-4">
        In this article
      </p>
      <ul className="flex flex-col gap-2">
        {headings.map(({ id, text, level }) => (
          <li key={id} className={cn(level === 3 && "pl-3")}>
            <a
              href={`#${id}`}
              className={cn(
                "block font-mono text-xs leading-relaxed transition-colors",
                activeId === id
                  ? "text-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
