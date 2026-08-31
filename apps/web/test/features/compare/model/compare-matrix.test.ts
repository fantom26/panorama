import { describe, expect, test } from '@jest/globals'

import {
  buildCompareRows,
  type CompareRow,
  type CompareRowKey
} from '@/features/compare/model/compare-matrix'
import type { CountryStats } from '@/shared/model/country-stats'

function stats(overrides: Partial<CountryStats>): CountryStats {
  return {
    population: null,
    area: null,
    capitalCity: null,
    gdp: null,
    gdpPerCapita: null,
    inflation: null,
    unemployment: null,
    ...overrides
  }
}

function cells(rows: CompareRow[], key: CompareRowKey) {
  const row = rows.find((entry) => entry.key === key)
  if (!row) throw new Error(`missing row: ${key}`)
  return row.cells
}

describe('buildCompareRows', () => {
  test('emits one row per indicator with value and share of the row max', () => {
    const rows = buildCompareRows([
      stats({ population: 84_000_000, gdp: 4_000_000_000_000 }),
      stats({ population: 42_000_000, gdp: 2_000_000_000_000 })
    ])

    expect(cells(rows, 'population')).toEqual([
      { value: 84_000_000, ratio: 1 },
      { value: 42_000_000, ratio: 0.5 }
    ])
  })

  test('a missing value produces a null cell and never a bar', () => {
    const rows = buildCompareRows([stats({ population: 10 }), stats({ population: null })])

    expect(cells(rows, 'population')).toEqual([
      { value: 10, ratio: 1 },
      { value: null, ratio: null }
    ])
  })

  test('a single non-null column fills its bar', () => {
    expect(cells(buildCompareRows([stats({ population: 999 })]), 'population')).toEqual([
      { value: 999, ratio: 1 }
    ])
  })

  test('an all-null row has no bars and no divide-by-zero', () => {
    expect(cells(buildCompareRows([stats({}), stats({})]), 'population')).toEqual([
      { value: null, ratio: null },
      { value: null, ratio: null }
    ])
  })

  test('negative values clamp to a zero-width bar', () => {
    const rows = buildCompareRows([stats({ inflation: -1.2 }), stats({ inflation: 3 })])

    expect(cells(rows, 'inflation')).toEqual([
      { value: -1.2, ratio: 0 },
      { value: 3, ratio: 1 }
    ])
  })
})
