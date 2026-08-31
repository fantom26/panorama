import { describe, expect, jest, test } from '@jest/globals'
import { renderHook } from '@testing-library/react'

const mockPush = jest.fn()
// Next's app-router `useRouter()` returns a stable reference; mirror that here.
const mockRouter = { push: mockPush }
jest.mock('next/navigation', () => ({ useRouter: () => mockRouter }))

import { useCountryMapSelect } from '@/shared/hooks/useCountryMapSelect'
import type { Alpha2Code, Alpha3Code } from '@/shared/types/iso'

const idByAlpha2 = { de: 'DEU', fr: 'FRA' } as Partial<Record<Alpha2Code, Alpha3Code>>

describe('useCountryMapSelect', () => {
  test('navigates to the country for a known alpha-2 (case-insensitive)', () => {
    const { result } = renderHook(() => useCountryMapSelect(idByAlpha2))
    result.current('DE')
    expect(mockPush).toHaveBeenCalledWith('/countries/DEU')
  })

  test('does nothing for an unknown alpha-2', () => {
    const { result } = renderHook(() => useCountryMapSelect(idByAlpha2))
    result.current('us')
    expect(mockPush).not.toHaveBeenCalled()
  })

  test('respects the in-scope set', () => {
    const { result } = renderHook(() => useCountryMapSelect(idByAlpha2, new Set(['DEU'])))
    result.current('fr')
    expect(mockPush).not.toHaveBeenCalled()
    result.current('de')
    expect(mockPush).toHaveBeenCalledWith('/countries/DEU')
  })

  test('returns a stable callback across renders with a fresh map object', () => {
    const { result, rerender } = renderHook(({ map }) => useCountryMapSelect(map), {
      initialProps: { map: { ...idByAlpha2 } }
    })
    const first = result.current
    rerender({ map: { ...idByAlpha2 } })
    expect(result.current).toBe(first)
    result.current('fr')
    expect(mockPush).toHaveBeenCalledWith('/countries/FRA')
  })
})
