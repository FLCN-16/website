'use client'

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import {
  CONSENT_SETTINGS_EVENT,
  acceptAll,
  openConsentSettings,
  readConsent,
  rejectAll,
  saveConsent,
} from '@/lib/consent'
import { useReducedMotion } from '@/lib/reduced-motion'

const emptySubscribe = () => () => {}

/** false during SSR/hydration, true after — without a setState-in-effect. */
function useHydrated() {
  return useSyncExternalStore(emptySubscribe, () => true, () => false)
}

/**
 * Read the `flcn-consent-required` cookie set by proxy.ts (middleware).
 * Returns true (banner required) when the cookie is absent or equals '1'.
 * Only call after hydration — `document` is not available during SSR.
 */
function readConsentRequiredCookie(): boolean {
  try {
    return !document.cookie.split(';').some(c => c.trim() === 'flcn-consent-required=0')
  } catch {
    return true
  }
}

// ─── Category metadata ────────────────────────────────────────────────────────

type CategoryId = 'functional' | 'analytics' | 'marketing'
type Toggles = Record<CategoryId, boolean>

const DEFAULT_TOGGLES: Toggles = { functional: false, analytics: false, marketing: false }

const CATEGORIES: Array<{ id: CategoryId; label: string; description: string }> = [
  {
    id: 'functional',
    label: 'Functional',
    description: 'Preferences like language and theme that improve your experience.',
  },
  {
    id: 'analytics',
    label: 'Analytics',
    description: 'Google Analytics — helps understand how the site is used.',
  },
  {
    id: 'marketing',
    label: 'Marketing',
    description: 'Advertising cookies for personalised campaigns.',
  },
]

// ─── Main component ───────────────────────────────────────────────────────────

export function CookieConsent() {
  const hydrated      = useHydrated()
  const reducedMotion = useReducedMotion()
  const [forcedOpen,  setForcedOpen]  = useState(false)
  const [dismissed,   setDismissed]   = useState(false)
  const [customizing, setCustomizing] = useState(false)
  const [toggles,     setToggles]     = useState<Toggles>(DEFAULT_TOGGLES)

  const regionRef = useRef<HTMLDivElement>(null)

  // Sync toggle state from stored consent (or safe defaults).
  const syncToggles = useCallback(() => {
    const stored = readConsent()
    setToggles({
      functional: stored?.functional ?? false,
      analytics:  stored?.analytics  ?? false,
      marketing:  stored?.marketing  ?? false,
    })
  }, []) // setToggles is stable; readConsent reads from localStorage directly

  // Listen for "Cookie settings" event dispatched by the footer button.
  useEffect(() => {
    const reopen = () => {
      syncToggles()
      setForcedOpen(true)
    }
    window.addEventListener(CONSENT_SETTINGS_EVENT, reopen)
    return () => window.removeEventListener(CONSENT_SETTINGS_EVENT, reopen)
  }, [syncToggles])

  // Focus the banner when reopened via settings event.
  useEffect(() => {
    if (forcedOpen) regionRef.current?.focus()
  }, [forcedOpen])

  // Escape key closes the banner when it was explicitly reopened with prior consent.
  useEffect(() => {
    if (!forcedOpen || readConsent() === null) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setForcedOpen(false)
        setCustomizing(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [forcedOpen])

  // Auto-show only in regions that require consent and only for new visitors.
  const consentRequired = hydrated ? readConsentRequiredCookie() : true
  const open = forcedOpen || (hydrated && !dismissed && !readConsent() && consentRequired)
  if (!open) return null

  // User can dismiss without choosing if they reopened with a prior stored choice.
  const canDismissWithoutChoosing = forcedOpen && readConsent() !== null

  const handleAcceptAll = () => {
    acceptAll()
    setForcedOpen(false)
    setCustomizing(false)
    setDismissed(true)
  }

  const handleRejectAll = () => {
    rejectAll()
    setForcedOpen(false)
    setCustomizing(false)
    setDismissed(true)
  }

  const handleSaveChoices = () => {
    saveConsent(toggles)
    setForcedOpen(false)
    setCustomizing(false)
    setDismissed(true)
  }

  const handleCustomize = () => {
    syncToggles()
    setCustomizing(true)
  }

  return (
    <div
      ref={regionRef}
      tabIndex={-1}
      role="region"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 px-6 py-4 backdrop-blur md:px-12"
    >
      {/* ✕ dismiss button — only when user explicitly reopened with prior consent */}
      {canDismissWithoutChoosing && (
        <button
          type="button"
          aria-label="Close cookie settings"
          onClick={() => { setForcedOpen(false); setCustomizing(false) }}
          className="absolute right-4 top-4 text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring rounded-sm"
        >
          ✕
        </button>
      )}

      {/* ── Collapsed banner ─────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-1">
            Cookies
          </p>
          <p className="text-sm text-muted-foreground">
            We use cookies to understand how this site is used and to improve your
            experience.{' '}
            <Link
              href="/legal/cookies"
              className="underline underline-offset-2 hover:text-foreground transition-colors"
            >
              Cookie Policy
            </Link>
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {!customizing && (
            <>
              <Button variant="ghost" size="sm" onClick={handleCustomize}>
                Customize
              </Button>
              <Button variant="outline" size="sm" onClick={handleRejectAll}>
                Reject All
              </Button>
              <Button size="sm" onClick={handleAcceptAll}>
                Accept All
              </Button>
            </>
          )}
        </div>
      </div>

      {/* ── Customize panel (expanded inline) ────────────────────────────── */}
      {customizing && (
        <div
          className={cn(
            'mt-4 border-t border-border pt-4',
            !reducedMotion && 'animate-in fade-in-0 slide-in-from-bottom-2 duration-200',
          )}
        >
          {/* Top actions */}
          <div className="mb-4 flex flex-wrap items-center justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={handleRejectAll}>
              Reject All
            </Button>
            <Button size="sm" onClick={handleAcceptAll}>
              Accept All
            </Button>
          </div>

          {/* Necessary — always on */}
          <div className="flex items-start justify-between gap-4 border-t border-border/50 py-2">
            <div>
              <p className="text-sm font-medium leading-none">Necessary</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Essential cookies required for the site to function correctly.
              </p>
            </div>
            <span className="shrink-0 font-mono text-xs uppercase tracking-widest text-muted-foreground pt-0.5">
              Always on
            </span>
          </div>

          {/* Configurable categories */}
          {CATEGORIES.map(({ id, label, description }) => (
            <div
              key={id}
              className="flex items-start justify-between gap-4 border-t border-border/50 py-2"
            >
              <label htmlFor={`cookie-${id}`} className="cursor-pointer">
                <p className="text-sm font-medium leading-none">{label}</p>
                <p className="mt-1 text-xs text-muted-foreground">{description}</p>
              </label>
              <Switch
                id={`cookie-${id}`}
                size="sm"
                checked={toggles[id]}
                onCheckedChange={(v) => setToggles(prev => ({ ...prev, [id]: v }))}
                className="shrink-0 mt-0.5"
              />
            </div>
          ))}

          {/* Save / bulk actions */}
          <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={handleRejectAll}>
              Reject All
            </Button>
            <Button variant="outline" size="sm" onClick={handleSaveChoices}>
              Save Choices
            </Button>
            <Button size="sm" onClick={handleAcceptAll}>
              Accept All
            </Button>
          </div>
        </div>
      )}
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
