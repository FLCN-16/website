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
import Link from "next/link"
import { site } from "@/content/site"
import { trackEvent } from "@/lib/analytics"
import { Logo } from "@/components/site/logo"

export function MobileHeader({ resumeUrl, status }: { resumeUrl: string; status: { available: boolean; label: string } }) {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 h-14 px-6 flex items-center justify-between border-b border-border/60 bg-background/70 backdrop-blur-md supports-backdrop-filter:backdrop-blur-md lg:hidden">
      <Link href="/" aria-label="Go to home">
        <Logo className="h-7 w-auto text-foreground" />
      </Link>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Open navigation menu">
            <HugeiconsIcon icon={Menu01Icon} size={18} strokeWidth={1.5} />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[260px] p-6 flex flex-col gap-4">
          {/* Identity */}
          <div className="flex flex-col gap-1 pt-2">
            <span className="font-sans text-lg font-semibold tracking-tight text-foreground">
              {site.name}
            </span>
            <span className="font-mono text-xs text-muted-foreground">
              {site.role}
            </span>
          </div>

          {/* Status pill */}
          {status.available && (
            <div className="inline-flex w-fit items-center gap-1.5 rounded-full border border-border px-2.5 py-1">
              <span className="text-primary text-xs leading-none motion-safe:animate-pulse">●</span>
              <span className="font-mono text-xs text-muted-foreground">{status.label}</span>
            </div>
          )}

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
