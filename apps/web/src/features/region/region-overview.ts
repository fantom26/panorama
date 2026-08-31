import type { Country } from '@/shared/model/country'
import { INCOME_LEVELS, type IncomeSlug, slugFromLevel } from '@/shared/model/income-levels'
import { selectRegionCountries } from '@/shared/model/selectors'
import { type Stat, toStats } from '@/shared/model/stat'
import type { Alpha2Code, Alpha3Code } from '@/shared/types/iso'
import { avg, sum } from '@/shared/utils/aggregate'
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

const INCOME_ORDER = Object.values(INCOME_LEVELS) as string[]

function incomeRank(level: string) {
  const index = INCOME_ORDER.indexOf(level)
  return index === -1 ? INCOME_ORDER.length : index
}

export function selectRegionOverview(
  regionName: string,
  countries: readonly Country[]
): RegionOverview {
  const members = selectRegionCountries(regionName, countries)
  if (members.length === 0) return EMPTY_REGION_OVERVIEW

  const tileValues: Record<RegionTileKey, string> = {
    countries: String(members.length),
    totalPopulation: formatCompactNumber(sum(members.map((c) => c.population))),
    avgGdp: formatCompactUsd(avg(members.map((c) => c.gdp)) ?? 0),
    avgGdpPerCapita: formatUsd(avg(members.map((c) => c.gdpPerCapita)) ?? 0),
    avgInflation: formatPercent(avg(members.map((c) => c.inflation)) ?? 0)
  }

  const byLevel = new Map<string, Country[]>()
  for (const country of members) {
    const bucket = byLevel.get(country.incomeLevel) ?? []
    bucket.push(country)
    byLevel.set(country.incomeLevel, bucket)
  }

  const incomeBreakdown: IncomeBreakdownRow[] = [...byLevel.entries()]
    .sort(([a], [b]) => incomeRank(a) - incomeRank(b))
    .map(([level, bucket]) => ({
      level,
      slug: slugFromLevel(level),
      count: bucket.length,
      population: sum(bucket.map((c) => c.population)),
      gdp: sum(bucket.map((c) => c.gdp))
    }))

  const topGdpPerCapita = members
    .filter((c): c is Country & { gdpPerCapita: number } => c.gdpPerCapita != null)
    .sort((a, b) => b.gdpPerCapita - a.gdpPerCapita)
    .slice(0, 10)
    .map((c) => ({ id: c.id, label: c.name, value: c.gdpPerCapita }))

  return {
    tiles: toStats(TILE_KEYS, tileValues),
    memberAlpha2: members.map((c) => c.iso2.toUpperCase()),
    memberIds: new Set(members.map((c) => c.id)),
    countryIdByAlpha2: Object.fromEntries(members.map((c) => [c.iso2, c.id])) as Partial<
      Record<Alpha2Code, Alpha3Code>
    >,
    incomeBreakdown,
    topGdpPerCapita
  }
}
