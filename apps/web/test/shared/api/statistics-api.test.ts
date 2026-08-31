import { afterEach, beforeEach, describe, expect, jest, test } from '@jest/globals'

import {
  fetchCountries,
  fetchCountry,
  fetchHistory,
  fetchRanking,
  StatisticsApiError,
  StatisticsParseError,
  StatisticsResponseError
} from '@/shared/api/statistics-api'
import { INDICATOR } from '@/shared/model/indicators'

import countriesFixture from './__fixtures__/countries.json'
import countryDetailFixture from './__fixtures__/country-detail.json'
import historyFixture from './__fixtures__/history.json'
import rankingFixture from './__fixtures__/ranking.json'

type FetchResult = { ok: boolean; status: number; json: () => Promise<unknown> }

// jsdom provides no `fetch`, so there is nothing to spy on — install a mock and restore it.
const originalFetch = globalThis.fetch
const fetchMock = jest.fn<typeof fetch>()

function respondWith(body: unknown, init: Partial<FetchResult> = {}) {
  fetchMock.mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => body,
    ...init
  } as unknown as Response)
}

beforeEach(() => {
  globalThis.fetch = fetchMock as unknown as typeof fetch
  jest.spyOn(console, 'warn').mockImplementation(() => {})
  jest.spyOn(console, 'error').mockImplementation(() => {})
})

afterEach(() => {
  globalThis.fetch = originalFetch
  jest.restoreAllMocks()
})

describe('fetchCountries', () => {
  test('parses and returns every valid row', async () => {
    respondWith(countriesFixture)

    const result = await fetchCountries()

    expect(result.data).toHaveLength(countriesFixture.data.length)
    expect(result.data.map((row) => row.id)).toContain('USA')
  })

  test('drops an invalid row, keeps the rest, and warns', async () => {
    const poisoned = {
      ...countriesFixture,
      data: [{ ...countriesFixture.data[0], region: 42 }, ...countriesFixture.data.slice(1)]
    }
    respondWith(poisoned)

    const result = await fetchCountries()

    expect(result.data).toHaveLength(countriesFixture.data.length - 1)
    expect(console.warn).toHaveBeenCalled()
  })

  test('throws StatisticsResponseError when every row is invalid', async () => {
    respondWith({ ...countriesFixture, data: [{ nope: true }, { nope: true }] })

    await expect(fetchCountries()).rejects.toBeInstanceOf(StatisticsResponseError)
  })

  test('throws StatisticsResponseError when the envelope is malformed', async () => {
    respondWith({ ...countriesFixture, count: 'lots' })

    const error = await fetchCountries().catch((err: unknown) => err)
    expect(error).toBeInstanceOf(StatisticsResponseError)
    expect((error as StatisticsResponseError).issues.length).toBeGreaterThan(0)
  })

  test('throws StatisticsParseError when the body is not JSON', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => {
        throw new SyntaxError('Unexpected token < in JSON')
      }
    } as unknown as Response)

    await expect(fetchCountries()).rejects.toBeInstanceOf(StatisticsParseError)
  })

  test('throws StatisticsApiError on a non-2xx response', async () => {
    respondWith(null, { ok: false, status: 503 })

    const error = await fetchCountries().catch((err: unknown) => err)
    expect(error).toBeInstanceOf(StatisticsApiError)
    expect((error as StatisticsApiError).status).toBe(503)
  })
})

describe('the other fetchers wire their own envelope + row schemas', () => {
  test('fetchRanking', async () => {
    respondWith(rankingFixture)
    const result = await fetchRanking(INDICATOR.population)
    expect(result.indicator.id).toBe('SP.POP.TOTL')
    expect(result.data).toHaveLength(rankingFixture.data.length)
  })

  test('fetchCountry keeps `indicators` and parses each row', async () => {
    respondWith(countryDetailFixture)
    const result = await fetchCountry('USA')
    expect(result.country.id).toBe('USA')
    expect(result.indicators).toHaveLength(countryDetailFixture.indicators.length)
  })

  test('fetchHistory strips the extra top-level `meta`', async () => {
    respondWith(historyFixture)
    const result = await fetchHistory(INDICATOR.gdp, 'USA')
    expect(result).not.toHaveProperty('meta')
    expect(result.data).toHaveLength(historyFixture.data.length)
  })
})
