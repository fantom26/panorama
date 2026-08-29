/**
 * The seven World Bank regions SOTW tags countries with, and their URL slugs. Route
 * params are always slugs; display names are resolved from this map. The catalog also
 * carries a "Global" aggregate bucket — not a drill-down target, so it is not listed.
 */
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

/** Slug for a SOTW region string, or `undefined` if it is not one of the seven. */
export function slugFromRegion(region: string): RegionSlug | undefined {
  return REGION_SLUGS[region as RegionName]
}

/** Display name for a route slug, or `undefined` for an unknown slug. */
export function regionFromSlug(slug: string): RegionName | undefined {
  return REGION_BY_SLUG[slug as RegionSlug]
}
