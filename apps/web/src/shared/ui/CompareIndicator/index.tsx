'use client'

import Link from 'next/link'

import { Icon, IconButton } from '@repo/ui'

import { useTranslation } from '@/i18n'
import { ROUTES } from '@/shared/routes'
import { useCompareList } from '@/shared/store/compare'

export default function CompareIndicator() {
  const { t } = useTranslation('global')
  const { codes, count, hydrated } = useCompareList()

  if (!hydrated || count === 0) return null

  return (
    <IconButton
      size='sm'
      aria-label={t('compareIndicator.aria', { count })}
      render={<Link href={ROUTES.compare(codes)} />}
      nativeButton={false}
    >
      <Icon name='git-compare' />
    </IconButton>
  )
}
