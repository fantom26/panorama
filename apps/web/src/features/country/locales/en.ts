export default {
  breadcrumb: {
    global: 'Global'
  },
  stats: {
    population: 'Population',
    area: 'Area',
    areaUnit: 'km²',
    capital: 'Capital',
    gdp: 'GDP',
    gdpPerCapita: 'GDP / cap',
    inflation: 'Inflation',
    unemployment: 'Unemployment'
  },
  buttons: {
    addToCompare: '+ Add to Compare',
    inCompare: 'View comparison',
    compareFull: 'Comparison is full (5)'
  },
  sections: {
    historical: 'Historical · {{label}} ({{range}})',
    ranking: 'Global {{label}} ranking →',
    indicators: 'Indicators ({{count}})'
  },
  chart: {
    gdp: 'GDP',
    gdpPerCapita: 'GDP/cap',
    inflation: 'Inflation',
    unemployment: 'Unemployment'
  },
  table: {
    indicator: 'Indicator',
    category: 'Category',
    year: 'Year',
    value: 'Value'
  }
} as const
