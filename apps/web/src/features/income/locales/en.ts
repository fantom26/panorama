export default {
  breadcrumb: {
    global: 'Global'
  },
  header: {
    eyebrow: 'Income tier',
    title: '{{name}} economies',
    count_one: '{{count}} economy',
    count_other: '{{count}} economies'
  },
  switcher: {
    label: 'Switch income tier'
  },
  tiles: {
    economies: 'Economies',
    totalPopulation: 'Total population',
    totalGdp: 'Total GDP',
    avgGdpPerCapita: 'Avg GDP / cap',
    avgInflation: 'Avg inflation'
  },
  sections: {
    map: 'Where they are',
    mapHint: 'Click a country to view details',
    regions: 'By region',
    economies: 'Economies ({{count}})'
  },
  regionRow: {
    count_one: '{{count}} country',
    count_other: '{{count}} countries',
    population: 'Pop · {{value}}',
    gdp: 'GDP · {{value}}'
  },
  card: {
    population: 'Population',
    gdp: 'GDP',
    gdpPerCapita: 'GDP / cap'
  },
  showAll: 'Show all {{count}}'
} as const
