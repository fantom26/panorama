/**
 * @jest-environment node
 *
 * Live contract check against the real SOTW API. Opt-in only — it makes network calls, so it
 * is skipped by default and in CI. Run it deliberately to catch upstream drift:
 *
 *   SOTW_CONTRACT=1 pnpm --filter web test contract
 *
 * Runs in the `node` environment because jsdom provides no global `fetch`.
 */

import { describe, expect, test } from '@jest/globals'

import {
  countriesEnvelopeSchema,
  countryDetailEnvelopeSchema,
  countryRowSchema,
  historyEnvelopeSchema,
  historyPointSchema,
  indicatorValueSchema,
  rankingEnvelopeSchema,
  rankingRowSchema
} from './schemas'

const BASE = 'https://statisticsoftheworld.com'
const suite = process.env.SOTW_CONTRACT === '1' ? describe : describe.skip

async function getJson(path: string): Promise<unknown> {
  const response = await fetch(`${BASE}${path}`, { headers: { accept: 'application/json' } })
  expect(response.ok).toBe(true)
  return response.json()
}

suite('SOTW live contract', () => {
  test('/countries — envelope and every row', async () => {
    const envelope = countriesEnvelopeSchema.parse(await getJson('/api/v1/countries'))
    envelope.data.forEach((row) => countryRowSchema.parse(row))
    expect(envelope.data.length).toBeGreaterThan(0)
  }, 20_000)

  test('/rankings/SP.POP.TOTL — envelope and every row', async () => {
    const envelope = rankingEnvelopeSchema.parse(await getJson('/api/v1/rankings/SP.POP.TOTL'))
    envelope.data.forEach((row) => rankingRowSchema.parse(row))
    expect(envelope.data.length).toBeGreaterThan(0)
  }, 20_000)

  test('/countries/USA — envelope and every indicator', async () => {
    const envelope = countryDetailEnvelopeSchema.parse(await getJson('/api/v1/countries/USA'))
    envelope.indicators.forEach((row) => indicatorValueSchema.parse(row))
    expect(envelope.indicators.length).toBeGreaterThan(0)
  }, 20_000)

  test('/history/IMF.NGDPD/USA — envelope and every point', async () => {
    const envelope = historyEnvelopeSchema.parse(await getJson('/api/v1/history/IMF.NGDPD/USA'))
    envelope.data.forEach((point) => historyPointSchema.parse(point))
    expect(envelope.data.length).toBeGreaterThan(0)
  }, 20_000)
})
