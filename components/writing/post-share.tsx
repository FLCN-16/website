"use client"

import { useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  CopyLinkIcon,
  NewTwitterIcon,
  LinkedinIcon,
  CheckmarkCircle01Icon,
  BlueskyIcon,
  RedditIcon,
  WhatsappIcon,
  MailIcon,
} from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"
import { useSiteIdentity } from "@/components/providers/site-identity-provider"

interface PostShareProps {
  title: string
  slug: string
}

function utm(base: string, source: string) {
  return encodeURIComponent(`${base}?utm_source=${source}&utm_medium=social&utm_campaign=share`)
}

const links = (base: string, encodedTitle: string) => [
  {
    label: "Share on X",
    icon: NewTwitterIcon,
    href: `https://x.com/intent/post?text=${encodedTitle}&url=${utm(base, "x")}`,
    hover: "hover:bg-black hover:text-white hover:border-black",
  },
  {
    label: "LinkedIn",
    icon: LinkedinIcon,
    href: `https://www.linkedin.com/sharing/share-offsite/?url=${utm(base, "linkedin")}`,
    hover: "hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2]",
  },
  {
    label: "Bluesky",
    icon: BlueskyIcon,
    href: `https://bsky.app/intent/compose?text=${encodedTitle}%20${utm(base, "bluesky")}`,
    hover: "hover:bg-[#0085FF] hover:text-white hover:border-[#0085FF]",
  },
  {
    label: "Reddit",
    icon: RedditIcon,
    href: `https://reddit.com/submit?url=${utm(base, "reddit")}&title=${encodedTitle}`,
    hover: "hover:bg-[#FF4500] hover:text-white hover:border-[#FF4500]",
  },
  {
    label: "WhatsApp",
    icon: WhatsappIcon,
    href: `https://wa.me/?text=${encodedTitle}%20${utm(base, "whatsapp")}`,
    hover: "hover:bg-[#25D366] hover:text-white hover:border-[#25D366]",
  },
  {
    label: "Email",
    icon: MailIcon,
    href: `mailto:?subject=${encodedTitle}&body=${encodeURIComponent(base)}`,
    hover: "hover:bg-foreground hover:text-background hover:border-foreground",
  },
]

const btnBase =
  "inline-flex items-center gap-2 px-2.5 py-2 md:px-3.5 border border-border font-mono text-xs text-muted-foreground transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"

export function PostShare({ title, slug }: PostShareProps) {
  const identity = useSiteIdentity()
  const [copied, setCopied] = useState(false)
  const base = `${identity.url}/writing/${slug}`
  const encodedTitle = encodeURIComponent(title)

  function copyLink() {
    navigator.clipboard.writeText(base).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="mt-12 pt-8 border-t border-border">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-4">
        Share this article
      </p>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={copyLink}
          aria-label="Copy link"
          className={cn(
            btnBase,
            "hover:bg-foreground hover:text-background hover:border-foreground",
            copied && "bg-foreground text-background border-foreground"
          )}
        >
          <HugeiconsIcon
            icon={copied ? CheckmarkCircle01Icon : CopyLinkIcon}
            size={13}
            strokeWidth={1.5}
            className="shrink-0"
          />
          <span className="hidden md:inline">{copied ? "Copied!" : "Copy link"}</span>
        </button>

        {links(base, encodedTitle).map(({ label, icon, href, hover }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className={cn(btnBase, hover)}
          >
            <HugeiconsIcon icon={icon} size={13} strokeWidth={1.5} className="shrink-0" />
            <span className="hidden md:inline">{label}</span>
          </a>
        ))}
      </div>
    </div>
  )
}
