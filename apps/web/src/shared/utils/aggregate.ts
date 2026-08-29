/**
 * Null-safe aggregation over SOTW values. Observations are frequently missing
 * (`null`) and must never break a rollup: sums skip them, means average only the
 * values that are present.
 */

/** Sum, ignoring nulls. Empty or all-null input sums to `0`. */
export function sum(values: readonly (number | null)[]): number {
  return values.reduce<number>((total, value) => (value == null ? total : total + value), 0)
}

/** Mean of the non-null values, or `null` when there is nothing to average. */
export function avg(values: readonly (number | null)[]): number | null {
  const present = values.filter((value): value is number => value != null)
  return present.length ? sum(present) / present.length : null
}

/** Group items into buckets keyed by the stringified value at `key`. */
export function groupBy<T, K extends keyof T>(list: readonly T[], key: K): Record<string, T[]> {
  const groups: Record<string, T[]> = {}
  for (const item of list) {
    const bucket = String(item[key])
    const existing = groups[bucket] ?? []
    existing.push(item)
    groups[bucket] = existing
  }
  return groups
}
