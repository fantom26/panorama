import { useCallback } from 'react'

import { useIsClient } from 'usehooks-ts'

import { MAX_COMPARE, useCompareStore } from '@/store/compare'
import type { Alpha3Code } from '@/types/iso'

const EMPTY: readonly Alpha3Code[] = Object.freeze([])

export function useCompareList() {
  const hydrated = useIsClient()
  const storeCodes = useCompareStore((state) => state.codes)
  const add = useCompareStore((state) => state.add)
  const remove = useCompareStore((state) => state.remove)
  const toggle = useCompareStore((state) => state.toggle)
  const set = useCompareStore((state) => state.set)

  const codes = hydrated ? storeCodes : EMPTY

  const has = useCallback(
    (code: string) => codes.includes(code.toUpperCase() as Alpha3Code),
    [codes]
  )

  return {
    codes,
    count: codes.length,
    isFull: codes.length >= MAX_COMPARE,
    hydrated,
    has,
    add,
    remove,
    toggle,
    set
  }
}
