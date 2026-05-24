import type { Metadata } from "next";

import { getExperienceLabel } from "./utils";

const BASE_URL = "https://thefalcon.dev";
const SITE_NAME = "The Falcon";
const DEFAULT_DESCRIPTION = `Front-End Technical Lead with ${getExperienceLabel()} building high-performance applications. Open to new roles and open source collaboration.`;
const DEFAULT_OG_IMAGE = "/opengraph-image.png";

interface CreateMetadataOptions {
  /** Page title — appended to site name via the root template "%s | The Falcon" */
  title?: string;
  /** Override the default description */
  description?: string;
  /** Canonical path, e.g. "/work" — resolved against BASE_URL */
  path?: string;
  /** Override the OG image path */
  ogImage?: string;
  /** Set to true for pages that should not be indexed (e.g. legal, error) */
  noIndex?: boolean;
}

/**
 * createMetadata — generates a consistent Metadata object for any page.
 *
 * Usage:
 *   export const metadata = createMetadata({ title: "Work", path: "/work" });
 */
export function createMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  path = "/",
  ogImage = DEFAULT_OG_IMAGE,
  noIndex = false,
}: CreateMetadataOptions = {}): Metadata {
  const url = `${BASE_URL}${path}`;
  const ogImageUrl = ogImage.startsWith("http") ? ogImage : `${BASE_URL}${ogImage}`;

  return {
    ...(title ? { title } : {}),
    description,
    metadataBase: new URL(BASE_URL),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: title ? `${title} | ${SITE_NAME}` : SITE_NAME,
      description,
      url,
      siteName: SITE_NAME,
      locale: "en_US",
      type: "website",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title ? `${title} | ${SITE_NAME}` : SITE_NAME,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: title ? `${title} | ${SITE_NAME}` : SITE_NAME,
      description,
      images: [ogImageUrl],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
  };
}
