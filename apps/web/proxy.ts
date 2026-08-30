import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { alpha3Schema } from '@/shared/api/schemas'

export function proxy(request: NextRequest) {
  const id = request.nextUrl.pathname.split('/').pop()

  if (!alpha3Schema.safeParse(id).success) {
    return NextResponse.rewrite(new URL('/_not-found', request.url), { status: 404 })
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/countries/:id'
}
