/**
 * A frozen string→string record plus its derived lookups. Used by the region,
 * income-level and ranking-indicator models, each of which maps a URL slug to a
 * display name / API code and back.
 */
export type SlugMap<K extends string, V extends string> = {
  keys: K[]
  values: V[]
  /** `record[key]`, or `undefined` for an unknown key. */
  forward: (key: string) => V | undefined
  /** The key whose value is `value`, or `undefined` for an unknown value. */
  reverse: (value: string) => K | undefined
}

export function createSlugMap<const M extends Record<string, string>>(
  record: M
): SlugMap<keyof M & string, M[keyof M] & string> {
  type K = keyof M & string
  type V = M[keyof M] & string

  const entries = Object.entries(record) as [K, V][]
  const byKey = new Map<string, V>(entries)
  const byValue = new Map<string, K>(entries.map(([key, value]) => [value, key]))

  return {
    keys: entries.map(([key]) => key),
    values: entries.map(([, value]) => value),
    forward: (key) => byKey.get(key),
    reverse: (value) => byValue.get(value)
  }
}
