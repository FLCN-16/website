"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import { Download01Icon } from "@hugeicons/core-free-icons"
import { Separator } from "@/components/ui/separator"
import { ThemeToggle } from "@/components/site/theme-toggle"
import { NAV_LINKS } from "@/lib/navigation"
import { site } from "@/content/site"

const locationLine = `${site.location.split(",")[0].toUpperCase()} · ${site.timezone}`
const copyrightDomain = site.url.replace("https://", "").toUpperCase()

export function Rail() {
  const pathname = usePathname()
  const year = new Date().getFullYear()

  return (
    <aside className="fixed left-0 top-0 h-screen w-[240px] border-r border-border bg-background hidden md:flex flex-col p-6 gap-4">
      {/* Identity block */}
      <div className="flex flex-col gap-1">
        <span className="font-sans font-semibold text-sm text-foreground">
          {site.name}
        </span>
        <span className="font-mono text-xs text-muted-foreground">
          {site.role}
        </span>
      </div>

      <Separator />

      {/* Status pill */}
      <div className="inline-flex w-fit items-center gap-1.5 rounded-full border border-border px-2.5 py-1">
        <span className="text-primary text-xs leading-none">●</span>
        <span className="font-mono text-xs text-muted-foreground">{site.status.label}</span>
      </div>

      {/* Nav links */}
      <nav className="flex flex-col gap-1 flex-1">
        {NAV_LINKS.map(({ num, label, href }) => {
          const isActive = pathname === href

          return (
            <Link
              key={href}
              href={href}
              className={[
                "flex items-center gap-2 py-1 transition-colors",
                isActive
                  ? "border-l-2 border-primary pl-2"
                  : "pl-0",
              ].join(" ")}
            >
              <span className="font-mono text-xs text-muted-foreground">
                {num}
              </span>
              <span
                className={[
                  "font-mono text-xs",
                  isActive
                    ? "text-foreground font-medium"
                    : "text-muted-foreground",
                ].join(" ")}
              >
                {label}
              </span>
            </Link>
          )
        })}
      </nav>

      {/* Bottom block */}
      <div className="mt-auto flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <a
            href={site.resumeUrl}
            download
            className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <HugeiconsIcon icon={Download01Icon} size={12} strokeWidth={1.5} />
            RÉSUMÉ.PDF
          </a>
        </div>
        <span className="font-mono text-xs text-muted-foreground">
          {locationLine}
        </span>
        <span className="font-mono text-xs text-muted-foreground">
          © {year} {copyrightDomain}
        </span>
      </div>
    </aside>
  )
}
