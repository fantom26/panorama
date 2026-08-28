/**
 * Thin client for the Statistics of the World API (https://statisticsoftheworld.com).
 * Unauthenticated access is allowed at up to 1,000 requests/day per IP, so no key is sent.
 */

import type { IndicatorId } from '@/shared/model/indicators'
import type { Alpha2Code, Alpha3Code } from '@/shared/types/iso'
import type { IndicatorFormat } from '@/shared/utils/format'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'https://statisticsoftheworld.com'

export type CountryRow = {
  id: Alpha3Code
  iso2: Alpha2Code
  name: string
  region: string
  incomeLevel: string
  capitalCity: string | null
}

export type CountriesResponse = {
  count: number
  total: number
  data: CountryRow[]
}

export type RankingRow = {
  rank: number
  countryId: Alpha3Code
  country: string
  value: number
  year: string
}

export type RankingResponse = {
  indicator: { id: string; label: string; category: string; source: string }
  count: number
  total: number
  data: RankingRow[]
}

export type IndicatorValue = {
  id: IndicatorId
  label: string
  category: string
  value: number
  year: number | string
  format: IndicatorFormat
  source: string
}

export type CountryDetail = {
  country: CountryRow
  indicators: IndicatorValue[]
}

export type HistoryPoint = { year: number; value: number }

export type HistoryResponse = {
  indicator: { id: IndicatorId; label: string; format: IndicatorFormat; source: string }
  country: Alpha3Code
  count: number
  data: HistoryPoint[]
}

/** Thrown on any non-2xx response; `status` lets callers treat a 404 (unknown country) differently from a transient failure. */
export class StatisticsApiError extends Error {
  readonly status: number

  constructor(status: number, path: string) {
    super(`Statistics API request failed: ${status} ${path}`)
    this.name = 'StatisticsApiError'
    this.status = status
  }
}

async function get<T>(path: string): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { accept: 'application/json' }
  })

  if (!response.ok) {
    throw new StatisticsApiError(response.status, path)
  }

  return response.json() as Promise<T>
}

export function fetchCountries() {
  return get<CountriesResponse>('/api/v1/countries')
}

export function fetchRanking(indicator: IndicatorId) {
  return get<RankingResponse>(`/api/v1/rankings/${indicator}`)
}

export function fetchCountry(id: Alpha3Code) {
  return get<CountryDetail>(`/api/v1/countries/${id}`)
}

export function fetchHistory(indicator: IndicatorId, id: Alpha3Code) {
  return get<HistoryResponse>(`/api/v1/history/${indicator}/${id}`)
}
