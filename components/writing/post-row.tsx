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
        "group flex flex-col border border-border overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md",
        className,
      )}
    >
      {/* Cover image */}
      <div className="relative aspect-[16/9] bg-muted overflow-hidden shrink-0">
        {post.cover ? (
          <Image
            src={post.cover.url}
            alt={post.cover.alt ?? post.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-muted-foreground/5 to-muted-foreground/15" />
        )}
      </div>

      {/* Text content */}
      <div className="flex flex-col gap-1.5 min-w-0 flex-1 p-4">
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

        <h3 className="font-sans text-base font-semibold tracking-tight leading-snug group-hover:text-primary transition-colors duration-200 line-clamp-2">
          {post.title}
        </h3>

        {post.excerpt && (
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
            {post.excerpt}
          </p>
        )}

        <div className="flex items-center gap-1.5 mt-auto pt-3 border-t border-border/60">
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
    </Link>
  )
}
