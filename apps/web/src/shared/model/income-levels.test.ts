import { describe, expect, test } from '@jest/globals'

import { INCOME_LEVELS, INCOME_SLUGS, levelFromSlug, slugFromLevel } from './income-levels'

describe('income-level slug map', () => {
  test('round-trips every tier through its slug', () => {
    for (const slug of INCOME_SLUGS) {
      const name = levelFromSlug(slug)
      expect(name).toBe(INCOME_LEVELS[slug])
      expect(slugFromLevel(name as string)).toBe(slug)
    }
  })

  test('returns undefined for unknown values', () => {
    expect(levelFromSlug('middle')).toBeUndefined()
    expect(slugFromLevel('Aggregate')).toBeUndefined()
  })
})
