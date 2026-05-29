import type { Metadata } from "next"
import { site } from "@/content/site"

export function createMetadata({
  title,
  description,
  image,
}: {
  title: string
  description?: string
  image?: string
}): Metadata {
  const fullTitle = `${title} — ${site.name}`

  return {
    metadataBase: new URL(site.url),
    title,
    description,
    authors: [{ name: site.name, url: site.url }],
    creator: site.name,
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
