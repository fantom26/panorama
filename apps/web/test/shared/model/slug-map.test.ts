import { describe, expect, test } from '@jest/globals'

import { createSlugMap } from '@/shared/model/slug-map'

const MAP = createSlugMap({
  high: 'High income',
  low: 'Low income'
} as const)

describe('createSlugMap', () => {
  test('exposes keys and values in declaration order', () => {
    expect(MAP.keys).toEqual(['high', 'low'])
    expect(MAP.values).toEqual(['High income', 'Low income'])
  })

  test('forward looks up a value by key, reverse looks up a key by value', () => {
    expect(MAP.forward('high')).toBe('High income')
    expect(MAP.reverse('Low income')).toBe('low')
  })

  test('returns undefined for unknown keys and values', () => {
    expect(MAP.forward('middle')).toBeUndefined()
    expect(MAP.reverse('Aggregate')).toBeUndefined()
    expect(MAP.forward('toString')).toBeUndefined()
  })
})
