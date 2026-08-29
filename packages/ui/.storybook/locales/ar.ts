// Storybook-only resources: sample data and demo copy used exclusively by
// *.stories.tsx files. Never consumed by production components — see @repo/i18n
// for the shared resources those use.
export default {
  iconButton: {
    searchAriaLabel: 'بحث'
  },
  chip: {
    noIndicatorsSelected: 'لم يتم اختيار أي مؤشرات'
  },
  dataTable: {
    noCountriesFound: 'لم يتم العثور على دول',
    failedToLoadCountries: 'فشل تحميل الدول',
    noCountries: 'لا توجد دول',
    unknownError: 'خطأ غير معروف'
  },
  statCard: {
    totalPopulation: 'إجمالي السكان',
    unemploymentRate: 'معدل البطالة',
    medianAge: 'متوسط العمر',
    gdpPerCapita: 'نصيب الفرد من الناتج المحلي الإجمالي'
  },
  progress: {
    ariaLabel: 'عدد الدول التي تتحدث لغة معينة'
  },
  toast: {
    syncingTitle: 'جارٍ المزامنة',
    syncingDescription: 'جارٍ جلب مؤشرات البنك الدولي…',
    syncedTitle: 'تمت المزامنة',
    syncedDescription: 'تم تحديث 249 دولة.',
    requestFailedTitle: 'فشل الطلب',
    requestFailedDescription: 'بيانات المؤشر غير متوفرة لـ 3 دول.',
    staleTitle: 'قد تكون البيانات قديمة',
    staleDescription: 'كان آخر تحديث منذ أكثر من 24 ساعة.'
  },
  checkbox: {
    includeDisputedTerritories: 'تضمين الأراضي المتنازع عليها',
    showNullIndicators: 'إظهار المؤشرات الفارغة',
    showNullIndicatorsHint: 'الدول التي تفتقر إلى بيانات البنك الدولي',
    allRows: 'جميع الصفوف',
    acceptTerms: 'قبول شروط استخدام البيانات',
    acceptTermsError: 'يجب عليك قبول الشروط للمتابعة',
    aggregateRegions: 'تجميع المناطق',
    aggregateRegionsHint: 'يتطلب تفعيل خاصية المقارنة'
  },
  field: {
    searchLabel: 'بحث',
    searchPlaceholder: 'البحث عن الدول',
    gdpFloorLabel: 'الحد الأدنى للناتج المحلي الإجمالي',
    gdpFloorHint: 'يُصفّي مخطط التصنيف',
    gdpFloorAdornment: 'USD B',
    yearLabel: 'السنة',
    yearError: 'يجب أن تكون بين 1960 و2024',
    isoCodeLabel: 'رمز ISO'
  },
  radio: {
    logarithmic: 'لوغاريتمي',
    logarithmicHint: 'الافتراضي — يوسّع نطاق الاقتصادات الصغيرة',
    chooseScaleError: 'اختر مقياسًا قبل المتابعة',
    mapScaleAriaLabel: 'مقياس الخريطة',
    linear: 'خطي',
    quantile: 'شرائحي'
  },
  select: {
    allRegions: 'جميع المناطق',
    locale: 'اللغة',
    unsupportedLocale: 'لغة غير مدعومة',
    region: 'المنطقة'
  },
  textField: {
    searchPlaceholder: 'البحث عن الدول',
    usdBAdornment: 'USD B',
    percentAdornment: '%',
    percentAriaLabel: 'القيمة المئوية'
  },
  dialog: {
    title: 'إضافة دولة للمقارنة',
    description: 'ابحث عن دولة وأضفها إلى المقارنة. حتى 5 دول كحد أقصى.',
    closeAriaLabel: 'إغلاق الحوار'
  },
  drawer: {
    compareLabel: 'مقارنة',
    selectedTitle: 'المحدد',
    closeAriaLabel: 'إغلاق اللوحة'
  },
  typography: {
    sample: 'نما الناتج المحلي الإجمالي العالمي بنسبة 3.2% في الربع الرابع',
    componentOverride: 'يُعرض كعنصر h2 رغم أن title-sm يستخدم h5 افتراضيًا'
  },
  tabs: {
    panelContent: 'محتوى لوحة {{label}}'
  }
} as const
