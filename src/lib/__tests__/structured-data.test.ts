import { describe, it, expect } from 'vitest'
import {
  graph,
  organizationNode,
  websiteNode,
  personNode,
  profilePageNode,
  webPageNode,
  breadcrumbNode,
  blogPostingNode,
  creativeWorkNode,
  collectionPageNode,
  personRef,
} from '../structured-data'
import type { SiteIdentity } from '../site-identity'

const base: SiteIdentity = {
  name: 'Jane Smith',
  handle: 'janesmith',
  role: 'Developer',
  location: 'Austin, TX',
  timezone: 'UTC-6',
  email: 'jane@example.com',
  url: 'https://janesmith.dev',
  description: 'A developer.',
  alternateName: '',
  addressCity: '',
  addressRegion: '',
  addressCountry: '',
  socials: [],
  resumeUrl: null,
  status: { available: false, label: 'OPEN TO ROLES' },
}

// ─── graph() ────────────────────────────────────────────────────────────────

describe('graph', () => {
  it('wraps nodes with @context and @graph', () => {
    const result = graph([{ '@type': 'Thing' }]) as Record<string, unknown>
    expect(result['@context']).toBe('https://schema.org')
    expect(Array.isArray(result['@graph'])).toBe(true)
    expect((result['@graph'] as unknown[]).length).toBe(1)
  })

  it('passes nodes through unchanged', () => {
    const node = { '@type': 'Thing', name: 'test' }
    const result = graph([node]) as Record<string, unknown>
    expect((result['@graph'] as unknown[])[0]).toEqual(node)
  })
})

// ─── personRef() ────────────────────────────────────────────────────────────

describe('personRef', () => {
  it('returns compact Person ref with @id', () => {
    const ref = personRef(base) as Record<string, unknown>
    expect(ref['@type']).toBe('Person')
    expect(ref['@id']).toBe('https://janesmith.dev/#person')
    expect(ref.name).toBe('Jane Smith')
    expect(ref.url).toBe('https://janesmith.dev')
  })

  it('does not include @context', () => {
    const ref = personRef(base) as Record<string, unknown>
    expect(ref).not.toHaveProperty('@context')
  })
})

// ─── organizationNode() ─────────────────────────────────────────────────────

describe('organizationNode', () => {
  it('uses alternateName as organization name when set', () => {
    const node = organizationNode({ ...base, alternateName: 'The Brand' }) as Record<string, unknown>
    expect(node['@type']).toBe('Organization')
    expect(node.name).toBe('The Brand')
  })

  it('falls back to identity.name when alternateName is blank', () => {
    const node = organizationNode(base) as Record<string, unknown>
    expect(node.name).toBe('Jane Smith')
  })

  it('sets @id to /#organization', () => {
    const node = organizationNode(base) as Record<string, unknown>
    expect(node['@id']).toBe('https://janesmith.dev/#organization')
  })

  it('includes founder cross-link to /#person', () => {
    const node = organizationNode(base) as Record<string, unknown>
    expect((node.founder as Record<string, unknown>)['@id']).toBe('https://janesmith.dev/#person')
  })

  it('does not include logo', () => {
    const node = organizationNode(base) as Record<string, unknown>
    expect(node).not.toHaveProperty('logo')
  })

  it('does not include @context', () => {
    const node = organizationNode(base) as Record<string, unknown>
    expect(node).not.toHaveProperty('@context')
  })

  it('includes sameAs from socials', () => {
    const identity = { ...base, socials: [{ platform: 'github', url: 'https://github.com/jane', label: 'GitHub' }] }
    const node = organizationNode(identity) as Record<string, unknown>
    expect(node.sameAs).toEqual(['https://github.com/jane'])
  })
})

// ─── websiteNode() ──────────────────────────────────────────────────────────

describe('websiteNode', () => {
  it('sets @id to /#website', () => {
    const node = websiteNode(base) as Record<string, unknown>
    expect(node['@id']).toBe('https://janesmith.dev/#website')
  })

  it('publisher points to /#organization (not person)', () => {
    const node = websiteNode(base) as Record<string, unknown>
    expect((node.publisher as Record<string, unknown>)['@id']).toBe('https://janesmith.dev/#organization')
  })

  it('SearchAction targets /writing?q={search_term_string}', () => {
    const node = websiteNode(base) as Record<string, unknown>
    const action = node.potentialAction as Record<string, unknown>
    expect(action['@type']).toBe('SearchAction')
    const target = action.target as Record<string, unknown>
    expect(target.urlTemplate).toBe('https://janesmith.dev/writing?q={search_term_string}')
    expect(action['query-input']).toBe('required name=search_term_string')
  })

  it('omits alternateName when blank', () => {
    const node = websiteNode(base) as Record<string, unknown>
    expect(node).not.toHaveProperty('alternateName')
  })

  it('includes alternateName when set', () => {
    const node = websiteNode({ ...base, alternateName: 'JD Site' }) as Record<string, unknown>
    expect(node.alternateName).toBe('JD Site')
  })

  it('does not include @context', () => {
    const node = websiteNode(base) as Record<string, unknown>
    expect(node).not.toHaveProperty('@context')
  })
})

