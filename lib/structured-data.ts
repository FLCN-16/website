import { site } from '@/content/site'
import { stack } from '@/content/stack'

export const PERSON_ID = `${site.url}/#person`
export const WEBSITE_ID = `${site.url}/#website`

/** Compact Person reference for author/publisher fields on other schemas */
export function personRef() {
  return {
    '@type': 'Person',
    '@id': PERSON_ID,
    name: site.name,
    url: site.url,
  }
}

export function personSchema() {
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
    '@id': PERSON_ID,
    name: site.name,
    alternateName: 'The Falcon',
    url: site.url,
    email: site.email,
    jobTitle: site.role,
    description: site.description,
    sameAs: site.socials.map((s) => s.url),
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Jalandhar',
      addressRegion: 'Punjab',
      addressCountry: 'IN',
    },
    knowsAbout,
  }
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    name: site.name,
    alternateName: 'The Falcon',
    url: site.url,
    description: site.description,
    inLanguage: 'en',
    publisher: personRef(),
  }
}

export function breadcrumbSchema(items: { name: string; path?: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      ...(item.path ? { item: `${site.url}${item.path}` } : {}),
    })),
  }
}
