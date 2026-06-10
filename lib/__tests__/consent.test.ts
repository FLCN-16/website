import { describe, expect, it } from 'vitest'
import { CONSENT_KEY, consentModePayload, parseConsent } from '@/lib/consent'

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

  it('parses a valid consent record', () => {
    const raw = JSON.stringify({ analytics: true, timestamp: '2026-06-10T00:00:00.000Z' })
    expect(parseConsent(raw)).toEqual({ analytics: true, timestamp: '2026-06-10T00:00:00.000Z' })
  })

  it('tolerates a missing timestamp', () => {
    expect(parseConsent('{"analytics":false}')).toEqual({ analytics: false, timestamp: '' })
  })
})

describe('consentModePayload', () => {
  it('grants all four signals when true', () => {
    expect(consentModePayload(true)).toEqual({
      ad_storage: 'granted',
      ad_user_data: 'granted',
      ad_personalization: 'granted',
      analytics_storage: 'granted',
    })
  })

  it('denies all four signals when false', () => {
    expect(consentModePayload(false)).toEqual({
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      analytics_storage: 'denied',
    })
  })
})

describe('CONSENT_KEY', () => {
  it('is the versioned storage key the inline layout script also hardcodes', () => {
    expect(CONSENT_KEY).toBe('flcn-consent-v1')
  })
})
