import { FadeRise } from "@/components/anim/fade-rise"
import { WritingListClient } from "./writing-list-client"
import type { Post } from "@/lib/types"

interface WritingListProps {
  posts: Post[]
  heroPost: Post | null
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

export function WritingList({ posts, heroPost }: WritingListProps) {
  const allTags = extractTags(posts)

  return (
    <section className="py-20 md:py-28">
      <FadeRise>
        <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-2">
          Writing
        </p>
        <h1 className="font-sans text-4xl font-semibold tracking-tight mb-8">
          Articles & Thoughts
        </h1>
        <WritingListClient initialPosts={posts} heroPost={heroPost} allTags={allTags} />
      </FadeRise>
    </section>
  )
}
