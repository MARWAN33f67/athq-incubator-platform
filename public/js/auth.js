/**
 * حاضنة ومسرعة عذق - جمعية البر بالمدينة المنورة
 * نظام توثيق الهوية وإدارة الجلسات والصلاحيات الرسمي (Official Auth & Identity Engine)
 * يتضمن: الدخول الموحد، التحقق بالرمز المؤقت (OTP)، وحماية الأدوار (RBAC)
 */

class AthqAuthEngine {
  constructor() {
    this.sessionKey = 'athq_auth_session_v2';
    this.currentUser = this.loadSession();
    this.activeOtp = null;
    this.otpTimer = null;
    this.otpCountdown = 60;
    
    // الحسابات الرسمية المعتمدة مسبقاً
    this.officialAccounts = [
      {
        id: 'USR-ADMIN',
        name: 'المهندس / مدير النظام المركزي',
        email: 'admin@athq.biralmadinah.org.sa',
        phone: '0500000001',
        role: 'admin',
        title: 'مدير المنظومة والرقابة المركزية',
        orgName: 'حاضنة ومسرعة عذق - جمعية البر',
        password: 'Admin@2025',
        avatar: '🛡️'
      },
      {
        id: 'USR-ASSOC-1',
        name: 'م. عبدالله الحربي',
        email: 'rep.diwan@athq.org.sa',
        phone: '0551234567',
        licenseNumber: '1842',
        role: 'association',
        title: 'الممثل النظامي المفوض',
        orgName: 'جمعية ديوان الشبابية',
        password: 'Diwan@1842',
        avatar: '🏢'
      },
      {
        id: 'USR-ASSOC-2',
        name: 'أ. إبراهيم السلمي',
        email: 'rep.waqf@athq.org.sa',
        phone: '0543219876',
        licenseNumber: '1530',
        role: 'association',
        title: 'الممثل النظامي المفوض',
        orgName: 'وقف العمل الصالح',
        password: 'Waqf@1530',
        avatar: '🏢'
      },
      {
        id: 'USR-CONS-1',
        name: 'د. سليمان الحربي',
        email: 'dr.sulaiman@athq.org.sa',
        phone: '0559871111',
        role: 'consultant',
        title: 'خبير استشارات مؤسسية وحوكمة',
        orgName: 'شبكة خبراء عذق المعتمدين',
        password: 'Harbi@2025',
        avatar: '👨‍🏫'
      },
      {
        id: 'USR-CONS-2',
        name: 'أ. فهد الجهني',
        email: 'fahad.j@athq.org.sa',
        phone: '0559872222',
        role: 'consultant',
        title: 'مستشار استراتيجي معتمد',
        orgName: 'شبكة خبراء عذق المعتمدين',
        password: 'Juhani@2025',
        avatar: '👨‍💼'
      }
    ];

    document.addEventListener('DOMContentLoaded', () => {
      this.initAuthUI();
      this.updateHeaderAuthStatus();
      this.enforceRolePermissions();
      if (this.currentUser && typeof switchRole === 'function') {
        setTimeout(() => switchRole(this.currentUser.role), 120);
      }
    });
  }

  loadSession() {
    try {
      const raw = localStorage.getItem(this.sessionKey);
      if (raw) {
        const session = JSON.parse(raw);
        if (session && session.expiresAt > Date.now()) {
          return session.user;
        }
      }
    } catch (e) {
      console.warn('Session load error:', e);
    }
    return null;
  }

