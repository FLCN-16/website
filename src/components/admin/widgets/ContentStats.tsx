import React from 'react'
import Link from 'next/link'
import type { PayloadRequest } from 'payload'
import './widgets.css'

type Props = {
  req: PayloadRequest
}

export default async function ContentStats({ req }: Props) {
  const { payload } = req

  const [posts, drafts, projects, work, pages, media, submissions] = await Promise.all([
    payload.count({ collection: 'posts' }),
    payload.count({ collection: 'posts', where: { status: { equals: 'draft' } } }),
    payload.count({ collection: 'projects' }),
    payload.count({ collection: 'work' }),
    payload.count({ collection: 'pages' }),
    payload.count({ collection: 'media' }),
    payload.count({ collection: 'submissions' }),
  ])

  const stats = [
    {
      label: 'Posts',
      count: posts.totalDocs,
      sub: drafts.totalDocs > 0 ? `${drafts.totalDocs} draft${drafts.totalDocs === 1 ? '' : 's'}` : undefined,
      href: '/admin/collections/posts',
    },
    { label: 'Projects', count: projects.totalDocs, href: '/admin/collections/projects' },
    { label: 'Work', count: work.totalDocs, href: '/admin/collections/work' },
    { label: 'Pages', count: pages.totalDocs, href: '/admin/collections/pages' },
    { label: 'Media', count: media.totalDocs, href: '/admin/collections/media' },
    { label: 'Inquiries', count: submissions.totalDocs, href: '/admin/collections/submissions' },
  ]

  return (
    <div className="flcn-widget">
      <div className="flcn-widget__header">
        <h3 className="flcn-widget__title">Content Overview</h3>
      </div>
      <div className="flcn-stats__grid">
        {stats.map((stat) => (
          <Link key={stat.label} className="flcn-stats__item" href={stat.href}>
            <span className="flcn-stats__count">{stat.count}</span>
            <span className="flcn-stats__label">{stat.label}</span>
            {stat.sub && <span className="flcn-stats__sub">{stat.sub}</span>}
          </Link>
        ))}
      </div>
    </div>
  )
}
