import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { Linkedin01Icon, Github01Icon } from "@hugeicons/core-free-icons"
import { site } from "@/content/site"

const locationLine = `${site.location.split(",")[0].toUpperCase()} · ${site.timezone}`
const copyrightDomain = site.url.replace("https://", "").toUpperCase()

const github = site.socials.find((s) => s.platform === "github")
const linkedin = site.socials.find((s) => s.platform === "linkedin")

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border px-6 py-6 md:px-12">
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1">
          <span className="font-mono text-xs uppercase text-muted-foreground">
            © {year} {copyrightDomain}
          </span>
          <span className="font-mono text-xs text-muted-foreground">
            {locationLine}
          </span>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1">
          <div className="flex items-center gap-4">
            <Link
              href="/legal/privacy"
              className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/legal/terms"
              className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms
            </Link>
          </div>
          <div className="flex items-center gap-3">
            {linkedin && (
              <a
                href={linkedin.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <HugeiconsIcon icon={Linkedin01Icon} size={14} strokeWidth={1.5} className="size-3.5" />
              </a>
            )}
            {github && (
              <a
                href={github.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <HugeiconsIcon icon={Github01Icon} size={14} strokeWidth={1.5} className="size-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  )
}
