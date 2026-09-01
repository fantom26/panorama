import { afterEach, beforeEach, describe, expect, jest, test } from '@jest/globals'
import { act, renderHook } from '@testing-library/react'

import { THEME_STORAGE_KEY, useTheme } from '@/shared/hooks/useTheme'

function stubMatchMedia(dark: boolean) {
  window.matchMedia = jest.fn((query: string) => ({
    matches: query.includes('dark') ? dark : false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => true
  })) as unknown as typeof window.matchMedia
}

beforeEach(() => {
  localStorage.clear()
  document.documentElement.removeAttribute('data-theme')
})

afterEach(() => {
  Reflect.deleteProperty(window, 'matchMedia')
  jest.restoreAllMocks()
})

describe('useTheme', () => {
  test('defaults to the system preference, resolving via prefers-color-scheme', async () => {
    stubMatchMedia(true)
    const { result } = renderHook(() => useTheme())
    await act(async () => {})

    expect(result.current.preference).toBe('system')
    expect(result.current.resolved).toBe('dark')
    expect(document.documentElement.dataset.theme).toBe('dark')
  })

  test('an explicit preference wins over the system setting and is persisted', async () => {
    stubMatchMedia(true)
    const { result } = renderHook(() => useTheme())
    await act(async () => {})

    act(() => result.current.setPreference('light'))
    await act(async () => {})

    expect(result.current.resolved).toBe('light')
    expect(document.documentElement.dataset.theme).toBe('light')
    expect(JSON.parse(localStorage.getItem(THEME_STORAGE_KEY) as string)).toBe('light')
  })

  test('reads a stored preference on mount', async () => {
    stubMatchMedia(false)
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify('dark'))
    const { result } = renderHook(() => useTheme())
    await act(async () => {})

    expect(result.current.preference).toBe('dark')
    expect(document.documentElement.dataset.theme).toBe('dark')
  })

  test('falls back to system when the stored value is corrupt', async () => {
    stubMatchMedia(false)
    localStorage.setItem(THEME_STORAGE_KEY, '"neon"')
    const { result } = renderHook(() => useTheme())
    await act(async () => {})

    expect(result.current.preference).toBe('system')
    expect(result.current.resolved).toBe('light')
  })
})
