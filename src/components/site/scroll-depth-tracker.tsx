'use client'

import { useScrollDepth } from '@/lib/hooks/use-scroll-depth'

export function ScrollDepthTracker() {
  useScrollDepth()
  return null
}
