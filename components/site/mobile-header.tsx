"use client"

import { useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Menu01Icon, Download01Icon } from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/site/theme-toggle"
import { NavLinks } from "@/components/site/nav-links"
import { site } from "@/content/site"
import { trackEvent } from "@/lib/analytics"

export function MobileHeader({ resumeUrl }: { resumeUrl: string }) {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 h-14 px-6 flex items-center justify-between border-b border-border bg-background md:hidden">
      <span className="font-mono font-semibold text-sm text-foreground">
        FLCN
      </span>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Open navigation menu">
            <HugeiconsIcon icon={Menu01Icon} size={18} strokeWidth={1.5} />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[260px] p-6 flex flex-col gap-4">
          {/* Identity */}
          <div className="flex flex-col gap-1 pt-2">
            <span className="font-sans font-semibold text-sm text-foreground">
              {site.name}
            </span>
            <span className="font-mono text-xs text-muted-foreground">
              {site.role}
            </span>
          </div>

          {/* Status pill */}
          <div className="inline-flex w-fit items-center gap-1.5 rounded-full border border-border px-2.5 py-1">
            <span className="text-primary text-xs leading-none motion-safe:animate-pulse">●</span>
            <span className="font-mono text-xs text-muted-foreground">{site.status.label}</span>
          </div>

          <NavLinks mobile onNavigate={() => setOpen(false)} />

          {/* Bottom */}
          <div className="mt-auto flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <a
                href={resumeUrl}
                download
                onClick={() => trackEvent({ event: 'file_download', file_name: resumeUrl.split('/').pop() ?? 'resume', location: 'mobile_menu' })}
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
          </div>
        </SheetContent>
      </Sheet>
    </header>
  )
}
