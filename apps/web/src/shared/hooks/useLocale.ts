'use client'

import { useEffect, useState } from 'react'

import Cookies from 'js-cookie'

import i18n from '@/i18n'
import { useInitialLocale } from '@/providers/LocaleProvider'
import type { Locale } from '@/shared/types/locale'
import { LOCALE_COOKIE_KEY } from '@/shared/utils/cookies'

export { SUPPORTED_LOCALES } from '@/shared/types/locale'
export type { Locale }

export function useLocale() {
  const initialLocale = useInitialLocale()
  const [locale, setLocaleState] = useState<Locale>(initialLocale)

  useEffect(() => {
    if (i18n.language !== locale) i18n.changeLanguage(locale)
  }, [locale])

  const setLocale = (next: Locale) => {
    setLocaleState(next)
    const root = document.documentElement
    root.lang = next
    root.dir = i18n.dir(next)
    Cookies.set(LOCALE_COOKIE_KEY, next, { expires: 365, path: '/', sameSite: 'lax' })
  }

  return { locale, setLocale }
}
