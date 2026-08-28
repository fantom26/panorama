import type { CountryStats } from '@/lib/country-stats'

/** The indicator rows of the /compare matrix, in display order. */
export const COMPARE_ROW_KEYS = [
  'population',
  'gdp',
  'gdpPerCapita',
  'inflation',
  'unemployment'
] as const satisfies readonly (keyof CountryStats)[]

export type CompareRowKey = (typeof COMPARE_ROW_KEYS)[number]

export type CompareCell = {
  value: number | null
  /** `value / rowMax`, clamped to `[0, 1]`; `null` when there is no value to draw. */
  ratio: number | null
}

export type CompareRow = {
  key: CompareRowKey
  cells: CompareCell[]
}

export function buildCompareRows(columns: readonly (CountryStats | null)[]): CompareRow[] {
  return COMPARE_ROW_KEYS.map((key) => {
    const values = columns.map((stats) => {
      const value = stats?.[key]
      return typeof value === 'number' && Number.isFinite(value) ? value : null
    })

    const max = values.reduce<number>(
      (running, value) => (value !== null && value > running ? value : running),
      0
    )

    const cells: CompareCell[] = values.map((value) => {
      if (value === null) return { value: null, ratio: null }
      const ratio = max > 0 ? Math.min(Math.max(value / max, 0), 1) : 0
      return { value, ratio }
    })

    return { key, cells }
  })
}
