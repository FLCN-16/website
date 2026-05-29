interface GqlResponse<T> {
  data: T
  errors?: Array<{ message: string }>
}

export async function gqlFetch<T>(
  query: string,
  variables?: Record<string, unknown>,
  tags: string[] = []
): Promise<T> {
  if (!process.env.NEXT_PUBLIC_SITE_URL) {
    throw new Error('NEXT_PUBLIC_SITE_URL env var is not set')
  }

  const url = `${process.env.NEXT_PUBLIC_SITE_URL}/api/graphql`

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
    next: { tags, revalidate: false },
  })

  if (!res.ok) {
    throw new Error(`GraphQL request failed: ${res.status} ${res.statusText}`)
  }

  const json: GqlResponse<T> = await res.json()

  if (json.errors?.length) {
    throw new Error(json.errors[0].message)
  }

  if (json.data == null) {
    throw new Error('GraphQL response returned no data')
  }

  return json.data
}
