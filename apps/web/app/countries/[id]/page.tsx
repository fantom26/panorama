'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'

import { Breadcrumbs, Button, StatCard, Typography } from '@repo/ui'

import AppHeader from '@/components/AppHeader'
import { useCountry } from '@/hooks/useCountry'
import { useTranslation } from '@/i18n'
import type { Alpha3Code } from '@/types/iso'
import {
  formatCompactNumber,
  formatGdp,
  formatNumber,
  formatPercent,
  formatUsd
} from '@/utils/format'

import styles from './page.module.css'

function tileValue(value: number | null, format: (value: number) => string) {
  return value === null ? '—' : format(value)
}

export default function CountryPage() {
  const { id } = useParams<{ id: Alpha3Code }>()
  const { t } = useTranslation('country')
  const { country, stats, isPending } = useCountry(id)

  const region = country?.region.trim() ?? ''

  const statTiles = [
    {
      key: 'population',
      label: t('stats.population'),
      value: tileValue(stats?.population ?? null, formatCompactNumber)
    },
    {
      key: 'area',
      label: t('stats.area'),
      value: tileValue(stats?.area ?? null, formatNumber),
      trend: t('stats.areaUnit')
    },
    { key: 'capital', label: t('stats.capital'), value: stats?.capitalCity ?? '—' },
    { key: 'gdp', label: t('stats.gdp'), value: tileValue(stats?.gdp ?? null, formatGdp) },
    {
      key: 'gdpPerCapita',
      label: t('stats.gdpPerCapita'),
      value: tileValue(stats?.gdpPerCapita ?? null, formatUsd)
    },
    {
      key: 'inflation',
      label: t('stats.inflation'),
      value: tileValue(stats?.inflation ?? null, formatPercent)
    },
    {
      key: 'unemployment',
      label: t('stats.unemployment'),
      value: tileValue(stats?.unemployment ?? null, formatPercent)
    }
  ] as const

  return (
    <div className={styles.page}>
      <AppHeader>
        <Breadcrumbs>
          <Link href='/'>
            <Typography variant='body-sm' color='muted' component='span'>
              {t('breadcrumb.global')}
            </Typography>
          </Link>
          {region && (
            <Typography variant='body-sm' color='muted' component='span'>
              {region}
            </Typography>
          )}
          <Typography variant='body-sm' color='knockout' component='span' aria-current='page'>
            {country?.name ?? id}
          </Typography>
        </Breadcrumbs>
      </AppHeader>

      <div className={styles.titleBlock}>
        <div>
          <Typography variant='meta-sm' color='subtle' component='div'>
            {country ? `${country.iso2.toUpperCase()} · ${country.id}` : id}
          </Typography>
          <Typography variant='headline-sm' component='h1'>
            {country?.name ?? id}
          </Typography>
          <div className={styles.titleMeta}>
            <Typography variant='body-sm' color='muted' component='div'>
              {country ? `${region} · ${country.incomeLevel}` : ''}
            </Typography>
          </div>
        </div>
        <div className={styles.actions}>
          <Button variant='outlined' disabled>
            {t('buttons.back', { region: region || t('breadcrumb.global') })}
          </Button>
          <Button variant='contained' disabled>
            {t('buttons.addToCompare')}
          </Button>
        </div>
      </div>

      <div className={styles.stats}>
        {statTiles.map((tile) => (
          <StatCard
            key={tile.key}
            variant='row'
            label={tile.label}
            value={tile.value}
            trend={'trend' in tile ? tile.trend : undefined}
            loading={isPending}
          />
        ))}
      </div>
    </div>
  )
}
