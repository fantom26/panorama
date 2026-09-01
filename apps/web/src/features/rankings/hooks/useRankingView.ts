import { selectRankingView } from '@/features/rankings/model/ranking-view'
import { useCountries } from '@/shared/hooks/useCountries'
import { useRanking } from '@/shared/hooks/useRanking'
import type { IndicatorId } from '@/shared/model/indicators'

export function useRankingView(indicator: IndicatorId, limit?: number) {
  const { ranking, isPending, refetch } = useRanking(indicator)
  // Ranking rows carry alpha-3 only; the catalog supplies the alpha-2 the flags need.
  const { countries } = useCountries()

  return { view: selectRankingView(ranking, countries, limit), isPending, refetch }
}
