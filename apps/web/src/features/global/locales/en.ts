export default {
  pageName: 'Global',
  search: {
    placeholder: 'Search countries',
    shortcutHint: '⌘K',
    resultsCount_one: '{{count}} result',
    resultsCount_other: '{{count}} results',
    empty: 'No countries found',
    error: 'Could not load countries',
    hints: '↑↓ navigate · ↵ select · esc close',
    brand: 'panorama search'
  },
  header: {
    eyebrow: 'Dashboard',
    title: 'Global overview',
    lastSync: 'Last sync · {{time}}',
    dataSource: 'Data: statisticsoftheworld.com'
  },
  tiles: {
    countries: 'Countries',
    totalPopulation: 'Total population',
    avgGdp: 'Average GDP',
    avgInflation: 'Avg inflation',
    avgUnemployment: 'Avg unemployment'
  },
  sections: {
    gdpHeatmap: 'GDP heatmap — click a country to drill down',
    gdpByRegion: 'GDP by region',
    populationByRegion: 'Population by region',
    highestInflation: 'Highest inflation',
    inflationRanking: 'Full inflation ranking →'
  },
  compareIndicator: {
    aria: 'View country comparison ({{count}})'
  }
} as const
