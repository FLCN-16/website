import type { RawSiteSettings } from './data'

export interface SiteIdentity {
  name: string
  handle: string
  role: string
  location: string
  timezone: string
  email: string
  url: string
  description: string
  alternateName: string
  addressCity: string
  addressRegion: string
  addressCountry: string
  socials: Array<{ platform: string; url: string; label: string }>
  resumeUrl: string | null
  status: { available: boolean; label: string }
}

const FALLBACK_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://example.com'

export function buildIdentity(settings: RawSiteSettings | null): SiteIdentity {
  return {
    name: settings?.identity?.name ?? 'Your Name',
    handle: settings?.identity?.handle ?? 'username',
    role: settings?.identity?.role ?? 'Developer',
    location: settings?.identity?.location ?? 'Worldwide',
    timezone: settings?.identity?.timezone ?? 'UTC',
    email: settings?.identity?.email ?? 'hello@example.com',
    url: settings?.identity?.siteUrl ?? FALLBACK_URL,
    description: settings?.identity?.description ?? 'A personal portfolio and blog.',
    alternateName: settings?.identity?.alternateName ?? '',
    addressCity: settings?.identity?.addressCity ?? '',
    addressRegion: settings?.identity?.addressRegion ?? '',
    addressCountry: settings?.identity?.addressCountry ?? '',
    socials:
      settings?.socials?.map((s) => ({
        platform: s.platform,
        url: s.url,
        label: s.label ?? s.platform,
      })) ?? [],
    resumeUrl: settings?.resume?.url ?? null,
    status: {
      available: settings?.availability?.available ?? false,
      label: settings?.availability?.label ?? 'OPEN TO ROLES',
    },
  }
}
