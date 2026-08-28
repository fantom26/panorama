export default {
  breadcrumb: {
    global: 'عالمي'
  },
  stats: {
    population: 'عدد السكان',
    area: 'المساحة',
    areaUnit: 'كم²',
    capital: 'العاصمة',
    gdp: 'الناتج المحلي الإجمالي',
    gdpPerCapita: 'نصيب الفرد من الناتج المحلي',
    inflation: 'التضخم',
    unemployment: 'البطالة'
  },
  buttons: {
    back: 'العودة إلى {{region}}',
    addToCompare: '+ إضافة للمقارنة'
  },
  sections: {
    historical: 'تاريخي · {{label}} ({{range}})',
    indicators: 'المؤشرات ({{count}})'
  },
  chart: {
    gdp: 'الناتج المحلي',
    gdpPerCapita: 'نصيب الفرد',
    inflation: 'التضخم',
    unemployment: 'البطالة'
  },
  table: {
    indicator: 'المؤشر',
    category: 'الفئة',
    year: 'السنة',
    value: 'القيمة'
  }
} as const