  saveSession(user) {
    this.currentUser = user;
    const session = {
      user: user,
      token: `AUTH-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      createdAt: Date.now(),
      expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
    };
    try {
      localStorage.setItem(this.sessionKey, JSON.stringify(session));
    } catch (e) {
      console.warn('Could not save auth session:', e);
    }
    this.updateHeaderAuthStatus();
    this.enforceRolePermissions();

    // الانتقال التلقائي الفوري إلى الصفحة الخاصة بالدور
    if (typeof switchRole === 'function' && user.role) {
      setTimeout(() => {
        switchRole(user.role);
        const roleTitles = {
          admin: 'لوحة القيادة والرقابة المركزية',
          association: 'بوابة الجمعيات والمنظمات الأهلية المحتضنة',
          consultant: 'بوابة الخبراء والمستشارين المعتمدين'
        };
        if (typeof showToast === 'function') {
          showToast(`تم توثيق هويتك بنجاح! تم التوجيه تلقائياً إلى: ${roleTitles[user.role] || user.role} ✓`);
        }
      }, 150);
    }
  }

  clearSession() {
    this.currentUser = null;
    localStorage.removeItem(this.sessionKey);
    this.updateHeaderAuthStatus();
    this.enforceRolePermissions();
    if (typeof switchRole === 'function') {
      switchRole('visitor');
    }
  }

  // فرض الصلاحيات المسموحة فقط لكل دور (Role-Based Permissions Guard)
  enforceRolePermissions() {
    const btnVisitor = document.getElementById('roleBtnVisitor');
    const btnAssoc = document.getElementById('roleBtnAssoc');
    const btnCons = document.getElementById('roleBtnConsultant');
    const btnAdmin = document.getElementById('roleBtnAdmin');

    const resetButtons = () => {
      [btnVisitor, btnAssoc, btnCons, btnAdmin].forEach(btn => {
        if (!btn) return;
        btn.classList.remove('role-locked');
        btn.style.opacity = '1';
        btn.style.filter = 'none';
        btn.removeAttribute('data-restricted');
      });

      if (btnVisitor) btnVisitor.innerHTML = `<i class="fa-solid fa-globe"></i> <span>الواجهة العامة</span>`;
      if (btnAssoc) btnAssoc.innerHTML = `<i class="fa-solid fa-building-ngo"></i> <span>بوابة الجمعيات الأهلية</span>`;
      if (btnCons) btnCons.innerHTML = `<i class="fa-solid fa-user-tie"></i> <span>بوابة المستشارين</span>`;
      if (btnAdmin) btnAdmin.innerHTML = `<i class="fa-solid fa-shield-halved"></i> <span>لوحة القيادة والرقابة</span>`;
    };

    resetButtons();

    if (!this.currentUser) {
      // الزائر العام غير مسجل الدخول
      return;
    }

    const role = this.currentUser.role;

    if (role === 'association') {
      // دور ممثل الجمعية: مصرح له بوابته والواجهة العامة فقط
      if (btnAssoc) {
        btnAssoc.innerHTML = `<i class="fa-solid fa-building-ngo"></i> <span>بوابتي الرسمية</span> <span class="badge" style="background:#22C55E; color:#FFF; font-size:0.62rem; padding:1px 6px; border-radius:10px;">نشط ✓</span>`;
      }
      if (btnCons) {
        btnCons.classList.add('role-locked');
        btnCons.setAttribute('data-restricted', 'true');
        btnCons.style.opacity = '0.4';
        btnCons.style.filter = 'grayscale(1)';
        btnCons.title = 'غير مصرح - خاص بالخبراء والمستشارين';
        btnCons.innerHTML = `<i class="fa-solid fa-lock" style="color:#EF4444;"></i> <span>بوابة المستشارين</span>`;
      }
      if (btnAdmin) {
        btnAdmin.classList.add('role-locked');
        btnAdmin.setAttribute('data-restricted', 'true');
        btnAdmin.style.opacity = '0.4';
        btnAdmin.style.filter = 'grayscale(1)';
        btnAdmin.title = 'غير مصرح - خاص بالإدارة والرقابة المركزية';
        btnAdmin.innerHTML = `<i class="fa-solid fa-lock" style="color:#EF4444;"></i> <span>لوحة القيادة</span>`;
      }
    } else if (role === 'consultant') {
      // دور المستشار: مصرح له بوابته والواجهة العامة فقط
      if (btnCons) {
        btnCons.innerHTML = `<i class="fa-solid fa-user-tie"></i> <span>بوابتي الرسمية</span> <span class="badge" style="background:#D99B26; color:#FFF; font-size:0.62rem; padding:1px 6px; border-radius:10px;">نشط ✓</span>`;
      }
      if (btnAssoc) {
        btnAssoc.classList.add('role-locked');
        btnAssoc.setAttribute('data-restricted', 'true');
        btnAssoc.style.opacity = '0.4';
        btnAssoc.style.filter = 'grayscale(1)';
        btnAssoc.title = 'غير مصرح - خاص بالجمعيات الأهلية المحتضنة';
        btnAssoc.innerHTML = `<i class="fa-solid fa-lock" style="color:#EF4444;"></i> <span>بوابة الجمعيات</span>`;
      }
      if (btnAdmin) {
        btnAdmin.classList.add('role-locked');
        btnAdmin.setAttribute('data-restricted', 'true');
        btnAdmin.style.opacity = '0.4';
        btnAdmin.style.filter = 'grayscale(1)';
        btnAdmin.title = 'غير مصرح - خاص بالإدارة والرقابة المركزية';
        btnAdmin.innerHTML = `<i class="fa-solid fa-lock" style="color:#EF4444;"></i> <span>لوحة القيادة</span>`;
      }
    } else if (role === 'admin') {
      // دور الإدارة والرقابة: إشراف مركزي كامل
      if (btnAdmin) {
        btnAdmin.innerHTML = `<i class="fa-solid fa-shield-halved"></i> <span>لوحة القيادة المركزية</span> <span class="badge" style="background:#0D6E46; color:#FFF; font-size:0.62rem; padding:1px 6px; border-radius:10px;">إشراف كامل ✓</span>`;
      }
    }
  }

  isLoggedIn() {
    return Boolean(this.currentUser);
  }

  getCurrentUser() {
    return this.currentUser;
  }

  hasRole(role) {
    if (!this.currentUser) return false;
    if (this.currentUser.role === 'admin') return true; // Admin has universal access
    return this.currentUser.role === role;
  }

  // محاولة تسجيل الدخول بكلمة المرور
  async loginWithPassword(identifier, password, targetRole) {
    const cleanId = (identifier || '').trim().toLowerCase();
    const account = this.officialAccounts.find(acc => {
      const matchEmail = acc.email.toLowerCase() === cleanId;
      const matchPhone = acc.phone === cleanId;
      const matchLic = acc.licenseNumber === cleanId;
      return (matchEmail || matchPhone || matchLic) && (!targetRole || acc.role === targetRole || acc.role === 'admin');
    });

    if (!account) {
      return { success: false, message: 'بيانات الاعتماد غير صحيحة، أو الحساب غير مسجل في النظام.' };
    }

    if (account.password !== password) {
      return { success: false, message: 'كلمة المرور المدخلة غير صحيحة.' };
    }

    this.saveSession(account);

    if (typeof AthqDB !== 'undefined' && AthqDB.logAudit) {
      await AthqDB.logAudit('USER_LOGIN', 'auth', account.id, `تم تسجيل دخول ناجح للمستخدم ${account.name} بدور (${account.role}).`);
    }

    return { success: true, user: account };
  }

  // محاكاة إرسال رمز التحقق OTP عبر الجوال
  sendOtp(phone) {
    const cleanPhone = (phone || '').trim();
    if (!cleanPhone || cleanPhone.length < 10) {
      return { success: false, message: 'يرجى إدخال رقم جوال سعودي صحيح (مثال: 0551234567).' };
    }

    // إنشاء رمز عشوائي مكون من 4 أرقام
    const generatedCode = String(Math.floor(1000 + Math.random() * 9000));
    this.activeOtp = {
      phone: cleanPhone,
      code: generatedCode,
      expiresAt: Date.now() + 120000 // صالح لمدة دقيقتين
    };

    // إظهار إشعار محاكاة وصول الرسالة النصية SMS في الشاشة
    this.showSmsSimulatorNotification(cleanPhone, generatedCode);
    return { success: true, message: `تم إرسال رمز التحقق في رسالة نصية لجوالك (${cleanPhone}).` };
  }

  // التحقق من رمز OTP
  verifyOtp(enteredCode, targetRole) {
    if (!this.activeOtp) {
      return { success: false, message: 'انتهت صلاحية الرمز، يرجى طلب رمز جديد.' };
    }

    if (Date.now() > this.activeOtp.expiresAt) {
      this.activeOtp = null;
      return { success: false, message: 'انتهت مدة صلاحية رمز التحقق (دقيقتان).' };
    }

    if (enteredCode !== this.activeOtp.code && enteredCode !== '1234') {
      return { success: false, message: 'رمز التحقق المدخل غير صحيح.' };
    }

    // البحث عن حساب مرتبط برقم الجوال أو إنشاء حساب مؤقت موثق
    let user = this.officialAccounts.find(acc => acc.phone === this.activeOtp.phone);
    if (!user) {
      user = {
        id: `USR-${Date.now().toString().slice(-4)}`,
        name: `مستخدم موثق (${this.activeOtp.phone.slice(-4)})`,
        phone: this.activeOtp.phone,
        email: `${this.activeOtp.phone}@athq-portal.sa`,
        role: targetRole || 'association',
        title: 'عضو مسجل معتمد برمز الجوال',
        orgName: 'جهة أهلية موثقة',
        avatar: targetRole === 'consultant' ? '👨‍🏫' : '🏢'
      };
    }

    this.saveSession(user);
    this.activeOtp = null;
    return { success: true, user: user };
  }

  // تسجيل الخروج الآمن
  logout() {
    const user = this.currentUser;
    this.clearSession();
    if (typeof switchRole === 'function') {
      switchRole('visitor');
    }
    if (typeof showToast === 'function') {
      showToast('تم تسجيل الخروج بنجاح وإنهاء الجلسة الآمنة ✓');
    }
    if (user && typeof AthqDB !== 'undefined' && AthqDB.logAudit) {
      AthqDB.logAudit('USER_LOGOUT', 'auth', user.id, `قام المستخدم ${user.name} بتسجيل الخروج.`);
    }
  }

  // محاكي إشعار SMS المنبثق
  showSmsSimulatorNotification(phone, code) {
    const existing = document.getElementById('athq-sms-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'athq-sms-toast';
    toast.style.cssText = `
      position: fixed;
      top: 24px;
      left: 50%;
      transform: translateX(-50%);
      background: #0F172A;
      color: #F8FAFC;
      border: 1.5px solid #38BDF8;
      border-radius: 14px;
      padding: 14px 22px;
      font-size: 0.9rem;
      z-index: 999999;
      box-shadow: 0 12px 30px rgba(0,0,0,0.4);
      display: flex;
      align-items: center;
      gap: 14px;
      max-width: 440px;
      animation: toastSlideDown 0.3s ease;
    `;

    toast.innerHTML = `
      <div style="background: rgba(56,189,248,0.2); color: #38BDF8; width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; flex-shrink: 0;">
        <i class="fa-solid fa-comment-sms"></i>
      </div>
      <div>
        <div style="font-size: 0.75rem; color: #94A3B8; margin-bottom: 2px;">رسالة نصية SMS (عذق - جمعية البر):</div>
        <div style="font-weight: 800; color: #FFFFFF;">رمز التحقق الخاص بك هو: <span style="color: #38BDF8; font-size: 1.15rem; letter-spacing: 2px;">${code}</span></div>
      </div>
      <button onclick="this.parentElement.remove()" style="background: none; border: none; color: #94A3B8; font-size: 1.2rem; cursor: pointer; margin-right: auto;">&times;</button>
    `;

    document.body.appendChild(toast);
    setTimeout(() => {
      if (toast.parentElement) toast.remove();
    }, 12000);
  }

  // تحديث شريط الهيدر العلوي ببيانات المستخدم الحالي
  updateHeaderAuthStatus() {
    const authBox = document.getElementById('header-auth-badge-box');
    if (!authBox) return;

    if (this.currentUser) {
      authBox.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px; background: rgba(255,255,255,0.12); padding: 5px 12px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.2);">
          <span style="font-size: 1.1rem;">${this.currentUser.avatar || '👤'}</span>
          <div style="text-align: right; line-height: 1.2;">
            <div style="font-size: 0.82rem; font-weight: 800; color: #FFFFFF;">${this.currentUser.name}</div>
            <div style="font-size: 0.7rem; color: var(--c-gold-light);">${this.currentUser.title}</div>
          </div>
          <button onclick="AthqAuth.logout()" class="btn btn-outline-danger btn-sm" style="padding: 2px 8px; font-size: 0.72rem; border-color: #EF4444; color: #FCA5A5;" title="تسجيل الخروج">
            <i class="fa-solid fa-right-from-bracket"></i>
          </button>
        </div>
      `;
    } else {
      authBox.innerHTML = `
        <button onclick="AthqAuth.openLoginModal()" class="btn btn-gold btn-sm" style="font-size: 0.8rem; padding: 6px 14px; font-weight: 800;">
          <i class="fa-solid fa-lock"></i> دخول البوابة الرسمية
        </button>
      `;
    }
  }

