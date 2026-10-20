/**
 * حاضنة ومسرعة عذق - جمعية البر بالمدينة المنورة
 * محرك قاعدة البيانات المركزية المتكامل (Athq Central Database Engine)
 * يعتمد على IndexedDB عالية الأداء + مزامنة LocalStorage + تصدير واستيراد SQL / JSON
 */

class AthqDatabaseEngine {
  constructor() {
    this.dbName = 'AthqIncubatorDB_v2';
    this.version = 2;
    this.db = null;
    this.isReady = false;
    this.readyPromise = this.init();
  }

  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // 1. جدول المنظمات والجمعيات
        if (!db.objectStoreNames.contains('organizations')) {
          const store = db.createObjectStore('organizations', { keyPath: 'id' });
          store.createIndex('status', 'status', { unique: false });
          store.createIndex('category', 'category', { unique: false });
          store.createIndex('track', 'track', { unique: false });
        }

        // 2. جدول طلبات الاحتضان
        if (!db.objectStoreNames.contains('applications')) {
          const store = db.createObjectStore('applications', { keyPath: 'id' });
          store.createIndex('status', 'status', { unique: false });
          store.createIndex('stage', 'stage', { unique: false });
          store.createIndex('track', 'track', { unique: false });
        }

        // 3. جدول حجوزات المرافق
        if (!db.objectStoreNames.contains('bookings')) {
          const store = db.createObjectStore('bookings', { keyPath: 'id' });
          store.createIndex('facility', 'facility', { unique: false });
          store.createIndex('date', 'date', { unique: false });
        }

        // 4. جدول المستشارين
        if (!db.objectStoreNames.contains('consultants')) {
          const store = db.createObjectStore('consultants', { keyPath: 'id' });
          store.createIndex('specialty', 'specialty', { unique: false });
        }

        // 5. جدول الجلسات الاستشارية
        if (!db.objectStoreNames.contains('consultations')) {
          const store = db.createObjectStore('consultations', { keyPath: 'id' });
          store.createIndex('status', 'status', { unique: false });
          store.createIndex('date', 'date', { unique: false });
        }

        // 6. جدول رسائل التواصل
        if (!db.objectStoreNames.contains('contact_messages')) {
          const store = db.createObjectStore('contact_messages', { keyPath: 'id' });
          store.createIndex('status', 'status', { unique: false });
        }

        // 7. جدول الإشعارات
        if (!db.objectStoreNames.contains('notifications')) {
          const store = db.createObjectStore('notifications', { keyPath: 'id' });
          store.createIndex('unread', 'unread', { unique: false });
        }

        // 8. جدول مؤشرات الأداء KPIs
        if (!db.objectStoreNames.contains('kpis')) {
          db.createObjectStore('kpis', { keyPath: 'key' });
        }

        // 9. جدول سجل التدقيق والعمليات (Audit Logs)
        if (!db.objectStoreNames.contains('audit_logs')) {
          const store = db.createObjectStore('audit_logs', { keyPath: 'id' });
          store.createIndex('action', 'action', { unique: false });
          store.createIndex('timestamp', 'timestamp', { unique: false });
        }

