import { describe, expect, test } from '@jest/globals'

import type { Country } from '@/shared/model/country'

import { EMPTY_REGION_OVERVIEW, selectRegionOverview } from './region-overview'

function make(over: Partial<Omit<Country, 'id' | 'iso2'>> & { id: string; iso2: string }): Country {
  return {
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
    ...over,
    id: over.id as Country['id'],
    iso2: over.iso2 as Country['iso2'],
    name: over.name ?? over.id
  }
}

const EUROPE = 'Europe & Central Asia'

describe('selectRegionOverview', () => {
  test('returns the empty overview when the region has no members', () => {
    expect(selectRegionOverview('South Asia', [make({ id: 'DEU', iso2: 'de' })])).toBe(
      EMPTY_REGION_OVERVIEW
    )
    expect(selectRegionOverview(EUROPE, [])).toBe(EMPTY_REGION_OVERVIEW)
  })

  test('derives the map scope, id lookup and income breakdown from the members', () => {
    const overview = selectRegionOverview(EUROPE, [
      make({
        id: 'DEU',
        iso2: 'de',
        incomeLevel: 'High income',
        population: 84,
        gdp: 4,
        gdpPerCapita: 54_000,
        inflation: 6
      }),
      make({
        id: 'FRA',
        iso2: 'fr',
        incomeLevel: 'High income',
        population: 68,
        gdp: 3,
        gdpPerCapita: 44_000,
        inflation: 4
      }),
      make({
        id: 'UKR',
        iso2: 'ua',
        incomeLevel: 'Lower middle income',
        population: 38,
        gdp: null,
        gdpPerCapita: 5_000,
        inflation: null
      }),
      make({ id: 'IND', iso2: 'in', region: 'South Asia', incomeLevel: 'Lower middle income' })
    ])

    expect(overview.tiles.find((tile) => tile.key === 'countries')?.value).toBe('3')
    expect(overview.tiles.every((tile) => tile.value !== '—')).toBe(true)

    expect(overview.memberAlpha2).toEqual(['DE', 'FR', 'UA'])
    expect([...overview.memberIds]).toEqual(['DEU', 'FRA', 'UKR'])
    expect(overview.countryIdByAlpha2).toEqual({ de: 'DEU', fr: 'FRA', ua: 'UKR' })

    expect(overview.incomeBreakdown).toEqual([
      { level: 'High income', slug: 'high', count: 2, population: 152, gdp: 7 },
      { level: 'Lower middle income', slug: 'lower-middle', count: 1, population: 38, gdp: 0 }
    ])

    expect(overview.topGdpPerCapita).toEqual([
      { id: 'DEU', label: 'DEU', value: 54_000 },
      { id: 'FRA', label: 'FRA', value: 44_000 },
      { id: 'UKR', label: 'UKR', value: 5_000 }
    ])
  })

  test('orders the income breakdown high → low and caps top economies at 10', () => {
    const members = Array.from({ length: 12 }, (_, index) =>
      make({
        id: `C${index}`,
        iso2: `x${index}`,
        incomeLevel: index % 2 === 0 ? 'Low income' : 'High income',
        gdpPerCapita: (index + 1) * 1_000
      })
    )

    const overview = selectRegionOverview(EUROPE, members)

    expect(overview.incomeBreakdown.map((row) => row.level)).toEqual(['High income', 'Low income'])
    expect(overview.topGdpPerCapita).toHaveLength(10)
    expect(overview.topGdpPerCapita[0]).toEqual({ id: 'C11', label: 'C11', value: 12_000 })
  })
})
