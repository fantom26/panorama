'use client'

import { useEffect, useState } from 'react'

import { useLocalStorage } from 'usehooks-ts'

import i18n from '@/i18n'

export const SUPPORTED_LOCALES = ['en', 'ar'] as const
export type Locale = (typeof SUPPORTED_LOCALES)[number]

/** Read by the pre-paint script in app/layout.tsx — keep the key in sync. */
export const LOCALE_STORAGE_KEY = 'panorama.locale'

const isLocale = (value: unknown): value is Locale => SUPPORTED_LOCALES.includes(value as Locale)

/**
 * Persisted UI language. The inline script in app/layout.tsx has already set
 * `<html lang>`/`dir` before paint; this hook drives i18next once React is
 * mounted and on every later change. The `mounted` gate keeps the first client
 * render (storage default) from switching the language back to `en`.
 */
export function useLocale() {
  const [stored, setStored] = useLocalStorage<Locale>(LOCALE_STORAGE_KEY, 'en', {
    initializeWithValue: false
  })
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const locale = isLocale(stored) ? stored : 'en'

  useEffect(() => {
    if (!mounted) return
    if (i18n.language !== locale) i18n.changeLanguage(locale)
    const root = document.documentElement
    root.lang = locale
    root.dir = i18n.dir(locale)
  }, [mounted, locale])

  return { locale, setLocale: setStored }
}
