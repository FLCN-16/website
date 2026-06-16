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

// Placeholder codes emitted by geo providers for Tor/anonymous/unresolvable traffic.
// Vercel documents 'XX' for unresolvable IPs; MaxMind uses 'T1', 'A1', 'ZZ'.
const ANONYMOUS_CODES = new Set(['XX', 'T1', 'A1', 'ZZ'])

/**
 * Returns true if the country code requires cookie consent (GDPR / ePrivacy / FADP).
 * Treats null/empty and anonymous-traffic placeholder codes as required (fail-safe).
 */
export function isConsentRequiredCountry(code: string | null | undefined): boolean {
  if (!code) return true
  const upper = code.toUpperCase()
  if (ANONYMOUS_CODES.has(upper)) return true
  return (CONSENT_REQUIRED_COUNTRIES as readonly string[]).includes(upper)
}
