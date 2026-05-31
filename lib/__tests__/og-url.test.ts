import { describe, it, expect } from 'vitest'
import { buildOgUrl, createMetadata } from '../metadata'

// These tests fail until lib/metadata.ts exports buildOgUrl
// and createMetadata defaults to it when no image is passed.

describe('buildOgUrl', () => {
  it('returns a URL pointing to /og with a title param', () => {
    const url = buildOgUrl('Hello World')
    expect(url).toMatch(/\/og\?/)
    expect(new URL(url).searchParams.get('title')).toBe('Hello World')
  })

  it('includes kind when provided', () => {
    const url = buildOgUrl('My Post', 'WRITING')
    expect(new URL(url).searchParams.get('kind')).toBe('WRITING')
  })

  it('omits kind when not provided', () => {
    const url = buildOgUrl('My Post')
    expect(url).not.toContain('kind=')
  })

  it('truncates desc to 160 characters', () => {
    const long = 'A'.repeat(200)
    const url = buildOgUrl('Title', undefined, long)
    const desc = new URL(url).searchParams.get('desc')!
    expect(desc).toBe('A'.repeat(160))
  })

  it('omits desc when not provided', () => {
    const url = buildOgUrl('Title')
    expect(url).not.toContain('desc=')
  })
})

describe('createMetadata — image fallback', () => {
  it('sets og:image to a /og URL when no image is passed', () => {
    const meta = createMetadata({ title: 'Stack' })
    const images = (meta.openGraph as Record<string, unknown>)?.images as { url: string }[]
    expect(Array.isArray(images)).toBe(true)
    expect(images[0].url).toContain('/og?')
    expect(new URL(images[0].url).searchParams.get('title')).toBe('Stack')
  })

  it('uses the provided image when passed, ignoring /og fallback', () => {
    const meta = createMetadata({ title: 'Post', image: 'https://cdn.example.com/cover.jpg' })
    const images = (meta.openGraph as Record<string, unknown>)?.images as { url: string }[]
    expect(images[0].url).toBe('https://cdn.example.com/cover.jpg')
  })
})
