import { type QueryFunctionContext, useQuery } from '@tanstack/react-query'

import { fetchRanking, type RankingResponse } from '@/shared/api/statistics-api'
import { countriesQuery } from '@/shared/hooks/useCountries'
import { INDICATOR } from '@/shared/model/indicators'
import type { Alpha2Code, Alpha3Code } from '@/shared/types/iso'
import { formatCompactNumber, formatCompactUsd, formatPercent } from '@/shared/utils/format'

const TILE_KEYS = [
  'countries',
  'totalPopulation',
  'averageGdp',
  'avgInflation',
  'avgUnemployment'
] as const

export type TileKey = (typeof TILE_KEYS)[number]

export type GlobalStat = {
  key: TileKey
  value: string
}

export type CountryValue = {
  id: string
  value: number
}

export type LabelledValue = {
  label: string
  value: number
}

export type GlobalOverview = {
  tiles: GlobalStat[]
  gdpByCountry: CountryValue[]
  gdpRange: string
  gdpByRegion: LabelledValue[]
  populationByRegion: LabelledValue[]
  topInflation: LabelledValue[]
  /** Alpha-2 (lowercase, e.g. `iso2` as returned by the API) -> Alpha-3 route id. */
  countryIdByAlpha2: Partial<Record<Alpha2Code, Alpha3Code>>
}

const EMPTY_OVERVIEW: GlobalOverview = {
  tiles: TILE_KEYS.map((key) => ({ key, value: '—' })),
  gdpByCountry: [],
  gdpRange: '',
  gdpByRegion: [],
  populationByRegion: [],
  topInflation: [],
  countryIdByAlpha2: {}
}

const sum = (values: number[]) => values.reduce((total, value) => total + value, 0)
const mean = (values: number[]) => (values.length ? sum(values) / values.length : 0)
const valuesOf = (ranking: RankingResponse) => ranking.data.map((row) => row.value)

async function fetchGlobalOverview({ client }: QueryFunctionContext): Promise<GlobalOverview> {
  const [countries, population, gdp, inflation, unemployment] = await Promise.all([
    client.fetchQuery(countriesQuery),
    fetchRanking(INDICATOR.population),
    fetchRanking(INDICATOR.gdp),
    fetchRanking(INDICATOR.inflation),
    fetchRanking(INDICATOR.unemployment)
  ])

  const alpha2ById = new Map(
    countries.data.map((country) => [country.id, country.iso2.toUpperCase()])
  )
  const regionById = new Map(countries.data.map((country) => [country.id, country.region.trim()]))
  const countryIdByAlpha2 = Object.fromEntries(
    countries.data.map((country) => [country.iso2, country.id])
  ) as Partial<Record<Alpha2Code, Alpha3Code>>

  const gdpByCountry = gdp.data.flatMap((row) => {
    const id = alpha2ById.get(row.countryId)
    return id ? [{ id, value: row.value }] : []
  })

  const byRegion = (ranking: RankingResponse): LabelledValue[] => {
    const totals = new Map<string, number>()
    for (const row of ranking.data) {
      const region = regionById.get(row.countryId)
      if (!region) continue
      totals.set(region, (totals.get(region) ?? 0) + row.value)
    }
    return [...totals].map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value)
  }

  const value: Record<TileKey, string> = {
    countries: String(countries.count),
    totalPopulation: formatCompactNumber(sum(valuesOf(population))),
    averageGdp: formatCompactUsd(mean(valuesOf(gdp))),
    avgInflation: formatPercent(mean(valuesOf(inflation))),
    avgUnemployment: formatPercent(mean(valuesOf(unemployment)))
  }

  const gdpValues = gdpByCountry.map((country) => country.value)
  const gdpRange = `${formatCompactUsd(Math.min(...gdpValues))} ─────── ${formatCompactUsd(Math.max(...gdpValues))}`

  const topInflation = inflation.data
    .slice(0, 8)
    .map((row) => ({ label: row.country, value: row.value }))

  return {
    tiles: TILE_KEYS.map((key) => ({ key, value: value[key] })),
    gdpByCountry,
    gdpRange,
    gdpByRegion: byRegion(gdp),
    populationByRegion: byRegion(population),
    topInflation,
    countryIdByAlpha2
  }
}

export function useGlobalStats() {
  const { data, isPending } = useQuery({
    queryKey: ['global-overview'],
    queryFn: fetchGlobalOverview
  })

  return { overview: data ?? EMPTY_OVERVIEW, isPending }
}
