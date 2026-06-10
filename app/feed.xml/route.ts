import { NextResponse } from 'next/server'
import { getCachedPosts } from '@/lib/data'
import { site } from '@/content/site'

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export async function GET() {
  const posts = await getCachedPosts().catch(() => [])

  const items = posts
    .map((post) => {
      const url = `${site.url}/writing/${post.slug}`
      return [
        '    <item>',
        `      <title>${escapeXml(post.title)}</title>`,
        `      <link>${url}</link>`,
        `      <guid isPermaLink="true">${url}</guid>`,
        ...(post.excerpt ? [`      <description>${escapeXml(post.excerpt)}</description>`] : []),
        ...(post.publishedAt
          ? [`      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>`]
          : []),
        `      <author>${escapeXml(`${site.email} (${site.name})`)}</author>`,
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
    `    <title>${escapeXml(`${site.name} — Writing`)}</title>`,
    `    <link>${site.url}/writing</link>`,
    `    <description>${escapeXml(site.description)}</description>`,
    '    <language>en</language>',
    ...(lastBuildDate ? [`    <lastBuildDate>${lastBuildDate}</lastBuildDate>`] : []),
    `    <atom:link href="${site.url}/feed.xml" rel="self" type="application/rss+xml" />`,
    items,
    '  </channel>',
    '</rss>',
  ].join('\n')

  return new NextResponse(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  })
}