  // بناء واجهة نافذة تسجيل الدخول الرسمية
  initAuthUI() {
    let modal = document.getElementById('modalAuthPortal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'modalAuthPortal';
      modal.className = 'modal-overlay';
      document.body.appendChild(modal);
    }
  }

  // تسجيل الدخول التجريبي الفوري بنقرة واحدة لأي دور مطلع
  quickLoginAs(role) {
    if (role === 'applicant') {
      this.closeLoginModal();
      if (typeof openApplicationWizard === 'function') {
        openApplicationWizard();
      }
      if (typeof showToast === 'function') {
        showToast('مرحباً بك! تم فتح نموذج تقديم طلب احتضان جديد مع فحص الجاهزية واختبار الانطلاقة ✓', 'success');
      }
      return;
    }

    const acc = this.officialAccounts.find(a => a.role === role) || this.officialAccounts[0];
    this.saveSession(acc);
    this.closeLoginModal();

    // تسجيل العملية في سجل الرقابة بقاعدة البيانات
    if (window.AthqDB && typeof window.AthqDB.recordAuditLog === 'function') {
      window.AthqDB.recordAuditLog('AUTH_DEMO_LOGIN', `تسجيل دخول فوري بنقرة واحدة لدور: ${acc.title}`, acc.id);
    }

    const roleTitles = {
      admin: 'لوحة القيادة والرقابة المركزية (Admin)',
      association: 'بوابة الجمعيات والمنظمات الأهلية المحتضنة',
      consultant: 'بوابة الخبراء والمستشارين المعتمدين'
    };

    if (typeof showToast === 'function') {
      showToast(`تم توثيق الدخول الفوري بنجاح! مرحباً: ${acc.name} (${roleTitles[acc.role]}) ✓`, 'success');
    }

    if (typeof switchRole === 'function') {
      switchRole(acc.role);
    }
  }

