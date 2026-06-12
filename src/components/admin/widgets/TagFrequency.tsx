import React from 'react'
import type { PayloadRequest } from 'payload'
import { TagFrequencyChart } from './TagFrequencyChart'
import './widgets.css'

export type TagData = { tag: string; count: number }

export function countTagFrequency(docs: Array<{ tags?: string[] | null }>): TagData[] {
  const counts: Record<string, number> = {}

  for (const doc of docs) {
    for (const tag of doc.tags ?? []) {
      if (tag) counts[tag] = (counts[tag] ?? 0) + 1
    }
  }

  return Object.entries(counts)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)
}

type Props = { req: PayloadRequest }

export default async function TagFrequency({ req }: Props) {
  const { payload } = req

  const { docs } = await payload.find({
    collection: 'posts',
    where: { status: { equals: 'published' } },
    limit: 1000,
    depth: 0,
    select: { tags: true },
  })

  const data = countTagFrequency(docs as Array<{ tags?: string[] | null }>)

  return (
    <div className="flcn-widget">
      <div className="flcn-widget__header">
        <h3 className="flcn-widget__title">Tag Frequency</h3>
        <span className="flcn-widget__action">Top 10</span>
      </div>
      {data.length === 0 ? (
        <p className="flcn-widget__empty">No tags yet.</p>
      ) : (
        <TagFrequencyChart data={data} />
      )}
    </div>
  )
}
