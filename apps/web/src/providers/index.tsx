'use client'

import type { ThemePreference } from '@repo/ui'

import LocaleProvider from '@/providers/LocaleProvider'
import QueryProvider from '@/providers/QueryProvider'
import ThemeProvider from '@/providers/ThemeProvider'
import type { Locale } from '@/shared/types/locale'

export default function Providers({
  theme,
  locale,
  children
}: {
  theme: ThemePreference
  locale: Locale
  children: React.ReactNode
}) {
  return (
    <ThemeProvider theme={theme}>
      <LocaleProvider locale={locale}>
        <QueryProvider>{children}</QueryProvider>
      </LocaleProvider>
    </ThemeProvider>
  )
}
