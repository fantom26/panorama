import { queryOptions, useQuery } from '@tanstack/react-query'

import { type CountryRow, fetchCountries } from '@/shared/api/statistics-api'

const EMPTY: CountryRow[] = []

export const countriesQuery = queryOptions({
  queryKey: ['countries'],
  queryFn: fetchCountries
})

export function useCountries(enabled = true) {
  const { data, isLoading, isError } = useQuery({ ...countriesQuery, enabled })

  return { countries: data?.data ?? EMPTY, isLoading, isError }
}
