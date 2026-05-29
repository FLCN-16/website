import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'

const SITE_URL = 'http://localhost:3000'

describe('restFetch', () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_SITE_URL = SITE_URL
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.resetModules()
    delete process.env.NEXT_PUBLIC_SITE_URL
  })

  it('fetches from /api/<path> on the configured site URL', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ docs: [] }),
    })
    vi.stubGlobal('fetch', mockFetch)

    const { restFetch } = await import('../rest')
    await restFetch('posts?limit=50')

    expect(mockFetch).toHaveBeenCalledWith(
      `${SITE_URL}/api/posts?limit=50`,
      expect.objectContaining({ next: expect.objectContaining({ tags: [], revalidate: false }) })
    )
  })

  it('attaches cache tags in the next option', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ docs: [] }),
    })
    vi.stubGlobal('fetch', mockFetch)

    const { restFetch } = await import('../rest')
    await restFetch('posts', ['posts', 'post-hello'])

    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        next: expect.objectContaining({ tags: ['posts', 'post-hello'], revalidate: false }),
      })
    )
  })

  it('returns parsed JSON on success', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ docs: [{ id: '1', title: 'Post' }], totalDocs: 1 }),
    }))

    const { restFetch } = await import('../rest')
    const result = await restFetch<{ docs: Array<{ id: string }> }>('posts')

    expect(result).toEqual({ docs: [{ id: '1', title: 'Post' }], totalDocs: 1 })
  })

  it('throws when HTTP status is not ok', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found',
    }))

    const { restFetch } = await import('../rest')
    await expect(restFetch('posts')).rejects.toThrow('404')
  })

  it('throws when NEXT_PUBLIC_SITE_URL is not set', async () => {
    delete process.env.NEXT_PUBLIC_SITE_URL
    vi.stubGlobal('fetch', vi.fn())

    const { restFetch } = await import('../rest')
    await expect(restFetch('posts')).rejects.toThrow('NEXT_PUBLIC_SITE_URL')
  })
})
