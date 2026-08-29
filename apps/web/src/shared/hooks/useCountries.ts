import { queryOptions, useQuery } from '@tanstack/react-query'

import { queryKeys } from '@/shared/api/query-keys'
import { type CountryRow, fetchCountries } from '@/shared/api/statistics-api'

const EMPTY: CountryRow[] = []

export const countriesQuery = queryOptions({
  queryKey: queryKeys.catalog,
  queryFn: fetchCountries
})

export function useCountries(enabled = true) {
  const { data, isLoading, isError } = useQuery({ ...countriesQuery, enabled })

  return { countries: data?.data ?? EMPTY, isLoading, isError }
}
