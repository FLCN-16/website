import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'

// Module is imported after stubbing fetch so the env var is read at call time
const SITE_URL = 'http://localhost:3000'

describe('gqlFetch', () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_SITE_URL = SITE_URL
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    delete process.env.NEXT_PUBLIC_SITE_URL
  })

  it('POSTs to /api/graphql on the configured site URL', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: { Posts: { docs: [] } } }),
    })
    vi.stubGlobal('fetch', mockFetch)

    const { gqlFetch } = await import('../graphql')
    await gqlFetch('{ Posts { docs { id } } }')

    expect(mockFetch).toHaveBeenCalledWith(
      `${SITE_URL}/api/graphql`,
      expect.objectContaining({ method: 'POST' })
    )
  })

  it('sends Content-Type: application/json', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: {} }),
    })
    vi.stubGlobal('fetch', mockFetch)

    const { gqlFetch } = await import('../graphql')
    await gqlFetch('{ Test }')

    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: { 'Content-Type': 'application/json' },
      })
    )
  })

  it('attaches cache tags to the next option', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: {} }),
    })
    vi.stubGlobal('fetch', mockFetch)

    const { gqlFetch } = await import('../graphql')
    await gqlFetch('{ Test }', undefined, ['posts', 'post-hello'])

    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        next: expect.objectContaining({ tags: ['posts', 'post-hello'], revalidate: false }),
      })
    )
  })

  it('returns the data field on success', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: { Posts: { docs: [{ id: '1' }] } } }),
    }))

    const { gqlFetch } = await import('../graphql')
    const result = await gqlFetch<{ Posts: { docs: Array<{ id: string }> } }>('{ Posts { docs { id } } }')

    expect(result).toEqual({ Posts: { docs: [{ id: '1' }] } })
  })

  it('throws when HTTP status is not ok', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      status: 503,
      statusText: 'Service Unavailable',
    }))

    const { gqlFetch } = await import('../graphql')
    await expect(gqlFetch('{ Test }')).rejects.toThrow('503')
  })

  it('throws the first GraphQL error message', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: null, errors: [{ message: 'Field "bad" not found' }] }),
    }))

    const { gqlFetch } = await import('../graphql')
    await expect(gqlFetch('{ bad }')).rejects.toThrow('Field "bad" not found')
  })
})
