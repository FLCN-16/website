import React from 'react'
import type { PayloadRequest } from 'payload'
import { PostsActivityChart } from './PostsActivityChart'
import './widgets.css'

export type MonthData = { month: string; count: number }

type Props = { req: PayloadRequest }

export function buildActivityData(
  docs: Array<{ publishedAt?: string | null }>,
  now: Date,
): MonthData[] {
  const slots: MonthData[] = Array.from({ length: 12 }, (_, i) => {
    const d = new Date(now)
    d.setMonth(d.getMonth() - (11 - i))
    return {
      month: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
      count: 0,
    }
  })

  for (const doc of docs) {
    if (!doc.publishedAt) continue
    const d = new Date(doc.publishedAt)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    const slot = slots.find(m => m.month === key)
    if (slot) slot.count++
  }

  return slots
}

export default async function PostsActivity({ req }: Props) {
  const { payload } = req

  const twelveMonthsAgo = new Date()
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11)
  twelveMonthsAgo.setDate(1)
  twelveMonthsAgo.setHours(0, 0, 0, 0)

  const { docs } = await payload.find({
    collection: 'posts',
    where: {
      and: [
        { status: { equals: 'published' } },
        { publishedAt: { greater_than_equal: twelveMonthsAgo.toISOString() } },
      ],
    },
    limit: 1000,
    depth: 0,
    select: { publishedAt: true },
  })

  const data = buildActivityData(docs as Array<{ publishedAt?: string | null }>, new Date())

  return (
    <div className="flcn-widget">
      <div className="flcn-widget__header">
        <h3 className="flcn-widget__title">Publishing Activity</h3>
        <span className="flcn-widget__action">Last 12 months</span>
      </div>
      <PostsActivityChart data={data} />
    </div>
  )
}
