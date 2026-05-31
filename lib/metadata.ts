import type { Metadata } from "next"
import { site } from "@/content/site"

export function buildOgUrl(title: string, kind?: string, desc?: string): string {
  const params = new URLSearchParams({ title })
  if (kind) params.set('kind', kind)
  if (desc) params.set('desc', desc.slice(0, 160))
  return `${site.url}/og?${params.toString()}`
}

export function createMetadata({
  title,
  description,
  image,
  path,
  absolute = false,
  kind,
}: {
  title: string
  description?: string
  image?: string
  path?: string
  absolute?: boolean
  kind?: string
}): Metadata {
  const fullTitle = `${title} — ${site.name}`
  const resolvedTitle = absolute ? ({ absolute: title } as Metadata["title"]) : title
  const ogImage = image ?? buildOgUrl(title, kind, description)

  return {
    metadataBase: new URL(site.url),
    title: resolvedTitle,
    description,
    authors: [{ name: site.name, url: site.url }],
    creator: site.name,
    ...(path ? { alternates: { canonical: `${site.url}${path}` } } : {}),
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: site.name,
      title: fullTitle,
      description,
      images: [{ url: ogImage }],
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
