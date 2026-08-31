import { describe, expect, test } from '@jest/globals'

import { REGION_NAMES, REGION_SLUGS, regionFromSlug, slugFromRegion } from '@/shared/model/regions'

describe('region slug map', () => {
  test('round-trips every region through its slug', () => {
    for (const name of REGION_NAMES) {
      const slug = slugFromRegion(name)
      expect(slug).toBe(REGION_SLUGS[name])
      expect(regionFromSlug(slug as string)).toBe(name)
    }
  })

  test('returns undefined for unknown values', () => {
    expect(slugFromRegion('Atlantis')).toBeUndefined()
    expect(regionFromSlug('mars')).toBeUndefined()
    expect(regionFromSlug('Global')).toBeUndefined()
  })
})