// ─── personNode() ───────────────────────────────────────────────────────────

describe('personNode', () => {
  it('sets @id to /#person', () => {
    const node = personNode(base) as Record<string, unknown>
    expect(node['@id']).toBe('https://janesmith.dev/#person')
  })

  it('omits alternateName when blank', () => {
    const node = personNode(base) as Record<string, unknown>
    expect(node).not.toHaveProperty('alternateName')
  })

  it('includes alternateName when set', () => {
    const node = personNode({ ...base, alternateName: 'JD' }) as Record<string, unknown>
    expect((node as Record<string, unknown>).alternateName).toBe('JD')
  })

  it('omits address when all address fields are blank', () => {
    const node = personNode(base) as Record<string, unknown>
    expect(node).not.toHaveProperty('address')
  })

  it('includes address when at least one address field is non-empty', () => {
    const node = personNode({ ...base, addressCity: 'Austin', addressRegion: 'TX', addressCountry: 'US' }) as Record<string, unknown>
    expect(node.address).toEqual({
      '@type': 'PostalAddress',
      addressLocality: 'Austin',
      addressRegion: 'TX',
      addressCountry: 'US',
    })
  })

  it('omits worksFor when no currentJob provided', () => {
    const node = personNode(base) as Record<string, unknown>
    expect(node).not.toHaveProperty('worksFor')
  })

  it('includes worksFor when currentJob is provided', () => {
    const node = personNode(base, { currentJob: { company: 'Acme Corp' } }) as Record<string, unknown>
    expect(node.worksFor).toEqual({ '@type': 'Organization', name: 'Acme Corp' })
  })

  it('omits alumniOf when no latestEducation provided', () => {
    const node = personNode(base) as Record<string, unknown>
    expect(node).not.toHaveProperty('alumniOf')
  })

  it('includes alumniOf when latestEducation is provided', () => {
    const node = personNode(base, { latestEducation: { institution: 'MIT' } }) as Record<string, unknown>
    expect(node.alumniOf).toEqual({ '@type': 'EducationalOrganization', name: 'MIT' })
  })

  it('omits hasCredential when credentials array is empty', () => {
    const node = personNode(base, { credentials: [] }) as Record<string, unknown>
    expect(node).not.toHaveProperty('hasCredential')
  })

  it('includes hasCredential as EducationalOccupationalCredential items', () => {
    const creds = [
      { name: 'AWS Solutions Architect', issuer: 'Amazon', year: '2023', credentialUrl: 'https://aws.amazon.com/cert' },
      { name: 'GCP Pro', issuer: 'Google', year: '2024' },
    ]
    const node = personNode(base, { credentials: creds }) as Record<string, unknown>
    const hc = node.hasCredential as Record<string, unknown>[]
    expect(hc).toHaveLength(2)
    expect(hc[0]['@type']).toBe('EducationalOccupationalCredential')
    expect(hc[0].name).toBe('AWS Solutions Architect')
    expect(hc[0].credentialCategory).toBe('certificate')
    expect((hc[0].recognizedBy as Record<string, unknown>).name).toBe('Amazon')
    expect(hc[0].url).toBe('https://aws.amazon.com/cert')
    // Second credential has no url
    expect(hc[1]).not.toHaveProperty('url')
  })

  it('does not include @context', () => {
    const node = personNode(base) as Record<string, unknown>
    expect(node).not.toHaveProperty('@context')
  })
})

// ─── profilePageNode() ──────────────────────────────────────────────────────

describe('profilePageNode', () => {
  it('is type ProfilePage', () => {
    const node = profilePageNode(base) as Record<string, unknown>
    expect(node['@type']).toBe('ProfilePage')
  })

  it('mainEntity points to /#person', () => {
    const node = profilePageNode(base) as Record<string, unknown>
    expect((node.mainEntity as Record<string, unknown>)['@id']).toBe('https://janesmith.dev/#person')
  })

  it('isPartOf points to /#website', () => {
    const node = profilePageNode(base) as Record<string, unknown>
    expect((node.isPartOf as Record<string, unknown>)['@id']).toBe('https://janesmith.dev/#website')
  })

  it('does not include @context', () => {
    const node = profilePageNode(base) as Record<string, unknown>
    expect(node).not.toHaveProperty('@context')
  })
})

