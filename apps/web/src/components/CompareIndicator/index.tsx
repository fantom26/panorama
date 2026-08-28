'use client'

import Link from 'next/link'

import { Icon, IconButton } from '@repo/ui'

import { useCompareList } from '@/hooks/useCompareList'
import { useTranslation } from '@/i18n'
import { serializeCompareParam } from '@/lib/compare-url'

export default function CompareIndicator() {
  const { t } = useTranslation('global')
  const { codes, count, hydrated } = useCompareList()

  if (!hydrated || count === 0) return null

  return (
    <IconButton
      size='sm'
      aria-label={t('compareIndicator.aria', { count })}
      render={<Link href={`/compare?countries=${serializeCompareParam(codes)}`} />}
    >
      <Icon name='git-compare' />
    </IconButton>
  )
}
