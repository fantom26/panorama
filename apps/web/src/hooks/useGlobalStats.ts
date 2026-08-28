import { useQuery } from '@tanstack/react-query'

import { INDICATOR } from '@/lib/indicators'
import { fetchCountries, fetchRanking, type RankingResponse } from '@/lib/statistics-api'
import { formatCompactNumber, formatCompactUsd, formatPercent } from '@/utils/format'

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
}

const EMPTY_OVERVIEW: GlobalOverview = {
  tiles: TILE_KEYS.map((key) => ({ key, value: '—' })),
  gdpByCountry: [],
  gdpRange: '',
  gdpByRegion: [],
  populationByRegion: [],
  topInflation: []
}

const sum = (values: number[]) => values.reduce((total, value) => total + value, 0)
const mean = (values: number[]) => (values.length ? sum(values) / values.length : 0)
const valuesOf = (ranking: RankingResponse) => ranking.data.map((row) => row.value)

async function fetchGlobalOverview(): Promise<GlobalOverview> {
  const [countries, population, gdp, inflation, unemployment] = await Promise.all([
    fetchCountries(),
    fetchRanking(INDICATOR.population),
    fetchRanking(INDICATOR.gdp),
    fetchRanking(INDICATOR.inflation),
    fetchRanking(INDICATOR.unemployment)
  ])

  const alpha2ById = new Map(
    countries.data.map((country) => [country.id, country.iso2.toUpperCase()])
  )
  const regionById = new Map(countries.data.map((country) => [country.id, country.region.trim()]))

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
    topInflation
  }
}

export function useGlobalStats() {
  const { data, isPending } = useQuery({
    queryKey: ['global-overview'],
    queryFn: fetchGlobalOverview
  })

  return { overview: data ?? EMPTY_OVERVIEW, isPending }
}
