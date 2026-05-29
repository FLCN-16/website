"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { Download01Icon } from "@hugeicons/core-free-icons"
import { Separator } from "@/components/ui/separator"
import { ThemeToggle } from "@/components/site/theme-toggle"
import { NavLinks } from "@/components/site/nav-links"
import { site } from "@/content/site"
import { trackEvent } from "@/lib/analytics"

const locationLine = `${site.location.split(",")[0].toUpperCase()} · ${site.timezone}`
const copyrightDomain = site.url.replace("https://", "").toUpperCase()

export function Rail({ resumeUrl }: { resumeUrl: string }) {
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
        <span className="text-primary text-xs leading-none motion-safe:animate-pulse">●</span>
        <span className="font-mono text-xs text-muted-foreground">{site.status.label}</span>
      </div>

      <NavLinks />

      {/* Bottom block */}
      <div className="mt-auto flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <a
            href={resumeUrl}
            download
            onClick={() => trackEvent({ event: 'file_download', file_name: resumeUrl.split('/').pop() ?? 'resume', location: 'rail' })}
            className="group inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring rounded-sm"
          >
            <HugeiconsIcon
              icon={Download01Icon}
              size={12}
              strokeWidth={1.5}
              className="motion-safe:transition-transform motion-safe:group-hover:translate-y-0.5"
            />
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
