import { useDashboardCountries } from '@/shared/hooks/useDashboardCountries'

import { type GlobalOverview, selectGlobalOverview } from './global-overview'

export type { GlobalOverview, GlobalStat, LabelledValue, TileKey } from './global-overview'

/**
 * Home-dashboard view model. Derives everything from the shared `useDashboardCountries()`
 * dataset via `selectGlobalOverview` — no query of its own, so it costs no extra requests.
 */
export function useGlobalStats(): { overview: GlobalOverview; isPending: boolean } {
  const { countries, isPending } = useDashboardCountries()

  return { overview: selectGlobalOverview(countries), isPending }
}
