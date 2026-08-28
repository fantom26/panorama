import { useQuery } from '@tanstack/react-query'

import { INDICATOR, type IndicatorId } from '@/lib/indicators'
import { type CountryDetail, fetchCountry, fetchHistory } from '@/lib/statistics-api'
import type { Alpha3Code } from '@/types/iso'

export type CountryStats = {
  population: number | null
  area: number | null
  capitalCity: string | null
  gdp: number | null
  gdpPerCapita: number | null
  inflation: number | null
  unemployment: number | null
}

function selectStats(detail: CountryDetail): CountryStats {
  const valueById = new Map(detail.indicators.map((indicator) => [indicator.id, indicator.value]))

  return {
    population: valueById.get(INDICATOR.population) ?? null,
    area: valueById.get(INDICATOR.area) ?? null,
    capitalCity: detail.country.capitalCity,
    gdp: valueById.get(INDICATOR.gdp) ?? null,
    gdpPerCapita: valueById.get(INDICATOR.gdpPerCapita) ?? null,
    inflation: valueById.get(INDICATOR.inflation) ?? null,
    unemployment: valueById.get(INDICATOR.unemployment) ?? null
  }
}

export function useCountry(id: Alpha3Code) {
  const { data, isPending } = useQuery({
    queryKey: ['country', id],
    queryFn: () => fetchCountry(id)
  })

  return {
    country: data?.country ?? null,
    indicators: data?.indicators ?? [],
    stats: data ? selectStats(data) : null,
    isPending
  }
}

export function useCountryHistory(id: Alpha3Code, indicator: IndicatorId) {
  const { data, isPending } = useQuery({
    queryKey: ['history', id, indicator],
    queryFn: () => fetchHistory(indicator, id)
  })

  return { history: data?.data ?? [], isPending }
}
