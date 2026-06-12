import React from 'react'
import type { PayloadRequest } from 'payload'
import { InquiryBreakdownChart } from './InquiryBreakdownChart'
import './widgets.css'

export type InquiryData = { type: string; count: number }

type SubmissionField = { field?: string | null; value?: string | null }

const INQUIRY_LABELS: Record<string, string> = {
  project: 'New Project',
  consulting: 'Consulting',
  fulltime: 'Full-time',
  other: 'Other',
}

export function groupByInquiry(
  docs: Array<{ submissionData?: SubmissionField[] | null }>,
): InquiryData[] {
  const counts: Record<string, number> = {}

  for (const doc of docs) {
    const val = doc.submissionData?.find(f => f.field === 'inquiry')?.value ?? 'other'
    counts[val] = (counts[val] ?? 0) + 1
  }

  return Object.entries(counts)
    .map(([key, count]) => ({ type: INQUIRY_LABELS[key] ?? key, count }))
    .sort((a, b) => b.count - a.count)
}

type Props = { req: PayloadRequest }

export default async function InquiryBreakdown({ req }: Props) {
  const { payload } = req

  const { docs } = await payload.find({
    collection: 'form-submissions',
    limit: 500,
    depth: 0,
  })

  const data = groupByInquiry(docs as Array<{ submissionData?: SubmissionField[] | null }>)

  return (
    <div className="flcn-widget">
      <div className="flcn-widget__header">
        <h3 className="flcn-widget__title">Inquiry Breakdown</h3>
      </div>
      {data.length === 0 ? (
        <p className="flcn-widget__empty">No inquiries yet.</p>
      ) : (
        <InquiryBreakdownChart data={data} />
      )}
    </div>
  )
}
