interface PayloadListResponse<T = unknown> {
  docs: T[]
  totalDocs: number
  limit: number
  page: number
  totalPages: number
}

export type { PayloadListResponse }

export async function restFetch<T>(
  path: string,
  tags: string[] = []
): Promise<T> {
  if (!process.env.NEXT_PUBLIC_SITE_URL) {
    throw new Error('NEXT_PUBLIC_SITE_URL env var is not set')
  }

  const url = `${process.env.NEXT_PUBLIC_SITE_URL}/api/${path}`

  const res = await fetch(url, {
    next: { tags, revalidate: false },
  })

  if (!res.ok) {
    throw new Error(`Payload REST request failed: ${res.status} ${res.statusText}`)
  }

  const json: T = await res.json()

  if (json == null) {
    throw new Error('Payload REST response returned no data')
  }

  return json
}
