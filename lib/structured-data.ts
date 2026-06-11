import type { SiteIdentity } from '@/lib/site-identity'
import { stack } from '@/content/stack'

/** Compact Person reference for author/publisher fields on other schemas */
export function personRef(identity: SiteIdentity) {
  const personId = `${identity.url}/#person`
  return {
    '@type': 'Person',
    '@id': personId,
    name: identity.name,
    url: identity.url,
  }
}

export function personSchema(identity: SiteIdentity) {
  const personId = `${identity.url}/#person`
  const knowsAbout = [
    ...new Set(
      stack.disciplines.flatMap((d) =>
        d.tools
          .filter((t) => t.maturity === 'expert' || t.maturity === 'proficient')
          .map((t) => t.name)
      )
    ),
  ]

  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': personId,
    name: identity.name,
    alternateName: 'The Falcon',
    url: identity.url,
    email: identity.email,
    jobTitle: identity.role,
    description: identity.description,
    sameAs: identity.socials.map((s) => s.url),
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Jalandhar',
      addressRegion: 'Punjab',
      addressCountry: 'IN',
    },
    knowsAbout,
  }
}

export function websiteSchema(identity: SiteIdentity) {
  const websiteId = `${identity.url}/#website`
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': websiteId,
    name: identity.name,
    alternateName: 'The Falcon',
    url: identity.url,
    description: identity.description,
    inLanguage: 'en',
    publisher: personRef(identity),
  }
}

export function breadcrumbSchema(identity: SiteIdentity, items: { name: string; path?: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      ...(item.path ? { item: `${identity.url}${item.path}` } : {}),
    })),
  }
}
