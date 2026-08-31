export default {
  breadcrumb: {
    global: 'Global',
    compare: 'Compare'
  },
  eyebrow: 'Compare · {{count}} of {{max}}',
  title: 'Side-by-side comparison',
  addHint: 'Add countries from their detail page',
  sections: {
    indicators: 'Indicators'
  },
  matrix: {
    population: 'Population',
    gdp: 'GDP, nominal USD',
    gdpPerCapita: 'GDP per capita',
    inflation: 'Inflation, CPI YoY',
    unemployment: 'Unemployment'
  },
  single: {
    hint: 'Add another country to compare side by side.'
  },
  empty: {
    title: 'No countries to compare yet',
    body: 'Open any country and choose “+ Add to Compare”.',
    cta: 'Browse the global dashboard'
  }
} as const
