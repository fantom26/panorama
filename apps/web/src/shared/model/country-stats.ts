import type { CountryDetail } from '@/shared/api/statistics-api'
import { INDICATOR } from '@/shared/model/indicators'

/** The headline indicators shown on the country page's stat strip and the /compare matrix. */
export type CountryStats = {
  population: number | null
  area: number | null
  capitalCity: string | null
  gdp: number | null
  gdpPerCapita: number | null
  inflation: number | null
  unemployment: number | null
}

export function selectStats(detail: CountryDetail): CountryStats {
  const valueById = new Map(detail.indicators.map((indicator) => [indicator.id, indicator.value]))

  return {
    population: valueById.get(INDICATOR.population) ?? null,
    area: valueById.get(INDICATOR.area) ?? null,
    capitalCity: detail.country.capitalCity,
    gdp: valueById.get(INDICATOR.gdp) ?? null,
    gdpPerCapita: valueById.get(INDICATOR.gdpPerCapita) ?? null,
    inflation: valueById.get(INDICATOR.inflation) ?? null,
    unemployment: valueById.get(INDICATOR.unemployment) ?? null
  }
}
