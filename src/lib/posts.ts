import type { Post, PostCover } from "./types"

/** Accepts both tag shapes — plain strings (hasMany text field) and the
 * legacy array-of-objects [{ tag }] — so the site keeps rendering during the
 * deploy window before the data migration runs. */
export function normalizeTags(raw: unknown): string[] {
  if (!Array.isArray(raw)) return []
  return raw
    .map((t) => {
      if (typeof t === "string") return t
      if (t && typeof t === "object" && "tag" in t) return String((t as { tag?: unknown }).tag ?? "")
      return ""
    })
    .filter(Boolean)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function resolvePostCover(raw: any): PostCover | null {
  if (!raw || typeof raw !== "object" || !raw.url) return null
  return {
    url: raw.url as string,
    width: (raw.width as number | undefined) ?? 800,
    height: (raw.height as number | undefined) ?? 450,
    alt: (raw.alt as string | null | undefined) ?? null,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapPayloadPost(doc: any): Post {
  return {
    id: String(doc.id),
    title: doc.title as string,
    slug: doc.slug as string,
    excerpt: (doc.excerpt as string | null | undefined) ?? null,
    cover: resolvePostCover(doc.cover),
    tags: normalizeTags(doc.tags),
    publishedAt: (doc.publishedAt as string | null | undefined) ?? null,
    readingTime: (doc.readingTime as number | null | undefined) ?? null,
    featured: (doc.featured as boolean | undefined) ?? undefined,
  }
}
