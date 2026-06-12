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

export function personSchema(
  identity: SiteIdentity,
  collections?: {
    currentJob?: { company: string } | null
    latestEducation?: { institution: string } | null
  }
) {
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

  const hasAddress = identity.addressCity || identity.addressRegion || identity.addressCountry

  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': personId,
    name: identity.name,
    ...(identity.alternateName ? { alternateName: identity.alternateName } : {}),
    url: identity.url,
    email: identity.email,
    jobTitle: identity.role,
    description: identity.description,
    sameAs: identity.socials.map((s) => s.url),
    ...(hasAddress
      ? {
          address: {
            '@type': 'PostalAddress',
            addressLocality: identity.addressCity,
            addressRegion: identity.addressRegion,
            addressCountry: identity.addressCountry,
          },
        }
      : {}),
    ...(collections?.currentJob
      ? { worksFor: { '@type': 'Organization', name: collections.currentJob.company } }
      : {}),
    ...(collections?.latestEducation
      ? { alumniOf: { '@type': 'EducationalOrganization', name: collections.latestEducation.institution } }
      : {}),
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
    ...(identity.alternateName ? { alternateName: identity.alternateName } : {}),
    url: identity.url,
    description: identity.description,
    inLanguage: 'en',
    publisher: personRef(identity),
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${identity.url}/writing?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
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
