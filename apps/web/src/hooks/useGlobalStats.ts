import { useQuery } from '@tanstack/react-query'

import { fetchCountries, fetchRanking, type RankingResponse } from '@/lib/statistics-api'
import { formatCompactNumber, formatCompactUsd, formatPercent } from '@/utils/format'

/** Indicator codes on the Statistics of the World API. */
const INDICATOR = {
  population: 'SP.POP.TOTL',
  gdp: 'IMF.NGDPD',
  inflation: 'IMF.PCPIPCH',
  unemployment: 'IMF.LUR'
} as const

export type GlobalStat = {
  label: string
  value: string
}

/** One row per country for the GDP choropleth, keyed by ISO 3166-1 alpha-2 (WorldMap's id). */
export type CountryValue = {
  id: string
  value: number
}

export type GlobalOverview = {
  tiles: GlobalStat[]
  gdpByCountry: CountryValue[]
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

  const gdpByCountry = gdp.data.flatMap((row) => {
    const id = alpha2ById.get(row.countryId)
    return id ? [{ id, value: row.value }] : []
  })

  const tiles: GlobalStat[] = [
    { label: 'Countries', value: String(countries.count) },
    { label: 'Total population', value: formatCompactNumber(sum(valuesOf(population))) },
    { label: 'Average GDP', value: formatCompactUsd(mean(valuesOf(gdp))) },
    { label: 'Avg inflation', value: formatPercent(mean(valuesOf(inflation))) },
    { label: 'Avg unemployment', value: formatPercent(mean(valuesOf(unemployment))) }
  ]

  return { tiles, gdpByCountry }
}

export function useGlobalStats() {
  return useQuery({
    queryKey: ['global-overview'],
    queryFn: fetchGlobalOverview
  })
}
