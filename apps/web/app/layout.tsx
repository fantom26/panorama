import { cookies } from 'next/headers'

import type { Metadata } from 'next'

import { resources } from '@repo/i18n'

import Providers from '@/providers'
import DocumentMeta from '@/shared/ui/DocumentMeta'
import RouteProgress from '@/shared/ui/RouteProgress'
import { LOCALE_COOKIE_KEY, THEME_COOKIE_KEY } from '@/shared/utils/cookies'

import '@repo/ui/styles.css'
import './globals.css'

export const metadata: Metadata = {
  title: 'Panorama',
  description: resources.en.common.meta.description
}

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const cookieStore = await cookies()
  const theme = cookieStore.get(THEME_COOKIE_KEY)?.value === 'dark' ? 'dark' : 'light'
  const locale = cookieStore.get(LOCALE_COOKIE_KEY)?.value === 'ar' ? 'ar' : 'en'
  const dir = locale === 'ar' ? 'rtl' : 'ltr'

  return (
    <html lang={locale} dir={dir} data-theme={theme}>
      <body className='panorama-normalize'>
        <Providers theme={theme} locale={locale}>
          <DocumentMeta />
          <RouteProgress />
          <div>{children}</div>
        </Providers>
      </body>
    </html>
  )
}
