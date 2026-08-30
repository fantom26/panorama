import { describe, expect, jest, test } from '@jest/globals'

const mockNotFound = jest.fn(() => {
  throw new Error('NEXT_NOT_FOUND')
})

jest.mock('next/navigation', () => ({ notFound: mockNotFound }))

import { StatisticsApiError } from '@/shared/api/statistics-api'

import { assertCountryId, assertFound } from './country-not-found'

describe('assertCountryId', () => {
  test.each(['DEU', 'deu', 'usa'])('accepts a well-formed alpha-3 code (%s)', (id) => {
    expect(() => assertCountryId(id)).not.toThrow()
    expect(mockNotFound).not.toHaveBeenCalled()
  })

  test.each(['de', 'deutschland', '12', 'd3u', ''])(
    'triggers notFound() for a malformed id (%p)',
    (id) => {
      expect(() => assertCountryId(id)).toThrow('NEXT_NOT_FOUND')
      expect(mockNotFound).toHaveBeenCalledTimes(1)
    }
  )
})

describe('assertFound', () => {
  test('triggers notFound() for a 404 from the Statistics API', () => {
    expect(() => assertFound(new StatisticsApiError(404, '/api/v1/countries/ZZZ'))).toThrow(
      'NEXT_NOT_FOUND'
    )
    expect(mockNotFound).toHaveBeenCalledTimes(1)
  })

  test('ignores no error, non-404 API errors, and generic errors', () => {
    assertFound(undefined)
    assertFound(new StatisticsApiError(500, '/api/v1/countries/DEU'))
    assertFound(new Error('network down'))

    expect(mockNotFound).not.toHaveBeenCalled()
  })
})
