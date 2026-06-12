import { describe, it, expect } from 'vitest'
import { buildActivityData } from '../PostsActivity'

describe('buildActivityData', () => {
  it('returns 12 slots', () => {
    const result = buildActivityData([], new Date('2026-06-12'))
    expect(result).toHaveLength(12)
  })

  it('first slot is 12 months ago, last slot is current month', () => {
    const now = new Date('2026-06-12')
    const result = buildActivityData([], now)
    expect(result[0].month).toBe('2025-07')
    expect(result[11].month).toBe('2026-06')
  })

  it('counts posts in correct month slot', () => {
    const docs = [
      { publishedAt: '2026-06-01T00:00:00.000Z' },
      { publishedAt: '2026-06-15T00:00:00.000Z' },
      { publishedAt: '2026-04-10T00:00:00.000Z' },
    ]
    const result = buildActivityData(docs, new Date('2026-06-12'))
    const june = result.find(m => m.month === '2026-06')!
    const april = result.find(m => m.month === '2026-04')!
    expect(june.count).toBe(2)
    expect(april.count).toBe(1)
  })

  it('ignores posts with null publishedAt', () => {
    const docs: Array<{ publishedAt?: string | null }> = [{ publishedAt: null }, {}]
    const result = buildActivityData(docs, new Date('2026-06-12'))
    expect(result.every(m => m.count === 0)).toBe(true)
  })
})
