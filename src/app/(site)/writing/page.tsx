import { getCachedPosts, getCachedSiteSettings } from '@/lib/data'
import { WritingList } from '@/components/sections/writing-list'
import { createMetadata } from '@/lib/metadata'
import { buildIdentity } from '@/lib/site-identity'
import type { Post } from '@/lib/types'

export const revalidate = false

export async function generateMetadata() {
  const settings = await getCachedSiteSettings()
  const identity = buildIdentity(settings)
  return createMetadata({
    kind: 'WRITING',
    title: 'Writing',
    description: 'Articles and thoughts on frontend engineering, architecture, and building at scale.',
    path: '/writing',
    identity,
  })
}

export default async function WritingIndex() {
  let posts: Post[] = []

  try {
    posts = await getCachedPosts()
  } catch {
    // Payload not available — show empty state
  }

  const featuredPosts = pickFeatured(posts)

  return <WritingList posts={posts} featuredPosts={featuredPosts} />
}

function pickFeatured(posts: Post[]): Post[] {
  const featured = posts.filter((p) => p.featured && p.cover)
  if (featured.length > 0) return featured.slice(0, 5)
  return posts.filter((p) => p.cover).slice(0, 1)
}
