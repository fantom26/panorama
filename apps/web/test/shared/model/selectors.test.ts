import { describe, expect, test } from '@jest/globals'

import type { Country } from '@/shared/model/country'
import {
  bucketTotals,
  selectCountryById,
  selectGlobalMetrics,
  selectIncomeLevelCountries,
  selectMemberProjection,
  selectRegionCountries,
  topByMetric
} from '@/shared/model/selectors'

function make(over: Partial<Country> & Pick<Country, 'id'>): Country {
  return {
    iso2: 'xx',
    name: over.id,
    region: 'Europe & Central Asia',
    incomeLevel: 'High income',
    capitalCity: null,
    latitude: null,
    longitude: null,
    population: null,
    gdp: null,
    gdpPerCapita: null,
    inflation: null,
    unemployment: null,
    ...over
  }
}

const LIST: Country[] = [
  make({
    id: 'DEU',
    region: 'Europe & Central Asia',
    incomeLevel: 'High income',
    population: 84,
    gdp: 4
  }),
  make({
    id: 'FRA',
    region: 'Europe & Central Asia',
    incomeLevel: 'High income',
    population: 68,
    gdp: 3
  }),
  make({
    id: 'IND',
    region: 'South Asia',
    incomeLevel: 'Lower middle income',
    population: 1428,
    gdp: null
  })
]

describe('selectCountryById', () => {
  test('returns the match or null', () => {
    expect(selectCountryById('FRA', LIST)?.id).toBe('FRA')
    expect(selectCountryById('USA', LIST)).toBeNull()
  })
})

describe('selectRegionCountries / selectIncomeLevelCountries', () => {
  test('filter by the exact display string', () => {
    expect(selectRegionCountries('South Asia', LIST).map((c) => c.id)).toEqual(['IND'])
    expect(selectIncomeLevelCountries('High income', LIST).map((c) => c.id)).toEqual(['DEU', 'FRA'])
  })
})

describe('selectGlobalMetrics', () => {
  test('counts, sums population skipping nulls, averages only present values', () => {
    const metrics = selectGlobalMetrics(LIST)

    expect(metrics.total).toBe(3)
    expect(metrics.totalPopulation).toBe(84 + 68 + 1428)
    expect(metrics.avgGdp).toBe(3.5) // IND gdp is null and excluded
    expect(metrics.avgInflation).toBeNull()
  })
})

describe('selectMemberProjection', () => {
  test('derives upper-cased alpha-2 list, id set and alpha-2 → id lookup, member order kept', () => {
    const members = [
      make({ id: 'DEU', iso2: 'de' }),
      make({ id: 'FRA', iso2: 'fr' }),
      make({ id: 'IND', iso2: 'in' })
    ]
    const projection = selectMemberProjection(members)

    expect(projection.memberAlpha2).toEqual(['DE', 'FR', 'IN'])
    expect([...projection.memberIds]).toEqual(['DEU', 'FRA', 'IND'])
    expect(projection.countryIdByAlpha2).toEqual({ de: 'DEU', fr: 'FRA', in: 'IND' })
  })
})

describe('bucketTotals', () => {
  test('counts the bucket and sums population/gdp, skipping nulls', () => {
    expect(bucketTotals(LIST)).toEqual({ count: 3, population: 84 + 68 + 1428, gdp: 7 })
    expect(bucketTotals([])).toEqual({ count: 0, population: 0, gdp: 0 })
  })
})

describe('topByMetric', () => {
  test('takes the highest `limit`, drops null values, keeps ties in input order', () => {
    expect(topByMetric(LIST, 'gdp', 5, (country, value) => ({ id: country.id, value }))).toEqual([
      { id: 'DEU', value: 4 },
      { id: 'FRA', value: 3 }
    ])
    expect(topByMetric(LIST, 'population', 1, (country) => country.id)).toEqual(['IND'])
  })
})
