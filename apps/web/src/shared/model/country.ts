import type { CountryRow, IndicatorValue, RankingResponse } from '@/shared/api/statistics-api'
import type { Alpha2Code, Alpha3Code } from '@/shared/types/iso'

/** The five headline metrics merged onto the catalog from the dashboard rankings. */
export type CountryMetric = 'population' | 'gdp' | 'gdpPerCapita' | 'inflation' | 'unemployment'

/**
 * A catalog country enriched with the dashboard ranking metrics. Every page derives
 * its data from `Country[]` via pure selectors — no per-page list fetch. Any metric
 * (and the capital coordinates) may be `null` when SOTW has no observation.
 */
export type Country = {
  id: Alpha3Code
  iso2: Alpha2Code
  name: string
  region: string
  incomeLevel: string
  capitalCity: string | null
  latitude: number | null
  longitude: number | null
  population: number | null
  gdp: number | null
  gdpPerCapita: number | null
  inflation: number | null
  unemployment: number | null
}

export type CountryDetail = Country & { indicators: IndicatorValue[] }

export type CountryMetricRankings = Partial<Record<CountryMetric, RankingResponse>>

function toFiniteNumber(value: string | null): number | null {
  if (value == null) return null
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

/**
 * Left-join each ranking onto the country catalog by `id === countryId`. Countries with
 * no row in a given ranking keep `null` for that metric; the join never drops a catalog
 * country and never throws.
 */
export function mergeRankingsIntoCountries(
  rows: readonly CountryRow[],
  rankings: CountryMetricRankings
): Country[] {
  const valueMaps = new Map<CountryMetric, Map<string, number>>()
  for (const [metric, ranking] of Object.entries(rankings) as [
    CountryMetric,
    RankingResponse | undefined
  ][]) {
    if (!ranking) continue
    valueMaps.set(metric, new Map(ranking.data.map((row) => [row.countryId, row.value])))
  }

  const metric = (name: CountryMetric, id: string) => valueMaps.get(name)?.get(id) ?? null

  return rows.map((row) => ({
    id: row.id,
    iso2: row.iso2,
    name: row.name,
    region: row.region,
    incomeLevel: row.incomeLevel,
    capitalCity: row.capitalCity,
    latitude: toFiniteNumber(row.latitude),
    longitude: toFiniteNumber(row.longitude),
    population: metric('population', row.id),
    gdp: metric('gdp', row.id),
    gdpPerCapita: metric('gdpPerCapita', row.id),
    inflation: metric('inflation', row.id),
    unemployment: metric('unemployment', row.id)
  }))
}
