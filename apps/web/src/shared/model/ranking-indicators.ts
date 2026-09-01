import { INDICATOR, type IndicatorId } from '@/shared/model/indicators'

/** URL slugs for `/rankings/[indicator]` — readable stand-ins for the SOTW codes. */
export const RANKING_INDICATORS = {
  population: INDICATOR.population,
  gdp: INDICATOR.gdp,
  'gdp-per-capita': INDICATOR.gdpPerCapita,
  inflation: INDICATOR.inflation,
  unemployment: INDICATOR.unemployment,
  area: INDICATOR.area
} as const

export type RankingSlug = keyof typeof RANKING_INDICATORS

export const RANKING_SLUGS = Object.keys(RANKING_INDICATORS) as RankingSlug[]

const SLUG_BY_INDICATOR = Object.fromEntries(
  Object.entries(RANKING_INDICATORS).map(([slug, id]) => [id, slug])
) as Record<IndicatorId, RankingSlug>

export function indicatorFromSlug(slug: RankingSlug): IndicatorId
export function indicatorFromSlug(slug: string): IndicatorId | undefined
export function indicatorFromSlug(slug: string): IndicatorId | undefined {
  return RANKING_INDICATORS[slug as RankingSlug]
}

export function slugFromIndicator(indicator: string): RankingSlug | undefined {
  return SLUG_BY_INDICATOR[indicator as IndicatorId]
}