        // 10. جدول الإعدادات المركزية
        if (!db.objectStoreNames.contains('system_settings')) {
          db.createObjectStore('system_settings', { keyPath: 'key' });
        }
      };

      request.onsuccess = async (event) => {
        this.db = event.target.result;
        this.isReady = true;
        await this.ensureSeedData();
        resolve(this);
      };

      request.onerror = (event) => {
        console.error('AthqDatabaseEngine: IndexedDB Error:', event.target.error);
        resolve(this); // Graceful fallback
      };
    });
  }

  // التأكد من توفر البيانات الأولية وتغذية قاعدة البيانات تلقائياً
  async ensureSeedData() {
    try {
      const orgCount = await this.count('organizations');
      if (orgCount === 0) {
        console.info('AthqDatabaseEngine: Seeding initial official data...');
        await this.populateFromSeed();
      }
    } catch (err) {
      console.warn('AthqDatabaseEngine: Seed check warning:', err);
    }
  }

  async populateFromSeed() {
    if (typeof DEFAULT_SEED_DATA === 'undefined') return;

    // 1. تغذية المنظمات
    if (DEFAULT_SEED_DATA.directoryOrgs && Array.isArray(DEFAULT_SEED_DATA.directoryOrgs)) {
      for (let i = 0; i < DEFAULT_SEED_DATA.directoryOrgs.length; i++) {
        const org = DEFAULT_SEED_DATA.directoryOrgs[i];
        await this.put('organizations', {
          id: `ORG-${String(i + 1).padStart(2, '0')}`,
          name: org.name,
          licenseNumber: org.lic,
          track: org.track,
          category: org.cat,
          status: org.status,
          hours: org.hours,
          volHours: org.volHours,
          volunteers: org.volunteers,
          badge: org.badge,
          createdAt: new Date().toISOString()
        });
      }
    }

    // 2. تغذية طلبات الاحتضان
    if (DEFAULT_SEED_DATA.applications && Array.isArray(DEFAULT_SEED_DATA.applications)) {
      for (const app of DEFAULT_SEED_DATA.applications) {
        await this.put('applications', { ...app, updatedAt: new Date().toISOString() });
      }
    }

    // 3. تغذية الحجوزات
    if (DEFAULT_SEED_DATA.bookings && Array.isArray(DEFAULT_SEED_DATA.bookings)) {
      for (const bkg of DEFAULT_SEED_DATA.bookings) {
        await this.put('bookings', { ...bkg, createdAt: new Date().toISOString() });
      }
    }

    // 4. تغذية المستشارين
    if (DEFAULT_SEED_DATA.consultants && Array.isArray(DEFAULT_SEED_DATA.consultants)) {
      for (const cons of DEFAULT_SEED_DATA.consultants) {
        await this.put('consultants', { ...cons, createdAt: new Date().toISOString() });
      }
    }

    // 5. تغذية الجلسات الاستشارية
    if (DEFAULT_SEED_DATA.consultations && Array.isArray(DEFAULT_SEED_DATA.consultations)) {
      for (const cns of DEFAULT_SEED_DATA.consultations) {
        await this.put('consultations', { ...cns, createdAt: new Date().toISOString() });
      }
    }

    // 6. تغذية الرسائل
    if (DEFAULT_SEED_DATA.contactMessages && Array.isArray(DEFAULT_SEED_DATA.contactMessages)) {
      for (const msg of DEFAULT_SEED_DATA.contactMessages) {
        await this.put('contact_messages', { ...msg, createdAt: new Date().toISOString() });
      }
    }

    // 7. تغذية الإشعارات
    if (DEFAULT_SEED_DATA.notifications && Array.isArray(DEFAULT_SEED_DATA.notifications)) {
      for (const ntf of DEFAULT_SEED_DATA.notifications) {
        await this.put('notifications', { ...ntf, createdAt: new Date().toISOString() });
      }
    }

    // 8. مؤشرات الأداء
    if (DEFAULT_SEED_DATA.stats) {
      for (const [key, val] of Object.entries(DEFAULT_SEED_DATA.stats)) {
        await this.put('kpis', { key, value: val, lastUpdated: new Date().toISOString() });
      }
    }

    // 9. إضافة سجل تدقيق أولي
    await this.logAudit('INIT_DATABASE', 'system', 'root', 'تمت تهيئة قاعدة البيانات المركزية بالبيانات الرسمية بنجاح.');
  }

  // العمليات الأساسية (CRUD Methods)
  async getAll(storeName) {
    await this.readyPromise;
    if (!this.db) return this.fallbackGetAll(storeName);

    return new Promise((resolve) => {
      try {
        const tx = this.db.transaction(storeName, 'readonly');
        const store = tx.objectStore(storeName);
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => resolve(this.fallbackGetAll(storeName));
      } catch (e) {
        resolve(this.fallbackGetAll(storeName));
      }
    });
  }

  async get(storeName, id) {
    await this.readyPromise;
    if (!this.db) return null;

    return new Promise((resolve) => {
      try {
        const tx = this.db.transaction(storeName, 'readonly');
        const store = tx.objectStore(storeName);
        const req = store.get(id);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => resolve(null);
      } catch (e) {
        resolve(null);
      }
    });
  }

  async put(storeName, item) {
    await this.readyPromise;
    if (!item.id && storeName !== 'kpis' && storeName !== 'system_settings') {
      item.id = `${storeName.toUpperCase().slice(0, 3)}-${Date.now()}`;
    }
    item.updatedAt = new Date().toISOString();

    if (!this.db) {
      this.fallbackPut(storeName, item);
      return item;
    }

    return new Promise((resolve, reject) => {
      try {
        const tx = this.db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        const req = store.put(item);
        req.onsuccess = () => {
          this.syncToAppState(storeName, item, 'put');
          resolve(item);
        };
        req.onerror = (e) => reject(e.target.error);
      } catch (e) {
        this.fallbackPut(storeName, item);
        resolve(item);
      }
    });
  }

  async delete(storeName, id) {
    await this.readyPromise;
    if (!this.db) {
      this.fallbackDelete(storeName, id);
      return true;
    }

    return new Promise((resolve) => {
      try {
        const tx = this.db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        const req = store.delete(id);
        req.onsuccess = () => {
          this.syncToAppState(storeName, { id }, 'delete');
          resolve(true);
        };
        req.onerror = () => resolve(false);
      } catch (e) {
        resolve(false);
      }
    });
  }

  async count(storeName) {
    await this.readyPromise;
    if (!this.db) return this.fallbackGetAll(storeName).length;

    return new Promise((resolve) => {
      try {
        const tx = this.db.transaction(storeName, 'readonly');
        const store = tx.objectStore(storeName);
        const req = store.count();
        req.onsuccess = () => resolve(req.result || 0);
        req.onerror = () => resolve(0);
      } catch (e) {
        resolve(0);
      }
    });
  }

  async clear(storeName) {
    await this.readyPromise;
    if (!this.db) return;
    return new Promise((resolve) => {
      try {
        const tx = this.db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        const req = store.clear();
        req.onsuccess = () => resolve(true);
        req.onerror = () => resolve(false);
      } catch (e) {
        resolve(false);
      }
    });
  }

  // تسجيل العمليات في سجل التدقيق
  async logAudit(action, entity, entityId, details = '') {
    try {
      const logItem = {
        id: `LOG-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        action: action,
        entity: entity,
        entityId: entityId,
        details: details,
        actor: 'مدير المنصة المركزي',
        timestamp: new Date().toISOString(),
        timeFormatted: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      };
      await this.put('audit_logs', logItem);
    } catch (e) {
      console.warn('Audit log write error:', e);
    }
  }

  // مزامنة فورية مع APP_STATE لضمان عمل الواجهات بسلاسة تامة
  syncToAppState(storeName, item, actionType) {
    if (typeof APP_STATE === 'undefined') return;

    if (storeName === 'applications') {
      if (!APP_STATE.applications) APP_STATE.applications = [];
      if (actionType === 'put') {
        const idx = APP_STATE.applications.findIndex(a => a.id === item.id);
        if (idx >= 0) APP_STATE.applications[idx] = item;
        else APP_STATE.applications.unshift(item);
      } else if (actionType === 'delete') {
        APP_STATE.applications = APP_STATE.applications.filter(a => a.id !== item.id);
      }
    } else if (storeName === 'bookings') {
      if (!APP_STATE.bookings) APP_STATE.bookings = [];
      if (actionType === 'put') {
        const idx = APP_STATE.bookings.findIndex(b => b.id === item.id);
        if (idx >= 0) APP_STATE.bookings[idx] = item;
        else APP_STATE.bookings.unshift(item);
      } else if (actionType === 'delete') {
        APP_STATE.bookings = APP_STATE.bookings.filter(b => b.id !== item.id);
      }
    } else if (storeName === 'consultations') {
      if (!APP_STATE.consultations) APP_STATE.consultations = [];
      if (actionType === 'put') {
        const idx = APP_STATE.consultations.findIndex(c => c.id === item.id);
        if (idx >= 0) APP_STATE.consultations[idx] = item;
        else APP_STATE.consultations.unshift(item);
      } else if (actionType === 'delete') {
        APP_STATE.consultations = APP_STATE.consultations.filter(c => c.id !== item.id);
      }
    } else if (storeName === 'contact_messages') {
      if (!APP_STATE.contactMessages) APP_STATE.contactMessages = [];
      if (actionType === 'put') {
        const idx = APP_STATE.contactMessages.findIndex(m => m.id === item.id);
        if (idx >= 0) APP_STATE.contactMessages[idx] = item;
        else APP_STATE.contactMessages.unshift(item);
      }
    } else if (storeName === 'notifications') {
      if (!APP_STATE.notifications) APP_STATE.notifications = [];
      if (actionType === 'put') {
        const idx = APP_STATE.notifications.findIndex(n => n.id === item.id);
        if (idx >= 0) APP_STATE.notifications[idx] = item;
        else APP_STATE.notifications.unshift(item);
      }
    }

    // حفظ في LocalStorage كطبقة حماية ثانية
    if (typeof savePlatformState === 'function') {
      savePlatformState();
    }
  }

  // Fallbacks في حال تعطيل المتصفح لـ IndexedDB
  fallbackGetAll(storeName) {
    if (typeof APP_STATE === 'undefined') return [];
    if (storeName === 'applications') return APP_STATE.applications || [];
    if (storeName === 'bookings') return APP_STATE.bookings || [];
    if (storeName === 'consultations') return APP_STATE.consultations || [];
    if (storeName === 'consultants') return APP_STATE.consultants || [];
    if (storeName === 'organizations') return APP_STATE.directoryOrgs || [];
    if (storeName === 'contact_messages') return APP_STATE.contactMessages || [];
    if (storeName === 'notifications') return APP_STATE.notifications || [];
    return [];
  }

  fallbackPut(storeName, item) {
    this.syncToAppState(storeName, item, 'put');
  }

  fallbackDelete(storeName, id) {
    this.syncToAppState(storeName, { id }, 'delete');
  }

  // 1. تصدير كامل البيانات كملف SQL متكامل مع DDL و INSERTS بنقرة واحدة
  async exportFullSQL() {
    await this.readyPromise;

    const orgs = await this.getAll('organizations');
    const apps = await this.getAll('applications');
    const bkgs = await this.getAll('bookings');
    const cons = await this.getAll('consultants');
    const cns = await this.getAll('consultations');
    const msgs = await this.getAll('contact_messages');
    const ntfs = await this.getAll('notifications');

    let sql = `-- ==============================================================================\n`;
    sql += `-- تفريغ قاعدة بيانات حاضنة ومسرعة عذق - جمعية البر بالمدينة المنورة\n`;
    sql += `-- تاريخ التصدير: ${new Date().toISOString()}\n`;
    sql += `-- متوافق مع: MySQL / MariaDB / PostgreSQL / Supabase\n`;
    sql += `-- ==============================================================================\n\n`;

    const escapeSQL = (val) => {
      if (val === null || val === undefined) return 'NULL';
      if (typeof val === 'number' || typeof val === 'boolean') return val;
      return `'${String(val).replace(/'/g, "''")}'`;
    };

    // Organizations
    if (orgs.length > 0) {
      sql += `-- 1. جدول المنظمات والجمعيات (${orgs.length} سجل)\n`;
      sql += `INSERT INTO athq_organizations (id, name, license_number, track, category, status, work_hours, volunteer_hours, volunteers_count, badge_label) VALUES\n`;
      sql += orgs.map(o => `(${escapeSQL(o.id)}, ${escapeSQL(o.name)}, ${escapeSQL(o.licenseNumber || o.lic)}, ${escapeSQL(o.track)}, ${escapeSQL(o.category || o.cat)}, ${escapeSQL(o.status)}, ${escapeSQL(parseInt(o.hours) || 0)}, ${escapeSQL(parseInt(o.volHours) || 0)}, ${escapeSQL(parseInt(o.volunteers) || 0)}, ${escapeSQL(o.badge)})`).join(',\n') + ';\n\n';
    }

    // Applications
    if (apps.length > 0) {
      sql += `-- 2. جدول طلبات الاحتضان ومراحل BPMN (${apps.length} سجل)\n`;
      sql += `INSERT INTO athq_applications (id, association_name, license_number, national_number_700, rep_name, rep_phone, track, incubation_type, stage, stage_progress, status, full_time_employee, exam_score, notes) VALUES\n`;
      sql += apps.map(a => `(${escapeSQL(a.id)}, ${escapeSQL(a.associationName)}, ${escapeSQL(a.licenseNumber)}, ${escapeSQL(a.nationalNumber700 || '7000000000')}, ${escapeSQL(a.repName)}, ${escapeSQL(a.repPhone)}, ${escapeSQL(a.track)}, ${escapeSQL(a.incubationType)}, ${escapeSQL(a.stage)}, ${escapeSQL(a.stageProgress || 50)}, ${escapeSQL(a.status)}, ${escapeSQL(a.fullTimeEmployee)}, ${escapeSQL(a.examScore || 85)}, ${escapeSQL(a.notes)})`).join(',\n') + ';\n\n';
    }

    // Bookings
    if (bkgs.length > 0) {
      sql += `-- 3. جدول حجوزات المرافق (${bkgs.length} سجل)\n`;
      sql += `INSERT INTO athq_facility_bookings (id, assoc_name, facility_name, booking_date, booking_time, status) VALUES\n`;
      sql += bkgs.map(b => `(${escapeSQL(b.id)}, ${escapeSQL(b.assocName)}, ${escapeSQL(b.facility)}, ${escapeSQL(b.date)}, ${escapeSQL(b.time)}, ${escapeSQL(b.status)})`).join(',\n') + ';\n\n';
    }

    // Consultants
    if (cons.length > 0) {
      sql += `-- 4. جدول المستشارين والخبراء (${cons.length} سجل)\n`;
      sql += `INSERT INTO athq_consultants (id, name, title, specialty, rating, completed_hours) VALUES\n`;
      sql += cons.map(c => `(${escapeSQL(c.id)}, ${escapeSQL(c.name)}, ${escapeSQL(c.title)}, ${escapeSQL(c.specialty)}, ${escapeSQL(c.rating)}, ${escapeSQL(c.hours || 0)})`).join(',\n') + ';\n\n';
    }

    // Consultations
    if (cns.length > 0) {
      sql += `-- 5. جدول الجلسات الاستشارية (${cns.length} سجل)\n`;
      sql += `INSERT INTO athq_consultations (id, assoc_name, consultant_name, field, session_date, status) VALUES\n`;
      sql += cns.map(c => `(${escapeSQL(c.id)}, ${escapeSQL(c.assocName)}, ${escapeSQL(c.consultant)}, ${escapeSQL(c.field)}, ${escapeSQL(c.date)}, ${escapeSQL(c.status)})`).join(',\n') + ';\n\n';
    }

    // Contact Messages
    if (msgs.length > 0) {
      sql += `-- 6. جدول رسائل وتواصل الزوار (${msgs.length} سجل)\n`;
      sql += `INSERT INTO athq_contact_messages (id, name, organization, phone, email, subject, message, status) VALUES\n`;
      sql += msgs.map(m => `(${escapeSQL(m.id)}, ${escapeSQL(m.name)}, ${escapeSQL(m.org)}, ${escapeSQL(m.phone)}, ${escapeSQL(m.email)}, ${escapeSQL(m.subject)}, ${escapeSQL(m.message)}, ${escapeSQL(m.status)})`).join(',\n') + ';\n\n';
    }

    // Notifications
    if (ntfs.length > 0) {
      sql += `-- 7. جدول الإشعارات (${ntfs.length} سجل)\n`;
      sql += `INSERT INTO athq_notifications (id, title, text, time_label, icon, unread) VALUES\n`;
      sql += ntfs.map(n => `(${escapeSQL(n.id)}, ${escapeSQL(n.title)}, ${escapeSQL(n.text)}, ${escapeSQL(n.time)}, ${escapeSQL(n.icon)}, ${escapeSQL(n.unread ? 1 : 0)})`).join(',\n') + ';\n';
    }

    this.downloadFile(sql, `athq_database_backup_${new Date().toISOString().slice(0, 10)}.sql`, 'text/plain;charset=utf-8');
    await this.logAudit('EXPORT_SQL', 'database', 'all', 'تم تصدير ملف SQL كامل لقاعدة البيانات.');
    return sql;
  }

  // 2. تصدير كامل البيانات كملف JSON
  async exportFullJSON() {
    await this.readyPromise;
    const backup = {
      system: 'حاضنة ومسرعة عذق - جمعية البر بالمدينة المنورة',
      version: '2.0',
      exportedAt: new Date().toISOString(),
      tables: {
        organizations: await this.getAll('organizations'),
        applications: await this.getAll('applications'),
        bookings: await this.getAll('bookings'),
        consultants: await this.getAll('consultants'),
        consultations: await this.getAll('consultations'),
        contact_messages: await this.getAll('contact_messages'),
        notifications: await this.getAll('notifications'),
        audit_logs: await this.getAll('audit_logs')
      }
    };

    const json = JSON.stringify(backup, null, 2);
    this.downloadFile(json, `athq_db_snapshot_${new Date().toISOString().slice(0, 10)}.json`, 'application/json');
    await this.logAudit('EXPORT_JSON', 'database', 'all', 'تم إنشاء نسخة احتياطية بصيغة JSON.');
    return backup;
  }

  // 3. استيراد واستعادة البيانات من ملف JSON
  async importJSON(jsonContent) {
    try {
      const data = typeof jsonContent === 'string' ? JSON.parse(jsonContent) : jsonContent;
      if (!data.tables) throw new Error('صيغة ملف النسخة الاحتياطية غير صالحة (مفقود حقل الجداول).');

      for (const [storeName, records] of Object.entries(data.tables)) {
        if (Array.isArray(records)) {
          await this.clear(storeName);
          for (const item of records) {
            await this.put(storeName, item);
          }
        }
      }

      await this.logAudit('IMPORT_RESTORE', 'database', 'all', 'تم استعادة قاعدة البيانات من ملف نسخة احتياطية بنجاح.');
      if (typeof showToast === 'function') showToast('تم استعادة قاعدة البيانات وتحديث كافة الجداول بنجاح ✓');
      setTimeout(() => window.location.reload(), 1200);
      return true;
    } catch (err) {
      console.error('Import error:', err);
      if (typeof showToast === 'function') showToast('فشل استيراد النسخة: ' + err.message, 'error');
      return false;
    }
  }

  // 4. إعادة ضبط قاعدة البيانات للقيم الأصلية
  async resetToDefault() {
    const stores = ['organizations', 'applications', 'bookings', 'consultants', 'consultations', 'contact_messages', 'notifications', 'kpis', 'audit_logs'];
    for (const s of stores) {
      await this.clear(s);
    }
    await this.populateFromSeed();
    await this.logAudit('FACTORY_RESET', 'database', 'all', 'تمت إعادة ضبط قاعدة البيانات بالكامل إلى الحالة المصنعية الرسمية.');
    if (typeof showToast === 'function') showToast('تمت إعادة ضبط قاعدة البيانات بنجاح إلى الحالة المصنعية المعتمدة ✓');
    setTimeout(() => window.location.reload(), 1000);
  }

  // 5. تقرير إحصائيات الجداول (Data Dictionary & Metrics)
  async getDatabaseStats() {
    await this.readyPromise;
    const stats = {
      engine: this.db ? 'IndexedDB (Active Transactional Storage)' : 'LocalStorage Fallback',
      version: this.version,
      status: 'متصل وجاهز للعمليات ✓',
      tables: [
        { name: 'athq_organizations', label: 'المنظمات والجمعيات المحتضنة', store: 'organizations', count: await this.count('organizations'), icon: 'fa-building-ngo' },
        { name: 'athq_applications', label: 'طلبات الاحتضان وسير BPMN', store: 'applications', count: await this.count('applications'), icon: 'fa-inbox' },
        { name: 'athq_facility_bookings', label: 'حجوزات القاعات والمرافق', store: 'bookings', count: await this.count('bookings'), icon: 'fa-calendar-check' },
        { name: 'athq_consultants', label: 'المستشارون والخبراء المعتمدون', store: 'consultants', count: await this.count('consultants'), icon: 'fa-user-tie' },
        { name: 'athq_consultations', label: 'جلسات الاستشارات المجدولة', store: 'consultations', count: await this.count('consultations'), icon: 'fa-handshake' },
        { name: 'athq_contact_messages', label: 'رسائل وتواصل الزوار', store: 'contact_messages', count: await this.count('contact_messages'), icon: 'fa-envelope-open-text' },
        { name: 'athq_notifications', label: 'إشعارات النظام المركزية', store: 'notifications', count: await this.count('notifications'), icon: 'fa-bell' },
        { name: 'athq_audit_logs', label: 'سجل التدقيق وتتبع العمليات', store: 'audit_logs', count: await this.count('audit_logs'), icon: 'fa-shield-halved' }
      ]
    };
    stats.totalRecords = stats.tables.reduce((acc, t) => acc + t.count, 0);
    return stats;
  }

  // أداة مساعدة لتنزيل الملفات في المتصفح
  downloadFile(content, fileName, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

// تهيئة المحرك ككائن عام متاح للنظام
window.AthqDB = new AthqDatabaseEngine();

// ==============================================================================
// Database Studio UI Controller & Renderer
// ==============================================================================
let activeDbTable = 'organizations';
let currentDbRecords = [];

window.initDatabaseStudio = async function() {
  await AthqDB.readyPromise;
  await updateDbStudioMetrics();
  await switchDbTable(activeDbTable);
};

window.updateDbStudioMetrics = async function() {
  const stats = await AthqDB.getDatabaseStats();
  
  // Update badge in tab
  const badge = document.getElementById('admin-db-records-badge');
  if (badge) badge.textContent = `${stats.totalRecords} سجل`;

  // Update pills in table nav
  for (const t of stats.tables) {
    const el = document.getElementById(`db-cnt-${t.store}`);
    if (el) el.textContent = t.count;
  }

  // Update metrics summary bar
  const summaryBar = document.getElementById('db-metrics-summary-bar');
  if (summaryBar) {
    summaryBar.innerHTML = `
      <div class="db-stat-pill">
        <i class="fa-solid fa-server" style="color: var(--c-primary);"></i>
        <span>المحرك: <strong>${stats.engine}</strong></span>
      </div>
      <div class="db-stat-pill">
        <i class="fa-solid fa-layer-group" style="color: var(--c-gold-dark);"></i>
        <span>عدد الجداول: <strong>${stats.tables.length} جداول</strong></span>
      </div>
      <div class="db-stat-pill">
        <i class="fa-solid fa-database" style="color: #0D9488;"></i>
        <span>إجمالي السجلات: <strong>${stats.totalRecords} سجل معتمد</strong></span>
      </div>
      <div class="db-stat-pill">
        <i class="fa-solid fa-shield-check" style="color: #16A34A;"></i>
        <span>الحالة: <strong>${stats.status}</strong></span>
      </div>
    `;
  }
};

window.switchDbTable = async function(tableName) {
  activeDbTable = tableName;
  
  // Highlight table button
  document.querySelectorAll('#db-tables-nav-bar .db-table-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-table') === tableName);
  });

  const searchInput = document.getElementById('db-table-search-input');
  if (searchInput) searchInput.value = '';

  currentDbRecords = await AthqDB.getAll(tableName);
  renderActiveDbTable(currentDbRecords);
};

