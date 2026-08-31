import {
  type IncomeLevelOverview,
  selectIncomeLevelOverview
} from '@/features/income/model/income-overview'
import { useDashboardCountries } from '@/shared/hooks/useDashboardCountries'

export type { IncomeLevelOverview } from '@/features/income/model/income-overview'

export function useIncomeLevelOverview(levelName: string): {
  overview: IncomeLevelOverview
  isPending: boolean
  refetch: () => void
} {
  const { countries, isPending, refetch } = useDashboardCountries({ throwOnError: true })

  return { overview: selectIncomeLevelOverview(levelName, countries), isPending, refetch }
}
