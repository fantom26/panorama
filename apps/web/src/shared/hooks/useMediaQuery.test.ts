import { afterEach, describe, expect, jest, test } from '@jest/globals'
import { act, renderHook } from '@testing-library/react'

import { useMediaQuery } from './useMediaQuery'

type ChangeListener = (event: Pick<MediaQueryListEvent, 'matches'>) => void

/** jsdom has no `window.matchMedia`; install a controllable stub. */
function stubMatchMedia(initialMatches: boolean) {
  const listeners = new Set<ChangeListener>()
  let matches = initialMatches

  const mql = {
    get matches() {
      return matches
    },
    media: '',
    onchange: null,
    addEventListener: (_type: 'change', listener: ChangeListener) => listeners.add(listener),
    removeEventListener: (_type: 'change', listener: ChangeListener) => listeners.delete(listener),
    addListener: (listener: ChangeListener) => listeners.add(listener),
    removeListener: (listener: ChangeListener) => listeners.delete(listener),
    dispatchEvent: () => true
  }

  const matchMedia = jest.fn((query: string) => {
    mql.media = query
    return mql as unknown as MediaQueryList
  })
  window.matchMedia = matchMedia as unknown as typeof window.matchMedia

  return {
    matchMedia,
    setMatches(next: boolean) {
      matches = next
      listeners.forEach((listener) => listener({ matches: next }))
    }
  }
}

afterEach(() => {
  Reflect.deleteProperty(window, 'matchMedia')
  jest.restoreAllMocks()
})

describe('useMediaQuery', () => {
  test('renders false first (SSR-safe), then syncs to the real match on mount', () => {
    stubMatchMedia(true)

    const seen: boolean[] = []
    renderHook(() => {
      const value = useMediaQuery('(min-width: 768px)')
      seen.push(value)
      return value
    })

    expect(seen[0]).toBe(false)
    expect(seen.at(-1)).toBe(true)
  })

  test('updates when the media query list emits a change event', () => {
    const { setMatches } = stubMatchMedia(false)

    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'))
    expect(result.current).toBe(false)

    act(() => setMatches(true))
    expect(result.current).toBe(true)

    act(() => setMatches(false))
    expect(result.current).toBe(false)
  })
})
