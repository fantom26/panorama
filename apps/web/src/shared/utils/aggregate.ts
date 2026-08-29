export function sum(values: readonly (number | null)[]): number {
  return values.reduce<number>((total, value) => (value == null ? total : total + value), 0)
}

export function avg(values: readonly (number | null)[]): number | null {
  const present = values.filter((value): value is number => value != null)
  return present.length ? sum(present) / present.length : null
}

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
