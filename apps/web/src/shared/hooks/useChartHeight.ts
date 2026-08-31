import { useMediaQuery } from '@/shared/hooks/useMediaQuery'

type ChartSizes = { mobile: number; tablet: number; desktop: number }

/** Picks a pixel height for an imperatively-sized chart (amCharts can't read CSS breakpoints). */
export function useChartHeight(sizes: ChartSizes): number {
  const isTablet = useMediaQuery('(min-width: 768px)')
  const isDesktop = useMediaQuery('(min-width: 1440px)')
  return isDesktop ? sizes.desktop : isTablet ? sizes.tablet : sizes.mobile
}