// ─── webPageNode() ──────────────────────────────────────────────────────────

describe('webPageNode', () => {
  it('sets @id to path#webpage', () => {
    const node = webPageNode(base, { path: '/writing/hello', name: 'Hello' }) as Record<string, unknown>
    expect(node['@id']).toBe('https://janesmith.dev/writing/hello#webpage')
  })

  it('isPartOf points to /#website', () => {
    const node = webPageNode(base, { path: '/foo', name: 'Foo' }) as Record<string, unknown>
    expect((node.isPartOf as Record<string, unknown>)['@id']).toBe('https://janesmith.dev/#website')
  })

  it('includes primaryImageOfPage when imageUrl is provided', () => {
    const node = webPageNode(base, { path: '/p', name: 'P', imageUrl: 'https://img.example.com/x.jpg' }) as Record<string, unknown>
    expect((node.primaryImageOfPage as Record<string, unknown>).url).toBe('https://img.example.com/x.jpg')
  })

  it('omits primaryImageOfPage when imageUrl is absent', () => {
    const node = webPageNode(base, { path: '/p', name: 'P' }) as Record<string, unknown>
    expect(node).not.toHaveProperty('primaryImageOfPage')
  })

  it('includes breadcrumb cross-ref when breadcrumbId is provided', () => {
    const node = webPageNode(base, { path: '/p', name: 'P', breadcrumbId: 'https://janesmith.dev/p#breadcrumb' }) as Record<string, unknown>
    expect((node.breadcrumb as Record<string, unknown>)['@id']).toBe('https://janesmith.dev/p#breadcrumb')
  })

  it('does not include @context', () => {
    const node = webPageNode(base, { path: '/p', name: 'P' }) as Record<string, unknown>
    expect(node).not.toHaveProperty('@context')
  })
})

// ─── breadcrumbNode() ───────────────────────────────────────────────────────

describe('breadcrumbNode', () => {
  it('sets @id to path#breadcrumb', () => {
    const node = breadcrumbNode(base, [{ name: 'Home', path: '/' }], '/writing') as Record<string, unknown>
    expect(node['@id']).toBe('https://janesmith.dev/writing#breadcrumb')
  })

  it('produces ListItems with position starting at 1', () => {
    const node = breadcrumbNode(base, [
      { name: 'Home', path: '/' },
      { name: 'Writing', path: '/writing' },
      { name: 'My Post' },
    ], '/writing/my-post') as Record<string, unknown>
    const items = node.itemListElement as Record<string, unknown>[]
    expect(items[0].position).toBe(1)
    expect(items[1].position).toBe(2)
    expect(items[2].position).toBe(3)
    expect(items[0].item).toBe('https://janesmith.dev/')
    expect(items[2]).not.toHaveProperty('item')  // no path → no item URL
  })

  it('does not include @context', () => {
    const node = breadcrumbNode(base, [], '/test') as Record<string, unknown>
    expect(node).not.toHaveProperty('@context')
  })
})

// ─── blogPostingNode() ──────────────────────────────────────────────────────

describe('blogPostingNode', () => {
  const post = {
    title: 'Hello World',
    slug: 'hello-world',
    excerpt: 'An intro post.',
    meta: { description: 'Meta desc' },
    cover: { url: 'https://img.example.com/cover.jpg' },
    tags: ['react', 'typescript'],
    publishedAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-06-01T00:00:00.000Z',
  }

  it('sets @type to BlogPosting', () => {
    const node = blogPostingNode(base, post) as Record<string, unknown>
    expect(node['@type']).toBe('BlogPosting')
  })

  it('author points to /#person', () => {
    const node = blogPostingNode(base, post) as Record<string, unknown>
    expect((node.author as Record<string, unknown>)['@id']).toBe('https://janesmith.dev/#person')
  })

  it('publisher points to /#organization', () => {
    const node = blogPostingNode(base, post) as Record<string, unknown>
    expect((node.publisher as Record<string, unknown>)['@id']).toBe('https://janesmith.dev/#organization')
  })

  it('isPartOf points to /#website', () => {
    const node = blogPostingNode(base, post) as Record<string, unknown>
    expect((node.isPartOf as Record<string, unknown>)['@id']).toBe('https://janesmith.dev/#website')
  })

  it('mainEntityOfPage points to slug#webpage', () => {
    const node = blogPostingNode(base, post) as Record<string, unknown>
    expect((node.mainEntityOfPage as Record<string, unknown>)['@id']).toBe('https://janesmith.dev/writing/hello-world#webpage')
  })

  it('includes image from cover.url', () => {
    const node = blogPostingNode(base, post) as Record<string, unknown>
    expect(node.image).toBe('https://img.example.com/cover.jpg')
  })

  it('includes keywords from tags', () => {
    const node = blogPostingNode(base, post) as Record<string, unknown>
    expect(node.keywords).toBe('react, typescript')
  })

  it('omits keywords when tags are empty', () => {
    const node = blogPostingNode(base, { ...post, tags: [] }) as Record<string, unknown>
    expect(node).not.toHaveProperty('keywords')
  })

  it('handles null tags gracefully', () => {
    const node = blogPostingNode(base, { ...post, tags: null }) as Record<string, unknown>
    expect(node).not.toHaveProperty('keywords')
  })

  it('prefers meta.description over excerpt for description', () => {
    const node = blogPostingNode(base, post) as Record<string, unknown>
    expect(node.description).toBe('Meta desc')
  })

  it('does not include @context', () => {
    const node = blogPostingNode(base, post) as Record<string, unknown>
    expect(node).not.toHaveProperty('@context')
  })
})

