import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { Post } from "@/lib/types"

function formatDate(iso?: string | null) {
  if (!iso) return "—"
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

interface FeaturedCardProps {
  post: Post
  className?: string
}

export function FeaturedCard({ post, className }: FeaturedCardProps) {
  return (
    <Link
      href={`/writing/${post.slug}`}
      className={cn(
        "group grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-0 rounded-xl border border-border overflow-hidden transition-all duration-200 hover:shadow-lg dark:hover:shadow-none",
        className,
      )}
    >
      {/* Cover */}
      {post.cover && (
        <div className="relative aspect-[4/3] md:aspect-auto md:h-full min-h-[220px] overflow-hidden">
          <Image
            src={post.cover.url}
            alt={post.cover.alt ?? post.title}
            fill
            sizes="(max-width: 768px) 100vw, 55vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            priority
          />
        </div>
      )}

      {/* Content */}
      <div className="flex flex-col gap-4 p-6 md:p-8 bg-card">
        {/* Eyebrow */}
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Featured
        </p>

        <div className="flex-1 flex flex-col gap-3">
          <h2 className="font-sans text-2xl md:text-3xl font-semibold tracking-tight leading-snug group-hover:text-primary transition-colors duration-200">
            {post.title}
          </h2>

          {post.excerpt && (
            <p className="text-base text-muted-foreground leading-relaxed line-clamp-4">
              {post.excerpt}
            </p>
          )}
        </div>

        {/* Meta row */}
        <div className="mt-auto flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-xs text-muted-foreground">
              {formatDate(post.publishedAt)}
            </span>
            {post.readingTime && (
              <span className="font-mono text-xs text-muted-foreground">
                {post.readingTime} min read
              </span>
            )}
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {post.tags.map(({ tag }) => (
                <Badge key={tag} variant="secondary" className="font-mono text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          <span className="font-mono text-xs text-primary mt-1">
            Read article →
          </span>
        </div>
      </div>
    </Link>
  )
}
