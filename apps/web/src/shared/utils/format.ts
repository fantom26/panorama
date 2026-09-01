import type { IndicatorFormat } from '@/shared/api/schemas'

const compactNumber = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 2
})

const compactUsd = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0
})

const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0
})

const number = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 })

// Compact currency keeps a decimal here: at whole-dollar precision the top of a GDP
// ranking collapses into four bars all labelled "$4T".
const compactUsdPrecise = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 1
})

/** e.g. 8192078152 -> "8.19B" */
export const formatCompactNumber = (value: number) => compactNumber.format(value)

/** e.g. 652331208333 -> "$652B" */
export const formatCompactUsd = (value: number) => compactUsd.format(value)

/** e.g. 60496.44 -> "$60,496" */
export const formatUsd = (value: number) => usd.format(value)

/** e.g. 357680 -> "357,680" */
export const formatNumber = (value: number) => number.format(value)

/** e.g. 7.5609 -> "7.6%" */
export const formatPercent = (value: number) => `${value.toFixed(1)}%`

/** e.g. 32383920000000 -> "$32.4T" */
export const formatGdp = (value: number) => `$${(value / 1e12).toFixed(1)}T`

/** SOTW's `IndicatorValue.format` field — derived from the Zod schema so the two can't drift. */
export type { IndicatorFormat }

/** Renders an indicator's raw value per its declared SOTW format. */
export function formatIndicatorValue(value: number, format: IndicatorFormat) {
  switch (format) {
    case 'currency':
      return formatUsd(value)
    case 'percent':
      return formatPercent(value)
    default:
      return formatNumber(value)
  }
}

/** As `formatIndicatorValue`, abbreviated — for chart labels and tiles, where a
 *  population's full 1,428,627,663 would crowd out everything around it. */
export function formatIndicatorValueCompact(value: number, format: IndicatorFormat) {
  switch (format) {
    case 'currency':
      return compactUsdPrecise.format(value)
    case 'percent':
      return formatPercent(value)
    default:
      return formatCompactNumber(value)
  }
}
