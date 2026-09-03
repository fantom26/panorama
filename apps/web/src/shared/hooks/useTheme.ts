'use client'

import { useState } from 'react'

import Cookies from 'js-cookie'

import type { ThemePreference } from '@repo/ui'

import { useInitialTheme } from '@/providers/ThemeProvider'
import { THEME_COOKIE_KEY } from '@/shared/utils/cookies'

export type { ThemePreference }

export function useTheme() {
  const initialTheme = useInitialTheme()
  const [theme, setThemeState] = useState<ThemePreference>(initialTheme)

  const setTheme = (next: ThemePreference) => {
    setThemeState(next)
    document.documentElement.dataset.theme = next
    Cookies.set(THEME_COOKIE_KEY, next, { expires: 365, path: '/', sameSite: 'lax' })
  }

  return { theme, setTheme }
}
