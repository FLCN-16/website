import { PostRow } from "./post-row"
import { Separator } from "@/components/ui/separator"
import type { Post } from "@/lib/types"

interface RelatedPostsProps {
  posts: Post[]
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) return null

  return (
    <div className="mt-16">
      <Separator className="mb-8" />
      <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-6">
        More writing
      </p>
      <div className="grid md:grid-cols-2 gap-6">
        {posts.map((post) => (
          <div key={post.id} className="border border-border overflow-hidden">
            <PostRow post={post} className="p-4 border-b-0" />
          </div>
        ))}
      </div>
    </div>
  )
}