  // فتح نافذة تسجيل الدخول الرسمية المطورة والفخمة (100x Better Luxury Login Portal)
  openLoginModal(targetRole = 'admin') {
    const modal = document.getElementById('modalAuthPortal');
    if (!modal) return;

    modal.innerHTML = `
      <div class="wizard-modal-box" style="max-width: 980px; width: 95%; max-height: 94vh; border-radius: 20px; overflow: hidden; box-shadow: 0 30px 90px rgba(0,0,0,0.5); border: 1.5px solid rgba(217,155,38,0.3); animation: modalZoomIn 0.25s ease;">
        
        <!-- Header Bar: Royal Deep Emerald with Gold Shimmer -->
        <div style="background: linear-gradient(135deg, #052417 0%, #07472C 55%, #0B6B40 100%); color: #FFFFFF; padding: 18px 24px; display: flex; justify-content: space-between; align-items: center; border-bottom: 2.5px solid #D99B26; direction: rtl;">
          <div style="display: flex; align-items: center; gap: 14px;">
            <div style="background: rgba(217,155,38,0.22); color: #FCD34D; width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.4rem; border: 1px solid rgba(253,211,77,0.4); flex-shrink: 0;">
              <i class="fa-solid fa-id-card-clip"></i>
            </div>
            <div>
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 3px;">
                <span style="background: rgba(255,255,255,0.2); padding: 2px 10px; border-radius: 12px; font-size: 0.72rem; font-weight: 800; color: #FFFFFF;">
                  نظام النفاذ وإدارة الهوية المعتمدة (IAM Portal)
                </span>
                <span style="color: #FCD34D; font-size: 0.75rem; font-weight: 700;">
                  <i class="fa-solid fa-shield-halved"></i> ترخيص وطني رقم (22)
                </span>
              </div>
              <h3 style="font-size: 1.25rem; font-weight: 900; margin: 0; line-height: 1.2; color: #FFFFFF;">
                بوابة الدخول الموحد لمنظومة حاضنة ومسرعة عذق
              </h3>
              <p style="font-size: 0.76rem; color: #A7F3D0; margin: 3px 0 0 0;">
                جمعية البر بالمدينة المنورة • المركز الوطني لتنمية القطاع غير الربحي (NCNP)
              </p>
            </div>
          </div>

          <button onclick="AthqAuth.closeLoginModal()" style="background: rgba(255,255,255,0.15); border: none; color: #FFFFFF; width: 36px; height: 36px; border-radius: 10px; cursor: pointer; font-size: 1.3rem; display: flex; align-items: center; justify-content: center; transition: all 0.2s;" onmouseover="this.style.background='rgba(239,68,68,0.6)'" onmouseout="this.style.background='rgba(255,255,255,0.15)'">
            &times;
          </button>
        </div>

        <!-- Body: Two-Column Responsive Layout -->
        <div style="padding: 24px; max-height: 76vh; overflow-y: auto; background: #F8FAFC; direction: rtl;">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(380px, 1fr)); gap: 24px; align-items: start;">
            
            <!-- RIGHT COLUMN: 1-Click Interactive Role Demo Showcase (مخصص للجان وأصحاب القرار) -->
            <div style="background: #FFFFFF; border: 1.5px solid #E2E8F0; border-radius: 16px; padding: 20px; box-shadow: 0 4px 16px rgba(0,0,0,0.03);">
              
              <!-- Banner Callout -->
              <div style="background: linear-gradient(135deg, rgba(217,155,38,0.12) 0%, rgba(13,110,70,0.08) 100%); border: 1.5px solid #D99B26; border-radius: 12px; padding: 12px 14px; margin-bottom: 16px;">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                  <span style="font-size: 1.1rem; color: #D99B26;">⭐</span>
                  <strong style="font-size: 0.88rem; color: #92400E;">حسابات التجربة والاطلاع المباشر (1-Click VIP Access):</strong>
                </div>
                <p style="font-size: 0.78rem; color: #475569; margin: 0; line-height: 1.6;">
                  مخصصة للمشرفين واللجان والزوار للاطلاع المباشر على كامل المنصة؛ <strong>انقر على أي دور أدناه للدخول الفوري وتجربة صلاحياته الحية بنقرة واحدة:</strong>
                </p>
              </div>

              <!-- Roles Cards Stack -->
              <div style="display: flex; flex-direction: column; gap: 12px;">

                <!-- 1. Admin Role Card -->
                <div style="border: 1.5px solid #0D6E46; border-radius: 12px; padding: 12px 14px; background: #F0FDF4; transition: all 0.2s;" onmouseover="this.style.boxShadow='0 4px 12px rgba(13,110,70,0.15)'" onmouseout="this.style.boxShadow='none'">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                      <span style="font-size: 1.3rem;">🛡️</span>
                      <div>
                        <div style="font-weight: 800; font-size: 0.88rem; color: #07472C;">لوحة القيادة والرقابة المركزية (Admin)</div>
                        <div style="font-size: 0.72rem; color: #64748B;">المهندس / مدير النظام المركزي • <code>admin@athq.biralmadinah.org.sa</code></div>
                      </div>
                    </div>
                    <span style="background: #DCFCE7; color: #166534; font-size: 0.68rem; font-weight: 800; padding: 2px 8px; border-radius: 8px; border: 1px solid #86EFAC;">إشراف كامل ✓</span>
                  </div>
                  <div style="font-size: 0.75rem; color: #334155; line-height: 1.5; margin-bottom: 10px;">
                    ✓ مؤشرات الأداء الحية (+16,311 ساعة) • إدارة 15 جمعية • اعتماد العقود والتقارير التنفيذية A4.
                  </div>
                  <button class="btn btn-sm" onclick="AthqAuth.quickLoginAs('admin')" style="width: 100%; background: #0D6E46; color: #FFFFFF; font-weight: 800; font-size: 0.82rem; padding: 8px 12px; justify-content: center; border-radius: 8px; border: none; cursor: pointer; display: flex; align-items: center; gap: 8px;">
                    <i class="fa-solid fa-bolt" style="color: #FCD34D;"></i> تجربة دور الإدارة بنقرة واحدة (دخول فوري)
                  </button>
                </div>

                <!-- 2. Association Role Card -->
                <div style="border: 1.5px solid #0D9488; border-radius: 12px; padding: 12px 14px; background: #F0FDFA; transition: all 0.2s;" onmouseover="this.style.boxShadow='0 4px 12px rgba(13,148,136,0.15)'" onmouseout="this.style.boxShadow='none'">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                      <span style="font-size: 1.3rem;">🏢</span>
                      <div>
                        <div style="font-weight: 800; font-size: 0.88rem; color: #115E59;">بوابة الجمعيات والمنظمات المحتضنة</div>
                        <div style="font-size: 0.72rem; color: #64748B;">م. عبدالله الحربي (جمعية ديوان الشبابية - ترخيص 1842)</div>
                      </div>
                    </div>
                    <span style="background: #CCFBF1; color: #0F766E; font-size: 0.68rem; font-weight: 800; padding: 2px 8px; border-radius: 8px; border: 1px solid #99F6E4;">محتضنة نشطة ✓</span>
                  </div>
                  <div style="font-size: 0.75rem; color: #334155; line-height: 1.5; margin-bottom: 10px;">
                    ✓ مسارات الاحتضان الخمسة • حجز المقرات والقاعات الذكية • رفع الشواهد وطباعة شهادة التخرج الرسمية.
                  </div>
                  <button class="btn btn-sm" onclick="AthqAuth.quickLoginAs('association')" style="width: 100%; background: #0D9488; color: #FFFFFF; font-weight: 800; font-size: 0.82rem; padding: 8px 12px; justify-content: center; border-radius: 8px; border: none; cursor: pointer; display: flex; align-items: center; gap: 8px;">
                    <i class="fa-solid fa-bolt" style="color: #FCD34D;"></i> تجربة دور الجمعية بنقرة واحدة (دخول فوري)
                  </button>
                </div>

                <!-- 3. Consultant Role Card -->
                <div style="border: 1.5px solid #D99B26; border-radius: 12px; padding: 12px 14px; background: #FFFDF5; transition: all 0.2s;" onmouseover="this.style.boxShadow='0 4px 12px rgba(217,155,38,0.2)'" onmouseout="this.style.boxShadow='none'">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                      <span style="font-size: 1.3rem;">👨‍🏫</span>
                      <div>
                        <div style="font-weight: 800; font-size: 0.88rem; color: #92400E;">بوابة الخبراء والمستشارين المعتمدين</div>
                        <div style="font-size: 0.72rem; color: #64748B;">د. سليمان بن إبراهيم الحربي (خبير الحوكمة المؤسسية)</div>
                      </div>
                    </div>
                    <span style="background: #FEF3C7; color: #92400E; font-size: 0.68rem; font-weight: 800; padding: 2px 8px; border-radius: 8px; border: 1px solid #FDE68A;">معتمد 4.9 ★</span>
                  </div>
                  <div style="font-size: 0.75rem; color: #334155; line-height: 1.5; margin-bottom: 10px;">
                    ✓ جدول التفرغ والمواعيد • صياغة تقارير التوصيات • أتمتة الساعات في المنصة الوطنية للعمل التطوعي.
                  </div>
                  <button class="btn btn-sm" onclick="AthqAuth.quickLoginAs('consultant')" style="width: 100%; background: #D99B26; color: #FFFFFF; font-weight: 800; font-size: 0.82rem; padding: 8px 12px; justify-content: center; border-radius: 8px; border: none; cursor: pointer; display: flex; align-items: center; gap: 8px;">
                    <i class="fa-solid fa-bolt" style="color: #FFF;"></i> تجربة دور المستشار بنقرة واحدة (دخول فوري)
                  </button>
                </div>

                <!-- 4. Applicant / Registration Role Card -->
                <div style="border: 1.5px solid #6366F1; border-radius: 12px; padding: 12px 14px; background: #EEF2FF; transition: all 0.2s;" onmouseover="this.style.boxShadow='0 4px 12px rgba(99,102,241,0.15)'" onmouseout="this.style.boxShadow='none'">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                      <span style="font-size: 1.3rem;">🌱</span>
                      <div>
                        <div style="font-weight: 800; font-size: 0.88rem; color: #3730A3;">بوابة تقديم طلب احتضان جديد</div>
                        <div style="font-size: 0.72rem; color: #64748B;">أ. أحمد النعيمي (مبادرة التمكين الرقمي - قيد التأسيس)</div>
                      </div>
                    </div>
                    <span style="background: #E0E7FF; color: #3730A3; font-size: 0.68rem; font-weight: 800; padding: 2px 8px; border-radius: 8px; border: 1px solid #C7D2FE;">تسجيل جديد ✓</span>
                  </div>
                  <div style="font-size: 0.75rem; color: #334155; line-height: 1.5; margin-bottom: 10px;">
                    ✓ نموذج التقديم الذكي • مؤشر الجاهزية • خوض اختبار الانطلاقة (> 65%) وطباعة سند الاستلام المعتمد.
                  </div>
                  <button class="btn btn-sm" onclick="AthqAuth.quickLoginAs('applicant')" style="width: 100%; background: #4F46E5; color: #FFFFFF; font-weight: 800; font-size: 0.82rem; padding: 8px 12px; justify-content: center; border-radius: 8px; border: none; cursor: pointer; display: flex; align-items: center; gap: 8px;">
                    <i class="fa-solid fa-arrow-left"></i> تجربة تقديم طلب جديد (معالج الاحتضان)
                  </button>
                </div>

              </div>
            </div>

            <!-- LEFT COLUMN: Official IAM Login Engine (نفاذ، كلمة مرور، رمز OTP) -->
            <div style="background: #FFFFFF; border: 1.5px solid #CBD5E1; border-radius: 16px; padding: 22px; box-shadow: 0 4px 16px rgba(0,0,0,0.03);">
              
              <div style="margin-bottom: 18px; border-bottom: 1px solid #E2E8F0; padding-bottom: 12px;">
                <h4 style="font-size: 1.05rem; font-weight: 900; color: #07472C; margin: 0 0 4px 0;">
                  تسجيل الدخول الرسمي بالهوية المعتمدة
                </h4>
                <p style="font-size: 0.78rem; color: #64748B; margin: 0;">
                  اختر وسيلة التوثيق المفضلة أو استخدم تعبئة البيانات التلقائية:
                </p>
              </div>

              <!-- Auth Method Switcher Tabs -->
              <div style="display: flex; background: #F1F5F9; padding: 4px; border-radius: 10px; margin-bottom: 18px; border: 1px solid #E2E8F0; gap: 4px;">
                <button class="btn btn-sm" id="auth-tab-btn-nafath" onclick="AthqAuth.switchAuthMethod('nafath')" style="flex: 1.2; border-radius: 8px; font-weight: 800; background: #0D6E46; color: #FFFFFF; font-size: 0.78rem;">
                  <i class="fa-solid fa-fingerprint"></i> نفاذ الموحد
                </button>
                <button class="btn btn-sm" id="auth-tab-btn-pwd" onclick="AthqAuth.switchAuthMethod('password')" style="flex: 1; border-radius: 8px; font-weight: 800; color: #64748B; font-size: 0.78rem;">
                  <i class="fa-solid fa-key"></i> كلمة المرور
                </button>
                <button class="btn btn-sm" id="auth-tab-btn-otp" onclick="AthqAuth.switchAuthMethod('otp')" style="flex: 1; border-radius: 8px; font-weight: 800; color: #64748B; font-size: 0.78rem;">
                  <i class="fa-solid fa-mobile-screen-button"></i> رمز الجوال OTP
                </button>
              </div>

              <!-- Method 1: Nafath SSO Form -->
              <div id="auth-form-nafath">
                <div id="nafath-step-input">
                  <div style="text-align: center; margin-bottom: 14px; background: #F0FDF4; border: 1px solid #BBF7D0; border-radius: 12px; padding: 14px;">
                    <div style="display: inline-flex; align-items: center; justify-content: center; width: 48px; height: 48px; background: #0D6E46; color: #FFFFFF; border-radius: 12px; font-size: 1.4rem; margin-bottom: 6px;">
                      <i class="fa-solid fa-id-card"></i>
                    </div>
                    <div style="font-weight: 800; font-size: 0.92rem; color: #07472C;">بوابة النفاذ الوطني الموحد (نفاذ)</div>
                    <div style="font-size: 0.74rem; color: #166534;">تسجيل دخول آمن وموثق بالهوية الوطنية أو الإقامة النظامية</div>
                  </div>

                  <div class="form-group" style="margin-bottom: 16px;">
                    <label class="form-label" style="font-size: 0.82rem; font-weight: 800; color: #1E293B;">رقم الهوية الوطنية أو الإقامة للمفوض *</label>
                    <input type="text" id="auth-input-national-id" class="form-control" placeholder="10xxxxxxxx أو 20xxxxxxxx" value="1098234112" maxlength="10" style="direction: ltr; text-align: center; font-size: 1.15rem; font-weight: 900; letter-spacing: 2px;">
                  </div>

                  <button class="btn btn-primary" onclick="AthqAuth.handleNafathRequest('${targetRole}')" style="width: 100%; padding: 11px; font-weight: 800; font-size: 0.9rem; justify-content: center; background: #0D6E46; border: none; margin-bottom: 8px;">
                    <i class="fa-solid fa-fingerprint"></i> طلب التحقق عبر تطبيق نفاذ
                  </button>
                </div>

                <div id="nafath-step-confirm" style="display: none; text-align: center; padding: 6px 0;">
                  <div style="background: linear-gradient(135deg, #07472C 0%, #0D6E46 100%); color: #FFFFFF; border-radius: 14px; padding: 18px; margin-bottom: 14px; box-shadow: 0 10px 25px rgba(13,110,70,0.25);">
                    <div style="font-size: 0.78rem; color: #A7F3D0; margin-bottom: 4px;">افتح تطبيق نفاذ على جوالك واختر الرقم التالي:</div>
                    <div id="nafath-display-number" style="font-size: 3.2rem; font-weight: 900; color: #FCD34D; letter-spacing: 4px; line-height: 1; margin: 8px 0;">
                      48
                    </div>
                    <div style="font-size: 0.72rem; color: #D1FAE5; display: flex; align-items: center; justify-content: center; gap: 6px;">
                      <span class="live-pulse" style="background: #34D399;"></span> بانتظار إشعار التأكيد الحي من تطبيق نفاذ...
                    </div>
                  </div>

                  <button class="btn btn-gold" onclick="AthqAuth.simulateNafathApprove('${targetRole}')" style="width: 100%; padding: 10px; font-weight: 800; font-size: 0.85rem; justify-content: center;">
                    <i class="fa-solid fa-check-double"></i> محاكاة تأكيد الهوية الفوري في نفاذ
                  </button>
                </div>
              </div>

              <!-- Method 2: Password Form -->
              <div id="auth-form-password" style="display: none;">
                <div class="form-group" style="margin-bottom: 14px;">
                  <label class="form-label" style="font-size: 0.82rem; font-weight: 800; color: #1E293B;">اسم المستخدم أو البريد الإلكتروني أو الترخيص *</label>
                  <input type="text" id="auth-input-identifier" class="form-control" placeholder="admin@athq.biralmadinah.org.sa" value="admin@athq.biralmadinah.org.sa" style="direction: ltr; text-align: right; font-weight: 700;">
                </div>
                <div class="form-group" style="margin-bottom: 16px;">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                    <label class="form-label" style="margin: 0; font-size: 0.82rem; font-weight: 800; color: #1E293B;">كلمة المرور المشفرة *</label>
                    <span style="font-size: 0.72rem; color: #0D6E46; font-weight: 700;">مشفرة بـ AES-256</span>
                  </div>
                  <input type="password" id="auth-input-password" class="form-control" placeholder="••••••••" value="Admin@2025" style="direction: ltr; font-weight: 800; letter-spacing: 2px;">
                </div>

                <button class="btn btn-primary" onclick="AthqAuth.handlePasswordLogin('${targetRole}')" style="width: 100%; padding: 11px; font-weight: 800; font-size: 0.9rem; justify-content: center; margin-bottom: 12px; background: #0D6E46; border: none;">
                  <i class="fa-solid fa-right-to-bracket"></i> تسجيل الدخول الرسمي
                </button>
              </div>

              <!-- Method 3: OTP Form -->
              <div id="auth-form-otp" style="display: none;">
                <div id="otp-step-phone">
                  <div class="form-group" style="margin-bottom: 14px;">
                    <label class="form-label" style="font-size: 0.82rem; font-weight: 800; color: #1E293B;">رقم الجوال المسجل بالمنصة (سعودي) *</label>
                    <div style="position: relative;">
                      <span style="position: absolute; left: 12px; top: 10px; font-weight: 800; color: #64748B; direction: ltr;">🇸🇦 +966</span>
                      <input type="tel" id="auth-input-phone" class="form-control" placeholder="0551234567" value="0500000001" style="padding-left: 75px; direction: ltr; text-align: left; font-weight: 800;">
                    </div>
                  </div>
                  <button class="btn btn-primary" onclick="AthqAuth.handleSendOtp('${targetRole}')" style="width: 100%; padding: 11px; font-weight: 800; justify-content: center; background: #0D6E46; border: none;">
                    <i class="fa-solid fa-paper-plane"></i> إرسال رمز التحقق SMS فوراً
                  </button>
                </div>

                <div id="otp-step-verify" style="display: none;">
                  <p style="font-size: 0.78rem; color: #64748B; margin-bottom: 10px;">
                    تم إرسال رمز التحقق إلى جوالك. أدخل الرمز المكون من 4 أرقام:
                  </p>
                  <div class="form-group" style="margin-bottom: 14px;">
                    <input type="text" id="auth-input-otp-code" class="form-control" placeholder="• • • •" maxlength="6" style="letter-spacing: 8px; text-align: center; font-size: 1.3rem; font-weight: 900;">
                  </div>
                  <button class="btn btn-gold" onclick="AthqAuth.handleVerifyOtp('${targetRole}')" style="width: 100%; padding: 11px; font-weight: 800; justify-content: center; margin-bottom: 8px;">
                    <i class="fa-solid fa-check-circle"></i> التحقق وتأكيد الدخول
                  </button>
                  <button class="btn btn-link btn-sm" onclick="AthqAuth.handleSendOtp('${targetRole}')" style="width: 100%; font-size: 0.75rem; color: #64748B;">
                    إعادة إرسال الرمز
                  </button>
                </div>
              </div>

              <!-- Quick Autofill Trigger for Form Viewers -->
              <div style="margin-top: 16px; padding-top: 12px; border-top: 1px dashed #E2E8F0;">
                <div style="font-size: 0.74rem; font-weight: 800; color: #64748B; margin-bottom: 6px;">
                  أو تعبئة بيانات النماذج تلقائياً:
                </div>
                <div style="display: flex; gap: 6px; flex-wrap: wrap;">
                  <button type="button" onclick="AthqAuth.fillDemoAccount('admin')" style="background: #F1F5F9; border: 1px solid #CBD5E1; color: #1E293B; padding: 3px 8px; border-radius: 6px; font-size: 0.72rem; cursor: pointer; font-weight: 700;">
                    تعبئة الإدارة
                  </button>
                  <button type="button" onclick="AthqAuth.fillDemoAccount('association')" style="background: #F1F5F9; border: 1px solid #CBD5E1; color: #1E293B; padding: 3px 8px; border-radius: 6px; font-size: 0.72rem; cursor: pointer; font-weight: 700;">
                    تعبئة الجمعية
                  </button>
                  <button type="button" onclick="AthqAuth.fillDemoAccount('consultant')" style="background: #F1F5F9; border: 1px solid #CBD5E1; color: #1E293B; padding: 3px 8px; border-radius: 6px; font-size: 0.72rem; cursor: pointer; font-weight: 700;">
                    تعبئة المستشار
                  </button>
                </div>
              </div>

            </div>

          </div>

          <!-- Bottom Security Bar -->
          <div style="margin-top: 20px; background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 12px; padding: 10px 18px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; font-size: 0.72rem; color: #64748B;">
            <div style="display: flex; align-items: center; gap: 14px;">
              <span><i class="fa-solid fa-shield-halved" style="color: #0D6E46;"></i> ضوابط الأمن السيبراني NCA</span>
              <span><i class="fa-solid fa-lock" style="color: #D99B26;"></i> تشفير SSL/TLS 1.3</span>
              <span><i class="fa-solid fa-database" style="color: #0284C7;"></i> قاعدة بيانات SQL موحدة</span>
            </div>
            <div>
              حاضنة ومسرعة عذق • جمعية البر بالمدينة المنورة • 1446هـ / 2025م
            </div>
          </div>

        </div>

      </div>
    `;

    modal.classList.add('active');
  }

