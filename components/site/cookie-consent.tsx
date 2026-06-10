'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CONSENT_SETTINGS_EVENT, openConsentSettings, readConsent, saveConsent } from '@/lib/consent'

export function CookieConsent() {
  const [open, setOpen] = useState(() => !readConsent())

  useEffect(() => {
    const reopen = () => setOpen(true)
    window.addEventListener(CONSENT_SETTINGS_EVENT, reopen)
    return () => window.removeEventListener(CONSENT_SETTINGS_EVENT, reopen)
  }, [])

  if (!open) return null

  const choose = (analytics: boolean) => {
    saveConsent(analytics)
    setOpen(false)
  }

  return (
    <div
      role="region"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 px-6 py-4 backdrop-blur md:px-12"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-1">
            Cookies
          </p>
          <p className="text-sm text-muted-foreground">
            This site uses Google Analytics to understand how it&apos;s used — only if you
            accept. Declining keeps all analytics cookies off.{' '}
            <Link
              href="/legal/cookies"
              className="underline underline-offset-2 hover:text-foreground transition-colors"
            >
              Cookie Policy
            </Link>
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => choose(false)}>
            Decline
          </Button>
          <Button size="sm" onClick={() => choose(true)}>
            Accept
          </Button>
        </div>
      </div>
    </div>
  )
}

export function CookieSettingsButton({ className }: { className?: string }) {
  return (
    <button type="button" onClick={openConsentSettings} className={className}>
      Cookie settings
    </button>
  )
}
