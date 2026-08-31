import { useDashboardCountries } from '@/shared/hooks/useDashboardCountries'

import { type RegionOverview, selectRegionOverview } from '../model/region-overview'

export type { RegionOverview } from '../model/region-overview'

export function useRegionOverview(regionName: string): {
  overview: RegionOverview
  isPending: boolean
  refetch: () => void
} {
  const { countries, isPending, refetch } = useDashboardCountries({ throwOnError: true })

  return { overview: selectRegionOverview(regionName, countries), isPending, refetch }
}
