import { describe, expect, test } from '@jest/globals'

import type { CountryRow, RankingResponse } from '@/shared/api/statistics-api'
import type { Alpha3Code } from '@/shared/types/iso'

import { mergeRankingsIntoCountries } from './country'

function row(over: Partial<CountryRow> = {}): CountryRow {
  return {
    id: 'USA',
    iso2: 'us',
    name: 'United States',
    region: 'North America',
    incomeLevel: 'High income',
    capitalCity: 'Washington, D.C.',
    latitude: '38.8951',
    longitude: '-77.0364',
    ...over
  }
}

function ranking(entries: Array<[countryId: Alpha3Code, value: number]>): RankingResponse {
  return {
    indicator: { id: 'X', label: 'X', category: 'Economy', format: 'number', source: 'imf' },
    count: entries.length,
    total: entries.length,
    data: entries.map(([countryId, value], index) => ({
      rank: index + 1,
      countryId,
      country: countryId,
      value,
      year: '2026'
    }))
  }
}

describe('mergeRankingsIntoCountries', () => {
  test('keeps every catalog row and leaves metrics null when no rankings are given', () => {
    const result = mergeRankingsIntoCountries([row(), row({ id: 'DEU', iso2: 'de' })], {})

    expect(result).toHaveLength(2)
    expect(result[0]).toMatchObject({ id: 'USA', gdp: null, population: null, inflation: null })
  })

  test('left-joins each ranking by countryId', () => {
    const result = mergeRankingsIntoCountries([row(), row({ id: 'DEU', iso2: 'de' })], {
      gdp: ranking([['USA', 30_000]]),
      inflation: ranking([['DEU', 2.1]])
    })

    expect(result[0]).toMatchObject({ id: 'USA', gdp: 30_000, inflation: null })
    expect(result[1]).toMatchObject({ id: 'DEU', gdp: null, inflation: 2.1 })
  })

  test('coerces coordinate strings to numbers and non-numeric ones to null', () => {
    const [parsed] = mergeRankingsIntoCountries([row()], {})
    expect(parsed).toMatchObject({ latitude: 38.8951, longitude: -77.0364 })

    const [missing] = mergeRankingsIntoCountries([row({ latitude: null, longitude: 'n/a' })], {})
    expect(missing).toMatchObject({ latitude: null, longitude: null })
  })
})
