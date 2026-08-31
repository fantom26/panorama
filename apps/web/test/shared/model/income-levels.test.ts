import { describe, expect, test } from '@jest/globals'

import {
  INCOME_LEVEL_ORDER,
  INCOME_LEVELS,
  INCOME_SLUG_ORDER,
  INCOME_SLUGS,
  incomeRank,
  levelFromSlug,
  slugFromLevel
} from '@/shared/model/income-levels'

describe('income-level slug map', () => {
  test('round-trips every tier through its slug', () => {
    for (const slug of INCOME_SLUGS) {
      const name = levelFromSlug(slug)
      expect(name).toBe(INCOME_LEVELS[slug])
      expect(slugFromLevel(name)).toBe(slug)
    }
  })

  test('returns undefined for unknown values', () => {
    expect(levelFromSlug('middle')).toBeUndefined()
    expect(slugFromLevel('Aggregate')).toBeUndefined()
  })
})

describe('income-level ordering', () => {
  test('order arrays run richest → poorest and stay in sync', () => {
    expect(INCOME_LEVEL_ORDER).toEqual([
      'High income',
      'Upper middle income',
      'Lower middle income',
      'Low income'
    ])
    expect(INCOME_SLUG_ORDER).toEqual(['high', 'upper-middle', 'lower-middle', 'low'])
  })

  test('incomeRank indexes known levels and sorts unknowns last', () => {
    expect(incomeRank('High income')).toBe(0)
    expect(incomeRank('Low income')).toBe(3)
    expect(incomeRank('Not classified')).toBe(INCOME_LEVEL_ORDER.length)
  })
})
