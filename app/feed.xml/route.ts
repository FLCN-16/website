import { NextResponse } from 'next/server'
import { getCachedPosts, getCachedSiteSettings } from '@/lib/data'
import { buildIdentity } from '@/lib/site-identity'

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export async function GET() {
  const settings = await getCachedSiteSettings().catch(() => null)
  const identity = buildIdentity(settings)

  const posts = await getCachedPosts().catch(() => [])

  const items = posts
    .map((post) => {
      const url = `${identity.url}/writing/${post.slug}`
      return [
        '    <item>',
        `      <title>${escapeXml(post.title)}</title>`,
        `      <link>${url}</link>`,
        `      <guid isPermaLink="true">${url}</guid>`,
        ...(post.excerpt ? [`      <description>${escapeXml(post.excerpt)}</description>`] : []),
        ...(post.publishedAt
          ? [`      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>`]
          : []),
        `      <author>${escapeXml(`${identity.email} (${identity.name})`)}</author>`,
        '    </item>',
      ].join('\n')
    })
    .join('\n')

  const lastBuildDate = posts[0]?.publishedAt
    ? new Date(posts[0].publishedAt).toUTCString()
    : undefined

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    '  <channel>',
    `    <title>${escapeXml(`${identity.name} — Writing`)}</title>`,
    `    <link>${identity.url}/writing</link>`,
    `    <description>${escapeXml(identity.description)}</description>`,
    '    <language>en</language>',
    ...(lastBuildDate ? [`    <lastBuildDate>${lastBuildDate}</lastBuildDate>`] : []),
    `    <atom:link href="${identity.url}/feed.xml" rel="self" type="application/rss+xml" />`,
    items,
    '  </channel>',
    '</rss>',
  ].join('\n')

  return new NextResponse(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  })
}
