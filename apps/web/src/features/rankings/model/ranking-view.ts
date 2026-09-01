import type { IndicatorFormat } from '@/shared/api/schemas'
import type { CountryRow, RankingResponse } from '@/shared/api/statistics-api'
import { type Stat, toStats } from '@/shared/model/stat'
import type { Alpha2Code } from '@/shared/types/iso'
import { formatIndicatorValueCompact } from '@/shared/utils/format'

const TILE_KEYS = ['leader', 'median', 'lowest', 'category', 'ranked'] as const

export type RankingTileKey = (typeof TILE_KEYS)[number]

export const BAR_COUNT = 15

export type RankingTableRow = {
  rank: number
  id: string
  iso2: Alpha2Code | undefined
  country: string
  value: number
  year: string
}

export type RankingBar = { id: string; label: string; value: number }

export type RankingMeta = {
  label: string
  category: string
  format: IndicatorFormat
  source: string
  year: string
  total: number
}

export type RankingView = {
  tiles: Stat<RankingTileKey>[]
  rows: RankingTableRow[]
  bars: RankingBar[]
  meta: RankingMeta | undefined
}

export const EMPTY_RANKING_VIEW: RankingView = {
  tiles: toStats(TILE_KEYS),
  rows: [],
  bars: [],
  meta: undefined
}

/** `?limit=` optionally caps the table; absent or unparseable means every ranked country. */
export function parseLimit(raw: string | null): number | undefined {
  const parsed = Number(raw)
  if (raw === null || raw === '' || !Number.isFinite(parsed) || parsed < 1) return undefined
  return Math.trunc(parsed)
}

export function selectRankingView(
  ranking: RankingResponse | undefined,
  countries: readonly CountryRow[],
  limit?: number
): RankingView {
  if (!ranking) return EMPTY_RANKING_VIEW

  const iso2ById = new Map(countries.map((country) => [country.id as string, country.iso2]))
  const sorted = [...ranking.data].sort((a, b) => a.rank - b.rank)
  const { format } = ranking.indicator

  const leader = sorted[0]
  const lowest = sorted[sorted.length - 1]
  const median = sorted[Math.floor(sorted.length / 2)]
  if (!leader || !lowest || !median) return EMPTY_RANKING_VIEW

  const tileValues: Record<RankingTileKey, string> = {
    leader: `${leader.country} · ${formatIndicatorValueCompact(leader.value, format)}`,
    median: formatIndicatorValueCompact(median.value, format),
    lowest: `${lowest.country} · ${formatIndicatorValueCompact(lowest.value, format)}`,
    category: ranking.indicator.category,
    ranked: String(ranking.total)
  }

  return {
    tiles: toStats(TILE_KEYS, tileValues),
    rows: (limit === undefined ? sorted : sorted.slice(0, limit)).map((row) => ({
      rank: row.rank,
      id: row.countryId,
      iso2: iso2ById.get(row.countryId),
      country: row.country,
      value: row.value,
      year: row.year
    })),
    bars: sorted.slice(0, BAR_COUNT).map((row) => ({
      id: row.countryId,
      label: row.country,
      value: row.value
    })),
    meta: {
      label: ranking.indicator.label,
      category: ranking.indicator.category,
      format,
      source: ranking.indicator.source,
      year: leader.year,
      total: ranking.total
    }
  }
}
