'use client'

import { useState } from 'react'

import Link from 'next/link'
import { useParams, useRouter, useSearchParams } from 'next/navigation'

import { Button, Section, Select, Skeleton, Typography, WorldMap } from '@repo/ui'

import { useIncomeLevelOverview } from '@/features/income/hooks/useIncomeLevelOverview'
import { assertIncomeSlug } from '@/features/income/model/income-not-found'
import { useTranslation } from '@/i18n'
import { useChartHeight } from '@/shared/hooks/useChartHeight'
import { useCountryMapSelect } from '@/shared/hooks/useCountryMapSelect'
import { INCOME_LEVELS, INCOME_SLUGS, levelFromSlug } from '@/shared/model/income-levels'
import { regionFromSlug, slugFromRegion } from '@/shared/model/regions'
import { ROUTES } from '@/shared/routes'
import BreakdownList from '@/shared/ui/BreakdownList'
import CountryCard from '@/shared/ui/CountryCard'
import OverviewPageShell from '@/shared/ui/OverviewPageShell'
import StatTiles from '@/shared/ui/StatTiles'
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
  const searchParams = useSearchParams()

  const regionName = regionFromSlug(searchParams.get('region') ?? '')
  const regionSlug = regionName ? slugFromRegion(regionName) : undefined

  const { overview, isPending, refetch } = useIncomeLevelOverview(levelName, regionName)

  const mapHeight = useChartHeight({ mobile: 220, tablet: 280, desktop: 360 })
  const handleCountrySelect = useCountryMapSelect(overview.countryIdByAlpha2, overview.memberIds)

  const [showAll, setShowAll] = useState(false)
  const visibleCards = showAll ? overview.cards : overview.cards.slice(0, CARD_CAP)

  const regionRows = overview.regionBreakdown.map((row) => ({
    key: row.region,
    label: row.region,
    href: row.slug ? ROUTES.region(row.slug, { level }) : undefined,
    metrics: [
      t('regionRow.count', { count: row.count }),
      t('regionRow.population', { value: formatCompactNumber(row.population) }),
      t('regionRow.gdp', { value: formatCompactUsd(row.gdp) })
    ]
  }))

  return (
    <OverviewPageShell
      homeLabel={t('breadcrumb.global')}
      crumb={t('header.title', { name: levelName })}
      eyebrow={t('header.eyebrow')}
      title={t('header.title', { name: levelName })}
      subtitle={
        <>
          <Typography variant='meta-sm' color='muted' component='div'>
            {t('header.count', { count: overview.cards.length })}
          </Typography>
          {regionName && (
            <div className={styles.filterNote}>
              <Typography variant='meta-sm' color='muted' component='span'>
                {t('filter.activeBy', { name: regionName })}
              </Typography>{' '}
              <Link href={ROUTES.incomeLevel(level)} className={styles.filterClear}>
                <Typography variant='meta-sm' component='span'>
                  {t('filter.clear')}
                </Typography>
              </Link>
            </div>
          )}
        </>
      }
      switcher={
        <Select
          options={INCOME_OPTIONS}
          value={level}
          onValueChange={(value) =>
            value && router.push(ROUTES.incomeLevel(value, { region: regionSlug }))
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
    </OverviewPageShell>
  )
}
