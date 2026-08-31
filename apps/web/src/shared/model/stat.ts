/** A labelled headline figure rendered as a `StatCard` — the value is pre-formatted for display. */
export type Stat<Key extends string = string> = { key: Key; value: string }

export function toStats<Key extends string>(
  keys: readonly Key[],
  values?: Record<Key, string>
): Stat<Key>[] {
  return keys.map((key) => ({ key, value: values ? values[key] : '—' }))
}