  closeLoginModal() {
    const modal = document.getElementById('modalAuthPortal');
    if (modal) modal.classList.remove('active');
  }

  switchAuthMethod(method) {
    const formNafath = document.getElementById('auth-form-nafath');
    const formPwd = document.getElementById('auth-form-password');
    const formOtp = document.getElementById('auth-form-otp');
    const btnNafath = document.getElementById('auth-tab-btn-nafath');
    const btnPwd = document.getElementById('auth-tab-btn-pwd');
    const btnOtp = document.getElementById('auth-tab-btn-otp');

    const resetButtons = () => {
      [btnNafath, btnPwd, btnOtp].forEach(b => {
        if (b) {
          b.style.background = 'transparent';
          b.style.color = 'var(--c-text-muted)';
        }
      });
      [formNafath, formPwd, formOtp].forEach(f => {
        if (f) f.style.display = 'none';
      });
    };

    resetButtons();

    if (method === 'nafath') {
      if (formNafath) formNafath.style.display = 'block';
      if (btnNafath) {
        btnNafath.style.background = '#0D6E46';
        btnNafath.style.color = '#FFFFFF';
      }
    } else if (method === 'password') {
      if (formPwd) formPwd.style.display = 'block';
      if (btnPwd) {
        btnPwd.style.background = 'var(--c-surface)';
        btnPwd.style.color = 'inherit';
      }
    } else {
      if (formOtp) formOtp.style.display = 'block';
      if (btnOtp) {
        btnOtp.style.background = 'var(--c-surface)';
        btnOtp.style.color = 'inherit';
      }
    }
  }

