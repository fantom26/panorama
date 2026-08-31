import type { Mutate, StoreApi } from 'zustand'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import { alpha3Schema } from '@/shared/api/schemas'
import type { Alpha3Code } from '@/shared/types/iso'

export const MAX_COMPARE = 5
const STORAGE_KEY = 'panorama:compare'

const isAlpha3 = (value: string): value is Alpha3Code => alpha3Schema.safeParse(value).success

/** Upper-cases, trims, drops non-ISO3 and duplicate entries, and caps the list at `MAX_COMPARE`. */
export function normalizeCodes(values: readonly string[]): Alpha3Code[] {
  const seen = new Set<string>()
  const result: Alpha3Code[] = []

  for (const value of values) {
    const code = value.trim().toUpperCase()
    if (!isAlpha3(code) || seen.has(code)) continue
    seen.add(code)
    result.push(code)
    if (result.length >= MAX_COMPARE) break
  }

  return result
}

type CompareState = {
  codes: Alpha3Code[]
  add: (code: string) => void
  remove: (code: string) => void
  toggle: (code: string) => void
  set: (codes: readonly string[]) => void
  clear: () => void
}

const noopStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {}
}

function createCompareStorage() {
  if (typeof window === 'undefined') return noopStorage

  return {
    getItem: (name: string) => {
      try {
        return window.localStorage.getItem(name)
      } catch {
        return null
      }
    },
    setItem: (name: string, value: string) => {
      try {
        window.localStorage.setItem(name, value)
      } catch (error) {
        console.warn('[compare] could not persist the comparison list:', error)
      }
    },
    removeItem: (name: string) => {
      try {
        window.localStorage.removeItem(name)
      } catch {
        // ignore
      }
    }
  }
}

export const useCompareStore = create<CompareState>()(
  persist(
    (set, get) => ({
      codes: [],
      add: (code) => {
        const upper = code.toUpperCase()
        if (!isAlpha3(upper)) return

        const { codes } = get()
        if (codes.includes(upper) || codes.length >= MAX_COMPARE) return

        set({ codes: [...codes, upper] })
      },
      remove: (code) => {
        const upper = code.toUpperCase()
        const { codes } = get()
        if (!codes.includes(upper as Alpha3Code)) return

        set({ codes: codes.filter((entry) => entry !== upper) })
      },
      toggle: (code) => {
        const upper = code.toUpperCase()
        if (!isAlpha3(upper)) return

        if (get().codes.includes(upper)) get().remove(upper)
        else get().add(upper)
      },
      set: (codes) => set({ codes: normalizeCodes(codes) }),
      clear: () => set({ codes: [] })
    }),
    {
      name: STORAGE_KEY,
      version: 1,
      storage: createJSONStorage(createCompareStorage),
      partialize: (state) => ({ codes: state.codes }),
      // Re-run validation on whatever comes out of storage so a stale or hand-edited
      // payload can never seed an invalid code into the list.
      merge: (persisted, current) => {
        const raw = (persisted as { codes?: unknown } | undefined)?.codes
        const codes = Array.isArray(raw)
          ? raw.filter((entry): entry is string => typeof entry === 'string')
          : []
        return { ...current, codes: normalizeCodes(codes) }
      }
    }
  )
)

// Cross-tab sync: when another tab writes the key, re-read it into this tab's store.
type PersistedStore = Mutate<StoreApi<CompareState>, [['zustand/persist', unknown]]>

if (typeof window !== 'undefined') {
  const store = useCompareStore as unknown as PersistedStore
  window.addEventListener('storage', (event) => {
    if (event.key === store.persist.getOptions().name) {
      void store.persist.rehydrate()
    }
  })
}
