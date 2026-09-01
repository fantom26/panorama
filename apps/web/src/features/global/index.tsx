'use client'

import {
  DonutChart,
  MapLegend,
  RankingList,
  Section,
  Skeleton,
  Typography,
  WorldMap
} from '@repo/ui'

import { useGlobalStats } from '@/features/global/hooks/useGlobalStats'
import { useTranslation } from '@/i18n'
import { useChartHeight } from '@/shared/hooks/useChartHeight'
import { useCountryMapSelect } from '@/shared/hooks/useCountryMapSelect'
import { useMediaQuery } from '@/shared/hooks/useMediaQuery'
import { ROUTES } from '@/shared/routes'
import AppHeader from '@/shared/ui/AppHeader'
import ErrorBoundary from '@/shared/ui/ErrorBoundary'
import SectionLink from '@/shared/ui/SectionLink'
import StatTiles from '@/shared/ui/StatTiles'
import TitleBlock from '@/shared/ui/TitleBlock'
import TitleMeta from '@/shared/ui/TitleMeta'
import { formatGdp, formatPercent } from '@/shared/utils/format'

import styles from './index.module.css'

export default function GlobalOverviewPage() {
  const { t } = useTranslation('global')
  const { overview, isPending, refetch } = useGlobalStats()
  const isTablet = useMediaQuery('(min-width: 768px)')
  const heatmapHeight = useChartHeight({ mobile: 200, tablet: 260, desktop: 340 })
  const donutSize = isTablet ? 160 : 130

  const handleCountrySelect = useCountryMapSelect(overview.countryIdByAlpha2)

  return (
    <>
      <AppHeader>
        <Typography variant='body-sm' component='span' className={styles.pageName}>
          {t('pageName')}
        </Typography>
      </AppHeader>

      <TitleBlock className={styles.titleBlock}>
        <div>
          <Typography variant='meta-sm' color='subtle' component='div'>
            {t('header.eyebrow')}
          </Typography>
          <Typography variant='headline-sm' component='h1'>
            {t('header.title')}
          </Typography>
        </div>
        <TitleMeta className={styles.rightMeta}>
          <Typography variant='body-sm' color='muted' component='div'>
            {t('header.lastSync', { time: '14:02 UTC' })}
          </Typography>
          <Typography variant='body-sm' color='knockout' component='div'>
            {t('header.dataSource')}
          </Typography>
        </TitleMeta>
      </TitleBlock>

      <ErrorBoundary onReset={refetch}>
        <StatTiles
          tiles={overview.tiles}
          labelFor={(key) => t(`tiles.${key}`)}
          loading={isPending}
          columns={4}
        />

        <div className={`${styles.twoColRow} ${styles.heatmapRow}`}>
          <Section
            title={t('sections.gdpHeatmap')}
            className={`${styles.column} ${styles.columnDivided}`}
          >
            <div className={styles.heatmapBody}>
              {isPending ? (
                <>
                  <Skeleton variant='rectangular' width='100%' height={heatmapHeight} />
                  <Skeleton width='100%' />
                </>
              ) : (
                <>
                  <WorldMap
                    data={overview.gdpByCountry}
                    height={heatmapHeight}
                    format={formatGdp}
                    onSelect={handleCountrySelect}
                  />
                  <MapLegend range={overview.gdpRange} />
                </>
              )}
            </div>
          </Section>

          <Section title={t('sections.gdpByRegion')} className={styles.column}>
            {isPending ? (
              <Skeleton variant='rectangular' width='100%' height={220} />
            ) : (
              <RankingList data={overview.gdpByRegion} formatValue={formatGdp} />
            )}
          </Section>
        </div>

        <div className={`${styles.twoColRow} ${styles.evenRow}`}>
          <Section
            title={t('sections.populationByRegion')}
            className={`${styles.column} ${styles.columnDivided}`}
          >
            {isPending ? (
              <Skeleton variant='rectangular' width='100%' height={donutSize} />
            ) : (
              <DonutChart
                data={overview.populationByRegion}
                layout={isTablet ? 'row' : 'column'}
                size={donutSize}
              />
            )}
          </Section>

          <Section title={t('sections.highestInflation')} className={styles.column}>
            {isPending ? (
              <Skeleton variant='rectangular' width='100%' height={220} />
            ) : (
              <>
                <RankingList data={overview.topInflation} formatValue={formatPercent} />
                <SectionLink href={ROUTES.rankings('inflation')}>
                  {t('sections.inflationRanking')}
                </SectionLink>
              </>
            )}
          </Section>
        </div>
      </ErrorBoundary>
    </>
  )
}
