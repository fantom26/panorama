'use client'

import { useTranslation } from '@/i18n'

export default function Error({ reset }: { error: Error; reset: () => void }) {
  const { t } = useTranslation('common')

  return (
    <main aria-label={t('errors.generic.title')}>
      <h1>{t('errors.generic.title')}</h1>
      <p>{t('errors.generic.description')}</p>
      <button type='button' onClick={reset}>
        {t('actions.retry')}
      </button>
    </main>
  )
}
