'use client'

import { useCallback } from 'react'

import Link from 'next/link'
import { useParams, useRouter, useSearchParams } from 'next/navigation'

import {
  BarChart,
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
import OverviewPageShell from '@/shared/ui/OverviewPageShell'
import StatTiles from '@/shared/ui/StatTiles'
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
    <OverviewPageShell
      homeLabel={t('breadcrumb.global')}
      crumb={t('header.title', { name: title })}
      eyebrow={t('header.eyebrow')}
      title={title}
      subtitle={
        view.meta && (
          <Typography variant='meta-sm' color='muted' component='div'>
            {t('header.meta', { source: view.meta.source, year: view.meta.year })}
          </Typography>
        )
      }
      switcher={
        <Select
          options={indicatorOptions}
          value={indicator}
          onValueChange={(value) => value && router.push(ROUTES.rankings(value, { limit }))}
          aria-label={t('switcher.label')}
        />
      }
      onReset={refetch}
    >
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

      <Section title={t('sections.table', { count: view.rows.length })} className={styles.section}>
        <DataTable
          state={isPending ? { status: 'loading' } : { status: 'ready', data: view.rows }}
          columns={columns}
          enablePagination
          enableColumnFilters
          pageSize={25}
        />
      </Section>
    </OverviewPageShell>
  )
}
