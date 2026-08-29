/**
 * Zod schemas for every Statistics of the World response we consume.
 *
 * Written against real payloads captured from https://statisticsoftheworld.com (Aug 2026).
 * Notable gaps between the API and the previous hand-written types:
 *   - `/countries/:id` omits `latitude`/`longitude` on the `country` object (the list keeps them).
 *   - ranking `indicator` meta carries a `format` field.
 *   - per-country indicator `year` is always a string; `value` is a number (kept nullable for
 *     sparse countries).
 *   - `/history` responses carry an extra top-level `meta` object we don't use (stripped).
 *
 * Objects use Zod's default `.strip()` so additive API changes pass; shape/type breaks fail.
 */

import { z } from 'zod'

import type { Alpha2Code, Alpha3Code } from '@/shared/types/iso'

/** ISO 3166-1 alpha-3, normalised to uppercase. Keeps the branded output type. */
export const alpha3Schema = z
  .string()
  .regex(/^[A-Za-z]{3}$/, 'expected ISO 3166-1 alpha-3 code')
  .transform((code) => code.toUpperCase() as Alpha3Code)

/** ISO 3166-1 alpha-2, normalised to lowercase. */
export const alpha2Schema = z
  .string()
  .regex(/^[A-Za-z]{2}$/, 'expected ISO 3166-1 alpha-2 code')
  .transform((code) => code.toLowerCase() as Alpha2Code)

/** SOTW's `format` discriminator — the single source of truth for `IndicatorFormat`. */
export const indicatorFormatSchema = z.enum([
  'number',
  'currency',
  'percent',
  'ratio',
  'index',
  'years'
])
export type IndicatorFormat = z.infer<typeof indicatorFormatSchema>

// ── row schemas (parsed one at a time; see statistics-api.ts::parseRows) ──────────

export const countryRowSchema = z.object({
  id: alpha3Schema,
  iso2: alpha2Schema,
  name: z.string(),
  region: z.string(),
  incomeLevel: z.string(),
  capitalCity: z.string().nullable(),
  // Present (string) or null on the list endpoint; absent on `/countries/:id`.
  latitude: z.string().nullable().optional(),
  longitude: z.string().nullable().optional()
})

export const indicatorValueSchema = z.object({
  id: z.string().min(1),
  label: z.string(),
  category: z.string(),
  value: z.number().nullable(),
  year: z.union([z.number(), z.string()]).nullable(),
  format: indicatorFormatSchema,
  source: z.string()
})

export const rankingRowSchema = z.object({
  rank: z.number(),
  countryId: alpha3Schema,
  country: z.string(),
  value: z.number(),
  year: z.string()
})

export const historyPointSchema = z.object({
  year: z.number(),
  value: z.number()
})

// ── envelope schemas: strict on the wrapper, `data` left raw for per-row parsing ──

const rawRows = z.array(z.unknown())

const rankingIndicatorMetaSchema = z.object({
  id: z.string(),
  label: z.string(),
  category: z.string(),
  format: indicatorFormatSchema,
  source: z.string()
})

const historyIndicatorMetaSchema = z.object({
  id: z.string(),
  label: z.string(),
  format: indicatorFormatSchema,
  source: z.string()
})

export const countriesEnvelopeSchema = z.object({
  count: z.number(),
  total: z.number(),
  data: rawRows
})

export const rankingEnvelopeSchema = z.object({
  indicator: rankingIndicatorMetaSchema,
  count: z.number(),
  total: z.number(),
  data: rawRows
})

export const countryDetailEnvelopeSchema = z.object({
  country: countryRowSchema,
  indicators: rawRows
})

export const historyEnvelopeSchema = z.object({
  indicator: historyIndicatorMetaSchema,
  country: alpha3Schema,
  count: z.number(),
  data: rawRows
})

// ── public response types: names identical to the previous hand-written ones ──────

export type CountryRow = z.infer<typeof countryRowSchema>
export type IndicatorValue = z.infer<typeof indicatorValueSchema>
export type RankingRow = z.infer<typeof rankingRowSchema>
export type HistoryPoint = z.infer<typeof historyPointSchema>

export type CountriesResponse = Omit<z.infer<typeof countriesEnvelopeSchema>, 'data'> & {
  data: CountryRow[]
}
export type RankingResponse = Omit<z.infer<typeof rankingEnvelopeSchema>, 'data'> & {
  data: RankingRow[]
}
export type CountryDetailResponse = Omit<
  z.infer<typeof countryDetailEnvelopeSchema>,
  'indicators'
> & {
  indicators: IndicatorValue[]
}
export type HistoryResponse = Omit<z.infer<typeof historyEnvelopeSchema>, 'data'> & {
  data: HistoryPoint[]
}
