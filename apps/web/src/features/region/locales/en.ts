export default {
  breadcrumb: {
    global: 'Global'
  },
  header: {
    eyebrow: 'Region'
  },
  switcher: {
    label: 'Switch region'
  },
  filter: {
    activeBy: 'Filtered by {{name}}',
    clear: 'Clear filter'
  },
  tiles: {
    countries: 'Countries',
    totalPopulation: 'Total population',
    avgGdp: 'Avg GDP',
    avgGdpPerCapita: 'Avg GDP / cap',
    avgInflation: 'Avg inflation'
  },
  sections: {
    regionalMap: 'Regional map',
    regionalMapHint: 'Click a country to view details',
    incomeLevels: 'Income levels',
    topEconomies: 'GDP per capita · top economies in {{region}}',
    globalRanking: 'Global GDP per capita ranking →'
  },
  incomeRow: {
    count_one: '{{count}} country',
    count_other: '{{count}} countries',
    population: 'Pop · {{value}}',
    gdp: 'GDP · {{value}}'
  }
} as const
