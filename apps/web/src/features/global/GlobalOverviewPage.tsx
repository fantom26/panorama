'use client'

import { useRouter } from 'next/navigation'

import {
  DonutChart,
  MapLegend,
  RankingList,
  Section,
  Skeleton,
  StatCard,
  Typography,
  WorldMap
} from '@repo/ui'

import { useGlobalStats } from '@/features/global/useGlobalStats'
import { useTranslation } from '@/i18n'
import { useMediaQuery } from '@/shared/hooks/useMediaQuery'
import type { Alpha2Code } from '@/shared/types/iso'
import AppHeader from '@/shared/ui/AppHeader'
import TitleBlock from '@/shared/ui/TitleBlock'
import TitleMeta from '@/shared/ui/TitleMeta'
import { formatGdp, formatPercent } from '@/shared/utils/format'

import styles from './GlobalOverviewPage.module.css'

export default function GlobalOverviewPage() {
  const { t } = useTranslation('global')
  const { overview, isPending } = useGlobalStats()
  const router = useRouter()
  const isTablet = useMediaQuery('(min-width: 768px)')
  const isDesktop = useMediaQuery('(min-width: 1440px)')
  const heatmapHeight = isDesktop ? 340 : isTablet ? 260 : 200
  const donutSize = isTablet ? 160 : 130

  function handleCountrySelect(alpha2: string) {
    const id = overview.countryIdByAlpha2[alpha2.toLowerCase() as Alpha2Code]
    if (id) router.push(`/countries/${id}`)
  }

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

      <div className={styles.stats}>
        {overview.tiles.map((stat) => (
          <StatCard
            key={stat.key}
            variant='row'
            label={t(`tiles.${stat.key}`)}
            value={stat.value}
            loading={isPending}
          />
        ))}
      </div>

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
            <RankingList data={overview.topInflation} formatValue={formatPercent} />
          )}
        </Section>
      </div>
    </>
  )
}
