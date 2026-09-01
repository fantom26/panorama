import { describe, expect, test } from '@jest/globals'

import {
  BAR_COUNT,
  DEFAULT_LIMIT,
  EMPTY_RANKING_VIEW,
  MAX_LIMIT,
  parseLimit,
  selectRankingView
} from '@/features/rankings/model/ranking-view'
import type { CountryRow, RankingResponse, RankingRow } from '@/shared/api/statistics-api'

const row = (rank: number, countryId: string, value: number): RankingRow =>
  ({ rank, countryId, country: `Country ${countryId}`, value, year: '2024' }) as RankingRow

const country = (id: string, iso2: string) => ({ id, iso2 }) as CountryRow

const ranking = (data: RankingRow[], over: Partial<RankingResponse['indicator']> = {}) =>
  ({
    indicator: {
      id: 'IMF.NGDPD',
      label: 'GDP',
      category: 'Economy',
      format: 'currency',
      source: 'IMF',
      ...over
    },
    count: data.length,
    total: data.length,
    data
  }) as RankingResponse

describe('parseLimit', () => {
  test('defaults when the param is absent or unparseable', () => {
    expect(parseLimit(null)).toBe(DEFAULT_LIMIT)
    expect(parseLimit('')).toBe(DEFAULT_LIMIT)
    expect(parseLimit('all')).toBe(DEFAULT_LIMIT)
    expect(parseLimit('0')).toBe(DEFAULT_LIMIT)
    expect(parseLimit('-5')).toBe(DEFAULT_LIMIT)
  })

  test('clamps to the maximum and truncates fractions', () => {
    expect(parseLimit('50')).toBe(50)
    expect(parseLimit('999')).toBe(MAX_LIMIT)
    expect(parseLimit('10.9')).toBe(10)
  })
})

describe('selectRankingView', () => {
  test('returns the empty view when there is no ranking or no rows', () => {
    expect(selectRankingView(undefined, [], DEFAULT_LIMIT)).toBe(EMPTY_RANKING_VIEW)
    expect(selectRankingView(ranking([]), [], DEFAULT_LIMIT)).toBe(EMPTY_RANKING_VIEW)
  })

  test('sorts by rank and slices the table to the limit', () => {
    const view = selectRankingView(
      ranking([row(3, 'CCC', 30), row(1, 'AAA', 10), row(2, 'BBB', 20)]),
      [],
      2
    )

    expect(view.rows.map((r) => r.id)).toEqual(['AAA', 'BBB'])
    expect(view.rows.map((r) => r.rank)).toEqual([1, 2])
  })

  test('caps the bar chart at BAR_COUNT regardless of the table limit', () => {
    const rows = Array.from({ length: 40 }, (_, i) => row(i + 1, `C${i}`, 100 - i))
    const view = selectRankingView(ranking(rows), [], MAX_LIMIT)

    expect(view.bars).toHaveLength(BAR_COUNT)
    expect(view.rows).toHaveLength(40)
  })

  test('joins iso2 from the catalog and leaves unknown countries without one', () => {
    const view = selectRankingView(
      ranking([row(1, 'DEU', 4), row(2, 'XKX', 1)]),
      [country('DEU', 'de')],
      DEFAULT_LIMIT
    )

    expect(view.rows[0]?.iso2).toBe('de')
    expect(view.rows[1]?.iso2).toBeUndefined()
  })

  test('derives leader / median / lowest / category / ranked tiles in the indicator format', () => {
    const view = selectRankingView(
      ranking([row(1, 'AAA', 3.24e12), row(2, 'BBB', 2e12), row(3, 'CCC', 1e12)]),
      [],
      DEFAULT_LIMIT
    )
    const tiles = Object.fromEntries(view.tiles.map((tile) => [tile.key, tile.value]))

    expect(tiles.leader).toBe('Country AAA · $3.2T')
    expect(tiles.median).toBe('$2T')
    expect(tiles.lowest).toBe('Country CCC · $1T')
    expect(tiles.category).toBe('Economy')
    expect(tiles.ranked).toBe('3')
  })

  test('carries the indicator meta through', () => {
    const view = selectRankingView(
      ranking([row(1, 'AAA', 5)], { label: 'Inflation', format: 'percent' }),
      [],
      DEFAULT_LIMIT
    )

    expect(view.meta).toEqual({
      label: 'Inflation',
      category: 'Economy',
      format: 'percent',
      source: 'IMF',
      year: '2024',
      total: 1
    })
  })
})
