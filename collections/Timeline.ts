import type { CollectionConfig } from 'payload'
import { revalidateTag } from 'next/cache'
import { CACHE_TAGS } from '@/lib/cache-tags'

export const Timeline: CollectionConfig = {
  slug: 'timeline',
  admin: {
    useAsTitle: 'company',
    defaultColumns: ['company', 'role', 'start', 'end', 'order'],
  },
  access: { read: () => true },
  fields: [
    { name: 'company', type: 'text', required: true },
    { name: 'role', type: 'text', required: true },
    { name: 'start', type: 'text', required: true, admin: { description: 'Year as string: 2022' } },
    { name: 'end', type: 'text', admin: { description: 'Year or leave blank for current role' } },
    { name: 'summary', type: 'textarea' },
    { name: 'tags', type: 'array', fields: [{ name: 'tag', type: 'text' }] },
    { name: 'order', type: 'number', admin: { position: 'sidebar', description: 'Lower = displayed first. Current role = 1.' } },
  ],
  hooks: {
    afterChange: [
      ({ doc }) => {
        try {
          revalidateTag(CACHE_TAGS.timeline, 'max')
        } catch {
          // not in Next.js request context
        }
        return doc
      },
    ],
    afterDelete: [
      () => {
        try {
          revalidateTag(CACHE_TAGS.timeline, 'max')
        } catch {
          // not in Next.js request context
        }
      },
    ],
  },
}
