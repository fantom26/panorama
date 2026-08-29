'use client'

import Link from 'next/link'

import { useTranslation } from '@/i18n'

export default function NotFound() {
  const { t } = useTranslation('common')

  return (
    <main aria-label={t('errors.notFound.pageLabel')}>
      <h1>{t('errors.notFound.title')}</h1>
      <p>{t('errors.notFound.description')}</p>
      <Link href='/'>{t('errors.notFound.backHome')}</Link>
    </main>
  )
}
