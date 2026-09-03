export default {
  pageName: 'عالمي',
  search: {
    placeholder: 'ابحث عن الدول',
    shortcutHint: '⌘K',
    resultsCount_one: 'نتيجة واحدة',
    resultsCount_other: '{{count}} نتيجة',
    empty: 'لا توجد دول',
    error: 'تعذّر تحميل الدول',
    hints: '↑↓ للتنقل · ↵ للاختيار · esc للإغلاق',
    brand: 'بحث بانوراما'
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
    avgGdp: 'متوسط الناتج المحلي الإجمالي',
    avgInflation: 'متوسط التضخم',
    avgUnemployment: 'متوسط البطالة'
  },
  sections: {
    gdpHeatmap: 'الخريطة الحرارية للناتج المحلي الإجمالي — انقر على دولة للتفاصيل',
    gdpByRegion: 'الناتج المحلي الإجمالي حسب المنطقة',
    populationByRegion: 'عدد السكان حسب المنطقة',
    highestInflation: 'أعلى معدلات التضخم',
    inflationRanking: 'الترتيب الكامل للتضخم'
  },
  compareIndicator: {
    aria: 'عرض مقارنة الدول ({{count}})'
  }
} as const
