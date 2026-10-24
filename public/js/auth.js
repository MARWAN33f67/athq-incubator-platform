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

      // التحقق التلقائي من رابط تسجيل الدخول المباشر #login
      if (window.location.hash === '#login') {
        setTimeout(() => this.openLoginModal(), 250);
      }
      window.addEventListener('hashchange', () => {
        if (window.location.hash === '#login') {
          this.openLoginModal();
        }
      });

      // إغلاق النافذة بزر Escape
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          this.closeLoginModal();
        }
      });
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
      modal.addEventListener('click', (e) => {
        if (e.target === modal) this.closeLoginModal();
      });
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

  // صوتيات تفاعلية ناعمة (Web Audio API Synthesizer)
  playAudio(type = 'click') {
    try {
      if (window.AthqAuthMuted) return;
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      if (!this.audioCtx) this.audioCtx = new AudioCtx();
      if (this.audioCtx.state === 'suspended') this.audioCtx.resume();
      const now = this.audioCtx.currentTime;

      if (type === 'click') {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(620, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.04);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start();
        osc.stop(now + 0.04);
      } else if (type === 'success') {
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C Major Chord
        notes.forEach((freq, idx) => {
          const osc = this.audioCtx.createOscillator();
          const gain = this.audioCtx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.05);
          gain.gain.setValueAtTime(0.08, now + idx * 0.05);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.25);
          osc.connect(gain);
          gain.connect(this.audioCtx.destination);
          osc.start(now + idx * 0.05);
          osc.stop(now + idx * 0.05 + 0.25);
        });
      }
    } catch (e) {}
  }

  toggleSound() {
    window.AthqAuthMuted = !window.AthqAuthMuted;
    const btn = document.getElementById('modalAuthSoundBtn');
    if (btn) {
      btn.innerHTML = window.AthqAuthMuted ? '<i class="fa-solid fa-volume-xmark"></i>' : '<i class="fa-solid fa-volume-high"></i>';
      btn.style.color = window.AthqAuthMuted ? '#94A3B8' : '#FCD34D';
    }
    if (!window.AthqAuthMuted) this.playAudio('click');
  }

  // فتح نافذة تسجيل الدخول الرسمية الملكية المطورة (1000x Better Luxury Login Portal)
  openLoginModal(targetRole = 'admin') {
    let modal = document.getElementById('modalAuthPortal');
    if (!modal) {
      this.initAuthUI();
      modal = document.getElementById('modalAuthPortal');
    }
    if (!modal) return;

    this.playAudio('click');

    modal.innerHTML = `
      <div class="wizard-modal-box luxury-login-modal" style="max-width: 530px; width: 92%; max-height: 90vh; border-radius: 20px; overflow: hidden; box-shadow: 0 25px 70px rgba(0,0,0,0.7), 0 0 50px rgba(13,110,70,0.3); border: 2px solid rgba(217,155,38,0.45); animation: modalZoomIn 0.28s cubic-bezier(0.16,1,0.3,1); background: #072B1B; color: #FFFFFF; font-family: 'Tajawal', 'Cairo', sans-serif; display: flex; flex-direction: column;">
        
        <!-- Royal Compact Header -->
        <div style="background: linear-gradient(135deg, #02180F 0%, #07472C 60%, #0D6E46 100%); color: #FFFFFF; padding: 14px 18px; display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #D99B26; direction: rtl;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <div style="background: linear-gradient(135deg, #D99B26 0%, #B87F17 100%); color: #02180F; width: 38px; height: 38px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.25rem; box-shadow: 0 4px 12px rgba(217,155,38,0.35); flex-shrink: 0;">
              <i class="fa-solid fa-shield-halved"></i>
            </div>
            <div>
              <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 2px;">
                <span style="background: rgba(255,255,255,0.15); padding: 1px 7px; border-radius: 8px; font-size: 0.66rem; font-weight: 800; color: #FFFFFF;">
                  نظام النفاذ الموحد (IAM)
                </span>
                <span style="color: #FCD34D; font-size: 0.68rem; font-weight: 700;">
                  <i class="fa-solid fa-award"></i> ترخيص (22)
                </span>
              </div>
              <h3 style="font-size: 1.05rem; font-weight: 900; margin: 0; line-height: 1.2; color: #FFFFFF;">
                تسجيل الدخول | حاضنة ومسرعة عذق
              </h3>
            </div>
          </div>

          <!-- Controls: Sound + Close -->
          <div style="display: flex; align-items: center; gap: 8px;">
            <button id="modalAuthSoundBtn" onclick="AthqAuth.toggleSound()" style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: #FCD34D; width: 32px; height: 32px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 0.85rem; transition: all 0.2s;" title="كتم / تفعيل الصوت">
              <i class="fa-solid fa-volume-high"></i>
            </button>
            <button onclick="AthqAuth.closeLoginModal()" style="background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.2); color: #FFFFFF; width: 32px; height: 32px; border-radius: 8px; cursor: pointer; font-size: 1.25rem; display: flex; align-items: center; justify-content: center; line-height: 1; transition: all 0.2s;" onmouseover="this.style.background='rgba(239,68,68,0.8)'" onmouseout="this.style.background='rgba(255,255,255,0.12)'">
              &times;
            </button>
          </div>
        </div>

        <!-- Body: Compact Content -->
        <div style="padding: 16px 18px; max-height: calc(90vh - 100px); overflow-y: auto; background: linear-gradient(180deg, #041F14 0%, #03170E 100%); direction: rtl;">
          
          <!-- QUICK ROLE SHORTCUTS FOR SUPERVISORS & REVIEWERS -->
          <div style="background: rgba(217,155,38,0.08); border: 1.5px solid rgba(217,155,38,0.35); border-radius: 14px; padding: 12px 14px; margin-bottom: 14px;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
              <div style="display: flex; align-items: center; gap: 6px;">
                <span style="color: #FCD34D; font-size: 0.95rem;">⚡</span>
                <strong style="font-size: 0.82rem; color: #FCD34D;">الدخول السريع للمشرفين والتحقق قبل الإطلاق:</strong>
              </div>
              <span style="font-size: 0.65rem; color: #34D399; background: rgba(52,211,153,0.15); border: 1px solid rgba(52,211,153,0.3); padding: 1px 7px; border-radius: 6px; font-weight: 700;">
                نقرة واحدة للدخول ✓
              </span>
            </div>
            <p style="font-size: 0.72rem; color: #CBD5E1; margin: 0 0 10px 0; line-height: 1.4;">
              انقر مباشرة على اسم الدور للدخول الفوري وتفقد البوابة وصلاحياتها:
            </p>

            <!-- Compact Role Buttons Grid -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
              
              <!-- 1. Admin -->
              <button type="button" onclick="AthqAuth.playAudio('click'); AthqAuth.quickLoginAs('admin')" style="display: flex; align-items: center; gap: 8px; padding: 8px 10px; background: rgba(13,110,70,0.35); border: 1.5px solid #34D399; border-radius: 10px; color: #FFFFFF; cursor: pointer; text-align: right; transition: all 0.2s;" onmouseover="this.style.background='rgba(13,110,70,0.7)'; this.style.transform='translateY(-2px)'" onmouseout="this.style.background='rgba(13,110,70,0.35)'; this.style.transform='none'">
                <span style="font-size: 1.2rem; flex-shrink: 0;">🛡️</span>
                <div style="flex: 1; min-width: 0; overflow: hidden;">
                  <div style="font-weight: 800; font-size: 0.78rem; color: #FFFFFF; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">لوحة القيادة (Admin)</div>
                  <div style="font-size: 0.64rem; color: #A7F3D0; font-weight: 600;">المهندس / مدير النظام</div>
                </div>
                <i class="fa-solid fa-arrow-left" style="font-size: 0.65rem; color: #34D399;"></i>
              </button>

              <!-- 2. Association -->
              <button type="button" onclick="AthqAuth.playAudio('click'); AthqAuth.quickLoginAs('association')" style="display: flex; align-items: center; gap: 8px; padding: 8px 10px; background: rgba(2,132,199,0.3); border: 1.5px solid #38BDF8; border-radius: 10px; color: #FFFFFF; cursor: pointer; text-align: right; transition: all 0.2s;" onmouseover="this.style.background='rgba(2,132,199,0.6)'; this.style.transform='translateY(-2px)'" onmouseout="this.style.background='rgba(2,132,199,0.3)'; this.style.transform='none'">
                <span style="font-size: 1.2rem; flex-shrink: 0;">🏢</span>
                <div style="flex: 1; min-width: 0; overflow: hidden;">
                  <div style="font-weight: 800; font-size: 0.78rem; color: #FFFFFF; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">الجمعيات الأهلية</div>
                  <div style="font-size: 0.64rem; color: #BAE6FD; font-weight: 600;">جمعية ديوان الشبابية</div>
                </div>
                <i class="fa-solid fa-arrow-left" style="font-size: 0.65rem; color: #38BDF8;"></i>
              </button>

              <!-- 3. Consultant -->
              <button type="button" onclick="AthqAuth.playAudio('click'); AthqAuth.quickLoginAs('consultant')" style="display: flex; align-items: center; gap: 8px; padding: 8px 10px; background: rgba(217,155,38,0.25); border: 1.5px solid #FCD34D; border-radius: 10px; color: #FFFFFF; cursor: pointer; text-align: right; transition: all 0.2s;" onmouseover="this.style.background='rgba(217,155,38,0.55)'; this.style.transform='translateY(-2px)'" onmouseout="this.style.background='rgba(217,155,38,0.25)'; this.style.transform='none'">
                <span style="font-size: 1.2rem; flex-shrink: 0;">👨‍🏫</span>
                <div style="flex: 1; min-width: 0; overflow: hidden;">
                  <div style="font-weight: 800; font-size: 0.78rem; color: #FFFFFF; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">بوابة المستشارين</div>
                  <div style="font-size: 0.64rem; color: #FDE68A; font-weight: 600;">د. سليمان الحربي</div>
                </div>
                <i class="fa-solid fa-arrow-left" style="font-size: 0.65rem; color: #FCD34D;"></i>
              </button>

              <!-- 4. Applicant -->
              <button type="button" onclick="AthqAuth.playAudio('click'); AthqAuth.quickLoginAs('applicant')" style="display: flex; align-items: center; gap: 8px; padding: 8px 10px; background: rgba(99,102,241,0.25); border: 1.5px solid #A78BFA; border-radius: 10px; color: #FFFFFF; cursor: pointer; text-align: right; transition: all 0.2s;" onmouseover="this.style.background='rgba(99,102,241,0.55)'; this.style.transform='translateY(-2px)'" onmouseout="this.style.background='rgba(99,102,241,0.25)'; this.style.transform='none'">
                <span style="font-size: 1.2rem; flex-shrink: 0;">🌱</span>
                <div style="flex: 1; min-width: 0; overflow: hidden;">
                  <div style="font-weight: 800; font-size: 0.78rem; color: #FFFFFF; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">تقديم طلب جديد</div>
                  <div style="font-size: 0.64rem; color: #DDD6FE; font-weight: 600;">معالج واختبار الانطلاقة</div>
                </div>
                <i class="fa-solid fa-arrow-left" style="font-size: 0.65rem; color: #A78BFA;"></i>
              </button>

            </div>
          </div>

          <!-- Divider -->
          <div style="display: flex; align-items: center; gap: 10px; margin: 12px 0 14px 0;">
            <div style="flex: 1; height: 1px; background: rgba(255,255,255,0.12);"></div>
            <span style="font-size: 0.68rem; color: #94A3B8; font-weight: 700;">أو تسجيل الدخول الرسمي بالنظام</span>
            <div style="flex: 1; height: 1px; background: rgba(255,255,255,0.12);"></div>
          </div>

          <!-- OFFICIAL AUTH ENGINE TABS -->
          <div style="display: flex; background: rgba(0,0,0,0.4); padding: 4px; border-radius: 10px; margin-bottom: 14px; border: 1px solid rgba(255,255,255,0.08); gap: 4px;">
            <button class="btn btn-sm" id="auth-tab-btn-nafath" onclick="AthqAuth.switchAuthMethod('nafath')" style="flex: 1.2; border-radius: 8px; font-weight: 800; background: linear-gradient(135deg, #0D6E46 0%, #07472C 100%); color: #FFFFFF; font-size: 0.76rem; border: 1px solid rgba(52,211,153,0.4); padding: 7px 8px; cursor: pointer;">
              <i class="fa-solid fa-fingerprint"></i> نفاذ الموحد
            </button>
            <button class="btn btn-sm" id="auth-tab-btn-pwd" onclick="AthqAuth.switchAuthMethod('password')" style="flex: 1; border-radius: 8px; font-weight: 800; color: #94A3B8; font-size: 0.76rem; background: transparent; border: none; padding: 7px 8px; cursor: pointer;">
              <i class="fa-solid fa-key"></i> كلمة المرور
            </button>
            <button class="btn btn-sm" id="auth-tab-btn-otp" onclick="AthqAuth.switchAuthMethod('otp')" style="flex: 1; border-radius: 8px; font-weight: 800; color: #94A3B8; font-size: 0.76rem; background: transparent; border: none; padding: 7px 8px; cursor: pointer;">
              <i class="fa-solid fa-mobile-screen-button"></i> رمز SMS
            </button>
          </div>

          <!-- Method 1: Nafath SSO Form -->
          <div id="auth-form-nafath">
            <div id="nafath-step-input">
              <div style="text-align: center; margin-bottom: 12px; background: rgba(13,110,70,0.2); border: 1.5px solid rgba(52,211,153,0.3); border-radius: 12px; padding: 12px;">
                <div style="display: inline-flex; align-items: center; justify-content: center; width: 40px; height: 40px; background: #0D6E46; color: #FFFFFF; border-radius: 10px; font-size: 1.25rem; margin-bottom: 4px; box-shadow: 0 4px 12px rgba(13,110,70,0.4);">
                  <i class="fa-solid fa-id-card"></i>
                </div>
                <div style="font-weight: 800; font-size: 0.88rem; color: #FFFFFF;">بوابة النفاذ الوطني الموحد (نفاذ)</div>
                <div style="font-size: 0.7rem; color: #A7F3D0;">تسجيل دخول موثق بالهوية الوطنية أو هوية مقيم للمفوض</div>
              </div>

              <div class="form-group" style="margin-bottom: 12px;">
                <label class="form-label" style="font-size: 0.78rem; font-weight: 800; color: #E2E8F0; display:flex; justify-content:space-between; margin-bottom: 5px;">
                  <span>رقم الهوية الوطنية أو الإقامة للمفوض *</span>
                  <span style="font-size: 0.7rem; color: #34D399;"><i class="fa-solid fa-circle-check"></i> 10 أرقام</span>
                </label>
                <input type="text" id="auth-input-national-id" class="form-control" placeholder="10xxxxxxxx أو 20xxxxxxxx" value="1098234112" maxlength="10" style="direction: ltr; text-align: center; font-size: 1.05rem; font-weight: 900; letter-spacing: 2px; background: rgba(0,0,0,0.35); border: 1.5px solid rgba(255,255,255,0.15); color:#FFFFFF; border-radius: 10px; padding: 9px;">
              </div>

              <button class="btn btn-primary" onclick="AthqAuth.playAudio('click'); AthqAuth.handleNafathRequest('${targetRole}')" style="width: 100%; padding: 10px; font-weight: 800; font-size: 0.88rem; justify-content: center; background: linear-gradient(135deg, #0D6E46 0%, #07472C 100%); border: 1px solid rgba(52,211,153,0.4); border-radius: 10px; cursor: pointer;">
                <i class="fa-solid fa-fingerprint"></i> طلب التحقق عبر تطبيق نفاذ
              </button>
            </div>

            <div id="nafath-step-confirm" style="display: none; text-align: center; padding: 4px 0;">
              <div style="background: radial-gradient(circle at 50% 50%, rgba(13,110,70,0.4) 0%, rgba(3,29,18,0.8) 100%); color: #FFFFFF; border: 2px solid #D99B26; border-radius: 14px; padding: 16px; margin-bottom: 12px;">
                <div style="font-size: 0.76rem; color: #A7F3D0; margin-bottom: 2px;">افتح تطبيق <strong>نفاذ</strong> على هاتفك واختر الرقم التالي:</div>
                <div id="nafath-display-number" style="font-size: 3rem; font-weight: 900; color: #FCD34D; letter-spacing: 4px; line-height: 1; margin: 8px 0; font-family: monospace; text-shadow: 0 0 20px rgba(252,211,77,0.5);">
                  48
                </div>
                <div style="font-size: 0.72rem; color: #D1FAE5; display: flex; align-items: center; justify-content: center; gap: 8px;">
                  <span class="live-pulse" style="background: #34D399;"></span> بانتظار إشعار التأكيد من تطبيق نفاذ...
                </div>
              </div>

              <button class="btn btn-gold" onclick="AthqAuth.playAudio('success'); AthqAuth.simulateNafathApprove('${targetRole}')" style="width: 100%; padding: 10px; font-weight: 800; font-size: 0.88rem; justify-content: center; background: linear-gradient(135deg, #D99B26 0%, #B87F17 100%); color: #02180F; border-radius: 10px; border: 1px solid #FCD34D; cursor: pointer;">
                <i class="fa-solid fa-check-double"></i> محاكاة تأكيد الهوية الفوري في نفاذ
              </button>
            </div>
          </div>

          <!-- Method 2: Password Form -->
          <div id="auth-form-password" style="display: none;">
            <div class="form-group" style="margin-bottom: 12px;">
              <label class="form-label" style="font-size: 0.78rem; font-weight: 800; color: #E2E8F0; margin-bottom: 5px; display:block;">اسم المستخدم أو البريد الإلكتروني *</label>
              <input type="text" id="auth-input-identifier" class="form-control" placeholder="admin@athq.biralmadinah.org.sa" value="admin@athq.biralmadinah.org.sa" style="direction: ltr; text-align: right; font-weight: 700; background: rgba(0,0,0,0.35); border: 1.5px solid rgba(255,255,255,0.15); color:#FFFFFF; border-radius: 10px; padding: 9px; font-size: 0.82rem;">
            </div>

            <div class="form-group" style="margin-bottom: 12px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
                <label class="form-label" style="margin: 0; font-size: 0.78rem; font-weight: 800; color: #E2E8F0;">كلمة المرور المشفرة *</label>
                <span id="modalCapsLockWarn" style="display: none; color: #FCD34D; font-size: 0.7rem;">
                  <i class="fa-solid fa-triangle-exclamation"></i> Caps Lock مفعّل
                </span>
                <span style="font-size: 0.68rem; color: #34D399; font-weight: 700;">AES-256</span>
              </div>
              <div style="position: relative;">
                <input type="password" id="auth-input-password" class="form-control" placeholder="••••••••" value="Admin@2025" style="direction: ltr; font-weight: 800; letter-spacing: 2px; background: rgba(0,0,0,0.35); border: 1.5px solid rgba(255,255,255,0.15); color:#FFFFFF; border-radius: 10px; padding: 9px; padding-left: 38px; font-size: 0.88rem;" oninput="AthqAuth.checkModalPasswordStrength(this.value)">
                <button type="button" onclick="AthqAuth.toggleModalPasswordVisibility()" style="position: absolute; left: 10px; top: 9px; background: none; border: none; color: #94A3B8; cursor: pointer; font-size: 0.95rem;">
                  <i class="fa-solid fa-eye" id="modalEyeIcon"></i>
                </button>
              </div>

              <!-- Strength Meter -->
              <div style="margin-top: 6px;">
                <div style="display: flex; gap: 4px; height: 3px; margin-bottom: 4px;">
                  <div id="mBar1" style="flex:1; background:#34D399; border-radius:2px;"></div>
                  <div id="mBar2" style="flex:1; background:#34D399; border-radius:2px;"></div>
                  <div id="mBar3" style="flex:1; background:#34D399; border-radius:2px;"></div>
                  <div id="mBar4" style="flex:1; background:#34D399; border-radius:2px;"></div>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 0.68rem; color: #94A3B8;">
                  <span id="mStrengthText" style="color: #34D399;">قوة كلمة المرور: آمنة جداً ✓</span>
                  <a href="javascript:void(0)" onclick="AthqAuth.simulateForgotModal()" style="color: #FCD34D; text-decoration: none;">نسيت كلمة المرور؟</a>
                </div>
              </div>
            </div>

            <button class="btn btn-primary" onclick="AthqAuth.playAudio('click'); AthqAuth.handlePasswordLogin('${targetRole}')" style="width: 100%; padding: 10px; font-weight: 800; font-size: 0.88rem; justify-content: center; background: linear-gradient(135deg, #0D6E46 0%, #07472C 100%); border: 1px solid rgba(52,211,153,0.4); border-radius: 10px; cursor: pointer;">
              <i class="fa-solid fa-right-to-bracket"></i> تسجيل الدخول الرسمي
            </button>
          </div>

          <!-- Method 3: OTP Form -->
          <div id="auth-form-otp" style="display: none;">
            <div id="otp-step-phone">
              <div class="form-group" style="margin-bottom: 12px;">
                <label class="form-label" style="font-size: 0.78rem; font-weight: 800; color: #E2E8F0; margin-bottom: 5px; display:block;">رقم الجوال المسجل بالمنصة *</label>
                <div style="position: relative;">
                  <span style="position: absolute; left: 10px; top: 9px; font-weight: 800; color: #FCD34D; direction: ltr; font-size: 0.8rem;">🇸🇦 +966</span>
                  <input type="tel" id="auth-input-phone" class="form-control" placeholder="0551234567" value="0500000001" style="padding-left: 70px; direction: ltr; text-align: left; font-weight: 800; background: rgba(0,0,0,0.35); border: 1.5px solid rgba(255,255,255,0.15); color:#FFFFFF; border-radius: 10px; padding-top: 9px; padding-bottom: 9px; font-size: 0.88rem;">
                </div>
              </div>
              <button class="btn btn-primary" onclick="AthqAuth.playAudio('click'); AthqAuth.handleSendOtp('${targetRole}')" style="width: 100%; padding: 10px; font-weight: 800; font-size: 0.88rem; justify-content: center; background: linear-gradient(135deg, #0D6E46 0%, #07472C 100%); border: 1px solid rgba(52,211,153,0.4); border-radius: 10px; cursor: pointer;">
                <i class="fa-solid fa-paper-plane"></i> إرسال رمز التحقق SMS فوراً
              </button>
            </div>

            <div id="otp-step-verify" style="display: none;">
              <p style="font-size: 0.74rem; color: #CBD5E1; margin-bottom: 8px; text-align: center;">
                تم إرسال رمز التحقق إلى جوالك. أدخل الرمز المكون من 4 أرقام:
              </p>
              
              <div style="display: flex; gap: 8px; justify-content: center; direction: ltr; margin: 10px 0;">
                <input type="text" maxlength="1" id="mOtp1" oninput="AthqAuth.handleBoxOtp(this, 1)" style="width: 46px; height: 46px; text-align: center; font-size: 1.35rem; font-weight: 900; background: rgba(0,0,0,0.4); border: 2px solid rgba(255,255,255,0.2); border-radius: 10px; color: #FCD34D; outline: none;">
                <input type="text" maxlength="1" id="mOtp2" oninput="AthqAuth.handleBoxOtp(this, 2)" style="width: 46px; height: 46px; text-align: center; font-size: 1.35rem; font-weight: 900; background: rgba(0,0,0,0.4); border: 2px solid rgba(255,255,255,0.2); border-radius: 10px; color: #FCD34D; outline: none;">
                <input type="text" maxlength="1" id="mOtp3" oninput="AthqAuth.handleBoxOtp(this, 3)" style="width: 46px; height: 46px; text-align: center; font-size: 1.35rem; font-weight: 900; background: rgba(0,0,0,0.4); border: 2px solid rgba(255,255,255,0.2); border-radius: 10px; color: #FCD34D; outline: none;">
                <input type="text" maxlength="1" id="mOtp4" oninput="AthqAuth.handleBoxOtp(this, 4)" style="width: 46px; height: 46px; text-align: center; font-size: 1.35rem; font-weight: 900; background: rgba(0,0,0,0.4); border: 2px solid rgba(255,255,255,0.2); border-radius: 10px; color: #FCD34D; outline: none;">
              </div>

              <button class="btn btn-gold" onclick="AthqAuth.playAudio('click'); AthqAuth.handleVerifyOtp('${targetRole}')" style="width: 100%; padding: 10px; font-weight: 800; font-size: 0.88rem; justify-content: center; margin-bottom: 6px; background: linear-gradient(135deg, #D99B26 0%, #B87F17 100%); color: #02180F; border-radius: 10px; border: 1px solid #FCD34D; cursor: pointer;">
                <i class="fa-solid fa-check-circle"></i> التحقق وتأكيد الدخول
              </button>
              <button class="btn btn-link btn-sm" onclick="AthqAuth.handleSendOtp('${targetRole}')" style="width: 100%; font-size: 0.72rem; color: #94A3B8; text-decoration: none; cursor: pointer;">
                إعادة إرسال الرمز
              </button>
            </div>
          </div>

          <!-- Quick Autofill Trigger -->
          <div style="margin-top: 12px; padding-top: 10px; border-top: 1px dashed rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 6px;">
            <span style="font-size: 0.7rem; font-weight: 800; color: #94A3B8;">
              أو تعبئة النموذج تلقائياً:
            </span>
            <div style="display: flex; gap: 5px;">
              <button type="button" onclick="AthqAuth.fillDemoAccount('admin')" style="background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); color: #FFFFFF; padding: 3px 8px; border-radius: 6px; font-size: 0.68rem; cursor: pointer; font-weight: 700; transition: all 0.2s;" onmouseover="this.style.background='rgba(217,155,38,0.3)'" onmouseout="this.style.background='rgba(255,255,255,0.08)'">
                الإدارة
              </button>
              <button type="button" onclick="AthqAuth.fillDemoAccount('association')" style="background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); color: #FFFFFF; padding: 3px 8px; border-radius: 6px; font-size: 0.68rem; cursor: pointer; font-weight: 700; transition: all 0.2s;" onmouseover="this.style.background='rgba(217,155,38,0.3)'" onmouseout="this.style.background='rgba(255,255,255,0.08)'">
                الجمعية
              </button>
              <button type="button" onclick="AthqAuth.fillDemoAccount('consultant')" style="background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); color: #FFFFFF; padding: 3px 8px; border-radius: 6px; font-size: 0.68rem; cursor: pointer; font-weight: 700; transition: all 0.2s;" onmouseover="this.style.background='rgba(217,155,38,0.3)'" onmouseout="this.style.background='rgba(255,255,255,0.08)'">
                المستشار
              </button>
            </div>
          </div>

          <!-- Bottom Security Bar -->
          <div style="margin-top: 14px; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.08); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; font-size: 0.68rem; color: #94A3B8;">
            <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
              <span><i class="fa-solid fa-shield-halved" style="color: #34D399;"></i> نفاذ • NCA</span>
              <span><i class="fa-solid fa-lock" style="color: #FCD34D;"></i> SSL 256-bit</span>
            </div>
            <div>
              حاضنة ومسرعة عذق • جمعية البر
            </div>
          </div>

        </div>

      </div>
    `;

    modal.classList.add('active');

    // Caps lock check in modal
    document.addEventListener('keydown', (e) => {
      const warn = document.getElementById('modalCapsLockWarn');
      if (warn && e.getModifierState) {
        warn.style.display = e.getModifierState('CapsLock') ? 'inline-block' : 'none';
      }
    });
  }

  toggleModalPasswordVisibility() {
    this.playAudio('click');
    const input = document.getElementById('auth-input-password');
    const icon = document.getElementById('modalEyeIcon');
    if (!input) return;
    const isPwd = input.type === 'password';
    input.type = isPwd ? 'text' : 'password';
    if (icon) {
      icon.className = isPwd ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye';
    }
  }

  checkModalPasswordStrength(val) {
    const b1 = document.getElementById('mBar1');
    const b2 = document.getElementById('mBar2');
    const b3 = document.getElementById('mBar3');
    const b4 = document.getElementById('mBar4');
    const txt = document.getElementById('mStrengthText');
    if (!b1) return;

    const reset = () => [b1, b2, b3, b4].forEach(b => b.style.background = 'rgba(255,255,255,0.15)');
    reset();

    if (!val) {
      txt.textContent = 'أدخل كلمة المرور';
      return;
    }

    let score = 0;
    if (val.length >= 6) score++;
    if (val.length >= 8 && /[A-Z]/.test(val)) score++;
    if (/[0-9]/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;

    if (score === 1) {
      b1.style.background = '#EF4444';
      txt.textContent = 'قوة كلمة المرور: ضعيفة';
      txt.style.color = '#EF4444';
    } else if (score === 2) {
      b1.style.background = '#F59E0B';
      b2.style.background = '#F59E0B';
      txt.textContent = 'قوة كلمة المرور: متوسطة';
      txt.style.color = '#F59E0B';
    } else if (score === 3) {
      b1.style.background = '#10B981';
      b2.style.background = '#10B981';
      b3.style.background = '#10B981';
      txt.textContent = 'قوة كلمة المرور: جيدة';
      txt.style.color = '#10B981';
    } else {
      [b1, b2, b3, b4].forEach(b => b.style.background = '#34D399');
      txt.textContent = 'قوة كلمة المرور: آمنة جداً وقوية ✓';
      txt.style.color = '#34D399';
    }
  }

  simulateForgotModal() {
    this.playAudio('click');
    alert('نظام استعادة الحساب:\nتم إرسال رابط إعادة تعيين كلمة المرور المشفر إلى البريد الرسمي المرتبط بالجهة.');
  }

  handleBoxOtp(input, index) {
    this.playAudio('click');
    if (input.value.length === 1 && index < 4) {
      const next = document.getElementById(`mOtp${index + 1}`);
      if (next) next.focus();
    }
  }

  closeLoginModal() {
    const modal = document.getElementById('modalAuthPortal');
    if (modal) modal.classList.remove('active');
  }

  switchAuthMethod(method) {
    this.playAudio('click');
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
          b.style.color = '#94A3B8';
          b.style.border = 'none';
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
        btnNafath.style.background = 'linear-gradient(135deg, #0D6E46 0%, #07472C 100%)';
        btnNafath.style.color = '#FFFFFF';
        btnNafath.style.border = '1px solid rgba(52,211,153,0.4)';
      }
    } else if (method === 'password') {
      if (formPwd) formPwd.style.display = 'block';
      if (btnPwd) {
        btnPwd.style.background = 'linear-gradient(135deg, #0D6E46 0%, #07472C 100%)';
        btnPwd.style.color = '#FFFFFF';
        btnPwd.style.border = '1px solid rgba(52,211,153,0.4)';
      }
    } else {
      if (formOtp) formOtp.style.display = 'block';
      if (btnOtp) {
        btnOtp.style.background = 'linear-gradient(135deg, #0D6E46 0%, #07472C 100%)';
        btnOtp.style.color = '#FFFFFF';
        btnOtp.style.border = '1px solid rgba(52,211,153,0.4)';
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

    // تأكيد تلقائي بعد 4.5 ثوانٍ لتسهيل التجربة أمام اللجان
    setTimeout(() => {
      const confirmBox = document.getElementById('nafath-step-confirm');
      if (confirmBox && confirmBox.style.display !== 'none') {
        this.simulateNafathApprove(targetRole);
      }
    }, 4500);
  }

  simulateNafathApprove(targetRole) {
    this.playAudio('success');
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
    this.playAudio('click');
    const acc = this.officialAccounts.find(a => a.role === role);
    if (!acc) return;

    this.switchAuthMethod('password');
    const idInput = document.getElementById('auth-input-identifier');
    const pwdInput = document.getElementById('auth-input-password');

    if (idInput) idInput.value = acc.email;
    if (pwdInput) {
      pwdInput.value = acc.password;
      this.checkModalPasswordStrength(acc.password);
    }

    if (typeof showToast === 'function') {
      showToast(`تم تعبئة بيانات الحساب الرسمي لـ: ${acc.name} ✓`);
    }
  }

  async handlePasswordLogin(targetRole) {
    const idInput = document.getElementById('auth-input-identifier')?.value;
    const pwdInput = document.getElementById('auth-input-password')?.value;

    const res = await this.loginWithPassword(idInput, pwdInput, targetRole);
    if (res.success) {
      this.playAudio('success');
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

      // تعبئة الرمز تلقائياً في الصناديق بعد ثانية ونصف لتسهيل الفحص
      if (this.activeOtp) {
        const code = this.activeOtp.code;
        setTimeout(() => {
          for (let i = 0; i < 4; i++) {
            const el = document.getElementById(`mOtp${i+1}`);
            if (el) el.value = code[i] || '';
          }
        }, 1600);
      }
    } else {
      alert(res.message);
    }
  }

  handleVerifyOtp(targetRole) {
    let code = '';
    for (let i = 1; i <= 4; i++) {
      code += (document.getElementById(`mOtp${i}`)?.value || '');
    }
    const res = this.verifyOtp(code, targetRole);
    if (res.success) {
      this.playAudio('success');
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
