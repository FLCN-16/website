import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
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
        "group flex gap-4 py-5 border-b border-border last:border-b-0 transition-colors hover:bg-muted/30",
        className,
      )}
    >
      {/* Thumbnail — only when cover is present */}
      {post.cover && (
        <div className="relative shrink-0 w-24 h-24 md:w-36 md:h-24 rounded-md overflow-hidden">
          <Image
            src={post.cover.url}
            alt={post.cover.alt ?? post.title}
            fill
            sizes="(max-width: 768px) 96px, 144px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}

      {/* Text */}
      <div className="flex flex-col gap-1.5 min-w-0 flex-1">
        <h3 className="font-sans text-base font-semibold tracking-tight leading-snug group-hover:text-primary transition-colors duration-200 line-clamp-2">
          {post.title}
        </h3>

        {post.excerpt && (
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {post.excerpt}
          </p>
        )}

        <div className="mt-auto flex flex-wrap items-center gap-2 pt-1">
          <span className="font-mono text-xs text-muted-foreground">
            {formatDate(post.publishedAt)}
          </span>
          {post.readingTime && (
            <>
              <span className="text-muted-foreground/40">·</span>
              <span className="font-mono text-xs text-muted-foreground">
                {post.readingTime} min
              </span>
            </>
          )}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 ml-auto">
              {post.tags.slice(0, 2).map(({ tag }) => (
                <Badge key={tag} variant="secondary" className="font-mono text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
