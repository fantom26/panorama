import type { Metadata } from 'next'

import { resources } from '@repo/i18n'

import DocumentMeta from '@/shared/ui/DocumentMeta'
import RouteProgress from '@/shared/ui/RouteProgress'

import Providers from './providers'

import '@repo/ui/styles.css'
import './globals.css'

// Server-rendered default; DocumentMeta re-syncs title + description to the active locale.
export const metadata: Metadata = {
  title: resources.en.common.meta.title,
  description: resources.en.common.meta.description
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' data-theme='light'>
      <body className='panorama-normalize'>
        <Providers>
          <DocumentMeta />
          <RouteProgress />
          <div>{children}</div>
        </Providers>
      </body>
    </html>
  )
}
