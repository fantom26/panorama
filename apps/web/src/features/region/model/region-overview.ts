import type { Country } from '@/shared/model/country'
import { incomeRank, type IncomeSlug, slugFromLevel } from '@/shared/model/income-levels'
import {
  bucketTotals,
  selectIncomeLevelCountries,
  selectMemberProjection,
  selectRegionCountries,
  topByMetric
} from '@/shared/model/selectors'
import { type Stat, toStats } from '@/shared/model/stat'
import type { Alpha2Code, Alpha3Code } from '@/shared/types/iso'
import { avg, groupBy, sum } from '@/shared/utils/aggregate'
import {
  formatCompactNumber,
  formatCompactUsd,
  formatPercent,
  formatUsd
} from '@/shared/utils/format'

const TILE_KEYS = [
  'countries',
  'totalPopulation',
  'avgGdp',
  'avgGdpPerCapita',
  'avgInflation'
] as const

export type RegionTileKey = (typeof TILE_KEYS)[number]

export type IncomeBreakdownRow = {
  level: string
  slug: IncomeSlug | undefined
  count: number
  population: number
  gdp: number
}

export type RegionTopCountry = { id: string; label: string; value: number }

export type RegionOverview = {
  tiles: Stat<RegionTileKey>[]
  memberAlpha2: string[]
  memberIds: Set<string>
  countryIdByAlpha2: Partial<Record<Alpha2Code, Alpha3Code>>
  incomeBreakdown: IncomeBreakdownRow[]
  topGdpPerCapita: RegionTopCountry[]
}

export const EMPTY_REGION_OVERVIEW: RegionOverview = {
  tiles: toStats(TILE_KEYS),
  memberAlpha2: [],
  memberIds: new Set(),
  countryIdByAlpha2: {},
  incomeBreakdown: [],
  topGdpPerCapita: []
}

export function selectRegionOverview(
  regionName: string,
  countries: readonly Country[],
  levelName?: string
): RegionOverview {
  let members = selectRegionCountries(regionName, countries)
  if (levelName) members = selectIncomeLevelCountries(levelName, members)
  if (members.length === 0) return EMPTY_REGION_OVERVIEW

  const tileValues: Record<RegionTileKey, string> = {
    countries: String(members.length),
    totalPopulation: formatCompactNumber(sum(members.map((c) => c.population))),
    avgGdp: formatCompactUsd(avg(members.map((c) => c.gdp)) ?? 0),
    avgGdpPerCapita: formatUsd(avg(members.map((c) => c.gdpPerCapita)) ?? 0),
    avgInflation: formatPercent(avg(members.map((c) => c.inflation)) ?? 0)
  }

  const incomeBreakdown: IncomeBreakdownRow[] = Object.entries(groupBy(members, 'incomeLevel'))
    .sort(([a], [b]) => incomeRank(a) - incomeRank(b))
    .map(([level, bucket]) => ({
      level,
      slug: slugFromLevel(level),
      ...bucketTotals(bucket)
    }))

  const topGdpPerCapita = topByMetric(members, 'gdpPerCapita', 10, (country, value) => ({
    id: country.id,
    label: country.name,
    value
  }))

  return {
    tiles: toStats(TILE_KEYS, tileValues),
    ...selectMemberProjection(members),
    incomeBreakdown,
    topGdpPerCapita
  }
}
