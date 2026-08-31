import { describe, expect, test } from '@jest/globals'

import { ROUTES } from '@/shared/routes'
import type { Alpha3Code } from '@/shared/types/iso'

describe('ROUTES', () => {
  test('builds static and dynamic paths', () => {
    expect(ROUTES.home()).toBe('/')
    expect(ROUTES.country('DEU')).toBe('/countries/DEU')
    expect(ROUTES.region('south-asia')).toBe('/region/south-asia')
    expect(ROUTES.incomeLevel('high')).toBe('/income/high')
  })

  test('compare() omits the query string when there are no codes', () => {
    expect(ROUTES.compare()).toBe('/compare')
    expect(ROUTES.compare([])).toBe('/compare')
  })

  test('compare() joins codes into the countries param', () => {
    expect(ROUTES.compare(['DEU', 'FRA', 'GBR'] as Alpha3Code[])).toBe(
      '/compare?countries=DEU,FRA,GBR'
    )
  })
})
