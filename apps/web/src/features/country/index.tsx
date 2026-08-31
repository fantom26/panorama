'use client'

import { useState } from 'react'

import Link from 'next/link'
import { useParams } from 'next/navigation'

import {
  Breadcrumbs,
  Button,
  type ColumnDef,
  DataTable,
  LineChart,
  Section,
  Skeleton,
  StatCard,
  Tabs,
  Typography
} from '@repo/ui'

import { useCountry, useCountryHistory } from '@/features/country/hooks/useCountry'
import { assertCountryId, assertFound } from '@/features/country/model/country-not-found'
import { useTranslation } from '@/i18n'
import type { IndicatorValue } from '@/shared/api/statistics-api'
import { CHART_INDICATORS, INDICATOR, type IndicatorId } from '@/shared/model/indicators'
import { slugFromRegion } from '@/shared/model/regions'
import { ROUTES } from '@/shared/routes'
import { useCompareList } from '@/shared/store/compare'
import AppHeader from '@/shared/ui/AppHeader'
import TitleBlock from '@/shared/ui/TitleBlock'
import TitleMeta from '@/shared/ui/TitleMeta'
import {
  formatCompactNumber,
  formatGdp,
  formatIndicatorValue,
  formatNumber,
  formatPercent,
  formatUsd
} from '@/shared/utils/format'

import styles from './index.module.css'

function tileValue(value: number | null, format: (value: number) => string) {
  return value === null ? '—' : format(value)
}

const CHART_TABS = [
  { id: INDICATOR.gdp, labelKey: 'chart.gdp', formatValue: formatGdp },
  { id: INDICATOR.gdpPerCapita, labelKey: 'chart.gdpPerCapita', formatValue: formatUsd },
  { id: INDICATOR.inflation, labelKey: 'chart.inflation', formatValue: formatPercent },
  { id: INDICATOR.unemployment, labelKey: 'chart.unemployment', formatValue: formatPercent }
] as const satisfies readonly {
  id: (typeof CHART_INDICATORS)[number]
  labelKey: string
  formatValue: (value: number) => string
}[]

export default function CountryPage() {
  const { id } = useParams<{ id: string }>()
  assertCountryId(id)

  const { t } = useTranslation('country')
  const { country, stats, indicators, isPending, error } = useCountry(id)
  const compare = useCompareList()
  const inCompare = compare.has(id)
  const [activeIndicator, setActiveIndicator] = useState<IndicatorId>(INDICATOR.gdp)
  const { history, isPending: isHistoryPending } = useCountryHistory(id, activeIndicator)

  assertFound(error)

  const region = country?.region.trim() ?? ''
  const regionSlug = region ? slugFromRegion(region) : undefined
  const activeTab = CHART_TABS.find((tab) => tab.id === activeIndicator) ?? CHART_TABS[0]
  const firstYear = history[0]?.year
  const lastYear = history.at(-1)?.year
  const yearRange =
    firstYear !== undefined && lastYear !== undefined ? `${firstYear}–${lastYear}` : ''

  const indicatorColumns: ColumnDef<IndicatorValue>[] = [
    { accessorKey: 'label', header: t('table.indicator') },
    { accessorKey: 'category', header: t('table.category') },
    {
      accessorKey: 'year',
      header: t('table.year'),
      cell: (info) => info.getValue<number | string | null>() ?? '—'
    },
    {
      accessorKey: 'value',
      header: t('table.value'),
      cell: (info) => {
        const value = info.getValue<number | null>()
        return value === null ? '—' : formatIndicatorValue(value, info.row.original.format)
      }
    }
  ]

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
    <>
      <AppHeader>
        <Breadcrumbs>
          <Link href={ROUTES.home()}>
            <Typography variant='body-sm' color='muted' component='span'>
              {t('breadcrumb.global')}
            </Typography>
          </Link>
          {regionSlug && (
            <Link href={ROUTES.region(regionSlug)}>
              <Typography variant='body-sm' color='muted' component='span'>
                {region}
              </Typography>
            </Link>
          )}
          <Typography variant='body-sm' color='knockout' component='span' aria-current='page'>
            {country?.name ?? id}
          </Typography>
        </Breadcrumbs>
      </AppHeader>

      <TitleBlock className={styles.titleBlock}>
        <div>
          <Typography variant='meta-sm' color='subtle' component='div'>
            {country ? `${country.iso2.toUpperCase()} · ${country.id}` : id}
          </Typography>
          <Typography variant='headline-sm' component='h1'>
            {country?.name ?? id}
          </Typography>
          <TitleMeta>
            <Typography variant='body-sm' color='muted' component='div'>
              {country ? `${region} · ${country.incomeLevel}` : ''}
            </Typography>
          </TitleMeta>
        </div>
        <div className={styles.actions}>
          {inCompare ? (
            <Button variant='outlined' render={<Link href={ROUTES.compare(compare.codes)} />}>
              {t('buttons.inCompare')}
            </Button>
          ) : (
            <Button
              variant='contained'
              disabled={!compare.hydrated || compare.isFull}
              title={compare.isFull ? t('buttons.compareFull') : undefined}
              onClick={() => compare.add(id)}
            >
              {t('buttons.addToCompare')}
            </Button>
          )}
        </div>
      </TitleBlock>

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

      <Section
        title={t('sections.historical', { label: t(activeTab.labelKey), range: yearRange })}
        className={styles.historical}
      >
        <Tabs.Root
          value={activeIndicator}
          onValueChange={(value) => setActiveIndicator(value as IndicatorId)}
        >
          <Tabs.List>
            {CHART_TABS.map((tab) => (
              <Tabs.Tab key={tab.id} value={tab.id}>
                {t(tab.labelKey)}
              </Tabs.Tab>
            ))}
          </Tabs.List>
          <Tabs.Panel value={activeIndicator}>
            {isHistoryPending ? (
              <Skeleton variant='rectangular' width='100%' height={240} />
            ) : (
              <LineChart
                dataset={history}
                xAxis={{ dataKey: 'year' }}
                series={[
                  {
                    dataKey: 'value',
                    label: t(activeTab.labelKey),
                    valueFormatter: activeTab.formatValue
                  }
                ]}
                height={240}
              />
            )}
          </Tabs.Panel>
        </Tabs.Root>
      </Section>

      <Section
        title={t('sections.indicators', { count: indicators.length })}
        className={styles.indicators}
      >
        <DataTable
          state={isPending ? { status: 'loading' } : { status: 'ready', data: indicators }}
          columns={indicatorColumns}
          enablePagination
          enableColumnFilters
          pageSize={8}
        />
      </Section>
    </>
  )
}
