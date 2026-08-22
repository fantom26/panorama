import { useEffect, useState } from 'react'

/**
 * amCharts5 sizes its canvas imperatively and can't respond to CSS media queries,
 * so chart-affecting layout decisions (heatmap height, donut size/orientation) read
 * this instead of a breakpoint class. Defaults to false for a mobile-first, SSR-safe
 * first paint, then syncs on mount.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query)
    setMatches(mediaQueryList.matches)

    function handleChange(event: MediaQueryListEvent) {
      setMatches(event.matches)
    }

    mediaQueryList.addEventListener('change', handleChange)
    return () => mediaQueryList.removeEventListener('change', handleChange)
  }, [query])

  return matches
}
