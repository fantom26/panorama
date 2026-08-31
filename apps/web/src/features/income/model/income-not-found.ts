import { notFound } from 'next/navigation'

import { type IncomeSlug, levelFromSlug } from '@/shared/model/income-levels'

export function assertIncomeSlug(slug: string): asserts slug is IncomeSlug {
  if (levelFromSlug(slug) === undefined) {
    notFound()
  }
}
