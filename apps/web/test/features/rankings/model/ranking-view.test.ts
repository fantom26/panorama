import { describe, expect, test } from '@jest/globals'

import {
  BAR_COUNT,
  EMPTY_RANKING_VIEW,
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
  test('means "no cap" when the param is absent or unparseable', () => {
    expect(parseLimit(null)).toBeUndefined()
    expect(parseLimit('')).toBeUndefined()
    expect(parseLimit('all')).toBeUndefined()
    expect(parseLimit('0')).toBeUndefined()
    expect(parseLimit('-5')).toBeUndefined()
  })

  test('takes an explicit cap, truncating fractions', () => {
    expect(parseLimit('50')).toBe(50)
    expect(parseLimit('10.9')).toBe(10)
  })
})

describe('selectRankingView', () => {
  test('returns the empty view when there is no ranking or no rows', () => {
    expect(selectRankingView(undefined, [])).toBe(EMPTY_RANKING_VIEW)
    expect(selectRankingView(ranking([]), [])).toBe(EMPTY_RANKING_VIEW)
  })

  test('lists every ranked country when no limit is given', () => {
    const rows = Array.from({ length: 217 }, (_, i) => row(i + 1, `C${i}`, 500 - i))
    const view = selectRankingView(ranking(rows), [])

    expect(view.rows).toHaveLength(217)
  })

  test('sorts by rank, and slices only when given an explicit limit', () => {
    const data = [row(3, 'CCC', 30), row(1, 'AAA', 10), row(2, 'BBB', 20)]

    expect(selectRankingView(ranking(data), []).rows.map((r) => r.id)).toEqual([
      'AAA',
      'BBB',
      'CCC'
    ])
    expect(selectRankingView(ranking(data), [], 2).rows.map((r) => r.rank)).toEqual([1, 2])
  })

  test('caps the bar chart at BAR_COUNT however long the table is', () => {
    const rows = Array.from({ length: 40 }, (_, i) => row(i + 1, `C${i}`, 100 - i))
    const view = selectRankingView(ranking(rows), [])

    expect(view.bars).toHaveLength(BAR_COUNT)
    expect(view.rows).toHaveLength(40)
  })

  test('joins iso2 from the catalog and leaves unknown countries without one', () => {
    const view = selectRankingView(ranking([row(1, 'DEU', 4), row(2, 'XKX', 1)]), [
      country('DEU', 'de')
    ])

    expect(view.rows[0]?.iso2).toBe('de')
    expect(view.rows[1]?.iso2).toBeUndefined()
  })

  test('derives leader / median / lowest / category / ranked tiles in the indicator format', () => {
    const view = selectRankingView(
      ranking([row(1, 'AAA', 3.24e12), row(2, 'BBB', 2e12), row(3, 'CCC', 1e12)]),
      []
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
      []
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
