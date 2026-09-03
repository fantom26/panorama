import { INDICATOR, type IndicatorId } from '@/shared/model/indicators'
import { createSlugMap } from '@/shared/model/slug-map'

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

const indicators = createSlugMap(RANKING_INDICATORS)

export const RANKING_SLUGS = indicators.keys

export function indicatorFromSlug(slug: RankingSlug): IndicatorId
export function indicatorFromSlug(slug: string): IndicatorId | undefined
export function indicatorFromSlug(slug: string): IndicatorId | undefined {
  return indicators.forward(slug)
}

export function slugFromIndicator(indicator: string): RankingSlug | undefined {
  return indicators.reverse(indicator)
}
