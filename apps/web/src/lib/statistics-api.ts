/**
 * Thin client for the Statistics of the World API (https://statisticsoftheworld.com).
 * Unauthenticated access is allowed at up to 1,000 requests/day per IP, so no key is sent.
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'https://statisticsoftheworld.com'

export type CountriesResponse = {
  count: number
  total: number
  data: { id: string; name: string; region: string }[]
}

export type RankingRow = {
  rank: number
  countryId: string
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

export function fetchRanking(indicator: string) {
  return get<RankingResponse>(`/api/v1/rankings/${indicator}`)
}
