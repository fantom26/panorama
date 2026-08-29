import type { Metadata } from 'next'

import RouteProgress from '@/shared/ui/RouteProgress'

import Providers from './providers'

import '@repo/ui/styles.css'
import './globals.css'

export const metadata: Metadata = {
  title: 'Panorama',
  description:
    'Global drill-down finance dashboard — country statistics, rankings and comparisons from the Statistics of the World API.'
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
          <RouteProgress />
          <div>{children}</div>
        </Providers>
      </body>
    </html>
  )
}
