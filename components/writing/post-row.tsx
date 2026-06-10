import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"
import type { Post } from "@/lib/types"

function formatDate(iso?: string | null) {
  if (!iso) return "—"
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

interface PostRowProps {
  post: Post
  className?: string
}

export function PostRow({ post, className }: PostRowProps) {
  return (
    <Link
      href={`/writing/${post.slug}`}
      className={cn(
        "group flex flex-col transition-all duration-300",
        // Mobile + desktop card: full border, column stack, hover lift
        "border border-border overflow-hidden hover:-translate-y-0.5 hover:shadow-md",
        // Tablet row: horizontal, strip card border to bottom-only, suppress card hover
        "md:flex-row md:items-center md:gap-6 md:py-6 md:overflow-visible",
        "md:border-t-0 md:border-l-0 md:border-r-0 md:last:border-b-0",
        "md:hover:translate-y-0 md:hover:shadow-none",
        // Desktop: back to card column with full border
        "lg:flex-col lg:border-t lg:border-l lg:border-r lg:border-b lg:overflow-hidden lg:py-0",
        "lg:hover:-translate-y-0.5 lg:hover:shadow-md",
        className,
      )}
    >
      {/* Card image — mobile (<md) and desktop (≥lg) */}
      <div className="relative aspect-[16/9] bg-muted overflow-hidden md:hidden lg:block shrink-0">
        {post.cover ? (
          <Image
            src={post.cover.url}
            alt={post.cover.alt ?? post.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-muted-foreground/5 to-muted-foreground/15" />
        )}
      </div>

      {/* Square thumbnail — tablet row only (md to lg) */}
      {post.cover && (
        <div className="hidden md:block lg:hidden relative w-24 h-24 overflow-hidden rounded-sm shrink-0">
          <Image
            src={post.cover.url}
            alt={post.cover.alt ?? post.title}
            fill
            sizes="96px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}

      {/* Text content */}
      <div
        className={cn(
          "flex flex-col gap-1.5 min-w-0 flex-1",
          "p-4",
          "md:p-0",
          "lg:p-4",
        )}
      >
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-0.5">
            {post.tags.slice(0, 2).map(({ tag }) => (
              <span
                key={tag}
                className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground/70"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <h3 className="font-sans text-base md:text-lg font-semibold tracking-tight leading-snug group-hover:text-primary transition-colors duration-200 line-clamp-2">
          {post.title}
        </h3>

        {post.excerpt && (
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
            {post.excerpt}
          </p>
        )}

        <div
          className={cn(
            "flex items-center gap-1.5 mt-auto",
            "pt-3 border-t border-border/60",
            "md:border-t-0 md:pt-0 md:mt-1",
            "lg:border-t lg:border-border/60 lg:pt-3 lg:mt-auto",
          )}
        >
          <span className="font-mono text-xs text-muted-foreground">
            {formatDate(post.publishedAt)}
          </span>
          {post.readingTime && (
            <>
              <span className="text-muted-foreground/30 text-xs">·</span>
              <span className="font-mono text-xs text-muted-foreground">
                {post.readingTime} min read
              </span>
            </>
          )}
        </div>
      </div>

      {/* Arrow — tablet row only */}
      <span className="hidden md:inline lg:hidden font-mono text-sm text-muted-foreground/50 group-hover:text-foreground group-hover:translate-x-1 transition-all duration-200 select-none shrink-0">
        →
      </span>
    </Link>
  )
}
