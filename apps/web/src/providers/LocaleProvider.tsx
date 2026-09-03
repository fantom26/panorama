'use client'

import { createContext, useContext } from 'react'

import type { Locale } from '@/shared/types/locale'

const LocaleContext = createContext<Locale | null>(null)

export function useInitialLocale(): Locale {
  const value = useContext(LocaleContext)
  if (!value) throw new Error('useInitialLocale must be used within LocaleProvider')
  return value
}

export default function LocaleProvider({
  locale,
  children
}: {
  locale: Locale
  children: React.ReactNode
}) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>
}
