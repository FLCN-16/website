import React from 'react'
import Link from 'next/link'
import type { PayloadRequest } from 'payload'
import './widgets.css'

type SubmissionField = { field?: string | null; value?: string | null }

type SubmissionRow = {
  id: string
  submissionData?: SubmissionField[] | null
  createdAt?: string | null
}

type Props = {
  req: PayloadRequest
}

const INQUIRY_LABELS: Record<string, string> = {
  project: 'New Project',
  consulting: 'Consulting',
  fulltime: 'Full-time Role',
  other: 'Other',
}

const dateFormatter = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

const formatDate = (value?: string | null) => {
  if (!value) return ''
  return dateFormatter.format(new Date(value))
}

function getField(fields: SubmissionField[] | null | undefined, name: string) {
  return fields?.find((f) => f.field === name)?.value ?? null
}

export default async function RecentSubmissions({ req }: Props) {
  const { docs } = await req.payload.find({
    collection: 'form-submissions',
    limit: 5,
    sort: '-createdAt',
    depth: 0,
  })

  const submissions = docs as SubmissionRow[]

  return (
    <div className="flcn-widget">
      <div className="flcn-widget__header">
        <h3 className="flcn-widget__title">Recent Inquiries</h3>
        <Link className="flcn-widget__action" href="/admin/collections/form-submissions">
          View all
        </Link>
      </div>
      {submissions.length === 0 ? (
        <p className="flcn-widget__empty">No inquiries yet.</p>
      ) : (
        <ul className="flcn-list">
          {submissions.map((submission) => {
            const name = getField(submission.submissionData, 'name')
            const email = getField(submission.submissionData, 'email')
            const inquiry = getField(submission.submissionData, 'inquiry')
            return (
              <li key={submission.id} className="flcn-list__item">
                <Link className="flcn-list__link" href={`/admin/collections/form-submissions/${submission.id}`}>
                  <span className="flcn-list__main">
                    <span className="flcn-list__title">
                      {name ?? '—'} · {email ?? '—'}
                    </span>
                    <span className="flcn-list__meta">{formatDate(submission.createdAt)}</span>
                  </span>
                  {inquiry && (
                    <span className="flcn-pill flcn-pill--neutral">
                      {INQUIRY_LABELS[inquiry] ?? inquiry}
                    </span>
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
