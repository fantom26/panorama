'use client'

import { useEffect } from 'react'

import { Button, Typography } from '@repo/ui'

import { useTranslation } from '@/i18n'

import styles from './error.module.css'

export default function Error({
  error,
  retry
}: {
  error: Error & { digest?: string }
  retry: () => void
}) {
  const { t } = useTranslation('common')

  useEffect(() => {
    // TODO: Sentry.captureException(error)
    console.error(error)
  }, [error])

  return (
    <main aria-label={t('errors.generic.title')} className={styles.root} role='alert'>
      <Typography variant='headline-sm' component='h1'>
        {t('errors.generic.title')}
      </Typography>
      <Typography variant='body-default' color='muted' component='p'>
        {t('errors.generic.description')}
      </Typography>
      <Button type='button' variant='contained' onClick={retry}>
        {t('actions.retry')}
      </Button>
    </main>
  )
}
