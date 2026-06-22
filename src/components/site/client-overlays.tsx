'use client'

import dynamic from 'next/dynamic'
import { usePathname } from 'next/navigation'
import type { Form } from '@payloadcms/plugin-form-builder/types'
import { isWritingDetailRoute } from '@/lib/navigation'

const SplashScreen = dynamic(
  () => import('@/components/site/splash-screen').then((m) => ({ default: m.SplashScreen })),
  { ssr: false, loading: () => null }
)

const TalentInquiryDialog = dynamic(
  () => import('@/components/site/talent-inquiry-dialog').then((m) => ({ default: m.TalentInquiryDialog })),
  { ssr: false, loading: () => null }
)

export function ClientOverlays({ form }: { form: Form | null }) {
  const pathname = usePathname()
  // Suppress the talent popup on individual article pages so it never interrupts a
  // reader mid-article. It still runs on every other route (incl. the /writing list).
  const showTalentDialog = form && !isWritingDetailRoute(pathname)
  return (
    <>
      <SplashScreen />
      {showTalentDialog && <TalentInquiryDialog form={form} />}
    </>
  )
}
