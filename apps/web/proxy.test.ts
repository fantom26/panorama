/**
 * @jest-environment node
 */
import type { NextRequest } from 'next/server'

import { describe, expect, test } from '@jest/globals'

import { proxy } from './proxy'

const request = (path: string) =>
  ({ nextUrl: new URL(`http://localhost${path}`), url: `http://localhost${path}` }) as NextRequest

describe('proxy', () => {
  test.each(['/countries/de', '/countries/deutschland', '/countries/d3u', '/countries/1'])(
    'rewrites a malformed country id (%s) to the not-found route with a 404',
    (path) => {
      const response = proxy(request(path))
      expect(response.status).toBe(404)
      expect(response.headers.get('x-middleware-rewrite')).toContain('/_not-found')
    }
  )

  test.each(['/countries/DEU', '/countries/deu'])(
    'passes a well-formed code through (%s)',
    (path) => {
      const response = proxy(request(path))
      expect(response.headers.get('x-middleware-next')).toBe('1')
    }
  )
})
