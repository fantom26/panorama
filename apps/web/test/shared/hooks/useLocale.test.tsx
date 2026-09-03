import { afterEach, beforeEach, describe, expect, jest, test } from '@jest/globals'
import { act, renderHook } from '@testing-library/react'

const changeLanguage = jest.fn()
jest.mock('@/i18n', () => ({
  __esModule: true,
  default: {
    language: 'en',
    changeLanguage,
    dir: (code: string) => (code === 'ar' ? 'rtl' : 'ltr')
  }
}))

import LocaleProvider from '@/providers/LocaleProvider'
import { useLocale } from '@/shared/hooks/useLocale'
import type { Locale } from '@/shared/types/locale'
import { LOCALE_COOKIE_KEY } from '@/shared/utils/cookies'

function clearCookies() {
  document.cookie.split(';').forEach((cookie) => {
    const name = cookie.split('=')[0]?.trim()
    if (name) document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`
  })
}

function wrapper(locale: Locale) {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <LocaleProvider locale={locale}>{children}</LocaleProvider>
  }
}

beforeEach(() => {
  clearCookies()
  document.documentElement.removeAttribute('dir')
  document.documentElement.removeAttribute('lang')
  changeLanguage.mockClear()
})

afterEach(() => {
  clearCookies()
})

describe('useLocale', () => {
  test('starts from the value seeded by LocaleProvider (the server-computed locale)', async () => {
    const { result } = renderHook(() => useLocale(), { wrapper: wrapper('ar') })
    await act(async () => {})

    expect(result.current.locale).toBe('ar')
    expect(changeLanguage).toHaveBeenCalledWith('ar')
  })

  test('setLocale persists the choice to a cookie and drives i18next + <html>', async () => {
    const { result } = renderHook(() => useLocale(), { wrapper: wrapper('en') })
    await act(async () => {})

    act(() => result.current.setLocale('ar'))
    await act(async () => {})

    expect(changeLanguage).toHaveBeenCalledWith('ar')
    expect(document.documentElement.dir).toBe('rtl')
    expect(document.documentElement.lang).toBe('ar')
    expect(document.cookie).toContain(`${LOCALE_COOKIE_KEY}=ar`)
  })

  test('throws when used outside LocaleProvider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {})

    expect(() => renderHook(() => useLocale())).toThrow(/LocaleProvider/)

    consoleError.mockRestore()
  })
})
