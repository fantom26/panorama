'use client'

import { useEffect, useState } from 'react'

import { useLocalStorage } from 'usehooks-ts'

import type { ThemePreference } from '@repo/ui'

import { useMediaQuery } from '@/shared/hooks/useMediaQuery'

export type { ThemePreference }
export type ResolvedTheme = 'light' | 'dark'

/** Read by the pre-paint script in app/layout.tsx — keep the key in sync. */
export const THEME_STORAGE_KEY = 'panorama.theme'

const isPreference = (value: unknown): value is ThemePreference =>
  value === 'system' || value === 'light' || value === 'dark'

/**
 * Tri-state theme preference, persisted to localStorage. The inline script in
 * app/layout.tsx has already applied the correct `data-theme` before paint; this
 * hook keeps it in sync afterwards. The `mounted` gate stops the first client
 * render (which sees the storage default, not the stored value) from briefly
 * clobbering what the script set.
 */
export function useTheme() {
  const [stored, setPreference] = useLocalStorage<ThemePreference>(THEME_STORAGE_KEY, 'system', {
    initializeWithValue: false
  })
  const systemDark = useMediaQuery('(prefers-color-scheme: dark)')
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const preference = isPreference(stored) ? stored : 'system'
  const resolved: ResolvedTheme =
    preference === 'system' ? (systemDark ? 'dark' : 'light') : preference

  useEffect(() => {
    if (!mounted) return
    document.documentElement.dataset.theme = resolved
  }, [mounted, resolved])

  return { preference, setPreference, resolved }
}
