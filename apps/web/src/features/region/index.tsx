'use client'

import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'

import {
  Breadcrumbs,
  RankingList,
  Section,
  Select,
  Skeleton,
  StatCard,
  Typography,
  WorldMap
} from '@repo/ui'

import { useRegionOverview } from '@/features/region/hooks/useRegionOverview'
import { assertRegionSlug } from '@/features/region/model/region-not-found'
import { useTranslation } from '@/i18n'
import { useMediaQuery } from '@/shared/hooks/useMediaQuery'
import { REGION_NAMES, REGION_SLUGS, regionFromSlug } from '@/shared/model/regions'
import type { Alpha2Code } from '@/shared/types/iso'
import AppHeader from '@/shared/ui/AppHeader'
import ErrorBoundary from '@/shared/ui/ErrorBoundary'
import TitleBlock from '@/shared/ui/TitleBlock'
import TitleMeta from '@/shared/ui/TitleMeta'
import { formatCompactNumber, formatCompactUsd, formatGdp, formatUsd } from '@/shared/utils/format'

import styles from './index.module.css'
import type { IncomeBreakdownRow } from './model/region-overview'

const REGION_OPTIONS = REGION_NAMES.map((name) => ({ label: name, value: REGION_SLUGS[name] }))

export default function RegionPage() {
  const { region } = useParams<{ region: string }>()
  assertRegionSlug(region)

  const regionName = regionFromSlug(region)
  const { t } = useTranslation('region')
  const router = useRouter()
  const { overview, isPending, refetch } = useRegionOverview(regionName)

  const isTablet = useMediaQuery('(min-width: 768px)')
  const isDesktop = useMediaQuery('(min-width: 1440px)')
  const mapHeight = isDesktop ? 360 : isTablet ? 280 : 220

  function handleCountrySelect(alpha2: string) {
    const id = overview.countryIdByAlpha2[alpha2.toLowerCase() as Alpha2Code]
    if (id && overview.memberIds.has(id)) router.push(`/countries/${id}`)
  }

  function renderIncomeRow(row: IncomeBreakdownRow) {
    const body = (
      <>
        <span className={styles.incomeName}>
          <Typography variant='body-sm' component='span'>
            {row.level}
          </Typography>
          {row.slug && (
            <Typography variant='meta-sm' color='muted' component='span'>
              /{row.slug}
            </Typography>
          )}
        </span>
        <span className={styles.incomeMetrics}>
          <Typography variant='meta-sm' color='muted' component='span'>
            {t('incomeRow.count', { count: row.count })}
          </Typography>
          <Typography variant='meta-sm' color='muted' component='span'>
            {t('incomeRow.population', { value: formatCompactNumber(row.population) })}
          </Typography>
          <Typography variant='meta-sm' color='muted' component='span'>
            {t('incomeRow.gdp', { value: formatCompactUsd(row.gdp) })}
          </Typography>
        </span>
        <Typography variant='body-sm' color='muted' component='span' aria-hidden='true'>
          →
        </Typography>
      </>
    )

    return row.slug ? (
      <Link key={row.level} href={`/income/${row.slug}`} className={styles.incomeRow}>
        {body}
      </Link>
    ) : (
      <div key={row.level} className={styles.incomeRow}>
        {body}
      </div>
    )
  }

  return (
    <>
      <AppHeader>
        <Breadcrumbs>
          <Link href='/'>
            <Typography variant='body-sm' color='muted' component='span'>
              {t('breadcrumb.global')}
            </Typography>
          </Link>
          <Typography variant='body-sm' color='knockout' component='span' aria-current='page'>
            {regionName}
          </Typography>
        </Breadcrumbs>
      </AppHeader>

      <TitleBlock className={styles.titleBlock}>
        <div>
          <Typography variant='meta-sm' color='subtle' component='div'>
            {t('header.eyebrow')}
          </Typography>
          <Typography variant='headline-sm' component='h1'>
            {regionName}
          </Typography>
        </div>
        <TitleMeta className={styles.rightMeta}>
          <Select
            options={REGION_OPTIONS}
            value={region}
            onValueChange={(value) => router.push(`/region/${value}`)}
            aria-label={t('switcher.label')}
          />
        </TitleMeta>
      </TitleBlock>

      <ErrorBoundary onReset={refetch}>
        <div className={styles.stats}>
          {overview.tiles.map((tile) => (
            <StatCard
              key={tile.key}
              variant='row'
              label={t(`tiles.${tile.key}`)}
              value={tile.value}
              loading={isPending}
            />
          ))}
        </div>

        <div className={styles.twoColRow}>
          <Section
            title={t('sections.regionalMap')}
            className={`${styles.column} ${styles.columnDivided}`}
          >
            <div className={styles.mapBody}>
              <Typography variant='meta-sm' color='muted' component='p' className={styles.hint}>
                {t('sections.regionalMapHint')}
              </Typography>
              {isPending ? (
                <Skeleton variant='rectangular' width='100%' height={mapHeight} />
              ) : (
                <WorldMap
                  mode='lit'
                  highlight={overview.memberAlpha2}
                  disableUnhighlighted
                  format={formatGdp}
                  onSelect={handleCountrySelect}
                  height={mapHeight}
                />
              )}
            </div>
          </Section>

          <Section title={t('sections.incomeLevels')} className={styles.column}>
            {isPending ? (
              <Skeleton variant='rectangular' width='100%' height={mapHeight} />
            ) : (
              <div className={styles.incomeList}>
                {overview.incomeBreakdown.map(renderIncomeRow)}
              </div>
            )}
          </Section>
        </div>

        <Section
          title={t('sections.topEconomies', { region: regionName })}
          className={styles.topEconomies}
        >
          {isPending ? (
            <Skeleton variant='rectangular' width='100%' height={280} />
          ) : (
            <RankingList
              data={overview.topGdpPerCapita}
              formatValue={formatUsd}
              onSelect={(id) => router.push(`/countries/${id}`)}
            />
          )}
        </Section>
      </ErrorBoundary>
    </>
  )
}
