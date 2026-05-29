import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCachedPost, getCachedRelatedPosts } from '@/lib/data'
import { WritingPost } from '@/components/sections/writing-post'
import { createMetadata } from '@/lib/metadata'
import { resolvePostCover } from '@/lib/posts'
import { getPayloadClient } from '@/lib/payload'

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
  const { slug } = await params
  try {
    const post = await getCachedPost(slug)
    if (!post) return { title: 'Not Found' }
    return createMetadata({
      title: post.title,
      description: post.excerpt ?? undefined,
    })
  } catch {
    return { title: slug }
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params

  let post: Awaited<ReturnType<typeof getCachedPost>> | undefined
  try {
    post = await getCachedPost(slug)
  } catch {
    // Payload unavailable — fall through to notFound below
  }

  if (!post) notFound()

  const postTags = post.tags?.map((t: { tag?: string | null }) => t.tag ?? '') ?? []
  const relatedPosts = await getCachedRelatedPosts(post.slug, postTags).catch(() => [])

  const coverResolved = resolvePostCover(post.cover)

  return (
    <WritingPost
      title={post.title}
      publishedAt={post.publishedAt ?? undefined}
      readingTime={post.readingTime ?? undefined}
      tags={post.tags?.map((t: { tag?: string | null }) => ({ tag: t.tag ?? '' }))}
      body={post.body}
      cover={coverResolved}
      related={relatedPosts}
    />
  )
}
