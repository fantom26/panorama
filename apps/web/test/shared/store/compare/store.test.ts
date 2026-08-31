import { afterEach, beforeEach, describe, expect, jest, test } from '@jest/globals'

import { MAX_COMPARE, normalizeCodes, useCompareStore } from '@/shared/store/compare/store'

const STORAGE_KEY = 'panorama:compare'
const persisted = () => JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '{}')

beforeEach(() => {
  window.localStorage.clear()
  useCompareStore.setState({ codes: [] })
})

afterEach(() => {
  window.localStorage.clear()
})

describe('normalizeCodes', () => {
  test('upper-cases, trims, drops invalid + duplicate entries, caps at MAX_COMPARE', () => {
    expect(
      normalizeCodes([' deu ', 'fra', 'DEU', 'xx', '1234', 'gbr', 'usa', 'jpn', 'chn'])
    ).toEqual(['DEU', 'FRA', 'GBR', 'USA', 'JPN'])
  })
})

describe('actions', () => {
  test('add appends in order and dedupes', () => {
    const { add } = useCompareStore.getState()
    add('deu')
    add('FRA')
    add('deu')

    expect(useCompareStore.getState().codes).toEqual(['DEU', 'FRA'])
  })

  test('add is a no-op past MAX_COMPARE', () => {
    const { add } = useCompareStore.getState()
    for (const code of ['deu', 'fra', 'gbr', 'usa', 'jpn', 'chn']) add(code)

    expect(useCompareStore.getState().codes).toHaveLength(MAX_COMPARE)
    expect(useCompareStore.getState().codes).toEqual(['DEU', 'FRA', 'GBR', 'USA', 'JPN'])
  })

  test('add rejects shape-invalid codes', () => {
    const { add } = useCompareStore.getState()
    add('germany')
    add('de')

    expect(useCompareStore.getState().codes).toEqual([])
  })

  test('remove drops the code, toggle flips membership', () => {
    const { set, remove, toggle } = useCompareStore.getState()
    set(['DEU', 'FRA'])

    remove('deu')
    expect(useCompareStore.getState().codes).toEqual(['FRA'])

    toggle('gbr')
    expect(useCompareStore.getState().codes).toEqual(['FRA', 'GBR'])

    toggle('gbr')
    expect(useCompareStore.getState().codes).toEqual(['FRA'])
  })

  test('set drops invalid entries, clear empties the list', () => {
    const { set, clear } = useCompareStore.getState()
    set(['DEU', 'nope', 'FRA', '12'])
    expect(useCompareStore.getState().codes).toEqual(['DEU', 'FRA'])

    clear()
    expect(useCompareStore.getState().codes).toEqual([])
  })
})

describe('persistence', () => {
  test('writes the list through to localStorage', () => {
    const { add } = useCompareStore.getState()
    add('deu')
    add('jpn')

    expect(persisted().state.codes).toEqual(['DEU', 'JPN'])
  })

  test('a rehydrated payload is re-validated on load', async () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ state: { codes: ['deu', 'b4d', 'germany', 'FRA'] }, version: 1 })
    )

    await useCompareStore.persist.rehydrate()

    expect(useCompareStore.getState().codes).toEqual(['DEU', 'FRA'])
  })

  test('a throwing localStorage.setItem does not crash actions', () => {
    const setItem = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota exceeded')
    })

    expect(() => useCompareStore.getState().add('deu')).not.toThrow()
    expect(useCompareStore.getState().codes).toEqual(['DEU'])

    setItem.mockRestore()
  })
})
