import { describe, expect, jest, test } from '@jest/globals'

const mockNotFound = jest.fn(() => {
  throw new Error('NEXT_NOT_FOUND')
})

jest.mock('next/navigation', () => ({ notFound: mockNotFound }))

import { assertRegionSlug } from '@/features/region/model/region-not-found'

describe('assertRegionSlug', () => {
  test.each(['europe-central-asia', 'north-america', 'sub-saharan-africa', 'south-asia'])(
    'accepts a known region slug (%s)',
    (slug) => {
      expect(() => assertRegionSlug(slug)).not.toThrow()
      expect(mockNotFound).not.toHaveBeenCalled()
    }
  )

  test.each(['mars', 'Europe & Central Asia', 'global', ''])(
    'triggers notFound() for an unknown slug (%p)',
    (slug) => {
      expect(() => assertRegionSlug(slug)).toThrow('NEXT_NOT_FOUND')
      expect(mockNotFound).toHaveBeenCalledTimes(1)
    }
  )
})
