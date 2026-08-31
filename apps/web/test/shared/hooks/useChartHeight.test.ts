import { afterEach, describe, expect, jest, test } from '@jest/globals'
import { renderHook } from '@testing-library/react'

import { useChartHeight } from '@/shared/hooks/useChartHeight'

/** jsdom has no `matchMedia`; stub it so `matches` is driven per-query. */
function stubMatchMedia(matchesByQuery: Record<string, boolean>) {
  window.matchMedia = jest.fn((query: string) => ({
    matches: matchesByQuery[query] ?? false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => true
  })) as unknown as typeof window.matchMedia
}

afterEach(() => {
  Reflect.deleteProperty(window, 'matchMedia')
  jest.restoreAllMocks()
})

const SIZES = { mobile: 220, tablet: 280, desktop: 360 }

describe('useChartHeight', () => {
  test('mobile-first before mount (no media match)', () => {
    stubMatchMedia({})
    const { result } = renderHook(() => useChartHeight(SIZES))
    expect(result.current).toBe(220)
  })

  test('tablet when only the 768px query matches', () => {
    stubMatchMedia({ '(min-width: 768px)': true })
    const { result } = renderHook(() => useChartHeight(SIZES))
    expect(result.current).toBe(280)
  })

  test('desktop when the 1440px query matches', () => {
    stubMatchMedia({ '(min-width: 768px)': true, '(min-width: 1440px)': true })
    const { result } = renderHook(() => useChartHeight(SIZES))
    expect(result.current).toBe(360)
  })
})
