import type { SiteIdentity } from '@/lib/site-identity'
import { stack } from '@/content/stack'

// ---------------------------------------------------------------------------
// graph() — wraps node builders into a standalone JSON-LD document
// ---------------------------------------------------------------------------

/** Wraps an array of node objects into a JSON-LD @graph document. */
export function graph(nodes: object[]): object {
  return {
    '@context': 'https://schema.org',
    '@graph': nodes,
  }
}

// ---------------------------------------------------------------------------
// Compact reference helpers (no @context — used inline in other nodes)
// ---------------------------------------------------------------------------

/** Compact Person reference for author/publisher fields on other nodes. */
export function personRef(identity: SiteIdentity) {
  const personId = `${identity.url}/#person`
  return {
    '@type': 'Person',
    '@id': personId,
    name: identity.name,
    url: identity.url,
  }
}

// ---------------------------------------------------------------------------
// Node builders — no @context; meant to be composed inside graph()
// ---------------------------------------------------------------------------

/** Organization node for the brand entity ("The Falcon"). */
export function organizationNode(identity: SiteIdentity): object {
  const orgId = `${identity.url}/#organization`
  return {
    '@type': 'Organization',
    '@id': orgId,
    name: identity.alternateName || identity.name,
    url: identity.url,
    ...(identity.socials.length > 0 ? { sameAs: identity.socials.map((s) => s.url) } : {}),
    founder: { '@id': `${identity.url}/#person` },
  }
}

/** WebSite node. */
export function websiteNode(identity: SiteIdentity): object {
  const websiteId = `${identity.url}/#website`
  return {
    '@type': 'WebSite',
    '@id': websiteId,
    name: identity.name,
    ...(identity.alternateName ? { alternateName: identity.alternateName } : {}),
    url: identity.url,
    description: identity.description,
    inLanguage: 'en',
    publisher: { '@id': `${identity.url}/#organization` },
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

/** Person node with optional CMS-driven collections data. */
export function personNode(
  identity: SiteIdentity,
  collections?: {
    currentJob?: { company: string } | null
    latestEducation?: { institution: string } | null
    credentials?: Array<{
      name: string
      issuer: string
      year: string
      credentialUrl?: string
    }> | null
  }
): object {
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
  const creds = collections?.credentials
  const hasCredential =
    creds && creds.length > 0
      ? creds.map((c) => ({
          '@type': 'EducationalOccupationalCredential',
          name: c.name,
          credentialCategory: 'certificate',
          recognizedBy: { '@type': 'Organization', name: c.issuer },
          ...(c.credentialUrl ? { url: c.credentialUrl } : {}),
        }))
      : null

  return {
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
      ? {
          alumniOf: {
            '@type': 'EducationalOrganization',
            name: collections.latestEducation.institution,
          },
        }
      : {}),
    ...(hasCredential ? { hasCredential } : {}),
    knowsAbout,
  }
}

/** ProfilePage node for the homepage / portfolio root. */
export function profilePageNode(identity: SiteIdentity): object {
  return {
    '@type': 'ProfilePage',
    '@id': `${identity.url}/#profile`,
    url: identity.url,
    name: `${identity.name} — Portfolio`,
    mainEntity: { '@id': `${identity.url}/#person` },
    isPartOf: { '@id': `${identity.url}/#website` },
  }
}

// ---------------------------------------------------------------------------
// WebPage node
// ---------------------------------------------------------------------------

export interface WebPageOpts {
  path: string
  name: string
  description?: string
  imageUrl?: string
  breadcrumbId?: string
}

/** Generic WebPage node for any route. */
export function webPageNode(identity: SiteIdentity, opts: WebPageOpts): object {
  return {
    '@type': 'WebPage',
    '@id': `${identity.url}${opts.path}#webpage`,
    url: `${identity.url}${opts.path}`,
    name: opts.name,
    ...(opts.description ? { description: opts.description } : {}),
    isPartOf: { '@id': `${identity.url}/#website` },
    inLanguage: 'en',
    author: { '@id': `${identity.url}/#person` },
    ...(opts.imageUrl
      ? { primaryImageOfPage: { '@type': 'ImageObject', url: opts.imageUrl } }
      : {}),
    ...(opts.breadcrumbId ? { breadcrumb: { '@id': opts.breadcrumbId } } : {}),
  }
}

// ---------------------------------------------------------------------------
// BreadcrumbList node
// ---------------------------------------------------------------------------

export interface BreadcrumbItem {
  name: string
  path?: string
}

/** BreadcrumbList node. `path` is the page path that anchors the @id. */
export function breadcrumbNode(
  identity: SiteIdentity,
  items: BreadcrumbItem[],
  path: string
): object {
  return {
    '@type': 'BreadcrumbList',
    '@id': `${identity.url}${path}#breadcrumb`,
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      ...(item.path ? { item: `${identity.url}${item.path}` } : {}),
    })),
  }
}

