import { RelatedPostsSwiper } from "./related-posts-swiper"
import { Separator } from "@/components/ui/separator"
import type { Post } from "@/lib/types"

interface RelatedPostsProps {
  posts: Post[]
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
  return (
    <div className="mt-16">
      <Separator className="mb-8" />
      <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-6">
        More writing
      </p>
      <RelatedPostsSwiper posts={posts} />
    </div>
  )
}
