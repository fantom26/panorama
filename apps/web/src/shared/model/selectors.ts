import type { Country } from '@/shared/model/country'
import type { Alpha2Code, Alpha3Code } from '@/shared/types/iso'
import { avg, groupBy, sum } from '@/shared/utils/aggregate'

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
  byRegion: Record<string, Country[]>
  byIncomeLevel: Record<string, Country[]>
}

export function selectGlobalMetrics(list: readonly Country[]): GlobalMetrics {
  return {
    total: list.length,
    totalPopulation: sum(list.map((country) => country.population)),
    avgGdp: avg(list.map((country) => country.gdp)),
    avgInflation: avg(list.map((country) => country.inflation)),
    avgUnemployment: avg(list.map((country) => country.unemployment)),
    byRegion: groupBy(list, 'region'),
    byIncomeLevel: groupBy(list, 'incomeLevel')
  }
}
