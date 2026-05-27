import type { ImageLoaderProps } from 'next/image'

export function buildCloudflareUrl(
  src: string,
  width: number,
  quality: number | undefined,
  baseUrl: string,
): string {
  const q = quality ?? 85
  const params = `width=${width},quality=${q},format=auto`
  const path = src.startsWith('http') ? new URL(src).pathname : src
  return `${baseUrl}/cdn-cgi/image/${params}${path}`
}

export default function cloudflareLoader({ src, width, quality }: ImageLoaderProps): string {
  return buildCloudflareUrl(src, width, quality, process.env.NEXT_PUBLIC_MEDIA_URL ?? '')
}
