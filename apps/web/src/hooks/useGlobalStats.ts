import { useQuery } from '@tanstack/react-query'

import { fetchCountries, fetchRanking, type RankingResponse } from '@/lib/statistics-api'
import { formatCompactNumber, formatCompactUsd, formatPercent } from '@/utils/format'

const INDICATOR = {
  population: 'SP.POP.TOTL',
  gdp: 'IMF.NGDPD',
  inflation: 'IMF.PCPIPCH',
  unemployment: 'IMF.LUR'
} as const

const TILE_LABELS = [
  'Countries',
  'Total population',
  'Average GDP',
  'Avg inflation',
  'Avg unemployment'
] as const

type TileLabel = (typeof TILE_LABELS)[number]

export type GlobalStat = {
  label: TileLabel
  value: string
}

export type CountryValue = {
  id: string
  value: number
}

export type GlobalOverview = {
  tiles: GlobalStat[]
  gdpByCountry: CountryValue[]
  gdpRange: string
}

const EMPTY_OVERVIEW: GlobalOverview = {
  tiles: TILE_LABELS.map((label) => ({ label, value: '—' })),
  gdpByCountry: [],
  gdpRange: ''
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

  const value: Record<TileLabel, string> = {
    Countries: String(countries.count),
    'Total population': formatCompactNumber(sum(valuesOf(population))),
    'Average GDP': formatCompactUsd(mean(valuesOf(gdp))),
    'Avg inflation': formatPercent(mean(valuesOf(inflation))),
    'Avg unemployment': formatPercent(mean(valuesOf(unemployment)))
  }

  const gdpValues = gdpByCountry.map((country) => country.value)
  const gdpRange = `${formatCompactUsd(Math.min(...gdpValues))} ─────── ${formatCompactUsd(Math.max(...gdpValues))}`

  return {
    tiles: TILE_LABELS.map((label) => ({ label, value: value[label] })),
    gdpByCountry,
    gdpRange
  }
}

export function useGlobalStats() {
  const { data, isPending } = useQuery({
    queryKey: ['global-overview'],
    queryFn: fetchGlobalOverview
  })

  return { overview: data ?? EMPTY_OVERVIEW, isPending }
}
