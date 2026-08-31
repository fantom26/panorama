import { type RegionOverview, selectRegionOverview } from '@/features/region/model/region-overview'
import { useDashboardCountries } from '@/shared/hooks/useDashboardCountries'

export type { RegionOverview } from '@/features/region/model/region-overview'

export function useRegionOverview(regionName: string): {
  overview: RegionOverview
  isPending: boolean
  refetch: () => void
} {
  const { countries, isPending, refetch } = useDashboardCountries({ throwOnError: true })

  return { overview: selectRegionOverview(regionName, countries), isPending, refetch }
}
