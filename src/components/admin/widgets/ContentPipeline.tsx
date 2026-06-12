import React from 'react'
import type { PayloadRequest } from 'payload'
import { ContentPipelineChart } from './ContentPipelineChart'
import './widgets.css'

export type PipelineItem = { label: string; count: number }

type Props = { req: PayloadRequest }

export default async function ContentPipeline({ req }: Props) {
  const { payload } = req

  const [postsPublished, postsDraft, workPublished, workDraft, projectsPublished, projectsDraft] =
    await Promise.all([
      payload.count({ collection: 'posts', where: { status: { equals: 'published' } } }),
      payload.count({ collection: 'posts', where: { status: { equals: 'draft' } } }),
      payload.count({ collection: 'work', where: { status: { equals: 'published' } } }),
      payload.count({ collection: 'work', where: { status: { equals: 'draft' } } }),
      payload.count({ collection: 'projects', where: { status: { equals: 'published' } } }),
      payload.count({ collection: 'projects', where: { status: { equals: 'draft' } } }),
    ])

  const data: PipelineItem[] = [
    {
      label: 'Published',
      count:
        postsPublished.totalDocs + workPublished.totalDocs + projectsPublished.totalDocs,
    },
    {
      label: 'Draft',
      count: postsDraft.totalDocs + workDraft.totalDocs + projectsDraft.totalDocs,
    },
  ]

  return (
    <div className="flcn-widget">
      <div className="flcn-widget__header">
        <h3 className="flcn-widget__title">Content Pipeline</h3>
      </div>
      <ContentPipelineChart data={data} />
      <div className="flcn-pipeline__legend">
        {data.map(item => (
          <div key={item.label} className="flcn-pipeline__legend-item">
            <span
              className={`flcn-pipeline__dot flcn-pipeline__dot--${item.label.toLowerCase()}`}
            />
            <span>
              {item.label}: {item.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
