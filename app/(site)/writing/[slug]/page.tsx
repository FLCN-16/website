import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { draftMode } from 'next/headers'
import { getCachedPost, getCachedRelatedPosts, getPreviewPost } from '@/lib/data'
import { WritingPost } from '@/components/sections/writing-post'
import { JsonLd } from '@/components/structured-data/json-ld'
import { createMetadata } from '@/lib/metadata'
import { resolvePostCover } from '@/lib/posts'
import { getPayloadClient } from '@/lib/payload'
import { RefreshRouteOnSaveClient } from '@/components/refresh-route-on-save'
import { site } from '@/content/site'

interface PostPageProps {
  params: Promise<{ slug: string }>
}

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
    const post = draft ? await getPreviewPost(slug) : await getCachedPost(slug)
    if (!post) return { title: 'Not Found' }
    return createMetadata({
      title: post.meta?.title || post.title,
      description: (post.meta?.description || post.excerpt) ?? undefined,
      image: typeof post.meta?.image === 'object' ? post.meta?.image?.url ?? undefined : undefined,
      path: `/writing/${slug}`,
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

  const postTags = post.tags?.map((t: { tag?: string | null }) => t.tag ?? '') ?? []
  const relatedPosts = await getCachedRelatedPosts(post.slug, postTags).catch(() => [])

  const coverResolved = resolvePostCover(post.cover)

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: (post.meta?.description || post.excerpt) ?? undefined,
    author: { '@type': 'Person', name: site.name, url: site.url },
    publisher: { '@type': 'Person', name: site.name, url: site.url },
    url: `${site.url}/writing/${slug}`,
    ...(post.publishedAt ? { datePublished: post.publishedAt } : {}),
    ...(coverResolved?.url ? { image: coverResolved.url } : {}),
  }

  return (
    <>
      <JsonLd data={articleSchema} />
      {draft && (
        <RefreshRouteOnSaveClient serverURL={process.env.NEXT_PUBLIC_SITE_URL ?? ''} />
      )}
      <WritingPost
        slug={slug}
        title={post.title}
        publishedAt={post.publishedAt ?? undefined}
        readingTime={post.readingTime ?? undefined}
        tags={post.tags?.map((t: { tag?: string | null }) => ({ tag: t.tag ?? '' }))}
        body={post.body}
        cover={coverResolved}
        related={relatedPosts}
      />
    </>
  )
}
