export const INCOME_LEVELS = {
  high: 'High income',
  'upper-middle': 'Upper middle income',
  'lower-middle': 'Lower middle income',
  low: 'Low income'
} as const

export type IncomeSlug = keyof typeof INCOME_LEVELS
export type IncomeLevelName = (typeof INCOME_LEVELS)[IncomeSlug]

export const INCOME_SLUGS = Object.keys(INCOME_LEVELS) as IncomeSlug[]

export const INCOME_LEVEL_ORDER = Object.values(INCOME_LEVELS) as IncomeLevelName[]

export const INCOME_SLUG_ORDER = INCOME_SLUGS

/** Unknown levels sort last. */
export function incomeRank(level: string): number {
  const index = (INCOME_LEVEL_ORDER as readonly string[]).indexOf(level)
  return index === -1 ? INCOME_LEVEL_ORDER.length : index
}

const SLUG_BY_LEVEL = Object.fromEntries(
  Object.entries(INCOME_LEVELS).map(([slug, name]) => [name, slug])
) as Record<IncomeLevelName, IncomeSlug>

export function levelFromSlug(slug: IncomeSlug): IncomeLevelName
export function levelFromSlug(slug: string): IncomeLevelName | undefined
export function levelFromSlug(slug: string): IncomeLevelName | undefined {
  return INCOME_LEVELS[slug as IncomeSlug]
}

export function slugFromLevel(level: string): IncomeSlug | undefined {
  return SLUG_BY_LEVEL[level as IncomeLevelName]
}
