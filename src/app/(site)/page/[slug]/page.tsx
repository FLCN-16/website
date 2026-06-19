import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { draftMode } from 'next/headers'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { getCachedBasicPage, getPreviewPage, getCachedSiteSettings } from '@/lib/data'
import { createMetadata, resolveMetaImage } from '@/lib/metadata'
import { buildIdentity } from '@/lib/site-identity'
import { getPayloadClient } from '@/lib/payload'
import { RefreshRouteOnSaveClient } from '@/components/refresh-route-on-save'
import { richTextConverters } from '@/components/writing/richtext-converters'
import { JsonLd } from '@/components/structured-data/json-ld'
import { graph, webPageNode, breadcrumbNode } from '@/lib/structured-data'

export const revalidate = false
export const dynamicParams = true

interface BasicPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'pages',
    where: { template: { equals: 'basic' } },
    limit: 100,
    depth: 0,
  })
  const params: { slug: string }[] = []
  for (const doc of result.docs) {
    if (doc.slug) params.push({ slug: String(doc.slug) })
  }
  return params
}

export async function generateMetadata({ params }: BasicPageProps): Promise<Metadata> {
  const [{ slug }, { isEnabled: draft }] = await Promise.all([params, draftMode()])
  try {
    const [page, settings] = await Promise.all([
      draft ? getPreviewPage(slug, 'basic') : getCachedBasicPage(slug),
      getCachedSiteSettings(),
    ])
    if (!page) return { title: 'Not Found' }
    const identity = buildIdentity(settings)
    return createMetadata({
      title: page.meta?.title || (page.title ?? slug),
      description: page.meta?.description || undefined,
      image: resolveMetaImage(page.meta?.image),
      path: `/page/${slug}`,
      identity,
    })
  } catch {
    return { title: slug }
  }
}

export default async function BasicPage({ params }: BasicPageProps) {
  const [{ slug }, { isEnabled: draft }] = await Promise.all([params, draftMode()])

  let page: Awaited<ReturnType<typeof getCachedBasicPage>> | undefined
  let settings: Awaited<ReturnType<typeof getCachedSiteSettings>> | null = null
  try {
    ;[page, settings] = await Promise.all([
      draft ? getPreviewPage(slug, 'basic') : getCachedBasicPage(slug),
      getCachedSiteSettings().catch(() => null),
    ])
  } catch {
    // Payload unavailable — fall through to notFound below
  }

  if (!page) notFound()
  const identity = buildIdentity(settings)

  return (
    <>
      <JsonLd data={graph([
        webPageNode(identity, {
          path: `/page/${slug}`,
          name: page.title ?? slug,
          description: page.meta?.description ?? undefined,
          breadcrumbId: `${identity.url}/page/${slug}#breadcrumb`,
        }),
        breadcrumbNode(identity, [
          { name: 'Home', path: '/' },
          { name: page.title ?? slug },
        ], `/page/${slug}`),
      ])} />
      {draft && (
        <RefreshRouteOnSaveClient serverURL={process.env.NEXT_PUBLIC_SITE_URL ?? ''} />
      )}
      <div className="max-w-3xl">
        <h1 className="font-sans text-4xl font-semibold tracking-tight mb-8">
          {page.title}
        </h1>
        <RichText
          data={page.body as Parameters<typeof RichText>[0]['data']}
          converters={richTextConverters}
        />
      </div>
    </>
  )
}
