'use client'

import { useState } from 'react'

import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'

import { Breadcrumbs, Button, Section, Select, Skeleton, Typography, WorldMap } from '@repo/ui'

import { useIncomeLevelOverview } from '@/features/income/hooks/useIncomeLevelOverview'
import { assertIncomeSlug } from '@/features/income/model/income-not-found'
import { useTranslation } from '@/i18n'
import { useChartHeight } from '@/shared/hooks/useChartHeight'
import { useCountryMapSelect } from '@/shared/hooks/useCountryMapSelect'
import { INCOME_LEVELS, INCOME_SLUGS, levelFromSlug } from '@/shared/model/income-levels'
import { ROUTES } from '@/shared/routes'
import AppHeader from '@/shared/ui/AppHeader'
import BreakdownList from '@/shared/ui/BreakdownList'
import CountryCard from '@/shared/ui/CountryCard'
import ErrorBoundary from '@/shared/ui/ErrorBoundary'
import StatTiles from '@/shared/ui/StatTiles'
import TitleBlock from '@/shared/ui/TitleBlock'
import TitleMeta from '@/shared/ui/TitleMeta'
import { formatCompactNumber, formatCompactUsd, formatGdp, formatUsd } from '@/shared/utils/format'

import styles from './index.module.css'

const INCOME_OPTIONS = INCOME_SLUGS.map((slug) => ({ label: INCOME_LEVELS[slug], value: slug }))
const CARD_CAP = 24

export default function IncomeLevelPage() {
  const { level } = useParams<{ level: string }>()
  assertIncomeSlug(level)

  const levelName = levelFromSlug(level)
  const { t } = useTranslation('income')
  const router = useRouter()
  const { overview, isPending, refetch } = useIncomeLevelOverview(levelName)

  const mapHeight = useChartHeight({ mobile: 220, tablet: 280, desktop: 360 })
  const handleCountrySelect = useCountryMapSelect(overview.countryIdByAlpha2, overview.memberIds)

  const [showAll, setShowAll] = useState(false)
  const visibleCards = showAll ? overview.cards : overview.cards.slice(0, CARD_CAP)

  const regionRows = overview.regionBreakdown.map((row) => ({
    key: row.region,
    label: row.region,
    href: row.slug ? ROUTES.region(row.slug) : undefined,
    metrics: [
      t('regionRow.count', { count: row.count }),
      t('regionRow.population', { value: formatCompactNumber(row.population) }),
      t('regionRow.gdp', { value: formatCompactUsd(row.gdp) })
    ]
  }))

  return (
    <>
      <AppHeader>
        <Breadcrumbs>
          <Link href={ROUTES.home()}>
            <Typography variant='body-sm' color='muted' component='span'>
              {t('breadcrumb.global')}
            </Typography>
          </Link>
          <Typography variant='body-sm' color='knockout' component='span' aria-current='page'>
            {t('header.title', { name: levelName })}
          </Typography>
        </Breadcrumbs>
      </AppHeader>

      <TitleBlock className={styles.titleBlock}>
        <div>
          <Typography variant='meta-sm' color='subtle' component='div'>
            {t('header.eyebrow')}
          </Typography>
          <Typography variant='headline-sm' component='h1'>
            {t('header.title', { name: levelName })}
          </Typography>
          <Typography variant='meta-sm' color='muted' component='div'>
            {t('header.count', { count: overview.cards.length })}
          </Typography>
        </div>
        <TitleMeta className={styles.rightMeta}>
          <Select
            options={INCOME_OPTIONS}
            value={level}
            onValueChange={(value) => value && router.push(ROUTES.incomeLevel(value))}
            aria-label={t('switcher.label')}
          />
        </TitleMeta>
      </TitleBlock>

      <ErrorBoundary onReset={refetch}>
        <StatTiles
          tiles={overview.tiles}
          labelFor={(key) => t(`tiles.${key}`)}
          loading={isPending}
          columns={5}
        />

        <div className={styles.twoColRow}>
          <Section title={t('sections.map')} className={`${styles.column} ${styles.columnDivided}`}>
            <div className={styles.mapBody}>
              <Typography variant='meta-sm' color='muted' component='p' className={styles.hint}>
                {t('sections.mapHint')}
              </Typography>
              {isPending ? (
                <Skeleton variant='rectangular' width='100%' height={mapHeight} />
              ) : (
                <WorldMap
                  mode='lit'
                  highlight={overview.memberAlpha2}
                  data={overview.mapData}
                  disableUnhighlighted
                  format={formatUsd}
                  onSelect={handleCountrySelect}
                  height={mapHeight}
                />
              )}
            </div>
          </Section>

          <Section title={t('sections.regions')} className={styles.column}>
            {isPending ? (
              <Skeleton variant='rectangular' width='100%' height={mapHeight} />
            ) : (
              <BreakdownList rows={regionRows} />
            )}
          </Section>
        </div>

        <Section
          title={t('sections.economies', { count: overview.cards.length })}
          className={styles.economies}
        >
          {isPending ? (
            <Skeleton variant='rectangular' width='100%' height={280} />
          ) : (
            <>
              <div className={styles.cardGrid}>
                {visibleCards.map((card) => (
                  <CountryCard
                    key={card.id}
                    id={card.id}
                    iso2={card.iso2}
                    name={card.name}
                    metrics={[
                      {
                        label: t('card.population'),
                        value: card.population == null ? '—' : formatCompactNumber(card.population)
                      },
                      {
                        label: t('card.gdp'),
                        value: card.gdp == null ? '—' : formatGdp(card.gdp)
                      },
                      {
                        label: t('card.gdpPerCapita'),
                        value: card.gdpPerCapita == null ? '—' : formatUsd(card.gdpPerCapita)
                      }
                    ]}
                  />
                ))}
              </div>
              {!showAll && overview.cards.length > CARD_CAP && (
                <div className={styles.showAll}>
                  <Button variant='outlined' onClick={() => setShowAll(true)}>
                    {t('showAll', { count: overview.cards.length })}
                  </Button>
                </div>
              )}
            </>
          )}
        </Section>
      </ErrorBoundary>
    </>
  )
}
