import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { draftMode } from 'next/headers'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { getCachedLegalPage, getPreviewPage } from '@/lib/data'
import { createMetadata } from '@/lib/metadata'
import { getPayloadClient } from '@/lib/payload'
import { RefreshRouteOnSaveClient } from '@/components/refresh-route-on-save'
import { richTextConverters } from '@/components/writing/richtext-converters'

export const revalidate = false
export const dynamicParams = true

interface LegalPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'pages',
    where: { template: { equals: 'legal' } },
    limit: 100,
    depth: 0,
  })
  const params: { slug: string }[] = []
  for (const doc of result.docs) {
    if (doc.slug) params.push({ slug: String(doc.slug) })
  }
  return params
}

export async function generateMetadata({ params }: LegalPageProps): Promise<Metadata> {
  const [{ slug }, { isEnabled: draft }] = await Promise.all([params, draftMode()])
  try {
    const page = draft ? await getPreviewPage(slug, 'legal') : await getCachedLegalPage(slug)
    if (!page) return { title: 'Not Found' }
    return createMetadata({
      kind: 'LEGAL',
      title: page.meta?.title || (page.title ?? slug),
      description: page.meta?.description || undefined,
      image: typeof page.meta?.image === 'object' ? page.meta?.image?.url ?? undefined : undefined,
    })
  } catch {
    return { title: slug }
  }
}

export default async function LegalPage({ params }: LegalPageProps) {
  const [{ slug }, { isEnabled: draft }] = await Promise.all([params, draftMode()])

  let page: Awaited<ReturnType<typeof getCachedLegalPage>> | undefined
  try {
    page = draft ? await getPreviewPage(slug, 'legal') : await getCachedLegalPage(slug)
  } catch {
    // Payload unavailable — fall through to notFound below
  }

  if (!page) notFound()

  const lastUpdated = page.lastUpdated
    ? new Date(page.lastUpdated).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : null

  return (
    <>
      {draft && (
        <RefreshRouteOnSaveClient serverURL={process.env.NEXT_PUBLIC_SITE_URL ?? ''} />
      )}
      <div className="max-w-3xl">
        <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-4">
          Legal
        </p>
        <h1 className="font-sans text-4xl font-semibold tracking-tight mb-2">
          {page.title}
        </h1>
        {lastUpdated && (
          <p className="text-sm text-muted-foreground mb-8">
            Last updated {lastUpdated}
          </p>
        )}
        <RichText
          data={page.body as Parameters<typeof RichText>[0]['data']}
          converters={richTextConverters}
        />
      </div>
    </>
  )
}
