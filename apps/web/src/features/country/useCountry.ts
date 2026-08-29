import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@/shared/api/query-keys'
import { fetchCountry, fetchHistory } from '@/shared/api/statistics-api'
import { type CountryStats, selectStats } from '@/shared/model/country-stats'
import type { IndicatorId } from '@/shared/model/indicators'
import type { Alpha3Code } from '@/shared/types/iso'

export type { CountryStats }

export function useCountry(id: Alpha3Code) {
  const { data, isPending } = useQuery({
    queryKey: queryKeys.country(id),
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
    queryKey: queryKeys.history(id, indicator),
    queryFn: () => fetchHistory(indicator, id)
  })

  return { history: data?.data ?? [], isPending }
}
