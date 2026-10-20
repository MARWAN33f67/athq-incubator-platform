-- ==============================================================================
-- حاضنة ومسرعة عذق - جمعية البر بالمدينة المنورة
-- وثيقة مخطط قاعدة البيانات المركزية (Database Schema DDL)
-- متوافق مع: PostgreSQL / MySQL 8.0+ / MariaDB / Supabase
-- تاريخ الإنشاء: 1446هـ - 2025م
-- ==============================================================================

-- 1. جدول الجمعيات والمنظمات الأهلية (Organizations Directory)
CREATE TABLE IF NOT EXISTS athq_organizations (
    id VARCHAR(32) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    license_number VARCHAR(64) UNIQUE,
    national_number_700 VARCHAR(64),
    category VARCHAR(64) NOT NULL DEFAULT 'تنمية', -- تنمية، شباب، ثقافة، صحي...
    track VARCHAR(255) NOT NULL,                    -- مسار الحوكمة، البناء، التدريب، الاستشارات...
    status VARCHAR(32) NOT NULL DEFAULT 'محتضنة',   -- محتضنة، متخرجة، في مرحلة التهيئة
    work_hours INT NOT NULL DEFAULT 0,
    volunteer_hours INT NOT NULL DEFAULT 0,
    volunteers_count INT NOT NULL DEFAULT 0,
    badge_label VARCHAR(128) DEFAULT 'مكتب مجهز',
    city VARCHAR(128) DEFAULT 'المدينة المنورة',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. جدول طلبات الاحتضان وسير مراحل BPMN (Applications & Incubation Workflow)
CREATE TABLE IF NOT EXISTS athq_applications (
    id VARCHAR(32) PRIMARY KEY,
    association_name VARCHAR(255) NOT NULL,
    license_number VARCHAR(64) NOT NULL,
    national_number_700 VARCHAR(64),
    city VARCHAR(128) DEFAULT 'المدينة المنورة',
    rep_name VARCHAR(128) NOT NULL,
    rep_phone VARCHAR(32) NOT NULL,
    rep_email VARCHAR(128),
    track VARCHAR(255) NOT NULL,
    incubation_type VARCHAR(128) NOT NULL DEFAULT 'احتضان مكاني ومؤسسي', -- احتضان مكاني ومؤسسي، مساحة عمل مشتركة، عن بعد
    stage VARCHAR(128) NOT NULL DEFAULT 'المرحلة الأولى: الفكرة والتأسيس',
    stage_progress INT NOT NULL DEFAULT 25, -- 0 to 100%
    status VARCHAR(32) NOT NULL DEFAULT 'تحت المراجعة', -- تحت المراجعة، مطلوب تعديل، مقبول، مرفوض
    full_time_employee VARCHAR(255) DEFAULT 'قيد التعيين والاستكمال',
    exam_score INT DEFAULT 80,
    notes TEXT,
    work_hours INT DEFAULT 0,
    volunteer_hours INT DEFAULT 0,
    volunteers_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. جدول الشواهد والوثائق الرسمية التابعة للطلبات (Application Evidences)
CREATE TABLE IF NOT EXISTS athq_application_evidences (
    id VARCHAR(32) PRIMARY KEY,
    application_id VARCHAR(32) NOT NULL,
    title VARCHAR(255) NOT NULL,
    status VARCHAR(64) DEFAULT 'معتمد ✓', -- معتمد ✓، قيد المراجعة، مرفوض
    file_url TEXT,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (application_id) REFERENCES athq_applications(id) ON DELETE CASCADE
);

-- 4. جدول المستشارين والخبراء المعتمدين (Consultants Network)
CREATE TABLE IF NOT EXISTS athq_consultants (
    id VARCHAR(32) PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    title VARCHAR(128) NOT NULL,
    specialty VARCHAR(255) NOT NULL,
    avatar VARCHAR(64) DEFAULT '👨‍🏫',
    experience_years VARCHAR(64) DEFAULT '10 سنوات خبرة',
    rating VARCHAR(32) DEFAULT '4.9 ★',
    completed_hours INT DEFAULT 0,
    available_slots TEXT, -- JSON أو نص يصف الفترات المتاحة
    phone VARCHAR(32),
    email VARCHAR(128),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. جدول طلبات وجلسات الاستشارات المجدولة (Consultation Sessions)
CREATE TABLE IF NOT EXISTS athq_consultations (
    id VARCHAR(32) PRIMARY KEY,
    assoc_name VARCHAR(255) NOT NULL,
    consultant_id VARCHAR(32),
    consultant_name VARCHAR(128) NOT NULL,
    field VARCHAR(255) NOT NULL,
    session_date DATE NOT NULL,
    session_time VARCHAR(64) DEFAULT '10:00 ص - 12:00 م',
    session_type VARCHAR(32) DEFAULT 'حضوري بالحاضنة', -- حضوري بالحاضنة، افتراضي
    status VARCHAR(32) DEFAULT 'مجدولة', -- مجدولة، منجزة ✓، ملغاة
    recommendations TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (consultant_id) REFERENCES athq_consultants(id) ON DELETE SET NULL
);

-- 6. جدول المرافق والتجهيزات (Incubator Facilities)
CREATE TABLE IF NOT EXISTS athq_facilities (
    id VARCHAR(32) PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    category VARCHAR(64) NOT NULL, -- قاعات، مقرات مجهزة، مساحات عمل، أركان ضيافة
    capacity INT NOT NULL DEFAULT 10,
    location VARCHAR(128) DEFAULT 'مقر الحاضنة - الدور الأرضي',
    amenities TEXT, -- شاشات ذكية، نظام صوتي، إنترنت ألياف...
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. جدول حجوزات المرافق والقاعات (Facility Bookings)
CREATE TABLE IF NOT EXISTS athq_facility_bookings (
    id VARCHAR(32) PRIMARY KEY,
    assoc_name VARCHAR(255) NOT NULL,
    facility_id VARCHAR(32),
    facility_name VARCHAR(128) NOT NULL,
    booking_date DATE NOT NULL,
    booking_time VARCHAR(64) NOT NULL,
    status VARCHAR(32) DEFAULT 'مؤكد ✓', -- مؤكد ✓، بانتظار الاعتماد، ملغى
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (facility_id) REFERENCES athq_facilities(id) ON DELETE SET NULL
);

-- 8. جدول رسائل وتواصل الزوار والجهات (Contact Messages)
CREATE TABLE IF NOT EXISTS athq_contact_messages (
    id VARCHAR(32) PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    organization VARCHAR(255),
    phone VARCHAR(32) NOT NULL,
    email VARCHAR(128) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(64) DEFAULT 'قيد المتابعة', -- قيد المتابعة، تم التواصل، مغلق
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. جدول الإشعارات والتنبيهات الحية (System Notifications)
CREATE TABLE IF NOT EXISTS athq_notifications (
    id VARCHAR(32) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    text TEXT NOT NULL,
    time_label VARCHAR(64) DEFAULT 'الآن',
    icon VARCHAR(64) DEFAULT 'fa-bell',
    unread BOOLEAN DEFAULT TRUE,
    target_role VARCHAR(32) DEFAULT 'all', -- all, admin, association, consultant
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 10. جدول مؤشرات الأداء الحية (KPIs & Metrics)
CREATE TABLE IF NOT EXISTS athq_kpis (
    metric_key VARCHAR(64) PRIMARY KEY,
    metric_label VARCHAR(255) NOT NULL,
    metric_value BIGINT NOT NULL,
    unit_prefix VARCHAR(16) DEFAULT '+',
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 11. جدول سجل العمليات والتدقيق الأمني (Audit Logs)
CREATE TABLE IF NOT EXISTS athq_audit_logs (
    id VARCHAR(32) PRIMARY KEY,
    action_type VARCHAR(64) NOT NULL, -- CREATE, UPDATE, DELETE, STATUS_CHANGE
    entity_name VARCHAR(64) NOT NULL, -- applications, bookings, consultants...
    entity_id VARCHAR(32) NOT NULL,
    actor_name VARCHAR(128) DEFAULT 'مدير النظام المركزي',
    details TEXT,
    ip_address VARCHAR(64) DEFAULT '127.0.0.1',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 12. جدول المستخدمين وإدارة الهوية والصلاحيات (Users & Identity Access Management)
CREATE TABLE IF NOT EXISTS athq_users (
    id VARCHAR(32) PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    email VARCHAR(128) UNIQUE NOT NULL,
    phone VARCHAR(32) UNIQUE,
    role VARCHAR(32) NOT NULL DEFAULT 'visitor', -- admin, association, consultant, visitor
    entity_id VARCHAR(32),                      -- يربط بالمؤسسة ORG أو المستشار CONS
    password_hash VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- إنشاء الفهارس لتحسين سرعة الاستعلامات والبحث
CREATE INDEX IF NOT EXISTS idx_org_status ON athq_organizations(status);
CREATE INDEX IF NOT EXISTS idx_org_track ON athq_organizations(track);
CREATE INDEX IF NOT EXISTS idx_app_status ON athq_applications(status);
CREATE INDEX IF NOT EXISTS idx_app_stage ON athq_applications(stage);
CREATE INDEX IF NOT EXISTS idx_booking_date ON athq_facility_bookings(booking_date);
CREATE INDEX IF NOT EXISTS idx_consult_date ON athq_consultations(session_date);
CREATE INDEX IF NOT EXISTS idx_user_email ON athq_users(email);
CREATE INDEX IF NOT EXISTS idx_user_role ON athq_users(role);

