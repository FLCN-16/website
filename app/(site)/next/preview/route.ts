import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('previewSecret')
  const path = searchParams.get('path')

  if (!process.env.PREVIEW_SECRET || secret !== process.env.PREVIEW_SECRET) {
    return new Response('Invalid preview secret', { status: 401 })
  }

  if (!path || !path.startsWith('/') || path.startsWith('//')) {
    return new Response('Missing or invalid path', { status: 400 })
  }

  ;(await draftMode()).enable()
  redirect(path)
}