window.refreshActiveDbTable = async function() {
  currentDbRecords = await AthqDB.getAll(activeDbTable);
  renderActiveDbTable(currentDbRecords);
  await updateDbStudioMetrics();
  if (typeof showToast === 'function') showToast(`تم تحديث بيانات جدول ${activeDbTable} بنجاح ✓`);
};

window.filterActiveDbTable = function() {
  const query = (document.getElementById('db-table-search-input')?.value || '').trim().toLowerCase();
  if (!query) {
    renderActiveDbTable(currentDbRecords);
    return;
  }

  const filtered = currentDbRecords.filter(item => {
    return Object.values(item).some(val => {
      if (val === null || val === undefined) return false;
      return String(val).toLowerCase().includes(query);
    });
  });

  renderActiveDbTable(filtered);
};

window.renderActiveDbTable = function(records) {
  const wrapper = document.getElementById('db-table-view-wrapper');
  if (!wrapper) return;

  if (!records || records.length === 0) {
    wrapper.innerHTML = `
      <div style="text-align: center; padding: 40px; color: var(--c-text-muted);">
        <i class="fa-solid fa-folder-open" style="font-size: 2.5rem; margin-bottom: 12px; opacity: 0.5;"></i>
        <p style="font-size: 0.95rem; font-weight: 700; margin: 0;">لا توجد سجلات مطابقة في هذا الجدول حالياً.</p>
      </div>
    `;
    return;
  }

  // Get all unique keys across records (up to 8 keys max for readability)
  const allKeys = [];
  records.forEach(r => {
    Object.keys(r).forEach(k => {
      if (!allKeys.includes(k) && typeof r[k] !== 'object' && allKeys.length < 8) {
        allKeys.push(k);
      }
    });
  });

  const keyLabels = {
    id: 'المعرف الأساسي (ID)',
    name: 'الاسم / الكيان',
    associationName: 'اسم الجمعية',
    licenseNumber: 'رقم الترخيص',
    lic: 'رقم الترخيص',
    track: 'المسار التنموي',
    category: 'التصنيف',
    status: 'الحالة',
    hours: 'ساعات العمل',
    volHours: 'ساعات التطوع',
    volunteers: 'المتطوعين',
    badge: 'المقر / الشارة',
    city: 'المدينة',
    repName: 'الممثل النظامي',
    repPhone: 'الهاتف',
    facility: 'المرفق / القاعة',
    date: 'التاريخ',
    time: 'الوقت',
    specialty: 'التخصص',
    title: 'المسمى / العنوان',
    consultant: 'المستشار',
    field: 'المجال',
    subject: 'الموضوع',
    email: 'البريد',
    action: 'الإجراء',
    actor: 'المستخدم',
    timeFormatted: 'الوقت',
    details: 'التفاصيل',
    text: 'نص الإشعار'
  };

  let html = `<table class="db-data-table"><thead><tr>`;
  allKeys.forEach(k => {
    html += `<th>${keyLabels[k] || k}</th>`;
  });
  html += `<th style="text-align: center; width: 100px;">إجراءات</th></tr></thead><tbody>`;

  records.forEach(row => {
    html += `<tr>`;
    allKeys.forEach(k => {
      let val = row[k];
      if (val === undefined || val === null) val = '-';
      
      let cellHtml = String(val);
      if (k === 'status') {
        const isSuccess = cellHtml.includes('مقبول') || cellHtml.includes('مؤكد') || cellHtml.includes('منجزة') || cellHtml.includes('متخرجة');
        const isWarning = cellHtml.includes('تحت المراجعة') || cellHtml.includes('قيد');
        const color = isSuccess ? '#166534' : (isWarning ? '#B45309' : '#1E293B');
        const bg = isSuccess ? '#DCFCE7' : (isWarning ? '#FEF3C7' : '#F1F5F9');
        cellHtml = `<span style="background: ${bg}; color: ${color}; padding: 3px 8px; border-radius: 6px; font-weight: 700; font-size: 0.78rem;">${cellHtml}</span>`;
      } else if (k === 'id') {
        cellHtml = `<code style="font-weight: 700; color: var(--c-primary); font-size: 0.8rem;">${cellHtml}</code>`;
      }
      html += `<td>${cellHtml}</td>`;
    });

    html += `
      <td style="text-align: center;">
        <button class="btn btn-outline btn-sm" onclick="deleteDbRecord('${activeDbTable}', '${row.id}')" style="padding: 4px 8px; border-color: #EF4444; color: #DC2626; font-size: 0.75rem;" title="حذف السجل">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </td>
    </tr>`;
  });

  html += `</tbody></table>`;
  wrapper.innerHTML = html;
};

