/**
 * `?countries=DEU,FRA,GBR` <-> `Alpha3Code[]` for the `/compare` page. The URL is a
 * shareable projection of the compare-list store, not its source of truth.
 */
import type { Alpha3Code } from '@/shared/types/iso'

import { normalizeCodes } from './store'

export function parseCompareParam(value: string | null | undefined): Alpha3Code[] {
  if (!value) return []
  return normalizeCodes(value.split(','))
}

export function serializeCompareParam(codes: readonly Alpha3Code[]): string {
  return codes.join(',')
}