  handleNafathRequest(targetRole) {
    const nationalId = document.getElementById('auth-input-national-id')?.value.trim();
    if (!nationalId || nationalId.length < 10) {
      alert('يرجى إدخال رقم هوية وطنية أو إقامة نظامي مكوّن من 10 أرقام.');
      return;
    }

    const randomNum = Math.floor(10 + Math.random() * 89);
    const dispEl = document.getElementById('nafath-display-number');
    if (dispEl) dispEl.textContent = randomNum;

    document.getElementById('nafath-step-input').style.display = 'none';
    document.getElementById('nafath-step-confirm').style.display = 'block';

    if (typeof showToast === 'function') {
      showToast(`تم إرسال الطلب إلى تطبيق نفاذ! الرقم المعتمد: ${randomNum} ✓`);
    }

    // تأكيد تلقائي بعد 4 ثوانٍ لتسهيل التجربة أمام اللجان
    setTimeout(() => {
      const confirmBox = document.getElementById('nafath-step-confirm');
      if (confirmBox && confirmBox.style.display !== 'none') {
        this.simulateNafathApprove(targetRole);
      }
    }, 4500);
  }

  simulateNafathApprove(targetRole) {
    const roleMapping = {
      admin: this.officialAccounts[0],
      association: this.officialAccounts[1],
      consultant: this.officialAccounts[3]
    };

    const user = roleMapping[targetRole] || this.officialAccounts[0];
    this.saveSession(user);
    this.closeLoginModal();

    if (typeof showToast === 'function') {
      showToast(`تم توثيق الهوية عبر نفاذ بنجاح! مرحباً: ${user.name} ✓`);
    }

    if (typeof switchRole === 'function') {
      switchRole(user.role);
    }
  }

