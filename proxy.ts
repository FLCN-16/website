import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { isConsentRequiredCountry } from './src/lib/consent-regions'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Resolve the visitor's country from Vercel's geo header (cf-ipcountry as fallback
  // for environments fronted by Cloudflare). Unknown country defaults to required.
  const country =
    request.headers.get('x-vercel-ip-country') ?? request.headers.get('cf-ipcountry')
  const required = isConsentRequiredCountry(country)

  /**
   * Stamp a JS-readable cookie that tells the client banner whether to auto-show.
   * maxAge of 180 days prevents re-showing on browser-close for non-required regions.
   * Set only in middleware — never in a Server Component / route handler — so the
   * shared Full Route Cache entry stays region-agnostic.
   */
  function setConsentCookie(response: NextResponse): NextResponse {
    response.cookies.set('flcn-consent-required', required ? '1' : '0', {
      path: '/',
      sameSite: 'lax',
      httpOnly: false,
      maxAge: 60 * 60 * 24 * 180, // 180 days
    })
    return response
  }

  // Skip maintenance page, admin, API, and Next.js internals entirely
  if (
    pathname.startsWith('/maintenance') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next')
  ) {
    return NextResponse.next()
  }

  // Logged-in users always bypass maintenance mode; still set the consent cookie
  // since the site layout (including the banner) renders for them too.
  if (request.cookies.get('payload-token')) {
    return setConsentCookie(NextResponse.next())
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
            // Maintenance page doesn't need the banner cookie
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

  return setConsentCookie(NextResponse.next())
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon\\.ico|robots\\.txt|sitemap).*)',
  ],
}
