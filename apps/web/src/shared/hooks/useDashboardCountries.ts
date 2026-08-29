import { type QueryFunctionContext, queryOptions, useQuery } from '@tanstack/react-query'

import { queryKeys } from '@/shared/api/query-keys'
import { fetchRanking } from '@/shared/api/statistics-api'
import { countriesQuery } from '@/shared/hooks/useCountries'
import { type Country, mergeRankingsIntoCountries } from '@/shared/model/country'
import { INDICATOR } from '@/shared/model/indicators'

const EMPTY: Country[] = []

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
  throwOnError?: boolean
}

export function useDashboardCountries({ throwOnError = false }: UseDashboardCountriesOptions = {}) {
  const { data, isPending, isError, refetch } = useQuery({
    ...dashboardCountriesQuery,
    throwOnError
  })

  return { countries: data ?? EMPTY, isPending, isError, refetch }
}
