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

/** e.g. 8192078152 -> "8.19B" */
export const formatCompactNumber = (value: number) => compactNumber.format(value)

/** e.g. 652331208333 -> "$652B" */
export const formatCompactUsd = (value: number) => compactUsd.format(value)

/** e.g. 60496.44 -> "$60,496" */
export const formatUsd = (value: number) => usd.format(value)

/** e.g. 7.5609 -> "7.6%" */
export const formatPercent = (value: number) => `${value.toFixed(1)}%`

/** e.g. 32383920000000 -> "$32.4T" */
export const formatGdp = (value: number) => `$${(value / 1e12).toFixed(1)}T`
