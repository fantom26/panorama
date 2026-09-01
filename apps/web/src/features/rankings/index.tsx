'use client'

import { useCallback } from 'react'

import Link from 'next/link'
import { useParams, useRouter, useSearchParams } from 'next/navigation'

import {
  BarChart,
  Breadcrumbs,
  type ColumnDef,
  DataTable,
  Flag,
  Section,
  Select,
  Skeleton,
  Typography
} from '@repo/ui'

import { useRankingView } from '@/features/rankings/hooks/useRankingView'
import { assertRankingSlug } from '@/features/rankings/model/ranking-not-found'
import { parseLimit, type RankingTableRow } from '@/features/rankings/model/ranking-view'
import { useTranslation } from '@/i18n'
import { useChartHeight } from '@/shared/hooks/useChartHeight'
import { indicatorFromSlug, RANKING_SLUGS } from '@/shared/model/ranking-indicators'
import { ROUTES } from '@/shared/routes'
import AppHeader from '@/shared/ui/AppHeader'
import ErrorBoundary from '@/shared/ui/ErrorBoundary'
import StatTiles from '@/shared/ui/StatTiles'
import TitleBlock from '@/shared/ui/TitleBlock'
import TitleMeta from '@/shared/ui/TitleMeta'
import { formatIndicatorValue, formatIndicatorValueCompact } from '@/shared/utils/format'

import styles from './index.module.css'

export default function RankingsPage() {
  const { indicator } = useParams<{ indicator: string }>()
  assertRankingSlug(indicator)

  const { t } = useTranslation('rankings')
  const router = useRouter()
  const searchParams = useSearchParams()

  const limit = parseLimit(searchParams.get('limit'))
  const { view, isPending, refetch } = useRankingView(indicatorFromSlug(indicator), limit)

  const chartHeight = useChartHeight({ mobile: 320, tablet: 420, desktop: 480 })

  const format = view.meta?.format ?? 'number'
  const title = view.meta?.label ?? t(`indicators.${indicator}`)

  const formatBarValue = useCallback(
    (value: number) => formatIndicatorValueCompact(value, format),
    [format]
  )
  const handleSelect = useCallback((id: string) => router.push(ROUTES.country(id)), [router])

  const columns: ColumnDef<RankingTableRow>[] = [
    { accessorKey: 'rank', header: t('table.rank'), enableColumnFilter: false },
    {
      accessorKey: 'country',
      header: t('table.country'),
      cell: (info) => {
        const { id, iso2, country } = info.row.original
        return (
          <Link href={ROUTES.country(id)} className={styles.countryCell}>
            {iso2 && <Flag code={iso2} />}
            {country}
          </Link>
        )
      }
    },
    {
      accessorKey: 'value',
      header: t('table.value'),
      enableColumnFilter: false,
      cell: (info) => formatIndicatorValue(info.getValue<number>(), format)
    },
    { accessorKey: 'year', header: t('table.year'), enableColumnFilter: false }
  ]

  const indicatorOptions = RANKING_SLUGS.map((slug) => ({
    label: t(`indicators.${slug}`),
    value: slug
  }))

  return (
    <>
      <AppHeader>
        <Breadcrumbs>
          <Link href={ROUTES.home()}>
            <Typography variant='body-sm' color='muted' component='span'>
              {t('breadcrumb.global')}
            </Typography>
          </Link>
          <Typography variant='body-sm' color='knockout' component='span' aria-current='page'>
            {t('header.title', { name: title })}
          </Typography>
        </Breadcrumbs>
      </AppHeader>

      <TitleBlock className={styles.titleBlock}>
        <div>
          <Typography variant='meta-sm' color='subtle' component='div'>
            {t('header.eyebrow')}
          </Typography>
          <Typography variant='headline-sm' component='h1'>
            {title}
          </Typography>
          {view.meta && (
            <Typography variant='meta-sm' color='muted' component='div'>
              {t('header.meta', { source: view.meta.source, year: view.meta.year })}
            </Typography>
          )}
        </div>
        <TitleMeta className={styles.rightMeta}>
          <Select
            options={indicatorOptions}
            value={indicator}
            onValueChange={(value) => value && router.push(ROUTES.rankings(value, { limit }))}
            aria-label={t('switcher.label')}
          />
        </TitleMeta>
      </TitleBlock>

      <ErrorBoundary onReset={refetch}>
        <StatTiles
          tiles={view.tiles}
          labelFor={(key) => t(`tiles.${key}`)}
          loading={isPending}
          columns={4}
        />

        <Section title={t('sections.top', { count: view.bars.length })} className={styles.section}>
          {isPending ? (
            <Skeleton variant='rectangular' width='100%' height={chartHeight} />
          ) : (
            <BarChart
              data={view.bars}
              formatValue={formatBarValue}
              onSelect={handleSelect}
              height={chartHeight}
            />
          )}
        </Section>

        <Section
          title={t('sections.table', { count: view.rows.length })}
          className={styles.section}
        >
          <DataTable
            state={isPending ? { status: 'loading' } : { status: 'ready', data: view.rows }}
            columns={columns}
            enablePagination
            enableColumnFilters
            pageSize={25}
          />
        </Section>
      </ErrorBoundary>
    </>
  )
}
