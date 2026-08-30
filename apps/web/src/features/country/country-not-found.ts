import { notFound } from 'next/navigation'

import { alpha3Schema } from '@/shared/api/schemas'
import { StatisticsApiError } from '@/shared/api/statistics-api'
import type { Alpha3Code } from '@/shared/types/iso'

/**
 * Route-guard helpers for `/countries/[id]`, kept out of the component so they can be
 * unit-tested in isolation. Both call Next's `notFound()`, which throws.
 */

/** A route param that isn't a well-formed ISO alpha-3 code can't be a country. */
export function assertCountryId(id: string): asserts id is Alpha3Code {
  if (!alpha3Schema.safeParse(id).success) {
    notFound()
  }
}

/** A 404 from the Statistics API means the id is well-formed but unknown. */
export function assertFound(error: unknown): void {
  if (error instanceof StatisticsApiError && error.status === 404) {
    notFound()
  }
}
