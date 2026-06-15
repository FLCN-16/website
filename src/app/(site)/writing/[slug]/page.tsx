import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { draftMode } from 'next/headers'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { getCachedPost, getPreviewPost, getCachedSiteSettings, getCachedAdjacentPosts } from '@/lib/data'
import { WritingPost } from '@/components/sections/writing-post'
import { richTextConverters } from '@/components/writing/richtext-converters'
import { extractHeadings } from '@/lib/lexical-headings'
import { JsonLd } from '@/components/structured-data/json-ld'
import { breadcrumbSchema, personRef } from '@/lib/structured-data'
import { createMetadata, resolveMetaImage } from '@/lib/metadata'
import { normalizeTags, resolvePostCover } from '@/lib/posts'
import { getPayloadClient } from '@/lib/payload'
import { RefreshRouteOnSaveClient } from '@/components/refresh-route-on-save'
import { buildIdentity } from '@/lib/site-identity'

interface PostPageProps {
  params: Promise<{ slug: string }>
}

// force-dynamic is required to correctly return HTTP 404 for unknown slugs.
// Without it, Next.js 16 commits a 200 status before notFound() can run on
// SSG routes that import client components (see vercel/next.js #75543 and related).
// The data layer (getCachedPost via unstable_cache) is still cached, so only
// the React render happens per request — latency impact is minimal.
export const dynamic = 'force-dynamic'
export const revalidate = false
export const dynamicParams = true

export async function generateStaticParams() {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'posts',
    where: { status: { equals: 'published' } },
    limit: 1000,
    depth: 0,
  })
  return result.docs.map((doc) => ({ slug: String(doc.slug) }))
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const [{ slug }, { isEnabled: draft }] = await Promise.all([params, draftMode()])
  try {
    const [post, settings] = await Promise.all([
      draft ? getPreviewPost(slug) : getCachedPost(slug),
      getCachedSiteSettings(),
    ])
    if (!post) notFound()
    const identity = buildIdentity(settings)
    return createMetadata({
      kind: 'WRITING',
      title: post.meta?.title || post.title,
      description: (post.meta?.description || post.excerpt) ?? undefined,
      image: resolveMetaImage(post.meta?.image),
      path: `/writing/${slug}`,
      article: {
        publishedTime: post.publishedAt ?? undefined,
        modifiedTime: post.updatedAt,
        tags: normalizeTags(post.tags),
      },
      identity,
    })
  } catch {
    return { title: slug }
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const [{ slug }, { isEnabled: draft }] = await Promise.all([params, draftMode()])

  let post: Awaited<ReturnType<typeof getCachedPost>> | undefined
  try {
    post = draft ? await getPreviewPost(slug) : await getCachedPost(slug)
  } catch {
    // Payload unavailable — fall through to notFound below
  }

  if (!post) notFound()

  const tags = normalizeTags(post.tags)

  const [settings, adjacent] = await Promise.all([
    getCachedSiteSettings().catch(() => null),
    getCachedAdjacentPosts(slug),
  ])

  const identity = buildIdentity(settings)

  const coverResolved = resolvePostCover(post.cover)

  const postUrl = `${identity.url}/writing/${slug}`

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: (post.meta?.description || post.excerpt) ?? undefined,
    author: personRef(identity),
    publisher: personRef(identity),
    url: postUrl,
    mainEntityOfPage: { '@type': 'WebPage', '@id': postUrl },
    inLanguage: 'en',
    ...(tags.length ? { keywords: tags.join(', ') } : {}),
    ...(post.publishedAt ? { datePublished: post.publishedAt } : {}),
    dateModified: post.updatedAt,
    ...(coverResolved?.url ? { image: coverResolved.url } : {}),
  }

  const breadcrumbs = breadcrumbSchema(identity, [
    { name: 'Home', path: '/' },
    { name: 'Writing', path: '/writing' },
    { name: post.title },
  ])

  return (
    <>
      <JsonLd data={articleSchema} />
      <JsonLd data={breadcrumbs} />
      {draft && (
        <RefreshRouteOnSaveClient serverURL={process.env.NEXT_PUBLIC_SITE_URL ?? ''} />
      )}
      <WritingPost
        slug={slug}
        title={post.title}
        publishedAt={post.publishedAt ?? undefined}
        readingTime={post.readingTime ?? undefined}
        tags={tags}
        headings={extractHeadings(post.body)}
        cover={coverResolved}
        prev={adjacent.prev}
        next={adjacent.next}
      >
        <RichText
          data={post.body as Parameters<typeof RichText>[0]['data']}
          converters={richTextConverters}
        />
      </WritingPost>
    </>
  )
}
