import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { getCachedLegalPage, getPreviewPage, getCachedSiteSettings } from '@/lib/data'
import { createMetadata } from '@/lib/metadata'
import { buildIdentity } from '@/lib/site-identity'
import { RefreshRouteOnSaveClient } from '@/components/refresh-route-on-save'
import { richTextConverters } from '@/components/writing/richtext-converters'
import { DataRequestFormSection } from '@/components/sections/data-request-form-section'

export const revalidate = false

const SLUG = 'data-request'

export async function generateMetadata(): Promise<Metadata> {
  const { isEnabled: draft } = await draftMode()
  try {
    const [page, settings] = await Promise.all([
      draft ? getPreviewPage(SLUG, 'legal') : getCachedLegalPage(SLUG),
      getCachedSiteSettings(),
    ])
    const identity = buildIdentity(settings)
    return createMetadata({
      kind: 'LEGAL',
      title: page?.meta?.title || page?.title || 'Data Subject Request',
      description:
        page?.meta?.description ||
        'Exercise your GDPR data rights — access, correction, erasure, portability, and more.',
      image:
        typeof page?.meta?.image === 'object' ? page?.meta?.image?.url ?? undefined : undefined,
      path: `/legal/${SLUG}`,
      identity,
    })
  } catch {
    return { title: 'Data Subject Request' }
  }
}

export default async function DataRequestPage() {
  const { isEnabled: draft } = await draftMode()

  let page: Awaited<ReturnType<typeof getCachedLegalPage>> | undefined
  try {
    page = draft ? await getPreviewPage(SLUG, 'legal') : await getCachedLegalPage(SLUG)
  } catch {
    // Payload unavailable — render fallback heading + form
  }

  const lastUpdated =
    page?.lastUpdated
      ? new Date(page.lastUpdated).toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })
      : null

  return (
    <>
      {draft && page && (
        <RefreshRouteOnSaveClient serverURL={process.env.NEXT_PUBLIC_SITE_URL ?? ''} />
      )}
      <div className="max-w-3xl">
        <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-4">
          Legal
        </p>
        <h1 className="font-sans text-4xl font-semibold tracking-tight mb-2">
          {page?.title ?? 'Data Subject Request'}
        </h1>
        {lastUpdated && (
          <p className="text-sm text-muted-foreground mb-8">
            Last updated {lastUpdated}
          </p>
        )}
        {page?.body != null && (
          <RichText
            data={page.body as Parameters<typeof RichText>[0]['data']}
            converters={richTextConverters}
          />
        )}
        <DataRequestFormSection />
      </div>
    </>
  )
}
