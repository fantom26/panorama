import { useQuery } from '@tanstack/react-query'

import { fetchCountries, fetchRanking } from '@/lib/statistics-api'
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

const sum = (values: number[]) => values.reduce((total, value) => total + value, 0)
const mean = (values: number[]) => (values.length ? sum(values) / values.length : 0)

async function fetchGlobalStats(): Promise<GlobalStat[]> {
  const [countries, population, gdp, inflation, unemployment] = await Promise.all([
    fetchCountries(),
    fetchRanking(INDICATOR.population),
    fetchRanking(INDICATOR.gdp),
    fetchRanking(INDICATOR.inflation),
    fetchRanking(INDICATOR.unemployment)
  ])

  const values = (ranking: { data: { value: number }[] }) => ranking.data.map((row) => row.value)

  return [
    { label: 'Countries', value: String(countries.count) },
    { label: 'Total population', value: formatCompactNumber(sum(values(population))) },
    { label: 'Average GDP', value: formatCompactUsd(mean(values(gdp))) },
    { label: 'Avg inflation', value: formatPercent(mean(values(inflation))) },
    { label: 'Avg unemployment', value: formatPercent(mean(values(unemployment))) }
  ]
}

export function useGlobalStats() {
  return useQuery({
    queryKey: ['global-stats'],
    queryFn: fetchGlobalStats
  })
}
