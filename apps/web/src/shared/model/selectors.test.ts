import { describe, expect, test } from '@jest/globals'

import type { Country } from './country'
import {
  selectCountryById,
  selectGlobalMetrics,
  selectIncomeLevelCountries,
  selectRegionCountries
} from './selectors'

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
  test('counts, sums population skipping nulls, averages only present values, groups', () => {
    const metrics = selectGlobalMetrics(LIST)

    expect(metrics.total).toBe(3)
    expect(metrics.totalPopulation).toBe(84 + 68 + 1428)
    expect(metrics.avgGdp).toBe(3.5) // IND gdp is null and excluded
    expect(metrics.avgInflation).toBeNull()
    expect(Object.keys(metrics.byRegion)).toEqual(['Europe & Central Asia', 'South Asia'])
    expect(metrics.byRegion['Europe & Central Asia']).toHaveLength(2)
  })
})
