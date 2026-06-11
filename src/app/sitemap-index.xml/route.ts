import { NextResponse } from 'next/server'
import { getCachedSiteSettings } from '@/lib/data'
import { buildIdentity } from '@/lib/site-identity'
import {
  getSitemapPosts,
  getSitemapWork,
  getSitemapPages,
} from '@/lib/data'

function maxDate(dates: (string | null)[]): string | null {
  const valid = dates.filter(Boolean) as string[]
  if (!valid.length) return null
  return valid.reduce((a, b) => (a > b ? a : b))
}

export async function GET() {
  const settings = await getCachedSiteSettings().catch(() => null)
  const identity = buildIdentity(settings)

  const [posts, work, pages] = await Promise.all([
    getSitemapPosts(),
    getSitemapWork(),
    getSitemapPages(),
  ])

  const writingLastmod = maxDate(posts.map((p) => p.publishedAt ?? p.updatedAt))
  const workLastmod = maxDate(work.map((w) => w.updatedAt))
  const pagesLastmod = maxDate(
    pages.map((p) => p.lastUpdated ?? p.updatedAt)
  )

  function sitemapEntry(loc: string, lastmod: string | null) {
    return lastmod
      ? `  <sitemap><loc>${loc}</loc><lastmod>${lastmod}</lastmod></sitemap>`
      : `  <sitemap><loc>${loc}</loc></sitemap>`
  }

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    sitemapEntry(`${identity.url}/sitemap/static.xml`, null),
    sitemapEntry(`${identity.url}/sitemap/writing.xml`, writingLastmod),
    sitemapEntry(`${identity.url}/sitemap/work.xml`, workLastmod),
    sitemapEntry(`${identity.url}/sitemap/pages.xml`, pagesLastmod),
    '</sitemapindex>',
  ].join('\n')

  return new NextResponse(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  })
}
