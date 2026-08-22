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
  StatCard,
  ThemeToggle,
  Typography,
  WorldMap
} from '@repo/ui'

import { useMediaQuery } from '@/hooks/useMediaQuery'

import styles from './page.module.css'

import '@repo/ui/i18n'

const languages = [
  { code: 'en', label: 'EN' },
  { code: 'uk', label: 'УК' },
  { code: 'ar', label: 'ع' }
]

const stats = [
  { label: 'Countries', value: '249', trend: 'World Bank · REST Countries' },
  {
    label: 'Total population',
    value: '7.95B',
    trend: '+0.87% YoY',
    trendColor: 'success' as const
  },
  { label: 'Average GDP', value: '$418B', trend: 'nominal, USD' },
  { label: 'Avg inflation', value: '5.4%', trend: '+0.9pp YoY', trendColor: 'error' as const },
  { label: 'Avg unemployment', value: '6.2%', trend: '−0.3pp YoY', trendColor: 'success' as const }
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

const topLanguages = [
  { label: 'English', value: 67 },
  { label: 'French', value: 29 },
  { label: 'Arabic', value: 23 },
  { label: 'Spanish', value: 21 },
  { label: 'Portuguese', value: 10 },
  { label: 'German', value: 6 },
  { label: 'Russian', value: 6 },
  { label: 'Chinese', value: 5 }
]

const gdpHeatmap = [
  { id: 'US', value: 27400 },
  { id: 'CN', value: 17700 },
  { id: 'DE', value: 4460 },
  { id: 'JP', value: 4200 },
  { id: 'IN', value: 3730 },
  { id: 'GB', value: 3340 },
  { id: 'FR', value: 3030 },
  { id: 'BR', value: 2170 },
  { id: 'AU', value: 1720 },
  { id: 'ZA', value: 400 }
]

export default function GlobalPage() {
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
        {stats.map((stat) => (
          <StatCard key={stat.label} variant='row' {...stat} />
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
            <WorldMap data={gdpHeatmap} height={heatmapHeight} format={(value) => `$${value}B`} />
            <MapLegend range='$10M ─────── $26T' />
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

        <Section
          number='04'
          title='Top languages'
          action='Countries where spoken'
          className={styles.column}
        >
          <RankingList data={topLanguages} formatValue={(value) => `${value} countries`} />
        </Section>
      </div>
    </div>
  )
}
