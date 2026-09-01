import { describe, expect, jest, test } from '@jest/globals'

const mockNotFound = jest.fn(() => {
  throw new Error('NEXT_NOT_FOUND')
})

jest.mock('next/navigation', () => ({ notFound: mockNotFound }))

import { assertRankingSlug } from '@/features/rankings/model/ranking-not-found'

describe('assertRankingSlug', () => {
  test.each(['population', 'gdp', 'gdp-per-capita', 'inflation', 'unemployment', 'area'])(
    'accepts a known ranking slug (%s)',
    (slug) => {
      expect(() => assertRankingSlug(slug)).not.toThrow()
      expect(mockNotFound).not.toHaveBeenCalled()
    }
  )

  test.each(['gdpPerCapita', 'IMF.NGDPD', 'GDP', ''])(
    'triggers notFound() for an unknown slug (%p)',
    (slug) => {
      expect(() => assertRankingSlug(slug)).toThrow('NEXT_NOT_FOUND')
      expect(mockNotFound).toHaveBeenCalledTimes(1)
    }
  )
})
