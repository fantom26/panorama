import { type GlobalOverview, selectGlobalOverview } from '@/features/global/model/global-overview'
import { useDashboardCountries } from '@/shared/hooks/useDashboardCountries'

export type {
  GlobalOverview,
  GlobalStat,
  LabelledValue,
  TileKey
} from '@/features/global/model/global-overview'

export function useGlobalStats(): {
  overview: GlobalOverview
  isPending: boolean
  refetch: () => void
} {
  const { countries, isPending, refetch } = useDashboardCountries({ throwOnError: true })

  return { overview: selectGlobalOverview(countries), isPending, refetch }
}
