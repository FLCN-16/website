import type { Metadata } from "next"
import { site } from "@/content/site"

export function createMetadata({
  title,
  description,
  image,
  path,
  absolute = false,
}: {
  title: string
  description?: string
  image?: string
  /** URL path (e.g. "/writing") — sets an explicit canonical */
  path?: string
  /** When true, bypasses the layout title template */
  absolute?: boolean
}): Metadata {
  const fullTitle = `${title} — ${site.name}`
  const resolvedTitle = absolute ? ({ absolute: title } as Metadata["title"]) : title

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
      ...(image ? { images: [{ url: image }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      creator: `@${site.handle}`,
      title: fullTitle,
      description,
      ...(image ? { images: [image] } : {}),
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}
