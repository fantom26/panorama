import { createSlugMap } from '@/shared/model/slug-map'

export const REGION_SLUGS = {
  'Middle East, North Africa, Afghanistan & Pakistan':
    'middle-east-north-africa-afghanistan-pakistan',
  'Europe & Central Asia': 'europe-central-asia',
  'East Asia & Pacific': 'east-asia-pacific',
  'Latin America & Caribbean': 'latin-america-caribbean',
  'Sub-Saharan Africa': 'sub-saharan-africa',
  'South Asia': 'south-asia',
  'North America': 'north-america'
} as const

export type RegionName = keyof typeof REGION_SLUGS
export type RegionSlug = (typeof REGION_SLUGS)[RegionName]

const regions = createSlugMap(REGION_SLUGS)

export const REGION_NAMES = regions.keys

export function slugFromRegion(region: string): RegionSlug | undefined {
  return regions.forward(region)
}

export function regionFromSlug(slug: RegionSlug): RegionName
export function regionFromSlug(slug: string): RegionName | undefined
export function regionFromSlug(slug: string): RegionName | undefined {
  return regions.reverse(slug)
}
