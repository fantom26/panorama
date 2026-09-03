'use client'

import { createContext, useContext } from 'react'

import type { ThemePreference } from '@repo/ui'

const ThemeContext = createContext<ThemePreference | null>(null)

export function useInitialTheme(): ThemePreference {
  const value = useContext(ThemeContext)
  if (!value) throw new Error('useInitialTheme must be used within ThemeProvider')
  return value
}

export default function ThemeProvider({
  theme,
  children
}: {
  theme: ThemePreference
  children: React.ReactNode
}) {
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
}