// ---------------------------------------------------------------------------
// BlogPosting node
// ---------------------------------------------------------------------------

export interface BlogPostInput {
  title: string
  slug: string
  excerpt?: string | null
  meta?: { title?: string | null; description?: string | null } | null
  cover?: { url?: string | null } | null
  tags?: string[] | null
  publishedAt?: string | null
  updatedAt?: string
}

/** BlogPosting node for individual writing posts. */
export function blogPostingNode(identity: SiteIdentity, post: BlogPostInput): object {
  const postUrl = `${identity.url}/writing/${post.slug}`
  const description = post.meta?.description || post.excerpt || undefined
  const tags = post.tags ?? []

  return {
    '@type': 'BlogPosting',
    '@id': `${postUrl}#article`,
    headline: post.title,
    ...(description ? { description } : {}),
    url: postUrl,
    author: { '@id': `${identity.url}/#person` },
    publisher: { '@id': `${identity.url}/#organization` },
    isPartOf: { '@id': `${identity.url}/#website` },
    mainEntityOfPage: { '@id': `${postUrl}#webpage` },
    inLanguage: 'en',
    ...(tags.length > 0 ? { keywords: tags.join(', ') } : {}),
    ...(post.publishedAt ? { datePublished: post.publishedAt } : {}),
    ...(post.updatedAt ? { dateModified: post.updatedAt } : {}),
    ...(post.cover?.url ? { image: post.cover.url } : {}),
  }
}

// ---------------------------------------------------------------------------
// CreativeWork node
// ---------------------------------------------------------------------------

export interface CreativeWorkInput {
  title: string
  slug: string
  description?: string | null
  meta?: { description?: string | null; image?: { url?: string | null } | null } | null
  cover?: { url?: string | null } | null
  tags?: string[]
}

/** CreativeWork node for portfolio/work items. */
export function creativeWorkNode(identity: SiteIdentity, work: CreativeWorkInput): object {
  const workUrl = `${identity.url}/work/${work.slug}`
  const description = work.meta?.description || work.description || undefined
  const imageUrl = work.meta?.image?.url || work.cover?.url

  return {
    '@type': 'CreativeWork',
    '@id': `${workUrl}#work`,
    name: work.title,
    ...(description ? { description } : {}),
    url: workUrl,
    author: { '@id': `${identity.url}/#person` },
    inLanguage: 'en',
    ...(work.tags && work.tags.length > 0 ? { keywords: work.tags.join(', ') } : {}),
    ...(imageUrl ? { image: imageUrl } : {}),
  }
}

// ---------------------------------------------------------------------------
// CollectionPage node
// ---------------------------------------------------------------------------

export interface CollectionItem {
  name: string
  url: string
  description?: string
  imageUrl?: string
  position: number
}

export interface CollectionPageOpts {
  path: string
  name: string
  description?: string
  items: CollectionItem[]
  type?: 'CollectionPage' | 'Blog'
}

/** CollectionPage (or Blog) node for listing routes. */
export function collectionPageNode(identity: SiteIdentity, opts: CollectionPageOpts): object {
  return {
    '@type': opts.type ?? 'CollectionPage',
    '@id': `${identity.url}${opts.path}#webpage`,
    name: opts.name,
    ...(opts.description ? { description: opts.description } : {}),
    url: `${identity.url}${opts.path}`,
    isPartOf: { '@id': `${identity.url}/#website` },
    inLanguage: 'en',
    ...(opts.items.length > 0
      ? {
          hasPart: opts.items.map((item) => ({
            '@type': opts.type === 'Blog' ? 'Article' : 'CreativeWork',
            name: item.name,
            url: item.url,
            ...(item.description ? { description: item.description } : {}),
            ...(item.imageUrl ? { image: item.imageUrl } : {}),
          })),
        }
      : {}),
  }
}
