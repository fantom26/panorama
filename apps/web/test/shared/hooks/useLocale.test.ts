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

import { LOCALE_STORAGE_KEY, useLocale } from '@/shared/hooks/useLocale'

beforeEach(() => {
  localStorage.clear()
  document.documentElement.removeAttribute('dir')
  document.documentElement.removeAttribute('lang')
  changeLanguage.mockClear()
})

afterEach(() => {
  jest.restoreAllMocks()
})

describe('useLocale', () => {
  test('defaults to en / ltr', async () => {
    const { result } = renderHook(() => useLocale())
    await act(async () => {})

    expect(result.current.locale).toBe('en')
    expect(document.documentElement.dir).toBe('ltr')
    expect(document.documentElement.lang).toBe('en')
  })

  test('setLocale persists the choice and drives i18next + <html>', async () => {
    const { result } = renderHook(() => useLocale())
    await act(async () => {})

    act(() => result.current.setLocale('ar'))
    await act(async () => {})

    expect(changeLanguage).toHaveBeenCalledWith('ar')
    expect(document.documentElement.dir).toBe('rtl')
    expect(document.documentElement.lang).toBe('ar')
    expect(JSON.parse(localStorage.getItem(LOCALE_STORAGE_KEY) as string)).toBe('ar')
  })

  test('applies a stored locale on mount', async () => {
    localStorage.setItem(LOCALE_STORAGE_KEY, JSON.stringify('ar'))
    const { result } = renderHook(() => useLocale())
    await act(async () => {})

    expect(result.current.locale).toBe('ar')
    expect(document.documentElement.dir).toBe('rtl')
  })

  test('ignores an unsupported stored locale', async () => {
    localStorage.setItem(LOCALE_STORAGE_KEY, JSON.stringify('uk'))
    const { result } = renderHook(() => useLocale())
    await act(async () => {})

    expect(result.current.locale).toBe('en')
  })
})
