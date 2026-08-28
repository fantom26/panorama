import { queryOptions, useQuery } from '@tanstack/react-query'

import { type CountryRow, fetchCountries } from '@/shared/api/statistics-api'

const EMPTY: CountryRow[] = []

/** Shared so `useGlobalStats` can pull the same cached response instead of re-fetching it. */
export const countriesQuery = queryOptions({
  queryKey: ['countries'],
  queryFn: fetchCountries
})

/**
 * Full country list from the SotW API. Fetched lazily (`enabled`) so the
 * always-mounted header search doesn't spend a request on every page load;
 * once fetched it stays cached for the session (`staleTime: Infinity`).
 */
export function useCountries(enabled = true) {
  const { data, isLoading, isError } = useQuery({ ...countriesQuery, enabled })

  return { countries: data?.data ?? EMPTY, isLoading, isError }
}
