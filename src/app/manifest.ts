import type { MetadataRoute } from 'next'
import { getCachedSiteSettings } from '@/lib/data'
import { buildIdentity } from '@/lib/site-identity'

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const settings = await getCachedSiteSettings().catch(() => null)
  const identity = buildIdentity(settings)
  return {
    name: identity.name,
    short_name: identity.handle || identity.name,
    description: identity.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#0a0a0a',
    theme_color: '#0a0a0a',
    icons: [{ src: '/favicon.ico', sizes: 'any', type: 'image/x-icon' }],
  }
}
