// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest'
import {
  CONSENT_KEY,
  type ConsentState,
  acceptAll,
  consentModePayload,
  parseConsent,
  readConsent,
  rejectAll,
} from '@/lib/consent'

const LEGACY_KEY = 'flcn-consent-v1'

beforeEach(() => {
  localStorage.clear()
})

// ─── parseConsent ─────────────────────────────────────────────────────────────

describe('parseConsent', () => {
  it('returns null for null/empty raw values', () => {
    expect(parseConsent(null)).toBeNull()
    expect(parseConsent('')).toBeNull()
  })

  it('returns null for malformed JSON', () => {
    expect(parseConsent('{not json')).toBeNull()
  })

  it('returns null when analytics flag is missing or not boolean', () => {
    expect(parseConsent('{}')).toBeNull()
    expect(parseConsent('{"analytics":"yes"}')).toBeNull()
  })

  it('parses a valid v2 consent record', () => {
    const raw = JSON.stringify({
      functional: true,
      analytics: true,
      marketing: false,
      timestamp: '2026-06-10T00:00:00.000Z',
    })
    expect(parseConsent(raw)).toEqual({
      functional: true,
      analytics: true,
      marketing: false,
      timestamp: '2026-06-10T00:00:00.000Z',
    })
  })

  it('tolerates missing optional fields with safe defaults', () => {
    expect(parseConsent('{"analytics":false}')).toEqual({
      functional: false,
      analytics: false,
      marketing: false,
      timestamp: '',
    })
  })
})

// ─── consentModePayload ───────────────────────────────────────────────────────

describe('consentModePayload', () => {
  const allGranted: ConsentState = {
    functional: true,
    analytics: true,
    marketing: true,
    timestamp: '',
  }

  const allDenied: ConsentState = {
    functional: false,
    analytics: false,
    marketing: false,
    timestamp: '',
  }

  it('grants all signals when all categories are true', () => {
    expect(consentModePayload(allGranted)).toEqual({
      ad_storage: 'granted',
      ad_user_data: 'granted',
      ad_personalization: 'granted',
      analytics_storage: 'granted',
      functionality_storage: 'granted',
      personalization_storage: 'granted',
      security_storage: 'granted',
    })
  })

  it('denies all non-security signals when all categories are false', () => {
    expect(consentModePayload(allDenied)).toEqual({
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      analytics_storage: 'denied',
      functionality_storage: 'denied',
      personalization_storage: 'denied',
      security_storage: 'granted',
    })
  })

  it('always grants security_storage regardless of choices', () => {
    expect(consentModePayload(allDenied).security_storage).toBe('granted')
  })

  it('grants analytics_storage only when analytics is true', () => {
    const state: ConsentState = { ...allDenied, analytics: true }
    const payload = consentModePayload(state)
    expect(payload.analytics_storage).toBe('granted')
    expect(payload.ad_storage).toBe('denied')
    expect(payload.functionality_storage).toBe('denied')
  })

  it('grants ad signals only when marketing is true', () => {
    const state: ConsentState = { ...allDenied, marketing: true }
    const payload = consentModePayload(state)
    expect(payload.ad_storage).toBe('granted')
    expect(payload.ad_user_data).toBe('granted')
    expect(payload.ad_personalization).toBe('granted')
    expect(payload.analytics_storage).toBe('denied')
    expect(payload.functionality_storage).toBe('denied')
  })

  it('grants functional signals only when functional is true', () => {
    const state: ConsentState = { ...allDenied, functional: true }
    const payload = consentModePayload(state)
    expect(payload.functionality_storage).toBe('granted')
    expect(payload.personalization_storage).toBe('granted')
    expect(payload.analytics_storage).toBe('denied')
  })
})

// ─── CONSENT_KEY ─────────────────────────────────────────────────────────────

describe('CONSENT_KEY', () => {
  it('is the versioned storage key interpolated into the inline layout script', () => {
    expect(CONSENT_KEY).toBe('flcn-consent-v2')
  })
})

// ─── readConsent / migration ──────────────────────────────────────────────────

describe('readConsent', () => {
  it('returns null when no stored consent exists', () => {
    expect(readConsent()).toBeNull()
  })

  it('reads a valid v2 record from localStorage', () => {
    const state: ConsentState = {
      functional: true,
      analytics: true,
      marketing: false,
      timestamp: '2026-06-10T00:00:00.000Z',
    }
    localStorage.setItem(CONSENT_KEY, JSON.stringify(state))
    expect(readConsent()).toEqual(state)
  })

  it('migrates a v1 record to v2 on first read, preserving the analytics choice', () => {
    localStorage.setItem(
      LEGACY_KEY,
      JSON.stringify({ analytics: true, timestamp: '2026-01-01T00:00:00.000Z' })
    )
    const result = readConsent()
    expect(result).toEqual({
      functional: false,
      analytics: true,
      marketing: false,
      timestamp: '2026-01-01T00:00:00.000Z',
    })
  })

  it('persists the migrated v2 record to localStorage', () => {
    localStorage.setItem(
      LEGACY_KEY,
      JSON.stringify({ analytics: false, timestamp: '2026-01-01T00:00:00.000Z' })
    )
    readConsent()
    const saved = localStorage.getItem(CONSENT_KEY)
    expect(saved).not.toBeNull()
    expect(JSON.parse(saved!).analytics).toBe(false)
    expect(JSON.parse(saved!).functional).toBe(false)
    expect(JSON.parse(saved!).marketing).toBe(false)
  })

  it('prefers v2 over v1 when both are present', () => {
    const v2State: ConsentState = {
      functional: true,
      analytics: false,
      marketing: false,
      timestamp: '2026-06-01T00:00:00.000Z',
    }
    localStorage.setItem(CONSENT_KEY, JSON.stringify(v2State))
    localStorage.setItem(
      LEGACY_KEY,
      JSON.stringify({ analytics: true, timestamp: '2026-01-01T00:00:00.000Z' })
    )
    expect(readConsent()).toEqual(v2State)
  })
})

// ─── acceptAll / rejectAll ────────────────────────────────────────────────────

describe('acceptAll', () => {
  it('writes all non-necessary categories as true', () => {
    ;(window as Window & { dataLayer?: unknown[] }).dataLayer = []
    acceptAll()
    const stored = readConsent()
    expect(stored?.functional).toBe(true)
    expect(stored?.analytics).toBe(true)
    expect(stored?.marketing).toBe(true)
  })
})

describe('rejectAll', () => {
  it('writes all non-necessary categories as false', () => {
    ;(window as Window & { dataLayer?: unknown[] }).dataLayer = []
    rejectAll()
    const stored = readConsent()
    expect(stored?.functional).toBe(false)
    expect(stored?.analytics).toBe(false)
    expect(stored?.marketing).toBe(false)
  })
})
