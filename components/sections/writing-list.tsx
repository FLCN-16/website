import { FadeRise } from "@/components/anim/fade-rise"
import { WritingListClient } from "./writing-list-client"

interface Post {
  id: string
  title: string
  slug: string
  excerpt?: string
  tags?: Array<{ tag: string }>
  publishedAt?: string
  readingTime?: number
}

interface WritingListProps {
  posts: Post[]
}

function extractTags(posts: Post[]): string[] {
  const seen = new Set<string>()
  for (const post of posts) {
    for (const { tag } of post.tags ?? []) {
      seen.add(tag)
    }
  }
  return Array.from(seen).sort()
}

function extractYears(posts: Post[]): string[] {
  const seen = new Set<string>()
  for (const post of posts) {
    if (post.publishedAt) {
      seen.add(new Date(post.publishedAt).getFullYear().toString())
    }
  }
  return Array.from(seen).sort((a, b) => Number(b) - Number(a))
}

export function WritingList({ posts }: WritingListProps) {
  const allTags = extractTags(posts)
  const allYears = extractYears(posts)

  return (
    <section className="py-20 md:py-28">
      <FadeRise>
        <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-2">
          Writing
        </p>
        <h1 className="font-sans text-4xl font-semibold tracking-tight mb-8">
          Articles & Thoughts
        </h1>
        <WritingListClient initialPosts={posts} allTags={allTags} allYears={allYears} />
      </FadeRise>
    </section>
  )
}
