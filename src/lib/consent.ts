export const CONSENT_KEY = 'flcn-consent-v2'
const LEGACY_KEY = 'flcn-consent-v1'

export const CONSENT_CHANGE_EVENT = 'flcn:consent-change'
export const CONSENT_SETTINGS_EVENT = 'flcn:consent-settings'

export interface ConsentState {
  functional: boolean
  analytics: boolean
  marketing: boolean
  timestamp: string
}

export function parseConsent(raw: string | null): ConsentState | null {
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as Partial<ConsentState> | null
    if (typeof parsed?.analytics !== 'boolean') return null
    return {
      functional: typeof parsed.functional === 'boolean' ? parsed.functional : false,
      analytics: parsed.analytics,
      marketing: typeof parsed.marketing === 'boolean' ? parsed.marketing : false,
      timestamp: typeof parsed.timestamp === 'string' ? parsed.timestamp : '',
    }
  } catch {
    return null
  }
}

export function consentModePayload(state: ConsentState): Record<string, 'granted' | 'denied'> {
  return {
    ad_storage:              state.marketing  ? 'granted' : 'denied',
    ad_user_data:            state.marketing  ? 'granted' : 'denied',
    ad_personalization:      state.marketing  ? 'granted' : 'denied',
    analytics_storage:       state.analytics  ? 'granted' : 'denied',
    functionality_storage:   state.functional ? 'granted' : 'denied',
    personalization_storage: state.functional ? 'granted' : 'denied',
    security_storage:        'granted',
  }
}

export function readConsent(): ConsentState | null {
  if (typeof window === 'undefined') return null
  try {
    // Try current schema (v2) first
    const v2 = parseConsent(window.localStorage.getItem(CONSENT_KEY))
    if (v2) return v2

    // Migrate from v1 (analytics-only boolean schema)
    const legacyRaw = window.localStorage.getItem(LEGACY_KEY)
    if (legacyRaw) {
      const legacy = JSON.parse(legacyRaw) as { analytics?: unknown; timestamp?: unknown } | null
      if (typeof legacy?.analytics === 'boolean') {
        const migrated: ConsentState = {
          functional: false,
          analytics: legacy.analytics,
          marketing: false,
          timestamp: typeof legacy.timestamp === 'string' ? legacy.timestamp : '',
        }
        try {
          window.localStorage.setItem(CONSENT_KEY, JSON.stringify(migrated))
        } catch {
          // storage quota exceeded — return migrated value without persisting
        }
        return migrated
      }
    }
    return null
  } catch {
    return null
  }
}

type DataLayerWindow = Window & { dataLayer?: unknown[] }

function gtagConsentUpdate(state: ConsentState) {
  const w = window as DataLayerWindow
  w.dataLayer = w.dataLayer ?? []
  // Consent commands must be pushed as an `arguments` object, not a plain array
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function gtag(..._args: unknown[]) {
    // eslint-disable-next-line prefer-rest-params
    w.dataLayer?.push(arguments)
  }
  gtag('consent', 'update', consentModePayload(state))
}

export function saveConsent(choices: {
  functional: boolean
  analytics: boolean
  marketing: boolean
}): ConsentState {
  const state: ConsentState = { ...choices, timestamp: new Date().toISOString() }
  try {
    window.localStorage.setItem(CONSENT_KEY, JSON.stringify(state))
  } catch {
    // ignore — gtag update and event dispatch still run below
  }
  gtagConsentUpdate(state)
  window.dispatchEvent(new CustomEvent(CONSENT_CHANGE_EVENT, { detail: state }))
  return state
}

/** Accept all non-necessary cookie categories. */
export function acceptAll(): ConsentState {
  return saveConsent({ functional: true, analytics: true, marketing: true })
}

/** Reject all non-necessary cookie categories. */
export function rejectAll(): ConsentState {
  return saveConsent({ functional: false, analytics: false, marketing: false })
}

export function openConsentSettings(): void {
  window.dispatchEvent(new Event(CONSENT_SETTINGS_EVENT))
}
