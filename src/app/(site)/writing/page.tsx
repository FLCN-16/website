import { getCachedPosts, getCachedSiteSettings } from '@/lib/data'
import { WritingList } from '@/components/sections/writing-list'
import { createMetadata } from '@/lib/metadata'
import { buildIdentity } from '@/lib/site-identity'
import { JsonLd } from '@/components/structured-data/json-ld'
import { graph, collectionPageNode, breadcrumbNode } from '@/lib/structured-data'
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
  const [posts, settings] = await Promise.all([
    getCachedPosts().catch(() => [] as Post[]),
    getCachedSiteSettings().catch(() => null),
  ])

  const identity = buildIdentity(settings)
  const featuredPosts = pickFeatured(posts)

  return (
    <>
      <JsonLd data={graph([
        collectionPageNode(identity, {
          path: '/writing',
          name: 'Writing',
          description: 'Articles and thoughts on frontend engineering, architecture, and building at scale.',
          type: 'Blog',
          items: posts.map((p, i) => ({
            name: p.title,
            url: `${identity.url}/writing/${p.slug}`,
            description: p.excerpt ?? undefined,
            imageUrl: p.cover?.url ?? undefined,
            position: i + 1,
          })),
        }),
        breadcrumbNode(identity, [
          { name: 'Home', path: '/' },
          { name: 'Writing', path: '/writing' },
        ], '/writing'),
      ])} />
      <WritingList posts={posts} featuredPosts={featuredPosts} />
    </>
  )
}

function pickFeatured(posts: Post[]): Post[] {
  const featured = posts.filter((p) => p.featured && p.cover)
  if (featured.length > 0) return featured.slice(0, 5)
  return posts.filter((p) => p.cover).slice(0, 1)
}
