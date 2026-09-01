export default {
  buttons: {
    closeButton: {
      ariaLabel: 'Close'
    }
  },
  breadcrumbs: {
    ariaLabel: 'breadcrumb'
  },
  charts: {
    donutChart: {
      otherLabel: 'Other'
    },
    mapLegend: {
      low: 'Low',
      high: 'High'
    },
    worldMap: {
      noData: 'No data'
    }
  },
  dataTable: {
    error: 'Something went wrong',
    noData: 'No data',
    filterPlaceholder: 'Filter…',
    filterColumnAriaLabel: 'Filter {{column}}',
    prev: 'Prev',
    next: 'Next',
    pageOf: 'Page {{page}} of {{count}}'
  },
  themeToggle: {
    ariaLabel: 'Toggle color theme',
    system: 'System',
    light: 'Light',
    dark: 'Dark'
  },
  languageSwitcher: {
    ariaLabel: 'Change language'
  }
} as const
