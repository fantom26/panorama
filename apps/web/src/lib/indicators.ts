export const INDICATOR = {
  population: 'SP.POP.TOTL',
  gdp: 'IMF.NGDPD',
  gdpPerCapita: 'IMF.NGDPDPC',
  inflation: 'IMF.PCPIPCH',
  unemployment: 'IMF.LUR',
  area: 'AG.SRF.TOTL.K2'
} as const

export type IndicatorId = (typeof INDICATOR)[keyof typeof INDICATOR]

/** The subset plotted on the country page's historical chart (population/area are stat-only). */
export const CHART_INDICATORS = [
  INDICATOR.gdp,
  INDICATOR.gdpPerCapita,
  INDICATOR.inflation,
  INDICATOR.unemployment
] as const satisfies readonly IndicatorId[]
