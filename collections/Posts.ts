import type { CollectionConfig } from 'payload'
import { updateTag } from 'next/cache'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { CACHE_TAGS } from '@/lib/cache-tags'

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'featured', 'publishedAt'],
  },
  access: {
    read: ({ req }) => {
      if (req.user) return true
      return { status: { equals: 'published' } }
    },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL-friendly identifier, e.g. my-post-title',
      },
    },
    {
      name: 'excerpt',
      type: 'textarea',
    },
    {
      name: 'cover',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'tags',
      type: 'array',
      fields: [
        {
          name: 'tag',
          type: 'text',
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Pin this post as the featured article on the Writing index.',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'readingTime',
      type: 'number',
      admin: {
        position: 'sidebar',
        description: 'Estimated reading time in minutes (auto-calculated on save)',
        readOnly: false,
      },
    },
    {
      name: 'body',
      type: 'richText',
      editor: lexicalEditor(),
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        if (data.body) {
          const text = JSON.stringify(data.body)
          const wordCount = text.split(/\s+/).length
          data.readingTime = Math.max(1, Math.ceil(wordCount / 200))
        }
        return data
      },
    ],
    afterChange: [
      ({ doc }) => {
        try {
          updateTag(CACHE_TAGS.posts)
          if (doc.slug) updateTag(CACHE_TAGS.post(String(doc.slug)))
        } catch {
          // not in Next.js request context
        }
        return doc
      },
    ],
    afterDelete: [
      ({ doc }) => {
        try {
          updateTag(CACHE_TAGS.posts)
          if (doc.slug) updateTag(CACHE_TAGS.post(String(doc.slug)))
        } catch {
          // not in Next.js request context
        }
      },
    ],
  },
}
