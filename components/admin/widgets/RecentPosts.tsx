import React from 'react'
import Link from 'next/link'
import type { PayloadRequest } from 'payload'
import './widgets.css'

type PostRow = {
  id: string
  title: string
  status: 'draft' | 'published'
  updatedAt?: string | null
}

type Props = {
  req: PayloadRequest
}

const formatDate = (value?: string | null) => {
  if (!value) return ''
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(
    new Date(value),
  )
}

export default async function RecentPosts({ req }: Props) {
  const { docs } = await req.payload.find({
    collection: 'posts',
    limit: 5,
    sort: '-updatedAt',
    depth: 0,
    select: { title: true, status: true, updatedAt: true },
  })

  const posts = docs as PostRow[]

  return (
    <div className="flcn-widget">
      <div className="flcn-widget__header">
        <h3 className="flcn-widget__title">Recent Posts</h3>
        <Link className="flcn-widget__action" href="/admin/collections/posts/create">
          + New Post
        </Link>
      </div>
      {posts.length === 0 ? (
        <p className="flcn-widget__empty">No posts yet.</p>
      ) : (
        <ul className="flcn-list">
          {posts.map((post) => (
            <li key={post.id} className="flcn-list__item">
              <Link className="flcn-list__link" href={`/admin/collections/posts/${post.id}`}>
                <span className="flcn-list__main">
                  <span className="flcn-list__title">{post.title}</span>
                  <span className="flcn-list__meta">Updated {formatDate(post.updatedAt)}</span>
                </span>
                <span className={`flcn-pill flcn-pill--${post.status === 'published' ? 'published' : 'draft'}`}>
                  {post.status}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
