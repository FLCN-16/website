import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip admin, API, and Next.js internals entirely
  if (
    pathname.startsWith('/admin') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next')
  ) {
    return NextResponse.next()
  }

  try {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
    if (siteUrl) {
      const res = await fetch(`${siteUrl}/api/globals/site-settings`, {
        next: { revalidate: 60 },
      })
      if (res.ok) {
        const settings = await res.json()
        const mm = settings?.maintenanceMode as { enabled?: boolean | null } | null | undefined
        const isMaintenancePage = pathname.startsWith('/maintenance')

        if (mm?.enabled) {
          // Maintenance on: redirect all non-maintenance pages to /maintenance
          if (!isMaintenancePage) {
            return NextResponse.redirect(new URL('/maintenance', request.url))
          }
        } else {
          // Maintenance off: redirect /maintenance back to homepage
          if (isMaintenancePage) {
            return NextResponse.redirect(new URL('/', request.url))
          }
        }
      }
    }
  } catch {
    // CMS unreachable — don't block the request
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon\\.ico|robots\\.txt|sitemap).*)',
  ],
}
