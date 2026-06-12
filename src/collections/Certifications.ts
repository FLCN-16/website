import type { CollectionConfig } from 'payload'
import { revalidateTag } from 'next/cache'
import { CACHE_TAGS } from '@/lib/cache-tags'

export const Certifications: CollectionConfig = {
  slug: 'certifications',
  admin: {
    group: 'Profile',
    useAsTitle: 'name',
    defaultColumns: ['name', 'issuer', 'year', 'order'],
  },
  access: { read: () => true },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'issuer', type: 'text', required: true },
    { name: 'year', type: 'text', required: true, admin: { description: 'Year as string: 2025' } },
    { name: 'credentialUrl', type: 'text', admin: { description: 'Optional verification link' } },
    { name: 'order', type: 'number', admin: { position: 'sidebar', description: 'Lower = displayed first.' } },
  ],
  hooks: {
    afterChange: [
      ({ doc }) => {
        try {
          revalidateTag(CACHE_TAGS.certifications, 'max')
        } catch {
          // not in Next.js request context
        }
        return doc
      },
    ],
    afterDelete: [
      () => {
        try {
          revalidateTag(CACHE_TAGS.certifications, 'max')
        } catch {
          // not in Next.js request context
        }
      },
    ],
  },
}
