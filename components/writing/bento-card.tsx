// components/writing/bento-card.tsx
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export interface Post {
  id: string
  title: string
  slug: string
  excerpt?: string
  tags?: Array<{ tag: string }>
  publishedAt?: string
  readingTime?: number
}

interface BentoCardProps {
  post: Post
  variant?: "hero" | "standard"
}

function formatDate(iso?: string) {
  if (!iso) return "—"
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export function BentoCard({ post, variant = "standard" }: BentoCardProps) {
  const isHero = variant === "hero"
  const visibleTags = post.tags?.slice(0, isHero ? undefined : 2)

  return (
    <Link
      href={`/writing/${post.slug}`}
      aria-label={post.title}
      className={cn(
        "group flex flex-col gap-3 rounded-xl border p-5 transition-all duration-200 hover:shadow-md dark:hover:shadow-none",
        isHero
          ? "bg-primary/5 border-primary/20"
          : "bg-background border-border",
      )}
    >
      <h2
        className={cn(
          "font-semibold tracking-tight group-hover:text-primary transition-colors duration-200",
          isHero ? "text-2xl" : "text-lg",
        )}
      >
        {post.title}
      </h2>

      {post.excerpt && (
        <p
          className={cn(
            "text-sm text-muted-foreground",
            isHero ? "line-clamp-3" : "line-clamp-2",
          )}
        >
          {post.excerpt}
        </p>
      )}

      <div className="mt-auto flex flex-wrap items-center gap-3">
        <span className="font-mono text-xs text-muted-foreground">
          {formatDate(post.publishedAt)}
        </span>
        {post.readingTime && (
          <span className="font-mono text-xs text-muted-foreground">
            {post.readingTime} min read
          </span>
        )}
        {visibleTags && visibleTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {visibleTags.map(({ tag }) => (
              <Badge key={tag} variant="secondary" className="font-mono text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}
