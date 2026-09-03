import type { Country } from '@/shared/model/country'
import { selectCountryIdByAlpha2, selectGlobalMetrics, topByMetric } from '@/shared/model/selectors'
import { type Stat, toStats } from '@/shared/model/stat'
import type { Alpha2Code, Alpha3Code } from '@/shared/types/iso'
import { formatCompactNumber, formatCompactUsd, formatPercent } from '@/shared/utils/format'

const TILE_KEYS = [
  'countries',
  'totalPopulation',
  'avgGdp',
  'avgInflation',
  'avgUnemployment'
] as const

export type TileKey = (typeof TILE_KEYS)[number]

export type GlobalStat = Stat<TileKey>
export type CountryValue = { id: string; value: number }
export type LabelledValue = { label: string; value: number }

export type GlobalOverview = {
  tiles: GlobalStat[]
  gdpByCountry: CountryValue[]
  gdpRange: string
  gdpByRegion: LabelledValue[]
  populationByRegion: LabelledValue[]
  topInflation: LabelledValue[]
  countryIdByAlpha2: Partial<Record<Alpha2Code, Alpha3Code>>
}

export const EMPTY_OVERVIEW: GlobalOverview = {
  tiles: toStats(TILE_KEYS),
  gdpByCountry: [],
  gdpRange: '',
  gdpByRegion: [],
  populationByRegion: [],
  topInflation: [],
  countryIdByAlpha2: {}
}

type Metric = 'gdp' | 'population'

function byRegion(countries: readonly Country[], metric: Metric): LabelledValue[] {
  const totals = new Map<string, number>()
  for (const country of countries) {
    const value = country[metric]
    if (value == null) continue
    const region = country.region.trim()
    totals.set(region, (totals.get(region) ?? 0) + value)
  }
  return [...totals].map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value)
}

export function selectGlobalOverview(countries: readonly Country[]): GlobalOverview {
  if (countries.length === 0) return EMPTY_OVERVIEW

  const metrics = selectGlobalMetrics(countries)

  const gdpByCountry = countries.flatMap((country) =>
    country.gdp == null ? [] : [{ id: country.iso2.toUpperCase(), value: country.gdp }]
  )
  const gdpValues = gdpByCountry.map((entry) => entry.value)
  const gdpRange = gdpValues.length
    ? `${formatCompactUsd(Math.min(...gdpValues))} ─────── ${formatCompactUsd(Math.max(...gdpValues))}`
    : ''

  const topInflation = topByMetric(countries, 'inflation', 8, (country, value) => ({
    label: country.name,
    value
  }))

  const tileValues: Record<TileKey, string> = {
    countries: String(metrics.total),
    totalPopulation: formatCompactNumber(metrics.totalPopulation),
    avgGdp: formatCompactUsd(metrics.avgGdp ?? 0),
    avgInflation: formatPercent(metrics.avgInflation ?? 0),
    avgUnemployment: formatPercent(metrics.avgUnemployment ?? 0)
  }

  return {
    tiles: toStats(TILE_KEYS, tileValues),
    gdpByCountry,
    gdpRange,
    gdpByRegion: byRegion(countries, 'gdp'),
    populationByRegion: byRegion(countries, 'population'),
    topInflation,
    countryIdByAlpha2: selectCountryIdByAlpha2(countries)
  }
}
