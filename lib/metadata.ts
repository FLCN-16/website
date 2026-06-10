import type { Metadata } from "next"
import { site } from "@/content/site"

// Bump when the /og template design changes — busts year-long CDN/scraper caches
const OG_VERSION = '2'

export function buildOgUrl(title: string, kind?: string, desc?: string): string {
  const params = new URLSearchParams({ title })
  if (kind) params.set('kind', kind)
  if (desc) params.set('desc', desc.slice(0, 160))
  params.set('v', OG_VERSION)
  return `${site.url}/og?${params.toString()}`
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
  image?: string
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
  const ogImage = image ?? buildOgUrl(title, kind, description)
  // Generated OG images are always 1200x630; CMS-supplied images have unknown dimensions
  const ogImageDescriptor = image
    ? { url: ogImage, alt: title }
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
      title: fullTitle,
      description,
      images: [ogImageDescriptor],
    },
    twitter: {
      card: "summary_large_image",
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
