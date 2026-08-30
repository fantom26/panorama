import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { alpha3Schema } from '@/shared/api/schemas'
import { regionFromSlug } from '@/shared/model/regions'

// `notFound()` thrown during an initial (non-navigation) render on Next 16.3 emits a blank
// document with a 404 status rather than the not-found boundary, so malformed dynamic
// segments are caught here and rewritten to the rendered not-found route instead.
function notFound(request: NextRequest) {
  return NextResponse.rewrite(new URL('/_not-found', request.url), { status: 404 })
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const segment = pathname.split('/').pop()

  if (pathname.startsWith('/region/')) {
    return segment && regionFromSlug(segment) ? NextResponse.next() : notFound(request)
  }

  if (!alpha3Schema.safeParse(segment).success) {
    return notFound(request)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/countries/:id', '/region/:region']
}
