'use client'

import {
  Divider,
  DonutChart,
  ExpandableSearch,
  LanguageSwitcher,
  Logo,
  MapLegend,
  RankingList,
  Section,
  Skeleton,
  StatCard,
  ThemeToggle,
  Typography,
  WorldMap
} from '@repo/ui'

import { useGlobalStats } from '@/hooks/useGlobalStats'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { formatGdp, formatPercent } from '@/utils/format'

import styles from './page.module.css'

import '@repo/ui/i18n'

const languages = [
  { code: 'en', label: 'EN' },
  { code: 'uk', label: 'УК' },
  { code: 'ar', label: 'ع' }
]

export default function GlobalPage() {
  const { overview, isPending } = useGlobalStats()
  const isTablet = useMediaQuery('(min-width: 768px)')
  const isDesktop = useMediaQuery('(min-width: 1440px)')
  const heatmapHeight = isDesktop ? 340 : isTablet ? 260 : 200
  const donutSize = isTablet ? 160 : 130

  return (
    <div className={styles.page}>
      <header className={styles.topBar}>
        <div className={styles.brand}>
          <Logo />
          <Typography variant='body-sm' component='span' className={styles.pageName}>
            Global
          </Typography>
        </div>
        <div className={styles.iconControls}>
          <LanguageSwitcher languages={languages} />
          <span className={styles.dividerWrap}>
            <Divider orientation='vertical' />
          </span>
          <ThemeToggle />
        </div>
        <ExpandableSearch placeholder='Search countries' className={styles.search} />
      </header>

      <div className={styles.titleBlock}>
        <div>
          <Typography variant='meta-sm' color='subtle' component='div'>
            Dashboard
          </Typography>
          <Typography variant='headline-sm' component='h1'>
            Global overview
          </Typography>
        </div>
        <div className={styles.titleMeta}>
          <Typography variant='body-sm' color='muted' component='div'>
            Last sync · 14:02 UTC
          </Typography>
          <Typography variant='body-sm' color='knockout' component='div'>
            Data: REST Countries v3.1 / World Bank WDI
          </Typography>
        </div>
      </div>

      <div className={styles.stats}>
        {overview.tiles.map((stat) => (
          <StatCard key={stat.label} variant='row' {...stat} loading={isPending} />
        ))}
      </div>

      <div className={`${styles.twoColRow} ${styles.heatmapRow}`}>
        <Section
          number='01'
          title='GDP heatmap — click a country to drill down'
          action='USD, log scale →'
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
                <WorldMap data={overview.gdpByCountry} height={heatmapHeight} format={formatGdp} />
                <MapLegend range={overview.gdpRange} />
              </>
            )}
          </div>
        </Section>

        <Section number='02' title='GDP by region' action='Total, USD' className={styles.column}>
          {isPending ? (
            <Skeleton variant='rectangular' width='100%' height={220} />
          ) : (
            <RankingList data={overview.gdpByRegion} formatValue={formatGdp} />
          )}
        </Section>
      </div>

      <div className={`${styles.twoColRow} ${styles.evenRow}`}>
        <Section
          number='03'
          title='Population by region'
          action='Click slice to drill'
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

        <Section
          number='04'
          title='Highest inflation'
          action='Consumer prices, YoY'
          className={styles.column}
        >
          {isPending ? (
            <Skeleton variant='rectangular' width='100%' height={220} />
          ) : (
            <RankingList data={overview.topInflation} formatValue={formatPercent} />
          )}
        </Section>
      </div>
    </div>
  )
}
