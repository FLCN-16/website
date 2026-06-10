import type { Metadata } from "next"
import { site } from "@/content/site"
import { buildCloudflareUrl } from "@/lib/cloudflare-image-loader"

// Bump when the /og template design changes — busts year-long CDN/scraper caches
const OG_VERSION = '2'

export function buildOgUrl(title: string, kind?: string, desc?: string): string {
  const params = new URLSearchParams({ title })
  if (kind) params.set('kind', kind)
  if (desc) params.set('desc', desc.slice(0, 160))
  params.set('v', OG_VERSION)
  return `${site.url}/og?${params.toString()}`
}

export interface MetaImage {
  url: string
  width?: number
  height?: number
  alt?: string
}

// Scrapers (Telegram, Slack, …) skip very large OG images, so serve CMS originals
// through Cloudflare image resizing capped at the recommended OG width.
const OG_IMAGE_MAX_WIDTH = 1200

/** Maps a Payload `meta.image` upload (string id or populated doc) to a MetaImage. */
export function resolveMetaImage(
  image: unknown,
): MetaImage | undefined {
  if (typeof image !== 'object' || image === null) return undefined
  const doc = image as { url?: string | null; width?: number | null; height?: number | null; alt?: string | null }
  if (!doc.url) return undefined

  let url = doc.url
  let width = doc.width ?? undefined
  let height = doc.height ?? undefined

  const mediaUrl = process.env.NEXT_PUBLIC_MEDIA_URL
  if (mediaUrl && url.startsWith(mediaUrl)) {
    const targetWidth = width ? Math.min(width, OG_IMAGE_MAX_WIDTH) : OG_IMAGE_MAX_WIDTH
    url = buildCloudflareUrl(url, targetWidth, undefined, mediaUrl)
    if (width && height) {
      height = Math.round(height * (targetWidth / width))
      width = targetWidth
    }
  }

  return {
    url,
    width,
    height,
    alt: doc.alt ?? undefined,
  }
}

export function createMetadata({
  title,
  description,
  image,
  path,
  absolute = false,
  kind,
  article,
}: {
  title: string
  description?: string
  image?: string | MetaImage
  path?: string
  absolute?: boolean
  kind?: string
  article?: {
    publishedTime?: string
    modifiedTime?: string
    tags?: string[]
  }
}): Metadata {
  const fullTitle = `${title} — ${site.name}`
  const resolvedTitle = absolute ? ({ absolute: title } as Metadata["title"]) : title
  const metaImage = typeof image === 'string' ? { url: image } : image
  const ogImage = metaImage?.url ?? buildOgUrl(title, kind, description)
  // Generated OG images are always 1200x630; CMS-supplied images carry their own dimensions
  const ogImageDescriptor = metaImage
    ? { url: ogImage, width: metaImage.width, height: metaImage.height, alt: metaImage.alt ?? title }
    : { url: ogImage, width: 1200, height: 630, alt: title }

  return {
    metadataBase: new URL(site.url),
    title: resolvedTitle,
    description,
    authors: [{ name: site.name, url: site.url }],
    creator: site.name,
    ...(article?.tags?.length ? { keywords: article.tags } : {}),
    // Pages replace the layout's `alternates` wholesale (shallow merge), so re-declare the feed here
    alternates: {
      ...(path ? { canonical: `${site.url}${path}` } : {}),
      types: { "application/rss+xml": `${site.url}/feed.xml` },
    },
    openGraph: {
      ...(article
        ? {
            type: "article",
            publishedTime: article.publishedTime,
            modifiedTime: article.modifiedTime,
            authors: [site.url],
            tags: article.tags,
          }
        : { type: "website" }),
      locale: "en_US",
      siteName: site.name,
      ...(path ? { url: `${site.url}${path}` } : {}),
      title: fullTitle,
      description,
      images: [ogImageDescriptor],
    },
    twitter: {
      card: "summary_large_image",
      site: `@${site.handle}`,
      creator: `@${site.handle}`,
      title: fullTitle,
      description,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}
