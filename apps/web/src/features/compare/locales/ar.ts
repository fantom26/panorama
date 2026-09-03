export default {
  breadcrumb: {
    global: 'عالمي',
    compare: 'المقارنة'
  },
  eyebrow: 'المقارنة · {{count}} من {{max}}',
  title: 'مقارنة جنبًا إلى جنب',
  add: {
    label: 'أضف دولة إلى المقارنة',
    placeholder: 'أضف دولة',
    placeholderFull: 'أزِل دولة لإضافة أخرى',
    loading: 'جارٍ تحميل الدول…',
    error: 'تعذّر تحميل الدول.',
    empty: 'لا توجد دول مطابقة',
    added: 'مُضافة'
  },
  sections: {
    indicators: 'المؤشرات'
  },
  matrix: {
    population: 'عدد السكان',
    gdp: 'الناتج المحلي الإجمالي، بالدولار الاسمي',
    gdpPerCapita: 'نصيب الفرد من الناتج المحلي الإجمالي',
    inflation: 'التضخم، مؤشر أسعار المستهلك السنوي',
    unemployment: 'البطالة'
  },
  single: {
    hint: 'أضف دولة أخرى للمقارنة جنبًا إلى جنب.'
  },
  empty: {
    title: 'لا توجد دول للمقارنة بعد',
    body: 'ابحث عن دولة لبدء المقارنة.',
    cta: 'تصفح لوحة المعلومات العالمية'
  }
} as const
