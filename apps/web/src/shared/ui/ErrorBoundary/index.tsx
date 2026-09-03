'use client'

import { unstable_rethrow } from 'next/navigation'

import { QueryErrorResetBoundary } from '@tanstack/react-query'
import { ErrorBoundary as ReactErrorBoundary, type FallbackProps } from 'react-error-boundary'

import { Button, Typography } from '@repo/ui'

import { useTranslation } from '@/i18n'

import styles from './index.module.css'

type ErrorBoundaryProps = {
  children: React.ReactNode
  onReset?: () => void
}

function Fallback({ error, resetErrorBoundary }: FallbackProps) {
  const { t } = useTranslation('common')

  unstable_rethrow(error)

  const message = error instanceof Error ? error.message : String(error)

  return (
    <div role='alert' className={styles.root}>
      <Typography variant='body-sm' component='p'>
        {t('errors.section.title')}
      </Typography>
      <details className={styles.details}>
        <summary>{t('errors.section.details')}</summary>
        <pre className={styles.message}>{message}</pre>
      </details>
      <Button type='button' variant='contained' onClick={resetErrorBoundary}>
        {t('actions.retry')}
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
