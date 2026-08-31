import { describe, expect, jest, test } from '@jest/globals'

const mockNotFound = jest.fn(() => {
  throw new Error('NEXT_NOT_FOUND')
})

jest.mock('next/navigation', () => ({ notFound: mockNotFound }))

import { assertIncomeSlug } from '@/features/income/model/income-not-found'

describe('assertIncomeSlug', () => {
  test.each(['high', 'upper-middle', 'lower-middle', 'low'])(
    'accepts a known income slug (%s)',
    (slug) => {
      expect(() => assertIncomeSlug(slug)).not.toThrow()
      expect(mockNotFound).not.toHaveBeenCalled()
    }
  )

  test.each(['middle', 'High income', 'rich', ''])(
    'triggers notFound() for an unknown slug (%p)',
    (slug) => {
      expect(() => assertIncomeSlug(slug)).toThrow('NEXT_NOT_FOUND')
      expect(mockNotFound).toHaveBeenCalledTimes(1)
    }
  )
})
