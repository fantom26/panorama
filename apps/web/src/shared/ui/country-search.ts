import type { CountryRow } from '@/shared/api/statistics-api'

export function filterCountries(countries: CountryRow[], query: string): CountryRow[] {
  const q = query.trim().toLowerCase()
  const matched = q
    ? countries.filter((country) => country.name.toLowerCase().includes(q))
    : countries.slice()
  return matched.sort((a, b) => a.name.localeCompare(b.name))
}

export function moveActiveIndex(current: number, delta: number, length: number): number {
  if (length === 0) return 0
  return Math.min(Math.max(current + delta, 0), length - 1)
}
