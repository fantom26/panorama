import { useMediaQuery as useMediaQueryBase } from 'usehooks-ts'

/**
 * amCharts5 sizes its canvas imperatively and can't respond to CSS media queries,
 * so chart-affecting layout decisions (heatmap height, donut size/orientation) read
 * this instead of a breakpoint class.
 *
 * `initializeWithValue: false` keeps SSR and the first client paint mobile-first
 * (`matches` → false), then it syncs on mount — avoiding a hydration mismatch.
 * See docs/decisions/002-usehooks-ts-react-hooks-library.md.
 */
export function useMediaQuery(query: string): boolean {
  return useMediaQueryBase(query, { defaultValue: false, initializeWithValue: false })
}
