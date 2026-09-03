import { describe, expect, jest, test } from '@jest/globals'
import { renderHook } from '@testing-library/react'

const useDashboardCountries = jest.fn()

jest.mock('@/shared/hooks/useDashboardCountries', () => ({
  useDashboardCountries: (opts?: unknown) => useDashboardCountries(opts)
}))

import { useDashboardOverview } from '@/shared/hooks/useDashboardOverview'

describe('useDashboardOverview', () => {
  test('runs the selector over the dashboard countries and forwards query state', () => {
    const refetch = jest.fn()
    useDashboardCountries.mockReturnValue({
      countries: [{ id: 'DEU' }, { id: 'FRA' }],
      isPending: false,
      refetch
    })

    const select = jest.fn((countries: { id: string }[]) => countries.map((c) => c.id))
    const { result } = renderHook(() => useDashboardOverview(select))

    expect(useDashboardCountries).toHaveBeenCalledWith({ throwOnError: true })
    expect(select).toHaveBeenCalledWith([{ id: 'DEU' }, { id: 'FRA' }])
    expect(result.current).toEqual({ overview: ['DEU', 'FRA'], isPending: false, refetch })
  })
})
