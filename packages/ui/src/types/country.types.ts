export type CountryData = {
  id: string
  name: string
  region: string
}

// prettier-ignore
type UpperAlpha =
  | 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L' | 'M'
  | 'N' | 'O' | 'P' | 'Q' | 'R' | 'S' | 'T' | 'U' | 'V' | 'W' | 'X' | 'Y' | 'Z'

/** ISO 3166-1 alpha-2 country code — two lowercase letters, e.g. `"de"`. */
export type Alpha2Code = `${Lowercase<UpperAlpha>}${Lowercase<UpperAlpha>}`
