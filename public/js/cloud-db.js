/**
 * حاضنة ومسرعة عذق - جمعية البر بالمدينة المنورة
 * محرك المزامنة وقاعدة البيانات السحابية الحية (Live Cloud Database & Supabase Engine)
 * يدعم الربط السحابي المباشر عبر REST API، والمزامنة الثنائية، والعمل في وضع عدم الاتصال (Offline-First)
 */

class AthqCloudSyncEngine {
  constructor() {
    this.storageKey = 'athq_cloud_config';
    this.config = this.loadConfig();
    this.syncStatus = 'idle'; // idle, syncing, online, offline, error
    this.listeners = [];
  }

  loadConfig() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not load cloud config:', e);
    }
    return {
      enabled: false,
      supabaseUrl: '',
      supabaseAnonKey: '',
      autoSyncInterval: 30000 // 30 seconds
    };
  }

  saveConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.config));
      this.notifyListeners('config_updated', this.config);
    } catch (e) {
      console.warn('Could not save cloud config:', e);
    }
  }

  isConfigured() {
    return Boolean(this.config.supabaseUrl && this.config.supabaseAnonKey && this.config.enabled);
  }

  onStatusChange(fn) {
    this.listeners.push(fn);
  }

  notifyListeners(event, data) {
    this.listeners.forEach(fn => {
      try { fn(event, data); } catch (e) { console.error(e); }
    });
  }

  // فحص واختبار الاتصال بالسحابة (Connection Test)
  async testConnection(url, anonKey) {
    const testUrl = (url || this.config.supabaseUrl || '').replace(/\/$/, '');
    const key = anonKey || this.config.supabaseAnonKey;

    if (!testUrl || !key) {
      return { success: false, message: 'يرجى إدخال رابط المشروع والمفتاح العام أولاً.' };
    }

    try {
      // Test REST endpoint ping
      const res = await fetch(`${testUrl}/rest/v1/`, {
        method: 'GET',
        headers: {
          'apikey': key,
          'Authorization': `Bearer ${key}`
        }
      });

      if (res.ok || res.status === 200 || res.status === 404) {
        return { success: true, message: 'تم الاتصال بالخادم السحابي بنجاح ✓' };
      } else {
        return { success: false, message: `استجابة الخادم: رمز الخطأ ${res.status}` };
      }
    } catch (err) {
      return { success: false, message: `تعذر الوصول للمزود السحابي: ${err.message}` };
    }
  }

  // مزامنة سحابية شاملة لكافة الجداول (Bidirectional Sync)
  async syncAll() {
    if (!this.isConfigured()) {
      return { success: false, message: 'المزامنة السحابية غير مفعلة، يعمل النظام حالياً على قاعدة البيانات المحلية الآمنة.' };
    }

    this.syncStatus = 'syncing';
    this.notifyListeners('sync_start');

    const tables = ['organizations', 'applications', 'bookings', 'consultants', 'consultations', 'contact_messages', 'notifications', 'users'];
    const results = {};

    try {
      for (const table of tables) {
        results[table] = await this.syncTable(table);
      }

      this.syncStatus = 'online';
      this.notifyListeners('sync_complete', results);
      if (typeof AthqDB !== 'undefined' && AthqDB.logAudit) {
        await AthqDB.logAudit('CLOUD_SYNC', 'all', 'system', 'تمت المزامنة السحابية الحية لكافة الجداول بنجاح.');
      }
      return { success: true, results };
    } catch (err) {
      this.syncStatus = 'error';
      this.notifyListeners('sync_error', err);
      return { success: false, error: err.message };
    }
  }

  // مزامنة جدول فردي
  async syncTable(tableName) {
    if (!this.isConfigured() || typeof AthqDB === 'undefined') return { synced: 0 };

    const cloudTable = `athq_${tableName}`;
    const url = `${this.config.supabaseUrl.replace(/\/$/, '')}/rest/v1/${cloudTable}`;
    const headers = {
      'apikey': this.config.supabaseAnonKey,
      'Authorization': `Bearer ${this.config.supabaseAnonKey}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation,resolution=merge-duplicates'
    };

    try {
      // 1. جلب البيانات المحلية
      const localRecords = await AthqDB.getAll(tableName);

      // 2. إرسال السجلات المحلية للسحابة (Upsert)
      if (localRecords && localRecords.length > 0) {
        await fetch(url, {
          method: 'POST',
          headers,
          body: JSON.stringify(localRecords)
        });
      }

      // 3. جلب التحديثات الجديدة من السحابة
      const getRes = await fetch(`${url}?select=*`, { method: 'GET', headers });
      if (getRes.ok) {
        const remoteData = await getRes.json();
        if (Array.isArray(remoteData)) {
          for (const item of remoteData) {
            await AthqDB.put(tableName, item);
          }
        }
      }

      return { success: true, count: localRecords.length };
    } catch (e) {
      console.warn(`Sync warning on ${tableName}:`, e);
      return { success: false, error: e.message };
    }
  }

  // إرسال سجل فوري للسحابة عند الإضافة أو التعديل
  async pushRecord(tableName, record) {
    if (!this.isConfigured()) return;

    const cloudTable = `athq_${tableName}`;
    const url = `${this.config.supabaseUrl.replace(/\/$/, '')}/rest/v1/${cloudTable}`;
    const headers = {
      'apikey': this.config.supabaseAnonKey,
      'Authorization': `Bearer ${this.config.supabaseAnonKey}`,
      'Content-Type': 'application/json',
      'Prefer': 'resolution=merge-duplicates'
    };

    try {
      await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(record)
      });
    } catch (e) {
      console.warn(`Push record warning on ${tableName}:`, e);
    }
  }
}

// تهيئة محرك السحابة
window.AthqCloud = new AthqCloudSyncEngine();
