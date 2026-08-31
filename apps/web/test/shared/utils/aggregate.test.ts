import { describe, expect, test } from '@jest/globals'

import { avg, groupBy, sum } from '@/shared/utils/aggregate'

describe('sum', () => {
  test('adds numbers and skips nulls', () => {
    expect(sum([1, 2, null, 3])).toBe(6)
  })

  test('is 0 for empty or all-null input', () => {
    expect(sum([])).toBe(0)
    expect(sum([null, null])).toBe(0)
  })
})

describe('avg', () => {
  test('averages only the present values', () => {
    expect(avg([2, null, 4])).toBe(3)
  })

  test('is null when nothing is present', () => {
    expect(avg([])).toBeNull()
    expect(avg([null])).toBeNull()
  })
})

describe('groupBy', () => {
  test('buckets items by the key value', () => {
    const rows = [
      { region: 'Europe', name: 'a' },
      { region: 'Asia', name: 'b' },
      { region: 'Europe', name: 'c' }
    ]

    expect(groupBy(rows, 'region')).toEqual({
      Europe: [rows[0], rows[2]],
      Asia: [rows[1]]
    })
  })
})
