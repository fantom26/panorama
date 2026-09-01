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
    addToCompare: '+ إضافة للمقارنة',
    inCompare: 'عرض المقارنة',
    compareFull: 'المقارنة ممتلئة (5)'
  },
  sections: {
    historical: 'تاريخي · {{label}} ({{range}})',
    ranking: 'الترتيب العالمي لـ {{label}}',
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
