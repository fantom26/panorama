import { useEffect } from 'react'

import { useQueries } from '@tanstack/react-query'

import { queryKeys } from '@/shared/api/query-keys'
import { type CountryRow, fetchCountry, isNotFoundError } from '@/shared/api/statistics-api'
import { type CountryStats, selectStats } from '@/shared/model/country-stats'
import { useCompareStore } from '@/shared/store/compare'
import type { Alpha3Code } from '@/shared/types/iso'

export type CompareColumn = {
  code: Alpha3Code
  country: CountryRow | null
  stats: CountryStats | null
  isPending: boolean
  isError: boolean
}

export function useCompareCountries(codes: readonly Alpha3Code[]) {
  const removeCode = useCompareStore((state) => state.remove)

  const { columns, isPending, missing } = useQueries({
    queries: codes.map((code) => ({
      queryKey: queryKeys.country(code),
      queryFn: () => fetchCountry(code)
    })),
    combine: (results) => {
      const columns: CompareColumn[] = codes.map((code, index) => {
        const result = results[index]
        return {
          code,
          country: result?.data?.country ?? null,
          stats: result?.data ? selectStats(result.data) : null,
          isPending: result?.isPending ?? true,
          isError: result?.isError ?? false
        }
      })

      const missing = results
        .map((result, index) => (isNotFoundError(result.error) ? codes[index] : undefined))
        .filter((code): code is Alpha3Code => Boolean(code))

      return { columns, isPending: results.some((result) => result.isPending), missing }
    }
  })

  const missingKey = missing.join(',')
  useEffect(() => {
    if (missingKey) missingKey.split(',').forEach((code) => removeCode(code))
  }, [missingKey, removeCode])

  return { columns, isPending }
}
