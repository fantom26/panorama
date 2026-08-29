import { describe, expect, test } from '@jest/globals'

import type { Country } from '@/shared/model/country'

import { selectGlobalOverview } from './global-overview'

function make(over: Partial<Country> & Pick<Country, 'id' | 'iso2'>): Country {
  return {
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

describe('selectGlobalOverview', () => {
  test('returns the empty overview for an empty list', () => {
    const overview = selectGlobalOverview([])
    expect(overview.tiles.map((tile) => tile.value)).toEqual(['—', '—', '—', '—', '—'])
    expect(overview.gdpByCountry).toEqual([])
  })

  test('derives tiles, maps and rankings from the country list', () => {
    const overview = selectGlobalOverview([
      make({
        id: 'DEU',
        iso2: 'de',
        region: 'Europe & Central Asia',
        population: 84,
        gdp: 4,
        inflation: 6
      }),
      make({
        id: 'FRA',
        iso2: 'fr',
        region: 'Europe & Central Asia',
        population: 68,
        gdp: 3,
        inflation: 5
      }),
      make({
        id: 'IND',
        iso2: 'in',
        region: 'South Asia',
        population: 1428,
        gdp: null,
        inflation: 7
      })
    ])

    expect(overview.tiles.find((tile) => tile.key === 'countries')?.value).toBe('3')

    expect(overview.gdpByCountry).toEqual([
      { id: 'DE', value: 4 },
      { id: 'FR', value: 3 }
    ])

    expect(overview.gdpByRegion).toEqual([{ label: 'Europe & Central Asia', value: 7 }])
    expect(overview.populationByRegion).toEqual([
      { label: 'South Asia', value: 1428 },
      { label: 'Europe & Central Asia', value: 152 }
    ])

    expect(overview.topInflation.map((row) => row.label)).toEqual(['IND', 'DEU', 'FRA'])

    expect(overview.countryIdByAlpha2).toEqual({ de: 'DEU', fr: 'FRA', in: 'IND' })
  })
})