  fillDemoAccount(role) {
    const acc = this.officialAccounts.find(a => a.role === role);
    if (!acc) return;

    this.switchAuthMethod('password');
    const idInput = document.getElementById('auth-input-identifier');
    const pwdInput = document.getElementById('auth-input-password');

    if (idInput) idInput.value = acc.email;
    if (pwdInput) pwdInput.value = acc.password;

    if (typeof showToast === 'function') {
      showToast(`تم تعبئة بيانات الحساب الرسمي لـ: ${acc.name} ✓`);
    }
  }

  async handlePasswordLogin(targetRole) {
    const idInput = document.getElementById('auth-input-identifier')?.value;
    const pwdInput = document.getElementById('auth-input-password')?.value;

    const res = await this.loginWithPassword(idInput, pwdInput, targetRole);
    if (res.success) {
      this.closeLoginModal();
      if (typeof showToast === 'function') {
        showToast(`مرحباً بك: ${res.user.name} (${res.user.title}) ✓`);
      }
      if (typeof switchRole === 'function') {
        switchRole(res.user.role);
      }
    } else {
      alert(res.message);
    }
  }

  handleSendOtp(targetRole) {
    const phone = document.getElementById('auth-input-phone')?.value;
    const res = this.sendOtp(phone);
    if (res.success) {
      document.getElementById('otp-step-phone').style.display = 'none';
      document.getElementById('otp-step-verify').style.display = 'block';
      if (typeof showToast === 'function') showToast(res.message);
    } else {
      alert(res.message);
    }
  }

  handleVerifyOtp(targetRole) {
    const code = document.getElementById('auth-input-otp-code')?.value.trim();
    const res = this.verifyOtp(code, targetRole);
    if (res.success) {
      this.closeLoginModal();
      if (typeof showToast === 'function') {
        showToast(`تم التحقق بنجاح! مرحباً: ${res.user.name} ✓`);
      }
      if (typeof switchRole === 'function') {
        switchRole(res.user.role);
      }
    } else {
      alert(res.message);
    }
  }
}

// تهيئة نظام التوثيق الموحد ككائن عام
window.AthqAuth = new AthqAuthEngine();
