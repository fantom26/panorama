import { notFound } from 'next/navigation'

import { regionFromSlug, type RegionSlug } from '@/shared/model/regions'

export function assertRegionSlug(slug: string): asserts slug is RegionSlug {
  if (regionFromSlug(slug) === undefined) {
    notFound()
  }
}
