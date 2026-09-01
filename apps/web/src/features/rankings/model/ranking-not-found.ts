import { notFound } from 'next/navigation'

import { indicatorFromSlug, type RankingSlug } from '@/shared/model/ranking-indicators'

export function assertRankingSlug(slug: string): asserts slug is RankingSlug {
  if (indicatorFromSlug(slug) === undefined) notFound()
}
