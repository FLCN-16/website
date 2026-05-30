import type { CollectionConfig } from 'payload'
import { revalidateTag } from 'next/cache'
import { CACHE_TAGS } from '@/lib/cache-tags'

export const Work: CollectionConfig = {
  slug: 'work',
  admin: {
    group: 'Portfolio',
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'ord', 'status'],
  },
  access: {
    read: ({ req }) => {
      if (req.user) return true
      return { status: { equals: 'published' } }
    },
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: { position: 'sidebar', description: 'URL-friendly identifier, e.g. design-system-foundation' },
    },
    { name: 'category', type: 'text', admin: { position: 'sidebar', description: 'e.g. Design Systems, Platform Engineering' } },
    { name: 'ord', type: 'text', admin: { position: 'sidebar', description: 'Display order label: 01, 02, 03' } },
    { name: 'tags', type: 'array', fields: [{ name: 'tag', type: 'text' }] },
    { name: 'description', type: 'textarea' },
    { name: 'cover', type: 'upload', relationTo: 'media' },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'briefing',
      type: 'group',
      fields: [
        { name: 'problem', type: 'textarea' },
        { name: 'approach', type: 'array', fields: [{ name: 'step', type: 'textarea' }] },
        { name: 'impact', type: 'textarea' },
        { name: 'quote', type: 'text' },
      ],
    },
    {
      name: 'stack',
      type: 'array',
      fields: [
        { name: 'name', type: 'text' },
        { name: 'role', type: 'text' },
      ],
    },
  ],
  hooks: {
    afterChange: [
      ({ doc }) => {
        try {
          revalidateTag(CACHE_TAGS.work, 'max')
        } catch {
          // not in Next.js request context
        }
        return doc
      },
    ],
    afterDelete: [
      () => {
        try {
          revalidateTag(CACHE_TAGS.work, 'max')
        } catch {
          // not in Next.js request context
        }
      },
    ],
  },
}
