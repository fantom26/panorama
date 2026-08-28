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
    back: 'Back to {{region}}',
    addToCompare: '+ Add to Compare'
  },
  sections: {
    historical: 'Historical · {{label}} ({{range}})',
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
