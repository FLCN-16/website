/** Returns the frontend path for a given collection + doc data */
export function generatePreviewPath({
  collection,
  slug,
  template,
}: {
  collection: string
  slug: string
  template?: string
}): string {
  if (collection === 'posts') return `/writing/${slug}`
  if (collection === 'pages') {
    return template === 'legal' ? `/legal/${slug}` : `/page/${slug}`
  }
  return `/${slug}`
}

/** Returns the full URL that enables draft mode and redirects to the preview page */
export function generatePreviewUrl({
  collection,
  slug,
  template,
}: {
  collection: string
  slug: string
  template?: string
}): string {
  if (!slug) return ''
  const serverURL = process.env.NEXT_PUBLIC_SITE_URL || ''
  const previewSecret = process.env.PREVIEW_SECRET || ''
  const path = generatePreviewPath({ collection, slug, template })
  return `${serverURL}/next/preview?path=${encodeURIComponent(path)}&previewSecret=${encodeURIComponent(previewSecret)}`
}
