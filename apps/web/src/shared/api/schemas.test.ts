import { describe, expect, test } from '@jest/globals'

import countriesFixture from './__fixtures__/countries.json'
import countryDetailFixture from './__fixtures__/country-detail.json'
import historyFixture from './__fixtures__/history.json'
import rankingFixture from './__fixtures__/ranking.json'
import {
  alpha2Schema,
  alpha3Schema,
  countriesEnvelopeSchema,
  countryDetailEnvelopeSchema,
  type CountryRow,
  countryRowSchema,
  historyEnvelopeSchema,
  historyPointSchema,
  type IndicatorFormat,
  indicatorFormatSchema,
  indicatorValueSchema,
  rankingEnvelopeSchema,
  rankingRowSchema
} from './schemas'

describe('fixtures parse against their schemas', () => {
  test('/countries', () => {
    const envelope = countriesEnvelopeSchema.parse(countriesFixture)
    for (const row of envelope.data) {
      expect(countryRowSchema.safeParse(row).success).toBe(true)
    }
  })

  test('/rankings/:indicator', () => {
    const envelope = rankingEnvelopeSchema.parse(rankingFixture)
    for (const row of envelope.data) {
      expect(rankingRowSchema.safeParse(row).success).toBe(true)
    }
  })

  test('/countries/:id', () => {
    const envelope = countryDetailEnvelopeSchema.parse(countryDetailFixture)
    for (const row of envelope.indicators) {
      expect(indicatorValueSchema.safeParse(row).success).toBe(true)
    }
  })

  test('/history/:indicator/:id — extra top-level `meta` is stripped', () => {
    const envelope = historyEnvelopeSchema.parse(historyFixture)
    expect(envelope).not.toHaveProperty('meta')
    for (const point of envelope.data) {
      expect(historyPointSchema.safeParse(point).success).toBe(true)
    }
  })
})

describe('countryRowSchema', () => {
  test('accepts the list shape (empty capital, null coords)', () => {
    const parsed = countryRowSchema.parse({
      id: 'CHI',
      iso2: 'jg',
      name: 'Channel Islands',
      region: 'Europe & Central Asia',
      incomeLevel: 'High income',
      capitalCity: '',
      latitude: null,
      longitude: null
    })
    expect(parsed.latitude).toBeNull()
  })

  test('accepts the detail shape (latitude/longitude absent)', () => {
    const parsed = countryRowSchema.parse({
      id: 'usa',
      iso2: 'US',
      name: 'United States',
      region: 'North America',
      incomeLevel: 'High income',
      capitalCity: 'Washington D.C.'
    })
    expect(parsed).toMatchObject({ id: 'USA', iso2: 'us' })
    expect(parsed.latitude).toBeUndefined()
  })

  test('drops unknown keys', () => {
    const parsed = countryRowSchema.parse({
      id: 'USA',
      iso2: 'us',
      name: 'United States',
      region: 'North America',
      incomeLevel: 'High income',
      capitalCity: 'Washington D.C.',
      population: 341_000_000
    })
    expect(parsed).not.toHaveProperty('population')
  })

  test('rejects a missing required key and a wrong-typed key', () => {
    const base = {
      id: 'USA',
      iso2: 'us',
      name: 'United States',
      region: 'North America',
      incomeLevel: 'High income',
      capitalCity: 'Washington D.C.'
    }
    expect(countryRowSchema.safeParse({ ...base, name: undefined }).success).toBe(false)
    expect(countryRowSchema.safeParse({ ...base, region: 12 }).success).toBe(false)
  })
})

describe('indicatorValueSchema', () => {
  const base = {
    id: 'IMF.NGDPD',
    label: 'GDP (Current USD)',
    category: 'Economy',
    value: 123,
    year: '2026',
    format: 'currency',
    source: 'imf'
  }

  test('preserves a null value and a null year', () => {
    const parsed = indicatorValueSchema.parse({ ...base, value: null, year: null })
    expect(parsed.value).toBeNull()
    expect(parsed.year).toBeNull()
  })

  test('accepts a numeric year', () => {
    expect(indicatorValueSchema.parse({ ...base, year: 2026 }).year).toBe(2026)
  })

  test('rejects an empty id and an unknown format', () => {
    expect(indicatorValueSchema.safeParse({ ...base, id: '' }).success).toBe(false)
    expect(indicatorValueSchema.safeParse({ ...base, format: 'bytes' }).success).toBe(false)
  })
})

describe('rankingRowSchema', () => {
  test('rejects a non-alpha-3 countryId', () => {
    const row = { rank: 1, countryId: 'us', country: 'United States', value: 1, year: '2025' }
    expect(rankingRowSchema.safeParse(row).success).toBe(false)
  })
})

describe('rankingEnvelopeSchema', () => {
  test('rejects a non-numeric count', () => {
    expect(rankingEnvelopeSchema.safeParse({ ...rankingFixture, count: '5' }).success).toBe(false)
  })
})

describe('alpha3Schema / alpha2Schema', () => {
  test('normalise case', () => {
    expect(alpha3Schema.parse('usa')).toBe('USA')
    expect(alpha2Schema.parse('US')).toBe('us')
  })

  test('reject wrong length or non-letters', () => {
    expect(alpha3Schema.safeParse('us').success).toBe(false)
    expect(alpha3Schema.safeParse('u1a').success).toBe(false)
    expect(alpha2Schema.safeParse('usa').success).toBe(false)
  })
})

describe('inferred types', () => {
  test('CountryRow is assignable from a parsed row', () => {
    const parsed: CountryRow = countryRowSchema.parse({
      id: 'USA',
      iso2: 'us',
      name: 'United States',
      region: 'North America',
      incomeLevel: 'High income',
      capitalCity: 'Washington D.C.'
    })
    expect(parsed.id).toBe('USA')
  })

  test('IndicatorFormat covers exactly the enum members', () => {
    const all: IndicatorFormat[] = ['number', 'currency', 'percent', 'ratio', 'index', 'years']
    expect([...all].sort()).toEqual([...indicatorFormatSchema.options].sort())
    // @ts-expect-error 'bytes' is not an IndicatorFormat
    const bogus: IndicatorFormat = 'bytes'
    expect(bogus).toBe('bytes')
  })
})
