import { useQuery } from '@tanstack/react-query'

import { type CountryStats, selectStats } from '@/lib/country-stats'
import type { IndicatorId } from '@/lib/indicators'
import { fetchCountry, fetchHistory } from '@/lib/statistics-api'
import type { Alpha3Code } from '@/types/iso'

export type { CountryStats }

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
