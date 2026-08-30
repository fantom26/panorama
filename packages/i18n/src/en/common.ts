export default {
  tableColumns: {
    code: 'Code',
    name: 'Name',
    region: 'Region'
  },
  actions: {
    submit: 'Submit',
    back: 'Back',
    addToCompare: 'Add to Compare',
    retry: 'Retry',
    showAll: 'Show all',
    openDrawer: 'Open drawer',
    apply: 'Apply'
  },
  screen: {
    title: 'Countries'
  },
  meta: {
    description:
      'Global drill-down finance dashboard — country statistics, rankings and comparisons from the Statistics of the World API.'
  },
  errors: {
    generic: {
      title: 'Something went wrong',
      description: 'The page hit an unexpected error.'
    },
    notFound: {
      pageLabel: 'Page not found',
      title: '404',
      description: 'This page doesn’t exist.',
      backHome: 'Back to home'
    },
    section: {
      title: 'This section could not be loaded.',
      details: 'Details'
    }
  }
} as const
