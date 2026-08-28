export default {
  pageName: 'Global',
  search: {
    placeholder: 'Search countries'
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
    averageGdp: 'Average GDP',
    avgInflation: 'Avg inflation',
    avgUnemployment: 'Avg unemployment'
  },
  sections: {
    gdpHeatmap: 'GDP heatmap — click a country to drill down',
    gdpByRegion: 'GDP by region',
    populationByRegion: 'Population by region',
    highestInflation: 'Highest inflation'
  }
} as const
