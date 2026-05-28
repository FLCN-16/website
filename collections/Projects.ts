import type { CollectionConfig } from 'payload'
import { revalidateTag } from 'next/cache'
import { CACHE_TAGS } from '@/lib/cache-tags'

export const Projects: CollectionConfig = {
  slug: 'projects',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'featured', 'status'],
  },
  access: {
    read: ({ req }) => {
      if (req.user) return true
      return { status: { equals: 'published' } }
    },
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'subtitle', type: 'text', admin: { description: 'Short tagline shown below title' } },
    { name: 'description', type: 'textarea' },
    { name: 'category', type: 'text', admin: { description: 'e.g. Chrome Extension, Agentic AI, Mobile App' } },
    { name: 'tags', type: 'array', fields: [{ name: 'tag', type: 'text' }] },
    { name: 'liveUrl', type: 'text', admin: { description: 'Chrome Web Store, Play Store, or live URL' } },
    { name: 'repoUrl', type: 'text', admin: { description: 'GitHub repo or PR URL' } },
    { name: 'startDate', type: 'text', admin: { description: 'e.g. February 2025' } },
    { name: 'endDate', type: 'text', admin: { description: 'e.g. October 2025 — leave blank for ongoing' } },
    {
      name: 'highlights',
      type: 'array',
      fields: [{ name: 'point', type: 'textarea' }],
      admin: { description: 'Bullet points from CV — 2–4 highlights' },
    },
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
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar', description: 'Show on homepage featured section' },
    },
  ],
  hooks: {
    afterChange: [
      ({ doc }) => {
        try {
          revalidateTag(CACHE_TAGS.projects, 'max')
          revalidateTag(CACHE_TAGS.home, 'max')
        } catch {
          // not in Next.js request context
        }
        return doc
      },
    ],
    afterDelete: [
      ({ doc }) => {
        try {
          revalidateTag(CACHE_TAGS.projects, 'max')
          revalidateTag(CACHE_TAGS.home, 'max')
        } catch {
          // not in Next.js request context
        }
      },
    ],
  },
}
