import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

/**
 * `/countries/:id` takes an ISO 3166-1 alpha-3 code. A malformed id can't be a country,
 * so it should be a real 404.
 *
 * `notFound()` thrown from the page during an initial (non-navigation) render does not
 * render the not-found boundary in Next 16.3 — it emits a blank error document with the
 * right status. Checking the shape here, before the route renders, lets us rewrite to the
 * not-found route with a 404 while still showing the styled 404 UI. Client-side navigation
 * to a malformed id is covered by `assertCountryId` in the page itself.
 */
const COUNTRY_PATH = /^\/countries\/([^/]+)$/
const ALPHA3 = /^[A-Za-z]{3}$/

export function proxy(request: NextRequest) {
  const match = COUNTRY_PATH.exec(request.nextUrl.pathname)
  if (match && !ALPHA3.test(match[1] ?? '')) {
    return NextResponse.rewrite(new URL('/_not-found', request.url), { status: 404 })
  }
  return NextResponse.next()
}

export const config = {
  matcher: '/countries/:id'
}
