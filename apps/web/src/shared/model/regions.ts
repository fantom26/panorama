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

export const REGION_NAMES = Object.keys(REGION_SLUGS) as RegionName[]

const REGION_BY_SLUG = Object.fromEntries(
  Object.entries(REGION_SLUGS).map(([name, slug]) => [slug, name])
) as Record<RegionSlug, RegionName>

export function slugFromRegion(region: string): RegionSlug | undefined {
  return REGION_SLUGS[region as RegionName]
}

export function regionFromSlug(slug: string): RegionName | undefined {
  return REGION_BY_SLUG[slug as RegionSlug]
}
