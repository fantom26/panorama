import { describe, expect, test } from '@jest/globals'

import {
  EMPTY_INCOME_LEVEL_OVERVIEW,
  selectIncomeLevelOverview
} from '@/features/income/model/income-overview'
import type { Country } from '@/shared/model/country'

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

const HIGH = 'High income'

describe('selectIncomeLevelOverview', () => {
  test('returns the empty overview when the tier has no members', () => {
    expect(selectIncomeLevelOverview('Low income', [make({ id: 'DEU', iso2: 'de' })])).toBe(
      EMPTY_INCOME_LEVEL_OVERVIEW
    )
    expect(selectIncomeLevelOverview(HIGH, [])).toBe(EMPTY_INCOME_LEVEL_OVERVIEW)
  })

  test('derives tiles, map scope, region breakdown and cards from the members', () => {
    const overview = selectIncomeLevelOverview(HIGH, [
      make({
        id: 'DEU',
        iso2: 'de',
        region: 'Europe & Central Asia',
        population: 84,
        gdp: 4,
        gdpPerCapita: 54_000,
        inflation: 6
      }),
      make({
        id: 'USA',
        iso2: 'us',
        region: 'North America',
        population: 335,
        gdp: 27,
        gdpPerCapita: 80_000,
        inflation: 4
      }),
      make({
        id: 'FRA',
        iso2: 'fr',
        region: 'Europe & Central Asia',
        population: 68,
        gdp: 3,
        gdpPerCapita: 44_000,
        inflation: 5
      }),
      make({ id: 'IND', iso2: 'in', region: 'South Asia', incomeLevel: 'Lower middle income' })
    ])

    expect(overview.tiles.find((tile) => tile.key === 'economies')?.value).toBe('3')
    expect(overview.tiles.every((tile) => tile.value !== '—')).toBe(true)

    expect(overview.memberAlpha2).toEqual(['DE', 'US', 'FR'])
    expect([...overview.memberIds]).toEqual(['DEU', 'USA', 'FRA'])
    expect(overview.countryIdByAlpha2).toEqual({ de: 'DEU', us: 'USA', fr: 'FRA' })
    expect(overview.mapData).toEqual([
      { id: 'DE', value: 54_000 },
      { id: 'US', value: 80_000 },
      { id: 'FR', value: 44_000 }
    ])

    // region breakdown sorted by count desc, with resolvable slugs
    expect(overview.regionBreakdown).toEqual([
      {
        region: 'Europe & Central Asia',
        slug: 'europe-central-asia',
        count: 2,
        population: 152,
        gdp: 7
      },
      { region: 'North America', slug: 'north-america', count: 1, population: 335, gdp: 27 }
    ])

    // cards sorted by GDP per capita desc
    expect(overview.cards.map((card) => card.id)).toEqual(['USA', 'DEU', 'FRA'])
  })

  test('cards with no GDP per capita sort last', () => {
    const overview = selectIncomeLevelOverview(HIGH, [
      make({ id: 'AAA', iso2: 'aa', gdpPerCapita: null }),
      make({ id: 'BBB', iso2: 'bb', gdpPerCapita: 10_000 })
    ])
    expect(overview.cards.map((card) => card.id)).toEqual(['BBB', 'AAA'])
  })
})
