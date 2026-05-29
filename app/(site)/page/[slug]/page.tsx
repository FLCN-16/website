import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { draftMode } from 'next/headers'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { getCachedBasicPage, getPreviewPage } from '@/lib/data'
import { createMetadata } from '@/lib/metadata'
import { getPayloadClient } from '@/lib/payload'
import { RefreshRouteOnSaveClient } from '@/components/refresh-route-on-save'

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
  return result.docs
    .filter((doc) => doc.slug)
    .map((doc) => ({ slug: String(doc.slug) }))
}

export async function generateMetadata({ params }: BasicPageProps): Promise<Metadata> {
  const { slug } = await params
  const { isEnabled: draft } = await draftMode()
  try {
    const page = draft ? await getPreviewPage(slug, 'basic') : await getCachedBasicPage(slug)
    if (!page) return { title: 'Not Found' }
    return createMetadata({
      title: page.meta?.title || (page.title ?? slug),
      description: page.meta?.description || undefined,
      image: typeof page.meta?.image === 'object' ? page.meta?.image?.url ?? undefined : undefined,
    })
  } catch {
    return { title: slug }
  }
}

export default async function BasicPage({ params }: BasicPageProps) {
  const { slug } = await params
  const { isEnabled: draft } = await draftMode()

  let page: Awaited<ReturnType<typeof getCachedBasicPage>> | undefined
  try {
    page = draft ? await getPreviewPage(slug, 'basic') : await getCachedBasicPage(slug)
  } catch {
    // Payload unavailable — fall through to notFound below
  }

  if (!page) notFound()

  return (
    <>
      {draft && (
        <RefreshRouteOnSaveClient serverURL={process.env.NEXT_PUBLIC_SITE_URL ?? ''} />
      )}
      <div className="max-w-3xl">
        <h1 className="font-sans text-4xl font-semibold tracking-tight mb-8">
          {page.title}
        </h1>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <RichText data={page.body as Parameters<typeof RichText>[0]['data']} />
        </div>
      </div>
    </>
  )
}
