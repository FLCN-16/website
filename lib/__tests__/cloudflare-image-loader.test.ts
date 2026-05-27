import { describe, it, expect } from 'vitest'
import { buildCloudflareUrl } from '../cloudflare-image-loader'

const BASE = 'https://media.thefalcon.dev'

describe('buildCloudflareUrl', () => {
  it('builds transform URL from a full src URL', () => {
    const result = buildCloudflareUrl(`${BASE}/photo.jpg`, 800, 85, BASE)
    expect(result).toBe(`${BASE}/cdn-cgi/image/width=800,quality=85,format=auto/photo.jpg`)
  })

  it('builds transform URL from a relative src path', () => {
    const result = buildCloudflareUrl('/photo.jpg', 400, 75, BASE)
    expect(result).toBe(`${BASE}/cdn-cgi/image/width=400,quality=75,format=auto/photo.jpg`)
  })

  it('defaults quality to 85 when not provided', () => {
    const result = buildCloudflareUrl(`${BASE}/img.png`, 1200, undefined, BASE)
    expect(result).toBe(`${BASE}/cdn-cgi/image/width=1200,quality=85,format=auto/img.png`)
  })

  it('handles filenames with subdirectories', () => {
    const result = buildCloudflareUrl(`${BASE}/uploads/hero.jpg`, 800, 85, BASE)
    expect(result).toBe(`${BASE}/cdn-cgi/image/width=800,quality=85,format=auto/uploads/hero.jpg`)
  })
})
