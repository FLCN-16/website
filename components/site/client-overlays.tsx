'use client'

import dynamic from 'next/dynamic'
import type { Form } from '@payloadcms/plugin-form-builder/types'

const SplashScreen = dynamic(
  () => import('@/components/site/splash-screen').then((m) => ({ default: m.SplashScreen })),
  { ssr: false, loading: () => null }
)

const TalentInquiryDialog = dynamic(
  () => import('@/components/site/talent-inquiry-dialog').then((m) => ({ default: m.TalentInquiryDialog })),
  { ssr: false, loading: () => null }
)

export function ClientOverlays({ form }: { form: Form | null }) {
  return (
    <>
      <SplashScreen />
      {form && <TalentInquiryDialog form={form} />}
    </>
  )
}
