import { selectRegionOverview } from '@/features/region/model/region-overview'
import { useDashboardOverview } from '@/shared/hooks/useDashboardOverview'

export type { RegionOverview } from '@/features/region/model/region-overview'

export function useRegionOverview(regionName: string, levelName?: string) {
  return useDashboardOverview((countries) => selectRegionOverview(regionName, countries, levelName))
}
