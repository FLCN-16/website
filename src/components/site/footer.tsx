'use client'

import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { GithubIcon, Linkedin02Icon, InstagramIcon } from "@hugeicons/core-free-icons"
import { useSiteIdentity } from "@/components/providers/site-identity-provider"
import { NAV_LINKS } from "@/lib/navigation"
import { BackToTop } from "@/components/site/back-to-top"
import { OutboundLink } from "@/components/site/tracked-link"
import { CookieSettingsButton } from "@/components/site/cookie-consent"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SOCIAL_ICONS: Record<string, any> = {
  github: GithubIcon,
  linkedin: Linkedin02Icon,
  instagram: InstagramIcon,
}

const LINK_CLASS = "font-mono text-xs text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring rounded-sm"

export function Footer() {
  const identity = useSiteIdentity()
  const locationLine = `${identity.location.split(',')[0].toUpperCase()} · ${identity.timezone}`
  const copyrightDomain = identity.url.replace('https://', '').toUpperCase()
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border px-6 py-8 md:px-12">
      <div className="flex flex-col gap-3">
        {/* Row 1: copyright + location */}
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1">
          <span className="font-mono text-xs uppercase text-muted-foreground">
            © {year} {copyrightDomain}
          </span>
          <span className="font-mono text-xs text-muted-foreground">
            {locationLine}
          </span>
        </div>

        {/* Row 2: nav + legal */}
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
          <div className="flex flex-wrap items-center gap-4">
            {NAV_LINKS.map(({ label, href }) => (
              <Link key={href} href={href} className={LINK_CLASS}>
                {label}
              </Link>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/legal/privacy" className={LINK_CLASS}>Privacy</Link>
            <Link href="/legal/terms" className={LINK_CLASS}>Terms</Link>
            <Link href="/legal/cookies" className={LINK_CLASS}>Cookies</Link>
            <CookieSettingsButton className={LINK_CLASS} />
          </div>
        </div>

        {/* Row 3: socials + back to top */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {identity.socials.map((social) => {
              const icon = SOCIAL_ICONS[social.platform]
              if (!icon) return null
              return (
                <OutboundLink
                  key={social.platform}
                  url={social.url}
                  context="footer"
                  aria-label={social.label}
                  className="group text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring rounded-sm"
                >
                  <HugeiconsIcon
                    icon={icon}
                    size={14}
                    strokeWidth={1.5}
                    className="size-3.5 motion-safe:transition-transform motion-safe:group-hover:-translate-y-0.5"
                  />
                </OutboundLink>
              )
            })}
          </div>
          <BackToTop />
        </div>
      </div>
    </footer>
  )
}
