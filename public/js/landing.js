/**
 * حاضنة ومسرعة عذق - جمعية البر بالمدينة المنورة
 * المحرك التفاعلي الشامل (Full Interactive Standalone & Portal Engine)
 * يتضمن: محاكي الأدوار، نموذج التقديم المتدرج، حاسبة الجاهزية، البحث السريع، ولوحات التحكم.
 */

// LocalStorage Persistence Key
const ATHQ_STORAGE_KEY = 'athq_incubator_storage_v4';

// Default Seed Data
const DEFAULT_SEED_DATA = {
  stats: {
    volunteers: 1122,
    volunteer_hours: 16311,
    work_hours: 4470,
    consultations: 28,
    active_incubated: 15,
    graduated: 7
  },
  notifications: [
    { id: "NTF-1", title: "اعتماد لائحة الحوكمة والأنظمة", text: "تم اعتماد اللائحة الأساسية وتحديث مصفوفة الصلاحيات لجمعية ديوان بنجاح.", time: "منذ 10 دقائق", unread: true, icon: "fa-shield-halved" },
    { id: "NTF-2", title: "جلسة استشارية جديدة مجدولة", text: "تم تأكيد حجز جلسة استشارية متخصصة مع د. سليمان الحربي.", time: "منذ 45 دقيقة", unread: true, icon: "fa-calendar-check" },
    { id: "NTF-3", title: "تحديث مؤشرات الأداء والأثر", text: "تم توثيق +16,311 ساعة تطوعية و+4,470 ساعة عمل معتمدة بالحاضنة.", time: "منذ ساعتين", unread: true, icon: "fa-chart-pie" }
  ],
  contactMessages: [
    {
      id: "MSG-1082",
      name: "أحمد بن عبدالمحسن النعيمي",
      org: "مبادرة التمكين الرقمي",
      phone: "0501234987",
      email: "ahmed.naimi@example.com",
      subject: "طلب احتضان وتسجيل جمعية ناشئة",
      message: "نحن في مرحلة استكمال ملف التأسيس ونرغب في الاستفادة من العنوان الوطني والقاعات والخدمات المحاسبية بحاضنة عذق.",
      date: "1446/08/12",
      status: "قيد المتابعة"
    },
    {
      id: "MSG-1081",
      name: "د. خالد السبيعي",
      org: "مستشار حوكمة مستقل",
      phone: "0559871234",
      email: "dr.khaled@example.org",
      subject: "الانضمام كخبير أو مستشار متعاون",
      message: "أرغب بتقديم جلسات استشارية تطوعية معتمدة عبر المنصة الوطنية لدعم الجمعيات الأهلية الناشئة في مجال الحوكمة ومصفوفة الصلاحيات.",
      date: "1446/08/10",
      status: "تم التواصل"
    }
  ],
  directoryOrgs: [
    // 15 الجهات المحتضنة المعتمدة رسمياً في كتيب التقارير
    { name: "وقف العمل الصالح", lic: "1530", track: "مسار البناء والتمكين المؤسسي", cat: "ثقافة", status: "محتضنة", hours: "+360 ساعة عمل", volHours: "+70 ساعة تطوعية", volunteers: "+16 متطوعاً", badge: "مكتب مجهز" },
    { name: "جمعية ديوان الشبابية", lic: "1842", track: "مسار الحوكمة والتمكين الشامل", cat: "شباب", status: "محتضنة", hours: "+1,624 ساعة عمل", volHours: "+197 ساعة تطوعية", volunteers: "+36 متطوعاً", badge: "مكتب مجهز رقم 4" },
    { name: "جمعية التنمية الرياضية", lic: "1920", track: "مسار التأهيل والتدريب المتخصص", cat: "شباب", status: "محتضنة", hours: "+120 ساعة عمل", volHours: "+1,240 ساعة تطوعية", volunteers: "+56 متطوعاً", badge: "مساحة مشتركة" },
    { name: "الجمعية الفلكية بالمدينة المنورة", lic: "1680", track: "مسار الابتكار وتطوير المبادرات", cat: "ثقافة", status: "محتضنة", hours: "+180 ساعة عمل", volHours: "+95 ساعة تطوعية", volunteers: "+12 متطوعاً", badge: "مكتب مجهز" },
    { name: "جمعية الوفاء الرياضية", lic: "2015", track: "مسار الاستدامة والشراكات التنموية", cat: "شباب", status: "محتضنة", hours: "+210 ساعة عمل", volHours: "+150 ساعة تطوعية", volunteers: "+20 متطوعاً", badge: "مساحة مشتركة" },
    { name: "جمعية إرشاد", lic: "1322", track: "مسار الحوكمة وبناء اللوائح", cat: "تنمية", status: "محتضنة", hours: "+510 ساعة عمل", volHours: "+240 ساعة تطوعية", volunteers: "+28 متطوعاً", badge: "مكتب مجهز رقم 1" },
    { name: "جمعية همم", lic: "2104", track: "مسار البناء المؤسسي والتمكين", cat: "شباب", status: "محتضنة", hours: "+180 ساعة عمل", volHours: "+30 ساعة تطوعية", volunteers: "+4 متطوعين", badge: "مساحة مشتركة 2" },
    { name: "جمعية النقاء", lic: "1450", track: "مسار البرامج والمبادرات المجتمعية", cat: "صحي", status: "محتضنة", hours: "+40 ساعة عمل", volHours: "+6,000 ساعة تطوعية", volunteers: "+100 متطوع", badge: "مكتب مجهز" },
    { name: "جمعية الرياضة النسائية", lic: "2230", track: "مسار التأهيل والتمكين المتخصص", cat: "شباب", status: "محتضنة", hours: "+190 ساعة عمل", volHours: "+110 ساعة تطوعية", volunteers: "+18 متطوعة", badge: "مساحة مشتركة" },
    { name: "جمعية عيون طيبة", lic: "1590", track: "مسار الرعاية الصحية والمساندة", cat: "صحي", status: "محتضنة", hours: "+340 ساعة عمل", volHours: "+280 ساعة تطوعية", volunteers: "+32 متطوعاً", badge: "مكتب مجهز" },
    { name: "جمعية صيانة الأهلية", lic: "1765", track: "مسار الدعم والمساندة التشغيلية", cat: "تنمية", status: "محتضنة", hours: "+250 ساعة عمل", volHours: "+100 ساعة تطوعية", volunteers: "+5 متطوعين", badge: "مساحة مشتركة" },
    { name: "جمعية سفراء", lic: "2315", track: "مسار العمل التطوعي والشراكات", cat: "تنمية", status: "محتضنة", hours: "+160 ساعة عمل", volHours: "+320 ساعة تطوعية", volunteers: "+45 متطوعاً", badge: "مساحة مشتركة" },
    { name: "إحسان الطبية للتوعية والتدريب الصحي", lic: "1880", track: "مسار التدريب والتأهيل التخصصي", cat: "صحي", status: "محتضنة", hours: "+220 ساعة عمل", volHours: "+410 ساعة تطوعية", volunteers: "+35 متطوعاً", badge: "مكتب مجهز" },
    { name: "مؤسسة نسيج الأهلية", lic: "2090", track: "مسار البناء المؤسسي والاستدامة", cat: "تنمية", status: "محتضنة", hours: "+270 ساعة عمل", volHours: "+130 ساعة تطوعية", volunteers: "+15 متطوعاً", badge: "مكتب مجهز" },
    { name: "جمعية الإدارة القيادية للموارد البشرية", lic: "1995", track: "مسار الحوكمة وتطوير القيادات", cat: "تنمية", status: "محتضنة", hours: "+310 ساعة عمل", volHours: "+190 ساعة تطوعية", volunteers: "+22 متطوعاً", badge: "مكتب مجهز" },

    // 7 الجهات المتخرجة المعتمدة رسمياً في كتيب التقارير
    { name: "جمعية تكوين", lic: "1120", track: "تخرجت من مسرعة عذق بنجاح", cat: "تنمية", status: "متخرجة", hours: "1,200 ساعة عمل", volHours: "850 ساعة تطوعية", volunteers: "60 متطوعاً", badge: "تخرجت بنجاح ✓" },
    { name: "جمعية الأدب والأدباء", lic: "1280", track: "تخرجت من مسرعة عذق بنجاح", cat: "ثقافة", status: "متخرجة", hours: "980 ساعة عمل", volHours: "620 ساعة تطوعية", volunteers: "40 متطوعاً", badge: "تخرجت بنجاح ✓" },
    { name: "هيئة الصحفيين السعوديين (فرع المدينة المنورة)", lic: "1055", track: "تخرجت من مسرعة عذق بنجاح", cat: "ثقافة", status: "متخرجة", hours: "1,450 ساعة عمل", volHours: "910 ساعة تطوعية", volunteers: "55 متطوعاً", badge: "تخرجت بنجاح ✓" },
    { name: "جمعية رحاب لخدمات الحج والعمرة", lic: "1340", track: "تخرجت من مسرعة عذق بنجاح", cat: "تنمية", status: "متخرجة", hours: "1,600 ساعة عمل", volHours: "1,100 ساعة تطوعية", volunteers: "80 متطوعاً", badge: "تخرجت بنجاح ✓" },
    { name: "الجمعية السعودية للجودة (فرع المدينة المنورة)", lic: "1190", track: "تخرجت من مسرعة عذق بنجاح", cat: "تنمية", status: "متخرجة", hours: "1,100 ساعة عمل", volHours: "750 ساعة تطوعية", volunteers: "45 متطوعاً", badge: "تخرجت بنجاح ✓" },
    { name: "مجلس شباب المدينة المنورة", lic: "1410", track: "تخرجت من مسرعة عذق بنجاح", cat: "شباب", status: "متخرجة", hours: "1,850 ساعة عمل", volHours: "1,400 ساعة تطوعية", volunteers: "110 متطوعين", badge: "تخرجت بنجاح ✓" },
    { name: "جمعية رعاية الأرامل والمطلقات والمعلقات", lic: "1095", track: "تخرجت من مسرعة عذق بنجاح", cat: "تنمية", status: "متخرجة", hours: "1,340 ساعة عمل", volHours: "980 ساعة تطوعية", volunteers: "70 متطوعاً", badge: "تخرجت بنجاح ✓" }
  ],
  applications: [
    {
      id: "ATHQ-2025-001",
      associationName: "جمعية ديوان الشبابية",
      licenseNumber: "1842",
      nationalNumber700: "7009823411",
      city: "المدينة المنورة",
      repName: "عبدالله الحربي",
      repPhone: "0551234567",
      track: "مسار الحوكمة والتمكين الشامل",
      incubationType: "احتضان مكاني ومؤسسي",
      incubationMode: "spatial",
      incubationModeTitle: "احتضان مكاني وتشغيلي",
      stage: "المرحلة الثالثة: الاحتضان المكاني",
      stageProgress: 75,
      status: "مقبول",
      fullTimeEmployee: "متوفر ومسجل (عبدالله الحربي - دوام كامل)",
      examScore: 92,
      notes: "تم تسليم المكتب المجهز رقم 4 وتفعيل برامج الحوكمة وتنمية الموارد.",
      workHours: 1624,
      volunteerHours: 197,
      volunteersCount: 36,
      evidences: [
        { title: "عقد الاحتضان المعتمد", date: "2025-08-15", status: "معتمد وموقّع ✓" },
        { title: "تقرير الاستيفاء والمطابقة المؤسسية", date: "2025-08-18", status: "مستوفى بنجاح ✓" },
        { title: "خطاب حسم أداء الجمعية", date: "2025-08-20", status: "معتمد ✓" },
        { title: "نموذج طلب الانضمام موقّع ومختوم", date: "2025-08-22", status: "مكتمل ✓" },
        { title: "نموذج استلام المفتاح والعهد المكتبي", date: "2025-08-25", status: "مستلم رسمياً ✓" },
        { title: "وثيقة سياسة الأمان وبصمة الباب الذكية", date: "2025-08-25", status: "مفعلة ✓" },
        { title: "شهادة وجود موظف بدوام كامل متفرغ", date: "2025-08-26", status: "متحقق ومسجل ✓" }
      ]
    },
    {
      id: "ATHQ-2025-002",
      associationName: "وقف العمل الصالح",
      licenseNumber: "1530",
      nationalNumber700: "7008123984",
      city: "المدينة المنورة",
      repName: "إبراهيم السلمي",
      repPhone: "0543219876",
      track: "مسار البناء والتمكين المؤسسي",
      incubationType: "احتضان مكاني ومؤسسي",
      incubationMode: "accelerator",
      incubationModeTitle: "مسرعة أعمال ونمو الأثر",
      stage: "المرحلة الرابعة: مسرعة عذق",
      stageProgress: 90,
      status: "مقبول",
      fullTimeEmployee: "متوفر ومسجل (إبراهيم السلمي - دوام كامل)",
      examScore: 95,
      notes: "الجهة في المسار النهائي للاستدامة والتوسع والربط مع المانحين.",
      workHours: 360,
      volunteerHours: 70,
      volunteersCount: 16,
      evidences: [
        { title: "عقد الاحتضان المعتمد", date: "2025-07-10", status: "معتمد وموقّع ✓" },
        { title: "تقرير الاستيفاء والمطابقة المؤسسية", date: "2025-07-15", status: "مستوفى ✓" },
        { title: "خطاب حسم أداء الجمعية", date: "2025-07-20", status: "معتمد ✓" },
        { title: "نموذج طلب الانضمام موقّع ومختوم", date: "2025-07-22", status: "مكتمل ✓" },
        { title: "نموذج استلام المفتاح والعهد المكتبي", date: "2025-07-25", status: "مستلم رسمياً ✓" },
        { title: "تقرير مخرجات مسرعة عذق والاستدامة المالية", date: "2025-08-18", status: "معتمد ✓" }
      ]
    },
    {
      id: "ATHQ-2025-003",
      associationName: "جمعية همم الشبابية",
      licenseNumber: "2104",
      nationalNumber700: "7006543219",
      city: "المدينة المنورة",
      repName: "خالد الأحمدي",
      repPhone: "0567891234",
      track: "مسار التأهيل والتدريب المتخصص",
      incubationType: "مساحة عمل مشتركة",
      incubationMode: "idea",
      incubationModeTitle: "احتضان فكرة ومبادرة جديدة",
      ideaSummary: "مبادرة شبابية قيد التأسيس لتمكين اليافعين وتأهيلهم لسوق العمل والريادة المجتمعية بالمدينة المنورة.",
      stage: "المرحلة الثانية: التهيئة المؤسسية",
      stageProgress: 50,
      status: "تحت المراجعة",
      fullTimeEmployee: "قيد التعيين والاستكمال",
      examScore: 82,
      notes: "بانتظار استكمال رفع مصفوفة الصلاحيات واعتماد الحساب البنكي وإعادة اختبار انطلاقة الأولى لتحقيق 85%.",
      workHours: 120,
      volunteerHours: 25,
      volunteersCount: 8,
      evidences: [
        { title: "الترخيص الرسمي بالمركز الوطني (2104)", date: "2025-09-10", status: "معتمد ✓" },
        { title: "مسودة نموذج طلب الانضمام", date: "2025-09-12", status: "قيد المراجعة" }
      ]
    }
  ],
  bookings: [
    { id: "BKG-101", assocName: "جمعية ديوان الشبابية", facility: "قاعة الاجتماعات الكبرى الذكية", date: "2025-10-12", time: "10:00 ص - 12:00 م", status: "مؤكد ومعتمد ✓" },
    { id: "BKG-102", assocName: "وقف العمل الصالح", facility: "قاعة التدريب والتطوير", date: "2025-10-14", time: "05:00 م - 08:00 م", status: "مؤكد ومعتمد ✓" }
  ],
  services: [
    { id: "SRV-01", assocName: "جمعية ديوان الشبابية", title: "مقر مكتبي مستقل (المكتب المجهز رقم 4)", category: "مقرات ومكاتب", date: "2025-08-15", time: "دوام كامل (سنوي)", specs: "مكتب تنفيذي مجهز + حاسب آلي + هاتف داخلي + بصمة دخول", status: "نشط ومفعل ✓" },
    { id: "SRV-02", assocName: "وقف العمل الصالح", title: "مساحة الابتكار والاستثمار الوقفي", category: "مقرات ومكاتب", date: "2025-07-10", time: "دوام كامل (سنوي)", specs: "مكتب ريادي مستقل + قاعة استشارات خاصة", status: "نشط ومفعل ✓" },
    { id: "SRV-03", assocName: "جمعية همم الشبابية", title: "مساحة عمل مشتركة (محطة رقم 2)", category: "مقرات ومكاتب", date: "2025-09-15", time: "فترة مسائية (مرنة)", specs: "محطة عمل مرنة + إنترنت عالي السرعة + ضيافة", status: "نشط ومفعل ✓" },
    { id: "SRV-04", assocName: "جمعية ديوان الشبابية", title: "قاعة الاجتماعات الكبرى الذكية", category: "قاعات ذكية", date: "2025-10-12", time: "10:00 ص - 12:00 م", specs: "شاشات عرض ذكية تفاعلية + نظام صوتي لاسلكي", status: "مؤكد ومعتمد ✓" },
    { id: "SRV-05", assocName: "وقف العمل الصالح", title: "قاعة التدريب والتطوير والتأهيل", category: "قاعات ذكية", date: "2025-10-14", time: "05:00 م - 08:00 م", specs: "سعة 35 متدرباً + منصة ذكية + ضيافة", status: "مؤكد ومعتمد ✓" },
    { id: "SRV-06", assocName: "جمعية ديوان الشبابية", title: "العنوان الوطني المعتمد والبريد الإداري", category: "عنوان وطني ولوجستيات", date: "2025-08-15", time: "خدمة دائمة", specs: "تسجيل العنوان الوطني الموحد + استلام الطرود الرسمية", status: "نشط ومفعل ✓" },
    { id: "SRV-07", assocName: "جمعية همم الشبابية", title: "حزمة الربط المحاسبي السحابي المعتمد", category: "برمجيات ونظم", date: "2025-09-20", time: "اشتراك مدعوم", specs: "نظام قيود/دفاتر سحابي + شجرة حسابات غير ربحية", status: "نشط ومفعل ✓" }
  ],
  volunteering: [
    {
      id: "VOL-001",
      assocName: "جمعية النقاء الصحية",
      opportunityTitle: "تشغيل العيادات المتنقلة والتوعية الصحية الميدانية",
      volunteersCount: 100,
      hoursCount: 6000,
      economicImpact: "300,000 ر.س",
      platformRef: "NVG-1446-9921",
      status: "معتمد وموثق بالمنصة الوطنية ✓",
      category: "صحي وميداني"
    },
    {
      id: "VOL-002",
      assocName: "جمعية التنمية الرياضية",
      opportunityTitle: "تنظيم دوري الأحياء المجتمعي وتأهيل اليافعين",
      volunteersCount: 56,
      hoursCount: 1240,
      economicImpact: "62,000 ر.س",
      platformRef: "NVG-1446-8812",
      status: "معتمد وموثق بالمنصة الوطنية ✓",
      category: "شبابي ورياضي"
    },
    {
      id: "VOL-003",
      assocName: "جمعية ديوان الشبابية",
      opportunityTitle: "برنامج إرشاد القيادات الشابة وتصميم المبادرات",
      volunteersCount: 36,
      hoursCount: 197,
      economicImpact: "19,700 ر.س",
      platformRef: "NVG-1446-7734",
      status: "معتمد وموثق بالمنصة الوطنية ✓",
      category: "حوكمة وتمكين"
    },
    {
      id: "VOL-004",
      assocName: "جمعية همم الشبابية",
      opportunityTitle: "ملتقى بلورة الأفكار والمبادرات التأسيسية لليافعين",
      volunteersCount: 8,
      hoursCount: 30,
      economicImpact: "3,000 ر.س",
      platformRef: "NVG-1446-6621",
      status: "قيد المراجعة بالمنصة",
      category: "تأسيس ومبادرات"
    },
    {
      id: "VOL-005",
      assocName: "وقف العمل الصالح",
      opportunityTitle: "توثيق الأوقاف وتنمية المنح والوصايا التنموية",
      volunteersCount: 16,
      hoursCount: 70,
      economicImpact: "7,000 ر.س",
      platformRef: "NVG-1446-5542",
      status: "معتمد وموثق بالمنصة الوطنية ✓",
      category: "استدامة مالية"
    },
    {
      id: "VOL-006",
      assocName: "الجمعية الفلكية بالمدينة المنورة",
      opportunityTitle: "تنظيم ليالي رصد الأهلة والمعارض الفلكية للزوار",
      volunteersCount: 12,
      hoursCount: 95,
      economicImpact: "9,500 ر.س",
      platformRef: "NVG-1446-4431",
      status: "معتمد وموثق بالمنصة الوطنية ✓",
      category: "ثقافي وعلمي"
    },
    {
      id: "VOL-007",
      assocName: "جمعية سفراء",
      opportunityTitle: "سفراء العمل التطوعي وخدمة ضيوف الرحمن وزوار المدينة",
      volunteersCount: 45,
      hoursCount: 320,
      economicImpact: "32,000 ر.س",
      platformRef: "NVG-1446-3319",
      status: "معتمد وموثق بالمنصة الوطنية ✓",
      category: "خدمة مجتمعية"
    }
  ],
  consultations: [
    { id: "CNS-501", assocName: "جمعية ديوان الشبابية", consultant: "د. سليمان الحربي", field: "حوكمة المنظمات وبناء مصفوفة الصلاحيات", date: "2025-10-15", time: "10:00 ص - 12:00 م", status: "مجدولة" },
    { id: "CNS-502", assocName: "وقف العمل الصالح", consultant: "أ. ماجد العوفي", field: "الاستدامة المالية والاستثمار الوقفي", date: "2025-10-08", time: "05:00 م - 07:00 م", status: "منجزة ✓" },
    { id: "CNS-503", assocName: "جمعية همم الشبابية", consultant: "د. سليمان الحربي", field: "بناء اللائحة الأساسية ومسوغات التأسيس", date: "2025-10-18", time: "06:00 م - 08:00 م", status: "مجدولة" },
    { id: "CNS-504", assocName: "جمعية التنمية الرياضية", consultant: "د. نورة البلوي", field: "قياس الأثر المجتمعي وهندسة المبادرات", date: "2025-10-05", time: "04:00 م - 06:00 م", status: "منجزة ✓" },
    { id: "CNS-505", assocName: "الجمعية الفلكية بالمدينة المنورة", consultant: "أ. فهد الجهني", field: "التخطيط الاستراتيجي ومؤشرات الأداء OKRs", date: "2025-10-11", time: "11:00 ص - 01:00 م", status: "منجزة ✓" }
  ],
  consultants: [
    {
      id: "CONS-01",
      name: "د. سليمان الحربي",
      specialty: "حوكمة وأنظمة القطاع غير الربحي",
      title: "خبير استشارات مؤسسية وحوكمة",
      avatar: "👨‍🏫",
      experience: "14 سنة خبرة",
      rating: "4.9 ★",
      hours: 48,
      slots: ["الأحد: 05:00 م - 07:00 م (حضوري)", "الثلاثاء: 06:00 م - 08:00 م (افتراضي)"]
    },
    {
      id: "CONS-02",
      name: "أ. فهد الجهني",
      specialty: "التخطيط الاستراتيجي وإدارة المشاريع",
      title: "مستشار استراتيجي معتمد",
      avatar: "👨‍💼",
      experience: "11 سنة خبرة",
      rating: "4.8 ★",
      hours: 36,
      slots: ["الإثنين: 04:00 م - 06:00 م (حضوري)", "الأربعاء: 07:00 م - 09:00 م (افتراضي)"]
    },
    {
      id: "CONS-03",
      name: "أ. ماجد العوفي",
      specialty: "الاستدامة المالية وتنمية الموارد والمنح",
      title: "مستشار الاستثمار الاجتماعي والأوقاف",
      avatar: "💼",
      experience: "12 سنة خبرة",
      rating: "4.9 ★",
      hours: 42,
      slots: ["الأحد: 09:00 ص - 11:00 ص (حضوري)", "الخميس: 05:00 م - 07:00 م (حضوري)"]
    },
    {
      id: "CONS-04",
      name: "د. نورة البلوي",
      specialty: "قياس الأثر المجتمعي والتحول المؤسسي",
      title: "خبيرة تقييم الأثر وهندسة المبادرات",
      avatar: "👩‍💼",
      experience: "9 سنوات خبرة",
      rating: "5.0 ★",
      hours: 30,
      slots: ["الإثنين: 06:00 م - 08:00 م (افتراضي)", "الأربعاء: 05:00 م - 07:00 م (حضوري)"]
    }
  ]
};

// Load or Initialize State
function loadPlatformState() {
  try {
    const raw = localStorage.getItem(ATHQ_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.applications && parsed.applications.length > 0) {
        if (!parsed.notifications || parsed.notifications.length === 0) {
          parsed.notifications = DEFAULT_SEED_DATA.notifications;
        }
        if (!parsed.directoryOrgs || parsed.directoryOrgs.length === 0) {
          parsed.directoryOrgs = DEFAULT_SEED_DATA.directoryOrgs;
        }
        return parsed;
      }
    }
  } catch (e) {
    console.warn("Could not read from localStorage", e);
  }
  return JSON.parse(JSON.stringify(DEFAULT_SEED_DATA));
}

let APP_STATE = loadPlatformState();
let currentActiveRole = 'visitor';
let wizardCurrentStep = 1;

function savePlatformState() {
  try {
    localStorage.setItem(ATHQ_STORAGE_KEY, JSON.stringify(APP_STATE));
  } catch (e) {
    console.warn("Could not save to localStorage", e);
  }
}

// Toast Notifications Helper
function showToast(message, type = 'success') {
  const existing = document.getElementById('athq-toast-box');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'athq-toast-box';
  const bgColor = type === 'success' ? '#0d9488' : (type === 'error' ? '#ef4444' : '#1e293b');
  toast.style.cssText = `
    position: fixed;
    bottom: 24px;
    left: 24px;
    background: ${bgColor};
    color: #ffffff;
    padding: 12px 20px;
    border-radius: 10px;
    font-family: inherit;
    font-size: 0.9rem;
    font-weight: 700;
    z-index: 9999;
    box-shadow: 0 8px 24px rgba(0,0,0,0.25);
    display: flex;
    align-items: center;
    gap: 10px;
    animation: toastSlideUp 0.3s ease;
  `;
  toast.innerHTML = `<span>✓</span><span>${message}</span>`;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.4s ease';
    setTimeout(() => toast.remove(), 400);
  }, 3200);
}

// ========================== DOM Ready Initialization ==========================
document.addEventListener('DOMContentLoaded', () => {
  initThemeEngine();
  initHeaderScroll();
  initRoleSimulator();
  initAnimatedCounters();
  initServicesTabs();
  initFaqAccordion();
  initDropdownMenus();
  initMobileDrawer();
  initKeyboardShortcuts();

  // Render initial dashboards and features
  renderAssociationDashboard();
  renderConsultantDashboard();
  renderAdminDashboard();
  renderNotifications();
  renderDirectoryOrgs();
  recalcGovernanceRadar();

  // Prompt 6 initializers
  if (typeof initFoundationalRadialProgress === 'function') initFoundationalRadialProgress();
  if (typeof initVisualFacilitiesBooking === 'function') initVisualFacilitiesBooking();
  if (typeof renderHqChecklist === 'function') renderHqChecklist();
});

// 1. Theme Engine
function initThemeEngine() {
  const themeToggle = document.getElementById('themeToggle');
  const saved = localStorage.getItem('athq_theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);

  const updateToggleIcon = (theme) => {
    if (!themeToggle) return;
    if (theme === 'dark') {
      themeToggle.innerHTML = '<i class="fa-solid fa-sun" style="color: #FCD34D;"></i>';
      themeToggle.title = 'التبديل إلى الوضع النهاري';
    } else {
      themeToggle.innerHTML = '<i class="fa-regular fa-moon"></i>';
      themeToggle.title = 'التبديل إلى الوضع الليلي';
    }
  };

  updateToggleIcon(saved);

  themeToggle?.addEventListener('click', () => {
    const cur = document.documentElement.getAttribute('data-theme') || 'light';
    const next = cur === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('athq_theme', next);
    updateToggleIcon(next);
    if (typeof showToast === 'function') {
      showToast(next === 'dark' ? 'تم تفعيل الوضع الليلي الفاخر 🌙' : 'تم تفعيل الوضع النهاري المشرق ☀️');
    }
  });
}

// 2. Header Scroll Effect
function initHeaderScroll() {
  const header = document.querySelector('.main-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  });
}

// 3. Official Portals Controller
function initRoleSimulator() {
  const roleButtons = document.querySelectorAll('.role-btn');
  roleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.getAttribute('data-restricted') === 'true') {
        const curUser = typeof AthqAuth !== 'undefined' ? AthqAuth.getCurrentUser() : null;
        const msg = curUser ? `⛔ صلاحية مقيدة: حسابك الحالي (${curUser.title}) غير مصرح له بالدخول لهذه البوابة.` : 'يرجى تسجيل الدخول بحساب مصرح أولاً.';
        if (typeof showToast === 'function') showToast(msg, 'error');
        return;
      }
      const role = btn.getAttribute('data-role');
      if (role) switchRole(role);
    });
  });
}

window.switchRole = function(role) {
  // RBAC & Official Authentication Guard
  if (role !== 'visitor' && typeof AthqAuth !== 'undefined') {
    if (!AthqAuth.isLoggedIn()) {
      AthqAuth.openLoginModal(role);
      return;
    }
    if (!AthqAuth.hasRole(role)) {
      const curUser = AthqAuth.getCurrentUser();
      const roleNames = {
        visitor: 'الواجهة العامة',
        association: 'بوابة الجمعيات الأهلية',
        consultant: 'بوابة المستشارين',
        admin: 'لوحة القيادة والرقابة'
      };
      if (typeof showToast === 'function') {
        showToast(`حسابك الحالي مخصص لبوابة ${roleNames[curUser.role] || curUser.role}. جاري فتح نافذة الدخول لاختيار دور ${roleNames[role]}...`, 'info');
      }
      setTimeout(() => {
        AthqAuth.openLoginModal(role);
      }, 500);
      return;
    }
  }

  currentActiveRole = role;

  // Update simulator buttons active state
  document.querySelectorAll('.role-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-role') === role);
  });

  // Toggle views
  const visitorView = document.getElementById('view-visitor');
  const assocView = document.getElementById('view-association');
  const consView = document.getElementById('view-consultant');
  const adminView = document.getElementById('view-admin');

  if (visitorView) visitorView.style.display = role === 'visitor' ? 'block' : 'none';
  if (assocView) assocView.classList.toggle('active', role === 'association');
  if (consView) consView.classList.toggle('active', role === 'consultant');
  if (adminView) adminView.classList.toggle('active', role === 'admin');

  // Trigger relevant renders
  if (role === 'association') renderAssociationDashboard();
  if (role === 'consultant') renderConsultantDashboard();
  if (role === 'admin') renderAdminDashboard();

  window.scrollTo({ top: 0, behavior: 'smooth' });

  const roleNames = {
    visitor: 'الزائر العام (المرحلة 1)',
    association: 'بوابة الجمعيات المحتضنة (المرحلة 2)',
    consultant: 'بوابة الخبراء والمستشارين (المرحلة 3)',
    admin: 'لوحة القيادة والإدارة (المرحلة 4)'
  };
  showToast(`تم التبديل بنجاح إلى: ${roleNames[role] || role}`);
};

// 4. Animated Metric Counters
function initAnimatedCounters() {
  const counterElements = document.querySelectorAll('.metric-number[data-target]');
  let counted = false;

  const countUp = (el) => {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const prefix = el.getAttribute('data-prefix') || '+';
    let current = 0;
    const duration = 1600;
    const stepTime = 25;
    const increment = Math.ceil(target / (duration / stepTime));

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = `${prefix}${current.toLocaleString('en-US')}`;
    }, stepTime);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !counted) {
        counted = true;
        counterElements.forEach(el => countUp(el));
      }
    });
  }, { threshold: 0.3 });

  const metricsSection = document.getElementById('metrics');
  if (metricsSection) observer.observe(metricsSection);
}

// 5. Services Tabs Switcher
function initServicesTabs() {
  const tabBtns = document.querySelectorAll('.service-tab-btn');
  const tabPanes = document.querySelectorAll('.service-tab-pane');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-tab');
      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(target)?.classList.add('active');
    });
  });
}

// 6. FAQ Accordion
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    questionBtn?.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      faqItems.forEach(i => i.classList.remove('active'));
      if (!isActive) item.classList.add('active');
    });
  });
}

// Safe Action Modal Dispatcher
window.openActionModal = function(type) {
  if (type === 'association') {
    openApplicationWizard();
  } else if (type === 'consultant') {
    openConsultantWizard();
  } else if (type === 'admin') {
    switchRole('admin');
  }
};

// 7.1 Direct Contact Form Handler (نموذج التواصل المباشر)
function handleDirectContactSubmit(e) {
  if (e && e.preventDefault) e.preventDefault();

  const nameInput = document.getElementById('contact-name');
  const orgInput = document.getElementById('contact-org');
  const phoneInput = document.getElementById('contact-phone');
  const emailInput = document.getElementById('contact-email');
  const subjectInput = document.getElementById('contact-subject');
  const messageInput = document.getElementById('contact-message');
  const alertBox = document.getElementById('contactFormAlert');
  const submitBtn = document.getElementById('contactSubmitBtn');

  const name = nameInput ? nameInput.value.trim() : '';
  const org = orgInput ? orgInput.value.trim() : 'جهة غير محددة';
  const phone = phoneInput ? phoneInput.value.trim() : '';
  const email = emailInput ? emailInput.value.trim() : '';
  const subject = subjectInput ? subjectInput.value.trim() : '';
  const message = messageInput ? messageInput.value.trim() : '';

  if (!name || !phone || !email || !subject || !message) {
    if (alertBox) {
      alertBox.className = 'contact-alert-box error';
      alertBox.style.display = 'flex';
      alertBox.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i><span>يرجى تعبئة كافة الحقول الإلزامية المطلوبة (الاسم، الجوال، البريد، مجال الاستفسار، والرسالة).</span>';
    }
    showToast('يرجى تعبئة كافة الحقول الإلزامية قبل الإرسال', 'error');
    return false;
  }

  // Validate phone format (05XXXXXXXX)
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
  if (!/^05\d{8}$/.test(cleanPhone)) {
    if (alertBox) {
      alertBox.className = 'contact-alert-box error';
      alertBox.style.display = 'flex';
      alertBox.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i><span>يرجى إدخال رقم جوال سعودي صحيح يبدأ بـ 05 ويتكون من 10 أرقام (مثال: 0501234567).</span>';
    }
    showToast('يرجى التحقق من صحة رقم الجوال (05XXXXXXXX)', 'error');
    return false;
  }

  // Validate email format
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    if (alertBox) {
      alertBox.className = 'contact-alert-box error';
      alertBox.style.display = 'flex';
      alertBox.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i><span>يرجى إدخال عنوان بريد إلكتروني صحيح.</span>';
    }
    showToast('يرجى التحقق من صحة البريد الإلكتروني', 'error');
    return false;
  }

  // Disable button with spinning icon during submission
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i><span>جاري إرسال الرسالة...</span>';
  }

  setTimeout(() => {
    // Record into state
    if (!APP_STATE.contactMessages) APP_STATE.contactMessages = [];
    const newMsg = {
      id: 'MSG-' + Math.floor(1000 + Math.random() * 9000),
      name,
      org: org || 'جهة غير محددة',
      phone: cleanPhone,
      email,
      subject,
      message,
      date: new Date().toLocaleDateString('ar-SA'),
      timestamp: new Date().toISOString(),
      status: 'جديد'
    };
    APP_STATE.contactMessages.unshift(newMsg);

    // Also push a live notification to admin
    if (!APP_STATE.notifications) APP_STATE.notifications = [];
    APP_STATE.notifications.unshift({
      id: 'NTF-' + Math.floor(100 + Math.random() * 900),
      title: 'رسالة تواصل مباشر جديدة',
      text: `تم استلام رسالة من: ${name} بخصوص: ${subject}`,
      time: 'الآن',
      unread: true,
      icon: 'fa-envelope-open-text'
    });

    savePlatformState();

    if (alertBox) {
      alertBox.className = 'contact-alert-box success';
      alertBox.style.display = 'flex';
      alertBox.innerHTML = '<i class="fa-solid fa-circle-check"></i><span>تم استلام رسالتكم بنجاح! رقم المرجع: <strong>' + newMsg.id + '</strong>. سيتواصل معكم فريق حاضنة ومسرعة عذق خلال 24 ساعة عمل.</span>';
    }

    showToast('تم إرسال رسالتكم بنجاح وسيتواصل معكم فريق الحاضنة قريباً', 'success');

    // Reset inputs
    if (nameInput) nameInput.value = '';
    if (orgInput) orgInput.value = '';
    if (phoneInput) phoneInput.value = '';
    if (emailInput) emailInput.value = '';
    if (subjectInput) subjectInput.value = '';
    if (messageInput) messageInput.value = '';

    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i><span>إرسال الرسالة المباشرة</span>';
    }
  }, 500);

  return false;
}
window.handleDirectContactSubmit = handleDirectContactSubmit;

// 8. Desktop Dropdown Menus
function initDropdownMenus() {
  const dropdownItems = document.querySelectorAll('.nav-item-dropdown');
  dropdownItems.forEach(dropdown => {
    const toggle = dropdown.querySelector('.dropdown-toggle');
    toggle?.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = dropdown.classList.contains('open');
      dropdownItems.forEach(d => {
        d.classList.remove('open');
        d.querySelector('.dropdown-toggle')?.setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        dropdown.classList.add('open');
        toggle.setAttribute('aria-expanded', 'true');
      }
    });
  });

  document.addEventListener('click', () => {
    dropdownItems.forEach(d => {
      d.classList.remove('open');
      d.querySelector('.dropdown-toggle')?.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      dropdownItems.forEach(d => {
        d.classList.remove('open');
        d.querySelector('.dropdown-toggle')?.setAttribute('aria-expanded', 'false');
      });
      closeMobileDrawer();
      closeCommandPalette();
    }
  });
}

// 9. Mobile Navigation Drawer
function initMobileDrawer() {
  const mobileNavToggle = document.getElementById('mobileNavToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileDrawerOverlay = document.getElementById('mobileDrawerOverlay');
  const mobileDrawerClose = document.getElementById('mobileDrawerClose');

  function openDrawer() {
    mobileDrawer?.classList.add('active');
    mobileDrawerOverlay?.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    mobileDrawer?.classList.remove('active');
    mobileDrawerOverlay?.classList.remove('active');
    document.body.style.overflow = '';
  }

  window.closeMobileDrawer = closeDrawer;

  mobileNavToggle?.addEventListener('click', openDrawer);
  mobileDrawerClose?.addEventListener('click', closeDrawer);
  mobileDrawerOverlay?.addEventListener('click', closeDrawer);

  document.querySelectorAll('.mobile-accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      const acc = header.closest('.mobile-accordion');
      const isOpen = acc.classList.contains('open');
      document.querySelectorAll('.mobile-accordion').forEach(a => a.classList.remove('open'));
      if (!isOpen) acc.classList.add('open');
    });
  });

  document.querySelectorAll('.mobile-drawer a').forEach(a => {
    a.addEventListener('click', closeDrawer);
  });
}

// 10. Keyboard Shortcuts (Ctrl+K Command Palette)
function initKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      openCommandPalette();
    }
  });

  const paletteInput = document.getElementById('paletteInput');
  paletteInput?.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase().trim();
    const items = document.querySelectorAll('#paletteList .palette-item');
    items.forEach(item => {
      const text = item.textContent.toLowerCase();
      item.style.display = text.includes(q) ? 'flex' : 'none';
    });
  });
}

// ========================== Supercharged Application Wizard ==========================
let currentSelectedAppSector = 'رعاية وتنمية مجتمعية';

window.openApplicationWizard = function() {
  wizardCurrentStep = 1;
  updateWizardStepView();
  updateLiveAppSummary();
  document.getElementById('modalApplicationWizard')?.classList.add('active');
};

window.closeApplicationWizard = function() {
  document.getElementById('modalApplicationWizard')?.classList.remove('active');
};

window.selectAppModeCard = function(mode) {
  document.querySelectorAll('#app-mode-grid .incubation-mode-card').forEach(c => c.classList.remove('selected'));
  const card = document.getElementById(`mode-card-${mode}`);
  if (card) card.classList.add('selected');

  const modeInput = document.getElementById('app-incubation-mode');
  if (modeInput) modeInput.value = mode;

  const ideaBanner = document.getElementById('idea-mode-banner');
  const accelBanner = document.getElementById('accelerator-mode-banner');
  const ideaBox = document.getElementById('app-idea-details-box');
  const licLabel = document.getElementById('app-label-assoc-lic');
  const licInput = document.getElementById('app-assoc-lic');
  const nameLabel = document.getElementById('app-label-assoc-name');

  if (ideaBanner) ideaBanner.style.display = mode === 'idea' ? 'block' : 'none';
  if (accelBanner) accelBanner.style.display = mode === 'accelerator' ? 'block' : 'none';
  if (ideaBox) ideaBox.style.display = mode === 'idea' ? 'block' : 'none';

  if (mode === 'idea') {
    if (nameLabel) nameLabel.textContent = 'اسم المبادرة أو الجمعية الناشئة *';
    if (licLabel) licLabel.textContent = 'رقم طلب التأسيس أو اكتب: قيد التأسيس *';
    if (licInput) {
      licInput.placeholder = 'مثال: طلب تأسيس 4120 أو: قيد التأسيس';
      if (!licInput.value.trim() || licInput.value === '2410') licInput.value = 'قيد التأسيس';
    }
  } else if (mode === 'accelerator') {
    if (nameLabel) nameLabel.textContent = 'اسم الجمعية الأهلية القائمة *';
    if (licLabel) licLabel.textContent = 'رقم ترخيص المركز الوطني NCNP *';
    if (licInput) {
      licInput.placeholder = 'مثال: 1842';
      if (licInput.value === 'قيد التأسيس') licInput.value = '2410';
    }
  } else {
    if (nameLabel) nameLabel.textContent = 'اسم الجمعية أو المنظمة الأهلية *';
    if (licLabel) licLabel.textContent = 'رقم الترخيص بالمركز الوطني (NCNP) *';
    if (licInput) {
      licInput.placeholder = 'مثال: 2410';
      if (licInput.value === 'قيد التأسيس') licInput.value = '2410';
    }
  }

  updateLiveAppSummary();
};

window.selectAppSector = function(chip, sector) {
  document.querySelectorAll('#app-sector-chips .chip-item').forEach(c => c.classList.remove('active'));
  chip.classList.add('active');
  currentSelectedAppSector = sector;
  updateLiveAppSummary();
};

window.selectAppTrackCard = function(card, trackName) {
  document.querySelectorAll('#app-track-grid .track-select-card').forEach(c => c.classList.remove('selected'));
  card.classList.add('selected');
  const input = document.getElementById('app-track-select');
  if (input) input.value = trackName;
  updateLiveAppSummary();
};

window.selectAppTypeCard = function(card, typeName) {
  document.querySelectorAll('#app-type-grid .incubation-type-card').forEach(c => c.classList.remove('selected'));
  card.classList.add('selected');
  const input = document.getElementById('app-type-select');
  if (input) input.value = typeName;
  updateLiveAppSummary();
};

window.handleFileDropzone = function(input) {
  const dropzone = document.getElementById('app-dropzone');
  const text = document.getElementById('dropzone-text');
  if (input.files && input.files[0]) {
    if (text) text.innerHTML = `<strong>تم اختيار:</strong> ${input.files[0].name}`;
    if (dropzone) dropzone.style.borderColor = 'var(--c-primary)';
  }
};

// ========================== Mandatory Attachments & Application Wizard ==========================
window.uploadedMandatoryDocs = {
  doc1: null, // جواب الالتحاق
  doc2: null, // الترخيص
  doc3: null  // نموذج طلب الانضمام
};

window.handleMandatoryDocUpload = function(input, statusId, cardId, docTitle) {
  if (input.files && input.files[0]) {
    const file = input.files[0];
    const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
    const key = statusId.includes('1') ? 'doc1' : (statusId.includes('2') ? 'doc2' : 'doc3');
    window.uploadedMandatoryDocs[key] = {
      name: file.name,
      size: `${sizeMb} MB`,
      title: docTitle,
      date: new Date().toLocaleDateString('ar-SA')
    };

    const statusEl = document.getElementById(statusId);
    const cardEl = document.getElementById(cardId);
    if (statusEl) {
      statusEl.className = 'doc-badge-status uploaded';
      statusEl.innerHTML = `<i class="fa-solid fa-circle-check"></i> تم الرفع: ${file.name.substring(0, 18)}... (${sizeMb}MB) ✓`;
    }
    if (cardEl) cardEl.classList.add('uploaded');

    updateMandatoryDocsSummaryBadge();
    showToast(`تم رفع ${docTitle} بنجاح ✓`, 'success');
  }
};

window.autoFillMandatoryDocs = function() {
  window.uploadedMandatoryDocs.doc1 = { name: 'جواب_الالتحاق_المعتمد.pdf', size: '1.4 MB', title: 'جواب الالتحاق بالحاضنة', date: '1446/08/14' };
  window.uploadedMandatoryDocs.doc2 = { name: 'شهادة_ترخيص_NCNP_رقم_2410.pdf', size: '2.1 MB', title: 'شهادة الترخيص الرسمية', date: '1446/08/14' };
  window.uploadedMandatoryDocs.doc3 = { name: 'نموذج_طلب_الانضمام_موقع.pdf', size: '1.8 MB', title: 'نموذج طلب الانضمام', date: '1446/08/14' };

  for (let i = 1; i <= 3; i++) {
    const statusEl = document.getElementById(`status-doc-${i}`);
    const cardEl = document.getElementById(`card-doc-${i}`);
    const doc = window.uploadedMandatoryDocs[`doc${i}`];
    if (statusEl && doc) {
      statusEl.className = 'doc-badge-status uploaded';
      statusEl.innerHTML = `<i class="fa-solid fa-circle-check"></i> تم الرفع: ${doc.name} (${doc.size}) ✓`;
    }
    if (cardEl) cardEl.classList.add('uploaded');
  }

  updateMandatoryDocsSummaryBadge();
  showToast('تم إرفاق المستندات الرسمية الثلاثة بنجاح للتجربة السريعة ✓', 'success');
};

function updateMandatoryDocsSummaryBadge() {
  const sumDocs = document.getElementById('summary-assoc-docs');
  let count = 0;
  if (window.uploadedMandatoryDocs.doc1) count++;
  if (window.uploadedMandatoryDocs.doc2) count++;
  if (window.uploadedMandatoryDocs.doc3) count++;

  if (sumDocs) {
    if (count === 3) {
      sumDocs.style.color = '#047857';
      sumDocs.innerHTML = `<i class="fa-solid fa-circle-check"></i> مكتملة وجاهزة للفرز (3 من 3) ✓`;
    } else {
      sumDocs.style.color = '#B45309';
      sumDocs.innerHTML = `<i class="fa-solid fa-clock"></i> متبقي ${3 - count} مرفقات (${count} من 3)`;
    }
  }
}

window.updateLiveAppSummary = function() {
  const mode = document.getElementById('app-incubation-mode')?.value || 'spatial';
  const name = document.getElementById('app-assoc-name')?.value.trim() || 'لم يُحدد بعد';
  const lic = document.getElementById('app-assoc-lic')?.value.trim() || 'لم يُحدد بعد';
  const city = document.getElementById('app-assoc-city')?.value || 'المدينة المنورة';
  const track = document.getElementById('app-track-select')?.value || 'دعم تأسيسي وتشغيلي شامل';
  const rep = document.getElementById('app-rep-name')?.value.trim() || 'لم يُحدد بعد';

  const sumMode = document.getElementById('summary-assoc-mode');
  const sumName = document.getElementById('summary-assoc-name');
  const sumCity = document.getElementById('summary-assoc-city');
  const sumTrack = document.getElementById('summary-assoc-track');
  const sumRep = document.getElementById('summary-assoc-rep');

  if (sumMode) {
    if (mode === 'idea') {
      sumMode.innerHTML = `<span style="color: #B45309; font-weight: 800;"><i class="fa-solid fa-lightbulb"></i> 💡 احتضان فكرة ومبادرة جديدة</span>`;
    } else if (mode === 'accelerator') {
      sumMode.innerHTML = `<span style="color: #4F46E5; font-weight: 800;"><i class="fa-solid fa-rocket"></i> 🚀 مسرعة أعمال وتوسّع الأثر</span>`;
    } else {
      sumMode.innerHTML = `<span style="color: var(--c-primary); font-weight: 800;"><i class="fa-solid fa-building"></i> 🏢 احتضان مكاني وتشغيلي</span>`;
    }
  }

  if (sumName) sumName.textContent = name;
  if (sumCity) sumCity.textContent = city;
  if (sumTrack) sumTrack.textContent = track;
  if (sumRep) sumRep.textContent = rep;

  updateMandatoryDocsSummaryBadge();
};

window.navigateWizard = function(dir) {
  if (dir === 1) {
    // Validate Step 1
    if (wizardCurrentStep === 1) {
      const mode = document.getElementById('app-incubation-mode')?.value || 'spatial';
      const name = document.getElementById('app-assoc-name')?.value.trim();
      let lic = document.getElementById('app-assoc-lic')?.value.trim();
      const rep = document.getElementById('app-rep-name')?.value.trim();
      const phone = document.getElementById('app-rep-phone')?.value.trim();

      if (mode === 'idea' && !lic) {
        lic = 'قيد التأسيس';
        const licInput = document.getElementById('app-assoc-lic');
        if (licInput) licInput.value = lic;
      }

      if (!name || !lic || !rep || !phone) {
        showToast('يرجى تعبئة كافة الحقول الإلزامية: (اسم الجهة، الترخيص أو حالة التأسيس، اسم الممثل، ورقم الجوال).', 'error');
        return;
      }
    }
    // Final Submit Step (Step 3)
    if (wizardCurrentStep === 3) {
      // Validate all 3 mandatory attachments
      if (!window.uploadedMandatoryDocs.doc1 || !window.uploadedMandatoryDocs.doc2 || !window.uploadedMandatoryDocs.doc3) {
        showToast('إجراء إجباري: يجب رفع المرفقات الثلاثة كاملة (1. جواب الالتحاق، 2. الترخيص أو الفكرة، 3. نموذج الانضمام).', 'error');
        return;
      }
      submitApplicationForm();
      return;
    }
  }

  wizardCurrentStep += dir;
  if (wizardCurrentStep < 1) wizardCurrentStep = 1;
  if (wizardCurrentStep > 3) wizardCurrentStep = 3;
  updateWizardStepView();
  updateLiveAppSummary();
};

function updateWizardStepView() {
  document.querySelectorAll('.wizard-step-content').forEach(p => p.classList.remove('active'));
  document.getElementById(`wizard-step-${wizardCurrentStep}`)?.classList.add('active');

  // Update step nodes
  for (let i = 1; i <= 3; i++) {
    const node = document.getElementById(`step-node-${i}`);
    if (node) {
      node.classList.toggle('active', i === wizardCurrentStep || i < wizardCurrentStep);
    }
  }

  const prevBtn = document.getElementById('btnWizardPrev');
  const nextBtn = document.getElementById('btnWizardNext');
  const footer = document.getElementById('wizard-footer-buttons');

  if (footer) footer.style.display = 'flex';
  if (prevBtn) prevBtn.style.display = wizardCurrentStep > 1 ? 'block' : 'none';
  if (nextBtn) nextBtn.innerHTML = wizardCurrentStep === 3 ? '<i class="fa-solid fa-paper-plane"></i> إرسال طلب الانضمام والمرفقات ✓' : 'التالي <i class="fa-solid fa-arrow-left"></i>';
}

function submitApplicationForm() {
  const mode = document.getElementById('app-incubation-mode')?.value || 'spatial';
  const name = document.getElementById('app-assoc-name')?.value.trim() || 'جمعية روافد التنموية';
  const lic = document.getElementById('app-assoc-lic')?.value.trim() || (mode === 'idea' ? 'قيد التأسيس' : '2450');
  const city = document.getElementById('app-assoc-city')?.value || 'المدينة المنورة';
  const repName = document.getElementById('app-rep-name')?.value.trim() || 'ممثل الجمعية';
  const repPhone = document.getElementById('app-rep-phone')?.value.trim() || '0550000000';
  const track = document.getElementById('app-track-select')?.value || 'دعم تأسيسي وتشغيلي شامل';
  const incubationType = document.getElementById('app-type-select')?.value || 'احتضان مكاني ومقر مستقل';
  const ideaSummary = document.getElementById('app-assoc-idea-summary')?.value.trim() || '';
  const newId = `ATHQ-2025-0${Math.floor(Math.random() * 80) + 20}`;

  const modeTitles = {
    idea: 'احتضان فكرة ومبادرة جديدة',
    spatial: 'احتضان مكاني وتشغيلي',
    accelerator: 'مسرعة أعمال ونمو الأثر'
  };

  const modeStageTitles = {
    idea: 'المرحلة الأولى: احتضان الفكرة والتأسيس',
    spatial: 'المرحلة الثالثة: الاحتضان المكاني والتشغيلي',
    accelerator: 'المرحلة الرابعة: مسرعة عذق وتسريع النمو'
  };

  const newApp = {
    id: newId,
    associationName: name,
    licenseNumber: lic,
    nationalNumber700: document.getElementById('app-assoc-700')?.value || '7009841235',
    city: city,
    sector: currentSelectedAppSector || 'رعاية وتنمية مجتمعية',
    repName: repName,
    repPhone: repPhone,
    track: track,
    incubationType: incubationType,
    incubationMode: mode,
    incubationModeTitle: modeTitles[mode] || 'احتضان مكاني وتشغيلي',
    ideaSummary: ideaSummary,
    stage: modeStageTitles[mode] || 'المرحلة الأولى: احتضان الفكرة',
    stageProgress: mode === 'idea' ? 20 : (mode === 'spatial' ? 40 : 60),
    status: 'تحت المراجعة',
    stateMachineState: 'state1_review',
    notes: mode === 'idea' 
      ? `طلب احتضان فكرة جديدة: "${ideaSummary || name}". بانتظار الفرز ودراسة الاحتياج المجتمعي.`
      : (mode === 'accelerator' 
        ? 'طلب انضمام إلى مسرعة عذق لتسريع نمو الأثر والاستدامة المالية.' 
        : 'طلب احتضان مكاني ومقر مؤثث وتشغيل إداري ومحاسبي كامل.'),
    orientationMeetingDate: '',
    rejectionReason: '',
    officeWanted: mode === 'spatial' ? 'مكتب مستقل مجهز' : (mode === 'idea' ? 'مساحة ابتكار مشتركة' : null),
    fullTimeEmployee: mode === 'idea' ? 'قيد التأسيس' : 'قيد التحقق',
    examScore: 0,
    workHours: 0,
    volunteerHours: 0,
    volunteersCount: 0,
    mandatoryAttachments: {
      doc1: window.uploadedMandatoryDocs.doc1 || { name: 'جواب_الالتحاق.pdf', size: '1.2 MB' },
      doc2: window.uploadedMandatoryDocs.doc2 || { name: mode === 'idea' ? 'مسودة_الفكرة_أو_طلب_التأسيس.pdf' : 'شهادة_الترخيص.pdf', size: '1.9 MB' },
      doc3: window.uploadedMandatoryDocs.doc3 || { name: 'نموذج_طلب_الانضمام.pdf', size: '1.5 MB' }
    },
    evidences: [
      { title: "1. جواب الالتحاق بالحاضنة معتمد", date: "اليوم", status: "مستلم وبانتظار الفرز ✓" },
      { title: mode === 'idea' ? "2. مسودة الفكرة التنموية / طلب التأسيس NCNP" : "2. شهادة ترخيص المركز الوطني NCNP", date: "اليوم", status: "مستلمة ✓" },
      { title: "3. نموذج طلب الانضمام موقع ومختوم", date: "اليوم", status: "مستلم ✓" }
    ]
  };

  APP_STATE.applications.unshift(newApp);
  APP_STATE.stats.active_incubated += 1;

  // Add notification
  if (!APP_STATE.notifications) APP_STATE.notifications = [];
  APP_STATE.notifications.unshift({
    id: `NTF-${Date.now().toString().slice(-4)}`,
    title: `طلب احتضان جديد (${modeTitles[mode]})`,
    text: `تم استلام طلب جديد من: ${name} (النوع: ${modeTitles[mode]} • ترخيص: ${lic}).`,
    time: 'الآن',
    unread: true,
    icon: mode === 'idea' ? 'fa-lightbulb' : (mode === 'accelerator' ? 'fa-rocket' : 'fa-building-ngo')
  });

  savePlatformState();

  // Show Receipt Step
  document.querySelectorAll('.wizard-step-content').forEach(p => p.classList.remove('active'));
  document.getElementById('wizard-step-receipt')?.classList.add('active');

  const receiptId = document.getElementById('receipt-app-id');
  const receiptName = document.getElementById('receipt-assoc-name');
  const receiptTrack = document.getElementById('receipt-assoc-track');
  const receiptMode = document.getElementById('receipt-assoc-mode-badge');
  const footer = document.getElementById('wizard-footer-buttons');

  if (receiptId) receiptId.textContent = newId;
  if (receiptName) receiptName.textContent = name;
  if (receiptTrack) receiptTrack.textContent = track;
  if (receiptMode) {
    if (mode === 'idea') {
      receiptMode.style.background = 'rgba(245, 158, 11, 0.15)';
      receiptMode.style.color = '#B45309';
      receiptMode.innerHTML = '<i class="fa-solid fa-lightbulb"></i> 💡 احتضان فكرة ومبادرة جديدة';
    } else if (mode === 'accelerator') {
      receiptMode.style.background = 'rgba(99, 102, 241, 0.15)';
      receiptMode.style.color = '#4F46E5';
      receiptMode.innerHTML = '<i class="fa-solid fa-rocket"></i> 🚀 مسرعة أعمال ونمو الأثر';
    } else {
      receiptMode.style.background = 'rgba(13, 110, 70, 0.15)';
      receiptMode.style.color = 'var(--c-primary)';
      receiptMode.innerHTML = '<i class="fa-solid fa-building"></i> 🏢 احتضان مكاني وتشغيلي';
    }
  }
  if (footer) footer.style.display = 'none';

  // Set newly submitted app as active
  currentActiveAssocIndex = 0;

  showToast(`تم إرسال طلب "${name}" (${modeTitles[mode]}) بنجاح برقم: ${newId} ✓`, 'success');

  renderAdminDashboard();
  renderAssociationDashboard();
}

// ========================== Supercharged Consultant Joining Wizard ==========================
let selectedConsXpText = 'أكثر من 10 سنوات (خبير أول)';

window.openConsultantWizard = function() {
  const form = document.getElementById('cons-form-container');
  const welcome = document.getElementById('cons-welcome-card');
  const footer = document.getElementById('cons-footer');

  if (form) form.style.display = 'block';
  if (welcome) welcome.style.display = 'none';
  if (footer) footer.style.display = 'flex';

  document.getElementById('modalConsultantWizard')?.classList.add('active');
};

window.closeConsultantWizard = function() {
  document.getElementById('modalConsultantWizard')?.classList.remove('active');
};

window.toggleConsChip = function(chip) {
  chip.classList.toggle('active');
};

window.selectConsXp = function(btn, xpText) {
  document.querySelectorAll('#cons-xp-group .segmented-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  selectedConsXpText = xpText;
};

window.selectConsVolunteerType = function(btn, typeText) {
  document.querySelectorAll('#cons-volunteer-type-chips .chip-item').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
  const input = document.getElementById('cons-selected-volunteer-type');
  if (input) input.value = typeText;
};

window.autoFillConsultantCV = function() {
  const bio = document.getElementById('cons-bio');
  if (bio) {
    bio.value = 'مستشار حوكمة معتمد (CGO) وخبير امتثال معتمد من المركز الوطني لتنمية القطاع غير الربحي (NCNP). خبرة 12 سنة في تأسيس الجمعيات الأهلية، وإعداد مصفوفات الصلاحيات المالية والإدارية، وتطوير الخطط التشغيلية والموازنات التقديرية.';
  }
  const name = document.getElementById('cons-name');
  if (name && !name.value) name.value = 'د. عبدالمحسن الأحمدي';
  const title = document.getElementById('cons-title');
  if (title && !title.value) title.value = 'مستشار حوكمة وامتثال مؤسسي';
  const phone = document.getElementById('cons-phone');
  if (phone && !phone.value) phone.value = '0509876543';
  showToast('تم إدراج بيانات السيرة الذاتية والمؤهلات بنجاح للتجربة السريعة ✓', 'success');
};

window.submitConsultantWizard = function() {
  const name = document.getElementById('cons-name')?.value.trim();
  const title = document.getElementById('cons-title')?.value.trim();
  const phone = document.getElementById('cons-phone')?.value.trim();
  const hours = document.getElementById('cons-hours-select')?.value;
  const mode = document.getElementById('cons-mode-select')?.value;
  const volunteerType = document.getElementById('cons-selected-volunteer-type')?.value || 'تطوع استشاري تخصصي';
  const bio = document.getElementById('cons-bio')?.value.trim() || 'مستشار حوكمة وتطوير مؤسسي معتمد';

  if (!name || !title || !phone) {
    showToast('يرجى تعبئة الاسم الكامل والمسمى المهني ورقم الجوال.', 'error');
    return;
  }

  const activeChips = [];
  document.querySelectorAll('#cons-domains-chips .chip-item.active').forEach(c => activeChips.push(c.textContent.trim()));
  const specialty = activeChips.length > 0 ? activeChips.join(' • ') : 'استشارات عامة في الحوكمة والتطوير';

  const newConsId = `CONS-0${(APP_STATE.consultants || []).length + 1}`;
  const newCons = {
    id: newConsId,
    name,
    title,
    specialty,
    avatar: '👨‍💼',
    experience: selectedConsXpText,
    rating: '5.0 ★',
    hours: 0,
    volHours: 0,
    volunteerType: volunteerType,
    bio: bio,
    slots: [`متاح: ${hours} (${mode})`]
  };

  if (!APP_STATE.consultants) APP_STATE.consultants = [];
  APP_STATE.consultants.push(newCons);
  currentActiveConsultantId = newConsId;
  savePlatformState();

  // Show VIP Welcome Card
  const form = document.getElementById('cons-form-container');
  const welcome = document.getElementById('cons-welcome-card');
  const footer = document.getElementById('cons-footer');
  const regName = document.getElementById('cons-registered-name');

  if (form) form.style.display = 'none';
  if (welcome) welcome.style.display = 'block';
  if (footer) footer.style.display = 'none';
  if (regName) regName.textContent = `${name} (${title}) - ${volunteerType}`;

  showToast(`أهلاً بك ${name}! تم تسجيل واعتماد حساب المستشار بنجاح.`);
  renderConsultantDashboard();
};

// ========================== Dedicated Consultant Appointment Booking UI ==========================
let selectedBookingConsId = 'CONS-01';

window.openBookConsultantModal = function(preselectedConsId) {
  // STRICT CONSTRAINT: Consultant booking is exclusively available within the Association Portal
  if (currentActiveRole !== 'association') {
    switchRole('association');
    showToast('تم نقلك إلى بوابة الجمعية لحجز الاستشارة التخصصية.');
  }

  // Switch to consultations tab in association portal
  const consultTabBtn = document.querySelector('#view-association .portal-tab-btn[onclick*="assoc-tab-consultations"]');
  if (consultTabBtn) switchAssocTab(consultTabBtn, 'assoc-tab-consultations');

  const modal = document.getElementById('modalBookConsultant');
  if (!modal) return;

  // Auto populate association name if in association portal
  const currentAssoc = APP_STATE.applications[0];
  const assocInput = document.getElementById('booking-assoc-name');
  const phoneInput = document.getElementById('booking-phone');
  if (assocInput && currentAssoc) assocInput.value = currentAssoc.associationName;
  if (phoneInput && currentAssoc) phoneInput.value = currentAssoc.repPhone;

  // Render consultants selector cards
  renderBookingConsultantsList(preselectedConsId || selectedBookingConsId);

  // Reset ticket and form
  const formBox = document.getElementById('booking-form-content');
  const ticketBox = document.getElementById('booking-ticket-card');
  const footer = document.getElementById('booking-footer');

  if (formBox) formBox.style.display = 'block';
  if (ticketBox) ticketBox.style.display = 'none';
  if (footer) footer.style.display = 'flex';

  modal.classList.add('active');
};

window.closeBookConsultantModal = function() {
  document.getElementById('modalBookConsultant')?.classList.remove('active');
};

function renderBookingConsultantsList(activeId) {
  const container = document.getElementById('booking-consultants-grid');
  if (!container) return;

  const consultants = APP_STATE.consultants || [];
  container.innerHTML = consultants.map(cons => {
    const isSelected = cons.id === activeId || (consultants.indexOf(cons) === 0 && !activeId);
    if (isSelected) selectedBookingConsId = cons.id;

    return `
      <div class="consultant-select-card ${isSelected ? 'selected' : ''}" onclick="selectBookingConsultant(this, '${cons.id}')">
        <span class="card-check"><i class="fa-solid fa-check"></i></span>
        <div class="consultant-avatar-box">${cons.avatar || '👨‍💼'}</div>
        <div class="consultant-info-box">
          <h5>${cons.name}</h5>
          <div class="cons-spec">${cons.specialty || cons.title}</div>
          <div style="display: flex; gap: 6px; align-items: center;">
            <span class="cons-badge">${cons.experience || 'خبير معتمد'}</span>
            <span style="font-size: 0.72rem; color: var(--c-gold-dark); font-weight: 800;">${cons.rating || '4.9 ★'}</span>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

window.selectBookingConsultant = function(card, id) {
  selectedBookingConsId = id;
  document.querySelectorAll('#booking-consultants-grid .consultant-select-card').forEach(c => c.classList.remove('selected'));
  card.classList.add('selected');
};

window.selectBookingTopic = function(chip, topic) {
  document.querySelectorAll('#booking-topics-chips .chip-item').forEach(c => c.classList.remove('active'));
  chip.classList.add('active');
  const input = document.getElementById('booking-selected-topic');
  if (input) input.value = topic;
};

window.setBookingDeliveryMode = function(card, mode) {
  document.querySelectorAll('.delivery-mode-group .delivery-mode-card').forEach(c => c.classList.remove('active'));
  card.classList.add('active');
  const input = document.getElementById('booking-delivery-val');
  if (input) input.value = mode === 'حضوري' ? 'حضوري (عيادات الحاضنة - الأصيفرين)' : 'عن بُعد (اتصال مرئي مباشر)';
};

window.confirmConsultantBooking = function() {
  const assocName = document.getElementById('booking-assoc-name')?.value.trim();
  const phone = document.getElementById('booking-phone')?.value.trim();
  const date = document.getElementById('booking-date')?.value || '2025-10-22';
  const time = document.getElementById('booking-time-slot')?.value || '05:00 م - 06:30 م';
  const topic = document.getElementById('booking-selected-topic')?.value || 'حوكمة وأنظمة اللوائح';
  const mode = document.getElementById('booking-delivery-val')?.value || 'حضوري (عيادات الحاضنة - الأصيفرين)';

  if (!assocName || !phone) {
    showToast('يرجى إدخال اسم الجمعية ورقم الجوال لتأكيد الحجز.', 'error');
    return;
  }

  const consultant = APP_STATE.consultants.find(c => c.id === selectedBookingConsId) || APP_STATE.consultants[0];
  const newBookingCode = `CNS-2025-${Math.floor(Math.random() * 800) + 100}`;

  const newConsultation = {
    id: newBookingCode,
    assocName: assocName,
    consultant: consultant.name,
    field: topic,
    date: date,
    time: time,
    mode: mode,
    status: 'مؤكد ومجدول ✓'
  };

  APP_STATE.consultations.unshift(newConsultation);
  APP_STATE.stats.consultations += 1;
  savePlatformState();

  // Show Ticket Card
  const formBox = document.getElementById('booking-form-content');
  const ticketBox = document.getElementById('booking-ticket-card');
  const footer = document.getElementById('booking-footer');

  if (formBox) formBox.style.display = 'none';
  if (ticketBox) ticketBox.style.display = 'block';
  if (footer) footer.style.display = 'none';

  // Fill Ticket Details
  const codeEl = document.getElementById('ticket-booking-code');
  const consEl = document.getElementById('ticket-cons-name');
  const fieldEl = document.getElementById('ticket-cons-field');
  const dtEl = document.getElementById('ticket-booking-datetime');
  const modeEl = document.getElementById('ticket-booking-mode');
  const assocEl = document.getElementById('ticket-assoc-name');

  if (codeEl) codeEl.textContent = newBookingCode;
  if (consEl) consEl.textContent = consultant.name;
  if (fieldEl) fieldEl.textContent = topic;
  if (dtEl) dtEl.textContent = `${date} (${time})`;
  if (modeEl) modeEl.textContent = mode;
  if (assocEl) assocEl.textContent = assocName;

  showToast(`تم حجز الجلسة الاستشارية مع ${consultant.name} بنجاح!`, 'success');

  renderAssociationDashboard();
  renderConsultantDashboard();
};

// ========================== Dedicated Facility Booking Modal ==========================
window.openFacilityBookingModal = function() {
  const currentAssoc = APP_STATE.applications[0];
  const assocInput = document.getElementById('fac-assoc-name');
  if (assocInput && currentAssoc) assocInput.value = currentAssoc.associationName;
  if (typeof initVisualFacilitiesBooking === 'function') initVisualFacilitiesBooking();
  document.getElementById('modalFacilityBooking')?.classList.add('active');
};

window.closeFacilityBookingModal = function() {
  document.getElementById('modalFacilityBooking')?.classList.remove('active');
};

window.submitFacilityBooking = function() {
  const facility = document.getElementById('fac-booking-select')?.value || (typeof selectedVisualFacility !== 'undefined' ? selectedVisualFacility : 'قاعة الاجتماعات الكبرى الذكية');
  const assocName = document.getElementById('fac-assoc-name')?.value.trim();
  const date = document.getElementById('fac-date')?.value || '2025-10-25';
  const time = document.getElementById('fac-time-slot')?.value || '05:00 م - 08:00 م';

  if (!assocName) {
    showToast('يرجى إدخال اسم الجمعية لحجز المرفق.', 'error');
    return;
  }

  // Automatic Collision Prevention Check
  if (typeof checkBookingCollision === 'function' && checkBookingCollision()) {
    showToast(`🚫 تضارب في المواعيد: المرفق (${facility}) محجوز مسبقاً في هذا التاريخ والفترة المحددة! يرجى اختيار فترة زمنية أخرى أو مرفق بديل.`, 'error');
    return;
  }

  const newBookingId = `BKG-${Math.floor(Math.random() * 800) + 100}`;
  APP_STATE.bookings.unshift({
    id: newBookingId,
    assocName,
    facility,
    date,
    time,
    status: 'مؤكد ✓'
  });

  savePlatformState();
  closeFacilityBookingModal();
  showToast(`✓ تم حجز "${facility}" بنجاح وتفادي أي تضارب في المواعيد!`, 'success');

  renderAssociationDashboard();
  renderAdminDashboard();
};

// Redirect old helpers
window.openBookingModal = window.openFacilityBookingModal;
window.openConsultantRequestModal = window.openBookConsultantModal;



// ========================== Facility Details Modal ==========================
const FACILITIES_DATA = {
  offices: {
    title: "المقرات الاحتضانية المستقلة (13+ مقراً)",
    subtitle: "مكاتب مجهزة بالكامل للجمعيات الناشئة لضمان الخصوصية والعمل المؤسسي",
    content: `
      <div style="background: var(--c-primary-subtle); padding: 14px; border-radius: 10px; margin-bottom: 14px;">
        <strong>🏢 المواصفات والتجهيزات المتوفرة:</strong>
        <ul style="padding-right: 18px; margin-top: 6px; font-size: 0.85rem;">
          <li>أثاث مكتبي فاخر متكامل يتسع لـ 3-5 موظفين بدوام كامل.</li>
          <li>عنوان وطني معتمد رسمي لإصدار التراخيص والحسابات البنكية.</li>
          <li>شبكة إنترنت ألياف بصرية فائقة السرعة مع طابعات مركزية.</li>
          <li>خدمات أمن، صيانة، وضيافة على مدار الساعة.</li>
        </ul>
      </div>
    `
  },
  coworking: {
    title: "مساحات العمل المشتركة المرنة (18+ مساحة)",
    subtitle: "بيئة تعاونية مفتوحة تدعم تبادل الخبرات وبناء الشراكات",
    content: `
      <div style="background: var(--c-primary-subtle); padding: 14px; border-radius: 10px; margin-bottom: 14px;">
        <strong>🤝 المواصفات والتجهيزات المتوفرة:</strong>
        <ul style="padding-right: 18px; margin-top: 6px; font-size: 0.85rem;">
          <li>محطات عمل مرنة ومريحة مخصصة للفرق التطوعية والباحثين.</li>
          <li>منافذ طاقة وشحن ذكية ومناطق عصف ذهني مجهزة بسبورات تفاعلية.</li>
          <li>إمكانية الحجز بالساعة أو اليوم لفرق العمل.</li>
        </ul>
      </div>
    `
  },
  meeting: {
    title: "قاعة الاجتماعات الكبرى الذكية",
    subtitle: "قاعة اجتماعات متطورة تتسع لـ 30 شخصاً لاجتماعات مجالس الإدارة واللجان",
    content: `
      <div style="background: var(--c-primary-subtle); padding: 14px; border-radius: 10px; margin-bottom: 14px;">
        <strong>🖥️ المواصفات والتجهيزات المتوفرة:</strong>
        <ul style="padding-right: 18px; margin-top: 6px; font-size: 0.85rem;">
          <li>شاشات تفاعلية ذكية 4K تدعم الاجتماعات المرئية (Zoom / Teams).</li>
          <li>نظام صوتي وعزل صوتي متطور لكتم الضوضاء.</li>
          <li>طاولة اجتماعات ملكية بيضاوية مجهزة بميكروفونات مدمجة.</li>
        </ul>
      </div>
    `
  },
  training: {
    title: "قاعة التدريب والتطوير",
    subtitle: "قاعة تدريب تفاعلية تتسع لـ 25 مقعداً لعقد ورش الحوكمة والتأهيل",
    content: `
      <div style="background: var(--c-primary-subtle); padding: 14px; border-radius: 10px; margin-bottom: 14px;">
        <strong>🎓 المواصفات والتجهيزات المتوفرة:</strong>
        <ul style="padding-right: 18px; margin-top: 6px; font-size: 0.85rem;">
          <li>شاشة عرض عمودية وأجهزة عرض ضوئي متطورة.</li>
          <li>مقاعد تدريب مرنة قابلة لإعادة التشكيل لورش العمل ومجموعات التركيز.</li>
          <li>ركن ضيافة مخصص لخدمة المتدربين.</li>
        </ul>
      </div>
    `
  }
};

window.openFacilityDetails = function(key) {
  const fac = FACILITIES_DATA[key] || FACILITIES_DATA.offices;
  const title = document.getElementById('facility-modal-title');
  const sub = document.getElementById('facility-modal-subtitle');
  const body = document.getElementById('facility-modal-content');

  if (title) title.textContent = fac.title;
  if (sub) sub.textContent = fac.subtitle;
  if (body) body.innerHTML = fac.content;

  document.getElementById('modalFacilityDetails')?.classList.add('active');
};

window.closeFacilityDetails = function() {
  document.getElementById('modalFacilityDetails')?.classList.remove('active');
};

// ========================== Command Palette ==========================
window.openCommandPalette = function() {
  const modal = document.getElementById('modalCommandPalette');
  modal?.classList.add('active');
  const input = document.getElementById('paletteInput');
  if (input) {
    input.value = '';
    input.focus();
    document.querySelectorAll('#paletteList .palette-item').forEach(i => i.style.display = 'flex');
  }
};

window.closeCommandPalette = function() {
  document.getElementById('modalCommandPalette')?.classList.remove('active');
};

window.handlePaletteOverlayClick = function(e) {
  if (e.target.id === 'modalCommandPalette') closeCommandPalette();
};

window.jumpToPaletteSection = function(sectionId) {
  closeCommandPalette();
  if (currentActiveRole !== 'visitor') switchRole('visitor');
  setTimeout(() => {
    const el = document.getElementById(sectionId);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }, 100);
};

// ========================== Association Dashboard Renderers (Revamped) ==========================
let currentActiveAssocIndex = 0;
let currentAssocEvidenceFilter = 'all';
let currentAssocEvidenceSearch = '';
let currentPreviewEvidenceObj = null;

function getActiveAssociation() {
  if (!APP_STATE.applications || APP_STATE.applications.length === 0) return null;
  return APP_STATE.applications[currentActiveAssocIndex] || APP_STATE.applications[0];
}

window.switchActiveAssociation = function(idx) {
  currentActiveAssocIndex = parseInt(idx, 10) || 0;
  const assoc = getActiveAssociation();
  if (!assoc) return;

  const selector = document.getElementById('assoc-switcher-select');
  if (selector) selector.value = currentActiveAssocIndex;

  renderAssociationDashboard();
  showToast(`تم التبديل إلى ملف: ${assoc.associationName} (${assoc.licenseNumber})`, 'info');
};

window.switchAssocTab = function(btn, paneId) {
  document.querySelectorAll('#view-association .portal-tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('#view-association .portal-tab-pane').forEach(p => p.classList.remove('active'));
  if (btn) btn.classList.add('active');
  const targetPane = document.getElementById(paneId);
  if (targetPane) targetPane.classList.add('active');
};

function renderAssociationDashboard() {
  const currentAssoc = getActiveAssociation();
  if (!currentAssoc) return;

  // Header Details
  const nameEl = document.getElementById('assoc-current-name');
  const stageBadgeEl = document.getElementById('assoc-stage-badge');
  const trackBadgeEl = document.getElementById('assoc-track-badge');
  const licValEl = document.getElementById('assoc-val-lic');
  const val700El = document.getElementById('assoc-val-700');
  const repValEl = document.getElementById('assoc-val-rep');
  const phoneValEl = document.getElementById('assoc-val-phone');

  if (nameEl) nameEl.textContent = currentAssoc.associationName;
  if (stageBadgeEl) stageBadgeEl.textContent = currentAssoc.stage || 'المرحلة الثالثة: الاحتضان المكاني';
  if (trackBadgeEl) trackBadgeEl.textContent = currentAssoc.track || 'مسار الحوكمة والتمكين الشامل';
  if (licValEl) licValEl.textContent = currentAssoc.licenseNumber || '1842';
  if (val700El) val700El.textContent = currentAssoc.nationalNumber700 || '7009823411';
  if (repValEl) repValEl.textContent = currentAssoc.repName || 'عبدالله الحربي';
  if (phoneValEl) phoneValEl.textContent = currentAssoc.repPhone || '0551234567';

  // Selector Dropdown options
  const selector = document.getElementById('assoc-switcher-select');
  if (selector) {
    selector.innerHTML = APP_STATE.applications.map((app, idx) => `
      <option value="${idx}" ${idx === currentActiveAssocIndex ? 'selected' : ''}>${app.associationName} (${app.licenseNumber})</option>
    `).join('');
  }

  // Dynamic 4-Stages BPMN Stepper
  renderAssocPipelineStepper(currentAssoc);

  // Stage Progress Bar & Percentage
  const pctEl = document.getElementById('assoc-stage-pct');
  const barEl = document.getElementById('assoc-stage-progress-bar');
  const stageNameInline = document.getElementById('assoc-stage-name-inline');
  const progressVal = currentAssoc.stageProgress || 75;

  if (pctEl) pctEl.textContent = `${progressVal}%`;
  if (barEl) barEl.style.width = `${progressVal}%`;
  if (stageNameInline) stageNameInline.textContent = `(${currentAssoc.stage || 'المرحلة الثالثة'})`;

  // 6 Executive KPI Metric Values
  const spaceTypeEl = document.getElementById('assoc-space-type');
  const workHEl = document.getElementById('assoc-work-hours');
  const volHEl = document.getElementById('assoc-vol-hours');
  const volCountEl = document.getElementById('assoc-vol-count');
  const kpiNcnpEl = document.getElementById('assoc-kpi-ncnp');
  const kpiBookingsEl = document.getElementById('assoc-kpi-bookings');

  // Find assigned space from directoryOrgs or fall back to application track
  const orgMeta = (DEFAULT_SEED_DATA.directoryOrgs || []).find(o => o.lic === currentAssoc.licenseNumber);
  const spaceText = orgMeta?.badge || currentAssoc.incubationType || 'مكتب مجهز رقم 4';
  if (spaceTypeEl) spaceTypeEl.textContent = spaceText;

  if (workHEl) workHEl.textContent = (currentAssoc.workHours || 1624).toLocaleString();
  if (volHEl) volHEl.textContent = (currentAssoc.volunteerHours || 197).toLocaleString();
  if (volCountEl) volCountEl.textContent = (currentAssoc.volunteersCount || 36).toLocaleString();
  if (kpiNcnpEl) kpiNcnpEl.textContent = `${currentAssoc.examScore || 92}%`;

  // Count active bookings & consultations for association
  const assocBookingsCount = (APP_STATE.bookings || []).length;
  const assocConsultCount = (APP_STATE.consultations || []).length;
  if (kpiBookingsEl) kpiBookingsEl.textContent = assocBookingsCount + assocConsultCount;

  // Evidences Count Badge in Tab Nav
  const evList = currentAssoc.evidences || [];
  const evBadge = document.getElementById('assoc-evidences-count-badge');
  if (evBadge) evBadge.textContent = evList.length;

  // Render State Machine (رحلة الجمعية المحتضنة التفاعلية - Prompt 2)
  renderAssociationStateMachine(currentAssoc);

  // Render Sub-Views
  renderAssocEvidencesList(currentAssoc);
  renderAssocBookingsList();
  renderAssocConsultationsList();
}

// ========================== Association Journey State Machine (Prompt 2) ==========================
window.setAppStateMachineState = function(stateKey, extraProps = {}) {
  const assoc = getActiveAssociation();
  if (!assoc) return;

  assoc.stateMachineState = stateKey;
  Object.assign(assoc, extraProps);

  if (stateKey === 'state1_review') {
    assoc.status = 'تحت المراجعة';
  } else if (stateKey === 'state1_rejected') {
    assoc.status = 'مرفوض';
    if (!assoc.rejectionReason) assoc.rejectionReason = 'عدم استيفاء شروط النطاق الجغرافي أو نقص الوثائق الإلزامية.';
  } else if (stateKey === 'state2_orientation') {
    assoc.status = 'مقبول';
    if (!assoc.orientationMeetingDate) assoc.orientationMeetingDate = 'الأحد القادم | الساعة 10:30 صباحاً | قاعة اللقاءات الرئيسية بمقر عذق';
  } else if (stateKey === 'state3_services_only') {
    assoc.officeWanted = false;
    assoc.incubationType = 'الاستفادة من الخدمات فقط';
  } else if (stateKey === 'state4_passed') {
    assoc.examPassed = true;
    assoc.stage = 'المرحلة الثالثة: الاحتضان المكاني';
    assoc.stageProgress = 75;
  } else if (stateKey === 'state4_failed') {
    assoc.examPassed = false;
  }

  savePlatformState();
  renderAssociationDashboard();
};

window.handleOfficeDecision = function(wantsOffice) {
  if (wantsOffice) {
    setAppStateMachineState('state3_conditional_employee', { officeWanted: true });
    showToast('تم تسجيل رغبتكم بالاحتضان المكتبي. يرجى التحقق من شرط الدوام اليومي.', 'info');
  } else {
    setAppStateMachineState('state3_services_only', { officeWanted: false });
    showToast('تم تحويل الحساب بنجاح إلى وضع "الاستفادة من الخدمات فقط" (استشارات وقاعات).', 'info');
  }
};

window.handleDailyEmployeeDecision = function(hasEmployee) {
  if (hasEmployee) {
    setAppStateMachineState('state4_exam_ready', {
      hasDailyEmployee: true,
      fullTimeEmployee: 'متوفر ومسجل بدوام كامل (يومي)'
    });
    showToast('تم استيفاء شرط الموظف اليومي بنجاح ✓ تم فتح اختبار الانطلاقة الأولى!', 'success');
  } else {
    setAppStateMachineState('state3_no_employee_apology', {
      hasDailyEmployee: false,
      fullTimeEmployee: 'غير متوفر'
    });
    showToast('نعتذر، لا يمكن إتمام الاحتضان المكتبي لعدم توفر موظف يومي.', 'warning');
  }
};

function renderAssociationStateMachine(assoc) {
  const container = document.getElementById('assoc-state-machine-wrapper');
  if (!container) return;

  // Derive initial state if not explicitly stored
  let state = assoc.stateMachineState;
  if (!state) {
    if (assoc.status === 'مرفوض') state = 'state1_rejected';
    else if (assoc.status === 'تحت المراجعة') state = 'state1_review';
    else if (assoc.status === 'مقبول') state = 'state4_passed';
    else state = 'state1_review';
  }

  let contentHtml = '';

  // STATE 1: Review or Rejected
  if (state === 'state1_review') {
    contentHtml = `
      <div class="assoc-state-machine-panel" style="border-right: 5px solid #F59E0B; background: linear-gradient(180deg, #FFFFFF 0%, #FFFBEB 100%);">
        <span class="state-badge-pill state-review">
          <i class="fa-solid fa-clock"></i> الحالة 1: قيد مراجعة الإدارة
        </span>
        <h3 class="state-machine-header-title">
          <i class="fa-solid fa-hourglass-half" style="color: #D97706;"></i>
          طلب الجمعية قيد الفرز والمراجعة من قبل الإدارة
        </h3>
        <p class="state-machine-desc">
          تم استلام ملف طلب الانضمام لجمعية <strong>"${assoc.associationName}"</strong> والمرفقات الرسمية الإجبارية الثلاثة كاملة:
          <span style="display: block; margin-top: 6px; font-weight: 700; color: var(--c-primary);">
            ✓ 1. جواب الالتحاق بالحاضنة معتمد • ✓ 2. شهادة الترخيص الرسمية (NCNP) • ✓ 3. نموذج طلب الانضمام موقع ومختوم.
          </span>
          يقوم فريق الإدارة بدراسة الطلب والتحقق من الاستيفاء. في حال تم القبول ستصلكم بيانات الدخول ويُحدد موعد الاجتماع وتفتح المرحلة التالية.
        </p>

        <div style="background: rgba(245, 158, 11, 0.1); border: 1px dashed #F59E0B; border-radius: 12px; padding: 14px 18px; margin-bottom: 18px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <i class="fa-solid fa-shield-halved" style="color: #D97706; font-size: 1.4rem;"></i>
            <span style="font-size: 0.85rem; font-weight: 700; color: #92400E;">القرار الإداري الرسمي يصدر من قبل لجنة الفرز والإشراف</span>
          </div>
          <button class="btn btn-outline-primary btn-sm" onclick="switchRole('admin')" title="الانتقال إلى لوحة الإدارة لاتخاذ القرار المهني">
            <i class="fa-solid fa-user-shield"></i> الانتقال للوحة الإدارة لاتخاذ القرار
          </button>
        </div>

        <div class="choice-btns-row">
          <button class="btn btn-primary btn-sm" onclick="setAppStateMachineState('state2_orientation')" title="محاكاة فورية لقرار القبول">
            <i class="fa-solid fa-circle-check"></i> محاكاة قبول الإدارة وتحديد موعد الاجتماع
          </button>
          <button class="btn btn-outline btn-sm" style="border-color: #EF4444; color: #DC2626;" onclick="setAppStateMachineState('state1_rejected')" title="محاكاة فورية لقرار الرفض">
            <i class="fa-solid fa-circle-xmark"></i> محاكاة رفض الطلب مع إظهار السبب
          </button>
        </div>

        ${renderStateSimulatorQuickbar(state)}
      </div>
    `;
  } else if (state === 'state1_rejected') {
    contentHtml = `
      <div class="assoc-state-machine-panel" style="border-right: 5px solid #EF4444; background: linear-gradient(180deg, #FFFFFF 0%, #FEF2F2 100%);">
        <span class="state-badge-pill state-rejected">
          <i class="fa-solid fa-ban"></i> الحالة 1: تم رفض الطلب (انتهت الرحلة)
        </span>
        <h3 class="state-machine-header-title" style="color: #991B1B;">
          <i class="fa-solid fa-circle-xmark" style="color: #DC2626;"></i>
          تم رفض طلب الانضمام من قبل إدارة الحاضنة
        </h3>
        
        <div class="decision-choice-box" style="background: #FEE2E2; border: 1.5px solid #FCA5A5;">
          <strong style="color: #991B1B; font-size: 0.95rem; display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
            <i class="fa-solid fa-triangle-exclamation"></i> سبب الرفض المحدد من الإدارة:
          </strong>
          <p style="margin: 0; color: #7F1D1D; font-size: 0.9rem; font-weight: 700; line-height: 1.6;">
            ${assoc.rejectionReason || assoc.notes || 'نعتذر عن عدم قبول الطلب نظراً لعدم استيفاء شروط النطاق الجغرافي أو عدم اكتمال الشواهد الإلزامية.'}
          </p>
        </div>

        <p class="state-machine-desc" style="color: #991B1B;">
          تنتهي رحلة الاحتضان الحالية بناءً على قرار الإدارة أعلاه. يمكن لممثلي الجمعية مراجعة الأسباب وتصحيح المتطلبات والتقديم مجدداً في الدورة القادمة.
        </p>

        <div class="choice-btns-row">
          <button class="btn btn-outline-primary btn-sm" onclick="setAppStateMachineState('state1_review')">
            <i class="fa-solid fa-rotate-left"></i> إعادة الطلب إلى قيد المراجعة
          </button>
          <button class="btn btn-primary btn-sm" onclick="setAppStateMachineState('state2_orientation')">
            <i class="fa-solid fa-circle-check"></i> محاكاة قبول الطلب والانتقال للحالة 2
          </button>
        </div>

        ${renderStateSimulatorQuickbar(state)}
      </div>
    `;
  }
  // STATE 2: Orientation Meeting and 3 Admin-Sent Items
  else if (state === 'state2_orientation') {
    contentHtml = `
      <div class="assoc-state-machine-panel" style="border-right: 5px solid var(--c-primary); background: linear-gradient(180deg, #FFFFFF 0%, #F0FDF4 100%);">
        <span class="state-badge-pill state-orientation">
          <i class="fa-solid fa-circle-check"></i> الحالة 2: القبول المبدئي والاجتماع التعريفي
        </span>
        <h3 class="state-machine-header-title" style="color: var(--c-primary-dark);">
          <i class="fa-solid fa-handshake" style="color: var(--c-primary);"></i>
          مرحباً بكم في حاضنة عذق - تم اعتماد القبول المبدئي وجدولة الاجتماع
        </h3>

        <!-- Orientation Meeting Highlight Box -->
        <div style="background: #FFFFFF; border: 2px solid var(--c-primary-light); border-radius: 16px; padding: 18px 22px; margin-bottom: 22px; box-shadow: 0 4px 16px rgba(14,110,65,0.08); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 14px;">
          <div style="display: flex; align-items: center; gap: 14px;">
            <div style="width: 52px; height: 52px; border-radius: 14px; background: rgba(14,110,65,0.1); color: var(--c-primary); display: flex; align-items: center; justify-content: center; font-size: 1.6rem;">
              <i class="fa-solid fa-calendar-check"></i>
            </div>
            <div>
              <div style="font-size: 0.8rem; color: var(--c-text-muted); font-weight: 700;">موعد الاجتماع التعريفي المحدد من الإدارة:</div>
              <div style="font-size: 1.15rem; font-weight: 900; color: var(--c-primary);">
                ${assoc.orientationMeetingDate || 'الأحد القادم | الساعة 10:30 صباحاً | قاعة اللقاءات الرئيسية بمقر عذق'}
              </div>
            </div>
          </div>
          <span class="badge" style="background: #D1FAE5; color: #065F46; padding: 6px 14px; font-weight: 800; font-size: 0.82rem;">
            حضور ممثل الجمعية إلزامي
          </span>
        </div>

        <!-- 3 Sent Items by Admin -->
        <div style="margin-bottom: 18px;">
          <h4 style="font-size: 1rem; font-weight: 800; color: var(--c-primary); margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
            <i class="fa-solid fa-envelope-open-text"></i> العناصر الثلاثة المرسلة من الإدارة للجمعية:
          </h4>
          <div class="admin-sent-items-grid">
            <!-- 1. نموذج طلب استشارة -->
            <div class="admin-sent-item-card">
              <div>
                <div class="admin-item-icon-box" style="background: rgba(14,110,65,0.1); color: var(--c-primary);">
                  <i class="fa-solid fa-comments"></i>
                </div>
                <div class="admin-item-title">1. نموذج طلب استشارة</div>
                <p class="admin-item-desc">جلسات توجيهية وإرشاد تخصصي في الحوكمة وتطوير اللوائح مع نخبة من الخبراء المعتمدين.</p>
              </div>
              <button class="btn btn-outline-primary btn-sm" onclick="openBookConsultantModal()">
                <i class="fa-solid fa-calendar-plus"></i> فتح نموذج الاستشارة
              </button>
            </div>

            <!-- 2. نموذج حجز قاعة -->
            <div class="admin-sent-item-card">
              <div>
                <div class="admin-item-icon-box" style="background: rgba(203,142,30,0.12); color: var(--c-gold-dark);">
                  <i class="fa-solid fa-door-open"></i>
                </div>
                <div class="admin-item-title">2. نموذج حجز قاعة</div>
                <p class="admin-item-desc">حجز القاعات الكبرى الذكية وقاعات التدريب ومساحات العمل المشتركة المزودة بأحدث التقنيات.</p>
              </div>
              <button class="btn btn-outline-primary btn-sm" onclick="openFacilityBookingModal()">
                <i class="fa-solid fa-calendar-days"></i> فتح نموذج حجز قاعة
              </button>
            </div>

            <!-- 3. اختبار الانطلاقة الأولى -->
            <div class="admin-sent-item-card" style="border-color: var(--c-gold); background: #FFFDF8;">
              <div>
                <div class="admin-item-icon-box" style="background: var(--c-gold); color: #072E20;">
                  <i class="fa-solid fa-clipboard-check"></i>
                </div>
                <div class="admin-item-title">3. اختبار الانطلاقة الأولى</div>
                <p class="admin-item-desc">اختبار تقييم الجاهزية المؤسسية وتأهيل مسار الاحتضان المكتبي (اختبار من 100 درجة).</p>
              </div>
              <button class="btn btn-gold btn-sm" onclick="setAppStateMachineState('state3_decision')">
                <i class="fa-solid fa-arrow-left"></i> الانتقال لتحديد المسار والاختبار
              </button>
            </div>
          </div>
        </div>

        <div style="display: flex; justify-content: flex-end; margin-top: 14px;">
          <button class="btn btn-primary" onclick="setAppStateMachineState('state3_decision')">
            الانتقال لخطوة قرار الاحتضان المكتبي (الحالة 3) <i class="fa-solid fa-arrow-left"></i>
          </button>
        </div>

        ${renderStateSimulatorQuickbar(state)}
      </div>
    `;
  }
  // STATE 3: Decision - Do you want Office Incubation?
  else if (state === 'state3_decision') {
    contentHtml = `
      <div class="assoc-state-machine-panel" style="border-right: 5px solid var(--c-gold); background: linear-gradient(180deg, #FFFFFF 0%, #FFFDF5 100%);">
        <span class="state-badge-pill state-decision">
          <i class="fa-solid fa-scale-balanced"></i> الحالة 3: قرار الاحتضان المكتبي (شرط منطقي هام)
        </span>
        <h3 class="state-machine-header-title">
          <i class="fa-solid fa-building-circle-check" style="color: var(--c-gold-dark);"></i>
          تحديد مسار الاحتضان لجمعية "${assoc.associationName}"
        </h3>

        <div class="decision-choice-box" style="background: #FFFFFF; border: 2px solid var(--c-gold); box-shadow: 0 6px 20px rgba(197, 155, 39, 0.1);">
          <div class="decision-choice-title" style="font-size: 1.25rem;">
            <i class="fa-solid fa-circle-question" style="color: var(--c-gold);"></i>
            هل ترغب الجمعية بالاحتضان المكتبي؟
          </div>
          <p class="state-machine-desc" style="margin-bottom: 20px;">
            يوفر مسار <strong>الاحتضان المكتبي</strong> مقراً مستقلاً أو مساحة مكتبية مجهزة بالكامل للجمعية بمقر حاضنة عذق، بينما يقتصر مسار <strong>الاستفادة من الخدمات فقط</strong> على حجز القاعات والجلسات الاستشارية دون تخصيص مقر مكتبي.
          </p>
          <div class="choice-btns-row">
            <button class="btn btn-primary" onclick="handleOfficeDecision(true)" style="padding: 12px 28px; font-weight: 800; font-size: 0.98rem;">
              <i class="fa-solid fa-check"></i> نعم، ترغب الجمعية بالاحتضان المكتبي
            </button>
            <button class="btn btn-outline-primary" onclick="handleOfficeDecision(false)" style="padding: 12px 28px; font-weight: 800; font-size: 0.98rem;">
              <i class="fa-solid fa-xmark"></i> لا، نكتفي بالاستفادة من الخدمات فقط
            </button>
          </div>
        </div>

        ${renderStateSimulatorQuickbar(state)}
      </div>
    `;
  }
  // STATE 3A: Chose NO -> Services Only mode
  else if (state === 'state3_services_only') {
    contentHtml = `
      <div class="assoc-state-machine-panel" style="border-right: 5px solid #3B82F6; background: linear-gradient(180deg, #FFFFFF 0%, #EFF6FF 100%);">
        <span class="state-badge-pill" style="background: rgba(59, 130, 246, 0.15); color: #1D4ED8; border: 1px solid #3B82F6;">
          <i class="fa-solid fa-briefcase"></i> الحالة 3: وضع الاستفادة من الخدمات فقط
        </span>
        <h3 class="state-machine-header-title" style="color: #1E3A8A;">
          <i class="fa-solid fa-circle-info" style="color: #3B82F6;"></i>
          تم تحويل حساب الجمعية إلى وضع: "الاستفادة من الخدمات فقط"
        </h3>
        <p class="state-machine-desc" style="color: #1E40AF;">
          بناءً على اختيار الجمعية (لا ترغب بالاحتضان المكتبي)، تم تحويل الحساب رسمياً لوضع <strong>الاستفادة من الخدمات فقط</strong>.
          يُتاح لكم الآن حصرياً استخدام <strong>نموذج طلب استشارة</strong> و<strong>نموذج حجز قاعة</strong> دون تخصيص مقر مكتبي مستقل.
        </p>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; margin: 20px 0;">
          <div class="admin-sent-item-card">
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 10px;">
              <div class="admin-item-icon-box" style="background: rgba(14,110,65,0.1); color: var(--c-primary); margin: 0;">
                <i class="fa-solid fa-comments"></i>
              </div>
              <strong style="color: var(--c-primary);">1. نموذج طلب استشارة</strong>
            </div>
            <p class="admin-item-desc">جلسات حوكمة ودعم مالي وقانوني مع مستشاري الحاضنة.</p>
            <button class="btn btn-outline-primary btn-sm" onclick="openBookConsultantModal()">
              <i class="fa-solid fa-calendar-plus"></i> حجز استشارة متخصصة
            </button>
          </div>

          <div class="admin-sent-item-card">
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 10px;">
              <div class="admin-item-icon-box" style="background: rgba(203,142,30,0.12); color: var(--c-gold-dark); margin: 0;">
                <i class="fa-solid fa-door-open"></i>
              </div>
              <strong style="color: var(--c-gold-dark);">2. نموذج حجز قاعة</strong>
            </div>
            <p class="admin-item-desc">حجز القاعات التدريبية والذكية ومساحات الاجتماعات.</p>
            <button class="btn btn-outline-primary btn-sm" onclick="openFacilityBookingModal()">
              <i class="fa-solid fa-calendar-days"></i> حجز قاعة أو مرفق
            </button>
          </div>
        </div>

        <div style="border-top: 1px solid rgba(59, 130, 246, 0.2); padding-top: 14px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
          <span style="font-size: 0.8rem; color: #1E40AF;">يمكنكم تغيير هذا القرار وطلب الاحتضان المكتبي في أي وقت:</span>
          <button class="btn btn-outline-primary btn-sm" onclick="setAppStateMachineState('state3_decision')">
            <i class="fa-solid fa-rotate-left"></i> الرغبة في طلب الاحتضان المكتبي
          </button>
        </div>

        ${renderStateSimulatorQuickbar(state)}
      </div>
    `;
  }
  // STATE 3B: Chose YES -> Conditional Question: Daily Employee?
  else if (state === 'state3_conditional_employee') {
    contentHtml = `
      <div class="assoc-state-machine-panel" style="border-right: 5px solid var(--c-primary); background: linear-gradient(180deg, #FFFFFF 0%, #F0FDF4 100%);">
        <span class="state-badge-pill state-orientation">
          <i class="fa-solid fa-user-clock"></i> الحالة 3: شرط الاحتضان المكتبي الإلزامي
        </span>
        <h3 class="state-machine-header-title">
          <i class="fa-solid fa-user-check" style="color: var(--c-primary);"></i>
          التحقق من توفر كادر وظيفي للدوام اليومي بالجمعية
        </h3>

        <div class="decision-choice-box" style="background: #FFFFFF; border: 2px solid var(--c-primary); box-shadow: 0 6px 20px rgba(14, 110, 65, 0.1);">
          <div class="decision-choice-title" style="font-size: 1.25rem;">
            <i class="fa-solid fa-circle-question" style="color: var(--c-primary);"></i>
            هل يوجد موظف يداوم بشكل يومي في الجمعية؟
          </div>
          <p class="state-machine-desc" style="margin-bottom: 20px;">
            تشترط اللائحة التشغيلية لحاضنة ومسرعة عذق وجود مدير تنفيذي أو موظف متفرغ يداوم بشكل يومي بمقر الحاضنة لضمان استمرارية النشاط المؤسسي وخدمة المستفيدين.
          </p>
          <div class="choice-btns-row">
            <button class="btn btn-primary" onclick="handleDailyEmployeeDecision(true)" style="padding: 12px 28px; font-weight: 800; font-size: 0.98rem;">
              <i class="fa-solid fa-check"></i> نعم، يوجد موظف يداوم بشكل يومي
            </button>
            <button class="btn btn-outline" style="border-color: #EF4444; color: #DC2626; padding: 12px 28px; font-weight: 800; font-size: 0.98rem;" onclick="handleDailyEmployeeDecision(false)">
              <i class="fa-solid fa-xmark"></i> لا، لا يوجد موظف يومي حالياً
            </button>
          </div>
        </div>

        ${renderStateSimulatorQuickbar(state)}
      </div>
    `;
  }
  // STATE 3C: Answered NO to Daily Employee -> Apology Message
  else if (state === 'state3_no_employee_apology') {
    contentHtml = `
      <div class="assoc-state-machine-panel" style="border-right: 5px solid #EF4444; background: linear-gradient(180deg, #FFFFFF 0%, #FEF2F2 100%);">
        <span class="state-badge-pill state-rejected">
          <i class="fa-solid fa-triangle-exclamation"></i> الحالة 3: تعذر الاحتضان المكتبي
        </span>
        <h3 class="state-machine-header-title" style="color: #991B1B;">
          <i class="fa-solid fa-circle-exclamation" style="color: #DC2626;"></i>
          رسالة اعتذار رسمية - تعذر الاحتضان المكتبي
        </h3>

        <div class="decision-choice-box" style="background: #FEE2E2; border: 1.5px solid #FCA5A5; margin-bottom: 18px;">
          <strong style="color: #991B1B; font-size: 1rem; display: block; margin-bottom: 6px;">
            نعتذر لجمعية "${assoc.associationName}":
          </strong>
          <p style="margin: 0; color: #7F1D1D; font-size: 0.92rem; font-weight: 700; line-height: 1.7;">
            لا يمكن إتمام مسار الاحتضان المكتبي لعدم توفر موظف يداوم بشكل يومي في الجمعية، وهو شرط أساسي لتخصيص المقرات المكتبية المشتركة والمستقلة بمقر عذق.
          </p>
        </div>

        <p class="state-machine-desc" style="color: #991B1B;">
          يمكنكم الاستفادة من خدمات الحاضنة الأخرى (حجز القاعات وطلب الاستشارات التخصصية) عبر تحويل الحساب لوضع الخدمات فقط، أو إعادة تأكيد وجود الموظف فور توظيفه.
        </p>

        <div class="choice-btns-row">
          <button class="btn btn-primary btn-sm" onclick="handleOfficeDecision(false)">
            <i class="fa-solid fa-briefcase"></i> التحويل لوضع الاستفادة من الخدمات فقط
          </button>
          <button class="btn btn-outline-primary btn-sm" onclick="handleDailyEmployeeDecision(true)">
            <i class="fa-solid fa-user-check"></i> تم توفير موظف يومي (إعادة الفحص)
          </button>
        </div>

        ${renderStateSimulatorQuickbar(state)}
      </div>
    `;
  }
  // STATE 4A: Exam Ready -> Unlocked Foundation Exam (100 points)
  else if (state === 'state4_exam_ready') {
    contentHtml = `
      <div class="assoc-state-machine-panel" style="border-right: 5px solid var(--c-primary); background: linear-gradient(180deg, #FFFFFF 0%, #F0FDF4 100%);">
        <span class="state-badge-pill state-orientation">
          <i class="fa-solid fa-unlock"></i> الحالة 4: تم فتح اختبار الانطلاقة الأولى
        </span>
        <h3 class="state-machine-header-title">
          <i class="fa-solid fa-award" style="color: var(--c-gold);"></i>
          استيفاء شرط الموظف اليومي بنجاح ✓ - فتح اختبار الانطلاقة الأولى
        </h3>
        <p class="state-machine-desc">
          تم تأكيد توفر موظف يداوم يومياً بالجمعية. الخطوة التأهيلية الأخيرة لمسار الاحتضان المكتبي هي اجتياز <strong>اختبار الانطلاقة الأولى (من 100 درجة)</strong>.
          <br>
          <span style="font-weight: 800; color: var(--c-primary);">شرط التأهل: الحصول على أكثر من 85 من 100 درجة للتأهل لتوثيق العقود ورحلة الاحتضان.</span>
        </p>

        <div style="background: #FFFFFF; border: 2px solid var(--c-gold); border-radius: 16px; padding: 20px 24px; margin-bottom: 22px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 14px; box-shadow: 0 4px 18px rgba(197, 155, 39, 0.12);">
          <div>
            <div style="font-size: 0.85rem; color: var(--c-text-muted); font-weight: 700;">الاختبار التأهيلي المعتمد:</div>
            <div style="font-size: 1.25rem; font-weight: 900; color: var(--c-primary);">اختبار الانطلاقة الأولى (10 معايير = 100 درجة)</div>
            <div style="font-size: 0.8rem; color: var(--c-gold-dark); font-weight: 700; margin-top: 4px;">
              درجة النجاح: > 85 من 100 • 85 أو أقل يتوقف مسار الاحتضان المكتبي
            </div>
          </div>
          <button class="btn btn-gold btn-lg" onclick="openFoundationExamModal()" style="font-weight: 900; padding: 12px 28px;">
            <i class="fa-solid fa-clipboard-check"></i> بدء الاختبار الآن (100 درجة) <i class="fa-solid fa-arrow-left"></i>
          </button>
        </div>

        <div class="choice-btns-row" style="margin-top: 10px;">
          <span style="font-size: 0.8rem; font-weight: 700; color: var(--c-text-muted);">محاكاة سريعة للنتيجة:</span>
          <button class="btn btn-outline btn-sm" style="border-color: #EF4444; color: #EF4444;" onclick="simulateExamScoreDirect(70)">
            محاكاة رسوب (70%) شرط 85
          </button>
          <button class="btn btn-outline btn-sm" style="border-color: #10B981; color: #047857;" onclick="simulateExamScoreDirect(92)">
            محاكاة اجتياز (92%) تأهل فوري
          </button>
        </div>

        ${renderStateSimulatorQuickbar(state)}
      </div>
    `;
  }
  // STATE 4B: Failed Exam (Score <= 85) -> Office Incubation Halts
  else if (state === 'state4_failed') {
    const score = assoc.examScore || 70;
    contentHtml = `
      <div class="assoc-state-machine-panel" style="border-right: 5px solid #EF4444; background: linear-gradient(180deg, #FFFFFF 0%, #FEF2F2 100%);">
        <span class="state-badge-pill state-exam-fail">
          <i class="fa-solid fa-ban"></i> الحالة 4: نتيجة الاختبار (85 درجة أو أقل)
        </span>
        <h3 class="state-machine-header-title" style="color: #991B1B;">
          <i class="fa-solid fa-circle-exclamation" style="color: #DC2626;"></i>
          يتوقف مسار الاحتضان المكتبي - لم يتم تجاوز شرط درجة الاجتياز (أعلى من 85)
        </h3>

        <div style="background: #FFFFFF; border: 2px solid #FCA5A5; border-radius: 16px; padding: 18px 24px; margin-bottom: 20px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 14px; box-shadow: 0 4px 16px rgba(239, 68, 68, 0.08);">
          <div style="display: flex; align-items: center; gap: 14px;">
            <div style="width: 54px; height: 54px; border-radius: 14px; background: #FEE2E2; color: #DC2626; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; font-weight: 900;">
              ${score}
            </div>
            <div>
              <div style="font-size: 0.8rem; color: #991B1B; font-weight: 700;">الدرجة المحققة في اختبار الانطلاقة الأولى:</div>
              <div style="font-size: 1.25rem; font-weight: 900; color: #DC2626;">${score} من 100 (درجة غير مؤهلة)</div>
            </div>
          </div>
          <span class="badge" style="background: #FEE2E2; color: #991B1B; font-size: 0.85rem; padding: 6px 14px; font-weight: 800;">
            شرط التأهل: أكثر من 85 من 100
          </span>
        </div>

        <p class="state-machine-desc" style="color: #991B1B;">
          حصلت الجمعية على ${score} درجة من 100 (85 درجة أو أقل). وفقاً لمخطط الحاضنة، <strong>يتوقف مسار الاحتضان المكتبي حالياً</strong>.
          تم تحويل مساركم للاستفادة من الجلسات الاستشارية لتأهيل اللوائح وتطوير مؤشرات الحوكمة لإعادة تقديم الاختبار لاحقاً.
        </p>

        <div class="choice-btns-row">
          <button class="btn btn-primary btn-sm" onclick="openFoundationExamModal()">
            <i class="fa-solid fa-rotate-left"></i> إعادة تقديم الاختبار
          </button>
          <button class="btn btn-outline-primary btn-sm" onclick="openBookConsultantModal()">
            <i class="fa-solid fa-comments"></i> طلب استشارة لتطوير مؤشرات الحوكمة
          </button>
          <button class="btn btn-outline btn-sm" onclick="handleOfficeDecision(false)">
            <i class="fa-solid fa-briefcase"></i> التحويل لوضع الاستفادة من الخدمات فقط
          </button>
        </div>

        ${renderStateSimulatorQuickbar(state)}
      </div>
    `;
  }
  // STATE 4C: Passed Exam (Score > 65) -> Qualifies for Contract & Incubation
  // STATE 4C: Passed Exam (Score > 65) -> Prompt 3: عقود الاحتضان، تسليم المقر، والمراحل الأربع للاحتضان
  else if (state === 'state4_passed') {
    initPrompt3State(assoc);
    contentHtml = renderPrompt3Journey(assoc);
  }

  container.innerHTML = contentHtml;
}

let currentPrompt3ActiveTab = 'p3-tab-docs';
let currentPreviewDocKey = 'contract';

function initPrompt3State(assoc) {
  if (assoc.requiredEvidencesUploaded === undefined) {
    assoc.requiredEvidencesUploaded = true;
  }
  if (!assoc.signedAdminDocs) {
    assoc.signedAdminDocs = {
      contract: { title: 'عقد الاحتضان المعتمد', code: 'ATHQ-CONTR-01', signed: true, date: '2025-08-15' },
      governorate: { title: 'تقرير المحافظة (الاستيفاء ونطاق العمل)', code: 'ATHQ-GOV-02', signed: true, date: '2025-08-18' },
      performance: { title: 'خطاب تقييم الأداء المؤسسي', code: 'ATHQ-EVAL-03', signed: true, date: '2025-08-20' },
      application: { title: 'نموذج طلب الانضمام موقعاً ومختوماً', code: 'ATHQ-APP-04', signed: true, date: '2025-08-22' }
    };
  }
  if (!assoc.handoverChecklist) {
    assoc.handoverChecklist = {
      keys_assets: { title: 'نموذج استلام المفاتيح والعهد', completed: true, date: '2025-08-25', notes: 'مكتب مجهز رقم 4 • طقم مفاتيح مبرمجة وبطاقة الخزنة والأصول' },
      cards_printing: { title: 'حالة طباعة الكروت', completed: true, date: '2025-08-25', notes: '4 كروت ذكية مبرمجة بالبصمة وNFC لكادر الجمعية' },
      door_naming: { title: 'تسمية الباب', completed: true, date: '2025-08-26', notes: 'لوحة الباب الرقمية: جمعية ديوان الشبابية - مكتب 104' },
      association_boards: { title: 'طباعة لوحات الجمعية', completed: true, date: '2025-08-26', notes: 'لوحة جدارية أكريليك فاخرة بشعار الجمعية في بهو الحاضنة' }
    };
  }
  if (!assoc.incubationStages) {
    assoc.incubationStages = {
      stage1: { name: 'استبيان الفكرة', completed: true, progress: 100 },
      stage2: { name: 'الهوية المؤسسية (الاحتضان الأولي)', completed: true, progress: 100 },
      stage3: { name: 'الاحتضان المكتبي', completed: false, progress: 75 },
      stage4: { name: 'مخرجات عذق', completed: false, progress: 0 }
    };
  }
  if (!assoc.grantReferrals) {
    assoc.grantReferrals = [];
  }
}

function renderPrompt3Journey(assoc) {
  const score = assoc.examScore || 92;
  const docs = assoc.signedAdminDocs || {};
  const allDocsSigned = docs.contract?.signed && docs.governorate?.signed && docs.performance?.signed && docs.application?.signed;
  const handover = assoc.handoverChecklist || {};
  const stages = assoc.incubationStages || {};

  return `
    <div class="prompt3-journey-container">
      <!-- Header -->
      <div class="prompt3-header">
        <div class="prompt3-title-box">
          <div class="prompt3-title-icon"><i class="fa-solid fa-file-contract"></i></div>
          <div class="prompt3-title-text">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 3px;">
              <span class="badge" style="background: rgba(16,185,129,0.15); color: #047857; font-weight: 800; font-size: 0.76rem;">
                <i class="fa-solid fa-circle-check"></i> اجتياز اختبار الانطلاقة بنجاح (${score}%)
              </span>
              <span class="badge" style="background: rgba(197,155,39,0.15); color: var(--c-gold-dark); font-weight: 800; font-size: 0.76rem;">
                الأمر الثالث: العقود والمقر والمراحل الأربع
              </span>
            </div>
            <h3>رحلة الجمعية المحتضنة (الجزء الثاني): توثيق العقود، تسليم المقر، والمراحل الأربع</h3>
            <p>إدارة كافة متطلبات ما بعد الاختبار، الوثائق الـ 4، إجراءات تسليم المقر، وتتبع المراحل الأربع حتى التخرج والتمكين</p>
          </div>
        </div>

        <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
          <button class="btn btn-outline-primary btn-sm" onclick="saveProgressAndExit()" title="حفظ التقدم والخروج المؤقت">
            <i class="fa-solid fa-floppy-disk"></i> حفظ التقدم والخروج المؤقت
          </button>
          <button class="btn btn-gold btn-sm" onclick="graduateAssociationQuick()" title="إتمام المراحل والتخرج الفوري">
            <i class="fa-solid fa-graduation-cap"></i> التخرج والتمكين (100%)
          </button>
        </div>
      </div>

      <!-- Quick Simulator Bar for Prompt 3 -->
      <div class="state-simulator-quickbar" style="margin-top: 0; margin-bottom: 20px;">
        <span class="state-sim-title"><i class="fa-solid fa-wand-magic-sparkles"></i> اختبار خطوات الأمر 3:</span>
        <button type="button" class="btn-state-sim" onclick="jumpToPrompt3Section('p3-tab-docs')">1. الشواهد والوثائق الـ 4</button>
        <button type="button" class="btn-state-sim" onclick="jumpToPrompt3Section('p3-tab-handover')">2. تسليم المقر والخدمات</button>
        <button type="button" class="btn-state-sim" onclick="jumpToPrompt3Section('p3-tab-stages')">3. متتبع المراحل الأربع</button>
        <button type="button" class="btn-state-sim" onclick="saveProgressAndExit()">💾 حفظ التقدم والخروج</button>
        <button type="button" class="btn-state-sim" onclick="jumpToPrompt3Section('p3-tab-graduation')">🎓 التخرج وإحالة المنح</button>
        <button type="button" class="btn-state-sim" onclick="setAppStateMachineState('state4_exam_ready')">← العودة للاختبار</button>
      </div>

      <!-- Tabs Navigation -->
      <div class="prompt3-nav-tabs">
        <button class="prompt3-tab-btn ${currentPrompt3ActiveTab === 'p3-tab-docs' ? 'active' : ''}" onclick="switchPrompt3Tab(this, 'p3-tab-docs')">
          <i class="fa-solid fa-file-signature"></i> 1. رفع الشواهد وتوقيع الوثائق
          <span class="badge" style="background: rgba(14,110,65,0.12); color: var(--c-primary); font-size: 0.7rem; padding: 2px 7px; border-radius: 10px;">4 وثائق</span>
        </button>
        <button class="prompt3-tab-btn ${currentPrompt3ActiveTab === 'p3-tab-handover' ? 'active' : ''}" onclick="switchPrompt3Tab(this, 'p3-tab-handover')">
          <i class="fa-solid fa-key"></i> 2. تسليم المقر وتفعيل الخدمات
          <span class="badge" style="background: rgba(197,155,39,0.15); color: var(--c-gold-dark); font-size: 0.7rem; padding: 2px 7px; border-radius: 10px;">Checklist</span>
        </button>
        <button class="prompt3-tab-btn ${currentPrompt3ActiveTab === 'p3-tab-stages' ? 'active' : ''}" onclick="switchPrompt3Tab(this, 'p3-tab-stages')">
          <i class="fa-solid fa-bars-staggered"></i> 3. متتبع رحلة الاحتضان
          <span class="badge" style="background: rgba(59,130,246,0.12); color: #2563EB; font-size: 0.7rem; padding: 2px 7px; border-radius: 10px;">4 مراحل</span>
        </button>
        <button class="prompt3-tab-btn ${currentPrompt3ActiveTab === 'p3-tab-graduation' ? 'active' : ''}" onclick="switchPrompt3Tab(this, 'p3-tab-graduation')">
          <i class="fa-solid fa-graduation-cap"></i> 4. التخرج والمنح المؤسسية
          <span class="badge" style="background: rgba(16,185,129,0.15); color: #047857; font-size: 0.7rem; padding: 2px 7px; border-radius: 10px;">تمكين</span>
        </button>
      </div>

      <!-- Tab 1: قسم رفع الشواهد وتوقيع الوثائق -->
      <div id="p3-tab-docs" class="prompt3-tab-pane ${currentPrompt3ActiveTab === 'p3-tab-docs' ? 'active' : ''}">
        <!-- Sub-step A: رفع الشواهد المطلوبة -->
        <div class="required-evidences-box">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; margin-bottom: 8px;">
            <div>
              <strong style="color: var(--c-gold-dark); font-size: 1.05rem; display: flex; align-items: center; gap: 8px;">
                <i class="fa-solid fa-cloud-arrow-up"></i> أ) قسم رفع "الشواهد المطلوبة" من الجمعية:
              </strong>
              <p style="font-size: 0.82rem; color: var(--c-text-muted); margin: 3px 0 0 0;">
                يشترط استكمال رفع الشواهد النظامية الأربعة التالية لإصدار عقود الاحتضان الرسمية:
              </p>
            </div>
            <div>
              ${assoc.requiredEvidencesUploaded ? `
                <span class="badge" style="background: #D1FAE5; color: #047857; font-size: 0.82rem; padding: 6px 14px; font-weight: 800;">
                  <i class="fa-solid fa-circle-check"></i> تم رفع واعتماد الشواهد المطلوبة بنجاح ✓
                </span>
              ` : `
                <button class="btn btn-gold btn-sm" onclick="uploadRequiredEvidences()">
                  <i class="fa-solid fa-upload"></i> رفع وتأكيد الشواهد المطلوبة
                </button>
              `}
            </div>
          </div>

          <div class="required-evidences-grid">
            <div class="required-evidence-card">
              <div style="display: flex; align-items: center; gap: 10px;">
                <i class="fa-solid fa-id-card text-gold"></i>
                <span style="font-size: 0.84rem; font-weight: 700;">1. السجل الرسمي والترخيص (NCNP)</span>
              </div>
              <span class="badge" style="background: rgba(16,185,129,0.12); color: #047857;">مرفوع ✓</span>
            </div>
            <div class="required-evidence-card">
              <div style="display: flex; align-items: center; gap: 10px;">
                <i class="fa-solid fa-file-shield text-gold"></i>
                <span style="font-size: 0.84rem; font-weight: 700;">2. ميثاق الحوكمة ومحضر التأسيس</span>
              </div>
              <span class="badge" style="background: rgba(16,185,129,0.12); color: #047857;">مرفوع ✓</span>
            </div>
            <div class="required-evidence-card">
              <div style="display: flex; align-items: center; gap: 10px;">
                <i class="fa-solid fa-building-columns text-gold"></i>
                <span style="font-size: 0.84rem; font-weight: 700;">3. إفادة الحساب البنكي والآيبان</span>
              </div>
              <span class="badge" style="background: rgba(16,185,129,0.12); color: #047857;">مرفوع ✓</span>
            </div>
            <div class="required-evidence-card">
              <div style="display: flex; align-items: center; gap: 10px;">
                <i class="fa-solid fa-user-check text-gold"></i>
                <span style="font-size: 0.84rem; font-weight: 700;">4. تفويض ممثل الجمعية الرسمي</span>
              </div>
              <span class="badge" style="background: rgba(16,185,129,0.12); color: #047857;">مرفوع ✓</span>
            </div>
          </div>
        </div>

        <!-- Sub-step B: الـ 4 مستندات الصادرة من الإدارة لتحميلها وإعادة رفعها موقعة -->
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 8px;">
            <div>
              <strong style="font-size: 1.05rem; color: var(--c-primary); display: flex; align-items: center; gap: 8px;">
                <i class="fa-solid fa-envelope-open-text"></i> ب) المستندات الـ 4 الصادرة من الإدارة (للتحميل وإعادة الرفع موقعة ومختومة):
              </strong>
              <p style="font-size: 0.82rem; color: var(--c-text-muted); margin: 3px 0 0 0;">
                قم بتحميل الوثائق الأربع، وتوقيعها من المفوض والختم الرسمي، ثم إعادة رفعها لاعتماد تفعيل الخدمات:
              </p>
            </div>
            <div style="display: flex; gap: 8px;">
              <button class="btn btn-outline-primary btn-sm" onclick="signAllAdminDocsQuick()" title="محاكاة توقيع كافة الوثائق الـ 4 بنقرة واحدة">
                <i class="fa-solid fa-signature"></i> توقيع واعتماد جميع الوثائق (سريع)
              </button>
            </div>
          </div>

          <div class="contract-docs-grid">
            <!-- 1. عقد الاحتضان -->
            <div class="contract-doc-card ${docs.contract?.signed ? 'signed' : ''}">
              <div>
                <div class="doc-card-top">
                  <div class="doc-card-icon"><i class="fa-solid fa-file-signature"></i></div>
                  <div class="doc-card-meta">
                    <h4>1. عقد الاحتضان الرسمي</h4>
                    <span>كود الوثيقة: ATHQ-CONTR-01 • تاريخ الإصدار: 2025-08-15</span>
                  </div>
                </div>
                <p style="font-size: 0.8rem; color: var(--c-text-muted); line-height: 1.6; margin: 0 0 10px 0;">
                  عقد الشراكة والاحتضان المكاني والمؤسسي المعتمد بين جمعية البر (عذق) والجمعية المحتضنة.
                </p>
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
                  <span style="font-size: 0.75rem; color: var(--c-text-muted);">الحالة:</span>
                  <span class="badge" style="background: ${docs.contract?.signed ? '#D1FAE5' : '#FEF3C7'}; color: ${docs.contract?.signed ? '#047857' : '#92400E'}; font-weight: 800; font-size: 0.75rem;">
                    ${docs.contract?.signed ? '<i class="fa-solid fa-check-double"></i> موقع ومختوم ✓' : '<i class="fa-solid fa-clock"></i> في انتظار التوقيع والرفع'}
                  </span>
                </div>
              </div>
              <div class="doc-card-actions">
                <button class="btn btn-outline btn-sm" onclick="downloadAdminIssuedDoc('contract')" style="flex: 1;" title="تحميل المستند الصادر">
                  <i class="fa-solid fa-download"></i> تحميل
                </button>
                <button class="btn btn-outline-primary btn-sm" onclick="previewAdminIssuedDoc('contract')" style="flex: 1;" title="معاينة الوثيقة">
                  <i class="fa-solid fa-eye"></i> معاينة
                </button>
                <button class="btn ${docs.contract?.signed ? 'btn-outline-primary' : 'btn-primary'} btn-sm" onclick="toggleSignAdminDoc('contract')" style="flex: 1.2;">
                  <i class="fa-solid ${docs.contract?.signed ? 'fa-rotate' : 'fa-upload'}"></i> ${docs.contract?.signed ? 'إعادة رفع' : 'رفع موقعاً'}
                </button>
              </div>
            </div>

            <!-- 2. تقرير المحافظة -->
            <div class="contract-doc-card ${docs.governorate?.signed ? 'signed' : ''}">
              <div>
                <div class="doc-card-top">
                  <div class="doc-card-icon" style="background: rgba(203,142,30,0.12); color: var(--c-gold-dark);"><i class="fa-solid fa-building-shield"></i></div>
                  <div class="doc-card-meta">
                    <h4>2. تقرير المحافظة</h4>
                    <span>كود الوثيقة: ATHQ-GOV-02 • الاستيفاء ونطاق العمل</span>
                  </div>
                </div>
                <p style="font-size: 0.8rem; color: var(--c-text-muted); line-height: 1.6; margin: 0 0 10px 0;">
                  تقرير الاستيفاء الميداني ومطابقة نطاق الخدمة بمنطقة المدينة المنورة ومواءمة الأهداف المجتمعية.
                </p>
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
                  <span style="font-size: 0.75rem; color: var(--c-text-muted);">الحالة:</span>
                  <span class="badge" style="background: ${docs.governorate?.signed ? '#D1FAE5' : '#FEF3C7'}; color: ${docs.governorate?.signed ? '#047857' : '#92400E'}; font-weight: 800; font-size: 0.75rem;">
                    ${docs.governorate?.signed ? '<i class="fa-solid fa-check-double"></i> موقع ومختوم ✓' : '<i class="fa-solid fa-clock"></i> في انتظار التوقيع والرفع'}
                  </span>
                </div>
              </div>
              <div class="doc-card-actions">
                <button class="btn btn-outline btn-sm" onclick="downloadAdminIssuedDoc('governorate')" style="flex: 1;">
                  <i class="fa-solid fa-download"></i> تحميل
                </button>
                <button class="btn btn-outline-primary btn-sm" onclick="previewAdminIssuedDoc('governorate')" style="flex: 1;">
                  <i class="fa-solid fa-eye"></i> معاينة
                </button>
                <button class="btn ${docs.governorate?.signed ? 'btn-outline-primary' : 'btn-primary'} btn-sm" onclick="toggleSignAdminDoc('governorate')" style="flex: 1.2;">
                  <i class="fa-solid ${docs.governorate?.signed ? 'fa-rotate' : 'fa-upload'}"></i> ${docs.governorate?.signed ? 'إعادة رفع' : 'رفع موقعاً'}
                </button>
              </div>
            </div>

            <!-- 3. خطاب تقييم الأداء -->
            <div class="contract-doc-card ${docs.performance?.signed ? 'signed' : ''}">
              <div>
                <div class="doc-card-top">
                  <div class="doc-card-icon" style="background: rgba(59,130,246,0.12); color: #2563EB;"><i class="fa-solid fa-chart-line"></i></div>
                  <div class="doc-card-meta">
                    <h4>3. خطاب تقييم الأداء</h4>
                    <span>كود الوثيقة: ATHQ-EVAL-03 • لجنة الفرز والإشراف</span>
                  </div>
                </div>
                <p style="font-size: 0.8rem; color: var(--c-text-muted); line-height: 1.6; margin: 0 0 10px 0;">
                  خطاب تقييم الجاهزية المؤسسية واجتياز اختبار الانطلاقة ودرجات المعايير العشرة المعتمدة.
                </p>
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
                  <span style="font-size: 0.75rem; color: var(--c-text-muted);">الحالة:</span>
                  <span class="badge" style="background: ${docs.performance?.signed ? '#D1FAE5' : '#FEF3C7'}; color: ${docs.performance?.signed ? '#047857' : '#92400E'}; font-weight: 800; font-size: 0.75rem;">
                    ${docs.performance?.signed ? '<i class="fa-solid fa-check-double"></i> موقع ومختوم ✓' : '<i class="fa-solid fa-clock"></i> في انتظار التوقيع والرفع'}
                  </span>
                </div>
              </div>
              <div class="doc-card-actions">
                <button class="btn btn-outline btn-sm" onclick="downloadAdminIssuedDoc('performance')" style="flex: 1;">
                  <i class="fa-solid fa-download"></i> تحميل
                </button>
                <button class="btn btn-outline-primary btn-sm" onclick="previewAdminIssuedDoc('performance')" style="flex: 1;">
                  <i class="fa-solid fa-eye"></i> معاينة
                </button>
                <button class="btn ${docs.performance?.signed ? 'btn-outline-primary' : 'btn-primary'} btn-sm" onclick="toggleSignAdminDoc('performance')" style="flex: 1.2;">
                  <i class="fa-solid ${docs.performance?.signed ? 'fa-rotate' : 'fa-upload'}"></i> ${docs.performance?.signed ? 'إعادة رفع' : 'رفع موقعاً'}
                </button>
              </div>
            </div>

            <!-- 4. نموذج طلب الانضمام موقعاً -->
            <div class="contract-doc-card ${docs.application?.signed ? 'signed' : ''}">
              <div>
                <div class="doc-card-top">
                  <div class="doc-card-icon" style="background: rgba(16,185,129,0.12); color: #047857;"><i class="fa-solid fa-file-lines"></i></div>
                  <div class="doc-card-meta">
                    <h4>4. نموذج طلب الانضمام</h4>
                    <span>كود الوثيقة: ATHQ-APP-04 • النسخة الإدارية الرسمية</span>
                  </div>
                </div>
                <p style="font-size: 0.8rem; color: var(--c-text-muted); line-height: 1.6; margin: 0 0 10px 0;">
                  النموذج الرسمي المعتمد من الإدارة مشتملاً على بيانات الكيان والشروط العامة وتوقيع الاعتماد.
                </p>
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
                  <span style="font-size: 0.75rem; color: var(--c-text-muted);">الحالة:</span>
                  <span class="badge" style="background: ${docs.application?.signed ? '#D1FAE5' : '#FEF3C7'}; color: ${docs.application?.signed ? '#047857' : '#92400E'}; font-weight: 800; font-size: 0.75rem;">
                    ${docs.application?.signed ? '<i class="fa-solid fa-check-double"></i> موقع ومختوم ✓' : '<i class="fa-solid fa-clock"></i> في انتظار التوقيع والرفع'}
                  </span>
                </div>
              </div>
              <div class="doc-card-actions">
                <button class="btn btn-outline btn-sm" onclick="downloadAdminIssuedDoc('application')" style="flex: 1;">
                  <i class="fa-solid fa-download"></i> تحميل
                </button>
                <button class="btn btn-outline-primary btn-sm" onclick="previewAdminIssuedDoc('application')" style="flex: 1;">
                  <i class="fa-solid fa-eye"></i> معاينة
                </button>
                <button class="btn ${docs.application?.signed ? 'btn-outline-primary' : 'btn-primary'} btn-sm" onclick="toggleSignAdminDoc('application')" style="flex: 1.2;">
                  <i class="fa-solid ${docs.application?.signed ? 'fa-rotate' : 'fa-upload'}"></i> ${docs.application?.signed ? 'إعادة رفع' : 'رفع موقعاً'}
                </button>
              </div>
            </div>
          </div>

          <div style="margin-top: 22px; display: flex; justify-content: space-between; align-items: center; background: #F8FAFC; border-radius: 14px; padding: 14px 20px; border: 1px solid var(--c-border); flex-wrap: wrap; gap: 10px;">
            <div style="font-size: 0.85rem; color: var(--c-primary); font-weight: 700;">
              ${allDocsSigned ? '<i class="fa-solid fa-check-circle" style="color: #10B981;"></i> تم توقيع واعتماد كافة المستندات الـ 4 بنجاح ✓' : '<i class="fa-solid fa-clock"></i> يرجى استكمال توقيع ورفع الوثائق الأربع لتفعيل المقر والخدمات.'}
            </div>
            <button class="btn btn-primary btn-sm" onclick="switchPrompt3Tab(null, 'p3-tab-handover')">
              الانتقال لقسم استلام المقر وتفعيل الخدمات (Checklist) <i class="fa-solid fa-arrow-left"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Tab 2: قسم استلام المقر وتفعيل الخدمات -->
      <div id="p3-tab-handover" class="prompt3-tab-pane ${currentPrompt3ActiveTab === 'p3-tab-handover' ? 'active' : ''}">
        <div class="office-handover-panel">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; margin-bottom: 6px;">
            <div>
              <strong style="font-size: 1.05rem; color: var(--c-primary); display: flex; align-items: center; gap: 8px;">
                <i class="fa-solid fa-list-check"></i> قائمة مهام (Checklist) لإجراءات تسليم المقر المكتبي:
              </strong>
              <p style="font-size: 0.82rem; color: var(--c-text-muted); margin: 3px 0 0 0;">
                المقر المخصص: <strong>مكتب مجهز رقم 4 (مبنى عذق - الدور الأول)</strong> • انقر على أي بند للتحديث
              </p>
            </div>
            <button class="btn btn-outline-primary btn-sm" onclick="completeAllHandoverQuick()">
              <i class="fa-solid fa-check-double"></i> إتمام واستلام جميع البنود (سريع)
            </button>
          </div>

          <div class="handover-grid">
            <!-- 1. نموذج استلام المفاتيح والعهد -->
            <div class="handover-card ${handover.keys_assets?.completed ? 'completed' : ''}">
              <div>
                <div class="handover-card-header">
                  <h4><i class="fa-solid fa-key" style="color: var(--c-gold-dark);"></i> 1. المفاتيح والعهد</h4>
                  <span class="badge" style="background: ${handover.keys_assets?.completed ? '#D1FAE5' : '#FEF3C7'}; color: ${handover.keys_assets?.completed ? '#047857' : '#92400E'}; font-weight: 800; font-size: 0.75rem;">
                    ${handover.keys_assets?.completed ? 'تم التسليم والاعتماد ✓' : 'قيد التجهيز'}
                  </span>
                </div>
                <div class="handover-details-box">
                  <strong>العهدة:</strong> طقم مفاتيح مبرمجة، بطاقة خزنة، شاشة تفاعلية، مكتب تنفيذي متكامل.<br>
                  <small style="color: var(--c-text-muted);"><i class="fa-regular fa-calendar"></i> تاريخ التسليم: ${handover.keys_assets?.date || '2025-08-25'}</small>
                </div>
              </div>
              <button class="btn ${handover.keys_assets?.completed ? 'btn-outline-primary' : 'btn-primary'} btn-sm" onclick="toggleHandoverItem('keys_assets')">
                <i class="fa-solid ${handover.keys_assets?.completed ? 'fa-circle-check' : 'fa-hand-holding'}"></i> ${handover.keys_assets?.completed ? 'تم استلام المفتاح والعهد ✓' : 'تأكيد استلام المفاتيح والعهد'}
              </button>
            </div>

            <!-- 2. حالة طباعة الكروت -->
            <div class="handover-card ${handover.cards_printing?.completed ? 'completed' : ''}">
              <div>
                <div class="handover-card-header">
                  <h4><i class="fa-solid fa-address-card" style="color: #2563EB;"></i> 2. طباعة الكروت الذكية</h4>
                  <span class="badge" style="background: ${handover.cards_printing?.completed ? '#D1FAE5' : '#FEF3C7'}; color: ${handover.cards_printing?.completed ? '#047857' : '#92400E'}; font-weight: 800; font-size: 0.75rem;">
                    ${handover.cards_printing?.completed ? 'تمت الطباعة والبرمجة ✓' : 'قيد الطباعة'}
                  </span>
                </div>
                <div class="handover-details-box">
                  <strong>الكروت:</strong> 4 كروت دخول ذكية مبرمجة بالبصمة وNFC لكادر الجمعية والمدير التنفيذي.<br>
                  <small style="color: var(--c-text-muted);"><i class="fa-solid fa-fingerprint"></i> مرتبطة بنظام الدخول الذكي للحاضنة</small>
                </div>
              </div>
              <button class="btn ${handover.cards_printing?.completed ? 'btn-outline-primary' : 'btn-primary'} btn-sm" onclick="toggleHandoverItem('cards_printing')">
                <i class="fa-solid ${handover.cards_printing?.completed ? 'fa-circle-check' : 'fa-id-badge'}"></i> ${handover.cards_printing?.completed ? 'تمت طباعة الكروت واستلامها ✓' : 'تأكيد جاهزية طباعة الكروت'}
              </button>
            </div>

            <!-- 3. تسمية الباب -->
            <div class="handover-card ${handover.door_naming?.completed ? 'completed' : ''}">
              <div>
                <div class="handover-card-header">
                  <h4><i class="fa-solid fa-door-closed" style="color: var(--c-primary);"></i> 3. تسمية الباب</h4>
                  <span class="badge" style="background: ${handover.door_naming?.completed ? '#D1FAE5' : '#FEF3C7'}; color: ${handover.door_naming?.completed ? '#047857' : '#92400E'}; font-weight: 800; font-size: 0.75rem;">
                    ${handover.door_naming?.completed ? 'تم التركيب والاعتماد ✓' : 'قيد التصنيع'}
                  </span>
                </div>
                <div class="handover-details-box">
                  <strong>اللوحة:</strong> لوحة الباب الرقمية الرسمية: "جمعية ديوان الشبابية - مكتب 104".<br>
                  <small style="color: var(--c-text-muted);"><i class="fa-solid fa-location-dot"></i> المدخل الشرقي - الدور الأول</small>
                </div>
              </div>
              <button class="btn ${handover.door_naming?.completed ? 'btn-outline-primary' : 'btn-primary'} btn-sm" onclick="toggleHandoverItem('door_naming')">
                <i class="fa-solid ${handover.door_naming?.completed ? 'fa-circle-check' : 'fa-tag'}"></i> ${handover.door_naming?.completed ? 'تم تثبيت تسمية الباب ✓' : 'تأكيد تثبيت تسمية الباب'}
              </button>
            </div>

            <!-- 4. طباعة لوحات الجمعية -->
            <div class="handover-card ${handover.association_boards?.completed ? 'completed' : ''}">
              <div>
                <div class="handover-card-header">
                  <h4><i class="fa-solid fa-sign-hanging" style="color: var(--c-gold-dark);"></i> 4. لوحات الجمعية</h4>
                  <span class="badge" style="background: ${handover.association_boards?.completed ? '#D1FAE5' : '#FEF3C7'}; color: ${handover.association_boards?.completed ? '#047857' : '#92400E'}; font-weight: 800; font-size: 0.75rem;">
                    ${handover.association_boards?.completed ? 'تمت الطباعة والتعليق ✓' : 'قيد التجهيز'}
                  </span>
                </div>
                <div class="handover-details-box">
                  <strong>اللوحة:</strong> لوحة جدارية أكريليك فاخرة بشعار الجمعية وهوية عذق معلقة في بهو الحاضنة.<br>
                  <small style="color: var(--c-text-muted);"><i class="fa-solid fa-palette"></i> مقاس 120×80 سم مع إضاءة خفية</small>
                </div>
              </div>
              <button class="btn ${handover.association_boards?.completed ? 'btn-outline-primary' : 'btn-primary'} btn-sm" onclick="toggleHandoverItem('association_boards')">
                <i class="fa-solid ${handover.association_boards?.completed ? 'fa-circle-check' : 'fa-brush'}"></i> ${handover.association_boards?.completed ? 'تم تعليق اللوحات بالبهو ✓' : 'تأكيد طباعة وتعليق اللوحات'}
              </button>
            </div>
          </div>

          <!-- Permanent Services Activation Card -->
          <div class="permanent-services-banner">
            <div class="permanent-services-meta">
              <div class="permanent-services-icon"><i class="fa-solid fa-circle-nodes"></i></div>
              <div>
                <h4 style="font-size: 1.1rem; font-weight: 900; color: var(--c-primary); margin: 0 0 4px 0;">
                  تفعيل أزرار الخدمات الدائمة في لوحة التحكم (مفعلة رسمياً 24/7)
                </h4>
                <p style="font-size: 0.82rem; color: var(--c-text); margin: 0; line-height: 1.6;">
                  بموجب توثيق العقود واستلام المقر، أصبحت كافة خدمات الحاضنة المشتركة متاحة لجمعيتكم بشكل دائم:
                </p>
              </div>
            </div>
            <div class="permanent-services-actions">
              <button class="btn btn-primary" onclick="openFacilityBookingModal()" style="font-weight: 800; padding: 10px 20px;">
                <i class="fa-solid fa-calendar-plus"></i> حجز قاعة ومرفق
              </button>
              <button class="btn btn-gold" onclick="openBookConsultantModal()" style="font-weight: 800; padding: 10px 20px;">
                <i class="fa-solid fa-headset"></i> طلب استشارة تخصصية
              </button>
              <button class="btn btn-outline-primary" onclick="switchPrompt3Tab(null, 'p3-tab-stages')">
                الانتقال لمتتبع المراحل الأربع <i class="fa-solid fa-arrow-left"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab 3: متتبع رحلة الاحتضان (4 مراحل متكاملة - Stepper / Progress Tracker) -->
      <div id="p3-tab-stages" class="prompt3-tab-pane ${currentPrompt3ActiveTab === 'p3-tab-stages' ? 'active' : ''}">
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; margin-bottom: 8px;">
            <div>
              <strong style="font-size: 1.1rem; color: var(--c-primary); display: flex; align-items: center; gap: 8px;">
                <i class="fa-solid fa-bars-progress"></i> متتبع رحلة الاحتضان (4 مراحل متتالية لا تفتح المرحلة إلا بعد إتمام التي قبلها):
              </strong>
              <p style="font-size: 0.82rem; color: var(--c-text-muted); margin: 3px 0 0 0;">
                المرحلة 1: استبيان الفكرة • المرحلة 2: الهوية المؤسسية • المرحلة 3: الاحتضان المكتبي • المرحلة 4: مخرجات عذق
              </p>
            </div>
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              <button class="btn btn-outline-primary btn-sm" onclick="saveProgressAndExit()">
                <i class="fa-solid fa-floppy-disk"></i> حفظ التقدم والخروج المؤقت
              </button>
            </div>
          </div>

          <div class="stages-tracker-grid">
            <!-- Stage 1: استبيان الفكرة -->
            <div class="stage-tracker-card ${stages.stage1?.completed ? 'completed' : 'active'}">
              <div>
                <div class="stage-card-header">
                  <span class="stage-num-badge">المرحلة 1</span>
                  <span class="badge" style="background: #D1FAE5; color: #047857; font-size: 0.75rem; font-weight: 800;">
                    ${stages.stage1?.completed ? 'مكتملة 100% ✓' : 'قيد التنفيذ'}
                  </span>
                </div>
                <h4 style="font-size: 1.05rem; font-weight: 900; color: var(--c-primary); margin: 0 0 6px 0;">
                  المرحلة 1: استبيان الفكرة
                </h4>
                <div class="stage-progress-bar-wrap">
                  <div class="stage-progress-bar-fill" style="width: ${stages.stage1?.progress || 100}%;"></div>
                </div>
                <ul class="stage-card-tasks">
                  <li class="done"><i class="fa-solid fa-circle-check"></i> تعبئة استبيان الفكرة والاحتياج المجتمعي</li>
                  <li class="done"><i class="fa-solid fa-circle-check"></i> تحديد الفئات المستهدفة والنطاق بالمدينة</li>
                  <li class="done"><i class="fa-solid fa-circle-check"></i> صياغة ميثاق التأسيس والأهداف الاستراتيجية</li>
                </ul>
              </div>
              <button class="btn btn-outline-primary btn-sm" onclick="completeIncubationStage(1)">
                <i class="fa-solid fa-check-double"></i> ${stages.stage1?.completed ? 'مكتملة رسمياً ✓' : 'إكمال المرحلة 1'}
              </button>
            </div>

            <!-- Stage 2: الهوية المؤسسية (الاحتضان الأولي) -->
            <div class="stage-tracker-card ${stages.stage2?.completed ? 'completed' : (stages.stage1?.completed ? 'active' : 'locked')}">
              <div>
                <div class="stage-card-header">
                  <span class="stage-num-badge">المرحلة 2</span>
                  <span class="badge" style="background: ${stages.stage2?.completed ? '#D1FAE5' : (stages.stage1?.completed ? '#FEF3C7' : '#F1F5F9')}; color: ${stages.stage2?.completed ? '#047857' : (stages.stage1?.completed ? '#92400E' : '#64748B')}; font-size: 0.75rem; font-weight: 800;">
                    ${stages.stage2?.completed ? 'مكتملة 100% ✓' : (stages.stage1?.completed ? 'المرحلة الحالية' : '🔒 مقفلة')}
                  </span>
                </div>
                <h4 style="font-size: 1.05rem; font-weight: 900; color: var(--c-primary); margin: 0 0 6px 0;">
                  المرحلة 2: الهوية المؤسسية (الاحتضان الأولي)
                </h4>
                <div class="stage-progress-bar-wrap">
                  <div class="stage-progress-bar-fill" style="width: ${stages.stage2?.progress || 100}%;"></div>
                </div>
                <ul class="stage-card-tasks">
                  <li class="${stages.stage2?.completed ? 'done' : 'pending'}"><i class="fa-solid ${stages.stage2?.completed ? 'fa-circle-check' : 'fa-circle-dot'}"></i> إصدار الرقم الوطني الموحد 700</li>
                  <li class="${stages.stage2?.completed ? 'done' : 'pending'}"><i class="fa-solid ${stages.stage2?.completed ? 'fa-circle-check' : 'fa-circle-dot'}"></i> اعتماد اللائحة الأساسية لدى NCNP</li>
                  <li class="${stages.stage2?.completed ? 'done' : 'pending'}"><i class="fa-solid ${stages.stage2?.completed ? 'fa-circle-check' : 'fa-circle-dot'}"></i> تصميم الهوية البصرية وتدشين الموقع</li>
                </ul>
              </div>
              <button class="btn ${stages.stage2?.completed ? 'btn-outline-primary' : 'btn-primary'} btn-sm" onclick="completeIncubationStage(2)" ${!stages.stage1?.completed ? 'disabled' : ''}>
                <i class="fa-solid ${stages.stage2?.completed ? 'fa-check' : 'fa-arrow-left'}"></i> ${stages.stage2?.completed ? 'مكتملة رسمياً ✓' : 'إكمال المرحلة 2'}
              </button>
            </div>

            <!-- Stage 3: الاحتضان المكتبي -->
            <div class="stage-tracker-card ${stages.stage3?.completed ? 'completed' : (stages.stage2?.completed ? 'active' : 'locked')}">
              <div>
                <div class="stage-card-header">
                  <span class="stage-num-badge">المرحلة 3</span>
                  <span class="badge" style="background: ${stages.stage3?.completed ? '#D1FAE5' : (stages.stage2?.completed ? '#FEF3C7' : '#F1F5F9')}; color: ${stages.stage3?.completed ? '#047857' : (stages.stage2?.completed ? '#92400E' : '#64748B')}; font-size: 0.75rem; font-weight: 800;">
                    ${stages.stage3?.completed ? 'مكتملة 100% ✓' : (stages.stage2?.completed ? 'قيد التنفيذ (75%)' : '🔒 مقفلة')}
                  </span>
                </div>
                <h4 style="font-size: 1.05rem; font-weight: 900; color: var(--c-primary); margin: 0 0 6px 0;">
                  المرحلة 3: الاحتضان المكتبي
                </h4>
                <div class="stage-progress-bar-wrap">
                  <div class="stage-progress-bar-fill" style="width: ${stages.stage3?.progress || 75}%;"></div>
                </div>
                <ul class="stage-card-tasks">
                  <li class="done"><i class="fa-solid fa-circle-check"></i> استلام المقر المكتبي والبصمة الذكية</li>
                  <li class="done"><i class="fa-solid fa-circle-check"></i> مباشرة الكادر الوظيفي والدوام اليومي</li>
                  <li class="${stages.stage3?.completed ? 'done' : 'pending'}"><i class="fa-solid ${stages.stage3?.completed ? 'fa-circle-check' : 'fa-circle-dot'}"></i> ربط وتفعيل النظام المحاسبي السحابي</li>
                </ul>
              </div>
              <button class="btn ${stages.stage3?.completed ? 'btn-outline-primary' : 'btn-primary'} btn-sm" onclick="completeIncubationStage(3)" ${!stages.stage2?.completed ? 'disabled' : ''}>
                <i class="fa-solid ${stages.stage3?.completed ? 'fa-check' : 'fa-arrow-left'}"></i> ${stages.stage3?.completed ? 'مكتملة رسمياً ✓' : 'إكمال المرحلة 3'}
              </button>
            </div>

            <!-- Stage 4: مخرجات عذق -->
            <div class="stage-tracker-card ${stages.stage4?.completed ? 'completed' : (stages.stage3?.completed ? 'active' : 'locked')}">
              <div>
                <div class="stage-card-header">
                  <span class="stage-num-badge">المرحلة 4</span>
                  <span class="badge" style="background: ${stages.stage4?.completed ? '#D1FAE5' : (stages.stage3?.completed ? '#FEF3C7' : '#F1F5F9')}; color: ${stages.stage4?.completed ? '#047857' : (stages.stage3?.completed ? '#92400E' : '#64748B')}; font-size: 0.75rem; font-weight: 800;">
                    ${stages.stage4?.completed ? 'مكتملة 100% ✓' : (stages.stage3?.completed ? 'المرحلة النهائية' : '🔒 مقفلة')}
                  </span>
                </div>
                <h4 style="font-size: 1.05rem; font-weight: 900; color: var(--c-primary); margin: 0 0 6px 0;">
                  المرحلة 4: مخرجات عذق
                </h4>
                <div class="stage-progress-bar-wrap">
                  <div class="stage-progress-bar-fill" style="width: ${stages.stage4?.progress || 0}%;"></div>
                </div>
                <ul class="stage-card-tasks">
                  <li class="${stages.stage4?.completed ? 'done' : 'pending'}"><i class="fa-solid ${stages.stage4?.completed ? 'fa-circle-check' : 'fa-circle-dot'}"></i> إتمام حزم الحوكمة ومصفوفة الصلاحيات</li>
                  <li class="${stages.stage4?.completed ? 'done' : 'pending'}"><i class="fa-solid ${stages.stage4?.completed ? 'fa-circle-check' : 'fa-circle-dot'}"></i> إعداد الخطة التشغيلية والموازنة التقديرية</li>
                  <li class="${stages.stage4?.completed ? 'done' : 'pending'}"><i class="fa-solid ${stages.stage4?.completed ? 'fa-circle-check' : 'fa-circle-dot'}"></i> مخرجات مسرعة عذق والربط مع المانحين</li>
                </ul>
              </div>
              <button class="btn ${stages.stage4?.completed ? 'btn-outline-primary' : 'btn-gold'} btn-sm" onclick="completeIncubationStage(4)" ${!stages.stage3?.completed ? 'disabled' : ''}>
                <i class="fa-solid ${stages.stage4?.completed ? 'fa-graduation-cap' : 'fa-flag-checkered'}"></i> ${stages.stage4?.completed ? 'مكتملة والتخرج معتمد ✓' : 'إكمال المرحلة 4 والتخرج'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab 4: مرحلة التخرج والتمكين (إحالة الطلبات للمنح المؤسسية ومتابعة التقارير) -->
      <div id="p3-tab-graduation" class="prompt3-tab-pane ${currentPrompt3ActiveTab === 'p3-tab-graduation' ? 'active' : ''}">
        <div class="graduation-showcase-panel">
          <div class="graduation-top-banner">
            <div class="graduation-seal-box">
              <div class="graduation-medal-icon"><i class="fa-solid fa-graduation-cap"></i></div>
              <div>
                <span style="background: rgba(255,255,255,0.22); color: #FFFFFF; padding: 3px 12px; border-radius: 20px; font-size: 0.78rem; font-weight: 800; display: inline-block; margin-bottom: 6px;">
                  تمكين وتخرج المنظمات الأهلية (100% اكتمال)
                </span>
                <h3 style="font-size: 1.45rem; font-weight: 900; color: #FFFFFF; margin: 0 0 4px 0;">
                  جمعية متخرجة ومستدامة - وسام التميز المؤسسي لحاضنة عذق
                </h3>
                <p style="font-size: 0.85rem; color: rgba(255,255,255,0.85); margin: 0;">
                  أتمت الجمعية المراحل الأربع للاحتضان بنجاح بنسبة 100% وأصبحت مؤهلة رسمياً للمنح الكبرى والاستدامة الذاتية.
                </p>
              </div>
            </div>

            <div style="display: flex; gap: 8px;">
              <button class="btn btn-gold btn-sm" onclick="downloadGraduationReport()">
                <i class="fa-solid fa-award"></i> تحميل شهادة التخرج وتقرير الأثر (PDF)
              </button>
            </div>
          </div>

          <!-- Section: إحالة الطلبات للمنح المؤسسية ومتابعة التقارير -->
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 10px;">
              <div>
                <h4 style="font-size: 1.1rem; font-weight: 900; color: var(--c-gold-light); margin: 0 0 3px 0; display: flex; align-items: center; gap: 8px;">
                  <i class="fa-solid fa-hand-holding-dollar"></i> إحالة الطلبات للمنح المؤسسية ومتابعة التقارير:
                </h4>
                <p style="font-size: 0.8rem; color: rgba(255,255,255,0.8); margin: 0;">
                  بإمكان الجمعية المتخرجة إحالة ملفها المعتمد والمزكى من عذق مباشرة إلى الشركاء المانحين للحصول على تمويل المشاريع:
                </p>
              </div>
            </div>

            <div class="grants-referral-grid">
              <!-- Grant 1: أوقاف الراجحي -->
              <div class="grant-card">
                <div>
                  <span class="grant-amount-pill"><i class="fa-solid fa-sack-dollar"></i> تمويل حتى 500,000 ريال</span>
                  <h4 style="font-size: 1.05rem; font-weight: 800; color: #FFFFFF; margin: 0 0 6px 0;">
                    منحة أوقاف الراجحي للاستدامة المؤسسية
                  </h4>
                  <p style="font-size: 0.8rem; color: rgba(255,255,255,0.8); line-height: 1.6; margin: 0 0 12px 0;">
                    مسار مخصص لتمويل البرامج التشغيلية والمحافظ الاستثمارية للجمعيات الأهلية المتخرجة من حاضنات الأعمال المعتمدة.
                  </p>
                </div>
                <button class="btn btn-gold btn-sm" onclick="openGrantReferralModal('منحة أوقاف الراجحي للاستدامة المؤسسية')" style="font-weight: 800;">
                  <i class="fa-solid fa-paper-plane"></i> إحالة وتزكية الطلب للمانح
                </button>
              </div>

              <!-- Grant 2: مؤسسة السبيعي -->
              <div class="grant-card">
                <div>
                  <span class="grant-amount-pill"><i class="fa-solid fa-coins"></i> تمويل حتى 300,000 ريال</span>
                  <h4 style="font-size: 1.05rem; font-weight: 800; color: #FFFFFF; margin: 0 0 6px 0;">
                    منحة مؤسسة السبيعي الخيرية لتمكين المبادرات
                  </h4>
                  <p style="font-size: 0.8rem; color: rgba(255,255,255,0.8); line-height: 1.6; margin: 0 0 12px 0;">
                    دعم تطوير القيادات الشابة والمشاريع التنموية ذات الأثر المستدام والمتوافقة مع مؤشرات الحوكمة NCNP.
                  </p>
                </div>
                <button class="btn btn-gold btn-sm" onclick="openGrantReferralModal('منحة مؤسسة السبيعي الخيرية لتمكين المبادرات')" style="font-weight: 800;">
                  <i class="fa-solid fa-paper-plane"></i> إحالة وتزكية الطلب للمانح
                </button>
              </div>

              <!-- Grant 3: صندوق الاستدامة -->
              <div class="grant-card">
                <div>
                  <span class="grant-amount-pill"><i class="fa-solid fa-vault"></i> تمويل وتسهيلات تنموية</span>
                  <h4 style="font-size: 1.05rem; font-weight: 800; color: #FFFFFF; margin: 0 0 6px 0;">
                    صندوق تمكين والاستدامة المالية (NCNP)
                  </h4>
                  <p style="font-size: 0.8rem; color: rgba(255,255,255,0.8); line-height: 1.6; margin: 0 0 12px 0;">
                    قروض حسنة ومنح للمشاريع الاستثمارية الوقفية لضمان استدامة موارد الجمعية ومقراتها بعد فترة الاحتضان.
                  </p>
                </div>
                <button class="btn btn-gold btn-sm" onclick="openGrantReferralModal('صندوق تمكين والاستدامة المالية (NCNP)')" style="font-weight: 800;">
                  <i class="fa-solid fa-paper-plane"></i> إحالة وتزكية الطلب للمانح
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

window.jumpToPrompt3Section = function(tabId) {
  const assoc = getActiveAssociation();
  if (!assoc) return;
  if (assoc.stateMachineState !== 'state4_passed') {
    setAppStateMachineState('state4_passed');
  }
  const tabBtn = document.querySelector(`.prompt3-tab-btn[onclick*="${tabId}"]`);
  switchPrompt3Tab(tabBtn, tabId);
  showToast(`تم الانتقال إلى: ${tabId.includes('docs') ? '1. الشواهد والوثائق الـ 4' : (tabId.includes('handover') ? '2. تسليم المقر والخدمات' : (tabId.includes('stages') ? '3. متتبع المراحل الأربع' : '4. التخرج وإحالة المنح'))}`, 'info');
};

window.switchPrompt3Tab = function(btn, paneId) {
  currentPrompt3ActiveTab = paneId;
  document.querySelectorAll('.prompt3-tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.prompt3-tab-pane').forEach(p => p.classList.remove('active'));
  if (btn) {
    btn.classList.add('active');
  } else {
    const matchingBtn = document.querySelector(`.prompt3-tab-btn[onclick*="${paneId}"]`);
    if (matchingBtn) matchingBtn.classList.add('active');
  }
  const pane = document.getElementById(paneId);
  if (pane) pane.classList.add('active');
};

// ========================== Prompt 3: Part 1 - Evidences & 4 Admin Documents ==========================
window.uploadRequiredEvidences = function() {
  const assoc = getActiveAssociation();
  if (!assoc) return;

  assoc.requiredEvidencesUploaded = true;
  savePlatformState();
  renderAssociationDashboard();
  showToast('تم رفع الشواهد المطلوبة بنجاح ✓ - صدرت الآن الوثائق الرسمية الـ 4 من إدارة الحاضنة!', 'success');
};

window.downloadAdminIssuedDoc = function(docKey) {
  const assoc = getActiveAssociation();
  const docs = assoc?.signedAdminDocs || {};
  const doc = docs[docKey] || { title: 'مستند رسمي' };
  showToast(`جاري تنزيل النسخة الرسمية الصادرة من الإدارة: "${doc.title}.pdf"`, 'info');
};

window.previewAdminIssuedDoc = function(docKey) {
  currentPreviewDocKey = docKey;
  const assoc = getActiveAssociation();
  const docs = assoc?.signedAdminDocs || {};
  const doc = docs[docKey] || { title: 'مستند رسمي', code: 'ATHQ-DOC-01' };

  const modal = document.getElementById('modalAdminDocPreview');
  if (!modal) return;

  const titleEl = document.getElementById('admin-doc-modal-title');
  const subEl = document.getElementById('admin-doc-modal-sub');
  const contentEl = document.getElementById('admin-doc-modal-content');

  if (titleEl) titleEl.textContent = doc.title;
  if (subEl) subEl.textContent = `كود الوثيقة: ${doc.code} • الجمعية: ${assoc.associationName}`;

  let docBodyHtml = '';
  if (docKey === 'contract') {
    docBodyHtml = `
      <div style="border: 2px solid var(--c-primary); border-radius: 12px; padding: 22px; background: #FFFFFF;">
        <div style="text-align: center; border-bottom: 2px solid var(--c-primary); padding-bottom: 12px; margin-bottom: 16px;">
          <h4 style="font-size: 1.15rem; color: var(--c-primary); font-weight: 900; margin: 0;">عقد احتضان وشراكة مؤسسية</h4>
          <span style="font-size: 0.8rem; color: var(--c-text-muted);">حاضنة ومسرعة عذق • جمعية البر بالمدينة المنورة • ترخيص 22</span>
        </div>
        <p style="font-size: 0.86rem; line-height: 1.8; color: var(--c-text);">
          إنه في يوم الأحد بتاريخ 15/08/2025م، تم الاتفاق بين:
          <br><strong>الطرف الأول:</strong> حاضنة ومسرعة عذق (جمعية البر بالمدينة المنورة).
          <br><strong>الطرف الثاني:</strong> ${assoc.associationName} (ترخيص رقم: ${assoc.licenseNumber}).
          <br><br>
          <strong>البند الأول (المقر والخدمات):</strong> يلتزم الطرف الأول بتوفير مكتب مجهز رقم 4 بمقر الحاضنة، وقاعات الاجتماعات، والاستشارات التخصصية.
          <br><strong>البند الثاني (الالتزام والدوام):</strong> يلتزم الطرف الثاني بتواجد موظف متفرغ بدوام يومي واستكمال مؤشرات الحوكمة.
          <br><strong>البند الثالث (المدة):</strong> مدة العقد 24 شهراً قابلة للتجديد بموجب تقارير الأداء الدوري.
        </p>
        <div style="display: flex; justify-content: space-between; margin-top: 20px; border-top: 1px dashed var(--c-border); padding-top: 14px; font-size: 0.85rem;">
          <div><strong>الطرف الأول:</strong> إدارة حاضنة عذق (موقّع ومختوم ✓)</div>
          <div><strong>الطرف الثاني:</strong> ${assoc.repName} (المفوض الرسمي)</div>
        </div>
      </div>
    `;
  } else if (docKey === 'governorate') {
    docBodyHtml = `
      <div style="border: 2px solid var(--c-gold); border-radius: 12px; padding: 22px; background: #FFFFFF;">
        <div style="text-align: center; border-bottom: 2px solid var(--c-gold); padding-bottom: 12px; margin-bottom: 16px;">
          <h4 style="font-size: 1.15rem; color: var(--c-gold-dark); font-weight: 900; margin: 0;">تقرير المحافظة (الاستيفاء ونطاق الخدمة الميدانية)</h4>
          <span style="font-size: 0.8rem; color: var(--c-text-muted);">إمارة منطقة المدينة المنورة • المركز الوطني لتنمية القطاع غير الربحي</span>
        </div>
        <p style="font-size: 0.86rem; line-height: 1.8; color: var(--c-text);">
          بناءً على الجولات الميدانية والتحقق من النطاق الجغرافي لجمعية <strong>"${assoc.associationName}"</strong>:
          <br>1. ثبت استيفاء شروط العمل داخل النطاق الجغرافي لمنطقة المدينة المنورة.
          <br>2. توافق أهداف الجمعية مع أولويات التنمية الاجتماعية ورؤية المملكة 2030 بنسبة مطابقة 94%.
          <br>3. تمت التوصية باستحقاق الجمعية لكافة حزم الدعم المكاني والتأسيسي المقدمة من حاضنة ومسرعة عذق.
        </p>
        <div style="margin-top: 18px; border-top: 1px dashed var(--c-border); padding-top: 12px; display: flex; justify-content: space-between; font-size: 0.82rem; color: var(--c-text-muted);">
          <span>رمز التحقق: NCNP-MED-GOV-984</span>
          <span>معتمد رسمياً ✓</span>
        </div>
      </div>
    `;
  } else if (docKey === 'performance') {
    docBodyHtml = `
      <div style="border: 2px solid #2563EB; border-radius: 12px; padding: 22px; background: #FFFFFF;">
        <div style="text-align: center; border-bottom: 2px solid #2563EB; padding-bottom: 12px; margin-bottom: 16px;">
          <h4 style="font-size: 1.15rem; color: #2563EB; font-weight: 900; margin: 0;">خطاب تقييم الأداء المؤسسي والتأهيل</h4>
          <span style="font-size: 0.8rem; color: var(--c-text-muted);">لجنة الفرز والتقييم • حاضنة ومسرعة عذق</span>
        </div>
        <p style="font-size: 0.86rem; line-height: 1.8; color: var(--c-text);">
          نفيدكم باجتياز جمعية <strong>"${assoc.associationName}"</strong> لاختبار الانطلاقة الأولى بنتيجة <strong>(${assoc.examScore || 92} من 100)</strong>، وتجاوز شرط الـ 65 درجة بنجاح.
          <br><br>
          <strong>توصيات لجنة التقييم:</strong>
          <br>• أهلية الجمعية الكاملة لمسار الاحتضان المكتبي بمقر الحاضنة.
          <br>• استيفاء شرط تواجد موظف متفرغ للدوام اليومي.
          <br>• إدراج الجمعية ضمن خطة التدريب الاستشاري لرفع درجة الحوكمة للنطاق الأخضر المرتفع.
        </p>
        <div style="margin-top: 18px; border-top: 1px dashed var(--c-border); padding-top: 12px; display: flex; justify-content: space-between; font-size: 0.82rem;">
          <span style="color: var(--c-text-muted);">رئيس لجنة التقييم: د. سليمان الحربي</span>
          <span class="badge" style="background: #D1FAE5; color: #047857; font-weight: 800;">تأهل رسمي معتمد ✓</span>
        </div>
      </div>
    `;
  } else if (docKey === 'application') {
    docBodyHtml = `
      <div style="border: 2px solid #10B981; border-radius: 12px; padding: 22px; background: #FFFFFF;">
        <div style="text-align: center; border-bottom: 2px solid #10B981; padding-bottom: 12px; margin-bottom: 16px;">
          <h4 style="font-size: 1.15rem; color: #047857; font-weight: 900; margin: 0;">نموذج طلب الانضمام المعتمد الصادر من الإدارة</h4>
          <span style="font-size: 0.8rem; color: var(--c-text-muted);">وحدة القبول والتسجيل • حاضنة عذق للجمعيات الأهلية</span>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 0.84rem; margin-bottom: 14px;">
          <div><strong>اسم الكيان:</strong> ${assoc.associationName}</div>
          <div><strong>رقم الترخيص:</strong> ${assoc.licenseNumber}</div>
          <div><strong>المفوض بالطلب:</strong> ${assoc.repName}</div>
          <div><strong>رقم الجوال:</strong> ${assoc.repPhone}</div>
          <div><strong>مسار الدعم:</strong> ${assoc.track}</div>
          <div><strong>نوع الاحتضان:</strong> ${assoc.incubationType}</div>
        </div>
        <p style="font-size: 0.82rem; color: var(--c-text-muted); line-height: 1.6; margin: 0; background: #F8FAFC; padding: 10px; border-radius: 8px;">
          تمت مطابقة البيانات ومرفقات التسجيل الثلاثة (جواب الالتحاق، الترخيص، ونموذج الطلب) واعتمادها رسمياً من الإدارة العامة.
        </p>
        <div style="margin-top: 16px; border-top: 1px dashed var(--c-border); padding-top: 12px; display: flex; justify-content: space-between; align-items: center;">
          <span style="font-size: 0.8rem; color: var(--c-text-muted);">الختم الرقمي: ATHQ-SEAL-VERIFIED</span>
          <span class="badge" style="background: #D1FAE5; color: #047857; font-weight: 800;">مكتمل وموقّع ✓</span>
        </div>
      </div>
    `;
  }

  if (contentEl) contentEl.innerHTML = docBodyHtml;
  modal.classList.add('active');
};

window.closeAdminDocPreviewModal = function() {
  document.getElementById('modalAdminDocPreview')?.classList.remove('active');
};

window.signCurrentPreviewDoc = function() {
  toggleSignAdminDoc(currentPreviewDocKey);
  closeAdminDocPreviewModal();
};

window.toggleSignAdminDoc = function(docKey) {
  const assoc = getActiveAssociation();
  if (!assoc || !assoc.signedAdminDocs) return;

  const doc = assoc.signedAdminDocs[docKey];
  if (!doc) return;

  doc.signed = !doc.signed;
  savePlatformState();
  renderAssociationDashboard();
  showToast(doc.signed ? `تم توقيع ورفع "${doc.title}" بنجاح ✓` : `تم إلغاء حالة التوقيع لـ "${doc.title}"`, 'success');
};

window.signAllAdminDocsQuick = function() {
  const assoc = getActiveAssociation();
  if (!assoc) return;
  initPrompt3State(assoc);

  Object.keys(assoc.signedAdminDocs).forEach(k => {
    assoc.signedAdminDocs[k].signed = true;
  });

  savePlatformState();
  renderAssociationDashboard();
  showToast('تم توقيع واعتماد كافة الوثائق الـ 4 الصادرة من الإدارة بنجاح ✓', 'success');
};

// ========================== Prompt 3: Part 2 - Office Handover Checklist ==========================
window.toggleHandoverItem = function(itemKey) {
  const assoc = getActiveAssociation();
  if (!assoc || !assoc.handoverChecklist) return;

  const item = assoc.handoverChecklist[itemKey];
  if (!item) return;

  item.completed = !item.completed;
  savePlatformState();
  renderAssociationDashboard();
  showToast(item.completed ? `تم اعتماد واستلام: "${item.title}" بنجاح ✓` : `تم تعديل حالة: "${item.title}"`, 'info');
};

window.completeAllHandoverQuick = function() {
  const assoc = getActiveAssociation();
  if (!assoc) return;
  initPrompt3State(assoc);

  Object.keys(assoc.handoverChecklist).forEach(k => {
    assoc.handoverChecklist[k].completed = true;
  });

  savePlatformState();
  renderAssociationDashboard();
  showToast('تم استلام وتفعيل كافة بنود المقر والعهد بنجاح ✓', 'success');
};

// ========================== Prompt 3: Part 3 - Four Sequential Stages Tracker ==========================
window.completeIncubationStage = function(stageNum) {
  const assoc = getActiveAssociation();
  if (!assoc) return;
  initPrompt3State(assoc);

  // Sequential lock logic: previous stage must be completed
  if (stageNum === 2 && !assoc.incubationStages.stage1.completed) {
    showToast('المرحلة مقفلة! يجب إتمام المرحلة 1 (استبيان الفكرة) أولاً وفق تسلسل رحلة الاحتضان.', 'warning');
    return;
  }
  if (stageNum === 3 && !assoc.incubationStages.stage2.completed) {
    showToast('المرحلة مقفلة! يجب إتمام المرحلة 2 (الهوية المؤسسية) أولاً وفق تسلسل رحلة الاحتضان.', 'warning');
    return;
  }
  if (stageNum === 4 && !assoc.incubationStages.stage3.completed) {
    showToast('المرحلة مقفلة! يجب إتمام المرحلة 3 (الاحتضان المكتبي) أولاً وفق تسلسل رحلة الاحتضان.', 'warning');
    return;
  }

  const stageKeys = {
    1: 'stage1',
    2: 'stage2',
    3: 'stage3',
    4: 'stage4'
  };

  const currentKey = stageKeys[stageNum];
  assoc.incubationStages[currentKey].completed = true;
  assoc.incubationStages[currentKey].progress = 100;

  // Update overall progress & title
  if (stageNum === 1) {
    assoc.stage = 'المرحلة الثانية: التهيئة المؤسسية';
    assoc.stageProgress = 50;
    showToast('تهانينا! تم إتمام المرحلة 1 (استبيان الفكرة) وفتح المرحلة 2 بنجاح ✓', 'success');
  } else if (stageNum === 2) {
    assoc.stage = 'المرحلة الثالثة: الاحتضان المكاني';
    assoc.stageProgress = 75;
    showToast('تهانينا! تم إتمام المرحلة 2 (الهوية المؤسسية) وفتح المرحلة 3 بنجاح ✓', 'success');
  } else if (stageNum === 3) {
    assoc.stage = 'المرحلة الرابعة: مسرعة عذق';
    assoc.stageProgress = 90;
    showToast('تهانينا! تم إتمام المرحلة 3 (الاحتضان المكتبي) وفتح المرحلة 4 بنجاح ✓', 'success');
  } else if (stageNum === 4) {
    assoc.stage = 'جمعية متخرجة ومستدامة';
    assoc.stageProgress = 100;
    assoc.isGraduated = true;
    showToast('🎓 تهانينا الكبرى! تم إتمام المراحل الأربع بنسبة 100% وأصبحت الجمعية "جمعية متخرجة ومستدامة"!', 'success');
    switchPrompt3Tab(null, 'p3-tab-graduation');
  }

  savePlatformState();
  renderAssociationDashboard();
};

window.saveProgressAndExit = function() {
  savePlatformState();
  showToast('💾 تم حفظ تقدم رحلة الجمعية والمراحل الأربع بنجاح! يمكنك استكمال الرحلة في أي وقت لاحق.', 'success');
};

window.graduateAssociationQuick = function() {
  const assoc = getActiveAssociation();
  if (!assoc) return;
  initPrompt3State(assoc);

  assoc.incubationStages.stage1.completed = true;
  assoc.incubationStages.stage1.progress = 100;
  assoc.incubationStages.stage2.completed = true;
  assoc.incubationStages.stage2.progress = 100;
  assoc.incubationStages.stage3.completed = true;
  assoc.incubationStages.stage3.progress = 100;
  assoc.incubationStages.stage4.completed = true;
  assoc.incubationStages.stage4.progress = 100;

  assoc.stage = 'جمعية متخرجة ومستدامة';
  assoc.stageProgress = 100;
  assoc.isGraduated = true;

  savePlatformState();
  renderAssociationDashboard();
  switchPrompt3Tab(null, 'p3-tab-graduation');
  showToast('🎓 تم اعتماد تخرج وتمكين الجمعية بنسبة 100% (جمعية متخرجة ومستدامة) ✓', 'success');
};

// ========================== Prompt 3: Part 4 - Grants Referral & Reports ==========================
window.openGrantReferralModal = function(grantName) {
  const assoc = getActiveAssociation();
  const modal = document.getElementById('modalGrantReferral');
  if (!modal) return;

  const targetSelect = document.getElementById('grant-target-entity');
  const assocInput = document.getElementById('grant-assoc-name');

  if (targetSelect && grantName) {
    for (let i = 0; i < targetSelect.options.length; i++) {
      if (targetSelect.options[i].value.includes(grantName.slice(0, 15))) {
        targetSelect.selectedIndex = i;
        break;
      }
    }
  }
  if (assocInput && assoc) {
    assocInput.value = `${assoc.associationName} (ترخيص: ${assoc.licenseNumber})`;
  }

  modal.classList.add('active');
};

window.closeGrantReferralModal = function() {
  document.getElementById('modalGrantReferral')?.classList.remove('active');
};

window.submitGrantReferralAction = function() {
  const assoc = getActiveAssociation();
  const target = document.getElementById('grant-target-entity')?.value;
  const budget = document.getElementById('grant-budget-select')?.value;
  const title = document.getElementById('grant-project-title')?.value.trim();

  if (!title) {
    showToast('يرجى كتابة عنوان المشروع للمنحة.', 'error');
    return;
  }

  const referralRecord = {
    id: `REF-GRT-${Date.now().toString().slice(-4)}`,
    grantEntity: target,
    budget: budget,
    projectTitle: title,
    date: new Date().toISOString().split('T')[0],
    status: 'محال للمانح بتزكية عذق الرسمية ✓'
  };

  if (!assoc.grantReferrals) assoc.grantReferrals = [];
  assoc.grantReferrals.unshift(referralRecord);

  if (typeof addAdminAuditLog === 'function') {
    addAdminAuditLog(`إحالة منحة: ${assoc.associationName}`, `إحالة طلب "${title}" إلى ${target.split(' ')[0]} بمبلغ ${budget}`, 'fa-hand-holding-dollar', '#047857');
  }

  savePlatformState();
  closeGrantReferralModal();
  renderAssociationDashboard();
  showToast(`تم إرسال إحالة وتزكية ملف الجمعية رسمياً إلى "${target.split(' ')[0]}" بنجاح! ✓`, 'success');
};

window.downloadGraduationReport = function() {
  const assoc = (window.APP_STATE && window.APP_STATE.userAssoc && window.APP_STATE.userAssoc.name) ? window.APP_STATE.userAssoc.name : 'جمعية ديوان الشبابية';
  const lic = (window.APP_STATE && window.APP_STATE.userAssoc && window.APP_STATE.userAssoc.license) ? window.APP_STATE.userAssoc.license : '1842';
  if (window.AthqPrint) {
    window.AthqPrint.printGraduationCertificate(assoc, lic);
  } else {
    window.print();
  }
};

function renderStateSimulatorQuickbar(activeState) {
  return `
    <div class="state-simulator-quickbar">
      <span class="state-sim-title"><i class="fa-solid fa-wand-magic-sparkles"></i> محاكاة رحلة الجمعية:</span>
      <button type="button" class="btn-state-sim ${activeState === 'state1_review' ? 'active' : ''}" onclick="setAppStateMachineState('state1_review')">1. قيد المراجعة</button>
      <button type="button" class="btn-state-sim ${activeState === 'state1_rejected' ? 'active' : ''}" onclick="setAppStateMachineState('state1_rejected')">1. مرفوض (السبب)</button>
      <button type="button" class="btn-state-sim ${activeState === 'state2_orientation' ? 'active' : ''}" onclick="setAppStateMachineState('state2_orientation')">2. الاجتماع والنماذج</button>
      <button type="button" class="btn-state-sim ${activeState === 'state3_decision' ? 'active' : ''}" onclick="setAppStateMachineState('state3_decision')">3. سؤال الاحتضان</button>
      <button type="button" class="btn-state-sim ${activeState === 'state3_services_only' ? 'active' : ''}" onclick="setAppStateMachineState('state3_services_only')">3. خدمات فقط</button>
      <button type="button" class="btn-state-sim ${activeState === 'state3_conditional_employee' ? 'active' : ''}" onclick="setAppStateMachineState('state3_conditional_employee')">3. الموظف اليومي</button>
      <button type="button" class="btn-state-sim ${activeState === 'state3_no_employee_apology' ? 'active' : ''}" onclick="setAppStateMachineState('state3_no_employee_apology')">3. اعتذار</button>
      <button type="button" class="btn-state-sim ${activeState === 'state4_exam_ready' ? 'active' : ''}" onclick="setAppStateMachineState('state4_exam_ready')">4. فتح الاختبار</button>
      <button type="button" class="btn-state-sim ${activeState === 'state4_failed' ? 'active' : ''}" onclick="simulateExamScoreDirect(60)">4. رسوب (60%)</button>
      <button type="button" class="btn-state-sim ${activeState === 'state4_passed' ? 'active' : ''}" onclick="simulateExamScoreDirect(90)">4. اجتياز (Prompt 3)</button>
    </div>
  `;
}

// ========================== Foundation Exam (100 Points) Implementation ==========================
const FOUNDATION_EXAM_CRITERIA = [
  { id: 1, title: 'الترخيص الرسمي ولائحة التأسيس', desc: 'ترخيص سارٍ من المركز الوطني NCNP ولائحة أساسية معتمدة' },
  { id: 2, title: 'الرقم الوطني الموحد (700) والحساب البنكي', desc: 'اكتمال صدور الرقم 700 وتفعيل حساب مصرفي رسمي باسم الجمعية' },
  { id: 3, title: 'كادر وظيفي أو موظف متفرغ بدوام يومي', desc: 'وجود ممثل أو مدير تنفيذي يداوم يومياً بمقر الحاضنة' },
  { id: 4, title: 'الهيكل التنظيمي ومصفوفة الصلاحيات', desc: 'اعتماد مجلس الإدارة لمصفوفة الصلاحيات المالية والإدارية' },
  { id: 5, title: 'الخطة التشغيلية والموازنة التقديرية', desc: 'خطة تشغيلية معتمدة للعام المالي الحالي مع مؤشرات قياس أداء' },
  { id: 6, title: 'النظام المحاسبي ومراجع الحسابات الخارجي', desc: 'تطبيق برنامج محاسبي سحابي وتعيين مراجع حسابات خارجي مرخص' },
  { id: 7, title: 'معايير الإفصاح والشفافية والحوكمة', desc: 'نشر اللوائح والقوائم المالية والسياسات على موقع الجمعية' },
  { id: 8, title: 'النطاق الجغرافي للخدمة (المدينة المنورة)', desc: 'تقديم الخدمات وتنفيذ المبادرات داخل النطاق الجغرافي للمدينة' },
  { id: 9, title: 'توثيق التطوع والمنصة الوطنية', desc: 'تفعيل حساب المنصة الوطنية للعمل التطوعي وتوثيق الساعات والفرص' },
  { id: 10, title: 'الالتزام بأنظمة الحاضنة وحضور الورش', desc: 'تعهد المجلس والمدير التنفيذي بحضور البرامج الدورية وميثاق الاحتضان' }
];

window.openFoundationExamModal = function() {
  const container = document.getElementById('exam-questions-list');
  if (container) {
    container.innerHTML = FOUNDATION_EXAM_CRITERIA.map(q => `
      <div style="background: var(--c-surface); border: 1px solid var(--c-border); border-radius: 12px; padding: 14px 18px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
        <div style="flex: 1; min-width: 240px;">
          <strong style="color: var(--c-primary); font-size: 0.92rem; display: block;">
            ${q.id}. ${q.title}
          </strong>
          <span style="font-size: 0.78rem; color: var(--c-text-muted);">${q.desc}</span>
        </div>
        <div style="display: flex; gap: 14px; align-items: center;">
          <label style="display: flex; align-items: center; gap: 6px; font-size: 0.8rem; font-weight: 700; color: #047857; cursor: pointer;">
            <input type="radio" name="exam_q_${q.id}" value="10" checked onchange="updateExamLiveScore()"> مستوفى (+10)
          </label>
          <label style="display: flex; align-items: center; gap: 6px; font-size: 0.8rem; font-weight: 700; color: #DC2626; cursor: pointer;">
            <input type="radio" name="exam_q_${q.id}" value="0" onchange="updateExamLiveScore()"> غير مستوفى (0)
          </label>
        </div>
      </div>
    `).join('');
  }

  updateExamLiveScore();
  document.getElementById('modalFoundationExam')?.classList.add('active');
};

window.closeFoundationExamModal = function() {
  document.getElementById('modalFoundationExam')?.classList.remove('active');
};

window.updateExamLiveScore = function() {
  let totalScore = 0;
  for (let i = 1; i <= 10; i++) {
    const checked = document.querySelector(`input[name="exam_q_${i}"]:checked`);
    if (checked) {
      totalScore += parseInt(checked.value, 10);
    }
  }

  const scoreText = document.getElementById('exam-live-score-text');
  const badge = document.getElementById('exam-live-status-badge');

  if (scoreText) scoreText.textContent = `${totalScore} / 100`;
  if (badge) {
    if (totalScore > 65) {
      badge.style.background = '#D1FAE5';
      badge.style.color = '#065F46';
      badge.innerHTML = `<i class="fa-solid fa-circle-check"></i> مؤهل للاجتياز (${totalScore} > 65) ✓`;
    } else {
      badge.style.background = '#FEE2E2';
      badge.style.color = '#991B1B';
      badge.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> غير مؤهل (${totalScore} <= 65) ✕`;
    }
  }

  return totalScore;
};

window.simulateExamScore = function(targetScore) {
  // targetScore 60 => 6 checked as 10, 4 as 0
  // targetScore 90 => 9 checked as 10, 1 as 0
  const passCount = Math.floor(targetScore / 10);

  for (let i = 1; i <= 10; i++) {
    const val = i <= passCount ? "10" : "0";
    const radio = document.querySelector(`input[name="exam_q_${i}"][value="${val}"]`);
    if (radio) radio.checked = true;
  }

  updateExamLiveScore();
  showToast(`تم تعيين معايير الاختبار لمحاكاة نتيجة (${targetScore}/100)`, 'info');
};

window.simulateExamScoreDirect = function(targetScore) {
  const assoc = getActiveAssociation();
  if (!assoc) return;

  assoc.examScore = targetScore;
  if (targetScore > 65) {
    assoc.examPassed = true;
    assoc.stateMachineState = 'state4_passed';
    assoc.stage = 'المرحلة الثالثة: الاحتضان المكاني';
    assoc.stageProgress = 75;
    showToast(`محاكاة اجتياز بنجاح! حققت الجمعية ${targetScore}/100 وتأهلت رسمياً لتوثيق العقود.`, 'success');
  } else {
    assoc.examPassed = false;
    assoc.stateMachineState = 'state4_failed';
    showToast(`محاكاة رسوب: حصلت الجمعية على ${targetScore}/100 (65 أو أقل). يتوقف مسار الاحتضان المكتبي.`, 'warning');
  }

  savePlatformState();
  renderAssociationDashboard();
};

window.submitFoundationExam = function(e) {
  if (e) e.preventDefault();
  const totalScore = updateExamLiveScore();
  const assoc = getActiveAssociation();
  if (!assoc) return;

  assoc.examScore = totalScore;

  if (totalScore > 65) {
    assoc.examPassed = true;
    assoc.stateMachineState = 'state4_passed';
    assoc.stage = 'المرحلة الثالثة: الاحتضان المكاني';
    assoc.stageProgress = 75;
    showToast(`تهانينا! حققت الجمعية ${totalScore}/100 (>65) وتأهلت رسمياً لتوثيق العقود ورحلة الاحتضان!`, 'success');
  } else {
    assoc.examPassed = false;
    assoc.stateMachineState = 'state4_failed';
    showToast(`حصلت الجمعية على ${totalScore}/100 (65 درجة أو أقل). يتوقف مسار الاحتضان المكتبي حالياً.`, 'warning');
  }

  savePlatformState();
  closeFoundationExamModal();
  renderAssociationDashboard();
};

function renderAssocPipelineStepper(assoc) {
  const container = document.getElementById('assoc-pipeline-stepper');
  if (!container) return;

  const stageText = (assoc.stage || '').toLowerCase();
  let currentStageNumber = 3;
  if (stageText.includes('الأولى') || stageText.includes('1') || stageText.includes('الفكرة')) {
    currentStageNumber = 1;
  } else if (stageText.includes('الثانية') || stageText.includes('2') || stageText.includes('التهيئة')) {
    currentStageNumber = 2;
  } else if (stageText.includes('الثالثة') || stageText.includes('3') || stageText.includes('المكاني')) {
    currentStageNumber = 3;
  } else if (stageText.includes('الرابعة') || stageText.includes('4') || stageText.includes('مسرعة') || stageText.includes('تخرج')) {
    currentStageNumber = 4;
  }

  const stagesData = [
    { num: 1, title: 'احتضان الفكرة', sub: 'دراسة الاحتياج وميثاق التأسيس' },
    { num: 2, title: 'التهيئة المؤسسية', sub: 'اللوائح والأنظمة والرقم 700' },
    { num: 3, title: 'الاحتضان المكاني', sub: 'استلام المقر وحزم الحوكمة' },
    { num: 4, title: 'مسرعة عذق', sub: 'الاستدامة المالية والمانحون' }
  ];

  container.innerHTML = stagesData.map(st => {
    let statusClass = '';
    let badgeContent = '';

    if (st.num < currentStageNumber) {
      statusClass = 'completed';
      badgeContent = `<span>✓</span> المرحلة ${st.num} (مكتملة)`;
    } else if (st.num === currentStageNumber) {
      statusClass = 'current';
      badgeContent = `<span class="live-pulse" style="width: 8px; height: 8px;"></span> المرحلة ${st.num} (الحالية)`;
    } else {
      statusClass = 'future';
      badgeContent = `<i class="fa-solid fa-lock" style="font-size: 0.7rem; opacity: 0.6;"></i> المرحلة ${st.num}`;
    }

    return `
      <div class="pipeline-step-item ${statusClass}" title="المرحلة ${st.num}: ${st.title}">
        <div class="step-num-badge">${badgeContent}</div>
        <div class="step-title">${st.title}</div>
        <div style="font-size: 0.75rem; color: ${statusClass === 'current' ? 'var(--c-gold-dark)' : 'var(--c-text-muted)'}; font-weight: ${statusClass === 'current' ? '700' : '500'};">${st.sub}</div>
      </div>
    `;
  }).join('');
}

function renderAssocEvidencesList(assoc) {
  const container = document.getElementById('assoc-evidences-list');
  if (!container) return;

  const rawList = assoc.evidences || [];

  // Filter and Search logic
  const filtered = rawList.filter(ev => {
    // Search query check
    if (currentAssocEvidenceSearch) {
      const q = currentAssocEvidenceSearch.toLowerCase();
      const matchTitle = (ev.title || '').toLowerCase().includes(q);
      const matchStatus = (ev.status || '').toLowerCase().includes(q);
      if (!matchTitle && !matchStatus) return false;
    }

    // Category filter check
    if (currentAssocEvidenceFilter === 'all') return true;
    const cat = (ev.category || '').toLowerCase();
    const title = (ev.title || '').toLowerCase();
    if (currentAssocEvidenceFilter === 'عقد') return cat.includes('عقد') || title.includes('عقد') || title.includes('ميثاق') || title.includes('طلب');
    if (currentAssocEvidenceFilter === 'حوكمة') return cat.includes('حوكمة') || title.includes('لائحة') || title.includes('حسم') || title.includes('سياسة') || title.includes('استيفاء');
    if (currentAssocEvidenceFilter === 'مقر') return cat.includes('مقر') || title.includes('مفتاح') || title.includes('عهد') || title.includes('بصمة') || title.includes('أمان');
    if (currentAssocEvidenceFilter === 'موارد') return cat.includes('موارد') || title.includes('موظف') || title.includes('تفرغ') || title.includes('تطوع');
    return true;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 36px 20px; background: var(--c-surface); border: 1px dashed var(--c-border); border-radius: var(--radius-md);">
        <i class="fa-solid fa-folder-open" style="font-size: 2.2rem; color: var(--c-text-muted); margin-bottom: 10px;"></i>
        <h4 style="font-size: 1rem; color: var(--c-text); margin-bottom: 4px;">لم يتم العثور على وثائق مطابقة</h4>
        <p style="font-size: 0.8rem; color: var(--c-text-muted); margin-bottom: 14px;">جرّب تعديل معايير البحث أو رفع شاهد جديد في هذا التصنيف.</p>
        <button class="btn btn-outline-primary btn-sm" onclick="filterAssocEvidences(document.querySelector('.evidence-filter-btn'), 'all')">عرض جميع الوثائق</button>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map((ev, idx) => {
    const rawIdx = rawList.indexOf(ev);
    const isCompleted = (ev.status || '').includes('✓') || (ev.status || '').includes('معتمد');
    
    // Choose appropriate icon
    let iconClass = 'fa-file-shield';
    if ((ev.title || '').includes('عقد') || (ev.title || '').includes('طلب')) iconClass = 'fa-file-signature';
    else if ((ev.title || '').includes('مفتاح') || (ev.title || '').includes('عهد') || (ev.title || '').includes('بصمة')) iconClass = 'fa-key';
    else if ((ev.title || '').includes('موظف') || (ev.title || '').includes('تفرغ')) iconClass = 'fa-user-tie';
    else if ((ev.title || '').includes('حسم') || (ev.title || '').includes('تقرير')) iconClass = 'fa-file-lines';

    return `
      <div class="assoc-evidence-card">
        <div class="assoc-evidence-main">
          <div class="assoc-evidence-icon"><i class="fa-solid ${iconClass}"></i></div>
          <div class="assoc-evidence-meta">
            <strong>${ev.title}</strong>
            <small>
              <span><i class="fa-regular fa-calendar"></i> تاريخ الرفع: ${ev.date}</span>
              <span>•</span>
              <span><i class="fa-solid fa-file-pdf" style="color: #DC2626;"></i> PDF موثق</span>
            </small>
          </div>
        </div>

        <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
          <span class="badge" style="background: ${isCompleted ? 'rgba(16,185,129,0.12)' : 'rgba(203,142,30,0.12)'}; color: ${isCompleted ? '#059669' : 'var(--c-gold-dark)'}; padding: 4px 12px; border-radius: 20px; font-weight: 800; font-size: 0.78rem;">
            ${ev.status}
          </span>
          <div class="assoc-evidence-actions">
            <button class="btn btn-outline-primary btn-sm" onclick="previewAssocEvidence(${rawIdx})" title="معاينة الشاهد الرسمي">
              <i class="fa-regular fa-eye"></i> معاينة
            </button>
            <button class="btn btn-outline btn-sm" onclick="downloadAssocEvidence(${rawIdx})" style="border-color: var(--c-border); color: var(--c-text);" title="تنزيل نسخة PDF">
              <i class="fa-solid fa-download"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

window.filterAssocEvidences = function(btn, filter) {
  currentAssocEvidenceFilter = filter;
  document.querySelectorAll('.evidence-filter-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  const assoc = getActiveAssociation();
  if (assoc) renderAssocEvidencesList(assoc);
};

window.searchAssocEvidences = function(query) {
  currentAssocEvidenceSearch = (query || '').trim();
  const assoc = getActiveAssociation();
  if (assoc) renderAssocEvidencesList(assoc);
};

// Evidence Upload Modal
window.openAssocUploadEvidenceModal = function() {
  const modal = document.getElementById('modalAssocUploadEvidence');
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
};

window.closeAssocUploadEvidenceModal = function() {
  const modal = document.getElementById('modalAssocUploadEvidence');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
};

window.saveAssocUploadEvidence = function() {
  const title = (document.getElementById('newEvidenceTitle')?.value || '').trim();
  const category = document.getElementById('newEvidenceCategory')?.value || 'حوكمة';
  const status = document.getElementById('newEvidenceStatus')?.value || 'معتمد وموثق ✓';
  const notes = document.getElementById('newEvidenceNotes')?.value || '';

  if (!title) {
    showToast('يرجى إدخال مسمى الوثيقة أو الشاهد المطلوب', 'warning');
    return;
  }

  const assoc = getActiveAssociation();
  if (!assoc) return;
  if (!assoc.evidences) assoc.evidences = [];

  const todayStr = new Date().toISOString().slice(0, 10);
  assoc.evidences.unshift({
    title,
    category,
    status,
    notes,
    date: todayStr
  });

  savePlatformState();
  renderAssociationDashboard();
  closeAssocUploadEvidenceModal();
  showToast(`تم رفع وتوثيق الشاهد "${title}" بنجاح!`, 'success');
};

// Evidence Preview Modal
window.previewAssocEvidence = function(idx) {
  const assoc = getActiveAssociation();
  if (!assoc || !assoc.evidences || !assoc.evidences[idx]) return;

  const ev = assoc.evidences[idx];
  currentPreviewEvidenceObj = ev;

  const modal = document.getElementById('modalAssocEvidencePreview');
  const titleEl = document.getElementById('previewEvTitle');
  const subtitleEl = document.getElementById('previewEvSubtitle');
  const statusBadgeEl = document.getElementById('previewEvStatusBadge');
  const docFilenameEl = document.getElementById('previewDocFilename');
  const docDateEl = document.getElementById('previewDocDate');

  if (titleEl) titleEl.textContent = ev.title;
  if (subtitleEl) subtitleEl.textContent = `الجهة: ${assoc.associationName} • ترخيص رقم: ${assoc.licenseNumber}`;
  if (statusBadgeEl) statusBadgeEl.textContent = ev.status;
  if (docFilenameEl) docFilenameEl.textContent = `${ev.title.replace(/\s+/g, '-').slice(0, 30)}.pdf`;
  if (docDateEl) docDateEl.textContent = `تاريخ الرفع: ${ev.date}`;

  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
};

window.closeAssocEvidencePreviewModal = function() {
  const modal = document.getElementById('modalAssocEvidencePreview');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
};

window.downloadCurrentEvidence = function() {
  if (currentPreviewEvidenceObj) {
    showToast(`جاري تنزيل ملف: ${currentPreviewEvidenceObj.title}.pdf`, 'info');
  }
};

window.downloadAssocEvidence = function(idx) {
  const assoc = getActiveAssociation();
  if (assoc && assoc.evidences && assoc.evidences[idx]) {
    showToast(`جاري تنزيل ملف: ${assoc.evidences[idx].title}.pdf`, 'info');
  }
};

function renderAssocBookingsList() {
  const container = document.getElementById('assoc-bookings-list');
  if (!container) return;

  const bookings = APP_STATE.bookings || [];
  if (bookings.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 24px; background: var(--c-surface); border: 1px dashed var(--c-border); border-radius: 8px;">
        <i class="fa-solid fa-calendar-xmark" style="font-size: 2rem; color: var(--c-text-muted); margin-bottom: 8px;"></i>
        <div style="font-size: 0.9rem; font-weight: 700; color: var(--c-text);">لا توجد حجوزات مرافق حالية</div>
        <small style="color: var(--c-text-muted);">يمكنك حجز قاعة الاجتماعات أو مساحات العمل بالضغط على "حجز مرفق أو قاعة الآن".</small>
      </div>
    `;
    return;
  }

  container.innerHTML = bookings.map((b, idx) => `
    <div style="display: flex; justify-content: space-between; align-items: center; background: var(--c-surface); border: 1px solid var(--c-border); padding: 14px 18px; border-radius: var(--radius-md); margin-bottom: 10px; transition: all 0.2s ease; box-shadow: var(--shadow-xs); flex-wrap: wrap; gap: 10px;">
      <div style="display: flex; align-items: center; gap: 14px;">
        <div style="width: 42px; height: 42px; border-radius: 10px; background: var(--c-primary-subtle); color: var(--c-primary); display: flex; align-items: center; justify-content: center; font-size: 1.2rem;">
          <i class="fa-solid fa-door-open"></i>
        </div>
        <div>
          <strong style="display: block; font-size: 0.95rem; color: var(--c-primary); font-weight: 800; margin-bottom: 2px;">${b.facility}</strong>
          <small style="color: var(--c-text-muted); font-size: 0.78rem; display: flex; gap: 10px; flex-wrap: wrap;">
            <span><i class="fa-regular fa-calendar"></i> ${b.date}</span>
            <span>•</span>
            <span><i class="fa-regular fa-clock"></i> ${b.time}</span>
          </small>
        </div>
      </div>
      <div style="display: flex; align-items: center; gap: 10px;">
        <span class="badge" style="background: var(--c-primary-subtle); color: var(--c-primary); padding: 4px 12px; border-radius: 20px; font-weight: 800; font-size: 0.76rem;">
          ${b.status || 'مؤكد ومحجوز ✓'}
        </span>
        <button class="btn btn-outline btn-sm" onclick="cancelAssocBooking(${idx})" style="border-color: #FECACA; color: #DC2626; padding: 4px 10px; font-size: 0.75rem;" title="إلغاء الحجز">
          <i class="fa-solid fa-xmark"></i> إلغاء
        </button>
      </div>
    </div>
  `).join('');
}

window.cancelAssocBooking = function(idx) {
  if (confirm("هل أنت متأكد من رغبتك في إلغاء هذا الحجز؟")) {
    APP_STATE.bookings.splice(idx, 1);
    savePlatformState();
    renderAssocBookingsList();
    renderAssociationDashboard();
    showToast("تم إلغاء الحجز وتحديث السجل بنجاح.", "info");
  }
};

function renderAssocConsultationsList() {
  const container = document.getElementById('assoc-consultations-list');
  if (!container) return;

  const consults = APP_STATE.consultations || [];
  if (consults.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 24px; background: var(--c-surface); border: 1px dashed var(--c-border); border-radius: 8px;">
        <i class="fa-solid fa-comments" style="font-size: 2rem; color: var(--c-text-muted); margin-bottom: 8px;"></i>
        <div style="font-size: 0.9rem; font-weight: 700; color: var(--c-text);">لا توجد جلسات استشارية مجدولة حالياً</div>
        <small style="color: var(--c-text-muted);">اضغط "حجز جلسة استشارية جديدة" للتنسيق مع نخبة المستشارين المعتمدين.</small>
      </div>
    `;
    return;
  }

  container.innerHTML = consults.map(c => `
    <div style="display: flex; justify-content: space-between; align-items: center; background: var(--c-surface); border: 1px solid var(--c-border); padding: 14px 18px; border-radius: var(--radius-md); margin-bottom: 10px; transition: all 0.2s ease; box-shadow: var(--shadow-xs); flex-wrap: wrap; gap: 10px;">
      <div style="display: flex; align-items: center; gap: 14px;">
        <div style="width: 42px; height: 42px; border-radius: 50%; background: var(--c-gold-subtle); color: var(--c-gold-dark); display: flex; align-items: center; justify-content: center; font-size: 1.2rem; font-weight: 800;">
          <i class="fa-solid fa-user-tie"></i>
        </div>
        <div>
          <strong style="display: block; font-size: 0.95rem; font-weight: 800; color: var(--c-text); margin-bottom: 2px;">المستشار: ${c.consultant}</strong>
          <small style="color: var(--c-text-muted); font-size: 0.78rem; display: flex; gap: 10px; flex-wrap: wrap;">
            <span><i class="fa-solid fa-briefcase" style="color: var(--c-primary);"></i> المجال: ${c.field}</span>
            <span>•</span>
            <span><i class="fa-regular fa-calendar"></i> الموعد: ${c.date}</span>
          </small>
        </div>
      </div>
      <div style="display: flex; align-items: center; gap: 10px;">
        <span class="badge" style="background: var(--c-gold-subtle); color: var(--c-gold-dark); padding: 4px 12px; border-radius: 20px; font-weight: 800; font-size: 0.76rem;">
          ${c.status || 'مجدولة ومؤكدة'}
        </span>
        <button class="btn btn-outline-primary btn-sm" onclick="openBookConsultantModal()" style="padding: 4px 12px; font-size: 0.78rem;">
          <i class="fa-solid fa-plus"></i> حجز جلسة إضافية
        </button>
      </div>
    </div>
  `).join('');
}

window.openBookingModal = function() {
  openFacilityBookingModal();
};

window.openConsultantRequestModal = function() {
  openBookConsultantModal();
};

// ========================== Revamped Consultant Dashboard Engine ==========================
let currentActiveConsultantId = 'CONS-01';
let liveSessionTimerInterval = null;
let liveSessionSeconds = 3600 + 45 * 60 + 20; // 01:45:20 start

window.updateConsultantStepperVisual = function(stepNum) {
  const steps = document.querySelectorAll('#cons-journey-steps-container .cons-journey-step');
  steps.forEach((step, idx) => {
    const num = idx + 1;
    step.classList.remove('completed', 'active');
    if (num < stepNum) {
      step.classList.add('completed');
    } else if (num === stepNum) {
      step.classList.add('active');
    }
  });
};

window.jumpToConsultantJourneyStep = function(stepNum) {
  if (currentActiveRole !== 'consultant') {
    switchRole('consultant');
  }

  updateConsultantStepperVisual(stepNum);

  switch(stepNum) {
    case 1:
      // الخطوة 1: الدخول للبوابة
      showToast('3️⃣ الخطوة 1: تم دخول بوابة الخبراء والمستشارين بنجاح.', 'info');
      break;
    case 2:
      // الخطوة 2: إنشاء حساب وتسجيل مستشار
      openConsultantWizard();
      showToast('3️⃣ الخطوة 2: نموذج تسجيل مستشار جديد (البيانات، السيرة الذاتية، التخصص، نوع التطوع).', 'info');
      break;
    case 3:
      // الخطوة 3: لوحة تحكم المستشار
      renderConsultantDashboard();
      showToast('3️⃣ الخطوة 3: لوحة تحكم المستشار الخاصة ومؤشرات الأداء.', 'info');
      break;
    case 4:
      // الخطوة 4: إدارة الجدول الزمني وتحديد أوقات التفرغ
      const slotsTabBtn = document.querySelector('#view-consultant .portal-tab-btn[onclick*="cons-tab-slots"]');
      if (slotsTabBtn) switchConsTab(slotsTabBtn, 'cons-tab-slots');
      openConsNewSlotModal();
      showToast('3️⃣ الخطوة 4: إدارة الجدول الزمني وتحديد فترات التفرغ للحجز.', 'info');
      break;
    case 5:
      // الخطوة 5: تلقي الطلبات المحجوزة
      const upcomingTabBtn = document.querySelector('#view-consultant .portal-tab-btn[onclick*="cons-tab-upcoming"]');
      if (upcomingTabBtn) switchConsTab(upcomingTabBtn, 'cons-tab-upcoming');
      showToast('3️⃣ الخطوة 5: قائمة طلبات الاستشارة المحجوزة من قِبل الجمعيات المحتضنة.', 'info');
      break;
    case 6:
      // الخطوة 6: التحضير للجلسة واستعراض ملف الجمعية
      openConsultantPrepSession('CNS-501');
      showToast('3️⃣ الخطوة 6: التحضير للجلسة واستعراض ملف الجمعية واحتياجها والوثائق.', 'info');
      break;
    case 7:
      // الخطوة 7: تنفيذ الجلسة الاستشارية
      startLiveConsultantSession('CNS-501');
      showToast('3️⃣ الخطوة 7: عقد وتنفيذ الجلسة الاستشارية الحية (حضوري / افتراضي).', 'info');
      break;
    case 8:
      // الخطوة 8: التوثيق والتقييم
      openConsLogSessionModal('جمعية ديوان الشبابية', 'حوكمة المنظمات واللوائح ومصفوفة الصلاحيات');
      showToast('3️⃣ الخطوة 8: توثيق تقرير الجلسة والتوصيات والتقييم بالنجوم.', 'info');
      break;
    case 9:
      // الخطوة 9: أتمتة الساعات
      document.getElementById('modalConsDecisionPoint')?.classList.add('active');
      showToast('3️⃣ الخطوة 9: أتمتة الساعات الاستشارية تلقائياً برصيد المستشار والحاضنة ⚙️', 'success');
      break;
    case 10:
      // الخطوة 10: نقطة القرار
      document.getElementById('modalConsDecisionPoint')?.classList.add('active');
      showToast('3️⃣ الخطوة 10: نقطة قرار (هل هناك طلب استشارة آخر؟)', 'info');
      break;
  }
};

window.simulateIncomingConsultationRequest = function() {
  if (!APP_STATE.consultations) APP_STATE.consultations = [];

  const cons = (APP_STATE.consultants || []).find(c => c.id === currentActiveConsultantId) || APP_STATE.consultants[0];
  const newReq = {
    id: `CNS-${Math.floor(500 + Math.random() * 400)}`,
    assocName: "جمعية رواد الأثر الشبابية",
    consultant: cons.name,
    field: "صياغة الخطة التشغيلية وقياس مؤشرات الأداء السنوية",
    date: "2025-10-30 (06:00 م - 08:00 م)",
    status: "مجدولة"
  };

  APP_STATE.consultations.unshift(newReq);
  savePlatformState();

  const tabBtn = document.querySelector('#view-consultant .portal-tab-btn[onclick*="cons-tab-upcoming"]');
  if (tabBtn) switchConsTab(tabBtn, 'cons-tab-upcoming');

  renderConsultantDashboard();
  updateConsultantStepperVisual(5);
  showToast('🔔 وصلك إشعار بطلب استشارة محجوز جديد من "جمعية رواد الأثر الشبابية"!', 'success');
};

window.switchActiveConsultant = function(consId) {
  currentActiveConsultantId = consId;
  const cons = (APP_STATE.consultants || []).find(c => c.id === consId) || APP_STATE.consultants[0];
  const select = document.getElementById('consProfileSelect');
  if (select) select.value = consId;
  renderConsultantDashboard();
  showToast(`تم التبديل إلى ملف المستشار: ${cons?.name || ''}`, 'info');
};

window.switchConsTab = function(btn, paneId) {
  document.querySelectorAll('#view-consultant .portal-tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('#view-consultant .portal-tab-pane').forEach(p => p.classList.remove('active'));
  if (btn) btn.classList.add('active');
  document.getElementById(paneId)?.classList.add('active');
};

function renderConsultantDashboard() {
  const consultants = APP_STATE.consultants || [];
  const cons = consultants.find(c => c.id === currentActiveConsultantId) || consultants[0] || {
    id: "CONS-01",
    name: "د. سليمان الحربي",
    specialty: "حوكمة وأنظمة القطاع غير الربحي",
    title: "خبير استشارات مؤسسية وحوكمة",
    avatar: "👨‍🏫",
    hours: 48,
    volHours: 34,
    rating: "4.9 ★",
    slots: ["الأحد: 05:00 م - 07:00 م (حضوري بالحاضنة)", "الثلاثاء: 06:00 م - 08:00 م (افتراضي عبر Zoom)"]
  };

  // Populate #consProfileSelect dropdown with all consultants
  const select = document.getElementById('consProfileSelect');
  if (select && consultants.length > 0) {
    select.innerHTML = consultants.map(c => `
      <option value="${c.id}" ${c.id === currentActiveConsultantId ? 'selected' : ''}>
        ${c.name} (${c.title || c.specialty})
      </option>
    `).join('');
  }

  // 1. Update Header Info
  const nameEl = document.getElementById('consultant-current-name');
  const specEl = document.getElementById('consultant-current-spec');
  const avatarEl = document.getElementById('consultant-current-avatar');
  const ratingPill = document.getElementById('cons-rating-pill');

  if (nameEl) nameEl.textContent = cons.name;
  if (specEl) specEl.textContent = `${cons.title} • ${cons.specialty} • ${cons.experience || '10+ سنوات خبرة'}`;
  if (avatarEl) avatarEl.textContent = cons.avatar || '👨‍🏫';
  if (ratingPill) ratingPill.textContent = `⭐ ${cons.rating || '4.9 ★'} تقييم الجمعيات`;

  // 2. Compute KPIs
  const allConsultations = APP_STATE.consultations || [];
  const completedList = allConsultations.filter(c => (c.status && c.status.includes('منجز')) || (c.consultant && c.consultant.includes(cons.name.split(' ')[1] || '')));
  const upcomingList = allConsultations.filter(c => c.status === 'مجدولة' || c.status === 'مؤكد');

  const totalHours = cons.hours || 48;
  const volHours = cons.volHours || Math.round(totalHours * 0.7);
  const orgsServed = Math.max(8, new Set(completedList.map(c => c.assocName)).size + 4);
  const recsCount = Math.max(16, completedList.length * 3);

  const totalHoursEl = document.getElementById('cons-total-hours');
  const volHoursEl = document.getElementById('cons-vol-hours');
  const orgsCountEl = document.getElementById('cons-orgs-count');
  const ratingValEl = document.getElementById('cons-rating-val');
  const upcomingCountEl = document.getElementById('cons-upcoming-count');
  const recsCountEl = document.getElementById('cons-recs-count');

  if (totalHoursEl) totalHoursEl.textContent = `${totalHours} ساعة`;
  if (volHoursEl) volHoursEl.textContent = `${volHours} ساعة`;
  if (orgsCountEl) orgsCountEl.textContent = `${orgsServed} جمعية`;
  if (ratingValEl) ratingValEl.textContent = cons.rating || '4.9 ★';
  if (upcomingCountEl) upcomingCountEl.textContent = upcomingList.length || 2;
  if (recsCountEl) recsCountEl.textContent = `${recsCount} مخرج`;

  // Badges
  const slotsBadge = document.getElementById('cons-slots-count');
  const upcomingBadge = document.getElementById('cons-upcoming-badge');
  const slots = cons.slots || [];
  if (slotsBadge) slotsBadge.textContent = slots.length;
  if (upcomingBadge) upcomingBadge.textContent = upcomingList.length || 2;

  // 3. Tab 1: Render Interactive Weekly Calendar Grid & Slots
  const slotsContainer = document.getElementById('consultant-slots-box');
  if (slotsContainer) {
    const daysWeek = [
      { key: 'الأحد', name: 'الأحد' },
      { key: 'الاثنين', name: 'الاثنين' },
      { key: 'الثلاثاء', name: 'الثلاثاء' },
      { key: 'الأربعاء', name: 'الأربعاء' },
      { key: 'الخميس', name: 'الخميس' }
    ];

    // Build interactive weekly calendar columns
    const calendarColsHtml = daysWeek.map(d => {
      const daySlots = slots.filter(s => s.startsWith(d.key) || s.includes(d.key));
      const hasSlots = daySlots.length > 0;
      return `
        <div class="cons-cal-day-col">
          <div class="cons-cal-day-header">
            <span class="cons-cal-day-name">${d.name}</span>
            <span class="cons-cal-day-badge ${hasSlots ? 'active-slots' : 'no-slots'}">
              ${hasSlots ? `${daySlots.length} فترة متاحة` : 'لا فترات'}
            </span>
          </div>
          <div class="cons-cal-day-body">
            ${hasSlots ? daySlots.map(s => {
              const isVirtual = s.includes('افتراضي') || s.includes('Zoom');
              return `
                <div class="cons-cal-slot-card ${isVirtual ? 'virtual' : ''}">
                  <div style="font-weight: 800; color: var(--c-primary); font-size: 0.8rem; margin-bottom: 3px;">
                    <i class="fa-solid fa-clock"></i> ${s.split('(')[0].replace(d.key + ':', '').trim()}
                  </div>
                  <div style="font-size: 0.7rem; color: ${isVirtual ? '#2563EB' : 'var(--c-primary)'}; font-weight: 700;">
                    <i class="fa-solid ${isVirtual ? 'fa-video' : 'fa-building'}"></i> ${isVirtual ? 'افتراضي عن بُعد' : 'حضوري بالحاضنة'}
                  </div>
                </div>
              `;
            }).join('') : `
              <div class="cons-cal-slot-empty">
                <i class="fa-regular fa-calendar-plus" style="display: block; margin-bottom: 4px; font-size: 1.1rem; opacity: 0.5;"></i>
                متاح للحجز
              </div>
            `}
          </div>
        </div>
      `;
    }).join('');

    // Slots cards list with delete button
    const slotsListHtml = slots.length === 0 ? `
      <div style="grid-column: 1/-1; text-align: center; padding: 24px; color: var(--c-text-muted); background: var(--c-surface); border: 1px dashed var(--c-border); border-radius: 10px;">
        <i class="fa-solid fa-calendar-xmark" style="font-size: 1.8rem; color: var(--c-border); margin-bottom: 8px; display: block;"></i>
        لا توجد فترات تفرغ مسجلة حالياً. انقر على "إضافة موعد جديد" لإتاحة فترات استشارية جديدة.
      </div>
    ` : slots.map((slot, idx) => {
      const isVirtual = slot.includes('افتراضي') || slot.includes('Zoom');
      return `
        <div class="cons-slot-item">
          <div>
            <div style="font-weight: 800; color: var(--c-primary); font-size: 0.9rem; margin-bottom: 4px;">
              <i class="fa-solid fa-clock" style="margin-left: 6px;"></i> ${slot}
            </div>
            <span class="badge" style="background: ${isVirtual ? 'rgba(59,130,246,0.12)' : 'rgba(14,110,65,0.12)'}; color: ${isVirtual ? '#2563EB' : 'var(--c-primary)'}; font-size: 0.72rem;">
              <i class="fa-solid ${isVirtual ? 'fa-video' : 'fa-building'}"></i> ${isVirtual ? 'افتراضي عن بُعد (Zoom)' : 'حضوري بمقر الحاضنة'}
            </span>
          </div>
          <button class="btn btn-outline btn-sm" style="padding: 4px 8px; font-size: 0.75rem; color: #EF4444; border-color: #EF4444;" onclick="deleteConsSlot(${idx})" title="حذف هذا الموعد">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
      `;
    }).join('');

    slotsContainer.innerHTML = `
      <div style="grid-column: 1/-1; margin-bottom: 6px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
          <strong style="color: var(--c-primary); font-size: 0.92rem;"><i class="fa-solid fa-calendar-week"></i> التقويم التفاعلي الأسبوعي لساعات التفرغ:</strong>
          <span style="font-size: 0.76rem; color: var(--c-text-muted);"><i class="fa-solid fa-circle-check" style="color: var(--c-primary);"></i> التحديث لحظي ومباشر للجمعيات</span>
        </div>
        <div class="cons-weekly-calendar-grid">
          ${calendarColsHtml}
        </div>
        <div style="font-weight: 800; color: var(--c-primary); font-size: 0.92rem; margin-bottom: 10px; margin-top: 14px;">
          <i class="fa-solid fa-list-check"></i> قائمة فترات التفرغ المسجلة وإدارتها (${slots.length}):
        </div>
      </div>
      ${slotsListHtml}
    `;
  }

  // 4. Tab 2: Render Notifications & Upcoming Sessions
  const upcomingContainer = document.getElementById('cons-upcoming-sessions-list');
  if (upcomingContainer) {
    const listToRender = upcomingList.length > 0 ? upcomingList : [
      { id: "CNS-501", assocName: "جمعية ديوان الشبابية", consultant: cons.name, field: "حوكمة المنظمات واللوائح ومصفوفة الصلاحيات", date: "2025-10-24 (05:00 م - 07:00 م)", status: "مجدولة" },
      { id: "CNS-503", assocName: "وقف العمل الصالح", consultant: cons.name, field: "مراجعة سياسة مكافحة غسل الأموال وتعارض المصالح", date: "2025-10-27 (06:00 م - 08:00 م)", status: "مجدولة" }
    ];

    const notifBannerHtml = `
      <div class="cons-notif-banner">
        <div>
          <div class="cons-notif-title">
            <i class="fa-solid fa-bell" style="color: var(--c-gold-dark);"></i>
            <span>إشعارات وطلبات الاستشارة المحجوزة: لديك (${listToRender.length}) طلبات استشارة مؤكدة</span>
          </div>
          <div class="cons-notif-sub">
            يرجى استعراض ملف الجمعية والاطلاع على التحدي المرفوع قبل موعد انعقاد الجلسة
          </div>
        </div>
        <button class="btn btn-gold btn-sm" onclick="simulateIncomingConsultationRequest()">
          <i class="fa-solid fa-plus-circle"></i> محاكاة طلب محجوز جديد
        </button>
      </div>
    `;

    const sessionsHtml = listToRender.map(item => `
      <div class="cons-session-card">
        <div class="cons-session-header" style="flex-wrap: wrap; gap: 14px;">
          <div>
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
              <h4 style="font-size: 1.05rem; font-weight: 800; color: var(--c-primary); margin: 0;">${item.assocName}</h4>
              <span class="badge" style="background: rgba(245,158,11,0.15); color: #D97706; font-size: 0.72rem; font-weight: 700;">
                <i class="fa-solid fa-clock"></i> ${item.status || 'مجدولة'}
              </span>
            </div>
            <div style="font-size: 0.85rem; color: var(--c-text); font-weight: 700;">
              <i class="fa-solid fa-route" style="color: var(--c-gold-dark);"></i> مجال الجلسة: ${item.field}
            </div>
            <div style="font-size: 0.78rem; color: var(--c-text-muted); margin-top: 3px;">
              <i class="fa-regular fa-calendar"></i> الموعد: ${item.date}
            </div>
          </div>

          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <button class="btn btn-outline-primary btn-sm" onclick="openConsultantPrepSession('${item.id || 'CNS-501'}')" title="الخطوة 6: التحضير للجلسة واستعراض ملف الجمعية">
              <i class="fa-solid fa-folder-open"></i> استعراض ملف الجمعية (التحضير)
            </button>
            <button class="btn btn-primary btn-sm" onclick="startLiveConsultantSession('${item.id || 'CNS-501'}')" title="الخطوة 7: عقد الجلسة الاستشارية الحية">
              <i class="fa-solid fa-headset"></i> عقد الجلسة (حضوري / افتراضي)
            </button>
            <button class="btn btn-gold btn-sm" onclick="openConsLogSessionModal('${item.assocName}', '${item.field}')" title="الخطوة 8: التوثيق والتقييم">
              <i class="fa-solid fa-clipboard-check"></i> تقرير الجلسة والتوصيات
            </button>
          </div>
        </div>
      </div>
    `).join('');

    upcomingContainer.innerHTML = notifBannerHtml + sessionsHtml;
  }

  // 5. Tab 3: Render Completed Sessions
  const completedContainer = document.getElementById('consultant-completed-box');
  if (completedContainer) {
    const list = completedList.length > 0 ? completedList : [
      {
        id: "CNS-REP-101",
        assocName: "جمعية ديوان الشبابية",
        consultant: cons.name,
        field: "حوكمة إدارية ومراجعة اللائحة الأساسية ومصفوفة الصلاحيات",
        date: "2025-10-12",
        hours: 3,
        recommendations: "اعتماد اللائحة الأساسية وتشكيل لجنة المراجعة الداخلية وفصل مهام الشؤون المالية وتفعيل النظام المحاسبي السحابي المعتمد.",
        status: "منجزة وموثقة تلقائياً ✓"
      },
      {
        id: "CNS-REP-102",
        assocName: "وقف العمل الصالح",
        consultant: cons.name,
        field: "الاستدامة المالية وتنمية الموارد والمنح وتأسيس الأوقاف",
        date: "2025-10-08",
        hours: 2,
        recommendations: "إعداد دراسة جدوى المحفظة الوقفية وحصر المتبرعين وتجهيز نموذج العرض الاستثماري للشركات المانحة.",
        status: "منجزة وموثقة تلقائياً ✓"
      }
    ];

    completedContainer.innerHTML = list.map(c => `
      <div class="cons-session-card">
        <div class="cons-session-header">
          <div>
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 2px;">
              <strong style="color: var(--c-primary); font-size: 0.98rem;">${c.field} (${c.hours || 2} ساعات استشارية)</strong>
              <span class="badge" style="background: rgba(14,110,65,0.15); color: #0E6E41; font-size: 0.72rem; font-weight: 700;">
                <i class="fa-solid fa-check-double"></i> ${c.status || 'منجزة ✓'}
              </span>
            </div>
            <div style="font-size: 0.78rem; color: var(--c-text-muted);">
              الجهة المستفيدة: <strong>${c.assocName}</strong> • التاريخ: ${c.date} • الخبير: ${c.consultant || cons.name}
            </div>
          </div>

          <button class="btn btn-outline-primary btn-sm" onclick="viewConsReportModal('${c.id}')" title="معاينة وطباعة التقرير الرسمي">
            <i class="fa-solid fa-file-pdf"></i> تقرير الجلسة
          </button>
        </div>

        <div class="cons-rec-box">
          <strong style="color: var(--c-gold-dark); display: block; margin-bottom: 3px;">
            <i class="fa-solid fa-lightbulb"></i> التوصيات وخطة العمل المعتمدة:
          </strong>
          ${c.recommendations || 'متابعة مؤشرات الحوكمة واستكمال الوثائق النظامية لدى المركز الوطني NCNP.'}
        </div>
      </div>
    `).join('');
  }

  // 6. Tab 4: Incubated Entities Directory & Consultative Outreach
  const orgsTbody = document.getElementById('cons-orgs-dir-tbody');
  if (orgsTbody) {
    const apps = APP_STATE.applications || [];
    orgsTbody.innerHTML = apps.map(app => `
      <tr>
        <td>
          <strong>${app.associationName}</strong><br>
          <small style="color: var(--c-text-muted);">${app.city || 'المدينة المنورة'}</small>
        </td>
        <td>${app.licenseNumber}</td>
        <td><span class="badge" style="background: var(--c-primary-subtle); color: var(--c-primary); font-size: 0.72rem;">${app.track}</span></td>
        <td><span class="badge" style="background: var(--c-gold-subtle); color: var(--c-gold-dark); font-size: 0.72rem;">${app.stage}</span></td>
        <td>
          ${app.repName}<br>
          <small style="color: var(--c-text-muted);">${app.repPhone}</small>
        </td>
        <td style="text-align: center;">
          <button class="btn btn-primary btn-sm" style="padding: 4px 10px; font-size: 0.75rem;" onclick="openConsLogSessionModal('${app.associationName}', '${app.track}')">
            <i class="fa-solid fa-hand-holding-hand"></i> تقديم استشارة
          </button>
        </td>
      </tr>
    `).join('');
  }

  // Populate Select in Log Modal
  const logAssocSelect = document.getElementById('logSessionAssoc');
  if (logAssocSelect) {
    const apps = APP_STATE.applications || [];
    logAssocSelect.innerHTML = apps.map(a => `<option value="${a.associationName}">${a.associationName} (ترخيص: ${a.licenseNumber})</option>`).join('');
  }
}

// Slot Management
window.openConsNewSlotModal = function() {
  document.getElementById('modalConsNewSlot')?.classList.add('active');
  updateConsultantStepperVisual(4);
};

window.closeConsNewSlotModal = function() {
  document.getElementById('modalConsNewSlot')?.classList.remove('active');
};

window.saveConsNewSlot = function() {
  const day = document.getElementById('newSlotDay')?.value;
  const start = document.getElementById('newSlotStart')?.value;
  const end = document.getElementById('newSlotEnd')?.value;
  const type = document.getElementById('newSlotType')?.value;

  if (!day || !start || !end) {
    alert('يرجى تحديد أوقات التفرغ.');
    return;
  }

  const slotStr = `${day}: ${start} - ${end} (${type})`;
  const cons = (APP_STATE.consultants || []).find(c => c.id === currentActiveConsultantId) || APP_STATE.consultants[0];
  if (!cons.slots) cons.slots = [];
  cons.slots.push(slotStr);

  savePlatformState();
  closeConsNewSlotModal();
  renderConsultantDashboard();
  showToast(`تمت إضافة موعد التفرغ "${slotStr}" بنجاح!`, 'success');
};

window.deleteConsSlot = function(index) {
  const cons = (APP_STATE.consultants || []).find(c => c.id === currentActiveConsultantId) || APP_STATE.consultants[0];
  if (cons.slots && cons.slots[index] !== undefined) {
    cons.slots.splice(index, 1);
    savePlatformState();
    renderConsultantDashboard();
    showToast('تم حذف موعد التفرغ.', 'info');
  }
};

// ========================== Step 6: Session Preparation Dossier ==========================
window.openConsultantPrepSession = function(sessionId) {
  const allConsultations = APP_STATE.consultations || [];
  const session = allConsultations.find(c => c.id === sessionId) || {
    assocName: 'جمعية ديوان الشبابية',
    field: 'حوكمة المنظمات واللوائح ومصفوفة الصلاحيات',
    date: '2025-10-24 (05:00 م - 07:00 م)'
  };

  const currentApp = (APP_STATE.applications || []).find(a => a.associationName.includes(session.assocName.split(' ')[1] || '')) || APP_STATE.applications[0];

  const nameEl = document.getElementById('prep-assoc-name');
  const trackEl = document.getElementById('prep-assoc-track');
  const stageEl = document.getElementById('prep-assoc-stage');
  const repEl = document.getElementById('prep-assoc-rep');
  const timeEl = document.getElementById('prep-session-time');
  const needEl = document.getElementById('prep-assoc-need');

  if (nameEl) nameEl.textContent = session.assocName;
  if (trackEl) trackEl.textContent = currentApp ? currentApp.track : 'مسار تأسيس الحوكمة المؤسسية';
  if (stageEl) stageEl.textContent = currentApp ? currentApp.stage : 'مرحلة الاحتضان والتمكين التشغيلي';
  if (repEl) repEl.textContent = currentApp ? `${currentApp.repName} (${currentApp.repPhone})` : 'أ. عبدالمحسن الأحمدي (0509876543)';
  if (timeEl) timeEl.textContent = session.date || 'الأحد القادم | 05:00 م - 07:00 م';
  if (needEl) needEl.textContent = `الحاجة المرفوعة: مراجعة واعتماد ملف (${session.field}) وتحديث السياسات واللوائح وفق معايير الحوكمة والامتثال الصادرة من المركز الوطني NCNP.`;

  document.getElementById('modalConsultantPrepSession')?.classList.add('active');
  updateConsultantStepperVisual(6);
};

window.closeConsultantPrepModal = function() {
  document.getElementById('modalConsultantPrepSession')?.classList.remove('active');
};

window.launchLiveSessionFromPrep = function() {
  closeConsultantPrepModal();
  startLiveConsultantSession();
};

// ========================== Step 7: Live Consultation Session ==========================
window.startLiveConsultantSession = function(sessionId) {
  const cons = (APP_STATE.consultants || []).find(c => c.id === currentActiveConsultantId) || APP_STATE.consultants[0];
  const consNameEl = document.getElementById('live-cons-name');
  if (consNameEl) consNameEl.textContent = cons.name;

  // Start live timer
  liveSessionSeconds = 3600 + 45 * 60 + 20;
  if (liveSessionTimerInterval) clearInterval(liveSessionTimerInterval);
  liveSessionTimerInterval = setInterval(() => {
    liveSessionSeconds++;
    const h = String(Math.floor(liveSessionSeconds / 3600)).padStart(2, '0');
    const m = String(Math.floor((liveSessionSeconds % 3600) / 60)).padStart(2, '0');
    const s = String(liveSessionSeconds % 60).padStart(2, '0');
    const timerEl = document.getElementById('liveSessionTimer');
    if (timerEl) timerEl.textContent = `${h}:${m}:${s}`;
  }, 1000);

  document.getElementById('modalConsultantLiveSession')?.classList.add('active');
  updateConsultantStepperVisual(7);
  showToast('بدأت الجلسة الاستشارية المباشرة بنجاح عبر نظام الاتصال الموحد.', 'info');
};

window.closeConsultantLiveSessionModal = function() {
  if (liveSessionTimerInterval) clearInterval(liveSessionTimerInterval);
  document.getElementById('modalConsultantLiveSession')?.classList.remove('active');
};

window.toggleLiveControl = function(btn, type) {
  btn.classList.toggle('active');
  if (type === 'mic') {
    const isMuted = btn.classList.contains('active');
    btn.innerHTML = isMuted ? '<i class="fa-solid fa-microphone-slash"></i>' : '<i class="fa-solid fa-microphone"></i>';
    showToast(isMuted ? 'تم كتم الميكروفون' : 'تم تشغيل الميكروفون', 'info');
  } else if (type === 'cam') {
    const isOff = btn.classList.contains('active');
    btn.innerHTML = isOff ? '<i class="fa-solid fa-video-slash"></i>' : '<i class="fa-solid fa-video"></i>';
    showToast(isOff ? 'تم إيقاف الكاميرا' : 'تم تشغيل الكاميرا', 'info');
  } else if (type === 'screen') {
    const isSharing = btn.classList.contains('active');
    showToast(isSharing ? 'تم بدء مشاركة الشاشة والعرض التقديمي' : 'تم إيقاف مشاركة الشاشة', 'info');
  }
};

window.finishLiveSessionToLog = function() {
  closeConsultantLiveSessionModal();
  openConsLogSessionModal('جمعية ديوان الشبابية', 'حوكمة المنظمات واللوائح ومصفوفة الصلاحيات');
};

// ========================== Step 8: Documentation & Rating ==========================
window.setSessionStarRating = function(stars) {
  const hiddenInput = document.getElementById('logSessionStars');
  if (hiddenInput) hiddenInput.value = stars;

  const starIcons = document.querySelectorAll('#ratingStarsBox .fa-star');
  starIcons.forEach(icon => {
    const val = parseInt(icon.getAttribute('data-star') || '0', 10);
    if (val <= stars) {
      icon.classList.add('active');
    } else {
      icon.classList.remove('active');
    }
  });

  const ratingDesc = {
    1: 'يحتاج إلى تحسين جذري (1/5)',
    2: 'مستوى متوسط (2/5)',
    3: 'جيد ومقبول (3/5)',
    4: 'جيد جداً ومتقدم (4/5)',
    5: 'جاهزية وتفاعل ممتاز (5/5) ✓'
  };

  const textEl = document.getElementById('ratingStarsText');
  if (textEl) textEl.textContent = ratingDesc[stars] || 'جاهزية وتفاعل ممتاز (5/5) ✓';
};

window.openConsLogSessionModal = function(defaultAssoc, defaultField) {
  const modal = document.getElementById('modalConsLogSession');
  if (!modal) return;

  const assocSelect = document.getElementById('logSessionAssoc');
  const fieldInput = document.getElementById('logSessionField');

  if (assocSelect && defaultAssoc) {
    assocSelect.value = defaultAssoc;
  }
  if (fieldInput && defaultField) {
    fieldInput.value = defaultField;
  }

  setSessionStarRating(5);
  modal.classList.add('active');
  updateConsultantStepperVisual(8);
};

window.closeConsLogSessionModal = function() {
  document.getElementById('modalConsLogSession')?.classList.remove('active');
};

// ========================== Step 9 & 10: Automated Hours & Decision Point ==========================
window.saveConsLogSession = function() {
  const assoc = document.getElementById('logSessionAssoc')?.value;
  const field = document.getElementById('logSessionField')?.value.trim();
  const hours = parseInt(document.getElementById('logSessionHours')?.value, 10) || 2;
  const recs = document.getElementById('logSessionRecs')?.value.trim();
  const stars = document.getElementById('logSessionStars')?.value || '5';

  if (!assoc || !field || !recs) {
    alert('يرجى تعبئة كافة حقول الجلسة والتوصيات الصادرة.');
    return;
  }

  const cons = (APP_STATE.consultants || []).find(c => c.id === currentActiveConsultantId) || APP_STATE.consultants[0];
  const newReport = {
    id: `CNS-REP-${Date.now().toString().slice(-4)}`,
    assocName: assoc,
    consultant: cons.name,
    field: field,
    date: new Date().toISOString().split('T')[0],
    hours: hours,
    rating: `${stars}.0 ★`,
    recommendations: recs,
    status: "منجزة وموثقة تلقائياً ✓"
  };

  if (!APP_STATE.consultations) APP_STATE.consultations = [];
  APP_STATE.consultations.unshift(newReport);

  // Automated System Action ⚙️: Add hours to consultant & platform
  if (!cons.hours) cons.hours = 48;
  cons.hours += hours;
  if (!cons.volHours) cons.volHours = Math.round(cons.hours * 0.7);
  cons.volHours += hours;

  if (APP_STATE.stats) {
    APP_STATE.stats.volunteer_hours = (APP_STATE.stats.volunteer_hours || 16311) + hours;
    APP_STATE.stats.consultations = (APP_STATE.stats.consultations || 28) + 1;
  }

  if (typeof addAdminAuditLog === 'function') {
    addAdminAuditLog(`جلسة استشارية: ${assoc}`, `توثيق ${hours} ساعات استشارية مع ${cons.name}`, 'fa-user-tie', '#0E6E41');
  }

  savePlatformState();
  closeConsLogSessionModal();
  renderConsultantDashboard();
  if (typeof renderAdminDashboard === 'function') renderAdminDashboard();

  // Populate Step 9 & 10 Decision Modal
  const autoConsHours = document.getElementById('auto-cons-hours');
  const autoPlatformHours = document.getElementById('auto-platform-hours');
  if (autoConsHours) autoConsHours.textContent = `+${hours} ساعة (إجمالي: ${cons.hours} س) ✓`;
  if (autoPlatformHours) autoPlatformHours.textContent = `+${hours} ساعة (إجمالي: ${(APP_STATE.stats?.volunteer_hours || 16313).toLocaleString('en-US')} س) ✓`;

  updateConsultantStepperVisual(9);
  document.getElementById('modalConsDecisionPoint')?.classList.add('active');
  showToast(`الخطوة 9: أتمتة النظام ⚙️ تم احتساب ${hours} ساعات تلقائياً وإضافتها في رصيد المستشار ورصيد الحاضنة!`, 'success');
};

window.closeConsDecisionPointModal = function() {
  document.getElementById('modalConsDecisionPoint')?.classList.remove('active');
};

window.handleConsultantDecision = function(wantsAnother) {
  closeConsDecisionPointModal();

  if (wantsAnother) {
    // نعم: العودة إلى خطوة (تلقي إشعار بطلب استشارة محجوز)
    const upcomingTabBtn = document.querySelector('#view-consultant .portal-tab-btn[onclick*="cons-tab-upcoming"]');
    if (upcomingTabBtn) switchConsTab(upcomingTabBtn, 'cons-tab-upcoming');
    updateConsultantStepperVisual(5);
    showToast('تمت العودة إلى قائمة طلبات الاستشارة المحجوزة لمتابعة طلبك التالي ✓', 'success');
  } else {
    // لا: تسجيل الخروج بعد حفظ التقارير والتوصيات (نهاية الرحلة)
    updateConsultantStepperVisual(10);
    const steps = document.querySelectorAll('#cons-journey-steps-container .cons-journey-step');
    steps.forEach(s => s.classList.add('completed'));

    setTimeout(() => {
      switchRole('visitor');
      showToast('تم تسجيل الخروج بنجاح بعد حفظ التقارير والتوصيات. شكراً لعطائكم المتميز في حاضنة عذق! 🌿 (نهاية الرحلة 3)', 'info');
    }, 600);
  }
};

// Report Details Modal
window.viewConsReportModal = function(id) {
  const all = APP_STATE.consultations || [];
  const c = all.find(item => item.id === id) || all[0];
  if (!c) return;

  const modal = document.getElementById('modalConsSessionReport');
  if (!modal) return;

  document.getElementById('cons-rep-modal-title').textContent = `تقرير استشاري: ${c.assocName}`;
  document.getElementById('cons-rep-modal-sub').textContent = `كود التقرير: ${c.id || 'CNS-REP-101'} • تاريخ الاعتماد: ${c.date}`;

  const contentBox = document.getElementById('cons-rep-modal-content');
  if (contentBox) {
    contentBox.innerHTML = `
      <div style="border: 2px solid var(--c-border); border-radius: 10px; padding: 20px; background: #FFFFFF;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid var(--c-primary); padding-bottom: 12px; margin-bottom: 16px;">
          <div>
            <strong style="font-size: 1.1rem; color: var(--c-primary); display: block;">حاضنة ومسرعة عذق</strong>
            <span style="font-size: 0.78rem; color: var(--c-text-muted);">جمعية البر بالمدينة المنورة • وحدة الخبراء والاستشارات</span>
          </div>
          <span class="badge" style="background: rgba(14,110,65,0.15); color: #0E6E41; font-weight: 800; font-size: 0.8rem;">معتمد رسمياً ✓</span>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px; font-size: 0.85rem;">
          <div><strong style="color: var(--c-text-muted);">الجهة المستفيدة:</strong> ${c.assocName}</div>
          <div><strong style="color: var(--c-text-muted);">المستشار المشرف:</strong> ${c.consultant}</div>
          <div><strong style="color: var(--c-text-muted);">مجال ومحور الجلسة:</strong> ${c.field}</div>
          <div><strong style="color: var(--c-text-muted);">الساعات الموثقة:</strong> ${c.hours || 2} ساعات استشارية وتطوعية</div>
        </div>

        <div style="background: var(--c-primary-subtle); border-radius: 8px; padding: 14px; margin-bottom: 16px;">
          <strong style="color: var(--c-primary); font-size: 0.9rem; display: block; margin-bottom: 6px;">
            <i class="fa-solid fa-list-check"></i> مخرجات الجلسة والتوصيات الاستراتيجية المعتمدة:
          </strong>
          <p style="font-size: 0.84rem; line-height: 1.8; color: var(--c-text-body); margin: 0;">
            ${c.recommendations || 'تمت مراجعة الوثائق وإصدار التوصيات اللازمة لتحقيق الامتثال والاستدامة المؤسسية.'}
          </p>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.75rem; color: var(--c-text-muted); border-top: 1px dashed var(--c-border); padding-top: 10px;">
          <span>رمز التحقق الرقمي: ATHQ-CONS-${c.id || '9821'}</span>
          <span>موثق بنظام الحاضنة السحابي</span>
        </div>
      </div>
    `;
  }

  modal.classList.add('active');
};

window.closeConsSessionReportModal = function() {
  document.getElementById('modalConsSessionReport')?.classList.remove('active');
};

// ========================== Revamped Admin Dashboard & Operations ==========================
let adminCurrentStatusFilter = 'all';

// Admin Audit Log Array
if (!APP_STATE.auditLogs) {
  APP_STATE.auditLogs = [
    { id: "LOG-1", title: "اعتماد عقد احتضان ومكتب مجهز", text: "تم اعتماد تسليم المكتب المجهز رقم 4 لجمعية ديوان الشبابية.", time: "منذ 25 دقيقة", icon: "fa-circle-check", color: "#0E6E41" },
    { id: "LOG-2", title: "ترقية مرحلة احتضان (BPMN)", text: "ترقية وقف العمل الصالح إلى المرحلة الرابعة (مسرعة عذق).", time: "منذ ساعتين", icon: "fa-stairs", color: "var(--c-gold-dark)" },
    { id: "LOG-3", title: "جدولة قاعة الاجتماعات الكبرى", text: "تأكيد حجز قاعة الاجتماعات الكبرى الذكية لجمعية ديوان الشبابية.", time: "منذ 4 ساعات", icon: "fa-calendar-check", color: "#0D9488" },
    { id: "LOG-4", title: "طلب استيفاء متطلبات الحوكمة", text: "إشعار جمعية همم الشبابية باستكمال مصفوفة الصلاحيات.", time: "منذ يوم", icon: "fa-pen-to-square", color: "#D97706" }
  ];
}

function addAdminAuditLog(title, text, icon = "fa-circle-check", color = "#0E6E41") {
  if (!APP_STATE.auditLogs) APP_STATE.auditLogs = [];
  APP_STATE.auditLogs.unshift({
    id: `LOG-${Date.now()}`,
    title,
    text,
    time: "الآن",
    icon,
    color
  });
  if (APP_STATE.auditLogs.length > 20) APP_STATE.auditLogs.pop();
}

// 1. Switch Admin Tabs
window.switchAdminTab = function(btn, paneId) {
  document.querySelectorAll('#view-admin .portal-tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('#view-admin .portal-tab-pane').forEach(p => p.classList.remove('active'));
  
  if (btn) {
    btn.classList.add('active');
  } else {
    // If called programmatically with paneId
    const tabMap = {
      'admin-tab-applications': 'admin-tab-nav-apps',
      'admin-tab-volunteering': 'admin-tab-nav-volunteering',
      'admin-tab-consultations': 'admin-tab-nav-consults',
      'admin-tab-services': 'admin-tab-nav-services',
      'admin-tab-bookings': 'admin-tab-nav-services',
      'admin-tab-stages': 'admin-tab-nav-stages',
      'admin-tab-analytics': 'admin-tab-nav-analytics',
      'admin-tab-database': 'admin-tab-nav-database'
    };
    const navBtn = document.getElementById(tabMap[paneId]);
    if (navBtn) navBtn.classList.add('active');
  }

  const pane = document.getElementById(paneId);
  if (pane) pane.classList.add('active');

  if (paneId === 'admin-tab-volunteering') {
    renderAdminVolunteeringTable();
  } else if (paneId === 'admin-tab-services' || paneId === 'admin-tab-bookings') {
    renderAdminServicesTable();
  } else if (paneId === 'admin-tab-consultations') {
    renderAdminConsultationsTable();
  } else if (paneId === 'admin-tab-database' && typeof initDatabaseStudio === 'function') {
    initDatabaseStudio();
  }
};

// 2. Status Filters
window.setAdminStatusFilter = function(btn, status) {
  document.querySelectorAll('.admin-filter-pill').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  adminCurrentStatusFilter = status;
  renderAdminApplicationsTable();
};

window.quickFilterAdminByStatus = function(status) {
  switchAdminTab(null, 'admin-tab-applications');
  const targetPill = document.querySelector(`.admin-filter-pill[data-status="${status}"]`);
  if (targetPill) {
    setAdminStatusFilter(targetPill, status);
  }
};

window.filterAdminApplications = function() {
  renderAdminApplicationsTable();
};

// 3. Main Admin Dashboard Renderer
function renderAdminDashboard() {
  const apps = APP_STATE.applications || [];
  const bookings = APP_STATE.bookings || [];
  const consults = APP_STATE.consultations || [];

  // Update Dynamic KPI Numbers
  const countPending = apps.filter(a => a.status === 'تحت المراجعة' || a.status === 'مطلوب تعديل').length;
  const countActive = apps.filter(a => a.status === 'مقبول').length;
  const countGraduated = 7; // Certified graduated from directory

  let totalWorkHours = apps.reduce((acc, a) => acc + (parseInt(a.workHours) || 0), 4470);
  let totalVolHours = apps.reduce((acc, a) => acc + (parseInt(a.volunteerHours) || 0), 16311);

  const kpiPending = document.getElementById('admin-kpi-pending');
  const kpiActive = document.getElementById('admin-kpi-active');
  const kpiGraduated = document.getElementById('admin-kpi-graduated');
  const kpiWork = document.getElementById('admin-kpi-work');
  const kpiVol = document.getElementById('admin-kpi-vol');
  const kpiBookings = document.getElementById('admin-kpi-bookings');

  if (kpiPending) kpiPending.textContent = countPending;
  if (kpiActive) kpiActive.textContent = countActive;
  if (kpiGraduated) kpiGraduated.textContent = countGraduated;
  if (kpiWork) kpiWork.textContent = `+${totalWorkHours.toLocaleString('en-US')}`;
  if (kpiVol) kpiVol.textContent = `+${totalVolHours.toLocaleString('en-US')}`;
  if (kpiBookings) kpiBookings.textContent = bookings.length + consults.length;

  // Update Badges
  const appsBadge = document.getElementById('admin-apps-badge');
  const bksBadge = document.getElementById('admin-bookings-badge');
  const cnsBadge = document.getElementById('admin-consults-badge');

  if (appsBadge) appsBadge.textContent = apps.length;
  if (bksBadge) bksBadge.textContent = bookings.length;
  if (cnsBadge) cnsBadge.textContent = consults.length;

  // Update Pill Counts
  const cntAll = document.getElementById('admin-cnt-all');
  const cntReview = document.getElementById('admin-cnt-review');
  const cntRevision = document.getElementById('admin-cnt-revision');
  const cntApproved = document.getElementById('admin-cnt-approved');
  const cntRejected = document.getElementById('admin-cnt-rejected');

  if (cntAll) cntAll.textContent = apps.length;
  if (cntReview) cntReview.textContent = apps.filter(a => a.status === 'تحت المراجعة').length;
  if (cntRevision) cntRevision.textContent = apps.filter(a => a.status === 'مطلوب تعديل').length;
  if (cntApproved) cntApproved.textContent = apps.filter(a => a.status === 'مقبول').length;
  if (cntRejected) cntRejected.textContent = apps.filter(a => a.status === 'مرفوض').length;

  // Render Sub-Components for All 4 Tracks
  renderAdminApplicationsTable();
  renderAdminVolunteeringTable();
  renderAdminConsultationsTable();
  renderAdminServicesTable();
  renderAdminKanbanBoard();
  renderAdminAnalyticsAndLogs();
  populateAdminModalSelects();
}

// Helper: Filter admin applications by clicking summary cards
window.filterAdminByModeCard = function(mode) {
  const select = document.getElementById('adminModeFilter');
  if (select) {
    select.value = mode;
    filterAdminApplications();
  }
};

// Helper: Get Association Incubation Mode Info (Badge, Label, Type)
window.getAssociationModeInfo = function(assocName) {
  if (!assocName) return { mode: 'spatial', title: 'احتضان مكاني وتشغيلي', badgeHtml: '<span class="badge" style="background: var(--c-primary-subtle); color: var(--c-primary); font-size: 0.68rem; padding: 2px 7px; border: 1px solid rgba(13,148,136,0.25);"><i class="fa-solid fa-building"></i> احتضان مكاني</span>' };

  const app = (APP_STATE.applications || []).find(a => a.associationName === assocName);
  if (app) {
    const mode = app.incubationMode || (app.licenseNumber === 'قيد التأسيس' ? 'idea' : (app.track?.includes('مسرعة') ? 'accelerator' : 'spatial'));
    return {
      mode: mode,
      title: mode === 'idea' ? 'احتضان فكرة ومبادرة' : (mode === 'accelerator' ? 'مسرعة أعمال ونمو الأثر' : 'احتضان مكاني وتشغيلي'),
      badgeHtml: mode === 'idea'
        ? '<span class="badge" style="background: #FEF3C7; color: #92400E; font-size: 0.68rem; padding: 2px 7px; border: 1px solid #FCD34D;"><i class="fa-solid fa-lightbulb"></i> فكرة ومبادرة</span>'
        : (mode === 'accelerator'
          ? '<span class="badge" style="background: #EDE9FE; color: #5B21B6; font-size: 0.68rem; padding: 2px 7px; border: 1px solid #DDD6FE;"><i class="fa-solid fa-rocket"></i> مسرعة أعمال</span>'
          : '<span class="badge" style="background: var(--c-primary-subtle); color: var(--c-primary); font-size: 0.68rem; padding: 2px 7px; border: 1px solid rgba(13,148,136,0.25);"><i class="fa-solid fa-building"></i> احتضان مكاني</span>')
    };
  }

  const assoc = (APP_STATE.associations || []).find(a => a.name === assocName);
  if (assoc) {
    const isGrad = assoc.status === 'متخرجة' || (assoc.track || '').includes('مسرعة');
    const isIdea = (assoc.badge || '').includes('فكرة') || assoc.lic === 'قيد التأسيس' || assoc.name.includes('همم');
    const mode = isIdea ? 'idea' : (isGrad ? 'accelerator' : 'spatial');
    return {
      mode: mode,
      title: mode === 'idea' ? 'احتضان فكرة ومبادرة' : (mode === 'accelerator' ? 'مسرعة أعمال ونمو الأثر' : 'احتضان مكاني وتشغيلي'),
      badgeHtml: mode === 'idea'
        ? '<span class="badge" style="background: #FEF3C7; color: #92400E; font-size: 0.68rem; padding: 2px 7px; border: 1px solid #FCD34D;"><i class="fa-solid fa-lightbulb"></i> فكرة ومبادرة</span>'
        : (mode === 'accelerator'
          ? '<span class="badge" style="background: #EDE9FE; color: #5B21B6; font-size: 0.68rem; padding: 2px 7px; border: 1px solid #DDD6FE;"><i class="fa-solid fa-rocket"></i> مسرعة أعمال</span>'
          : '<span class="badge" style="background: var(--c-primary-subtle); color: var(--c-primary); font-size: 0.68rem; padding: 2px 7px; border: 1px solid rgba(13,148,136,0.25);"><i class="fa-solid fa-building"></i> احتضان مكاني</span>')
    };
  }

  return {
    mode: 'spatial',
    title: 'احتضان مكاني وتشغيلي',
    badgeHtml: '<span class="badge" style="background: var(--c-primary-subtle); color: var(--c-primary); font-size: 0.68rem; padding: 2px 7px; border: 1px solid rgba(13,148,136,0.25);"><i class="fa-solid fa-building"></i> احتضان مكاني</span>'
  };
};

// 4. Render Applications Table
function renderAdminApplicationsTable() {
  const tbody = document.getElementById('admin-applications-tbody');
  if (!tbody) return;

  // Update mode counts on the 3 strip cards
  const cntModeIdea = document.getElementById('cnt-mode-idea');
  const cntModeSpatial = document.getElementById('cnt-mode-spatial');
  const cntModeAcc = document.getElementById('cnt-mode-accelerator');
  if (cntModeIdea) cntModeIdea.textContent = (APP_STATE.associations || []).filter(a => (a.badge || '').includes('فكرة') || a.lic === 'قيد التأسيس' || a.name.includes('همم')).length || 1;
  if (cntModeSpatial) cntModeSpatial.textContent = (APP_STATE.associations || []).filter(a => a.status === 'محتضنة' && !(a.track || '').includes('مسرعة')).length || 13;
  if (cntModeAcc) cntModeAcc.textContent = (APP_STATE.associations || []).filter(a => a.status === 'متخرجة' || (a.track || '').includes('مسرعة')).length || 8;

  const apps = APP_STATE.applications || [];
  const query = (document.getElementById('adminAppSearch')?.value || '').trim().toLowerCase();
  const trackFilter = document.getElementById('adminTrackFilter')?.value || 'all';
  const modeFilter = document.getElementById('adminModeFilter')?.value || 'all';

  let filtered = apps.filter(app => {
    // Status Filter
    if (adminCurrentStatusFilter !== 'all' && app.status !== adminCurrentStatusFilter) {
      return false;
    }
    // Track Filter
    if (trackFilter !== 'all' && !(app.track || '').includes(trackFilter)) {
      return false;
    }
    // Mode Filter (وضع ومسار الجمعية)
    if (modeFilter !== 'all') {
      const appMode = app.incubationMode || (app.licenseNumber === 'قيد التأسيس' ? 'idea' : (app.track?.includes('مسرعة') ? 'accelerator' : 'spatial'));
      if (appMode !== modeFilter) return false;
    }
    // Search Query
    if (query) {
      const matchName = (app.associationName || '').toLowerCase().includes(query);
      const matchLic = (app.licenseNumber || '').toLowerCase().includes(query);
      const matchRep = (app.repName || '').toLowerCase().includes(query);
      const matchPhone = (app.repPhone || '').toLowerCase().includes(query);
      if (!matchName && !matchLic && !matchRep && !matchPhone) return false;
    }
    return true;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align: center; padding: 36px 20px; color: var(--c-text-muted);">
          <i class="fa-solid fa-inbox" style="font-size: 2rem; color: var(--c-border); margin-bottom: 10px; display: block;"></i>
          <strong>لا توجد طلبات تطابق معايير البحث والفلترة المحددة</strong>
          <div style="font-size: 0.78rem; margin-top: 4px;">يمكنك تجربة تغيير كلمات البحث أو إعادة تعيين الفلاتر.</div>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map(app => {
    let statusBg = 'rgba(13,148,136,0.12)';
    let statusColor = '#0D9488';
    let statusIcon = 'fa-check';

    if (app.status === 'مرفوض') {
      statusBg = 'rgba(239,68,68,0.12)';
      statusColor = '#EF4444';
      statusIcon = 'fa-xmark';
    } else if (app.status === 'مطلوب تعديل') {
      statusBg = 'rgba(245,158,11,0.15)';
      statusColor = '#D97706';
      statusIcon = 'fa-pen';
    } else if (app.status === 'تحت المراجعة') {
      statusBg = 'rgba(59,130,246,0.12)';
      statusColor = '#2563EB';
      statusIcon = 'fa-clock';
    }

    const empStatusText = app.fullTimeEmployee || 'موظف دوام كامل: قيد الاستكمال';
    const isEmpOk = empStatusText.includes('متوفر');
    const examScore = parseInt(app.examScore, 10) || 0;
    const isScoreOk = examScore >= 85;

    // Incubation Mode Badge
    const appMode = app.incubationMode || (app.licenseNumber === 'قيد التأسيس' ? 'idea' : (app.track?.includes('مسرعة') ? 'accelerator' : 'spatial'));
    let modeBadge = '';
    if (appMode === 'idea') {
      modeBadge = `<span class="badge" style="background: #FEF3C7; color: #92400E; font-size: 0.68rem; padding: 1px 6px; border: 1px solid #FCD34D;"><i class="fa-solid fa-lightbulb"></i> فكرة ومبادرة</span>`;
    } else if (appMode === 'accelerator') {
      modeBadge = `<span class="badge" style="background: #EDE9FE; color: #5B21B6; font-size: 0.68rem; padding: 1px 6px; border: 1px solid #DDD6FE;"><i class="fa-solid fa-rocket"></i> مسرعة أعمال</span>`;
    } else {
      modeBadge = `<span class="badge" style="background: var(--c-primary-subtle); color: var(--c-primary); font-size: 0.68rem; padding: 1px 6px; border: 1px solid rgba(13,148,136,0.25);"><i class="fa-solid fa-building"></i> احتضان مكاني</span>`;
    }

    return `
      <tr>
        <td>
          <div style="font-weight: 800; color: var(--c-primary); font-size: 0.92rem; margin-bottom: 3px;">
            ${app.associationName}
          </div>
          <div style="display: flex; gap: 6px; align-items: center; flex-wrap: wrap;">
            ${modeBadge}
            <span class="badge" style="background: rgba(0,0,0,0.04); color: var(--c-text); font-size: 0.68rem; padding: 1px 6px;">
              ${app.incubationType || 'مكتب مجهز'}
            </span>
            <span style="font-size: 0.72rem; color: var(--c-text-muted);">${app.city || 'المدينة المنورة'}</span>
          </div>
        </td>

        <td>
          <div style="font-weight: 700; color: var(--c-text);">${app.licenseNumber}</div>
          <small style="font-size: 0.72rem; color: var(--c-text-muted);">700: ${app.nationalNumber700 || '7009823411'}</small>
        </td>

        <td>
          <div style="font-weight: 700;">${app.repName || 'المفوض الرسمي'}</div>
          <a href="tel:${app.repPhone}" style="font-size: 0.75rem; color: var(--c-primary); text-decoration: none; display: inline-flex; align-items: center; gap: 4px;">
            <i class="fa-solid fa-phone" style="font-size: 0.7rem;"></i> ${app.repPhone || '0551234567'}
          </a>
        </td>

        <td>
          <div style="font-size: 0.8rem; font-weight: 700; margin-bottom: 4px;">${app.track}</div>
          <div style="display: flex; align-items: center; gap: 6px;">
            <div style="flex: 1; height: 5px; background: var(--c-border); border-radius: 3px; overflow: hidden; min-width: 60px;">
              <div style="width: ${examScore}%; height: 100%; background: ${isScoreOk ? '#0E6E41' : '#F59E0B'};"></div>
            </div>
            <span style="font-size: 0.72rem; font-weight: 800; color: ${isScoreOk ? '#0E6E41' : '#D97706'};">
              ${examScore}/100
            </span>
          </div>
        </td>

        <td>
          <span class="badge" style="background: var(--c-gold-subtle); color: var(--c-gold-dark); padding: 4px 10px; border-radius: 6px; font-weight: 800; font-size: 0.75rem; display: inline-block;">
            ${app.stage}
          </span>
          <div style="margin-top: 4px; font-size: 0.72rem; color: ${isEmpOk ? '#0E6E41' : '#D97706'}; font-weight: 600;">
            <i class="fa-solid ${isEmpOk ? 'fa-circle-check' : 'fa-clock'}"></i> ${isEmpOk ? 'موظف متفرغ ✓' : 'الموظف قيد التعيين'}
          </div>
        </td>

        <td>
          <span class="badge" style="background: ${statusBg}; color: ${statusColor}; padding: 4px 10px; border-radius: 20px; font-weight: 800; display: inline-flex; align-items: center; gap: 4px;">
            <i class="fa-solid ${statusIcon}"></i> ${app.status}
          </span>
        </td>

        <td style="text-align: center;">
          <div style="display: inline-flex; gap: 4px; align-items: center; justify-content: center;">
            <button class="admin-btn-action-icon" onclick="adminViewAppDetails('${app.id}')" title="معاينة كامل الملف والشواهد الـ 7">
              <i class="fa-solid fa-eye"></i>
            </button>
            <button class="admin-btn-action-icon btn-action-approve" onclick="adminOpenDecisionModal('${app.id}', 'approve')" title="قبول واعتماد الطلب">
              <i class="fa-solid fa-check"></i>
            </button>
            <button class="admin-btn-action-icon btn-action-revision" onclick="adminOpenDecisionModal('${app.id}', 'revision')" title="طلب تعديل واستيفاء النواقص">
              <i class="fa-solid fa-pen"></i>
            </button>
            <button class="admin-btn-action-icon btn-action-reject" onclick="adminOpenDecisionModal('${app.id}', 'reject')" title="رفض الطلب مع إبداء السبب">
              <i class="fa-solid fa-xmark"></i>
            </button>
            <button class="admin-btn-action-icon" style="color: #EF4444;" onclick="adminDeleteApp('${app.id}')" title="حذف الطلب">
              <i class="fa-regular fa-trash-can"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

// 5. Render BPMN Kanban Board
function renderAdminKanbanBoard() {
  const apps = APP_STATE.applications || [];
  const stages = [
    { key: 'stage1', title: 'المرحلة الأولى: احتضان الفكرة', num: 1 },
    { key: 'stage2', title: 'المرحلة الثانية: التهيئة المؤسسية', num: 2 },
    { key: 'stage3', title: 'المرحلة الثالثة: الاحتضان المكاني', num: 3 },
    { key: 'stage4', title: 'المرحلة الرابعة: مسرعة عذق', num: 4 }
  ];

  stages.forEach(st => {
    const colEl = document.getElementById(`kanban-cards-${st.key}`);
    const cntEl = document.getElementById(`kanban-cnt-${st.key}`);
    const matchedApps = apps.filter(a => (a.stage || '').includes(st.title) || (a.stage || '').includes(st.title.split(':')[1]?.trim()));

    if (cntEl) cntEl.textContent = matchedApps.length;

    if (colEl) {
      if (matchedApps.length === 0) {
        colEl.innerHTML = `
          <div style="border: 2px dashed var(--c-border); border-radius: 8px; padding: 24px 14px; text-align: center; color: var(--c-text-muted); font-size: 0.78rem;">
            لا توجد جمعيات في هذه المرحلة حالياً
          </div>
        `;
      } else {
        colEl.innerHTML = matchedApps.map(app => {
          const progress = app.stageProgress || (st.num * 25);
          return `
            <div class="admin-kanban-card">
              <div class="admin-kanban-card-title">
                <span>${app.associationName}</span>
                <span style="font-size: 0.72rem; color: var(--c-text-muted); font-weight: normal;">#${app.licenseNumber}</span>
              </div>
              <div class="admin-kanban-card-sub">
                <i class="fa-solid fa-route"></i> ${app.track}
              </div>

              <div class="admin-kanban-progress-box">
                <div class="admin-kanban-progress-labels">
                  <span>إنجاز متطلبات المرحلة:</span>
                  <span>${progress}%</span>
                </div>
                <div class="admin-kanban-progress-track">
                  <div class="admin-kanban-progress-fill" style="width: ${progress}%;"></div>
                </div>
              </div>

              <div class="admin-kanban-actions">
                ${st.num > 1 ? `
                  <button class="btn btn-outline btn-sm" style="padding: 3px 8px; font-size: 0.72rem;" onclick="adminDemoteStage('${app.id}')" title="إرجاع للمرحلة السابقة">
                    <i class="fa-solid fa-arrow-right"></i> السابقة
                  </button>
                ` : ''}

                ${st.num < 4 ? `
                  <button class="btn btn-primary btn-sm" style="padding: 3px 10px; font-size: 0.72rem;" onclick="adminPromoteStage('${app.id}')" title="ترقية للمرحلة التالية">
                    ترقية <i class="fa-solid fa-arrow-left"></i>
                  </button>
                ` : `
                  <button class="btn btn-gold btn-sm" style="padding: 3px 10px; font-size: 0.72rem;" onclick="adminGraduateApp('${app.id}')" title="اعتماد التخرج المستدام">
                    <i class="fa-solid fa-graduation-cap"></i> اعتماد التخرج
                  </button>
                `}
              </div>
            </div>
          `;
        }).join('');
      }
    }
  });
}

// 6. Render Volunteering Track Table (مسار التطوع وساعات العطاء)
window.renderAdminVolunteeringTable = function() {
  const tbody = document.getElementById('admin-volunteering-tbody');
  if (!tbody) return;

  const list = APP_STATE.volunteering || [];
  const modeFilter = document.getElementById('adminVolModeFilter')?.value || 'all';
  const query = (document.getElementById('adminVolSearch')?.value || '').trim().toLowerCase();

  let filtered = list.filter(item => {
    const info = getAssociationModeInfo(item.assocName);
    if (modeFilter !== 'all' && info.mode !== modeFilter) return false;
    if (query) {
      const matchName = (item.assocName || '').toLowerCase().includes(query);
      const matchTitle = (item.opportunityTitle || '').toLowerCase().includes(query);
      const matchCat = (item.category || '').toLowerCase().includes(query);
      if (!matchName && !matchTitle && !matchCat) return false;
    }
    return true;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align: center; padding: 28px; color: var(--c-text-muted);">
          <i class="fa-solid fa-hand-holding-heart" style="font-size: 1.8rem; margin-bottom: 6px; display: block; color: var(--c-border);"></i>
          لا توجد فرص تطوعية تطابق معايير الفرز المحددة
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map(v => {
    const info = getAssociationModeInfo(v.assocName);
    return `
      <tr>
        <td>
          <div style="font-weight: 800; color: var(--c-primary); font-size: 0.92rem; margin-bottom: 3px;">
            ${v.assocName}
          </div>
          <div style="display: flex; gap: 6px; align-items: center; flex-wrap: wrap;">
            ${info.badgeHtml}
            <span style="font-size: 0.72rem; color: var(--c-text-muted);">${v.category || 'تطوع تخصصي'}</span>
          </div>
        </td>
        <td>
          <div style="font-weight: 700; color: var(--c-text-primary); font-size: 0.86rem;">${v.opportunityTitle}</div>
          <span style="font-size: 0.72rem; color: var(--c-text-muted);">مرجع المنصة: <code>${v.platformRef}</code></span>
        </td>
        <td style="text-align: center;">
          <span class="badge" style="background: rgba(13,148,136,0.1); color: var(--c-primary); font-weight: 800; font-size: 0.78rem;">
            ${v.volunteersCount} متطوع
          </span>
        </td>
        <td style="text-align: center;">
          <strong style="color: #0D6E46; font-size: 0.95rem;">+${v.hoursCount.toLocaleString()} س</strong>
        </td>
        <td style="text-align: center; font-weight: 800; color: #92400E;">
          ${v.economicImpact}
        </td>
        <td style="text-align: center;">
          <span class="badge" style="background: #DCFCE7; color: #166534; font-weight: 800; border: 1px solid #86EFAC; font-size: 0.72rem;">
            <i class="fa-solid fa-circle-check"></i> ${v.status}
          </span>
        </td>
        <td style="text-align: center;">
          <button class="btn btn-outline btn-sm" style="padding: 3px 10px; font-size: 0.72rem;" onclick="showToast('تم فتح إفادة توثيق الساعات التطوعية المعتمدة رسمياً', 'info')">
            <i class="fa-solid fa-file-lines"></i> إفادة
          </button>
        </td>
      </tr>
    `;
  }).join('');
};

window.exportVolunteeringReport = function() {
  const list = APP_STATE.volunteering || [];
  const headers = ['الجمعية المستفيدة', 'وضع الجمعية', 'المبادرة التطوعية', 'المجال', 'عدد المتطوعين', 'ساعات التطوع', 'العائد التقديري', 'المرجع الوطني', 'الحالة'];

  let csvContent = '\uFEFF';
  csvContent += headers.join(',') + '\r\n';

  list.forEach(v => {
    const info = getAssociationModeInfo(v.assocName);
    const row = [
      `"${v.assocName}"`,
      `"${info.title}"`,
      `"${v.opportunityTitle}"`,
      `"${v.category}"`,
      `"${v.volunteersCount}"`,
      `"${v.hoursCount}"`,
      `"${v.economicImpact}"`,
      `"${v.platformRef}"`,
      `"${v.status}"`
    ];
    csvContent += row.join(',') + '\r\n';
  });

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `سجل_مسار_التطوع_المعتمد_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  showToast('تم تصدير سجل مسار التطوع Excel (CSV) بنجاح!', 'success');
};

// 7. Render Consultations Track Table (مسار الاستشارات والخبراء)
window.renderAdminConsultationsTable = function() {
  const tbody = document.getElementById('admin-consultations-tbody');
  if (!tbody) return;

  const consults = APP_STATE.consultations || [];
  const modeFilter = document.getElementById('adminConsModeFilter')?.value || 'all';
  const fieldFilter = document.getElementById('adminConsFieldFilter')?.value || 'all';
  const query = (document.getElementById('adminConsSearch')?.value || '').trim().toLowerCase();

  let filtered = consults.filter(c => {
    const info = getAssociationModeInfo(c.assocName);
    if (modeFilter !== 'all' && info.mode !== modeFilter) return false;
    if (fieldFilter !== 'all' && !(c.field || '').includes(fieldFilter)) return false;
    if (query) {
      const matchName = (c.assocName || '').toLowerCase().includes(query);
      const matchCons = (c.consultant || '').toLowerCase().includes(query);
      const matchField = (c.field || '').toLowerCase().includes(query);
      if (!matchName && !matchCons && !matchField) return false;
    }
    return true;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center; padding: 28px; color: var(--c-text-muted);">
          <i class="fa-solid fa-user-tie" style="font-size: 1.8rem; margin-bottom: 6px; display: block; color: var(--c-border);"></i>
          لا توجد استشارات تطابق معايير الفلترة المحددة
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map(c => {
    const info = getAssociationModeInfo(c.assocName);
    const isDone = (c.status || '').includes('منجزة');
    return `
      <tr>
        <td>
          <div style="font-weight: 800; color: var(--c-primary); display: flex; align-items: center; gap: 8px;">
            <i class="fa-solid fa-user-tie"></i> ${c.consultant}
          </div>
        </td>
        <td>
          <div style="font-weight: 800; font-size: 0.92rem; margin-bottom: 3px;">${c.assocName}</div>
          <div style="display: flex; gap: 6px; align-items: center;">
            ${info.badgeHtml}
          </div>
        </td>
        <td>
          <div style="font-weight: 700; color: var(--c-text-primary);">${c.field || 'حوكمة واستشارات مؤسسية'}</div>
        </td>
        <td>
          <div style="font-size: 0.82rem; color: var(--c-text); font-weight: 700;">${c.date}</div>
          <span style="font-size: 0.72rem; color: var(--c-text-muted);">${c.time || '10:00 ص - 12:00 م'}</span>
        </td>
        <td style="text-align: center;">
          <span class="badge" style="background: ${isDone ? '#DCFCE7' : '#FEF3C7'}; color: ${isDone ? '#166534' : '#92400E'}; font-weight: 800; border: 1px solid ${isDone ? '#86EFAC' : '#FCD34D'};">
            ${c.status || 'مجدولة'}
          </span>
        </td>
        <td style="text-align: center;">
          <div style="display: flex; gap: 6px; justify-content: center; flex-wrap: wrap;">
            <button class="btn btn-outline btn-sm" style="padding: 3px 8px; font-size: 0.72rem;" onclick="adminViewConsultationReport('${c.id}')" title="عرض التقرير">
              <i class="fa-solid fa-file-lines"></i> التقرير
            </button>
            <button class="btn btn-primary btn-sm" style="padding: 3px 8px; font-size: 0.72rem;" onclick="AthqPrint.printConsultationReport('${c.assocName}', '${c.consultant}', '${c.field}')" title="طباعة">
              <i class="fa-solid fa-print"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
};

// 8. Render Services, Products & Facilities Track Table (مسار الخدمات والمنتجات والمرافق)
window.renderAdminServicesTable = function() {
  const tbody = document.getElementById('admin-services-tbody') || document.getElementById('admin-bookings-tbody');
  if (!tbody) return;

  const list = APP_STATE.services || APP_STATE.bookings || [];
  const modeFilter = document.getElementById('adminServicesModeFilter')?.value || 'all';
  const catFilter = document.getElementById('adminServicesCategoryFilter')?.value || 'all';
  const query = (document.getElementById('adminServicesSearch')?.value || '').trim().toLowerCase();

  let filtered = list.filter(s => {
    const info = getAssociationModeInfo(s.assocName);
    if (modeFilter !== 'all' && info.mode !== modeFilter) return false;
    if (catFilter !== 'all' && !(s.category || s.facility || '').includes(catFilter)) return false;
    if (query) {
      const matchName = (s.assocName || '').toLowerCase().includes(query);
      const matchTitle = (s.title || s.facility || '').toLowerCase().includes(query);
      const matchCat = (s.category || '').toLowerCase().includes(query);
      if (!matchName && !matchTitle && !matchCat) return false;
    }
    return true;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center; padding: 28px; color: var(--c-text-muted);">
          <i class="fa-solid fa-boxes-packing" style="font-size: 1.8rem; margin-bottom: 6px; display: block; color: var(--c-border);"></i>
          لا توجد خدمات تطابق معايير الفلترة المحددة
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map(s => {
    const info = getAssociationModeInfo(s.assocName);
    const serviceName = s.title || s.facility || 'خدمة مقر معتمدة';
    let icon = 'fa-boxes-packing';
    if (serviceName.includes('مكتب') || serviceName.includes('مقر')) icon = 'fa-building';
    if (serviceName.includes('قاعة') || serviceName.includes('اجتماع')) icon = 'fa-chalkboard-user';
    if (serviceName.includes('عنوان') || serviceName.includes('بريد')) icon = 'fa-envelope-open-text';
    if (serviceName.includes('سحاب') || serviceName.includes('محاسب')) icon = 'fa-cloud';

    return `
      <tr>
        <td>
          <div style="font-weight: 800; color: var(--c-primary); display: flex; align-items: center; gap: 8px;">
            <i class="fa-solid ${icon}"></i> ${serviceName}
          </div>
          <span style="font-size: 0.72rem; color: var(--c-text-muted);">كود الخدمة: <code>${s.id || 'SRV-01'}</code></span>
        </td>
        <td>
          <div style="font-weight: 800; font-size: 0.92rem; margin-bottom: 3px;">${s.assocName}</div>
          <div style="display: flex; gap: 6px; align-items: center;">
            ${info.badgeHtml}
          </div>
        </td>
        <td>
          <span class="badge" style="background: rgba(0,0,0,0.04); color: var(--c-text-primary); font-weight: 700;">
            ${s.category || 'تجهيز مكتبي وذكي'}
          </span>
          <div style="font-size: 0.72rem; color: var(--c-text-muted); margin-top: 2px;">${s.specs || 'شاشات ذكية + إنترنت + ضيافة'}</div>
        </td>
        <td>
          <div style="font-size: 0.82rem; font-weight: 700;">${s.date}</div>
          <span style="font-size: 0.72rem; color: var(--c-text-muted);">${s.time || 'دوام كامل'}</span>
        </td>
        <td style="text-align: center;">
          <span class="badge" style="background: #DCFCE7; color: #166534; font-weight: 800; border: 1px solid #86EFAC;">
            ${s.status || 'نشط ومفعل ✓'}
          </span>
        </td>
        <td style="text-align: center;">
          <div style="display: flex; gap: 6px; justify-content: center; flex-wrap: wrap;">
            <button class="btn btn-outline btn-sm" style="padding: 3px 8px; font-size: 0.72rem;" onclick="AthqPrint.printBookingPass('${s.assocName}', '${serviceName}', '${s.date}', '${s.time || 'دوام كامل'}')" title="طباعة تصريح الحجز">
              <i class="fa-solid fa-print"></i> تصريح
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
};

window.renderAdminBookingsTable = function() {
  renderAdminServicesTable();
};

// 8. Render Analytics Charts & Audit Logs
function renderAdminAnalyticsAndLogs() {
  const apps = APP_STATE.applications || [];
  const chartContainer = document.getElementById('admin-chart-stages-container');

  if (chartContainer) {
    const total = Math.max(1, apps.length);
    const stages = [
      { name: 'المرحلة 1: احتضان الفكرة', color: '#0D9488' },
      { name: 'المرحلة 2: التهيئة واللوائح', color: 'var(--c-primary)' },
      { name: 'المرحلة 3: الاحتضان المكاني', color: 'var(--c-gold)' },
      { name: 'المرحلة 4: مسرعة الأعمال', color: '#DDA028' }
    ];

    chartContainer.innerHTML = stages.map((st, idx) => {
      const count = apps.filter(a => (a.stage || '').includes(idx + 1) || (a.stage || '').includes(st.name.split(':')[0])).length;
      const pct = Math.max(15, Math.round((count / total) * 100));
      return `
        <div class="chart-bar-row">
          <span class="chart-bar-label">${st.name}</span>
          <div class="chart-bar-track">
            <div class="chart-bar-fill" style="width: ${pct}%; background: ${st.color};"></div>
          </div>
          <span class="chart-bar-val">${count} جهات</span>
        </div>
      `;
    }).join('');
  }

  // Audit Logs
  const logsContainer = document.getElementById('admin-audit-logs-list');
  if (logsContainer && APP_STATE.auditLogs) {
    logsContainer.innerHTML = APP_STATE.auditLogs.slice(0, 6).map(log => `
      <div class="admin-audit-item">
        <div class="admin-audit-icon" style="background: rgba(14,110,65,0.1); color: ${log.color || 'var(--c-primary)'};">
          <i class="fa-solid ${log.icon || 'fa-circle-check'}"></i>
        </div>
        <div style="flex: 1;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px;">
            <strong style="color: var(--c-text); font-size: 0.85rem;">${log.title}</strong>
            <span style="font-size: 0.72rem; color: var(--c-text-muted);">${log.time}</span>
          </div>
          <div style="color: var(--c-text-muted); font-size: 0.78rem;">${log.text}</div>
        </div>
      </div>
    `).join('');
  }
}

// 9. Populate Modal Selects
function populateAdminModalSelects() {
  const apps = APP_STATE.applications || [];
  const bkSelect = document.getElementById('newBkAssoc');
  const cnsSelect = document.getElementById('newCnsAssoc');

  const optionsHtml = apps.map(a => `<option value="${a.associationName}">${a.associationName} (${a.licenseNumber})</option>`).join('');

  if (bkSelect) bkSelect.innerHTML = optionsHtml;
  if (cnsSelect) cnsSelect.innerHTML = optionsHtml;
}

// ========================== Admin Operations & Interactive Modals ==========================

// Open Full Application Details Modal
window.adminViewAppDetails = function(id) {
  const app = APP_STATE.applications.find(a => a.id === id);
  if (!app) return;

  const modal = document.getElementById('modalAdminAppDetails');
  if (!modal) return;

  document.getElementById('admin-detail-title').textContent = app.associationName;
  document.getElementById('admin-detail-sub').textContent = `كود الطلب: ${app.id} • ${app.city || 'المدينة المنورة'} • المركز الوطني NCNP`;
  
  const statusBadge = document.getElementById('admin-detail-status-badge');
  if (statusBadge) {
    statusBadge.textContent = app.status;
  }

  // Incubation Mode Display
  const modeEl = document.getElementById('admin-detail-mode');
  const ideaBox = document.getElementById('admin-detail-idea-box');
  const ideaText = document.getElementById('admin-detail-idea-text');
  const appMode = app.incubationMode || (app.licenseNumber === 'قيد التأسيس' ? 'idea' : (app.track?.includes('مسرعة') ? 'accelerator' : 'spatial'));

  if (modeEl) {
    if (appMode === 'idea') {
      modeEl.innerHTML = `<span style="display: inline-flex; align-items: center; gap: 6px; background: #FEF3C7; color: #92400E; padding: 4px 10px; border-radius: 6px; font-weight: 800; border: 1px solid #FCD34D;"><i class="fa-solid fa-lightbulb"></i> احتضان فكرة ومبادرة جديدة (مرحلة التأسيس وما قبله)</span>`;
      if (ideaBox) ideaBox.style.display = 'block';
      if (ideaText) ideaText.textContent = app.ideaSummary || app.notes || 'مبادرة نوعية تهدف لتقديم حلول مجتمعية مبتكرة واستكمال التأسيس الرسمي.';
    } else if (appMode === 'accelerator') {
      modeEl.innerHTML = `<span style="display: inline-flex; align-items: center; gap: 6px; background: #EDE9FE; color: #5B21B6; padding: 4px 10px; border-radius: 6px; font-weight: 800; border: 1px solid #DDD6FE;"><i class="fa-solid fa-rocket"></i> مسرعة أعمال ونمو الأثر (جمعية قائمة مرخصة)</span>`;
      if (ideaBox) ideaBox.style.display = 'none';
    } else {
      modeEl.innerHTML = `<span style="display: inline-flex; align-items: center; gap: 6px; background: var(--c-primary-subtle); color: var(--c-primary); padding: 4px 10px; border-radius: 6px; font-weight: 800; border: 1px solid rgba(13,148,136,0.3);"><i class="fa-solid fa-building"></i> احتضان مكاني وتشغيلي (مقر مرخص + عنوان وطني + قاعات)</span>`;
      if (ideaBox) ideaBox.style.display = 'none';
    }
  }

  document.getElementById('admin-detail-lic').textContent = app.licenseNumber;
  document.getElementById('admin-detail-700').textContent = app.nationalNumber700 || '7009823411';
  document.getElementById('admin-detail-rep').textContent = `${app.repName || 'المفوض الرسمي'} (${app.repPhone || '0551234567'})`;
  document.getElementById('admin-detail-track').textContent = `${app.track} • (${app.incubationType || 'مكتب مجهز'})`;
  
  const examScore = parseInt(app.examScore, 10) || 85;
  document.getElementById('admin-detail-score').textContent = `${examScore}/100 (${examScore >= 85 ? 'مستوفى شرط الجاهزية 85% ✓' : 'يتطلب إعادة الاختبار'})`;
  
  const empEl = document.getElementById('admin-detail-employee');
  const isEmpOk = (app.fullTimeEmployee || '').includes('متوفر');
  empEl.textContent = app.fullTimeEmployee || (isEmpOk ? 'متوفر ومسجل ✓' : 'قيد الاستكمال');
  empEl.style.color = isEmpOk ? '#0E6E41' : '#D97706';

  document.getElementById('admin-detail-notes').textContent = app.notes || 'لا توجد ملاحظات إضافية مسجلة.';

  // Evidences
  const evidencesList = document.getElementById('admin-detail-evidences');
  const defaultEvidences = [
    { title: "عقد الاحتضان المعتمد", status: "معتمد وموقّع ✓" },
    { title: "تقرير الاستيفاء والمطابقة المؤسسية", status: "مستوفى بنجاح ✓" },
    { title: "خطاب حسم أداء الجمعية", status: "معتمد ✓" },
    { title: "نموذج طلب الانضمام موقّع ومختوم", status: "مكتمل ✓" },
    { title: "نموذج استلام المفتاح والعهد المكتبي", status: "مستلم رسمياً ✓" },
    { title: "وثيقة سياسة الأمان وبصمة الباب الذكية", status: "مفعلة ✓" },
    { title: "شهادة وجود موظف بدوام كامل متفرغ", status: isEmpOk ? "متحقق ومسجل ✓" : "قيد المراجعة" }
  ];
  const evidences = app.evidences || defaultEvidences;

  if (evidencesList) {
    evidencesList.innerHTML = evidences.map((ev, i) => `
      <div class="admin-evidence-row">
        <span><strong style="color: var(--c-primary);">${i + 1}.</strong> ${ev.title}</span>
        <span class="badge" style="background: rgba(14,110,65,0.12); color: #0E6E41; font-weight: 700;">
          <i class="fa-solid fa-check-double"></i> ${ev.status || 'معتمد'}
        </span>
      </div>
    `).join('');
  }

  // Footer Actions
  const footerActions = document.getElementById('admin-detail-actions-footer');
  if (footerActions) {
    footerActions.innerHTML = `
      <button class="btn btn-primary btn-sm" onclick="closeAdminAppDetailsModal(); adminOpenDecisionModal('${app.id}', 'approve');">
        <i class="fa-solid fa-check"></i> قبول واعتماد
      </button>
      <button class="btn btn-sm" style="background: var(--c-gold-subtle); color: var(--c-gold-dark); border: 1px solid var(--c-gold);" onclick="closeAdminAppDetailsModal(); adminOpenDecisionModal('${app.id}', 'revision');">
        <i class="fa-solid fa-pen"></i> طلب تعديل
      </button>
      <button class="btn btn-outline-primary btn-sm" style="color: #EF4444; border-color: #EF4444;" onclick="closeAdminAppDetailsModal(); adminOpenDecisionModal('${app.id}', 'reject');">
        <i class="fa-solid fa-xmark"></i> رفض
      </button>
      <button class="btn btn-outline btn-sm" onclick="closeAdminAppDetailsModal(); adminPromoteStage('${app.id}');">
        <i class="fa-solid fa-stairs"></i> ترقية المرحلة
      </button>
    `;
  }

  modal.classList.add('active');
};

window.closeAdminAppDetailsModal = function() {
  document.getElementById('modalAdminAppDetails')?.classList.remove('active');
};

// Open Professional Decision Modal
window.adminOpenDecisionModal = function(id, type) {
  const app = APP_STATE.applications.find(a => a.id === id);
  if (!app) return;

  const modal = document.getElementById('modalAdminDecision');
  if (!modal) return;

  document.getElementById('adminDecisionAppId').value = id;
  document.getElementById('adminDecisionType').value = type;
  document.getElementById('admin-decision-modal-sub').textContent = `${app.associationName} (ترخيص: ${app.licenseNumber})`;

  const titleEl = document.getElementById('admin-decision-modal-title');
  const headerEl = document.getElementById('admin-decision-header');
  const confirmBtn = document.getElementById('btnAdminConfirmDecision');
  const presetsContainer = document.getElementById('admin-decision-presets');
  const notesText = document.getElementById('adminDecisionNotesText');

  const meetingGroup = document.getElementById('admin-meeting-date-group');
  const meetingInput = document.getElementById('adminOrientationMeetingInput');

  let presets = [];

  if (type === 'approve') {
    titleEl.textContent = 'اعتماد وقبول طلب الاحتضان رسميًا';
    headerEl.style.background = 'linear-gradient(135deg, #09472A 0%, #0E6E41 100%)';
    confirmBtn.className = 'btn btn-primary btn-sm';
    confirmBtn.innerHTML = '<i class="fa-solid fa-check"></i> تأكيد القبول وتحديد موعد اللقاء';
    notesText.value = 'تمت مراجعة ملف الجمعية والمرفقات الثلاثة واعتماد القبول المبدئي وجدولة موعد الاجتماع التعريفي.';
    if (meetingGroup) meetingGroup.style.display = 'block';
    if (meetingInput) meetingInput.value = app.orientationMeetingDate || 'الأحد القادم | الساعة 10:30 صباحاً | قاعة اللقاءات الرئيسية بمقر عذق';
    presets = [
      'استيفاء كامل الشروط واعتماد موعد الاجتماع التعريفي',
      'قبول مبدئي وجدولة اللقاء التعريفي بمقر الحاضنة',
      'اعتماد الطلب والمرفقات وإرسال النماذج الرسمية'
    ];
  } else if (type === 'revision') {
    titleEl.textContent = 'طلب استيفاء نواقص وتعديل الطلب';
    headerEl.style.background = 'linear-gradient(135deg, #9C7818 0%, #C59B27 100%)';
    confirmBtn.className = 'btn btn-gold btn-sm';
    confirmBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> إرسال إشعار التعديل';
    notesText.value = 'يرجى استكمال رفع المستندات الإلزامية وبيانات الموظف المتفرغ بدوام كامل لتتمكن اللجنة من الاعتماد النهائي.';
    if (meetingGroup) meetingGroup.style.display = 'none';
    presets = [
      'استكمال رفع اللائحة الأساسية وتحديث الحساب البنكي',
      'إرفاق شهادة تسجيل موظف متفرغ بدوام كامل',
      'إعادة اختبار جاهزية انطلاقة الأولى لتحقيق درجة مؤهلة',
      'تحديث مصفوفة الصلاحيات واعتماد مجلس الإدارة'
    ];
  } else if (type === 'reject') {
    titleEl.textContent = 'رفض طلب الاحتضان مع إبداء السبب';
    headerEl.style.background = 'linear-gradient(135deg, #991B1B 0%, #DC2626 100%)';
    confirmBtn.className = 'btn btn-outline-primary btn-sm';
    confirmBtn.style.color = '#FFFFFF';
    confirmBtn.style.background = '#EF4444';
    confirmBtn.innerHTML = '<i class="fa-solid fa-xmark"></i> تأكيد رفض الطلب';
    notesText.value = 'نعتذر عن عدم قبول الطلب نظراً لعدم استيفاء شروط النطاق الجغرافي أو نقص المرفقات الرسمية.';
    if (meetingGroup) meetingGroup.style.display = 'none';
    presets = [
      'عدم استيفاء شرط النطاق الجغرافي (المدينة المنورة)',
      'عدم توفر موظف متفرغ بدوام كامل مسجل',
      'نقص في المرفقات الإجبارية الرسمية المطلوبة',
      'عدم اكتمال إجراءات الترخيص من المركز الوطني NCNP'
    ];
  }

  if (presetsContainer) {
    presetsContainer.innerHTML = presets.map(p => `
      <button type="button" class="btn btn-outline btn-sm" style="font-size: 0.75rem; padding: 4px 10px; margin-bottom: 4px;" onclick="document.getElementById('adminDecisionNotesText').value = '${p}'">
        ${p}
      </button>
    `).join('');
  }

  modal.classList.add('active');
};

window.closeAdminDecisionModal = function() {
  document.getElementById('modalAdminDecision')?.classList.remove('active');
};

window.confirmAdminDecisionAction = function() {
  const id = document.getElementById('adminDecisionAppId').value;
  const type = document.getElementById('adminDecisionType').value;
  const notes = document.getElementById('adminDecisionNotesText').value.trim();
  const meetingDateInput = document.getElementById('adminOrientationMeetingInput');
  const scoreInput = document.getElementById('adminDecisionExamScore');
  const empSelect = document.getElementById('adminDecisionEmployeeSelect');

  const app = APP_STATE.applications.find(a => a.id === id);
  if (!app) return;

  if (scoreInput) {
    app.examScore = parseInt(scoreInput.value, 10) || app.examScore || 85;
  }
  if (empSelect) {
    app.fullTimeEmployee = empSelect.value;
  }

  if (type === 'approve') {
    app.status = 'مقبول';
    app.stateMachineState = 'state2_orientation';
    if (meetingDateInput && meetingDateInput.value.trim()) {
      app.orientationMeetingDate = meetingDateInput.value.trim();
    } else {
      app.orientationMeetingDate = 'الأحد القادم | الساعة 10:30 صباحاً | قاعة اللقاءات الرئيسية بمقر عذق';
    }
    app.notes = notes || 'تم اعتماد الطلب رسمياً وجدولة الاجتماع التعريفي وإرسال النماذج الثلاثة للجمعية.';
    addAdminAuditLog(`قبول واعتماد: ${app.associationName}`, `${app.notes} (الموعد: ${app.orientationMeetingDate} • الدرجة: ${app.examScore})`, 'fa-circle-check', '#0E6E41');
    showToast(`تم قبول واعتماد طلب "${app.associationName}" وجدولة الاجتماع وتحديث درجة الاختبار (${app.examScore}/100) بنجاح!`, 'success');
  } else if (type === 'revision') {
    app.status = 'مطلوب تعديل';
    app.notes = `مطلوب استيفاء: ${notes}`;
    addAdminAuditLog(`طلب تعديل: ${app.associationName}`, notes, 'fa-pen-to-square', '#D97706');
    showToast(`تم إشعار "${app.associationName}" بالنواقص المطلوبة للتعديل.`, 'warning');
  } else if (type === 'reject') {
    app.status = 'مرفوض';
    app.stateMachineState = 'state1_rejected';
    app.rejectionReason = notes || 'نعتذر عن عدم قبول الطلب لعدم استيفاء شروط الاحتضان المعتمدة.';
    app.notes = `سبب الرفض: ${app.rejectionReason}`;
    addAdminAuditLog(`رفض الطلب: ${app.associationName}`, app.rejectionReason, 'fa-xmark', '#EF4444');
    showToast(`تم رفض طلب "${app.associationName}". انتهت الرحلة مع إظهار السبب.`, 'error');
  }

  savePlatformState();
  closeAdminDecisionModal();
  renderAdminDashboard();
  renderAssociationDashboard();
};

// Delete Application
window.adminDeleteApp = function(id) {
  const app = APP_STATE.applications.find(a => a.id === id);
  if (!app) return;

  if (confirm(`هل أنت متأكد من رغبتك في حذف طلب "${app.associationName}" نهائياً من المنظومة؟`)) {
    APP_STATE.applications = APP_STATE.applications.filter(a => a.id !== id);
    addAdminAuditLog(`حذف طلب: ${app.associationName}`, 'تم حذف سجل الطلب من المنظومة', 'fa-trash', '#EF4444');
    savePlatformState();
    renderAdminDashboard();
    showToast(`تم حذف طلب "${app.associationName}" بنجاح.`, 'success');
  }
};

// Promote Stage
window.adminPromoteStage = function(id) {
  const app = APP_STATE.applications.find(a => a.id === id);
  if (!app) return;

  const stages = [
    'المرحلة الأولى: احتضان الفكرة',
    'المرحلة الثانية: التهيئة المؤسسية',
    'المرحلة الثالثة: الاحتضان المكاني',
    'المرحلة الرابعة: مسرعة عذق'
  ];

  const curIdx = stages.findIndex(s => (app.stage || '').includes(s) || (app.stage || '').includes(s.split(':')[1]?.trim()));

  if (curIdx < stages.length - 1 && curIdx !== -1) {
    app.stage = stages[curIdx + 1];
    app.stageProgress = Math.min(100, (curIdx + 2) * 25);
    addAdminAuditLog(`ترقية مرحلة: ${app.associationName}`, `تمت ترقية الجمعية إلى ${app.stage}`, 'fa-stairs', 'var(--c-gold-dark)');
    savePlatformState();
    renderAdminDashboard();
    renderAssociationDashboard();
    showToast(`تهانينا! تم ترقية "${app.associationName}" إلى: ${app.stage}`, 'success');
  } else if (curIdx === -1) {
    app.stage = stages[1];
    app.stageProgress = 50;
    savePlatformState();
    renderAdminDashboard();
  } else {
    showToast(`الجهة في المرحلة النهائية (مسرعة عذق) وجاهزة للاستدامة والتخرج!`, 'info');
  }
};

// Demote Stage
window.adminDemoteStage = function(id) {
  const app = APP_STATE.applications.find(a => a.id === id);
  if (!app) return;

  const stages = [
    'المرحلة الأولى: احتضان الفكرة',
    'المرحلة الثانية: التهيئة المؤسسية',
    'المرحلة الثالثة: الاحتضان المكاني',
    'المرحلة الرابعة: مسرعة عذق'
  ];

  const curIdx = stages.findIndex(s => (app.stage || '').includes(s) || (app.stage || '').includes(s.split(':')[1]?.trim()));

  if (curIdx > 0) {
    app.stage = stages[curIdx - 1];
    app.stageProgress = Math.max(25, curIdx * 25);
    addAdminAuditLog(`إرجاع مرحلة: ${app.associationName}`, `تم إرجاع الجمعية إلى ${app.stage}`, 'fa-arrow-right', '#D97706');
    savePlatformState();
    renderAdminDashboard();
    renderAssociationDashboard();
    showToast(`تم إعادة "${app.associationName}" إلى: ${app.stage}`, 'warning');
  }
};

// Graduate Association
window.adminGraduateApp = function(id) {
  const app = APP_STATE.applications.find(a => a.id === id);
  if (!app) return;

  app.stage = 'متخرجة من مسرعة عذق بنجاح ✓';
  app.stageProgress = 100;
  app.status = 'متخرجة مستدامة';
  addAdminAuditLog(`تخرج مستدام: ${app.associationName}`, `تم اعتماد تخرج الجمعية من مسرعة الأعمال بنجاح`, 'fa-graduation-cap', '#C59B27');
  savePlatformState();
  renderAdminDashboard();
  showToast(`مبارك! تم اعتماد تخرج "${app.associationName}" كجهة مستدامة بالمدينة المنورة!`, 'success');
};

// Booking Operations
window.adminCancelBooking = function(id) {
  if (confirm("هل ترغب في إلغاء هذا الحجز؟")) {
    APP_STATE.bookings = APP_STATE.bookings.filter(b => b.id !== id);
    addAdminAuditLog(`إلغاء حجز مرفق`, `تم إلغاء الحجز كود ${id}`, 'fa-calendar-xmark', '#EF4444');
    savePlatformState();
    renderAdminDashboard();
    showToast('تم إلغاء الحجز بنجاح.', 'success');
  }
};

// Consultation Operations
window.adminCompleteConsult = function(id) {
  const c = APP_STATE.consultations?.find(item => item.id === id);
  if (c) {
    c.status = 'منجزة ✓';
    addAdminAuditLog(`إنجاز جلسة استشارية`, `أتمت جمعية ${c.assocName} جلستها مع ${c.consultant}`, 'fa-check', '#0E6E41');
    savePlatformState();
    renderAdminDashboard();
    showToast(`تم توثيق إنجاز الجلسة الاستشارية بنجاح!`, 'success');
  }
};

// Open and Save New App Modal
window.openAdminNewAppModal = function() {
  document.getElementById('modalAdminNewApp')?.classList.add('active');
};

window.closeAdminNewAppModal = function() {
  document.getElementById('modalAdminNewApp')?.classList.remove('active');
};

window.saveAdminNewApp = function() {
  const name = document.getElementById('newAppAssocName')?.value.trim();
  const lic = document.getElementById('newAppLicense')?.value.trim();
  const nat700 = document.getElementById('newApp700')?.value.trim();
  const rep = document.getElementById('newAppRepName')?.value.trim();
  const phone = document.getElementById('newAppRepPhone')?.value.trim();
  const track = document.getElementById('newAppTrack')?.value;
  const incType = document.getElementById('newAppIncType')?.value;
  const score = parseInt(document.getElementById('newAppScore')?.value, 10) || 85;
  const emp = document.getElementById('newAppEmployee')?.value;

  if (!name || !lic || !rep) {
    alert('يرجى ملء كافة الحقول الأساسية المطلوبة.');
    return;
  }

  const newApp = {
    id: `ATHQ-2025-${String(APP_STATE.applications.length + 1).padStart(3, '0')}`,
    associationName: name,
    licenseNumber: lic,
    nationalNumber700: nat700 || '7009823411',
    city: 'المدينة المنورة',
    repName: rep,
    repPhone: phone || '0551234567',
    track: track || 'مسار الحوكمة والتمكين الشامل',
    incubationType: incType || 'مكتب مجهز مستقل',
    stage: 'المرحلة الأولى: احتضان الفكرة',
    stageProgress: 25,
    status: 'تحت المراجعة',
    fullTimeEmployee: emp,
    examScore: score,
    notes: 'طلب جديد تم تسجيله عبر لوحة الإدارة المركزية.',
    workHours: 0,
    volunteerHours: 0,
    volunteersCount: 0,
    evidences: [
      { title: "عقد الاحتضان المعتمد", status: "قيد المراجعة" },
      { title: "تقرير الاستيفاء والمطابقة المؤسسية", status: "قيد المراجعة" },
      { title: "خطاب حسم أداء الجمعية", status: "قيد المراجعة" },
      { title: "نموذج طلب الانضمام موقّع ومختوم", status: "مكتمل ✓" },
      { title: "نموذج استلام المفتاح والعهد المكتبي", status: "قيد التسليم" },
      { title: "وثيقة سياسة الأمان وبصمة الباب الذكية", status: "قيد التفعيل" },
      { title: "شهادة وجود موظف بدوام كامل متفرغ", status: emp.includes('متوفر') ? "معتمد ✓" : "قيد الاستكمال" }
    ]
  };

  APP_STATE.applications.unshift(newApp);
  addAdminAuditLog(`تسجيل جمعية جديدة: ${name}`, `تم إدخال الطلب برقم ترخيص ${lic}`, 'fa-plus', '#0E6E41');
  savePlatformState();
  closeAdminNewAppModal();
  renderAdminDashboard();
  showToast(`تم تسجيل جمعية "${name}" بنجاح في المنظومة!`, 'success');
};

// Booking Modals
window.openAdminNewBookingModal = function() {
  populateAdminModalSelects();
  document.getElementById('modalAdminNewBooking')?.classList.add('active');
};

window.closeAdminNewBookingModal = function() {
  document.getElementById('modalAdminNewBooking')?.classList.remove('active');
};

window.saveAdminNewBooking = function() {
  const facility = document.getElementById('newBkFacility')?.value;
  const assoc = document.getElementById('newBkAssoc')?.value;
  const date = document.getElementById('newBkDate')?.value;
  const time = document.getElementById('newBkTime')?.value;

  if (!assoc || !date) {
    alert('يرجى اختيار الجمعية وتاريخ الحجز.');
    return;
  }

  const newBk = {
    id: `BKG-${Date.now().toString().slice(-4)}`,
    assocName: assoc,
    facility: facility,
    date: date,
    time: time,
    status: 'مؤكد ومجدول ✓'
  };

  if (!APP_STATE.bookings) APP_STATE.bookings = [];
  APP_STATE.bookings.unshift(newBk);
  addAdminAuditLog(`حجز مرفق جديد`, `تم حجز ${facility} لجمعية ${assoc} بتاريخ ${date}`, 'fa-calendar-check', '#0E6E41');
  savePlatformState();
  closeAdminNewBookingModal();
  renderAdminDashboard();
  showToast(`تم تأكيد حجز "${facility}" لجمعية "${assoc}" بنجاح!`, 'success');
};

// Consult Modals
window.openAdminNewConsultModal = function() {
  populateAdminModalSelects();
  document.getElementById('modalAdminNewConsult')?.classList.add('active');
};

window.closeAdminNewConsultModal = function() {
  document.getElementById('modalAdminNewConsult')?.classList.remove('active');
};

window.saveAdminNewConsult = function() {
  const consultant = document.getElementById('newCnsConsultant')?.value;
  const assoc = document.getElementById('newCnsAssoc')?.value;
  const field = document.getElementById('newCnsField')?.value;
  const date = document.getElementById('newCnsDate')?.value;

  if (!assoc || !date) {
    alert('يرجى ملء بيانات الجلسة.');
    return;
  }

  const newCns = {
    id: `CNS-${Date.now().toString().slice(-4)}`,
    assocName: assoc,
    consultant: consultant,
    field: field,
    date: date,
    status: 'مجدولة'
  };

  if (!APP_STATE.consultations) APP_STATE.consultations = [];
  APP_STATE.consultations.unshift(newCns);
  addAdminAuditLog(`جدولة استشارة جديدة`, `تمت جدولة استشارة لجمعية ${assoc} مع ${consultant}`, 'fa-user-tie', '#0E6E41');
  savePlatformState();
  closeAdminNewConsultModal();
  renderAdminDashboard();
  showToast(`تمت جدولة الاستشارة بنجاح!`, 'success');
};

// Global Reset
window.resetPlatformToDefault = function() {
  if (confirm("هل ترغب في إعادة ضبط بيانات المنصة والطلبات إلى الحالة الافتراضية المعتمدة؟")) {
    localStorage.removeItem(ATHQ_STORAGE_KEY);
    location.reload();
  }
};

// ========================== Admin Direct Access & Security Operations ==========================
window.openAdmin2FAModal = function() {
  switchRole('admin');
};

window.closeAdmin2FAModal = function() {
  document.getElementById('modalAdmin2FA')?.classList.remove('active');
};

// Admin Secure Logout
window.adminSecureLogout = function() {
  if (confirm('هل ترغب في تسجيل الخروج من لوحة الإدارة وإنهاء الجلسة الآمنة؟')) {
    if (typeof AthqAuth !== 'undefined') {
      AthqAuth.logout();
    } else {
      switchRole('visitor');
      showToast('تم تسجيل الخروج بنجاح.', 'info');
    }
  }
};

// Admin Save All Changes Button
window.saveAdminAllChanges = function() {
  savePlatformState();
  renderAdminDashboard();
  showToast('تم حفظ كافة تعديلات وبيانات لوحة الإدارة بنجاح في قاعدة البيانات السحابية ✓', 'success');
  addAdminAuditLog('حفظ التعديلات المركزية', 'تم حفظ التحديثات وتزامنها مع كافة المسارات', 'fa-floppy-disk', '#0E6E41');
};

// ========================== Facility Bookings: Approve / Reject Operations ==========================
window.adminApproveBooking = function(id) {
  const b = APP_STATE.bookings?.find(item => item.id === id);
  if (b) {
    b.status = 'مؤكد ومعتمد ✓';
    savePlatformState();
    renderAdminDashboard();
    showToast(`تم اعتماد وتأكيد حجز "${b.facility}" لجمعية "${b.assocName}" بنجاح!`, 'success');
    addAdminAuditLog(`اعتماد حجز مرفق`, `تمت الموافقة على حجز ${b.facility} لجمعية ${b.assocName}`, 'fa-circle-check', '#0E6E41');
  }
};

window.adminRejectBooking = function(id) {
  const b = APP_STATE.bookings?.find(item => item.id === id);
  if (b) {
    b.status = 'مرفوض من الإدارة ✕';
    savePlatformState();
    renderAdminDashboard();
    showToast(`تم رفض حجز "${b.facility}" لجمعية "${b.assocName}".`, 'warning');
    addAdminAuditLog(`رفض حجز مرفق`, `تم رفض حجز ${b.facility} لجمعية ${b.assocName} لتعارض الموعد`, 'fa-xmark', '#EF4444');
  }
};

// ========================== Consultation Assignment to Consultants ==========================
window.openAdminAssignConsultModal = function(consultId) {
  const consults = APP_STATE.consultations || [];
  const c = consults.find(item => item.id === consultId) || consults[0];
  if (!c) return;

  const modal = document.getElementById('modalAdminAssignConsult');
  if (!modal) return;

  document.getElementById('assignConsultId').value = c.id;
  document.getElementById('assignAssocName').textContent = c.assocName;
  document.getElementById('assignFieldText').textContent = c.field || 'حوكمة المنظمات واللوائح ومصفوفة الصلاحيات';

  // Populate consultants select
  const consList = APP_STATE.consultants || [];
  const consSelect = document.getElementById('assignSelectedConsultant');
  if (consSelect) {
    consSelect.innerHTML = consList.map(cons => `
      <option value="${cons.name}">${cons.name} (${cons.title || cons.specialty})</option>
    `).join('');
  }

  updateAssignConsultantSlots();
  modal.classList.add('active');
};

window.closeAdminAssignConsultModal = function() {
  document.getElementById('modalAdminAssignConsult')?.classList.remove('active');
};

window.updateAssignConsultantSlots = function() {
  const consSelect = document.getElementById('assignSelectedConsultant');
  const slotSelect = document.getElementById('assignSelectedSlot');
  if (!consSelect || !slotSelect) return;

  const selectedName = consSelect.value;
  const cons = (APP_STATE.consultants || []).find(c => c.name === selectedName) || APP_STATE.consultants[0];
  const slots = cons?.slots || ['الأحد: 05:00 م - 07:00 م (حضوري بالحاضنة)', 'الثلاثاء: 06:00 م - 08:00 م (افتراضي عبر Zoom)'];

  slotSelect.innerHTML = slots.map(s => `<option value="${s}">${s}</option>`).join('');
};

window.confirmAdminAssignConsult = function() {
  const id = document.getElementById('assignConsultId').value;
  const consultantName = document.getElementById('assignSelectedConsultant').value;
  const slot = document.getElementById('assignSelectedSlot').value;
  const mode = document.getElementById('assignSelectedMode').value;

  const c = (APP_STATE.consultations || []).find(item => item.id === id);
  if (c) {
    c.consultant = consultantName;
    c.date = `${slot.split('(')[0].trim()}`;
    c.status = 'مجدولة ومسندة ✓';
    c.mode = mode;

    savePlatformState();
    closeAdminAssignConsultModal();
    renderAdminDashboard();
    renderConsultantDashboard();
    showToast(`تم إسناد وتوزيع استشارة "${c.assocName}" بنجاح على المستشار: ${consultantName}!`, 'success');
    addAdminAuditLog(`إسناد استشارة`, `تم توزيع استشارة ${c.assocName} على ${consultantName}`, 'fa-user-check', '#0E6E41');
  }
};

// ========================== 1. Interactive Governance & Compliance Radar ==========================
window.recalcGovernanceRadar = function() {
  const finChecked = document.querySelectorAll('#assoc-tab-radar input[id^="chk-fin-"]:checked').length;
  const traChecked = document.querySelectorAll('#assoc-tab-radar input[id^="chk-tra-"]:checked').length;
  const comChecked = document.querySelectorAll('#assoc-tab-radar input[id^="chk-com-"]:checked').length;

  const finPct = Math.round((finChecked / 4) * 100);
  const traPct = Math.round((traChecked / 4) * 100);
  const comPct = Math.round((comChecked / 4) * 100);

  const pctFinEl = document.getElementById('radar-pct-finance');
  const pctTraEl = document.getElementById('radar-pct-transparency');
  const pctComEl = document.getElementById('radar-pct-compliance');

  if (pctFinEl) pctFinEl.textContent = `${finPct}%`;
  if (pctTraEl) pctTraEl.textContent = `${traPct}%`;
  if (pctComEl) pctComEl.textContent = `${comPct}%`;

  const totalChecked = finChecked + traChecked + comChecked;
  const totalScore = Math.round((totalChecked / 12) * 100);

  const circle = document.getElementById('radarScoreCircle');
  if (circle) {
    circle.setAttribute('data-score', `${totalScore}%`);
    circle.style.setProperty('--score', totalScore);
  }

  const titleEl = document.getElementById('radar-status-title');
  if (titleEl) {
    if (totalScore >= 90) {
      titleEl.textContent = 'مستوى امتثال ممتاز ومؤهل للتوسع والشراكات (النطاق الأخضر)';
    } else if (totalScore >= 70) {
      titleEl.textContent = 'مستوى امتثال جيد جداً - استكمال بعض الشواهد واللوائح';
    } else {
      titleEl.textContent = 'يتطلب خطة علاجية فورية وجلسات استشارية مركزة';
    }
  }
};

// ========================== 3. Digital Badges & QR Verification Modal ==========================
window.openDigitalCertificateModal = function(type) {
  const modal = document.getElementById('modalDigitalCertificate');
  if (!modal) return;

  const recipientEl = document.getElementById('cert-recipient-name');
  const codeEl = document.getElementById('cert-code-display');
  const titleDisplayEl = document.getElementById('cert-title-display');
  const descEl = document.getElementById('cert-desc-text');

  if (type === 'cons') {
    const cons = (APP_STATE.consultants || []).find(c => c.id === currentActiveConsultantId) || APP_STATE.consultants?.[0];
    if (recipientEl && cons) recipientEl.textContent = cons.name;
    if (titleDisplayEl) titleDisplayEl.textContent = 'شهادة تقدير وإشادة استشارية معتمدة';
    if (descEl && cons) descEl.textContent = `تقديراً لجهوده التطوعية المتميزة في تقديم الاستشارات التخصصية بمجال (${cons.field}) ودعم تمكين الجمعيات الأهلية الناشئة في المدينة المنورة.`;
    if (codeEl && cons) codeEl.textContent = `ATHQ-EXP-CERT-2025-${cons.id}`;
  } else {
    const currentAssoc = getActiveAssociation() || APP_STATE.applications[0];
    if (recipientEl && currentAssoc) recipientEl.textContent = currentAssoc.associationName;
    if (titleDisplayEl) titleDisplayEl.textContent = 'شهادة اجتياز واعتماد رسمي';
    if (descEl && currentAssoc) descEl.textContent = `قد استكملت بنجاح كافة متطلبات ومعايير (${currentAssoc.stage || 'مرحلة الاحتضان المكاني'})، واستوفت متطلبات اللائحة الأساسية والسلامة المالية والرقابة المعتمدة لدى المركز الوطني لتنمية القطاع غير الربحي.`;
    if (codeEl && currentAssoc) codeEl.textContent = `ATHQ-CERT-2025-${currentAssoc.licenseNumber}`;
  }

  modal.classList.add('active');
};

window.closeDigitalCertificateModal = function() {
  document.getElementById('modalDigitalCertificate')?.classList.remove('active');
};

// ========================== 4. Admin Analytics & One-Click Exports ==========================

// Dataset for Monthly Impact & Month-over-Month (MoM) Progress Tracking
window.MOM_PROGRESS_DATA = [
  {
    name: "وقف العمل الصالح",
    lic: "1530",
    mode: "accelerator",
    modeLabel: "مسرعة أعمال",
    stage: "المرحلة الرابعة: مسرعة عذق",
    prevProgress: 75,
    currProgress: 90,
    momChange: "+15.0%",
    beneficiaries: "1,200",
    volHours: "+70 س",
    funding: "350,000 ر.س",
    compliance: "95%",
    note: "توسيع الاستدامة المالية وتوقيع 3 شراكات مانحة."
  },
  {
    name: "جمعية ديوان الشبابية",
    lic: "1842",
    mode: "spatial",
    modeLabel: "احتضان مكاني",
    stage: "المرحلة الثالثة: الاحتضان المكاني",
    prevProgress: 58,
    currProgress: 76,
    momChange: "+18.0%",
    beneficiaries: "3,400",
    volHours: "+197 س",
    funding: "520,000 ر.س",
    compliance: "92%",
    note: "استكمال 4 لوائح حوكمة وتجهيز المكتب المخصص رقم 4."
  },
  {
    name: "جمعية همم الشبابية",
    lic: "2104",
    mode: "idea",
    modeLabel: "فكرة ومبادرة",
    stage: "المرحلة الأولى: بلورة الفكرة",
    prevProgress: 30,
    currProgress: 52,
    momChange: "+22.0%",
    beneficiaries: "450",
    volHours: "+30 س",
    funding: "85,000 ر.س",
    compliance: "84%",
    note: "صياغة المبادرة والتهيئة لاستكمال مسوغات التأسيس."
  },
  {
    name: "جمعية التنمية الرياضية",
    lic: "1920",
    mode: "spatial",
    modeLabel: "احتضان مكاني",
    stage: "المرحلة الثالثة: الاحتضان المكاني",
    prevProgress: 60,
    currProgress: 74,
    momChange: "+14.0%",
    beneficiaries: "2,100",
    volHours: "+1,240 س",
    funding: "210,000 ر.س",
    compliance: "88%",
    note: "تفعيل المتطوعين وإطلاق دوري الأحياء المجتمعي."
  },
  {
    name: "الجمعية الفلكية بالمدينة المنورة",
    lic: "1680",
    mode: "spatial",
    modeLabel: "احتضان مكاني",
    stage: "المرحلة الثالثة: الاحتضان المكاني",
    prevProgress: 65,
    currProgress: 78,
    momChange: "+13.0%",
    beneficiaries: "1,800",
    volHours: "+95 س",
    funding: "140,000 ر.س",
    compliance: "90%",
    note: "شراكة مع المركز الوطني لتطوير رصد الأهلة والمعارض الفلكية."
  },
  {
    name: "جمعية إرشاد التنموية",
    lic: "1322",
    mode: "accelerator",
    modeLabel: "مسرعة أعمال",
    stage: "المرحلة الرابعة: مسرعة عذق",
    prevProgress: 80,
    currProgress: 94,
    momChange: "+14.0%",
    beneficiaries: "2,600",
    volHours: "+240 س",
    funding: "600,000 ر.س",
    compliance: "96%",
    note: "الجاهزية التامة للتخرج والحصول على شهادة الامتثال المؤسسي."
  },
  {
    name: "جمعية النقاء الصحية",
    lic: "1450",
    mode: "spatial",
    modeLabel: "احتضان مكاني",
    stage: "المرحلة الثالثة: الاحتضان المكاني",
    prevProgress: 70,
    currProgress: 88,
    momChange: "+18.0%",
    beneficiaries: "3,300",
    volHours: "+6,000 س",
    funding: "545,000 ر.س",
    compliance: "94%",
    note: "توسع العيادات المتنقلة وتحقيق أعلى ساعات تطوعية بالمنظومة."
  }
];

window.openMonthlyImpactReportModal = function() {
  const modal = document.getElementById('modalMonthlyImpactReport');
  if (!modal) return;
  modal.classList.add('active');
  renderMonthlyImpactTable();
};

window.closeMonthlyImpactReportModal = function() {
  document.getElementById('modalMonthlyImpactReport')?.classList.remove('active');
};

window.renderMonthlyImpactTable = function() {
  const tbody = document.getElementById('mom-report-tbody');
  if (!tbody) return;

  const monthSelect = document.getElementById('momReportMonth');
  const targetMonth = monthSelect ? monthSelect.value : 'ربيع الأول 1446هـ';
  const selectedOpt = monthSelect?.options[monthSelect.selectedIndex];
  const compareMonth = selectedOpt?.getAttribute('data-compare') || 'صفر 1446هـ';

  const modeFilter = document.getElementById('momReportMode')?.value || 'all';
  const searchQuery = (document.getElementById('momReportSearch')?.value || '').trim().toLowerCase();

  // Update table header labels
  const thPrev = document.getElementById('th-prev-month');
  const thCurr = document.getElementById('th-curr-month');
  if (thPrev) thPrev.textContent = `إنجاز (${compareMonth.split(' ')[0]})`;
  if (thCurr) thCurr.textContent = `إنجاز (${targetMonth.split(' ')[0]})`;

  let list = window.MOM_PROGRESS_DATA || [];

  // Filter by mode
  if (modeFilter !== 'all') {
    list = list.filter(item => item.mode === modeFilter);
  }

  // Filter by search
  if (searchQuery) {
    list = list.filter(item => 
      item.name.toLowerCase().includes(searchQuery) || 
      item.lic.toLowerCase().includes(searchQuery)
    );
  }

  if (list.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" style="text-align: center; padding: 28px; color: var(--c-text-muted);">
          <i class="fa-solid fa-folder-open" style="font-size: 1.8rem; display: block; margin-bottom: 8px;"></i>
          لا توجد جمعيات تطابق معايير الفلترة المحددة
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = list.map(item => {
    let modeBadge = '';
    if (item.mode === 'idea') {
      modeBadge = `<span class="badge" style="background: #FEF3C7; color: #92400E; font-size: 0.68rem; padding: 2px 7px; border: 1px solid #FCD34D;"><i class="fa-solid fa-lightbulb"></i> فكرة ومبادرة</span>`;
    } else if (item.mode === 'accelerator') {
      modeBadge = `<span class="badge" style="background: #EDE9FE; color: #5B21B6; font-size: 0.68rem; padding: 2px 7px; border: 1px solid #DDD6FE;"><i class="fa-solid fa-rocket"></i> مسرعة أعمال</span>`;
    } else {
      modeBadge = `<span class="badge" style="background: var(--c-primary-subtle); color: var(--c-primary); font-size: 0.68rem; padding: 2px 7px; border: 1px solid rgba(13,148,136,0.25);"><i class="fa-solid fa-building"></i> احتضان مكاني</span>`;
    }

    return `
      <tr style="border-bottom: 1px solid var(--c-border);">
        <td style="padding: 10px 12px;">
          <div style="font-weight: 800; color: var(--c-primary); font-size: 0.88rem; margin-bottom: 2px;">
            ${item.name}
          </div>
          <div style="font-size: 0.72rem; color: var(--c-text-muted);">ترخيص: <strong>${item.lic}</strong> • ${item.stage}</div>
        </td>
        <td style="padding: 10px 12px; text-align: center;">
          ${modeBadge}
        </td>
        <td style="padding: 10px 12px; text-align: center; font-weight: 700; color: var(--c-text-muted);">
          ${item.prevProgress}%
        </td>
        <td style="padding: 10px 12px; text-align: center;">
          <div style="font-weight: 800; color: var(--c-primary); font-size: 0.95rem;">${item.currProgress}%</div>
          <div style="width: 60px; height: 4px; background: #E2E8F0; border-radius: 2px; margin: 3px auto 0 auto; overflow: hidden;">
            <div style="width: ${item.currProgress}%; height: 100%; background: var(--c-primary);"></div>
          </div>
        </td>
        <td style="padding: 10px 12px; text-align: center;">
          <span style="display: inline-block; background: #DCFCE7; color: #166534; font-weight: 800; padding: 3px 8px; border-radius: 6px; font-size: 0.75rem; border: 1px solid #86EFAC;">
            ${item.momChange} ↗
          </span>
        </td>
        <td style="padding: 10px 12px; text-align: center;">
          <div style="font-weight: 800; color: var(--c-text-primary); font-size: 0.84rem;">${item.beneficiaries} مستفيد</div>
          <div style="font-size: 0.7rem; color: #64748B;">${item.volHours} تطوع</div>
        </td>
        <td style="padding: 10px 12px; text-align: center;">
          <span style="font-weight: 900; color: #0D6E46; font-size: 0.9rem;">${item.compliance}</span>
          <div style="font-size: 0.65rem; color: #16A34A; font-weight: 700;">مطابقة NCNP ✓</div>
        </td>
        <td style="padding: 10px 12px; font-size: 0.74rem; color: var(--c-text-body); line-height: 1.5;">
          ${item.note}
        </td>
      </tr>
    `;
  }).join('');
};

window.printMonthlyImpactFromModal = function() {
  const monthSelect = document.getElementById('momReportMonth');
  const targetMonth = monthSelect ? monthSelect.value : 'ربيع الأول 1446هـ';
  const selectedOpt = monthSelect?.options[monthSelect.selectedIndex];
  const compareMonth = selectedOpt?.getAttribute('data-compare') || 'صفر 1446هـ';
  const modeFilter = document.getElementById('momReportMode')?.value || 'all';

  if (window.AthqPrint && typeof window.AthqPrint.printMonthlyImpactAndProgressReport === 'function') {
    window.AthqPrint.printMonthlyImpactAndProgressReport(targetMonth, compareMonth, modeFilter);
  } else {
    window.print();
  }
};

window.exportMonthlyImpactExcelCsv = function() {
  const list = window.MOM_PROGRESS_DATA || [];
  const monthSelect = document.getElementById('momReportMonth');
  const targetMonth = monthSelect ? monthSelect.value : 'ربيع الأول 1446هـ';

  const headers = ['اسم الجمعية', 'رقم الترخيص', 'وضع الجمعية', 'المرحلة', 'إنجاز الشهر السابق (%)', 'إنجاز الشهر الحالي (%)', 'نسبة التقدم الشهري (MoM)', 'المستفيدين', 'ساعات التطوع', 'التمويل المستقطب', 'نسبة الامتثال', 'ملاحظات الإشراف'];

  let csvContent = '\uFEFF'; // UTF-8 BOM for Arabic support
  csvContent += headers.join(',') + '\r\n';

  list.forEach(item => {
    const row = [
      `"${item.name}"`,
      `"${item.lic}"`,
      `"${item.modeLabel}"`,
      `"${item.stage}"`,
      `"${item.prevProgress}%"`,
      `"${item.currProgress}%"`,
      `"${item.momChange}"`,
      `"${item.beneficiaries}"`,
      `"${item.volHours}"`,
      `"${item.funding}"`,
      `"${item.compliance}"`,
      `"${item.note}"`
    ];
    csvContent += row.join(',') + '\r\n';
  });

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `تقرير_الأثر_ونسبة_التقدم_الشهري_${targetMonth.replace(/\s+/g, '_')}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  showToast('تم تصدير تقرير الأثر ونسبة التقدم الشهري Excel (CSV) بنجاح!', 'success');
};

window.exportAdminExcelCsv = function() {
  const apps = APP_STATE.applications || [];
  const headers = ['كود الطلب', 'اسم الجمعية', 'رقم الترخيص', 'الرقم الوطني 700', 'ممثل الجمعية', 'رقم الجوال', 'المسار', 'المرحلة الحالية', 'الحالة', 'ساعات العمل', 'ساعات التطوع'];

  let csvContent = '\uFEFF'; // UTF-8 BOM for Arabic support in Excel
  csvContent += headers.join(',') + '\r\n';

  apps.forEach(app => {
    const row = [
      `"${app.id || ''}"`,
      `"${app.associationName || ''}"`,
      `"${app.licenseNumber || ''}"`,
      `"${app.nationalNumber700 || ''}"`,
      `"${app.repName || ''}"`,
      `"${app.repPhone || ''}"`,
      `"${app.track || ''}"`,
      `"${app.stage || ''}"`,
      `"${app.status || ''}"`,
      `"${app.workHours || 0}"`,
      `"${app.volunteerHours || 0}"`
    ];
    csvContent += row.join(',') + '\r\n';
  });

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `تقرير_منظومة_عذق_المركزي_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  showToast('تم تصدير ملف بيانات المنظومة Excel (CSV) بترميز عربي سليم!', 'success');
};

window.exportAdminPdfReport = function() {
  if (window.AthqPrint) {
    window.AthqPrint.printMonthlyImpactAndProgressReport();
  } else {
    window.print();
  }
};

// ========================== 5. Live Notification Center ==========================
window.toggleNotificationCenter = function(e) {
  if (e) e.stopPropagation();
  const panel = document.getElementById('notifDropdownPanel');
  panel?.classList.toggle('active');
};

window.markAllNotifsAsRead = function() {
  if (APP_STATE.notifications) {
    APP_STATE.notifications.forEach(n => n.unread = false);
    savePlatformState();
    renderNotifications();
    showToast('تم تحديد كافة التنبيهات كمقروءة ✓');
  }
};

window.markSingleNotifRead = function(id) {
  const notif = APP_STATE.notifications?.find(n => n.id === id);
  if (notif && notif.unread) {
    notif.unread = false;
    savePlatformState();
    renderNotifications();
  }
};

function renderNotifications() {
  const listEl = document.getElementById('notifItemsList');
  const badgeEl = document.getElementById('notifBadgeCount');
  const notifs = APP_STATE.notifications || [];
  const unreadCount = notifs.filter(n => n.unread).length;

  if (badgeEl) {
    badgeEl.textContent = unreadCount;
    badgeEl.style.display = unreadCount > 0 ? 'inline-flex' : 'none';
  }

  if (listEl) {
    if (notifs.length === 0) {
      listEl.innerHTML = '<div style="padding: 16px; text-align: center; color: var(--c-text-muted); font-size: 0.82rem;">لا توجد تنبيهات جديدة حالياً</div>';
      return;
    }

    listEl.innerHTML = notifs.map(n => `
      <div class="notif-item ${n.unread ? 'unread' : ''}" onclick="markSingleNotifRead('${n.id}')">
        <div class="notif-icon-circle">
          <i class="fa-solid ${n.icon || 'fa-bell'}"></i>
        </div>
        <div class="notif-content">
          <h5>${n.title}</h5>
          <p>${n.text}</p>
          <span class="notif-time">${n.time}</span>
        </div>
      </div>
    `).join('');
  }
}

// Close notification panel on outside click
document.addEventListener('click', (e) => {
  const wrapper = document.getElementById('notifDropdownWrapper');
  if (wrapper && !wrapper.contains(e.target)) {
    document.getElementById('notifDropdownPanel')?.classList.remove('active');
  }
});

// ========================== 6. Interactive Directory & Showcase (#orgs) ==========================
let currentDirCategory = 'all';

window.setDirFilter = function(chip, cat) {
  document.querySelectorAll('#dirFilterChips .chip-item').forEach(c => c.classList.remove('active'));
  chip.classList.add('active');
  currentDirCategory = cat;
  filterDirectoryOrgs();
};

window.filterDirectoryOrgs = function() {
  const query = document.getElementById('dirSearchInput')?.value.trim().toLowerCase() || '';
  const orgs = APP_STATE.directoryOrgs || [];

  const filtered = orgs.filter(org => {
    const matchCat = (currentDirCategory === 'all') ||
      (currentDirCategory === 'incubated' && org.status === 'محتضنة') ||
      (currentDirCategory === 'graduated' && org.status === 'متخرجة') ||
      (org.cat === currentDirCategory);

    const matchText = !query ||
      org.name.toLowerCase().includes(query) ||
      org.lic.includes(query) ||
      org.track.toLowerCase().includes(query);

    return matchCat && matchText;
  });

  renderDirectoryOrgs(filtered);
};

function renderDirectoryOrgs(items) {
  const container = document.getElementById('directoryGridCards');
  if (!container) return;

  const list = items || APP_STATE.directoryOrgs || [];
  if (list.length === 0) {
    container.innerHTML = '<div style="grid-column: 1 / -1; padding: 30px; text-align: center; color: var(--c-text-muted);">لا توجد جمعيات مطابقة لمعايير البحث المحددة.</div>';
    return;
  }

  container.innerHTML = list.map(org => {
    const isGrad = org.status === 'متخرجة';
    const initial = org.name.replace('جمعية ', '').replace('وقف ', '').slice(0, 1);

    return `
      <div class="dir-card-item" onclick="openOrgImpactModal('${org.name}')" title="انقر لعرض بطاقة إحصائيات وأثر ${org.name}">
        <div>
          <div class="dir-card-top">
            <div class="dir-card-avatar" style="${isGrad ? 'background: linear-gradient(135deg, var(--c-gold) 0%, var(--c-gold-dark) 100%);' : ''}">${initial}</div>
            <div class="dir-card-title">
              <h5>${org.name}</h5>
              <small>ترخيص رقم (${org.lic}) • ${org.cat === 'شباب' ? 'قطاع الشباب' : (org.cat === 'ثقافة' ? 'أوقاف وثقافة' : 'رعاية وتنمية')}</small>
            </div>
          </div>
          <div style="font-size: 0.8rem; color: var(--c-text-secondary); margin-bottom: 8px;">
            <i class="fa-solid fa-route" style="color: var(--c-primary); margin-left: 6px;"></i> ${org.track}
          </div>
        </div>
        <div class="dir-card-metrics" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
          <span><i class="fa-solid fa-briefcase" style="color: var(--c-primary);"></i> ${org.hours}</span>
          ${org.volHours ? `<span><i class="fa-solid fa-clock-rotate-left" style="color: var(--c-gold-dark);"></i> ${org.volHours}</span>` : ''}
          ${org.volunteers ? `<span><i class="fa-solid fa-users" style="color: var(--c-primary);"></i> ${org.volunteers}</span>` : ''}
          <span class="badge" style="background: ${isGrad ? 'var(--c-gold-subtle)' : 'var(--c-primary-subtle)'}; color: ${isGrad ? 'var(--c-gold-dark)' : 'var(--c-primary)'}; font-weight: 800; font-size: 0.72rem; padding: 2px 8px; border-radius: 6px;">${org.badge}</span>
        </div>
      </div>
    `;
  }).join('');
}

/* ==========================================================================
   FEATURE 3: Official Incubation Contract with Digital Signature Pad
   ========================================================================== */
let isDrawingSignature = false;
let sigCanvas, sigCtx;

function initSignatureCanvas() {
  sigCanvas = document.getElementById('contractSignatureCanvas');
  if (!sigCanvas) return;
  sigCtx = sigCanvas.getContext('2d');
  sigCtx.strokeStyle = '#0E6E41';
  sigCtx.lineWidth = 2.5;
  sigCtx.lineCap = 'round';
  sigCtx.lineJoin = 'round';

  function getPos(e) {
    const rect = sigCanvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - rect.left) * (sigCanvas.width / rect.width),
      y: (clientY - rect.top) * (sigCanvas.height / rect.height)
    };
  }

  function startDraw(e) {
    isDrawingSignature = true;
    const pos = getPos(e);
    sigCtx.beginPath();
    sigCtx.moveTo(pos.x, pos.y);
    if (e.type === 'touchstart') e.preventDefault();
  }

  function draw(e) {
    if (!isDrawingSignature) return;
    const pos = getPos(e);
    sigCtx.lineTo(pos.x, pos.y);
    sigCtx.stroke();
    if (e.type === 'touchmove') e.preventDefault();
  }

  function endDraw() {
    isDrawingSignature = false;
  }

  sigCanvas.onmousedown = startDraw;
  sigCanvas.onmousemove = draw;
  sigCanvas.onmouseup = endDraw;
  sigCanvas.onmouseleave = endDraw;

  sigCanvas.addEventListener('touchstart', startDraw, { passive: false });
  sigCanvas.addEventListener('touchmove', draw, { passive: false });
  sigCanvas.addEventListener('touchend', endDraw, { passive: false });
}

window.openContractSigningModal = function(customAssoc) {
  const modal = document.getElementById('modalContractSigning');
  if (!modal) return;

  const currentAssoc = customAssoc || getActiveAssociation() || (APP_STATE.applications && APP_STATE.applications[0]) || {
    associationName: "جمعية ديوان الشبابية",
    licenseNumber: "1842",
    nationalNumber700: "7009823411",
    repName: "عبدالله الحربي"
  };

  const nameEl = document.getElementById('contract-assoc-name');
  const licEl = document.getElementById('contract-assoc-lic');
  const num700El = document.getElementById('contract-assoc-700');
  const repEl = document.getElementById('contract-assoc-rep');

  if (nameEl) nameEl.textContent = currentAssoc.associationName;
  if (licEl) licEl.textContent = currentAssoc.licenseNumber || "1842";
  if (num700El) num700El.textContent = currentAssoc.nationalNumber700 || "7009823411";
  if (repEl) repEl.textContent = currentAssoc.repName || "الممثل النظامي";

  const repTitle = document.getElementById('sign-rep-title');
  if (repTitle) repTitle.textContent = `المفوض بالتوقيع: ${currentAssoc.repName || 'ممثل الجمعية'}`;

  const numEl = document.getElementById('contract-number-display');
  if (numEl) numEl.textContent = `ATHQ-AGR-2025-${currentAssoc.licenseNumber || '01'}`;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';

  setTimeout(() => {
    initSignatureCanvas();
    clearSignatureCanvas();
  }, 100);
};

window.closeContractSigningModal = function() {
  const modal = document.getElementById('modalContractSigning');
  if (modal) modal.classList.remove('active');
  document.body.style.overflow = '';
};

window.clearSignatureCanvas = function() {
  if (sigCanvas && sigCtx) {
    sigCtx.clearRect(0, 0, sigCanvas.width, sigCanvas.height);
  }
  const statusBadge = document.getElementById('sigStatusBadge');
  if (statusBadge) statusBadge.style.display = 'none';
};

window.saveDigitalSignature = function() {
  if (!sigCanvas) return;
  const dataUrl = sigCanvas.toDataURL('image/png');
  const preview = document.getElementById('contractSavedSignaturePreview');
  const statusBadge = document.getElementById('sigStatusBadge');

  if (preview) {
    preview.innerHTML = `<img src="${dataUrl}" alt="توقيع معتمد" style="max-height: 70px; max-width: 180px; object-fit: contain; filter: drop-shadow(0 2px 4px rgba(14,110,65,0.2));">`;
  }
  if (statusBadge) statusBadge.style.display = 'inline-block';

  const dateEl = document.getElementById('contractSignDateDisplay');
  if (dateEl) {
    const today = new Date().toLocaleDateString('ar-SA');
    dateEl.textContent = `التوقيع الرقمي معتمد: ${today}م • موثق بالبصمة الذكية ✓`;
  }

  showAppNotification('توقيع العقد الرقمي', 'تم اعتماد وتثبيت التوقيع الرقمي بنجاح في عقد الاحتضان المعتمد.');
};



/* ==========================================================================
   FEATURE 10: Official Booklets Library & Viewer (المكتبة والكتيبات)
   ========================================================================== */
const BOOKLETS_DATA = {
  intro: {
    title: "الكتيب التعريفي الرسمي",
    subtitle: "حاضنة ومسرعة عذق - جمعية البر بالمدينة المنورة",
    pages: "16 صفحة معتمدة",
    filename: "الكتيب_التعريفي_عذق_1446.pdf",
    summary: "المرجع الشامل لرسالة الحاضنة وأهدافها الاستراتيجية ومراحل رحلة الاحتضان الأربع.",
    chapters: [
      "كلمة خادم الحرمين الشريفين وسمو ولي العهد حول تمكين القطاع غير الربحي",
      "التعريف بجمعية البر بالمدينة المنورة (تأسست 1379هـ - ترخيص رقم 22)",
      "كلمة سعادة الأمين العام للجمعية م. صالح بن عبدالعزيز جبلاوي",
      "مفهوم الحاضنة والمسرعة وفق دليل مسك للمنظمات غير الربحية",
      "مذكرة التفاهم مع المركز الوطني لتنمية القطاع غير الربحي (NCNP)",
      "محاور 'لماذا عذق الست': تفعيل، وجود، التكاليف، وفرة، تسهيل، إيجاد",
      "أهداف حاضنة عذق الستة الاستراتيجية والمجتمعية",
      "مرافق الحاضنة الستة المجهزة (مقرات، مساحات عمل، قاعات، أركان ضيافة)",
      "مراحل رحلة الاحتضان الأربع: (الفكرة ➔ التهيئة ➔ المكاني ➔ مسرعة عذق)",
      "شركاء النجاح وعناوين التواصل الرسمية بالمدينة المنورة"
    ]
  },
  services: {
    title: "كتيب الخدمات الرسمي",
    subtitle: "منظومة الخدمات الشاملة لحاضنة ومسرعة عذق",
    pages: "22 صفحة معتمدة",
    filename: "كتيب_الخدمات_عذق_1446.pdf",
    summary: "الدليل الإجرائي المعتمد لمنظومة الـ 28 خدمة المقدمة للجمعيات الأهلية الناشئة والمتعثرة.",
    chapters: [
      "الخدمات التأسيسية الـ 11: تفعيل الخدمات الإلكترونية، الموارد البشرية والتوظيف، التراخيص والموافقات",
      "الحسابات البنكية الرسمية، التوجه الاستراتيجي والهوية، إعداد السجلات التنظيمية",
      "اللوائح والأنظمة الداخلية، التواصل والتواجد الرقمي، الشؤون المالية والموازنة",
      "قنوات الدعم وتنمية الموارد، إدارة وتنظيم الاجتماعات الدورية",
      "الخدمات المشتركة الـ 9: مقرات احتضان مجهزة (+13 مقراً)، مساحات عمل مشتركة (+18 مساحة)",
      "قاعات تدريب مجهزة، قاعات اجتماعات ولقاءات، قاعات للمستشارين (3 قاعات)",
      "أركان الضيافة (4 أركان)، خدمات الإنترنت عالي السرعة، العنوان الوطني المعتمد، الرقم الموحد",
      "الخدمات الاستشارية الـ 8: الخطط الاستراتيجية، التأسيس الشامل، المشاريع والبرامج، التمويل والمنح",
      "الحوكمة المؤسسية الرشيدة، الجوانب المالية والمحاسبية، الاستشارات القانونية، إعداد اللوائح الداخلية"
    ]
  },
  programs: {
    title: "كتيب البرامج الرسمي",
    subtitle: "مسارات الدعم التخصصية ومناهج الاحتضان",
    pages: "16 صفحة معتمدة",
    filename: "كتيب_البرامج_عذق_1446.pdf",
    summary: "المناهج التدريبية والتأهيلية ومسارات الدعم الخمسة مع الجداول والمدد الزمنية المعتمدة.",
    chapters: [
      "البرنامج 1: برامج وخدمات الحوكمة (المدة: شهران) - تشكيل مجلس الإدارة والجمعية العمومية وتطبيق الحوكمة المالية",
      "البرنامج 2: البناء والتمكين المؤسسي (المدة: 3 شهور) - الخطة الاستراتيجية والتشغيلية ولوائح الموارد البشرية والمالية",
      "البرنامج 3: التأهيل والتدريب المتخصص (المدة: 3 شهور) - ورش العمل وابتكار المشاريع وتنمية المهارات",
      "البرنامج 4: الاستشارات وتبادل الخبرات (المدة: 12 شهراً) - الأنظمة والتسويق وفرص المنح وبناء التحالفات",
      "البرنامج 5: خدمات الدعم والمساندة التشغيلية (المدة: 12 - 24 شهراً) - المحاسبة السحابية والسكرتارية والإسناد الحكومي",
      "آليات قياس الأثر والتقييم الدوري لمخرجات الجمعيات المحتضنة"
    ]
  },
  reports: {
    title: "كتيب التقارير والإنجازات",
    subtitle: "الحاضنة بالأرقام ودليل الكيانات المحتضنة والمتخرجة",
    pages: "16 صفحة معتمدة",
    filename: "كتيب_التقارير_عذق_1446.pdf",
    summary: "سجل الإنجازات والأرقام المعتمدة وشبكة الكيانات الـ 22 المحتضنة والمتخرجة.",
    chapters: [
      "إحصائيات الإنجاز الكبرى: +16,311 ساعة تطوعية معتمدة و+4,470 ساعة عمل بالحاضنة",
      "المؤشرات الميدانية: +1,122 متطوع وخبير مسجل و+28 استشارة تخصصية معتمدة",
      "دليل الجهات المحتضنة الـ 15 وأرقامها: (وقف العمل الصالح، ديوان الشبابية، التنمية الرياضية، الفلكية، الوفاء، إرشاد، همم، النقاء، الرياضة النسائية، عيون طيبة، صيانة، سفراء، إحسان، نسيج، الإدارة القيادية)",
      "قائمة الجهات المتخرجة الـ 7: (جمعية تكوين، الأدب والأدباء، الصحفيين، رحاب، رعاية الأرامل، شباب المدينة، الجودة)",
      "الاتفاقيات والشراكات الاستراتيجية: (المركز الوطني NCNP، منصة أثر، جمعية جسور، جمعية تطوير)",
      "حملات النشر الإلكتروني والتوعية الرقمية عبر حساب @birethqinc"
    ]
  }
};

let activeBookletKey = 'intro';

window.openBookletViewer = function(key) {
  activeBookletKey = key;
  const modal = document.getElementById('modalBookletViewer');
  if (!modal) return;

  const data = BOOKLETS_DATA[key] || BOOKLETS_DATA.intro;
  const titleEl = document.getElementById('bview-title');
  const subEl = document.getElementById('bview-subtitle');
  const badgeEl = document.getElementById('bview-badge');
  const contentEl = document.getElementById('bview-content');

  if (titleEl) titleEl.textContent = data.title;
  if (subEl) subEl.textContent = data.subtitle;
  if (badgeEl) badgeEl.textContent = `${data.pages} • معتمد رسمياً`;

  if (contentEl) {
    contentEl.innerHTML = `
      <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 12px 16px; margin-bottom: 16px;">
        <strong style="color: var(--c-primary); display: block; margin-bottom: 4px;">نبذة عن الإصدار:</strong>
        <p style="font-size: 0.84rem; color: #334155; margin: 0;">${data.summary}</p>
      </div>
      <h5 style="font-size: 0.95rem; font-weight: 800; color: var(--c-primary); margin-bottom: 10px;">فهرس وموضوعات الكتيب:</h5>
      <ul style="padding-right: 20px; line-height: 1.9; font-size: 0.84rem; color: #1E293B;">
        ${data.chapters.map(ch => `<li>${ch}</li>`).join('')}
      </ul>
    `;
  }

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
};

window.closeBookletViewer = function() {
  const modal = document.getElementById('modalBookletViewer');
  if (modal) modal.classList.remove('active');
  document.body.style.overflow = '';
};

window.downloadBooklet = function(key) {
  const data = BOOKLETS_DATA[key] || BOOKLETS_DATA.intro;
  openBookletViewer(key);
  showAppNotification('تحميل الكتيب', `تم فتح معاينة (${data.title})، يمكنك طباعته أو حفظه كـ PDF عبر زر الطباعة.`);
};

window.downloadCurrentBooklet = function() {
  if (window.AthqPrint) {
    window.AthqPrint.autoHandlePrint();
  } else {
    window.print();
  }
};

/* ==========================================================================
   PROMPT 6: ADVANCED TECHNICAL & DESIGN MODULES
   1. الهرم التفاعلي لرحلة الاحتضان (Interactive Pyramid Drawer)
   2. معرض أثر الجمعيات المحتضنة والمتخرجة (Impact Dossier Modal)
   3. نظام حجز المرافق البصري ومنع التضارب (Visual Facilities Booking)
   4. أتمتة اختبار الانطلاقة الأولى (> 65) وتوليد العقود (Quiz & Docs Generator)
   5. مؤشر جاهزية الحوكمة والتأسيس (SVG Radial Progress)
   ========================================================================== */

// 1. Interactive Pyramid Stages Data & Drawer
const PYRAMID_STAGES_DATA = {
  1: {
    tierNum: 1,
    phaseBadge: "المرحلة الأولى • التأسيس المبكر (القاعدة)",
    title: "احتضان الفكرة (Idea Incubation)",
    desc: "المرحلة التأسيسية التي تُعنى بدعم الجمعيات الأهلية الناشئة في بلورة الفكرة وصياغة الرؤية والأهداف وإعداد اللائحة الأساسية واستيفاء ملف التأسيس بالمركز الوطني (NCNP).",
    programs: [
      {
        name: "برنامج البناء المؤسسي",
        duration: "3 شهور",
        icon: "fa-cubes",
        desc: "تأسيس البنية الهيكلية للجمعية، مواءمة الأهداف التنموية مع احتياجات منطقة المدينة المنورة، وصياغة اللائحة الأساسية.",
        deliverables: "مسودة اللائحة الأساسية، وثيقة الهيكل التنظيمي، دراسة مسح الاحتياج التنموي."
      },
      {
        name: "برنامج التأهيل والتدريب",
        duration: "3 شهور",
        icon: "fa-chalkboard-user",
        desc: "تأهيل مؤسسي الجمعية في أساسيات قيادة المنظمات غير الربحية ومعايير التأسيس المعتمدة.",
        deliverables: "ورشة التأسيس المعتمدة، حقيبة أدوات القيادة، خطة إطلاق المشروع الأولى."
      }
    ],
    nextStep: "الترقية للمرحلة الثانية بعد صدور الموافقة المبدئية واستيفاء شروط التسجيل بالمركز الوطني."
  },
  2: {
    tierNum: 2,
    phaseBadge: "المرحلة الثانية • التهيئة المؤسسية (الاحتضان الأولي)",
    title: "التهيئة المؤسسية (Institutional Preparation)",
    desc: "المرحلة التي تسبق استلام المقرات؛ وتستهدف إعداد الجمعية للانطلاق العملي والتحقق من الجاهزية والامتثال للأنظمة وتعيين الموظف المتفرغ واجتياز اختبار الانطلاقة الأولى (> 65).",
    programs: [
      {
        name: "برنامج الحوكمة والأنظمة",
        duration: "شهران",
        icon: "fa-shield-halved",
        desc: "بناء سياسات الامتثال، تحديث مصفوفة الصلاحيات المالية والإدارية، وتطبيق معايير الشفافية والمساءلة.",
        deliverables: "مصفوفة الصلاحيات المعتمدة، سياسات الحوكمة الأساسية، تقرير الامتثال الأولي."
      },
      {
        name: "برنامج التأهيل والتدريب التخصصي",
        duration: "3 شهور",
        icon: "fa-graduation-cap",
        desc: "تدريب الموظف المتفرغ على إدارة العمليات، وإعداد القوائم المالية، والتعامل مع منصات القطاع غير الربحي.",
        deliverables: "تأهيل الكادر التنفيذي، شهادة إتمام مسار التدريب التأسيسي."
      },
      {
        name: "اختبار الانطلاقة الأولى ومصفوفة الجاهزية",
        duration: "إلزامي قبل توقيع العقد",
        icon: "fa-award",
        desc: "اختبار تقييمي شامل من 100 درجة. يشترط تحقيق درجة أعلى من 65 كشرط تعاقدي لاستلام المقرات المجهزة والدعم اللوجستي.",
        deliverables: "شهادة اجتياز اختبار الانطلاقة (> 65)، إذن الانتقال للاحتضان المكاني."
      }
    ],
    nextStep: "توقيع عقد الاحتضان الرسمي وتجهيز واستلام المقر المخصص فور اجتياز الاختبار بنجاح."
  },
  3: {
    tierNum: 3,
    phaseBadge: "المرحلة الثالثة • الاحتضان المكاني والتمكين",
    title: "الاحتضان المكاني (Physical & Facilities Incubation)",
    desc: "المرحلة التشغيلية الميدانية؛ تتيح للجمعيات مقرات عمل مجهزة ومساحات عمل وقاعات ذكية لتسريع نموها واستقرارها المؤسسي والبدء بتنفيذ المبادرات الميدانية.",
    programs: [
      {
        name: "برنامج الدعم والمساندة اللوجستية",
        duration: "12 - 24 شهراً",
        icon: "fa-door-open",
        desc: "توفير مقر مستقل (13 مقراً مجهزاً) أو محطة عمل مشتركة (18 مساحة)، العنوان الوطني، الإنترنت، والخدمات المكتبية الموحدة.",
        deliverables: "تسليم المقر المجهز، تفعيل العنوان الوطني الرسمي، الوصول لقاعات الاجتماعات والتدريب."
      },
      {
        name: "برنامج الاستشارات التخصصية المستمرة",
        duration: "12 شهراً",
        icon: "fa-comments",
        desc: "جلسات دورية مع مستشاري عذق في الحوكمة، الإدارة المالية، وتصميم المشاريع وتوثيق الساعات التطوعية بالمنصة الوطنية.",
        deliverables: "تقارير الجلسات الاستشارية المعتمدة، تحديث رادار الامتثال إلى النطاق الأخضر."
      }
    ],
    nextStep: "الترشح لمسرعة عذق بعد استيفاء مستهدفات النمو وساعات العمل وتطوير خطة الاستدامة."
  },
  4: {
    tierNum: 4,
    phaseBadge: "المرحلة الرابعة • مسرعة عذق والتخرج",
    title: "مسرعة عذق (Athq Accelerator & Graduation)",
    desc: "المرحلة المتقدمة في هرم الاحتضان؛ تُعنى بتأهيل الجمعيات للانتقال إلى مستويات النضج المؤسسي العالي، عقد الشراكات الاستراتيجية المانحة، والاستدامة المالية وصولاً للتخريج الناجح.",
    programs: [
      {
        name: "برنامج الاستشارات التخصصية المتقدمة",
        duration: "12 شهراً",
        icon: "fa-chart-line",
        desc: "بناء المحافظ الوقفية، نمذجة الاستثمار الاجتماعي، دراسات الجدوى التنموية للمشاريع المستدامة، وحوكمة المجالس.",
        deliverables: "وثيقة الخطة الاستراتيجية الخمسية، مصفوفة الاستدامة المالية، نموذج الأثر المجتمعي."
      },
      {
        name: "برنامج الدعم والمساندة والتخريج المؤسسي",
        duration: "12 - 24 شهراً",
        icon: "fa-graduation-cap",
        desc: "التشبيك مع الجهات المانحة (أوقاف الراجحي، مؤسسة السبيعي، صندوق تمكين)، وإصدار شهادة التخرج الرسمية الموثقة برمز QR.",
        deliverables: "حقيبة التزكية المانحة المعتمدة، شهادة التخرج الرسمية من مسرعة عذق، الاستقلال التشغيلي الكامل."
      }
    ],
    nextStep: "تخرج الجمعية رسمياً لتصبح كياناً أهلياً رائداً ومستقلاً يخدم مجتمع المدينة المنورة."
  }
};

window.openPyramidTierDrawer = function(tierNum) {
  const data = PYRAMID_STAGES_DATA[tierNum] || PYRAMID_STAGES_DATA[1];
  const overlay = document.getElementById('pyramidDrawerOverlay');
  const badgeEl = document.getElementById('drawer-tier-badge');
  const titleEl = document.getElementById('drawer-tier-title');
  const bodyEl = document.getElementById('pyramidDrawerBody');
  const headerEl = document.getElementById('pyramidDrawerHeader');

  if (!overlay || !bodyEl) return;

  if (badgeEl) badgeEl.textContent = data.phaseBadge;
  if (titleEl) titleEl.textContent = data.title;
  if (headerEl) {
    if (tierNum === 1) headerEl.style.background = 'linear-gradient(135deg, #07472C 0%, #0D6E46 100%)';
    else if (tierNum === 2) headerEl.style.background = 'linear-gradient(135deg, #07472C 0%, #0D9488 100%)';
    else if (tierNum === 3) headerEl.style.background = 'linear-gradient(135deg, #0D6E46 0%, #C59B27 100%)';
    else headerEl.style.background = 'linear-gradient(135deg, #8F600A 0%, #D99B26 100%)';
  }

  bodyEl.innerHTML = `
    <div style="background: var(--bg-surface, #F4F5F7); border: 1.5px solid var(--border-color, #E2E8F0); border-radius: 14px; padding: 16px 18px; margin-bottom: 6px;">
      <strong style="color: var(--c-primary); display: block; font-size: 0.95rem; margin-bottom: 6px;">
        <i class="fa-solid fa-circle-info" style="color: var(--ethq-gold-primary, #D99B26);"></i> نبذة عن المرحلة:
      </strong>
      <p style="font-size: 0.86rem; color: var(--c-text-body); line-height: 1.7; margin: 0;">${data.desc}</p>
    </div>

    <h4 style="font-size: 1.05rem; font-weight: 900; color: var(--c-primary); margin: 10px 0 6px; display: flex; align-items: center; gap: 8px;">
      <i class="fa-solid fa-layer-group" style="color: var(--ethq-gold-primary, #D99B26);"></i> البرامج والمدد الزمنية المرتبطة بهذه المرحلة:
    </h4>

    <div style="display: flex; flex-direction: column; gap: 12px;">
      ${data.programs.map(prog => `
        <div class="program-linked-box">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <strong style="font-size: 0.96rem; color: var(--c-primary); display: flex; align-items: center; gap: 8px;">
              <i class="fa-solid ${prog.icon}" style="color: var(--ethq-gold-primary, #D99B26);"></i> ${prog.name}
            </strong>
            <span class="badge" style="background: var(--ethq-green-light, #E8F3EE); color: var(--ethq-green-primary, #0D6E46); font-weight: 800; font-size: 0.78rem; border: 1px solid rgba(13,110,70,0.2); padding: 3px 10px; border-radius: 20px;">
              المدة: ${prog.duration}
            </span>
          </div>
          <p style="font-size: 0.84rem; color: var(--c-text-secondary); line-height: 1.6; margin: 0 0 8px 0;">${prog.desc}</p>
          <div style="background: #FFFFFF; border: 1px dashed var(--border-color, #CBD5E1); border-radius: 8px; padding: 6px 12px; font-size: 0.78rem; color: var(--text-primary, #2B2E34);">
            <strong style="color: var(--ethq-gold-dark, #8F600A);">المخرجات المستهدفة:</strong> ${prog.deliverables}
          </div>
        </div>
      `).join('')}
    </div>

    <div style="background: rgba(217, 155, 38, 0.08); border: 1px solid rgba(217, 155, 38, 0.25); border-radius: 12px; padding: 14px 16px; margin-top: 10px;">
      <strong style="font-size: 0.82rem; color: var(--ethq-gold-dark, #8F600A); display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
        <i class="fa-solid fa-arrow-left"></i> خطوة الانتقال التالية:
      </strong>
      <span style="font-size: 0.82rem; color: var(--c-text-body);">${data.nextStep}</span>
    </div>
  `;

  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
};

window.closePyramidTierDrawer = function() {
  const overlay = document.getElementById('pyramidDrawerOverlay');
  if (overlay) overlay.classList.remove('active');
  document.body.style.overflow = '';
};

window.handleDrawerOverlayClick = function(e) {
  if (e.target && e.target.id === 'pyramidDrawerOverlay') {
    closePyramidTierDrawer();
  }
};

// 2. Association Impact Modal Dossier
window.openOrgImpactModal = function(orgName) {
  const modal = document.getElementById('modalOrgImpactDossier');
  if (!modal) return;

  const org = (APP_STATE.directoryOrgs || []).find(o => o.name === orgName) || {
    name: orgName,
    lic: "1842",
    track: "مسار الحوكمة والتمكين الشامل",
    cat: "شباب",
    status: "محتضنة",
    hours: "+1,624 ساعة عمل",
    volHours: "+197 ساعة تطوعية",
    volunteers: "+36 متطوعاً",
    badge: "مكتب مجهز رقم 4"
  };

  const nameEl = document.getElementById('org-impact-name');
  const metaEl = document.getElementById('org-impact-meta');
  const workEl = document.getElementById('org-impact-work-hours');
  const volHEl = document.getElementById('org-impact-vol-hours');
  const volCEl = document.getElementById('org-impact-vol-count');
  const trackEl = document.getElementById('org-impact-track');
  const statusEl = document.getElementById('org-impact-status');
  const badgeEl = document.getElementById('org-impact-badge');
  const descEl = document.getElementById('org-impact-desc');

  if (nameEl) nameEl.textContent = org.name;
  if (metaEl) metaEl.textContent = `ترخيص رسمي رقم: ${org.lic} • الرقم الوطني 700: 700${org.lic}891 • المدينة المنورة`;
  if (workEl) workEl.textContent = org.hours.replace('ساعة عمل', '').trim();
  if (volHEl) volHEl.textContent = (org.volHours || '+150').replace('ساعة تطوعية', '').trim();
  if (volCEl) volCEl.textContent = (org.volunteers || '+20').replace('متطوعاً', '').replace('متطوع', '').trim();
  if (trackEl) trackEl.textContent = org.track;
  if (statusEl) statusEl.textContent = org.status === 'متخرجة' ? 'متخرجة بنجاح ورائدة ✓' : 'محتضنة نشطة ✓';
  if (badgeEl) badgeEl.textContent = org.badge;

  if (descEl) {
    if (org.name.includes('ديوان')) {
      descEl.textContent = 'أتمت الجمعية توثيق 1,624 ساعة عمل بمقر الحاضنة، و197 ساعة تطوعية معتمدة بمشاركة 36 متطوعاً. كما تم اعتماد اللائحة الأساسية وتحديث مصفوفة الصلاحيات والحصول على النطاق الأخضر (92%) بالمركز الوطني.';
    } else if (org.name.includes('العمل الصالح')) {
      descEl.textContent = 'استفاد وقف العمل الصالح من برامج مسرعة عذق والدعم الاستشاري للأوقاف، مع توثيق أكثر من 360 ساعة عمل و70 ساعة تطوعية، وصياغة صك الوقفية المتطور وحوكمة الاستثمارات الاجتماعية.';
    } else if (org.name.includes('همم')) {
      descEl.textContent = 'تستفيد جمعية همم من مساحات العمل المشتركة بحاضنة عذق، ونفذت برنامج التأهيل والتدريب المتخصص لتمكين ذوي الإعاقة مع توثيق 180 ساعة عمل و30 ساعة تطوعية معتمدة.';
    } else if (org.name.includes('النقاء')) {
      descEl.textContent = 'حققت جمعية النقاء ريادة استثنائية بتوثيق +6,000 ساعة تطوعية معتمدة عبر المنصة الوطنية مع مشاركة +100 متطوع في التوعية الصحية، إلى جانب 40 ساعة عمل في مقرات الحاضنة.';
    } else {
      descEl.textContent = `كيان أهلي مميز تحتضنه عذق، حقق إنجاز ${org.hours} في مرافق الحاضنة و${org.volHours || 'ساعات تطوعية نوعية'} بالتعاون مع المركز الوطني لتنمية القطاع غير الربحي.`;
    }
  }

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
};

window.closeOrgImpactModal = function() {
  const modal = document.getElementById('modalOrgImpactDossier');
  if (modal) modal.classList.remove('active');
  document.body.style.overflow = '';
};

// 3. Visual Facilities Booking & Real-Time Collision Prevention Engine
const ATHQ_FACILITIES_CATALOG = [
  // 13 مقر احتضان مستقل
  { id: 'FAC-OFF-01', cat: 'offices', title: 'مقر احتضان مجهز رقم 1', subtitle: 'مكتب تنفيذي مستقل (جمعية إرشاد)', occupied: true, occupant: 'جمعية إرشاد' },
  { id: 'FAC-OFF-02', cat: 'offices', title: 'مقر احتضان مجهز رقم 2', subtitle: 'مكتب تنفيذي مستقل', occupied: false },
  { id: 'FAC-OFF-03', cat: 'offices', title: 'مقر احتضان مجهز رقم 3', subtitle: 'مكتب تنفيذي مستقل (الجمعية الفلكية)', occupied: true, occupant: 'الجمعية الفلكية' },
  { id: 'FAC-OFF-04', cat: 'offices', title: 'مقر احتضان مجهز رقم 4', subtitle: 'مكتب تنفيذي مستقل (جمعية ديوان)', occupied: true, occupant: 'جمعية ديوان الشبابية' },
  { id: 'FAC-OFF-05', cat: 'offices', title: 'مقر احتضان مجهز رقم 5', subtitle: 'مكتب تنفيذي مستقل', occupied: false },
  { id: 'FAC-OFF-06', cat: 'offices', title: 'مقر احتضان مجهز رقم 6', subtitle: 'مكتب تنفيذي مستقل (جمعية النقاء)', occupied: true, occupant: 'جمعية النقاء' },
  { id: 'FAC-OFF-07', cat: 'offices', title: 'مقر احتضان مجهز رقم 7', subtitle: 'مكتب تنفيذي مستقل (عيون طيبة)', occupied: true, occupant: 'جمعية عيون طيبة' },
  { id: 'FAC-OFF-08', cat: 'offices', title: 'مقر احتضان مجهز رقم 8', subtitle: 'مكتب تنفيذي مستقل', occupied: false },
  { id: 'FAC-OFF-09', cat: 'offices', title: 'مقر احتضان مجهز رقم 9', subtitle: 'مكتب تنفيذي مستقل (إحسان الطبية)', occupied: true, occupant: 'إحسان الطبية' },
  { id: 'FAC-OFF-10', cat: 'offices', title: 'مقر احتضان مجهز رقم 10', subtitle: 'مكتب تنفيذي مستقل (مؤسسة نسيج)', occupied: true, occupant: 'مؤسسة نسيج' },
  { id: 'FAC-OFF-11', cat: 'offices', title: 'مقر احتضان مجهز رقم 11', subtitle: 'مكتب تنفيذي مستقل', occupied: false },
  { id: 'FAC-OFF-12', cat: 'offices', title: 'مقر احتضان مجهز رقم 12', subtitle: 'مكتب تنفيذي مستقل (الإدارة القيادية)', occupied: true, occupant: 'الإدارة القيادية' },
  { id: 'FAC-OFF-13', cat: 'offices', title: 'مقر احتضان مجهز رقم 13', subtitle: 'مكتب تنفيذي مستقل', occupied: false },

  // 18 مساحة عمل مشتركة (Co-working pods)
  ...Array.from({ length: 18 }, (_, i) => ({
    id: `FAC-POD-${String(i + 1).padStart(2, '0')}`,
    cat: 'pods',
    title: `محطة عمل مشتركة رقم ${i + 1}`,
    subtitle: 'بيئة عمل مرنة ومحطة مكتبية مجهزة',
    occupied: [2, 5, 7, 12, 15].includes(i + 1)
  })),

  // 3 قاعات مستشارين
  { id: 'FAC-CON-01', cat: 'consult', title: 'قاعة مستشاري الحوكمة واللوائح', subtitle: 'مجهزة بنظام اتصال مرئي وشاشة ذكية', occupied: false },
  { id: 'FAC-CON-02', cat: 'consult', title: 'قاعة مستشاري الاستدامة والمالية', subtitle: 'مجهزة بشاشات عرض تفاعلية', occupied: false },
  { id: 'FAC-CON-03', cat: 'consult', title: 'قاعة مستشاري التخطيط والتطوير', subtitle: 'مجهزة لورش العمل المصغرة', occupied: false },

  // قاعات التدريب والاجتماعات
  { id: 'FAC-HALL-01', cat: 'halls', title: 'قاعة الاجتماعات الكبرى الذكية', subtitle: 'سعة 25-30 شخصاً • شاشات 4K وعزل صوتي', occupied: false },
  { id: 'FAC-HALL-02', cat: 'halls', title: 'مختبر التدريب والابتكار المؤسسي', subtitle: 'سعة 30 متدرباً • نظام صوتي تفاعلي', occupied: false },
  { id: 'FAC-HALL-03', cat: 'halls', title: 'استوديو الإنتاج الإعلامي والبودكاست', subtitle: 'مجهز بعوازل وكاميرات تصوير وميكروفونات', occupied: false }
];

let selectedVisualFacility = 'مقر احتضان مجهز رقم 4';
let currentVisualFacCategory = 'all';

window.initVisualFacilitiesBooking = function() {
  renderVisualFacilityGrid(currentVisualFacCategory);
  checkBookingCollision();
};

window.switchVisualFacilityCategory = function(btn, category) {
  currentVisualFacCategory = category;
  document.querySelectorAll('#facCategoryFilter .chip-item').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderVisualFacilityGrid(category);
};

window.renderVisualFacilityGrid = function(category = 'all') {
  const container = document.getElementById('facilityVisualGrid');
  if (!container) return;

  const dateVal = document.getElementById('fac-date')?.value || '2025-10-25';
  const timeVal = document.getElementById('fac-time-slot')?.value || '05:00 م - 08:00 م';

  const filtered = category === 'all' 
    ? ATHQ_FACILITIES_CATALOG 
    : ATHQ_FACILITIES_CATALOG.filter(f => f.cat === category);

  container.innerHTML = filtered.map(fac => {
    const isBookedInSlot = (APP_STATE.bookings || []).some(b => 
      (b.facility === fac.title || b.facility.includes(fac.title)) && 
      b.date === dateVal && 
      b.time === timeVal &&
      b.status !== 'ملغي'
    );
    const isBusy = fac.occupied || isBookedInSlot;
    const isSelected = selectedVisualFacility === fac.title;

    return `
      <div class="facility-slot-card ${isBusy ? 'occupied' : ''} ${isSelected ? 'selected' : ''}" 
           onclick="selectVisualFacilitySlot('${fac.title}', ${isBusy})">
        <i class="fa-solid ${fac.cat === 'offices' ? 'fa-door-open' : (fac.cat === 'pods' ? 'fa-laptop' : (fac.cat === 'consult' ? 'fa-comments' : 'fa-people-roof'))}" 
           style="font-size: 1.3rem; color: ${isBusy ? '#94A3B8' : (isSelected ? 'var(--ethq-gold-dark)' : 'var(--ethq-green-primary)')}; margin-bottom: 2px;"></i>
        <strong style="font-size: 0.82rem; font-weight: 800; color: ${isBusy ? '#64748B' : 'var(--c-text-primary)'};">${fac.title}</strong>
        <span class="facility-slot-badge ${isBusy ? 'slot-badge-busy' : 'slot-badge-free'}">
          ${isBusy ? 'مشغول ⛔' : 'متاح ✓'}
        </span>
      </div>
    `;
  }).join('');
};

window.selectVisualFacilitySlot = function(title, isBusy) {
  if (isBusy) {
    showToast(`المرفق (${title}) مشغول أو محجوز في هذه الفترة، يرجى اختيار مرفق آخر.`, 'warning');
    return;
  }
  selectedVisualFacility = title;
  const titleInput = document.getElementById('fac-selected-title');
  const hiddenSelect = document.getElementById('fac-booking-select');
  if (titleInput) titleInput.value = title;
  if (hiddenSelect) hiddenSelect.value = title;

  renderVisualFacilityGrid(currentVisualFacCategory);
  checkBookingCollision();
};

window.checkBookingCollision = function() {
  const dateVal = document.getElementById('fac-date')?.value || '';
  const timeVal = document.getElementById('fac-time-slot')?.value || '';
  const facTitle = selectedVisualFacility || document.getElementById('fac-booking-select')?.value || '';

  const conflictBanner = document.getElementById('bookingConflictBanner');
  const conflictMsg = document.getElementById('bookingConflictMessage');
  const submitBtn = document.getElementById('btnSubmitVisualBooking');

  // Find if conflict exists in state
  const conflict = (APP_STATE.bookings || []).find(b => 
    (b.facility === facTitle || facTitle.includes(b.facility)) &&
    b.date === dateVal &&
    b.time === timeVal &&
    b.status !== 'ملغي'
  );

  if (conflict) {
    if (conflictBanner) conflictBanner.style.display = 'flex';
    if (conflictMsg) conflictMsg.textContent = `المرفق (${facTitle}) محجوز مسبقاً في تاريخ ${dateVal} فترة (${timeVal}) لصالح [${conflict.assocName}]. تم منع الحجز تلقائياً لتفادي التعارض.`;
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.5';
      submitBtn.style.cursor = 'not-allowed';
    }
    return true;
  } else {
    if (conflictBanner) conflictBanner.style.display = 'none';
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.style.opacity = '1';
      submitBtn.style.cursor = 'pointer';
    }
    return false;
  }
};

// 4. First Launch Quiz (> 65) UI and Automatic Document Generation
window.openFirstLaunchQuizModal = function() {
  const modal = document.getElementById('modalFirstLaunchQuiz');
  if (modal) {
    calculateQuizScore();
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
};

window.closeFirstLaunchQuizModal = function() {
  const modal = document.getElementById('modalFirstLaunchQuiz');
  if (modal) modal.classList.remove('active');
  document.body.style.overflow = '';
};

window.calculateQuizScore = function() {
  const form = document.getElementById('firstLaunchQuizForm');
  if (!form) return 0;

  let totalScore = 0;
  for (let i = 1; i <= 10; i++) {
    const selected = form.querySelector(`input[name="quiz_q${i}"]:checked`);
    const val = selected ? parseInt(selected.value, 10) : 0;
    totalScore += val;
    const box = document.getElementById(`qbox-${i}`);
    if (box) {
      box.classList.toggle('answered', !!selected);
    }
  }

  const scoreEl = document.getElementById('quizScoreNumber');
  const badgeEl = document.getElementById('quizPassStatusBadge');
  const noticeEl = document.getElementById('quizResultNotice');
  const btnEl = document.getElementById('btnSubmitQuizAction');

  if (scoreEl) scoreEl.textContent = totalScore;

  const isPassed = totalScore > 85;

  if (badgeEl) {
    if (isPassed) {
      badgeEl.textContent = '✓ محقق لشرط الاجتياز (> 85)';
      badgeEl.style.background = '#DCFCE7';
      badgeEl.style.color = '#166534';
      badgeEl.style.border = '1px solid #86EFAC';
    } else {
      badgeEl.textContent = '⚠️ لم يحقق شرط الاجتياز (> 85)';
      badgeEl.style.background = '#FEE2E2';
      badgeEl.style.color = '#991B1B';
      badgeEl.style.border = '1px solid #FCA5A5';
    }
  }

  if (noticeEl) {
    if (isPassed) {
      noticeEl.style.background = '#F0FDF4';
      noticeEl.style.borderColor = '#22C55E';
      noticeEl.innerHTML = `
        <h4 style="font-size: 1.05rem; font-weight: 800; color: #166534; margin-bottom: 4px; display: flex; align-items: center; gap: 8px;">
          <i class="fa-solid fa-circle-check"></i> تم استيفاء شرط الاجتياز (> 85) بنجاح!
        </h4>
        <p style="font-size: 0.85rem; color: #166534; margin: 0; line-height: 1.6;">
          حققت الجمعية درجة <strong>${totalScore} من 100</strong>. يمكنكم الآن الانتقال مباشرة إلى مرحلة توقيع عقد الاحتضان واستلام المقر المجهز وتفعيل الخدمات التأسيسية.
        </p>
      `;
    } else {
      noticeEl.style.background = '#FEF2F2';
      noticeEl.style.borderColor = '#EF4444';
      noticeEl.innerHTML = `
        <h4 style="font-size: 1.05rem; font-weight: 800; color: #991B1B; margin-bottom: 4px; display: flex; align-items: center; gap: 8px;">
          <i class="fa-solid fa-triangle-exclamation"></i> الدرجة الحالية (${totalScore} / 100) أقل من شرط الاجتياز (> 85)!
        </h4>
        <p style="font-size: 0.85rem; color: #991B1B; margin: 0; line-height: 1.6;">
          يشترط المخطط الإجرائي لعذق الحصول على درجة أعلى من 85 لتوقيع العقد. يُرجى استكمال تسجيل الموظف المتفرغ وتفعيل منصات الحوكمة ثم إعادة التقييم.
        </p>
      `;
    }
  }

  if (btnEl) {
    btnEl.disabled = !isPassed;
    btnEl.style.opacity = isPassed ? '1' : '0.5';
    btnEl.style.cursor = isPassed ? 'pointer' : 'not-allowed';
  }

  return totalScore;
};

window.submitFirstLaunchQuiz = function() {
  const score = calculateQuizScore();
  if (score <= 85) {
    showToast('⚠️ لا يمكن اعتماد النتيجة: الدرجة أقل من شرط الاجتياز المشروط (> 85 درجة).', 'warning');
    return;
  }

  const activeAssoc = getActiveAssociation();
  if (activeAssoc) {
    activeAssoc.examScore = score;
    activeAssoc.stage = "المرحلة الثالثة: الاحتضان المكاني";
    activeAssoc.stageProgress = 75;
  }

  saveAppState();
  closeFirstLaunchQuizModal();
  renderAssociationDashboard();
  showToast(`🎉 مبارك! تم توثيق اجتياز اختبار الانطلاقة الأولى بدرجة (${score} / 100). تم الانتقال للمرحلة الثالثة وفتح مسار توليد عقد الاحتضان!`, 'success');
  
  setTimeout(() => {
    openAdminDocGeneratorModal();
  }, 1000);
};

window.openAdminDocGeneratorModal = function() {
  const modal = document.getElementById('modalAdminDocGenerator');
  if (modal) {
    renderGeneratedDocContent();
    renderHqChecklist();
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
};

window.closeAdminDocGeneratorModal = function() {
  const modal = document.getElementById('modalAdminDocGenerator');
  if (modal) modal.classList.remove('active');
  document.body.style.overflow = '';
};

window.renderGeneratedDocContent = function() {
  const assocId = document.getElementById('gen-assoc-select')?.value || 'ATHQ-2025-001';
  const docType = document.getElementById('gen-doc-type')?.value || 'contract';
  const container = document.getElementById('gen-doc-paper-content');
  if (!container) return;

  const app = (APP_STATE.applications || []).find(a => a.id === assocId) || APP_STATE.applications[0];

  if (docType === 'contract') {
    container.innerHTML = `
      <div style="text-align: center; border-bottom: 2px solid #CBD5E1; padding-bottom: 14px; margin-bottom: 16px;">
        <span style="font-size: 0.8rem; color: #64748B; font-weight: 700;">المملكة العربية السعودية • المركز الوطني لتنمية القطاع غير الربحي</span>
        <h3 style="font-size: 1.3rem; font-weight: 900; color: #0D6E46; margin: 6px 0;">عقد احتضان وتمكين منظمة أهلية ناشئة</h3>
        <span style="font-size: 0.78rem; background: #DCFCE7; color: #166534; padding: 2px 10px; border-radius: 10px; font-weight: 800;">كود العقد: ATHQ-CNT-2025-09</span>
      </div>
      <p>بعون الله تعالى، في يوم <strong>الأحد الموافق 1446/08/15هـ</strong>، تم الاتفاق بين كل من:</p>
      <p><strong>الطرف الأول:</strong> حاضنة ومسرعة عذق للجمعيات الأهلية - التابعة لجمعية البر بالمدينة المنورة (ترخيص رقم 22).</p>
      <p><strong>الطرف الثاني:</strong> <strong style="color: #0D6E46;">${app.associationName}</strong>، المسجلة بالمركز الوطني برقم ترخيص (<strong>${app.licenseNumber}</strong>)، والرقم الوطني 700: (<strong>${app.nationalNumber700}</strong>)، ويمثلها المفوض: <strong>${app.repName}</strong>.</p>
      <h4 style="font-size: 0.95rem; font-weight: 800; color: #0D6E46; margin-top: 14px;">البنود والالتزامات المعتمدة:</h4>
      <ol style="padding-right: 20px; font-size: 0.84rem; line-height: 1.8;">
        <li>تخصيص مقر عمل مستقل للجمعية (المكتب المجهز رقم 4) وقاعات الاجتماعات والتدريب طيلة فترة الاحتضان (12 إلى 24 شهراً).</li>
        <li>توفير العنوان الوطني المعتمد والنظام المحاسبي السحابي الموحد والاستشارات الشهرية برعاية جمعية البر.</li>
        <li>تلتزم الجمعية بتعيين موظف متفرغ بدوام كامل لمتابعة برامج ومستهدفات الأداء بالمنصة.</li>
        <li>حصول الجمعية على درجة (${app.examScore || 90} / 100) في اختبار الانطلاقة الأولى كشرط تعاقدي مستوفى ✓.</li>
      </ol>
      <div style="display: flex; justify-content: space-between; margin-top: 24px; padding-top: 14px; border-top: 1px dashed #CBD5E1;">
        <div style="text-align: center;">
          <strong style="display: block; font-size: 0.85rem;">الطرف الأول (إدارة حاضنة عذق)</strong>
          <span style="display: inline-block; margin-top: 6px; padding: 4px 12px; background: #E8F3EE; border: 1px solid #0D6E46; border-radius: 8px; font-weight: 800; font-size: 0.78rem; color: #0D6E46;">
            معتمد ومختوم إلكترونياً ✓
          </span>
        </div>
        <div style="text-align: center;">
          <strong style="display: block; font-size: 0.85rem;">الطرف الثاني (${app.repName})</strong>
          <span style="display: inline-block; margin-top: 6px; padding: 4px 12px; background: #FEF3C7; border: 1px solid #D99B26; border-radius: 8px; font-weight: 800; font-size: 0.78rem; color: #8F600A;">
            موقّع بالبصمة الرقمية ✓
          </span>
        </div>
      </div>
    `;
  } else if (docType === 'oversight') {
    container.innerHTML = `
      <div style="text-align: center; border-bottom: 2px solid #CBD5E1; padding-bottom: 14px; margin-bottom: 16px;">
        <span style="font-size: 0.8rem; color: #64748B; font-weight: 700;">المملكة العربية السعودية • إمارة منطقة المدينة المنورة</span>
        <h3 style="font-size: 1.3rem; font-weight: 900; color: #0D6E46; margin: 6px 0;">تقرير المحافظة والرقابة المؤسسية للجمعيات المحتضنة</h3>
        <span style="font-size: 0.78rem; background: #E0E7FF; color: #3730A3; padding: 2px 10px; border-radius: 10px; font-weight: 800;">كود التقرير: ATHQ-GOV-REP-88</span>
      </div>
      <p><strong>إلى:</strong> لجان الإشراف والمتابعة الميدانية - المركز الوطني للقطاع غير الربحي</p>
      <p><strong>الجهة الخاضعة للتقييم:</strong> <strong style="color: #0D6E46;">${app.associationName}</strong> (ترخيص: ${app.licenseNumber})</p>
      <div style="background: #F8FAFC; border: 1px solid #E2E8F0; padding: 12px 16px; border-radius: 8px; margin: 12px 0;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 0.84rem;">
          <div>مستوى الامتثال العام: <strong style="color: #059669;">92% (النطاق الأخضر)</strong></div>
          <div>ساعات العمل الموثقة بالمقر: <strong>+1,624 ساعة</strong></div>
          <div>ساعات التطوع المعتمدة: <strong>+197 ساعة</strong></div>
          <div>الموظف المتفرغ: <strong>متوفر ومسجل رسمياً ✓</strong></div>
        </div>
      </div>
      <p style="font-size: 0.84rem; line-height: 1.7;">
        تفيد إدارة الحاضنة بأن الجمعية مستوفية لكافة متطلبات السلامة والتشغيل والشفافية النظامية، وتزاول أنشطتها التنموية بانتظام تحت مظلة حاضنة ومسرعة عذق.
      </p>
      <div style="margin-top: 20px; text-align: left;">
        <span style="font-weight: 800; font-size: 0.82rem; color: #0D6E46;">إدارة الرقابة والمطابقة - حاضنة ومسرعة عذق ✓</span>
      </div>
    `;
  } else {
    container.innerHTML = `
      <div style="text-align: center; border-bottom: 2px solid #CBD5E1; padding-bottom: 14px; margin-bottom: 16px;">
        <span style="font-size: 0.8rem; color: #64748B; font-weight: 700;">حاضنة ومسرعة عذق • جمعية البر بالمدينة المنورة</span>
        <h3 style="font-size: 1.3rem; font-weight: 900; color: #0D6E46; margin: 6px 0;">خطاب تقييم الأداء والجاهزية المؤسسية</h3>
        <span style="font-size: 0.78rem; background: #FEF3C7; color: #92400E; padding: 2px 10px; border-radius: 10px; font-weight: 800;">المرجع: ATHQ-PRF-2025-14</span>
      </div>
      <p><strong>سعادة رئيس مجلس إدارة:</strong> <strong style="color: #0D6E46;">${app.associationName}</strong> المحترم</p>
      <p style="font-size: 0.84rem; line-height: 1.8;">
        السلام عليكم ورحمة الله وبركاته،،<br>
        يطيب لنا إحاطتكم بنتيجة التقييم الدوري لأداء جمعيتكم الموقرة خلال الربع الحالي؛ حيث أظهر التقرير التزاماً متميزاً بتطبيق معايير الحوكمة واجتياز اختبار الانطلاقة الأولى بدرجة (${app.examScore || 90} / 100)، وتوثيق كامل أنشطة المتطوعين عبر المنصة الوطنية.
      </p>
      <div style="background: #ECFDF5; border-right: 4px solid #10B981; padding: 10px 14px; margin: 12px 0; font-size: 0.82rem; color: #065F46;">
        <strong>القرار:</strong> ترقية الجمعية لاستحقاق الدعم التسريعي الكامل وإحالة ملفها لبرنامج المنح الاستثمارية المانحة.
      </div>
      <div style="margin-top: 20px; text-align: left;">
        <strong style="font-size: 0.85rem; color: #0D6E46;">المشرف العام على حاضنة ومسرعة عذق</strong>
      </div>
    `;
  }
};

window.saveAndStampAdminDoc = function() {
  showToast('✓ تم ختم واعتماد الوثيقة تلقائياً وإرسال نسخة رسمية للجمعية!', 'success');
  closeAdminDocGeneratorModal();
};

const DEFAULT_HQ_CHECKLIST = [
  { key: 'keys_custody', title: 'نموذج استلام المفاتيح والعهد الرسمية', done: true, date: '1446/08/10' },
  { key: 'smart_cards', title: 'طباعة الكروت الممغنطة الذكية (Access Cards)', done: true, date: '1446/08/12' },
  { key: 'door_naming', title: 'تسمية الباب ولوحة التعريف الخارجية (مكتب 104)', done: true, date: '1446/08/14' },
  { key: 'designer_notify', title: 'إشعار المصمم لطباعة لوحات وهوية الجمعية الرسمية', done: false, date: '' }
];

window.renderHqChecklist = function() {
  const container = document.getElementById('hqChecklistGroup');
  if (!container) return;

  const items = APP_STATE.hqChecklist || DEFAULT_HQ_CHECKLIST;
  const doneCount = items.filter(i => i.done).length;

  const badgeEl = document.getElementById('hqChecklistProgressBadge');
  if (badgeEl) badgeEl.textContent = `${doneCount} من ${items.length} مهام منجزة ✓`;

  container.innerHTML = items.map(item => `
    <div class="hq-checklist-item ${item.done ? 'done' : ''}" onclick="toggleHqChecklistItem('${item.key}')">
      <div style="display: flex; align-items: center; gap: 10px;">
        <input type="checkbox" ${item.done ? 'checked' : ''} style="width: 18px; height: 18px; accent-color: var(--ethq-green-primary, #0D6E46); cursor: pointer;" onclick="event.stopPropagation(); toggleHqChecklistItem('${item.key}')">
        <span class="hq-task-title" style="font-size: 0.88rem; font-weight: 700;">${item.title}</span>
      </div>
      <span class="badge" style="background: ${item.done ? '#DCFCE7' : '#F1F5F9'}; color: ${item.done ? '#166534' : '#64748B'}; font-size: 0.74rem;">
        ${item.done ? `مكتمل (${item.date || 'معتمد'}) ✓` : 'قيد التنفيذ'}
      </span>
    </div>
  `).join('');
};

window.toggleHqChecklistItem = function(key) {
  if (!APP_STATE.hqChecklist) APP_STATE.hqChecklist = [...DEFAULT_HQ_CHECKLIST];
  const item = APP_STATE.hqChecklist.find(i => i.key === key);
  if (item) {
    item.done = !item.done;
    if (item.done && !item.date) item.date = 'اليوم';
    saveAppState();
    renderHqChecklist();
    showToast(`تم تحديث حالة المهمة: ${item.title}`, 'info');
  }
};

// 5. Foundational Services Radial Progress Meter
const FOUNDATIONAL_SERVICES_CONFIG = [
  { key: 'ifsah', title: 'منصة إفصاح (المركز الوطني)', icon: 'fa-shield-halved', done: true },
  { key: 'num700', title: 'الرقم الوطني الموحد (700)', icon: 'fa-fingerprint', done: true },
  { key: 'etimad', title: 'منصة اعتماد المالية', icon: 'fa-landmark', done: true },
  { key: 'qiwa', title: 'منصة قوى (الموارد البشرية)', icon: 'fa-users-gear', done: true },
  { key: 'mudad', title: 'نظام حماية الأجور (مدد)', icon: 'fa-money-check-dollar', done: true },
  { key: 'national_address', title: 'العنوان الوطني لمقر الحاضنة', icon: 'fa-location-dot', done: true },
  { key: 'bank_account', title: 'الحسابات البنكية الرسمية', icon: 'fa-credit-card', done: true },
  { key: 'bylaws', title: 'اللوائح والسياسات المعتمدة', icon: 'fa-file-shield', done: false }
];

window.initFoundationalRadialProgress = function() {
  const container = document.getElementById('foundationalServicesGrid');
  if (!container) return;

  if (!APP_STATE.foundationalServices) {
    APP_STATE.foundationalServices = [...FOUNDATIONAL_SERVICES_CONFIG];
  }

  const services = APP_STATE.foundationalServices;
  const doneCount = services.filter(s => s.done).length;
  const total = services.length;
  const pct = Math.round((doneCount / total) * 100);

  // Update SVG Circle (r=70 => circumference ≈ 439.82)
  const circle = document.getElementById('radialProgressCircle');
  const pctEl = document.getElementById('radialPctNumber');
  const badgeEl = document.getElementById('radialStatusBadge');

  const circumference = 439.82;
  const offset = circumference - (pct / 100) * circumference;

  if (circle) circle.style.strokeDashoffset = offset;
  if (pctEl) pctEl.textContent = `${pct}%`;
  if (badgeEl) {
    badgeEl.textContent = `${doneCount} من ${total} خدمات مكتملة (${pct}%) ${pct === 100 ? '✓ مكتمل 100%' : '✓'}`;
    badgeEl.style.background = pct >= 80 ? '#DCFCE7' : '#FEF3C7';
    badgeEl.style.color = pct >= 80 ? '#166534' : '#92400E';
  }

  container.innerHTML = services.map(s => `
    <label class="foundational-service-item ${s.done ? 'active' : ''}">
      <input type="checkbox" ${s.done ? 'checked' : ''} onchange="toggleFoundationalService('${s.key}')">
      <i class="fa-solid ${s.icon}" style="color: ${s.done ? 'var(--ethq-green-primary, #0D6E46)' : 'var(--text-secondary)'}; font-size: 0.95rem;"></i>
      <span style="font-size: 0.82rem; font-weight: 700; color: ${s.done ? 'var(--ethq-green-primary, #0D6E46)' : 'var(--c-text-primary)'};">${s.title}</span>
    </label>
  `).join('');
};

window.toggleFoundationalService = function(key) {
  if (!APP_STATE.foundationalServices) {
    APP_STATE.foundationalServices = [...FOUNDATIONAL_SERVICES_CONFIG];
  }
  const item = APP_STATE.foundationalServices.find(s => s.key === key);
  if (item) {
    item.done = !item.done;
    saveAppState();
    initFoundationalRadialProgress();
    showToast(`تم تحديث جاهزية الخدمة: ${item.title} (${item.done ? 'مكتملة ✓' : 'غير مكتملة'})`, 'info');
  }
};


