/** ISO-3166-1 alpha-2 country codes where cookie consent is legally required. */
export const CONSENT_REQUIRED_COUNTRIES = [
  // EU-27
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE',
  'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE',
  // EEA (non-EU)
  'IS', 'LI', 'NO',
  // UK + Switzerland
  'GB', 'CH',
] as const

/**
 * Returns true if the country code requires cookie consent (GDPR / ePrivacy / FADP).
 * Treats unknown / null / empty codes as required (fail-safe default).
 */
export function isConsentRequiredCountry(code: string | null | undefined): boolean {
  if (!code) return true
  return (CONSENT_REQUIRED_COUNTRIES as readonly string[]).includes(code.toUpperCase())
}
