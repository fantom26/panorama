'use client'

import { useEffect } from 'react'

/**
 * Replaces the root layout when the layout itself throws, so nothing from the app is
 * available here — no providers, no i18n runtime (which may be exactly what failed), no
 * design tokens. Copy is intentionally hardcoded English; styling is inline.
 */
export default function GlobalError({
  error,
  retry
}: {
  error: Error & { digest?: string }
  retry: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  const doc = typeof document === 'undefined' ? null : document.documentElement
  const lang = doc?.lang || 'en'
  const dir = doc?.dir || 'ltr'

  return (
    <html lang={lang} dir={dir}>
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          padding: '2rem',
          fontFamily: 'system-ui, sans-serif',
          textAlign: 'center',
          background: '#fff',
          color: '#1a1a1a'
        }}
      >
        <title>Something went wrong</title>
        <style>{`
          @media (prefers-color-scheme: dark) {
            body { background: #1a1a1a !important; color: #f5f5f5 !important; }
            button { background: #f5f5f5 !important; color: #1a1a1a !important; }
          }
          button {
            font: inherit;
            padding: 0.5rem 1rem;
            border: 0;
            border-radius: 6px;
            background: #1a1a1a;
            color: #fff;
            cursor: pointer;
          }
        `}</style>
        <h1 style={{ margin: 0, fontSize: '1.25rem' }}>Something went wrong</h1>
        <p style={{ margin: 0, opacity: 0.7 }}>
          The application hit an unexpected error. Reloading may fix it.
        </p>
        <button type='button' onClick={retry}>
          Try again
        </button>
      </body>
    </html>
  )
}
