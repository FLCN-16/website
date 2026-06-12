import { describe, it, expect } from 'vitest'
import { buildIdentity } from '../site-identity'
import type { RawSiteSettings } from '../data'

describe('buildIdentity', () => {
  it('returns placeholder defaults when settings is null', () => {
    const identity = buildIdentity(null)
    expect(identity.name).toBe('Your Name')
    expect(identity.url).toBeTruthy()
    expect(identity.socials).toEqual([])
    expect(identity.status.available).toBe(false)
  })

  it('uses CMS values when present', () => {
    const settings: RawSiteSettings = {
      identity: {
        name: 'Jane Smith',
        handle: 'janesmith',
        role: 'Senior Dev',
        location: 'Austin, TX',
        timezone: 'UTC-6',
        email: 'jane@example.com',
        siteUrl: 'https://janesmith.dev',
        description: 'A developer.',
      },
      socials: [{ platform: 'github', url: 'https://github.com/janesmith', label: 'GitHub' }],
      availability: { available: true, label: 'OPEN TO ROLES' },
    }
    const identity = buildIdentity(settings)
    expect(identity.name).toBe('Jane Smith')
    expect(identity.url).toBe('https://janesmith.dev')
    expect(identity.socials).toHaveLength(1)
    expect(identity.socials[0].platform).toBe('github')
    expect(identity.status.available).toBe(true)
    expect(identity.status.label).toBe('OPEN TO ROLES')
  })

  it('returns null resumeUrl when no resume is uploaded', () => {
    const identity = buildIdentity(null)
    expect(identity.resumeUrl).toBeNull()
  })

  it('uses the uploaded resume URL from settings', () => {
    const settings: RawSiteSettings = {
      resume: { url: 'https://media.example.dev/resume.pdf', filename: 'resume.pdf' },
    }
    const identity = buildIdentity(settings)
    expect(identity.resumeUrl).toBe('https://media.example.dev/resume.pdf')
  })

  it('falls back gracefully when socials label is missing', () => {
    const settings: RawSiteSettings = {
      socials: [{ platform: 'linkedin', url: 'https://linkedin.com/in/jane' }],
    }
    const identity = buildIdentity(settings)
    expect(identity.socials[0].label).toBe('linkedin')
  })
})
