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
import { useTranslation } from '@/i18n'
import { formatGdp, formatPercent } from '@/utils/format'

import styles from './page.module.css'

const languages = [
  { code: 'en', label: 'EN' },
  { code: 'ar', label: 'ع' }
]

export default function GlobalPage() {
  const { t, i18n } = useTranslation('global')
  const { overview, isPending } = useGlobalStats()
  const isTablet = useMediaQuery('(min-width: 768px)')
  const isDesktop = useMediaQuery('(min-width: 1440px)')
  const heatmapHeight = isDesktop ? 340 : isTablet ? 260 : 200
  const donutSize = isTablet ? 160 : 130

  function handleLanguageChange(code: string) {
    i18n.changeLanguage(code)
    const root = document.documentElement
    root.lang = code
    root.dir = i18n.dir(code)
  }

  return (
    <div className={styles.page}>
      <header className={styles.topBar}>
        <div className={styles.brand}>
          <Logo />
          <Typography variant='body-sm' component='span' className={styles.pageName}>
            {t('pageName')}
          </Typography>
        </div>
        <div className={styles.iconControls}>
          <LanguageSwitcher
            languages={languages}
            value={i18n.language}
            onChange={handleLanguageChange}
          />
          <span className={styles.dividerWrap}>
            <Divider orientation='vertical' />
          </span>
          <ThemeToggle />
        </div>
        <ExpandableSearch placeholder={t('search.placeholder')} className={styles.search} />
      </header>

      <div className={styles.titleBlock}>
        <div>
          <Typography variant='meta-sm' color='subtle' component='div'>
            {t('header.eyebrow')}
          </Typography>
          <Typography variant='headline-sm' component='h1'>
            {t('header.title')}
          </Typography>
        </div>
        <div className={styles.titleMeta}>
          <Typography variant='body-sm' color='muted' component='div'>
            {t('header.lastSync', { time: '14:02 UTC' })}
          </Typography>
          <Typography variant='body-sm' color='knockout' component='div'>
            {t('header.dataSource')}
          </Typography>
        </div>
      </div>

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
                <WorldMap data={overview.gdpByCountry} height={heatmapHeight} format={formatGdp} />
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
    </div>
  )
}
