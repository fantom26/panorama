export default {
  breadcrumb: {
    global: 'عالمي'
  },
  header: {
    eyebrow: 'المنطقة'
  },
  switcher: {
    label: 'تغيير المنطقة'
  },
  filter: {
    activeBy: 'مُصفّى حسب {{name}}',
    clear: 'مسح التصفية'
  },
  tiles: {
    countries: 'الدول',
    totalPopulation: 'إجمالي عدد السكان',
    avgGdp: 'متوسط الناتج المحلي',
    avgGdpPerCapita: 'متوسط نصيب الفرد من الناتج',
    avgInflation: 'متوسط التضخم'
  },
  sections: {
    regionalMap: 'خريطة المنطقة',
    regionalMapHint: 'انقر على دولة لعرض التفاصيل',
    incomeLevels: 'مستويات الدخل',
    topEconomies: 'نصيب الفرد من الناتج المحلي · أكبر الاقتصادات في {{region}}'
  },
  incomeRow: {
    count_one: 'دولة واحدة',
    count_other: '{{count}} دولة',
    population: 'السكان · {{value}}',
    gdp: 'الناتج · {{value}}'
  }
} as const
