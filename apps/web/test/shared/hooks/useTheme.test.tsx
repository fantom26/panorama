import { afterEach, beforeEach, describe, expect, jest, test } from '@jest/globals'
import { act, renderHook } from '@testing-library/react'

import type { ThemePreference } from '@repo/ui'

import ThemeProvider from '@/providers/ThemeProvider'
import { useTheme } from '@/shared/hooks/useTheme'
import { THEME_COOKIE_KEY } from '@/shared/utils/cookies'

function clearCookies() {
  document.cookie.split(';').forEach((cookie) => {
    const name = cookie.split('=')[0]?.trim()
    if (name) document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`
  })
}

function wrapper(theme: ThemePreference) {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <ThemeProvider theme={theme}>{children}</ThemeProvider>
  }
}

beforeEach(() => {
  clearCookies()
  document.documentElement.removeAttribute('data-theme')
})

afterEach(() => {
  clearCookies()
})

describe('useTheme', () => {
  test('starts from the value seeded by ThemeProvider (the server-computed theme)', async () => {
    const { result } = renderHook(() => useTheme(), { wrapper: wrapper('dark') })
    await act(async () => {})

    expect(result.current.theme).toBe('dark')
  })

  test('setTheme updates the DOM immediately and persists to a cookie', async () => {
    const { result } = renderHook(() => useTheme(), { wrapper: wrapper('light') })
    await act(async () => {})

    act(() => result.current.setTheme('dark'))
    await act(async () => {})

    expect(result.current.theme).toBe('dark')
    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(document.cookie).toContain(`${THEME_COOKIE_KEY}=dark`)
  })

  test('throws when used outside ThemeProvider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {})

    expect(() => renderHook(() => useTheme())).toThrow(/ThemeProvider/)

    consoleError.mockRestore()
  })
})
