'use client'

import Link from 'next/link'

import { Button, Typography } from '@repo/ui'

import { useTranslation } from '@/i18n'

import styles from './NotFoundView.module.css'

/** Shared 404 body, used by the root and segment-level `not-found.tsx` files. */
export default function NotFoundView() {
  const { t } = useTranslation('common')

  return (
    <main aria-label={t('errors.notFound.pageLabel')} className={styles.root}>
      <Typography variant='display-sm' component='h1'>
        {t('errors.notFound.title')}
      </Typography>
      <Typography variant='body-default' color='muted' component='p'>
        {t('errors.notFound.description')}
      </Typography>
      <Button variant='outlined' render={<Link href='/' />}>
        {t('errors.notFound.backHome')}
      </Button>
    </main>
  )
}
