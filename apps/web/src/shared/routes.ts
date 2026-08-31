import type { IncomeSlug } from '@/shared/model/income-levels'
import type { RegionSlug } from '@/shared/model/regions'
import type { Alpha3Code } from '@/shared/types/iso'

// Keep this file dependency-free — it is imported by the static 404 view and header UI.
export const ROUTES = {
  home: () => '/',
  country: (id: Alpha3Code | string) => `/countries/${id}`,
  region: (slug: RegionSlug | string) => `/region/${slug}`,
  incomeLevel: (slug: IncomeSlug | string) => `/income/${slug}`,
  compare: (codes?: readonly Alpha3Code[]) =>
    codes && codes.length > 0 ? `/compare?countries=${codes.join(',')}` : '/compare'
} as const
