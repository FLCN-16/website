"use client"

import React from "react"
import Link from "next/link"
import { trackEvent, outboundParams } from "@/lib/analytics"
import type { GTMEvent } from "@/lib/analytics"

// ---------------------------------------------------------------------------
// TrackedLink
// Wraps next/link. Fires a trackEvent call in onClick before navigation.
// Used inside <Button asChild> — renders as a proper anchor element.
// ---------------------------------------------------------------------------

type TrackedLinkProps = React.ComponentProps<typeof Link> & {
  event: GTMEvent
}

export function TrackedLink({ event, onClick, ...props }: TrackedLinkProps) {
  const handleClick: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
    trackEvent(event)
    onClick?.(e)
  }

  return <Link {...props} onClick={handleClick} />
}

// ---------------------------------------------------------------------------
// OutboundLink
// Wraps <a target="_blank" rel="noopener noreferrer">.
// Fires outbound_click event using outboundParams(url, context) on click.
// Used for footer socials and project Live/Code links.
// ---------------------------------------------------------------------------

type OutboundLinkProps = Omit<React.ComponentProps<"a">, "href" | "target" | "rel"> & {
  url: string
  context: string
}

export function OutboundLink({ url, context, onClick, children, ...props }: OutboundLinkProps) {
  const handleClick: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
    trackEvent({ event: "outbound_click", ...outboundParams(url, context) })
    onClick?.(e)
  }

  return (
    <a
      {...props}
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
    >
      {children}
    </a>
  )
}
