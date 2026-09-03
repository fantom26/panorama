import { describe, expect, test } from '@jest/globals'

import { toCountryOptions } from '@/features/compare/model/country-options'
import type { CountryRow } from '@/shared/api/statistics-api'
import type { Alpha3Code } from '@/shared/types/iso'

const rows = [
  { id: 'GHA', iso2: 'gh', name: 'Ghana', region: 'Africa' },
  { id: 'DEU', iso2: 'de', name: 'Germany', region: 'Europe' },
  { id: 'BRA', iso2: 'br', name: 'Brazil', region: 'Americas' }
] as unknown as CountryRow[]

describe('toCountryOptions', () => {
  test('sorts options alphabetically by name', () => {
    expect(toCountryOptions(rows, []).map((option) => option.label)).toEqual([
      'Brazil',
      'Germany',
      'Ghana'
    ])
  })

  test('maps value/label/iso2 from the country row', () => {
    const [brazil] = toCountryOptions(rows, [])

    expect(brazil).toMatchObject({
      value: 'BRA',
      label: 'Brazil',
      iso2: 'br',
      added: false
    })
  })

  test('flags countries already in the comparison', () => {
    const selected = ['DEU'] as Alpha3Code[]
    const added = toCountryOptions(rows, selected)
      .filter((option) => option.added)
      .map((option) => option.value)

    expect(added).toEqual(['DEU'])
  })
})