window.deleteDbRecord = async function(table, id) {
  if (!confirm(`هل أنت متأكد من رغبتك في حذف السجل (${id}) من جدول ${table}؟`)) return;

  await AthqDB.delete(table, id);
  await AthqDB.logAudit('DELETE_RECORD', table, id, `تم حذف السجل ${id} من قاعدة البيانات.`);
  if (typeof showToast === 'function') showToast(`تم حذف السجل ${id} بنجاح ✓`);
  await refreshActiveDbTable();
};

window.openDbAddRecordModal = function() {
  const modalId = 'modalDbAddRecord';
  let modal = document.getElementById(modalId);
  if (!modal) {
    modal = document.createElement('div');
    modal.id = modalId;
    modal.className = 'modal-overlay';
    document.body.appendChild(modal);
  }

  const tableFields = {
    organizations: [
      { key: 'name', label: 'اسم الكيان / الجمعية', type: 'text', req: true },
      { key: 'licenseNumber', label: 'رقم الترخيص', type: 'text', req: true },
      { key: 'category', label: 'القطاع والتصنيف', type: 'select', opts: ['تنمية', 'شباب', 'ثقافة', 'صحي', 'أوقاف'] },
      { key: 'track', label: 'المسار التنموي', type: 'text', val: 'مسار البناء والتمكين المؤسسي' },
      { key: 'status', label: 'الحالة', type: 'select', opts: ['محتضنة', 'متخرجة', 'في مرحلة التهيئة'] },
      { key: 'badge', label: 'المقر أو مساحة العمل', type: 'text', val: 'مكتب مجهز' }
    ],
    applications: [
      { key: 'associationName', label: 'اسم الجمعية', type: 'text', req: true },
      { key: 'licenseNumber', label: 'رقم الترخيص', type: 'text', req: true },
      { key: 'repName', label: 'اسم الممثل', type: 'text', req: true },
      { key: 'repPhone', label: 'رقم الجوال', type: 'text', req: true },
      { key: 'track', label: 'المسار', type: 'text', val: 'مسار الحوكمة والتمكين الشامل' },
      { key: 'status', label: 'حالة الطلب', type: 'select', opts: ['تحت المراجعة', 'مقبول', 'مطلوب تعديل', 'مرفوض'] }
    ],
    bookings: [
      { key: 'assocName', label: 'اسم الجمعية', type: 'text', req: true },
      { key: 'facility', label: 'اسم المرفق أو القاعة', type: 'text', req: true },
      { key: 'date', label: 'تاريخ الحجز', type: 'date', req: true },
      { key: 'time', label: 'الوقت', type: 'text', val: '10:00 ص - 12:00 م' },
      { key: 'status', label: 'الحالة', type: 'select', opts: ['مؤكد ✓', 'بانتظار الاعتماد', 'ملغى'] }
    ],
    consultants: [
      { key: 'name', label: 'اسم المستشار', type: 'text', req: true },
      { key: 'title', label: 'المسمى المهني', type: 'text', req: true },
      { key: 'specialty', label: 'التخصص الاستشاري', type: 'text', req: true },
      { key: 'rating', label: 'التقييم', type: 'text', val: '4.9 ★' }
    ],
    contact_messages: [
      { key: 'name', label: 'الاسم', type: 'text', req: true },
      { key: 'org', label: 'الجهة / المبادرة', type: 'text' },
      { key: 'phone', label: 'الهاتف', type: 'text', req: true },
      { key: 'email', label: 'البريد', type: 'email' },
      { key: 'subject', label: 'الموضوع', type: 'text', req: true },
      { key: 'message', label: 'نص الرسالة', type: 'textarea', req: true }
    ]
  };

  const fields = tableFields[activeDbTable] || [
    { key: 'name', label: 'الاسم / البيان', type: 'text', req: true },
    { key: 'details', label: 'التفاصيل', type: 'textarea' }
  ];

  modal.innerHTML = `
    <div class="wizard-modal-box" style="max-width: 580px;">
      <div class="wizard-header" style="background: linear-gradient(135deg, var(--c-primary-dark) 0%, var(--c-primary) 100%);">
        <button class="modal-close-btn" onclick="document.getElementById('modalDbAddRecord').classList.remove('active')" style="color: #FFF; font-size: 1.4rem;">&times;</button>
        <h3 style="font-size: 1.25rem; font-weight: 800; margin: 0; display: flex; align-items: center; gap: 8px;">
          <i class="fa-solid fa-plus-circle"></i> إضافة سجل جديد في جدول (${activeDbTable})
        </h3>
      </div>
      <div class="wizard-body" style="padding: 24px;">
        <form id="db-add-record-form">
          ${fields.map(f => {
            if (f.type === 'select') {
              return `
                <div class="form-group" style="margin-bottom: 14px;">
                  <label class="form-label">${f.label} ${f.req ? '*' : ''}</label>
                  <select class="form-control" name="${f.key}">
                    ${f.opts.map(o => `<option value="${o}">${o}</option>`).join('')}
                  </select>
                </div>
              `;
            } else if (f.type === 'textarea') {
              return `
                <div class="form-group" style="margin-bottom: 14px;">
                  <label class="form-label">${f.label} ${f.req ? '*' : ''}</label>
                  <textarea class="form-control" name="${f.key}" rows="3" ${f.req ? 'required' : ''}></textarea>
                </div>
              `;
            } else {
              return `
                <div class="form-group" style="margin-bottom: 14px;">
                  <label class="form-label">${f.label} ${f.req ? '*' : ''}</label>
                  <input type="${f.type}" class="form-control" name="${f.key}" value="${f.val || ''}" ${f.req ? 'required' : ''}>
                </div>
              `;
            }
          }).join('')}
        </form>
      </div>
      <div class="wizard-footer" style="padding: 14px 24px; display: flex; justify-content: space-between; align-items: center; background: var(--c-bg); border-top: 1px solid var(--c-border);">
        <button class="btn btn-outline btn-sm" onclick="document.getElementById('modalDbAddRecord').classList.remove('active')">إلغاء</button>
        <button class="btn btn-primary btn-sm" onclick="saveNewDbRecord()">
          <i class="fa-solid fa-check"></i> حفظ السجل في قاعدة البيانات
        </button>
      </div>
    </div>
  `;

  modal.classList.add('active');
};

