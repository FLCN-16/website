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
        <div className="pb-10 border-b border-border">
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-3">
            Writing
          </p>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight leading-tight">
            Articles & Thoughts.
          </h1>
          <p className="text-muted-foreground mt-4 max-w-2xl leading-relaxed">
            Essays on frontend engineering, system design, and the craft of building software
            that lasts.
          </p>
        </div>
        <WritingListClient initialPosts={posts} heroPost={heroPost} allTags={allTags} />
      </FadeRise>
    </section>
  )
}
