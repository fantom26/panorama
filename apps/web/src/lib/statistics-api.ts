/**
 * Thin client for the Statistics of the World API (https://statisticsoftheworld.com).
 * Unauthenticated access is allowed at up to 1,000 requests/day per IP, so no key is sent.
 */

import type { Alpha2Code, Alpha3Code } from '../types/iso'
import type { IndicatorId } from './indicators'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'https://statisticsoftheworld.com'

export type CountryRow = {
  id: Alpha3Code
  iso2: Alpha2Code
  name: string
  region: string
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

async function get<T>(path: string): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { accept: 'application/json' }
  })

  if (!response.ok) {
    throw new Error(`Statistics API request failed: ${response.status} ${path}`)
  }

  return response.json() as Promise<T>
}

export function fetchCountries() {
  return get<CountriesResponse>('/api/v1/countries')
}

export function fetchRanking(indicator: IndicatorId) {
  return get<RankingResponse>(`/api/v1/rankings/${indicator}`)
}
