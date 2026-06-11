import type { MetadataRoute } from 'next'
import { getCachedSiteSettings } from '@/lib/data'
import { buildIdentity } from '@/lib/site-identity'

export default async function robots(): Promise<MetadataRoute.Robots> {
  const settings = await getCachedSiteSettings().catch(() => null)
  const identity = buildIdentity(settings)
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/admin/', '/api/'] },
      {
        userAgent: [
          'GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-Web',
          'anthropic-ai', 'PerplexityBot', 'Perplexity-User', 'Google-Extended',
          'Applebot-Extended', 'CCBot', 'meta-externalagent',
        ],
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
    ],
    sitemap: `${identity.url}/sitemap-index.xml`,
  }
}
