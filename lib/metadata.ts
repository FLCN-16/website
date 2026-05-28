import type { Metadata } from "next"
import { site } from "@/content/site"

export function createMetadata({
  title,
  description,
}: {
  title: string
  description?: string
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
    },
    twitter: {
      card: "summary_large_image",
      creator: `@${site.handle}`,
      title: fullTitle,
      description,
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}
