import type { Country, CountryMetric } from '@/shared/model/country'
import type { Alpha2Code, Alpha3Code } from '@/shared/types/iso'
import { avg, sum } from '@/shared/utils/aggregate'

export function selectCountryById(id: string, list: readonly Country[]): Country | null {
  return list.find((country) => country.id === id) ?? null
}

export function selectCountryIdByAlpha2(
  list: readonly Country[]
): Partial<Record<Alpha2Code, Alpha3Code>> {
  return Object.fromEntries(list.map((country) => [country.iso2, country.id])) as Partial<
    Record<Alpha2Code, Alpha3Code>
  >
}

export type MemberProjection = {
  memberAlpha2: string[]
  memberIds: Set<string>
  countryIdByAlpha2: Partial<Record<Alpha2Code, Alpha3Code>>
}

/** The member-derived lookups the region and income-level overviews both need. */
export function selectMemberProjection(members: readonly Country[]): MemberProjection {
  return {
    memberAlpha2: members.map((country) => country.iso2.toUpperCase()),
    memberIds: new Set(members.map((country) => country.id)),
    countryIdByAlpha2: selectCountryIdByAlpha2(members)
  }
}

/** Count, plus null-skipping population and GDP sums, for a bucket of countries. */
export function bucketTotals(countries: readonly Country[]): {
  count: number
  population: number
  gdp: number
} {
  return {
    count: countries.length,
    population: sum(countries.map((country) => country.population)),
    gdp: sum(countries.map((country) => country.gdp))
  }
}

/** Top `limit` countries by `metric`, highest first, skipping those with no value. */
export function topByMetric<T>(
  countries: readonly Country[],
  metric: CountryMetric,
  limit: number,
  map: (country: Country, value: number) => T
): T[] {
  return countries
    .filter((country) => country[metric] != null)
    .sort((a, b) => (b[metric] ?? 0) - (a[metric] ?? 0))
    .slice(0, limit)
    .map((country) => map(country, country[metric] as number))
}

export function selectRegionCountries(region: string, list: readonly Country[]): Country[] {
  return list.filter((country) => country.region === region)
}

export function selectIncomeLevelCountries(level: string, list: readonly Country[]): Country[] {
  return list.filter((country) => country.incomeLevel === level)
}

export type GlobalMetrics = {
  total: number
  totalPopulation: number
  avgGdp: number | null
  avgInflation: number | null
  avgUnemployment: number | null
}

export function selectGlobalMetrics(list: readonly Country[]): GlobalMetrics {
  return {
    total: list.length,
    totalPopulation: sum(list.map((country) => country.population)),
    avgGdp: avg(list.map((country) => country.gdp)),
    avgInflation: avg(list.map((country) => country.inflation)),
    avgUnemployment: avg(list.map((country) => country.unemployment))
  }
}
