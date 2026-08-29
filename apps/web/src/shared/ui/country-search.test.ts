import { describe, expect, test } from '@jest/globals'

import type { CountryRow } from '@/shared/api/statistics-api'

import { filterCountries, moveActiveIndex } from './country-search'

function country(overrides: Partial<CountryRow> & Pick<CountryRow, 'id' | 'name'>): CountryRow {
  return {
    iso2: 'xx',
    region: 'Region',
    incomeLevel: 'High income',
    capitalCity: null,
    ...overrides
  }
}

const COUNTRIES = [
  country({ id: 'GHA', name: 'Ghana' }),
  country({ id: 'DEU', name: 'Germany' }),
  country({ id: 'BRA', name: 'Brazil' }),
  country({ id: 'GEO', name: 'Georgia' })
]

describe('filterCountries', () => {
  test('empty query returns every country, sorted A→Z', () => {
    expect(filterCountries(COUNTRIES, '').map((c) => c.name)).toEqual([
      'Brazil',
      'Georgia',
      'Germany',
      'Ghana'
    ])
  })

  test('whitespace-only query is treated as empty', () => {
    expect(filterCountries(COUNTRIES, '   ')).toHaveLength(COUNTRIES.length)
  })

  test('matches a case-insensitive substring of the name, still sorted', () => {
    expect(filterCountries(COUNTRIES, 'ge').map((c) => c.name)).toEqual(['Georgia', 'Germany'])
    expect(filterCountries(COUNTRIES, 'GEOR').map((c) => c.name)).toEqual(['Georgia'])
  })

  test('no match returns an empty array', () => {
    expect(filterCountries(COUNTRIES, 'zzz')).toEqual([])
  })

  test('does not mutate the input array', () => {
    const input = [...COUNTRIES]
    filterCountries(input, '')
    expect(input).toEqual(COUNTRIES)
  })
})

describe('moveActiveIndex', () => {
  test('moves within bounds', () => {
    expect(moveActiveIndex(0, 1, 4)).toBe(1)
    expect(moveActiveIndex(3, -1, 4)).toBe(2)
  })

  test('clamps at the first and last row', () => {
    expect(moveActiveIndex(0, -1, 4)).toBe(0)
    expect(moveActiveIndex(3, 1, 4)).toBe(3)
  })

  test('stays at 0 for an empty list', () => {
    expect(moveActiveIndex(0, 1, 0)).toBe(0)
    expect(moveActiveIndex(0, -1, 0)).toBe(0)
  })
})
