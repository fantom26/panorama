import { queryOptions, useQuery } from '@tanstack/react-query'

import { queryKeys } from '@/shared/api/query-keys'
import { fetchRanking } from '@/shared/api/statistics-api'
import type { IndicatorId } from '@/shared/model/indicators'

export const rankingQuery = (indicator: IndicatorId) =>
  queryOptions({
    queryKey: queryKeys.ranking(indicator),
    queryFn: () => fetchRanking(indicator)
  })

export function useRanking(indicator: IndicatorId) {
  const { data, isPending, refetch } = useQuery({
    ...rankingQuery(indicator),
    throwOnError: true
  })

  return { ranking: data, isPending, refetch }
}
