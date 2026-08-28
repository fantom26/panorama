export default {
  pageName: 'عالمي',
  search: {
    placeholder: 'ابحث عن الدول'
  },
  header: {
    eyebrow: 'لوحة التحكم',
    title: 'نظرة عامة عالمية',
    lastSync: 'آخر مزامنة · {{time}}',
    dataSource: 'البيانات: statisticsoftheworld.com'
  },
  tiles: {
    countries: 'الدول',
    totalPopulation: 'إجمالي عدد السكان',
    averageGdp: 'متوسط الناتج المحلي الإجمالي',
    avgInflation: 'متوسط التضخم',
    avgUnemployment: 'متوسط البطالة'
  },
  sections: {
    gdpHeatmap: 'الخريطة الحرارية للناتج المحلي الإجمالي — انقر على دولة للتفاصيل',
    gdpByRegion: 'الناتج المحلي الإجمالي حسب المنطقة',
    populationByRegion: 'عدد السكان حسب المنطقة',
    highestInflation: 'أعلى معدلات التضخم'
  }
} as const
