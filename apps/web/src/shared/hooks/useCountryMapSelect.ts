import { useCallback, useRef } from 'react'

import { useRouter } from 'next/navigation'

import { ROUTES } from '@/shared/routes'
import type { Alpha2Code, Alpha3Code } from '@/shared/types/iso'

/** `WorldMap.onSelect` → country route. `inScope`, when passed, limits navigation to those ids. */
export function useCountryMapSelect(
  idByAlpha2: Partial<Record<Alpha2Code, Alpha3Code>>,
  inScope?: ReadonlySet<string>
) {
  const router = useRouter()
  // Kept in a ref so the returned callback stays referentially stable — `idByAlpha2` is a
  // fresh object every render, which would otherwise re-trigger the WorldMap effect.
  const latest = useRef({ idByAlpha2, inScope })
  latest.current = { idByAlpha2, inScope }

  return useCallback(
    (alpha2: string) => {
      const { idByAlpha2, inScope } = latest.current
      const id = idByAlpha2[alpha2.toLowerCase() as Alpha2Code]
      if (id && (!inScope || inScope.has(id))) router.push(ROUTES.country(id))
    },
    [router]
  )
}
