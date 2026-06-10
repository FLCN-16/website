export const CONSENT_KEY = 'flcn-consent-v1'
export const CONSENT_CHANGE_EVENT = 'flcn:consent-change'
export const CONSENT_SETTINGS_EVENT = 'flcn:consent-settings'

export interface ConsentState {
  analytics: boolean
  timestamp: string
}

export function parseConsent(raw: string | null): ConsentState | null {
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as Partial<ConsentState> | null
    if (typeof parsed?.analytics !== 'boolean') return null
    return {
      analytics: parsed.analytics,
      timestamp: typeof parsed.timestamp === 'string' ? parsed.timestamp : '',
    }
  } catch {
    return null
  }
}

export function consentModePayload(granted: boolean): Record<string, 'granted' | 'denied'> {
  return {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: granted ? 'granted' : 'denied',
  }
}

export function readConsent(): ConsentState | null {
  if (typeof window === 'undefined') return null
  try {
    return parseConsent(window.localStorage.getItem(CONSENT_KEY))
  } catch {
    return null
  }
}

type DataLayerWindow = Window & { dataLayer?: unknown[] }

function gtagConsentUpdate(granted: boolean) {
  const w = window as DataLayerWindow
  w.dataLayer = w.dataLayer ?? []
  // Consent commands must be pushed as an `arguments` object, not a plain array
  function gtag() {
    // eslint-disable-next-line prefer-rest-params
    w.dataLayer?.push(arguments)
  }
  gtag('consent', 'update', consentModePayload(granted))
}

export function saveConsent(analytics: boolean): ConsentState {
  const state: ConsentState = { analytics, timestamp: new Date().toISOString() }
  try {
    window.localStorage.setItem(CONSENT_KEY, JSON.stringify(state))
  } catch {
    // ignore — gtag update and event dispatch still run below
  }
  gtagConsentUpdate(analytics)
  window.dispatchEvent(new CustomEvent(CONSENT_CHANGE_EVENT, { detail: state }))
  return state
}

export function openConsentSettings(): void {
  window.dispatchEvent(new Event(CONSENT_SETTINGS_EVENT))
}
