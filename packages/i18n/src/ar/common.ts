export default {
  tableColumns: {
    code: 'الرمز',
    name: 'الاسم',
    region: 'المنطقة'
  },
  actions: {
    submit: 'إرسال',
    back: 'رجوع',
    addToCompare: 'إضافة للمقارنة',
    retry: 'إعادة المحاولة',
    showAll: 'عرض الكل',
    openDrawer: 'فتح اللوحة',
    apply: 'تطبيق'
  },
  screen: {
    title: 'الدول'
  },
  meta: {
    description:
      'لوحة تحكم مالية عالمية بالتنقل التفصيلي — إحصاءات الدول والتصنيفات والمقارنات من واجهة Statistics of the World البرمجية.'
  },
  errors: {
    generic: {
      title: 'حدث خطأ ما',
      description: 'واجهت الصفحة خطأً غير متوقع.'
    },
    notFound: {
      pageLabel: 'الصفحة غير موجودة',
      title: '404',
      description: 'هذه الصفحة غير موجودة.',
      backHome: 'العودة إلى الصفحة الرئيسية'
    }
  }
} as const
