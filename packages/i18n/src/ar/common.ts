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
  errors: {
    generic: {
      title: 'حدث خطأ ما',
      description: 'واجهت الصفحة خطأً غير متوقع.'
    }
  }
} as const
