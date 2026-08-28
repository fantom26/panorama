// prettier-ignore
type UpperAlpha =
  | 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L' | 'M'
  | 'N' | 'O' | 'P' | 'Q' | 'R' | 'S' | 'T' | 'U' | 'V' | 'W' | 'X' | 'Y' | 'Z'

type LowerAlpha = Lowercase<UpperAlpha>

/** ISO 3166-1 alpha-3 country code — three uppercase letters, e.g. `"USA"`. */
export type Alpha3Code = `${UpperAlpha}${UpperAlpha}${UpperAlpha}`

/** ISO 3166-1 alpha-2 country code — two lowercase letters, e.g. `"ua"`. */
export type Alpha2Code = `${LowerAlpha}${LowerAlpha}`
