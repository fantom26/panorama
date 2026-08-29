'use client'

import { QueryErrorResetBoundary } from '@tanstack/react-query'
import { ErrorBoundary as ReactErrorBoundary, type FallbackProps } from 'react-error-boundary'

import { Button, Typography } from '@repo/ui'

import styles from './ErrorBoundary.module.css'

type ErrorBoundaryProps = {
  children: React.ReactNode
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
