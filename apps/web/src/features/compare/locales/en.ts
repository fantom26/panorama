export default {
  breadcrumb: {
    global: 'Global',
    compare: 'Compare'
  },
  eyebrow: 'Compare · {{count}} of {{max}}',
  title: 'Side-by-side comparison',
  add: {
    label: 'Add a country to compare',
    placeholder: 'Add a country',
    placeholderFull: 'Remove a country to add another',
    loading: 'Loading countries…',
    error: 'Couldn’t load countries.',
    empty: 'No countries match',
    added: 'Added'
  },
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
    body: 'Search for a country to start comparing.',
    cta: 'Browse the global dashboard'
  }
} as const
