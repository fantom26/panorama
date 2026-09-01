import type { IncomeSlug } from '@/shared/model/income-levels'
import type { RankingSlug } from '@/shared/model/ranking-indicators'
import type { RegionSlug } from '@/shared/model/regions'
import type { Alpha3Code } from '@/shared/types/iso'

// Keep this file dependency-free — it is imported by the static 404 view and header UI.
export const ROUTES = {
  home: () => '/',
  country: (id: Alpha3Code | string) => `/countries/${id}`,
  region: (slug: RegionSlug | string, opts?: { level?: IncomeSlug }) =>
    opts?.level ? `/region/${slug}?level=${opts.level}` : `/region/${slug}`,
  incomeLevel: (slug: IncomeSlug | string, opts?: { region?: RegionSlug }) =>
    opts?.region ? `/income/${slug}?region=${opts.region}` : `/income/${slug}`,
  rankings: (slug: RankingSlug | string, opts?: { limit?: number }) =>
    opts?.limit ? `/rankings/${slug}?limit=${opts.limit}` : `/rankings/${slug}`,
  compare: (codes?: readonly Alpha3Code[]) =>
    codes && codes.length > 0 ? `/compare?countries=${codes.join(',')}` : '/compare'
} as const