// ─── creativeWorkNode() ─────────────────────────────────────────────────────

describe('creativeWorkNode', () => {
  const work = {
    title: 'My Project',
    slug: 'my-project',
    description: 'A project.',
    meta: { description: 'Meta desc', image: { url: 'https://img.example.com/meta.jpg' } },
    cover: { url: 'https://img.example.com/cover.jpg' },
    tags: ['react'],
  }

  it('sets @type to CreativeWork', () => {
    const node = creativeWorkNode(base, work) as Record<string, unknown>
    expect(node['@type']).toBe('CreativeWork')
  })

  it('author points to /#person', () => {
    const node = creativeWorkNode(base, work) as Record<string, unknown>
    expect((node.author as Record<string, unknown>)['@id']).toBe('https://janesmith.dev/#person')
  })

  it('prefers meta.image over cover for image', () => {
    const node = creativeWorkNode(base, work) as Record<string, unknown>
    expect(node.image).toBe('https://img.example.com/meta.jpg')
  })

  it('falls back to cover.url when meta.image is absent', () => {
    const node = creativeWorkNode(base, { ...work, meta: { description: 'x', image: null } }) as Record<string, unknown>
    expect(node.image).toBe('https://img.example.com/cover.jpg')
  })

  it('omits image when neither meta.image nor cover exist', () => {
    const node = creativeWorkNode(base, { ...work, meta: null, cover: null }) as Record<string, unknown>
    expect(node).not.toHaveProperty('image')
  })

  it('does not include @context', () => {
    const node = creativeWorkNode(base, work) as Record<string, unknown>
    expect(node).not.toHaveProperty('@context')
  })
})

// ─── collectionPageNode() ───────────────────────────────────────────────────

describe('collectionPageNode', () => {
  const items = [
    { name: 'Post 1', url: 'https://janesmith.dev/writing/post-1', position: 1 },
    { name: 'Post 2', url: 'https://janesmith.dev/writing/post-2', description: 'desc', position: 2 },
  ]

  it('defaults to CollectionPage type', () => {
    const node = collectionPageNode(base, { path: '/writing', name: 'Writing', items }) as Record<string, unknown>
    expect(node['@type']).toBe('CollectionPage')
  })

  it('uses Blog type when specified', () => {
    const node = collectionPageNode(base, { path: '/writing', name: 'Writing', items, type: 'Blog' }) as Record<string, unknown>
    expect(node['@type']).toBe('Blog')
  })

  it('hasPart items are Article type for Blog', () => {
    const node = collectionPageNode(base, { path: '/writing', name: 'Writing', items, type: 'Blog' }) as Record<string, unknown>
    const parts = node.hasPart as Record<string, unknown>[]
    expect(parts[0]['@type']).toBe('Article')
  })

  it('hasPart items are CreativeWork type for CollectionPage', () => {
    const node = collectionPageNode(base, { path: '/projects', name: 'Projects', items }) as Record<string, unknown>
    const parts = node.hasPart as Record<string, unknown>[]
    expect(parts[0]['@type']).toBe('CreativeWork')
  })

  it('isPartOf points to /#website', () => {
    const node = collectionPageNode(base, { path: '/writing', name: 'Writing', items }) as Record<string, unknown>
    expect((node.isPartOf as Record<string, unknown>)['@id']).toBe('https://janesmith.dev/#website')
  })

  it('does not include @context', () => {
    const node = collectionPageNode(base, { path: '/writing', name: 'Writing', items }) as Record<string, unknown>
    expect(node).not.toHaveProperty('@context')
  })
})
