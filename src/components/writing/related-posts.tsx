import { RelatedPostsSwiper } from "./related-posts-swiper"
import { Separator } from "@/components/ui/separator"

interface RelatedPostsProps {
  currentSlug: string
  tags: string[]
}

export function RelatedPosts({ currentSlug, tags }: RelatedPostsProps) {
  return (
    <div className="mt-16">
      <Separator className="mb-8" />
      <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-6">
        More writing
      </p>
      <RelatedPostsSwiper currentSlug={currentSlug} tags={tags} />
    </div>
  )
}
