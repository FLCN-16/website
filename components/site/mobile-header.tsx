"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import { Menu01Icon, Download01Icon } from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/site/theme-toggle"

const navLinks = [
  { num: "01", label: "ABOUT", href: "/" },
  { num: "02", label: "WORK", href: "/work" },
  { num: "03", label: "STACK", href: "/stack" },
  { num: "04", label: "WRITING", href: "/writing" },
  { num: "05", label: "CONTACT", href: "/contact" },
]

export function MobileHeader() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 h-14 px-6 flex items-center justify-between border-b border-border bg-background flex md:hidden">
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
              Rishabh Kumar
            </span>
            <span className="font-mono text-xs text-muted-foreground">
              Frontend Technical Lead
            </span>
          </div>

          {/* Status pill */}
          <div className="inline-flex w-fit items-center gap-1.5 rounded-full border border-border px-2.5 py-1">
            <span className="text-primary text-xs leading-none">●</span>
            <span className="font-mono text-xs text-muted-foreground">OPEN TO ROLES</span>
          </div>

          {/* Nav links */}
          <nav className="flex flex-col gap-1 flex-1">
            {navLinks.map(({ num, label, href }) => {
              const isActive = pathname === href

              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={[
                    "flex items-center gap-2 py-1.5 transition-colors",
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

          {/* Bottom */}
          <div className="mt-auto flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <a
                href="/files/rishabh-kumar-resume.pdf"
                download
                className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <HugeiconsIcon icon={Download01Icon} size={12} strokeWidth={1.5} />
                RÉSUMÉ.PDF
              </a>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  )
}
