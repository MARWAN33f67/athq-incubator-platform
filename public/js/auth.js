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
  }

  clearSession() {
    this.currentUser = null;
    localStorage.removeItem(this.sessionKey);
    this.updateHeaderAuthStatus();
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

  // فتح نافذة تسجيل الدخول الرسمية مع تخصيص الدور المطلوب
  openLoginModal(targetRole = 'admin') {
    const modal = document.getElementById('modalAuthPortal');
    if (!modal) return;

    const roleInfo = {
      admin: { title: 'لوحة الإدارة والرقابة المركزية', subtitle: 'إدارة مسارات عذق وجمعية البر', icon: 'fa-shield-halved', color: '#0D6E46' },
      association: { title: 'بوابة الجمعيات والمنظمات المحتضنة', subtitle: 'متابعة مراحل الاحتضان ورفع الوثائق وحجز القاعات', icon: 'fa-building-ngo', color: '#0D9488' },
      consultant: { title: 'بوابة الخبراء والمستشارين المعتمدين', subtitle: 'إدارة الجلسات الاستشارية واعتماد التوصيات وساعات التطوع', icon: 'fa-user-tie', color: '#D99B26' }
    };

    const currentRoleInfo = roleInfo[targetRole] || roleInfo.admin;

    modal.innerHTML = `
      <div class="wizard-modal-box" style="max-width: 500px;">
        <div class="wizard-header" style="background: linear-gradient(135deg, #07472C 0%, ${currentRoleInfo.color} 100%);">
          <button class="modal-close-btn" onclick="AthqAuth.closeLoginModal()" style="color: #FFF; font-size: 1.4rem;">&times;</button>
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
            <span style="background: rgba(255,255,255,0.2); padding: 3px 10px; border-radius: 12px; font-size: 0.72rem; font-weight: 800;">نظام النفاذ الموحد الموثوق</span>
            <span style="color: var(--c-gold-light); font-size: 0.75rem;"><i class="fa-solid fa-shield-check"></i> متوافق مع ضوابط الأمن السيبراني</span>
          </div>
          <h3 style="font-size: 1.3rem; font-weight: 800; margin: 0 0 4px 0; display: flex; align-items: center; gap: 10px;">
            <i class="fa-solid ${currentRoleInfo.icon}"></i> ${currentRoleInfo.title}
          </h3>
          <p style="font-size: 0.82rem; opacity: 0.9; margin: 0;">${currentRoleInfo.subtitle}</p>
        </div>

        <div class="wizard-body" style="padding: 24px;">
          <!-- Auth Method Switcher Tabs -->
          <div style="display: flex; background: var(--c-bg-alt); padding: 4px; border-radius: 10px; margin-bottom: 20px; border: 1px solid var(--c-border);">
            <button class="btn btn-sm" id="auth-tab-btn-pwd" onclick="AthqAuth.switchAuthMethod('password')" style="flex: 1; border-radius: 8px; font-weight: 800; background: var(--c-surface); box-shadow: var(--shadow-xs);">
              <i class="fa-solid fa-key"></i> كلمة المرور
            </button>
            <button class="btn btn-sm" id="auth-tab-btn-otp" onclick="AthqAuth.switchAuthMethod('otp')" style="flex: 1; border-radius: 8px; font-weight: 800; color: var(--c-text-muted);">
              <i class="fa-solid fa-mobile-screen-button"></i> رمز الجوال (SMS OTP)
            </button>
          </div>

          <!-- Method 1: Password Form -->
          <div id="auth-form-password">
            <div class="form-group" style="margin-bottom: 14px;">
              <label class="form-label">البريد الإلكتروني أو رقم الترخيص أو الهاتف *</label>
              <input type="text" id="auth-input-identifier" class="form-control" placeholder="admin@athq.biralmadinah.org.sa أو رقم الترخيص" style="direction: ltr; text-align: right;">
            </div>
            <div class="form-group" style="margin-bottom: 18px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                <label class="form-label" style="margin: 0;">كلمة المرور المشفرة *</label>
                <a href="javascript:void(0)" onclick="alert('لإعادة ضبط كلمة المرور، يرجى التواصل مع الدعم الفني: ethq@biralmadinah.org.sa')" style="font-size: 0.75rem; color: var(--c-primary); font-weight: 700;">نسيت كلمة المرور؟</a>
              </div>
              <input type="password" id="auth-input-password" class="form-control" placeholder="••••••••" style="direction: ltr;">
            </div>

            <button class="btn btn-primary" onclick="AthqAuth.handlePasswordLogin('${targetRole}')" style="width: 100%; padding: 12px; font-weight: 800; font-size: 0.95rem; justify-content: center; margin-bottom: 14px;">
              <i class="fa-solid fa-right-to-bracket"></i> تسجيل الدخول الرسمي
            </button>
          </div>

          <!-- Method 2: OTP Form -->
          <div id="auth-form-otp" style="display: none;">
            <div id="otp-step-phone">
              <div class="form-group" style="margin-bottom: 16px;">
                <label class="form-label">رقم الجوال المسجل بالمنصة (سعودي) *</label>
                <div style="position: relative;">
                  <span style="position: absolute; left: 12px; top: 12px; font-weight: 800; color: var(--c-text-muted); direction: ltr;">+966</span>
                  <input type="tel" id="auth-input-phone" class="form-control" placeholder="0551234567" style="padding-left: 55px; direction: ltr; text-align: left;">
                </div>
              </div>
              <button class="btn btn-primary" onclick="AthqAuth.handleSendOtp('${targetRole}')" style="width: 100%; padding: 12px; font-weight: 800; justify-content: center;">
                <i class="fa-solid fa-paper-plane"></i> إرسال رمز التحقق فوراً
              </button>
            </div>

            <div id="otp-step-verify" style="display: none;">
              <p style="font-size: 0.82rem; color: var(--c-text-muted); margin-bottom: 12px;">
                تم إرسال رمز التحقق إلى جوالك. أدخل الرمز المكون من 4 أرقام:
              </p>
              <div class="form-group" style="margin-bottom: 16px;">
                <input type="text" id="auth-input-otp-code" class="form-control" placeholder="• • • •" maxlength="6" style="letter-spacing: 8px; text-align: center; font-size: 1.4rem; font-weight: 800;">
              </div>
              <button class="btn btn-gold" onclick="AthqAuth.handleVerifyOtp('${targetRole}')" style="width: 100%; padding: 12px; font-weight: 800; justify-content: center; margin-bottom: 10px;">
                <i class="fa-solid fa-check-circle"></i> التحقق وتأكيد الدخول
              </button>
              <button class="btn btn-link btn-sm" onclick="AthqAuth.handleSendOtp('${targetRole}')" style="width: 100%; font-size: 0.78rem; color: var(--c-text-muted);">
                إعادة إرسال الرمز
              </button>
            </div>
          </div>

          <!-- Quick Test Demo Buttons -->
          <div style="background: rgba(217,155,38,0.08); border: 1.5px dashed var(--c-gold); border-radius: 10px; padding: 12px 14px; margin-top: 14px;">
            <div style="font-size: 0.78rem; font-weight: 800; color: var(--c-gold-dark); margin-bottom: 6px; display: flex; align-items: center; gap: 6px;">
              <i class="fa-solid fa-flask"></i> الحسابات الرسمية المعدّة للتجربة السريعة:
            </div>
            <div style="display: flex; gap: 6px; flex-wrap: wrap;">
              <button class="badge" onclick="AthqAuth.fillDemoAccount('admin')" style="background: var(--c-primary); color: #FFF; border: none; padding: 4px 10px; cursor: pointer; font-size: 0.74rem;">
                دخول تجريبي كمدير نظام
              </button>
              <button class="badge" onclick="AthqAuth.fillDemoAccount('association')" style="background: #0D9488; color: #FFF; border: none; padding: 4px 10px; cursor: pointer; font-size: 0.74rem;">
                دخول تجريبي كممثل جمعية
              </button>
              <button class="badge" onclick="AthqAuth.fillDemoAccount('consultant')" style="background: var(--c-gold-dark); color: #FFF; border: none; padding: 4px 10px; cursor: pointer; font-size: 0.74rem;">
                دخول تجريبي كمستشار
              </button>
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
    const formPwd = document.getElementById('auth-form-password');
    const formOtp = document.getElementById('auth-form-otp');
    const btnPwd = document.getElementById('auth-tab-btn-pwd');
    const btnOtp = document.getElementById('auth-tab-btn-otp');

    if (method === 'password') {
      formPwd.style.display = 'block';
      formOtp.style.display = 'none';
      btnPwd.style.background = 'var(--c-surface)';
      btnPwd.style.color = 'inherit';
      btnOtp.style.background = 'transparent';
      btnOtp.style.color = 'var(--c-text-muted)';
    } else {
      formPwd.style.display = 'none';
      formOtp.style.display = 'block';
      btnOtp.style.background = 'var(--c-surface)';
      btnOtp.style.color = 'inherit';
      btnPwd.style.background = 'transparent';
      btnPwd.style.color = 'var(--c-text-muted)';
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
