import { describe, expect, test } from '@jest/globals'

import type { CountryDetail, IndicatorValue } from '@/shared/api/statistics-api'

import { selectStats } from './country-stats'
import { INDICATOR } from './indicators'

function indicator(id: string, value: number): IndicatorValue {
  return {
    id: id as IndicatorValue['id'],
    label: id,
    category: 'Economy',
    value,
    year: 2024,
    format: 'number',
    source: 'imf'
  }
}

const country: CountryDetail['country'] = {
  id: 'DEU',
  iso2: 'de',
  name: 'Germany',
  region: 'Europe & Central Asia',
  incomeLevel: 'High income',
  capitalCity: 'Berlin'
}

describe('selectStats', () => {
  test('maps indicator ids to the matching stat fields', () => {
    const detail: CountryDetail = {
      country,
      indicators: [
        indicator(INDICATOR.population, 84_000_000),
        indicator(INDICATOR.gdp, 4_460_000_000_000),
        indicator(INDICATOR.gdpPerCapita, 52_824),
        indicator(INDICATOR.inflation, 2.1),
        indicator(INDICATOR.unemployment, 3.1),
        indicator(INDICATOR.area, 357_582)
      ]
    }

    expect(selectStats(detail)).toEqual({
      population: 84_000_000,
      area: 357_582,
      capitalCity: 'Berlin',
      gdp: 4_460_000_000_000,
      gdpPerCapita: 52_824,
      inflation: 2.1,
      unemployment: 3.1
    })
  })

  test('yields null for indicators the country is missing', () => {
    const detail: CountryDetail = {
      country: { ...country, capitalCity: null },
      indicators: [indicator(INDICATOR.gdp, 1_000)]
    }

    expect(selectStats(detail)).toEqual({
      population: null,
      area: null,
      capitalCity: null,
      gdp: 1_000,
      gdpPerCapita: null,
      inflation: null,
      unemployment: null
    })
  })
})
