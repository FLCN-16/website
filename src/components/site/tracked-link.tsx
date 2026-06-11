"use client"

import React, { useCallback } from "react"
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
  const trackAndNavigate = useCallback<React.MouseEventHandler<HTMLAnchorElement>>((e) => {
    trackEvent(event)
    onClick?.(e)
  }, [event, onClick])

  return <Link {...props} onClick={trackAndNavigate} />
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
  const trackOutboundClick = useCallback<React.MouseEventHandler<HTMLAnchorElement>>((e) => {
    trackEvent({ event: "outbound_click", ...outboundParams(url, context) })
    onClick?.(e)
  }, [url, context, onClick])

  return (
    <a
      {...props}
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={trackOutboundClick}
    >
      {children}
    </a>
  )
}
