import { selectIncomeLevelOverview } from '@/features/income/model/income-overview'
import { useDashboardOverview } from '@/shared/hooks/useDashboardOverview'

export type { IncomeLevelOverview } from '@/features/income/model/income-overview'

export function useIncomeLevelOverview(levelName: string, regionName?: string) {
  return useDashboardOverview((countries) =>
    selectIncomeLevelOverview(levelName, countries, regionName)
  )
}
