import { notFound } from 'next/navigation'

import { alpha3Schema } from '@/shared/api/schemas'
import { isNotFoundError } from '@/shared/api/statistics-api'
import type { Alpha3Code } from '@/shared/types/iso'

export function assertCountryId(id: string): asserts id is Alpha3Code {
  if (!alpha3Schema.safeParse(id).success) {
    notFound()
  }
}

export function assertFound(error: unknown): void {
  if (isNotFoundError(error)) {
    notFound()
  }
}
