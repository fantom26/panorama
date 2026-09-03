import type { CountryRow } from '@/shared/api/statistics-api'
import type { Alpha2Code, Alpha3Code } from '@/shared/types/iso'

export type CountryOption = {
  value: Alpha3Code
  label: string
  iso2: Alpha2Code
  added: boolean
}

export function toCountryOptions(
  countries: readonly CountryRow[],
  selected: readonly Alpha3Code[]
): CountryOption[] {
  const selectedSet = new Set(selected)

  return countries
    .map((country) => ({
      value: country.id,
      label: country.name,
      iso2: country.iso2,
      added: selectedSet.has(country.id)
    }))
    .sort((a, b) => a.label.localeCompare(b.label))
}
