import { describe, it, expect } from 'vitest'
import { personSchema, websiteSchema } from '../structured-data'
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

describe('personSchema', () => {
  it('omits alternateName when blank', () => {
    const schema = personSchema(base)
    expect(schema).not.toHaveProperty('alternateName')
  })

  it('includes alternateName when set', () => {
    const schema = personSchema({ ...base, alternateName: 'JD' })
    expect((schema as Record<string, unknown>).alternateName).toBe('JD')
  })

  it('omits address when all address fields are blank', () => {
    const schema = personSchema(base)
    expect(schema).not.toHaveProperty('address')
  })

  it('includes address when at least one address field is non-empty', () => {
    const schema = personSchema({
      ...base,
      addressCity: 'Austin',
      addressRegion: 'TX',
      addressCountry: 'US',
    })
    expect((schema as Record<string, unknown>).address).toEqual({
      '@type': 'PostalAddress',
      addressLocality: 'Austin',
      addressRegion: 'TX',
      addressCountry: 'US',
    })
  })

  it('omits worksFor when no currentJob provided', () => {
    const schema = personSchema(base)
    expect(schema).not.toHaveProperty('worksFor')
  })

  it('includes worksFor when currentJob is provided', () => {
    const schema = personSchema(base, { currentJob: { company: 'Acme Corp' } })
    expect((schema as Record<string, unknown>).worksFor).toEqual({
      '@type': 'Organization',
      name: 'Acme Corp',
    })
  })

  it('omits alumniOf when no latestEducation provided', () => {
    const schema = personSchema(base)
    expect(schema).not.toHaveProperty('alumniOf')
  })

  it('includes alumniOf when latestEducation is provided', () => {
    const schema = personSchema(base, { latestEducation: { institution: 'MIT' } })
    expect((schema as Record<string, unknown>).alumniOf).toEqual({
      '@type': 'EducationalOrganization',
      name: 'MIT',
    })
  })
})

describe('websiteSchema', () => {
  it('omits alternateName when blank', () => {
    const schema = websiteSchema(base)
    expect(schema).not.toHaveProperty('alternateName')
  })

  it('includes alternateName when set', () => {
    const schema = websiteSchema({ ...base, alternateName: 'JD Site' })
    expect((schema as Record<string, unknown>).alternateName).toBe('JD Site')
  })
})