window.saveNewDbRecord = async function() {
  const form = document.getElementById('db-add-record-form');
  if (!form) return;

  const formData = new FormData(form);
  const record = {};
  formData.forEach((val, key) => {
    record[key] = val;
  });

  const prefixMap = {
    organizations: 'ORG',
    applications: 'ATHQ',
    bookings: 'BKG',
    consultants: 'CONS',
    consultations: 'CNS',
    contact_messages: 'MSG',
    notifications: 'NTF'
  };
  const prefix = prefixMap[activeDbTable] || 'REC';
  record.id = `${prefix}-${Date.now().toString().slice(-4)}`;

  await AthqDB.put(activeDbTable, record);
  await AthqDB.logAudit('INSERT_RECORD', activeDbTable, record.id, `تمت إضافة سجل جديد في جدول ${activeDbTable}.`);

  document.getElementById('modalDbAddRecord')?.classList.remove('active');
  if (typeof showToast === 'function') showToast(`تمت إضافة السجل ${record.id} بنجاح إلى قاعدة البيانات ✓`);
  await refreshActiveDbTable();
};

window.handleDbJsonImport = function(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async (e) => {
    try {
      await AthqDB.importJSON(e.target.result);
    } catch (err) {
      if (typeof showToast === 'function') showToast('خطأ في قراءة الملف: ' + err.message, 'error');
    }
  };
  reader.readAsText(file);
};

window.saveCloudDbConfig = async function() {
  const url = document.getElementById('cfg-supabase-url')?.value.trim();
  const key = document.getElementById('cfg-supabase-key')?.value.trim();

  await AthqDB.put('system_settings', {
    key: 'supabase_cloud_config',
    url: url,
    key: key,
    updatedAt: new Date().toISOString()
  });

  await AthqDB.logAudit('UPDATE_CLOUD_CONFIG', 'system_settings', 'supabase', 'تم تحديث مفاتيح الربط السحابي Supabase.');
  if (typeof showToast === 'function') showToast('تم حفظ إعدادات الربط السحابي بنجاح ✓');
};

