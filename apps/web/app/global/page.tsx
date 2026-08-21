'use client'

import {
  DonutChart,
  ExpandableSearch,
  Logo,
  RankingList,
  Section,
  StatCard,
  Typography,
  WorldMap
} from '@repo/ui'

import styles from './page.module.css'

const stats = [
  { label: 'Countries', value: '249' },
  { label: 'Population', value: '7.95B', trend: '+0.87%', trendColor: 'success' as const },
  { label: 'Avg GDP', value: '$418B' },
  { label: 'Inflation', value: '5.4%', trend: '+0.9pp', trendColor: 'error' as const }
]

const gdpByRegion = [
  { label: 'Asia', value: 38400 },
  { label: 'Americas', value: 31200 },
  { label: 'Europe', value: 24100 },
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
  { label: 'Portuguese', value: 10 }
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
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Logo />
      </header>

      <div className={styles.titleBlock}>
        <Typography variant='meta-sm' color='subtle' component='div'>
          Dashboard
        </Typography>
        <Typography variant='headline-default' component='h1'>
          Global overview
        </Typography>
        <Typography variant='meta-sm' color='subtle' component='div' className={styles.meta}>
          Last sync · 14:02 UTC
        </Typography>
      </div>

      <div className={styles.search}>
        <ExpandableSearch placeholder='Search countries' />
      </div>

      <div className={styles.stats}>
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <Section number='01' title='GDP heatmap'>
        <WorldMap data={gdpHeatmap} height={320} format={(value) => `$${value}B`} />
      </Section>

      <Section number='02' title='GDP by region' action='USD, billions'>
        <RankingList data={gdpByRegion} formatValue={(value) => `$${(value / 1000).toFixed(1)}T`} />
      </Section>

      <Section number='03' title='Population by region'>
        <DonutChart data={populationByRegion} layout='row' />
      </Section>

      <Section number='04' title='Top languages'>
        <RankingList data={topLanguages} formatValue={(value) => `${value} cty`} />
      </Section>
    </div>
  )
}
