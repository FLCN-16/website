"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { GithubIcon, Linkedin02Icon, InstagramIcon } from "@hugeicons/core-free-icons"
import { useSiteIdentity } from "@/components/providers/site-identity-provider"
import { OutboundLink } from "@/components/site/tracked-link"
import { SubscribeButton } from "./subscribe-form"
import { cn } from "@/lib/utils"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SOCIAL_ICONS: Record<string, any> = {
  github: GithubIcon,
  linkedin: Linkedin02Icon,
  instagram: InstagramIcon,
}

const SOCIAL_STYLES: Record<string, string> = {
  github:
    "bg-[#24292e] hover:brightness-125 text-white border border-white/10",
  linkedin:
    "bg-[#0A66C2] hover:brightness-110 text-white",
  instagram:
    "bg-gradient-to-br from-[#405DE6] via-[#C13584] to-[#FD1D1D] hover:opacity-90 text-white",
}

export function WritingSocialCTA() {
  const identity = useSiteIdentity()
  return (
    <div className="camera-frame border border-border/60 bg-transparent p-6 sm:p-8 md:p-12 text-foreground">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 md:gap-10">

        {/* Copy */}
        <div className="flex-1 min-w-0">
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-4">
            Like what you read?
          </p>
          <h3 className="font-sans text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight leading-tight mb-3 text-foreground">
            Stay in the loop.
          </h3>
          <p className="text-base text-foreground/60 leading-relaxed max-w-sm">
            New articles on engineering, architecture, and building software that lasts. Straight to your inbox.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-5 shrink-0 w-full md:w-auto md:min-w-[260px]">
          <SubscribeButton />

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3 md:hidden">
              <div className="h-px flex-1 bg-border" />
              <span className="font-mono text-[10px] uppercase tracking-widest text-foreground/40 shrink-0">
                or follow
              </span>
              <div className="h-px flex-1 bg-border" />
            </div>
            <div className="hidden md:flex items-center gap-3">
              <span className="font-mono text-[10px] uppercase tracking-widest text-foreground/40 shrink-0">
                or follow
              </span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              {identity.socials.map((social) => {
                const icon = SOCIAL_ICONS[social.platform]
                const style = SOCIAL_STYLES[social.platform]
                if (!icon || !style) return null
                return (
                  <OutboundLink
                    key={social.platform}
                    url={social.url}
                    context="writing-cta"
                    aria-label={social.label}
                    className={cn(
                      "group inline-flex items-center justify-center gap-2 px-2.5 py-2 sm:px-4 sm:py-2.5 rounded-full font-mono text-xs font-semibold leading-none transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg",
                      style
                    )}
                  >
                    <HugeiconsIcon
                      icon={icon}
                      size={14}
                      strokeWidth={1.5}
                      className="shrink-0 translate-y-px"
                    />
                    <span className="hidden sm:inline">{social.label}</span>
                  </OutboundLink>
                )
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
