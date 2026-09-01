export default {
  breadcrumb: {
    global: 'Global'
  },
  header: {
    eyebrow: 'Ranking',
    title: '{{name}} ranking',
    meta: '{{source}} · {{year}}'
  },
  switcher: {
    label: 'Switch indicator'
  },
  indicators: {
    population: 'Population',
    gdp: 'GDP',
    'gdp-per-capita': 'GDP per capita',
    inflation: 'Inflation',
    unemployment: 'Unemployment',
    area: 'Surface area'
  },
  tiles: {
    leader: 'Leader',
    median: 'Median',
    lowest: 'Lowest',
    category: 'Category',
    ranked: 'Economies ranked'
  },
  sections: {
    top: 'Top {{count}}',
    table: 'League table ({{count}})'
  },
  table: {
    rank: 'Rank',
    country: 'Country',
    value: 'Value',
    year: 'Year'
  }
} as const
