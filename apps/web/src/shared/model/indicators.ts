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

/**
 * The five rankings merged onto the country catalog to build the home dashboard dataset.
 * One ranking call returns a value for every country, so this is 5 requests, never a
 * per-country fan-out.
 */
export const DASHBOARD_INDICATORS = [
  INDICATOR.population,
  INDICATOR.gdp,
  INDICATOR.gdpPerCapita,
  INDICATOR.inflation,
  INDICATOR.unemployment
] as const satisfies readonly IndicatorId[]
