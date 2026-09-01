import type { Metadata } from 'next'

import { resources } from '@repo/i18n'

import DocumentMeta from '@/shared/ui/DocumentMeta'
import RouteProgress from '@/shared/ui/RouteProgress'

import Providers from './providers'

import '@repo/ui/styles.css'
import './globals.css'

export const metadata: Metadata = {
  title: 'Panorama',
  description: resources.en.common.meta.description
}

// Runs before first paint so a persisted theme/locale is applied without a flash.
// Keep the storage keys in sync with useTheme.ts / useLocale.ts. Values are written
// by usehooks-ts' useLocalStorage, which JSON-encodes them (so "dark" is stored as
// the 6-char string `"dark"`).
const PRE_PAINT_SCRIPT = `(function(){try{
var d=document.documentElement;
var read=function(k){try{return JSON.parse(localStorage.getItem(k))}catch(e){return null}};
var t=read('panorama.theme')||'system';
var dark=t==='dark'||(t!=='light'&&matchMedia('(prefers-color-scheme: dark)').matches);
d.dataset.theme=dark?'dark':'light';
if(read('panorama.locale')==='ar'){d.lang='ar';d.dir='rtl';}
}catch(e){}})()`

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' dir='ltr' data-theme='light' suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: PRE_PAINT_SCRIPT }} />
      </head>
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
