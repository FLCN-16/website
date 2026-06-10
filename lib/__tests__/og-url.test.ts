import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { buildOgUrl, createMetadata, resolveMetaImage } from '../metadata'

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

  it('passes MetaImage dimensions and alt through to og:image', () => {
    const meta = createMetadata({
      title: 'Post',
      image: { url: 'https://cdn.example.com/cover.jpg', width: 1200, height: 630, alt: 'Cover art' },
    })
    const images = (meta.openGraph as Record<string, unknown>)?.images as Record<string, unknown>[]
    expect(images[0]).toEqual({ url: 'https://cdn.example.com/cover.jpg', width: 1200, height: 630, alt: 'Cover art' })
  })
})

describe('resolveMetaImage', () => {
  const MEDIA = 'https://media.example.dev'
  let prevMediaUrl: string | undefined

  beforeEach(() => {
    prevMediaUrl = process.env.NEXT_PUBLIC_MEDIA_URL
    process.env.NEXT_PUBLIC_MEDIA_URL = MEDIA
  })

  afterEach(() => {
    if (prevMediaUrl === undefined) delete process.env.NEXT_PUBLIC_MEDIA_URL
    else process.env.NEXT_PUBLIC_MEDIA_URL = prevMediaUrl
  })

  it('returns undefined for unpopulated (string id) or missing images', () => {
    expect(resolveMetaImage('6a28ac61dda8dc628f8159c8')).toBeUndefined()
    expect(resolveMetaImage(null)).toBeUndefined()
    expect(resolveMetaImage({ url: null })).toBeUndefined()
  })

  it('routes media-domain images through cdn-cgi resize capped at 1200, scaling dimensions', () => {
    const img = resolveMetaImage({ url: `${MEDIA}/cover.png`, width: 1731, height: 909, alt: 'Cover' })
    expect(img).toEqual({
      url: `${MEDIA}/cdn-cgi/image/width=1200,quality=85,format=auto/cover.png`,
      width: 1200,
      height: 630,
      alt: 'Cover',
    })
  })

  it('does not upscale images narrower than 1200', () => {
    const img = resolveMetaImage({ url: `${MEDIA}/small.png`, width: 800, height: 400 })
    expect(img?.url).toBe(`${MEDIA}/cdn-cgi/image/width=800,quality=85,format=auto/small.png`)
    expect(img?.width).toBe(800)
    expect(img?.height).toBe(400)
  })

  it('leaves non-media-domain URLs untouched', () => {
    const img = resolveMetaImage({ url: 'https://elsewhere.com/img.png', width: 2000, height: 1000 })
    expect(img).toEqual({ url: 'https://elsewhere.com/img.png', width: 2000, height: 1000, alt: undefined })
  })
})
