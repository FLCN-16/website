import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip maintenance page, admin, API, and Next.js internals entirely
  if (
    pathname.startsWith('/maintenance') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next')
  ) {
    return NextResponse.next()
  }

  try {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
    if (siteUrl) {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 1500)
      try {
        const res = await fetch(`${siteUrl}/api/globals/site-settings`, {
          signal: controller.signal,
          next: { revalidate: 60 },
        })
        if (res.ok) {
          const settings = await res.json()
          const mm = settings?.maintenanceMode as { enabled?: boolean | null } | null | undefined
          if (mm?.enabled) {
            return NextResponse.redirect(new URL('/maintenance', request.url))
          }
        }
      } finally {
        clearTimeout(timeout)
      }
    }
  } catch {
    // CMS unreachable or timed out — fail open
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon\\.ico|robots\\.txt|sitemap).*)',
  ],
}
