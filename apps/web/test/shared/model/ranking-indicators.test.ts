import { describe, expect, test } from '@jest/globals'

import { INDICATOR } from '@/shared/model/indicators'
import {
  indicatorFromSlug,
  RANKING_SLUGS,
  slugFromIndicator
} from '@/shared/model/ranking-indicators'

describe('ranking indicator slugs', () => {
  test('every slug round-trips through its SOTW code', () => {
    for (const slug of RANKING_SLUGS) {
      expect(slugFromIndicator(indicatorFromSlug(slug))).toBe(slug)
    }
  })

  test('maps slugs to the codes the API expects', () => {
    expect(indicatorFromSlug('gdp')).toBe(INDICATOR.gdp)
    expect(indicatorFromSlug('gdp-per-capita')).toBe(INDICATOR.gdpPerCapita)
    expect(slugFromIndicator(INDICATOR.population)).toBe('population')
  })

  test.each(['gdpPerCapita', 'IMF.NGDPD', ''])('returns undefined for %p', (slug) => {
    expect(indicatorFromSlug(slug)).toBeUndefined()
  })

  test('returns undefined for an indicator with no ranking page', () => {
    expect(slugFromIndicator('SP.DYN.LE00.IN')).toBeUndefined()
  })
})
