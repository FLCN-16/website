import React from 'react'
import Link from 'next/link'
import type { PayloadRequest } from 'payload'
import './widgets.css'

type SubmissionRow = {
  id: string
  name: string
  email: string
  inquiry?: string | null
  submittedAt?: string | null
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

const formatDate = (value?: string | null) => {
  if (!value) return ''
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(
    new Date(value),
  )
}

export default async function RecentSubmissions({ req }: Props) {
  const { docs } = await req.payload.find({
    collection: 'submissions',
    limit: 5,
    sort: '-createdAt',
    depth: 0,
    select: { name: true, email: true, inquiry: true, submittedAt: true, createdAt: true },
  })

  const submissions = docs as SubmissionRow[]

  return (
    <div className="flcn-widget">
      <div className="flcn-widget__header">
        <h3 className="flcn-widget__title">Recent Inquiries</h3>
        <Link className="flcn-widget__action" href="/admin/collections/submissions">
          View all
        </Link>
      </div>
      {submissions.length === 0 ? (
        <p className="flcn-widget__empty">No inquiries yet.</p>
      ) : (
        <ul className="flcn-list">
          {submissions.map((submission) => (
            <li key={submission.id} className="flcn-list__item">
              <Link className="flcn-list__link" href={`/admin/collections/submissions/${submission.id}`}>
                <span className="flcn-list__main">
                  <span className="flcn-list__title">
                    {submission.name} · {submission.email}
                  </span>
                  <span className="flcn-list__meta">
                    {formatDate(submission.submittedAt ?? submission.createdAt)}
                  </span>
                </span>
                {submission.inquiry && (
                  <span className="flcn-pill flcn-pill--neutral">
                    {INQUIRY_LABELS[submission.inquiry] ?? submission.inquiry}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
