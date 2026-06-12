import type { CollectionConfig } from 'payload'
import { revalidateTag } from 'next/cache'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { CodeHighlightFeature } from '@/features/code-highlight-feature'
import { CACHE_TAGS } from '@/lib/cache-tags'
import { generatePreviewUrl } from '@/lib/preview'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    group: 'Content',
    useAsTitle: 'title',
    defaultColumns: ['title', 'template', 'slug'],
    preview: (data) => generatePreviewUrl({
      collection: 'pages',
      slug: String(data?.slug ?? ''),
      template: data?.template ? String(data.template) : undefined,
    }),
  },
  access: {
    read: () => true,
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: { description: 'URL-friendly identifier, e.g. privacy, terms, about' },
    },
    {
      name: 'template',
      type: 'select',
      required: true,
      options: [
        { label: 'Legal', value: 'legal' },
        { label: 'Basic', value: 'basic' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'lastUpdated',
      type: 'date',
      admin: {
        position: 'sidebar',
        condition: (data) => data.template === 'legal',
        date: { pickerAppearance: 'dayOnly' },
      },
    },
    { name: 'body', type: 'richText', required: true, editor: lexicalEditor({ features: ({ defaultFeatures }) => [...defaultFeatures, CodeHighlightFeature()] }) },
  ],
  hooks: {
    afterChange: [
      ({ doc }) => {
        try {
          revalidateTag(CACHE_TAGS.pages, 'max')
          if (doc.slug) revalidateTag(CACHE_TAGS.page(String(doc.slug)), 'max')
        } catch {
          // not in Next.js request context
        }
        return doc
      },
    ],
    afterDelete: [
      ({ doc }) => {
        try {
          revalidateTag(CACHE_TAGS.pages, 'max')
          if (doc.slug) revalidateTag(CACHE_TAGS.page(String(doc.slug)), 'max')
        } catch {
          // not in Next.js request context
        }
      },
    ],
  },
}
