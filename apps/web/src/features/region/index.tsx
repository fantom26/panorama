'use client'

import Link from 'next/link'
import { useParams, useRouter, useSearchParams } from 'next/navigation'

import { RankingList, Section, Select, Skeleton, Typography, WorldMap } from '@repo/ui'

import { useRegionOverview } from '@/features/region/hooks/useRegionOverview'
import { assertRegionSlug } from '@/features/region/model/region-not-found'
import { useTranslation } from '@/i18n'
import { useChartHeight } from '@/shared/hooks/useChartHeight'
import { useCountryMapSelect } from '@/shared/hooks/useCountryMapSelect'
import { levelFromSlug, slugFromLevel } from '@/shared/model/income-levels'
import { REGION_NAMES, REGION_SLUGS, regionFromSlug } from '@/shared/model/regions'
import { ROUTES } from '@/shared/routes'
import BreakdownList from '@/shared/ui/BreakdownList'
import OverviewPageShell from '@/shared/ui/OverviewPageShell'
import SectionLink from '@/shared/ui/SectionLink'
import StatTiles from '@/shared/ui/StatTiles'
import { formatCompactNumber, formatCompactUsd, formatGdp, formatUsd } from '@/shared/utils/format'

import styles from './index.module.css'

const REGION_OPTIONS = REGION_NAMES.map((name) => ({ label: name, value: REGION_SLUGS[name] }))

export default function RegionPage() {
  const { region } = useParams<{ region: string }>()
  assertRegionSlug(region)

  const regionName = regionFromSlug(region)
  const { t } = useTranslation('region')
  const router = useRouter()
  const searchParams = useSearchParams()

  const levelName = levelFromSlug(searchParams.get('level') ?? '')
  const levelSlug = levelName ? slugFromLevel(levelName) : undefined

  const { overview, isPending, refetch } = useRegionOverview(regionName, levelName)

  const mapHeight = useChartHeight({ mobile: 220, tablet: 280, desktop: 360 })

  const handleCountrySelect = useCountryMapSelect(overview.countryIdByAlpha2, overview.memberIds)

  const incomeRows = overview.incomeBreakdown.map((row) => ({
    key: row.level,
    label: row.level,
    sublabel: row.slug ? `/${row.slug}` : undefined,
    href: row.slug ? ROUTES.incomeLevel(row.slug, { region }) : undefined,
    metrics: [
      t('incomeRow.count', { count: row.count }),
      t('incomeRow.population', { value: formatCompactNumber(row.population) }),
      t('incomeRow.gdp', { value: formatCompactUsd(row.gdp) })
    ]
  }))

  return (
    <OverviewPageShell
      homeLabel={t('breadcrumb.global')}
      crumb={regionName}
      eyebrow={t('header.eyebrow')}
      title={regionName}
      subtitle={
        levelName && (
          <div className={styles.filterNote}>
            <Typography variant='meta-sm' color='muted' component='span'>
              {t('filter.activeBy', { name: levelName })}
            </Typography>{' '}
            <Link href={ROUTES.region(region)} className={styles.filterClear}>
              <Typography variant='meta-sm' component='span'>
                {t('filter.clear')}
              </Typography>
            </Link>
          </div>
        )
      }
      switcher={
        <Select
          options={REGION_OPTIONS}
          value={region}
          onValueChange={(value) =>
            value && router.push(ROUTES.region(value, { level: levelSlug }))
          }
          aria-label={t('switcher.label')}
        />
      }
      onReset={refetch}
    >
      <StatTiles
        tiles={overview.tiles}
        labelFor={(key) => t(`tiles.${key}`)}
        loading={isPending}
        columns={5}
      />

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
            <BreakdownList rows={incomeRows} />
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
          <>
            <RankingList
              data={overview.topGdpPerCapita}
              formatValue={formatUsd}
              onSelect={(id) => router.push(ROUTES.country(id))}
            />
            <SectionLink href={ROUTES.rankings('gdp-per-capita')}>
              {t('sections.globalRanking')}
            </SectionLink>
          </>
        )}
      </Section>
    </OverviewPageShell>
  )
}
