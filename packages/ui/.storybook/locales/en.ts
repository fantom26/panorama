// Storybook-only resources: sample data and demo copy used exclusively by
// *.stories.tsx files. Never consumed by production components — see @repo/i18n
// for the shared resources those use.
export default {
  iconButton: {
    searchAriaLabel: 'Search'
  },
  chip: {
    noIndicatorsSelected: 'No indicators selected'
  },
  dataTable: {
    noCountriesFound: 'No countries found',
    failedToLoadCountries: 'Failed to load countries',
    noCountries: 'No countries',
    unknownError: 'Unknown error'
  },
  statCard: {
    totalPopulation: 'Total population',
    unemploymentRate: 'Unemployment rate',
    medianAge: 'Median age',
    gdpPerCapita: 'GDP per capita'
  },
  progress: {
    ariaLabel: 'Amount of countries with a specific language'
  },
  toast: {
    syncingTitle: 'Syncing',
    syncingDescription: 'Fetching World Bank indicators…',
    syncedTitle: 'Synced',
    syncedDescription: '249 countries updated.',
    requestFailedTitle: 'Request failed',
    requestFailedDescription: 'Indicator data unavailable for 3 countries.',
    staleTitle: 'Data may be stale',
    staleDescription: 'Last refresh was over 24 hours ago.'
  },
  checkbox: {
    includeDisputedTerritories: 'Include disputed territories',
    showNullIndicators: 'Show null indicators',
    showNullIndicatorsHint: 'Countries missing World Bank data',
    allRows: 'All rows',
    acceptTerms: 'Accept the data usage terms',
    acceptTermsError: 'You must accept the terms to continue',
    aggregateRegions: 'Aggregate regions',
    aggregateRegionsHint: 'Requires the compare flag'
  },
  expandableSearch: {
    placeholder: 'Search countries'
  },
  field: {
    searchLabel: 'Search',
    searchPlaceholder: 'Search countries',
    gdpFloorLabel: 'GDP floor',
    gdpFloorHint: 'Filters the ranking chart',
    gdpFloorAdornment: 'USD B',
    yearLabel: 'Year',
    yearError: 'Must be between 1960 and 2024',
    isoCodeLabel: 'ISO code'
  },
  radio: {
    logarithmic: 'Logarithmic',
    logarithmicHint: 'Default — spreads small economies',
    chooseScaleError: 'Choose a scale before continuing',
    mapScaleAriaLabel: 'Map scale',
    linear: 'Linear',
    quantile: 'Quantile'
  },
  select: {
    allRegions: 'All regions',
    locale: 'Locale',
    unsupportedLocale: 'Unsupported locale',
    region: 'Region'
  },
  textField: {
    searchPlaceholder: 'Search countries',
    usdBAdornment: 'USD B',
    percentAdornment: '%',
    percentAriaLabel: 'Percentage value'
  },
  dialog: {
    title: 'Add country to compare',
    description: 'Search and select a country to add to the comparison. Up to 5 countries.',
    closeAriaLabel: 'Close dialog'
  },
  drawer: {
    compareLabel: 'Compare',
    selectedTitle: 'Selected',
    closeAriaLabel: 'Close drawer'
  },
  typography: {
    sample: 'Global GDP grew 3.2% in the fourth quarter',
    componentOverride: 'Rendered as an h2 despite title-sm defaulting to h5'
  },
  tabs: {
    panelContent: '{{label}} panel content'
  }
} as const
