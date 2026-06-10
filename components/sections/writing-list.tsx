import { FadeRise } from "@/components/anim/fade-rise"
import { WritingListClient } from "./writing-list-client"
import type { Post } from "@/lib/types"

interface WritingListProps {
  posts: Post[]
  featuredPosts: Post[]
}

function extractTags(posts: Post[]): string[] {
  const seen = new Set<string>()
  for (const post of posts) {
    for (const tag of post.tags ?? []) {
      seen.add(tag)
    }
  }
  return Array.from(seen).sort()
}

export function WritingList({ posts, featuredPosts }: WritingListProps) {
  const allTags = extractTags(posts)

  return (
    <section className="pt-10 pb-20 md:pt-14 md:pb-28">
      <FadeRise>
        <div className="pb-12 border-b border-border">
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-4">
            Writing
          </p>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
              Articles & Thoughts.
            </h1>
            <p className="text-muted-foreground max-w-sm leading-relaxed text-sm md:text-base md:text-right">
              Essays on frontend engineering, system design, and the craft of building software that lasts.
            </p>
          </div>
        </div>
        <WritingListClient initialPosts={posts} featuredPosts={featuredPosts} allTags={allTags} />
      </FadeRise>
    </section>
  )
}
