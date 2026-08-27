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
import { formatGdp } from '@/utils/format'

import styles from './page.module.css'

import '@repo/ui/i18n'

const languages = [
  { code: 'en', label: 'EN' },
  { code: 'uk', label: 'УК' },
  { code: 'ar', label: 'ع' }
]

const statLabels = [
  'Countries',
  'Total population',
  'Average GDP',
  'Avg inflation',
  'Avg unemployment'
]

const gdpByRegion = [
  { label: 'Asia', value: 38400 },
  { label: 'Europe', value: 24100 },
  { label: 'Americas', value: 31200 },
  { label: 'Africa', value: 3100 },
  { label: 'Oceania', value: 1800 }
]

const populationByRegion = [
  { label: 'Asia', value: 4720 },
  { label: 'Africa', value: 1480 },
  { label: 'Americas', value: 1050 },
  { label: 'Europe', value: 745 },
  { label: 'Oceania', value: 45 }
]

export default function GlobalPage() {
  const { data, isPending, isError } = useGlobalStats()
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
        {isPending || isError
          ? statLabels.map((label) => (
              <StatCard key={label} variant='row' label={label} value='—' loading={isPending} />
            ))
          : data.tiles.map((stat) => <StatCard key={stat.label} variant='row' {...stat} />)}
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
                <WorldMap
                  data={data?.gdpByCountry ?? []}
                  height={heatmapHeight}
                  format={formatGdp}
                />
                <MapLegend range='$10M ─────── $26T' />
              </>
            )}
          </div>
        </Section>

        <Section
          number='02'
          title='GDP by region'
          action='Avg, USD billions'
          className={styles.column}
        >
          <RankingList
            data={gdpByRegion}
            formatValue={(value) => `$${(value / 1000).toFixed(1)}T`}
          />
        </Section>
      </div>

      <div className={`${styles.twoColRow} ${styles.evenRow}`}>
        <Section
          number='03'
          title='Population by region'
          action='Click slice to drill'
          className={`${styles.column} ${styles.columnDivided}`}
        >
          <DonutChart
            data={populationByRegion}
            layout={isTablet ? 'row' : 'column'}
            size={donutSize}
          />
        </Section>
      </div>
    </div>
  )
}
