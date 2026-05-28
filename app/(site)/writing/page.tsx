import { getCachedPosts } from '@/lib/data'
import { WritingList } from '@/components/sections/writing-list'
import { createMetadata } from '@/lib/metadata'
import type { Post } from '@/lib/types'

export const metadata = createMetadata({
  title: 'Writing',
  description: 'Articles and thoughts on frontend engineering, architecture, and building at scale.',
})

export default async function WritingIndex() {
  let posts: Post[] = []

  try {
    posts = await getCachedPosts()
  } catch {
    // Payload not available — show empty state
  }

  const heroPost = pickHero(posts)

  return <WritingList posts={posts} heroPost={heroPost} />
}

function pickHero(posts: Post[]): Post | null {
  const featured = posts.find((p) => p.featured && p.cover)
  if (featured) return featured
  return posts.find((p) => p.cover) ?? null
}
