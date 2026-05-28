import { describe, it, expect } from 'vitest'
import { CACHE_TAGS } from '../cache-tags'

describe('CACHE_TAGS', () => {
  it('has correct static tag values', () => {
    expect(CACHE_TAGS.posts).toBe('posts')
    expect(CACHE_TAGS.work).toBe('work')
    expect(CACHE_TAGS.projects).toBe('projects')
    expect(CACHE_TAGS.home).toBe('home')
    expect(CACHE_TAGS.pages).toBe('pages')
    expect(CACHE_TAGS.timeline).toBe('timeline')
    expect(CACHE_TAGS.education).toBe('education')
    expect(CACHE_TAGS.certifications).toBe('certifications')
  })

  it('generates slug-scoped tags', () => {
    expect(CACHE_TAGS.post('my-slug')).toBe('post-my-slug')
    expect(CACHE_TAGS.workEntry('design-system')).toBe('work-design-system')
    expect(CACHE_TAGS.page('privacy')).toBe('page-privacy')
  })
})
