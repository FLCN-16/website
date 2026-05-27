"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  tags?: Array<{ tag: string }>;
  publishedAt?: string;
  readingTime?: number;
}

interface WritingListClientProps {
  initialPosts: Post[];
  allTags: string[];
}

async function fetchPosts(search: string, tag: string): Promise<Post[]> {
  const params = new URLSearchParams();
  params.set("where[status][equals]", "published");
  params.set("limit", "50");
  params.set("sort", "-publishedAt");
  if (search) params.set("where[title][contains]", search);
  if (tag) params.set("where[tags.tag][equals]", tag);

  const res = await fetch(`/api/posts?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch posts");
  const data = await res.json();
  return data.docs as Post[];
}

export function WritingListClient({ initialPosts, allTags }: WritingListClientProps) {
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState("");

  const isFiltering = search.length > 0 || activeTag.length > 0;

  const { data: filteredPosts } = useQuery({
    queryKey: ["posts", search, activeTag],
    queryFn: () => fetchPosts(search, activeTag),
    enabled: isFiltering,
    placeholderData: initialPosts,
  });

  const posts = isFiltering ? (filteredPosts ?? initialPosts) : initialPosts;

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <Input
          placeholder="Search articles…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sm:max-w-xs font-mono text-sm"
        />
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTag("")}
            className={cn(
              "text-xs font-mono uppercase tracking-widest px-3 py-1.5 rounded-full border transition-colors",
              activeTag === ""
                ? "bg-foreground text-background border-foreground"
                : "border-border text-muted-foreground hover:text-foreground",
            )}
          >
            All
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag === activeTag ? "" : tag)}
              className={cn(
                "text-xs font-mono uppercase tracking-widest px-3 py-1.5 rounded-full border transition-colors",
                activeTag === tag
                  ? "bg-foreground text-background border-foreground"
                  : "border-border text-muted-foreground hover:text-foreground",
              )}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Post list */}
      {posts.length === 0 ? (
        <p className="font-mono text-sm text-muted-foreground">No articles found.</p>
      ) : (
        <ul className="divide-y divide-border">
          {posts.map((post) => (
            <li key={post.id}>
              <Link
                href={`/writing/${post.slug}`}
                className="group flex flex-col gap-1.5 py-6 hover:bg-muted/30 -mx-4 px-4 rounded-lg transition-colors"
              >
                <div className="flex items-center justify-between gap-4">
                  <h2 className="text-base font-semibold group-hover:text-primary transition-colors">
                    {post.title}
                  </h2>
                  <span className="shrink-0 font-mono text-xs text-muted-foreground">
                    {post.publishedAt
                      ? new Date(post.publishedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "—"}
                  </span>
                </div>

                {post.excerpt && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                )}

                <div className="flex items-center gap-3 mt-1">
                  {post.readingTime && (
                    <span className="font-mono text-xs text-muted-foreground">
                      {post.readingTime} min read
                    </span>
                  )}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex gap-1.5 flex-wrap">
                      {post.tags.map(({ tag }) => (
                        <Badge key={tag} variant="secondary" className="font-mono text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
