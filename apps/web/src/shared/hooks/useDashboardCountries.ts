import { type QueryFunctionContext, queryOptions, useQuery } from '@tanstack/react-query'

import { queryKeys } from '@/shared/api/query-keys'
import { fetchRanking } from '@/shared/api/statistics-api'
import { countriesQuery } from '@/shared/hooks/useCountries'
import { type Country, mergeRankingsIntoCountries } from '@/shared/model/country'
import { INDICATOR } from '@/shared/model/indicators'

const EMPTY: Country[] = []

/**
 * The home dashboard base dataset: the country catalog left-joined with the five
 * DASHBOARD_INDICATORS rankings. Reuses `countriesQuery` via `client.fetchQuery` so the
 * catalog request is shared with the search modal and never fetched twice.
 */
async function fetchDashboardCountries({ client }: QueryFunctionContext): Promise<Country[]> {
  const [catalog, population, gdp, gdpPerCapita, inflation, unemployment] = await Promise.all([
    client.fetchQuery(countriesQuery),
    fetchRanking(INDICATOR.population),
    fetchRanking(INDICATOR.gdp),
    fetchRanking(INDICATOR.gdpPerCapita),
    fetchRanking(INDICATOR.inflation),
    fetchRanking(INDICATOR.unemployment)
  ])

  return mergeRankingsIntoCountries(catalog.data, {
    population,
    gdp,
    gdpPerCapita,
    inflation,
    unemployment
  })
}

export const dashboardCountriesQuery = queryOptions({
  queryKey: queryKeys.dashboard,
  queryFn: fetchDashboardCountries
})

type UseDashboardCountriesOptions = {
  /** Throw on fetch failure so a wrapping <ErrorBoundary> renders instead of a silent empty list. */
  throwOnError?: boolean
}

export function useDashboardCountries({ throwOnError = false }: UseDashboardCountriesOptions = {}) {
  const { data, isPending, isError, refetch } = useQuery({
    ...dashboardCountriesQuery,
    throwOnError
  })

  return { countries: data ?? EMPTY, isPending, isError, refetch }
}
