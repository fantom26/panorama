import { useDashboardCountries } from '@/shared/hooks/useDashboardCountries'
import type { Country } from '@/shared/model/country'

export type DashboardOverview<T> = {
  overview: T
  isPending: boolean
  refetch: () => void
}

/**
 * Runs a pure selector over the dashboard country list. Every overview page wants the
 * same thing: the merged catalog (errors thrown to the route boundary) reduced to a
 * view model. Feature hooks wrap this with their own selector + arguments.
 */
export function useDashboardOverview<T>(select: (countries: Country[]) => T): DashboardOverview<T> {
  const { countries, isPending, refetch } = useDashboardCountries({ throwOnError: true })

  return { overview: select(countries), isPending, refetch }
}
