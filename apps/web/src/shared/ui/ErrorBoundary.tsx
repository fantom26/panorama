'use client'

import { QueryErrorResetBoundary } from '@tanstack/react-query'
import { ErrorBoundary as ReactErrorBoundary, type FallbackProps } from 'react-error-boundary'

import { Button, Typography } from '@repo/ui'

import styles from './ErrorBoundary.module.css'

type ErrorBoundaryProps = {
  children: React.ReactNode
  /** Run alongside the query-cache reset — pass a hook's `refetch` to reload just this widget. */
  onReset?: () => void
}

function Fallback({ error, resetErrorBoundary }: FallbackProps) {
  const message = error instanceof Error ? error.message : String(error)

  return (
    <div role='alert' className={styles.root}>
      <Typography variant='body-sm' component='p'>
        This section could not be loaded.
      </Typography>
      <details className={styles.details}>
        <summary>Details</summary>
        <pre className={styles.message}>{message}</pre>
      </details>
      <Button type='button' variant='contained' onClick={resetErrorBoundary}>
        Retry
      </Button>
    </div>
  )
}

/**
 * Wraps a single data-driven widget. On Retry the React Query error cache is reset (so the
 * widget's failed query refetches) and any `onReset` runs. Keep one boundary per widget so a
 * failed SOTW call degrades just that tile rather than the whole page.
 */
export default function ErrorBoundary({ children, onReset }: ErrorBoundaryProps) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ReactErrorBoundary
          FallbackComponent={Fallback}
          onReset={() => {
            reset()
            onReset?.()
          }}
        >
          {children}
        </ReactErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  )
}
