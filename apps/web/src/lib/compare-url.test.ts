import { describe, expect, test } from '@jest/globals'

import { parseCompareParam, serializeCompareParam } from './compare-url'

describe('parseCompareParam', () => {
  test('splits, upper-cases, filters to ISO3, dedupes, caps at 5', () => {
    expect(parseCompareParam('deu,fra,DEU,xx,gbr,usa,jpn,chn')).toEqual([
      'DEU',
      'FRA',
      'GBR',
      'USA',
      'JPN'
    ])
  })

  test('empty / nullish / malformed input yields an empty list', () => {
    expect(parseCompareParam('')).toEqual([])
    expect(parseCompareParam(null)).toEqual([])
    expect(parseCompareParam(undefined)).toEqual([])
    expect(parseCompareParam(',, , 1,de,')).toEqual([])
  })

  test('round-trips codes -> string -> codes', () => {
    const codes = parseCompareParam('DEU,FRA,JPN')
    expect(parseCompareParam(serializeCompareParam(codes))).toEqual(codes)
  })
})
