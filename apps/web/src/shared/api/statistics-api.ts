/**
 * Thin client for the Statistics of the World API (https://statisticsoftheworld.com).
 * Unauthenticated access is allowed at up to 1,000 requests/day per IP, so no key is sent.
 *
 * Every response is validated at this boundary (see ./schemas). The wrapper object is checked
 * strictly; the `data` rows are parsed individually so one malformed row is dropped and logged
 * rather than failing the whole page.
 */

import { z } from 'zod'

import {
  countriesEnvelopeSchema,
  countryDetailEnvelopeSchema,
  countryRowSchema,
  historyEnvelopeSchema,
  historyPointSchema,
  indicatorValueSchema,
  rankingEnvelopeSchema,
  rankingRowSchema
} from '@/shared/api/schemas'
import type { IndicatorId } from '@/shared/model/indicators'
import type { Alpha3Code } from '@/shared/types/iso'

export type {
  CountriesResponse,
  CountryDetailResponse,
  CountryRow,
  HistoryPoint,
  HistoryResponse,
  IndicatorValue,
  RankingResponse,
  RankingRow
} from '@/shared/api/schemas'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'https://statisticsoftheworld.com'
const isDev = process.env.NODE_ENV === 'development'

/** Thrown on any non-2xx response; `status` lets callers treat a 404 (unknown country) differently from a transient failure. */
export class StatisticsApiError extends Error {
  readonly status: number

  constructor(status: number, path: string) {
    super(`Statistics API request failed: ${status} ${path}`)
    this.name = 'StatisticsApiError'
    this.status = status
  }
}

/** True when `error` is a 404 from the API — an unknown country/indicator, not a transient failure. */
export const isNotFoundError = (error: unknown): boolean =>
  error instanceof StatisticsApiError && error.status === 404

/** Thrown when the body isn't valid JSON — e.g. an HTML error page served behind a 200. */
export class StatisticsParseError extends Error {
  constructor(
    path: string,
    readonly cause: unknown
  ) {
    super(`Statistics API returned a non-JSON body: ${path}`)
    this.name = 'StatisticsParseError'
  }
}

/** Thrown when the response wrapper fails validation, or every row in `data` is invalid. */
export class StatisticsResponseError extends Error {
  readonly issues: readonly z.core.$ZodIssue[]

  constructor(path: string, issues: readonly z.core.$ZodIssue[]) {
    super(`Statistics API response failed validation: ${path}`)
    this.name = 'StatisticsResponseError'
    this.issues = issues
  }
}

async function fetchJson(path: string): Promise<unknown> {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { accept: 'application/json' }
  })

  if (!response.ok) {
    throw new StatisticsApiError(response.status, path)
  }

  try {
    return (await response.json()) as unknown
  } catch (cause) {
    throw new StatisticsParseError(path, cause)
  }
}

function parseEnvelope<S extends z.ZodType>(schema: S, json: unknown, path: string): z.infer<S> {
  const result = schema.safeParse(json)
  if (!result.success) {
    if (isDev) {
      console.error(
        `[statistics-api] ${path} envelope failed validation\n${z.prettifyError(result.error)}`
      )
    }
    throw new StatisticsResponseError(path, result.error.issues)
  }
  return result.data
}

/** Parse `rows` one at a time; drop and log the invalid ones. Throw only if none survive. */
function parseRows<S extends z.ZodType>(schema: S, rows: unknown[], path: string): z.infer<S>[] {
  const parsed: z.infer<S>[] = []
  let dropped = 0

  for (const row of rows) {
    const result = schema.safeParse(row)
    if (result.success) {
      parsed.push(result.data)
    } else {
      dropped += 1
      if (isDev) {
        console.warn(`[statistics-api] ${path} dropped a row\n${z.prettifyError(result.error)}`)
      }
    }
  }

  if (rows.length > 0 && parsed.length === 0) {
    throw new StatisticsResponseError(path, [
      {
        code: 'custom',
        path: ['data'],
        message: `all ${rows.length} rows failed validation`,
        input: rows
      }
    ])
  }

  if (dropped > 0) {
    console.warn(`[statistics-api] ${path} dropped ${dropped}/${rows.length} invalid rows`)
  }

  return parsed
}

export async function fetchCountries() {
  const path = '/api/v1/countries'
  const envelope = parseEnvelope(countriesEnvelopeSchema, await fetchJson(path), path)
  return { ...envelope, data: parseRows(countryRowSchema, envelope.data, path) }
}

export async function fetchRanking(indicator: IndicatorId) {
  const path = `/api/v1/rankings/${indicator}`
  const envelope = parseEnvelope(rankingEnvelopeSchema, await fetchJson(path), path)
  return { ...envelope, data: parseRows(rankingRowSchema, envelope.data, path) }
}

export async function fetchCountry(id: Alpha3Code) {
  const path = `/api/v1/countries/${id}`
  const envelope = parseEnvelope(countryDetailEnvelopeSchema, await fetchJson(path), path)
  return { ...envelope, indicators: parseRows(indicatorValueSchema, envelope.indicators, path) }
}

export async function fetchHistory(indicator: IndicatorId, id: Alpha3Code) {
  const path = `/api/v1/history/${indicator}/${id}`
  const envelope = parseEnvelope(historyEnvelopeSchema, await fetchJson(path), path)
  return { ...envelope, data: parseRows(historyPointSchema, envelope.data, path) }
}
