import type { MetadataRoute } from 'next'
import { getCachedSiteSettings } from '@/lib/data'
import { buildIdentity } from '@/lib/site-identity'
import {
  getSitemapPosts,
  getSitemapWork,
  getSitemapPages,
} from '@/lib/data'

const SECTIONS = ['static', 'writing', 'work', 'pages'] as const
type Section = (typeof SECTIONS)[number]

export async function generateSitemaps() {
  return SECTIONS.map((id) => ({ id }))
}

export default async function sitemap(props: {
  id: Promise<string>
}): Promise<MetadataRoute.Sitemap> {
  const settings = await getCachedSiteSettings().catch(() => null)
  const identity = buildIdentity(settings)
  const section = (await props.id) as Section

  switch (section) {
    case 'static':
      return [
        { url: identity.url, changeFrequency: 'weekly', priority: 1 },
        { url: `${identity.url}/work`, changeFrequency: 'weekly', priority: 0.8 },
        {
          url: `${identity.url}/writing`,
          changeFrequency: 'weekly',
          priority: 0.8,
        },
        {
          url: `${identity.url}/projects`,
          changeFrequency: 'weekly',
          priority: 0.8,
        },
        { url: `${identity.url}/stack`, changeFrequency: 'weekly', priority: 0.8 },
        {
          url: `${identity.url}/contact`,
          changeFrequency: 'weekly',
          priority: 0.8,
        },
      ]

    case 'writing': {
      const posts = await getSitemapPosts()
      return posts.map((p) => ({
        url: `${identity.url}/writing/${p.slug}`,
        lastModified: p.publishedAt ?? p.updatedAt,
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      }))
    }

    case 'work': {
      const entries = await getSitemapWork()
      return entries.map((w) => ({
        url: `${identity.url}/work/${w.slug}`,
        lastModified: w.updatedAt,
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      }))
    }

    case 'pages': {
      const pages = await getSitemapPages()
      return pages.map((p) => ({
        url:
          p.template === 'legal'
            ? `${identity.url}/legal/${p.slug}`
            : `${identity.url}/page/${p.slug}`,
        lastModified: p.lastUpdated ?? p.updatedAt,
        changeFrequency: 'yearly' as const,
        priority: 0.3,
      }))
    }

    default:
      return []
  }
}
