import { describe, it, expect } from 'vitest'
import { crossedThresholds } from '@/lib/hooks/use-scroll-depth'

describe('crossedThresholds', () => {
  it('returns empty array when pct is below all thresholds', () => {
    expect(crossedThresholds(10, [25, 50, 75, 100], new Set())).toEqual([])
  })

  it('returns thresholds crossed for the first time', () => {
    expect(crossedThresholds(60, [25, 50, 75, 100], new Set())).toEqual([25, 50])
  })

  it('skips already-fired thresholds', () => {
    const fired = new Set([25, 50])
    expect(crossedThresholds(60, [25, 50, 75, 100], fired)).toEqual([])
  })

  it('fires 100 when pct reaches exactly 100', () => {
    expect(crossedThresholds(100, [25, 50, 75, 100], new Set())).toEqual([25, 50, 75, 100])
  })

  it('fires partial remaining thresholds when some already fired', () => {
    const fired = new Set([25])
    expect(crossedThresholds(55, [25, 50, 75, 100], fired)).toEqual([50])
  })
})
