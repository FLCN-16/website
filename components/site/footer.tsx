import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { Linkedin01Icon, Github01Icon } from "@hugeicons/core-free-icons"
import { site } from "@/content/site"
import { BackToTop } from "@/components/site/back-to-top"
import { OutboundLink } from "@/components/site/tracked-link"

const locationLine = `${site.location.split(",")[0].toUpperCase()} · ${site.timezone}`
const copyrightDomain = site.url.replace("https://", "").toUpperCase()

const github = site.socials.find((s) => s.platform === "github")
const linkedin = site.socials.find((s) => s.platform === "linkedin")

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border px-6 py-6 md:px-12">
      <div className="flex flex-col gap-2">
        {/* Top row: copyright + location */}
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1">
          <span className="font-mono text-xs uppercase text-muted-foreground">
            © {year} {copyrightDomain}
          </span>
          <span className="font-mono text-xs text-muted-foreground">
            {locationLine}
          </span>
        </div>

        {/* Bottom row: legal links + social icons */}
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1">
          <div className="flex items-center gap-4">
            <Link
              href="/legal/privacy"
              className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring rounded-sm"
            >
              Privacy Policy
            </Link>
            <Link
              href="/legal/terms"
              className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring rounded-sm"
            >
              Terms
            </Link>
          </div>
          <div className="flex items-center gap-4">
            {linkedin && (
              <OutboundLink
                url={linkedin.url}
                context="footer"
                aria-label="LinkedIn"
                className="group text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring rounded-sm"
              >
                <HugeiconsIcon
                  icon={Linkedin01Icon}
                  size={14}
                  strokeWidth={1.5}
                  className="size-3.5 motion-safe:transition-transform motion-safe:group-hover:-translate-y-0.5"
                />
              </OutboundLink>
            )}
            {github && (
              <OutboundLink
                url={github.url}
                context="footer"
                aria-label="GitHub"
                className="group text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring rounded-sm"
              >
                <HugeiconsIcon
                  icon={Github01Icon}
                  size={14}
                  strokeWidth={1.5}
                  className="size-3.5 motion-safe:transition-transform motion-safe:group-hover:-translate-y-0.5"
                />
              </OutboundLink>
            )}
            <BackToTop />
          </div>
        </div>
      </div>
    </footer>
  )
}
