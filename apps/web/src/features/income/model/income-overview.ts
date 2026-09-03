import type { Country } from '@/shared/model/country'
import { type RegionSlug, slugFromRegion } from '@/shared/model/regions'
import {
  bucketTotals,
  selectIncomeLevelCountries,
  selectMemberProjection,
  selectRegionCountries
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
  'economies',
  'totalPopulation',
  'totalGdp',
  'avgGdpPerCapita',
  'avgInflation'
] as const

export type IncomeTileKey = (typeof TILE_KEYS)[number]

export type RegionBreakdownRow = {
  region: string
  slug: RegionSlug | undefined
  count: number
  population: number
  gdp: number
}

export type IncomeCountryCard = {
  id: string
  iso2: string
  name: string
  population: number | null
  gdp: number | null
  gdpPerCapita: number | null
}

type MapDatum = { id: string; value: number | null }

export type IncomeLevelOverview = {
  tiles: Stat<IncomeTileKey>[]
  memberAlpha2: string[]
  memberIds: Set<string>
  countryIdByAlpha2: Partial<Record<Alpha2Code, Alpha3Code>>
  mapData: MapDatum[]
  regionBreakdown: RegionBreakdownRow[]
  cards: IncomeCountryCard[]
}

export const EMPTY_INCOME_LEVEL_OVERVIEW: IncomeLevelOverview = {
  tiles: toStats(TILE_KEYS),
  memberAlpha2: [],
  memberIds: new Set(),
  countryIdByAlpha2: {},
  mapData: [],
  regionBreakdown: [],
  cards: []
}

export function selectIncomeLevelOverview(
  levelName: string,
  countries: readonly Country[],
  regionName?: string
): IncomeLevelOverview {
  let members = selectIncomeLevelCountries(levelName, countries)
  if (regionName) members = selectRegionCountries(regionName, members)
  if (members.length === 0) return EMPTY_INCOME_LEVEL_OVERVIEW

  const tileValues: Record<IncomeTileKey, string> = {
    economies: String(members.length),
    totalPopulation: formatCompactNumber(sum(members.map((c) => c.population))),
    totalGdp: formatCompactUsd(sum(members.map((c) => c.gdp))),
    avgGdpPerCapita: formatUsd(avg(members.map((c) => c.gdpPerCapita)) ?? 0),
    avgInflation: formatPercent(avg(members.map((c) => c.inflation)) ?? 0)
  }

  const regionBreakdown: RegionBreakdownRow[] = Object.entries(groupBy(members, 'region'))
    .map(([region, bucket]) => ({
      region,
      slug: slugFromRegion(region),
      ...bucketTotals(bucket)
    }))
    .sort((a, b) => b.count - a.count)

  const cards: IncomeCountryCard[] = members
    .map((c) => ({
      id: c.id,
      iso2: c.iso2,
      name: c.name,
      population: c.population,
      gdp: c.gdp,
      gdpPerCapita: c.gdpPerCapita
    }))
    .sort((a, b) => (b.gdpPerCapita ?? -Infinity) - (a.gdpPerCapita ?? -Infinity))

  return {
    tiles: toStats(TILE_KEYS, tileValues),
    ...selectMemberProjection(members),
    mapData: members.map((c) => ({ id: c.iso2.toUpperCase(), value: c.gdpPerCapita })),
    regionBreakdown,
    cards
  }
}
