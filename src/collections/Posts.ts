import type { CollectionConfig } from 'payload'
import { revalidateTag } from 'next/cache'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { CodeHighlightFeature } from '@/features/code-highlight-feature'
import { CACHE_TAGS } from '@/lib/cache-tags'
import { generatePreviewUrl } from '@/lib/preview'

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    group: 'Writing',
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'featured', 'publishedAt'],
    preview: (data) => generatePreviewUrl({
      collection: 'posts',
      slug: String(data?.slug ?? ''),
    }),
  },
  access: {
    read: ({ req }) => {
      if (req.user) return true
      return { status: { equals: 'published' } }
    },
  },
  fields: [
    // Keep the tabs field first: the SEO plugin (tabbedUI) appends its SEO tab
    // into it and leaves the fields after it at the top level, so their
    // `position: 'sidebar'` keeps working. The tab is unnamed, so the data
    // shape is unchanged.
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
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
              type: 'text',
              hasMany: true,
              admin: {
                description: 'Type a tag and press Enter to add it.',
              },
            },
            {
              name: 'body',
              type: 'richText',
              editor: lexicalEditor({ features: ({ defaultFeatures }) => [...defaultFeatures, CodeHighlightFeature()] }),
            },
          ],
        },
      ],
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
        description: 'URL-friendly identifier, e.g. my-post-title',
      },
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
      name: 'newsletterSentAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        readOnly: true,
        date: { pickerAppearance: 'dayAndTime' },
        description: 'Auto-set when the publish newsletter broadcast was sent. Clear to allow a re-send.',
      },
    },
    {
      name: 'skipNewsletter',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Publish this post without sending the newsletter broadcast.',
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
          revalidateTag(CACHE_TAGS.posts, 'max')
          if (doc.slug) revalidateTag(CACHE_TAGS.post(String(doc.slug)), 'max')
        } catch {
          // not in Next.js request context
        }
        return doc
      },
      async ({ doc, previousDoc, operation, req, context }) => {
        // Skip when this hook triggered our own newsletterSentAt stamp update.
        if (context?.skipNewsletter) return doc

        const becamePublished =
          doc.status === 'published' && previousDoc?.status !== 'published'

        if (
          !becamePublished ||
          doc.skipNewsletter ||
          doc.newsletterSentAt ||
          (operation !== 'create' && operation !== 'update')
        ) {
          return doc
        }

        // Fire-and-forget so the admin save isn't blocked on Resend latency.
        void (async () => {
          try {
            const { sendPostBroadcast } = await import('@/lib/email/post-broadcast')
            await sendPostBroadcast({ doc, payload: req.payload })

            // Stamp the post so future re-publishes don't re-blast.
            // The context flag prevents this update from re-entering this branch.
            await req.payload.update({
              collection: 'posts',
              id: doc.id as string,
              data: { newsletterSentAt: new Date().toISOString() },
              context: { skipNewsletter: true },
              overrideAccess: true,
            })
          } catch (err) {
            try {
              req.payload.logger.error({ msg: '[posts.afterChange] Newsletter broadcast failed', err })
            } catch { /* noop */ }
          }
        })()

        return doc
      },
    ],
    afterDelete: [
      ({ doc }) => {
        try {
          revalidateTag(CACHE_TAGS.posts, 'max')
          if (doc.slug) revalidateTag(CACHE_TAGS.post(String(doc.slug)), 'max')
        } catch {
          // not in Next.js request context
        }
      },
    ],
  },
}
