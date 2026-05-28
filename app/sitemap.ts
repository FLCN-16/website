import type { MetadataRoute } from 'next'
import { site } from '@/content/site'
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
  const section = (await props.id) as Section

  switch (section) {
    case 'static':
      return [
        { url: site.url, changeFrequency: 'weekly', priority: 1 },
        { url: `${site.url}/work`, changeFrequency: 'weekly', priority: 0.8 },
        {
          url: `${site.url}/writing`,
          changeFrequency: 'weekly',
          priority: 0.8,
        },
        {
          url: `${site.url}/projects`,
          changeFrequency: 'weekly',
          priority: 0.8,
        },
        { url: `${site.url}/stack`, changeFrequency: 'weekly', priority: 0.8 },
        {
          url: `${site.url}/contact`,
          changeFrequency: 'weekly',
          priority: 0.8,
        },
      ]

    case 'writing': {
      const posts = await getSitemapPosts()
      return posts.map((p) => ({
        url: `${site.url}/writing/${p.slug}`,
        lastModified: p.publishedAt ?? p.updatedAt,
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      }))
    }

    case 'work': {
      const entries = await getSitemapWork()
      return entries.map((w) => ({
        url: `${site.url}/work/${w.slug}`,
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
            ? `${site.url}/legal/${p.slug}`
            : `${site.url}/page/${p.slug}`,
        lastModified: p.lastUpdated ?? p.updatedAt,
        changeFrequency: 'yearly' as const,
        priority: 0.3,
      }))
    }

    default:
      return []
  }
}
