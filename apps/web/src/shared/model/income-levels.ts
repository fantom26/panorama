import { createSlugMap } from '@/shared/model/slug-map'

export const INCOME_LEVELS = {
  high: 'High income',
  'upper-middle': 'Upper middle income',
  'lower-middle': 'Lower middle income',
  low: 'Low income'
} as const

export type IncomeSlug = keyof typeof INCOME_LEVELS
export type IncomeLevelName = (typeof INCOME_LEVELS)[IncomeSlug]

const levels = createSlugMap(INCOME_LEVELS)

export const INCOME_SLUGS = levels.keys

/** Display names, richest → poorest (the declaration order of `INCOME_LEVELS`). */
export const INCOME_LEVEL_ORDER = levels.values

export const INCOME_SLUG_ORDER = INCOME_SLUGS

/** Unknown levels sort last. */
export function incomeRank(level: string): number {
  const index = (INCOME_LEVEL_ORDER as readonly string[]).indexOf(level)
  return index === -1 ? INCOME_LEVEL_ORDER.length : index
}

export function levelFromSlug(slug: IncomeSlug): IncomeLevelName
export function levelFromSlug(slug: string): IncomeLevelName | undefined
export function levelFromSlug(slug: string): IncomeLevelName | undefined {
  return levels.forward(slug)
}

export function slugFromLevel(level: string): IncomeSlug | undefined {
  return levels.reverse(level)
}
