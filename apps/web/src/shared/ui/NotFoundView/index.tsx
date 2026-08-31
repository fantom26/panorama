'use client'

import Link from 'next/link'

import { Button, Typography } from '@repo/ui'

import { useTranslation } from '@/i18n'

import styles from './index.module.css'

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
      <Button variant='outlined' render={<Link href='/' />} nativeButton={false}>
        {t('errors.notFound.backHome')}
      </Button>
    </main>
  )
}
