/**
 * حاضنة ومسرعة عذق - جمعية البر بالمدينة المنورة
 * شاشة العرض التنفيذي لمجلس الإدارة وكبار المسؤولين (Executive Presentation Mode)
 * مصممة خصيصاً للاجتماعات الرسمية، العرض على أصحاب السمو والمعالي، ولجان المراجعة والاعتماد
 */

class AthqExecutivePresentation {
  constructor() {
    this.currentSlide = 1;
    this.totalSlides = 4;
    this.modalId = 'modalExecutiveBriefing';
  }

  open() {
    let modal = document.getElementById(this.modalId);
    if (!modal) {
      modal = document.createElement('div');
      modal.id = this.modalId;
      modal.className = 'modal-overlay';
      modal.style.zIndex = '9999999';
      modal.style.background = 'rgba(7, 71, 44, 0.96)';
      modal.style.backdropFilter = 'blur(16px)';
      document.body.appendChild(modal);
    }

    this.currentSlide = 1;
    this.render();
    modal.classList.add('active');

    // تفعيل اختصارات لوحة المفاتيح للتنقل بين الشرائح
    window.addEventListener('keydown', this.handleKeyDown);
  }

  close() {
    const modal = document.getElementById(this.modalId);
    if (modal) modal.classList.remove('active');
    window.removeEventListener('keydown', this.handleKeyDown);
  }

  handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'PageDown' || e.key === ' ') {
      AthqPresentation.next();
    } else if (e.key === 'ArrowRight' || e.key === 'PageUp') {
      AthqPresentation.prev();
    } else if (e.key === 'Escape') {
      AthqPresentation.close();
    }
  };

  next() {
    if (this.currentSlide < this.totalSlides) {
      this.currentSlide++;
      this.render();
    }
  }

  prev() {
    if (this.currentSlide > 1) {
      this.currentSlide--;
      this.render();
    }
  }

  goTo(slideNum) {
    this.currentSlide = slideNum;
    this.render();
  }

  render() {
    const modal = document.getElementById(this.modalId);
    if (!modal) return;

    let slideContent = '';

    if (this.currentSlide === 1) {
      slideContent = `
        <div style="text-align: center; max-width: 900px; margin: 0 auto; animation: fadeIn 0.4s ease;">
          <div style="display: flex; justify-content: center; align-items: center; gap: 24px; margin-bottom: 24px;">
            <img src="assets/images/athq-logo.png" style="height: 100px; width: auto; object-fit: contain;">
            <div style="width: 2px; height: 70px; background: rgba(217, 155, 38, 0.5);"></div>
            <img src="assets/images/bir-logo.png" style="height: 100px; width: auto; object-fit: contain;">
          </div>

          <div style="display: inline-block; background: rgba(217, 155, 38, 0.18); border: 1.5px solid #D99B26; color: #F4BA44; padding: 6px 20px; border-radius: 30px; font-weight: 800; font-size: 0.95rem; margin-bottom: 16px;">
            مبادرة تنموية رائدة تحت رعاية كريمة من صاحب السمو الملكي أمير منطقة المدينة المنورة
          </div>

          <h1 style="font-size: 2.6rem; font-weight: 900; color: #FFFFFF; line-height: 1.3; margin-bottom: 16px;">
            منظومة حاضنة ومسرعة عذق
          </h1>
          <h2 style="font-size: 1.3rem; font-weight: 600; color: #E8F3EE; margin-bottom: 28px; opacity: 0.95;">
            جمعية البر بالمدينة المنورة • بالشراكة الاستراتيجية مع المركز الوطني لتنمية القطاع غير الربحي
          </h2>

          <p style="font-size: 1.1rem; color: #ADC3B7; line-height: 1.8; max-width: 780px; margin: 0 auto 32px auto;">
            أول حاضنة ومسرعة أعمال متخصصة ومصممة هندسياً لتمكين وتأهيل المنظمات والجمعيات الأهلية الناشئة والمتعثرة بمنطقة المدينة المنورة، ورفع كفاءة حوكمتها واستدامتها المالية لتحقيق مستهدفات رؤية المملكة 2030.
          </p>

          <div style="display: flex; justify-content: center; gap: 14px; flex-wrap: wrap;">
            <button class="btn btn-gold btn-lg" onclick="AthqPresentation.next()" style="font-weight: 800; padding: 14px 32px; font-size: 1.05rem;">
              استعراض المؤشرات التنفيذية المعتمدة <i class="fa-solid fa-arrow-left"></i>
            </button>
          </div>
        </div>
      `;
    } else if (this.currentSlide === 2) {
      slideContent = `
        <div style="max-width: 1050px; margin: 0 auto; animation: fadeIn 0.4s ease;">
          <div style="text-align: center; margin-bottom: 30px;">
            <span style="color: #D99B26; font-weight: 800; font-size: 0.9rem; letter-spacing: 1px;">المؤشرات والإحصائيات الحية المعتمدة</span>
            <h2 style="font-size: 2.2rem; font-weight: 900; color: #FFFFFF; margin-top: 6px;">الأثر التنموي المتحقق لمنظومة عذق</h2>
          </div>

          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 30px;">
            <div style="background: rgba(255,255,255,0.06); border: 1.5px solid rgba(255,255,255,0.12); border-radius: 18px; padding: 24px; text-align: center;">
              <div style="font-size: 2.6rem; font-weight: 900; color: #22C55E; margin-bottom: 6px;">+16,311</div>
              <div style="font-size: 1.05rem; font-weight: 800; color: #FFFFFF; margin-bottom: 4px;">ساعة تطوعية معتمدة</div>
              <div style="font-size: 0.85rem; color: #94A3B8;">موثقة عبر المنصة الوطنية للعمل التطوعي</div>
            </div>

            <div style="background: rgba(255,255,255,0.06); border: 1.5px solid rgba(255,255,255,0.12); border-radius: 18px; padding: 24px; text-align: center;">
              <div style="font-size: 2.6rem; font-weight: 900; color: #D99B26; margin-bottom: 6px;">+4,470</div>
              <div style="font-size: 1.05rem; font-weight: 800; color: #FFFFFF; margin-bottom: 4px;">ساعة عمل داخل الحاضنة</div>
              <div style="font-size: 0.85rem; color: #94A3B8;">إشغال مكتبي وإنتاجي للجمعيات المحتضنة</div>
            </div>

            <div style="background: rgba(255,255,255,0.06); border: 1.5px solid rgba(255,255,255,0.12); border-radius: 18px; padding: 24px; text-align: center;">
              <div style="font-size: 2.6rem; font-weight: 900; color: #38BDF8; margin-bottom: 6px;">+1,122</div>
              <div style="font-size: 1.05rem; font-weight: 800; color: #FFFFFF; margin-bottom: 4px;">متطوع ومشارك متخصص</div>
              <div style="font-size: 0.85rem; color: #94A3B8;">كوادر نوعية في خدمة برامج المدينة</div>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
            <div style="background: rgba(13,110,70,0.3); border: 1.5px solid #10B981; border-radius: 16px; padding: 20px; display: flex; align-items: center; gap: 18px;">
              <div style="font-size: 2.4rem; color: #10B981;"><i class="fa-solid fa-building-ngo"></i></div>
              <div>
                <div style="font-size: 1.4rem; font-weight: 900; color: #FFFFFF;">15 جهة أهلية محتضنة حالياً</div>
                <div style="font-size: 0.85rem; color: #D1FAE5;">(وقف العمل الصالح، جمعية ديوان الشبابية، جمعية همم، جمعية النقاء، إرشاد...)</div>
              </div>
            </div>

            <div style="background: rgba(217,155,38,0.2); border: 1.5px solid #D99B26; border-radius: 16px; padding: 20px; display: flex; align-items: center; gap: 18px;">
              <div style="font-size: 2.4rem; color: #F4BA44;"><i class="fa-solid fa-graduation-cap"></i></div>
              <div>
                <div style="font-size: 1.4rem; font-weight: 900; color: #FFFFFF;">7 جهات متخرجة بنجاح مستدام</div>
                <div style="font-size: 0.85rem; color: #FEF3C7;">(جمعية تكوين، الأدب والأدباء، هيئة الصحفيين، رحاب، رعاية الأرامل...)</div>
              </div>
            </div>
          </div>
        </div>
      `;
    } else if (this.currentSlide === 3) {
      slideContent = `
        <div style="max-width: 1050px; margin: 0 auto; animation: fadeIn 0.4s ease;">
          <div style="text-align: center; margin-bottom: 24px;">
            <span style="color: #D99B26; font-weight: 800; font-size: 0.9rem;">البرامج والمرافق المجهزة</span>
            <h2 style="font-size: 2.2rem; font-weight: 900; color: #FFFFFF; margin-top: 6px;">حزم التمكين والمرافق اللوجستية المتكاملة</h2>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
            <div style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); border-radius: 16px; padding: 22px;">
              <h3 style="font-size: 1.15rem; font-weight: 800; color: #F4BA44; margin-bottom: 14px; display: flex; align-items: center; gap: 10px;">
                <i class="fa-solid fa-layer-group"></i> مسارات البرامج الخمسة المعتمدة
              </h3>
              <ul style="list-style: none; padding: 0; margin: 0; color: #E2E8F0; font-size: 0.9rem; line-height: 2;">
                <li><i class="fa-solid fa-check" style="color: #22C55E; margin-left: 8px;"></i> <strong>مسار الحوكمة:</strong> بناء اللوائح ومصفوفة الصلاحيات (شهران).</li>
                <li><i class="fa-solid fa-check" style="color: #22C55E; margin-left: 8px;"></i> <strong>مسار البناء المؤسسي:</strong> الهيكلة والسياسات (3 شهور).</li>
                <li><i class="fa-solid fa-check" style="color: #22C55E; margin-left: 8px;"></i> <strong>مسار التأهيل والتدريب:</strong> إعداد الكوادر القيادية (3 شهور).</li>
                <li><i class="fa-solid fa-check" style="color: #22C55E; margin-left: 8px;"></i> <strong>مسار الاستشارات التخصصية:</strong> إرشاد وتوجيه الخبراء (12 شهراً).</li>
                <li><i class="fa-solid fa-check" style="color: #22C55E; margin-left: 8px;"></i> <strong>مسار الدعم التشغيلي:</strong> إسناد مالي ومكتبي (12 - 24 شهراً).</li>
              </ul>
            </div>

            <div style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); border-radius: 16px; padding: 22px;">
              <h3 style="font-size: 1.15rem; font-weight: 800; color: #38BDF8; margin-bottom: 14px; display: flex; align-items: center; gap: 10px;">
                <i class="fa-solid fa-building"></i> المرافق والتجهيزات الذكية
              </h3>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; color: #FFFFFF;">
                <div style="background: rgba(0,0,0,0.2); padding: 12px; border-radius: 10px; text-align: center;">
                  <strong style="font-size: 1.4rem; color: #D99B26; display: block;">13+</strong>
                  <span style="font-size: 0.8rem; color: #CBD5E1;">مقراً إدارياً مجهزاً بالكامل</span>
                </div>
                <div style="background: rgba(0,0,0,0.2); padding: 12px; border-radius: 10px; text-align: center;">
                  <strong style="font-size: 1.4rem; color: #38BDF8; display: block;">18+</strong>
                  <span style="font-size: 0.8rem; color: #CBD5E1;">مساحة عمل تفاعلية مشتركة</span>
                </div>
                <div style="background: rgba(0,0,0,0.2); padding: 12px; border-radius: 10px; text-align: center;">
                  <strong style="font-size: 1.4rem; color: #22C55E; display: block;">3</strong>
                  <span style="font-size: 0.8rem; color: #CBD5E1;">قاعات استشارية تخصصية خاصة</span>
                </div>
                <div style="background: rgba(0,0,0,0.2); padding: 12px; border-radius: 10px; text-align: center;">
                  <strong style="font-size: 1.4rem; color: #E2E8F0; display: block;">4</strong>
                  <span style="font-size: 0.8rem; color: #CBD5E1;">أركان ضيافة وقاعات اجتماعات</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    } else if (this.currentSlide === 4) {
      slideContent = `
        <div style="max-width: 920px; margin: 0 auto; text-align: center; animation: fadeIn 0.4s ease;">
          <div style="display: inline-flex; align-items: center; gap: 10px; background: rgba(34,197,94,0.15); border: 1.5px solid #22C55E; color: #4ADE80; padding: 6px 18px; border-radius: 30px; font-weight: 800; font-size: 0.9rem; margin-bottom: 16px;">
            <i class="fa-solid fa-circle-check"></i> الجاهزية التقنية والتشغيلية المعتمدة
          </div>

          <h2 style="font-size: 2.4rem; font-weight: 900; color: #FFFFFF; margin-bottom: 20px;">
            منظومة رقمية جاهزة للتدشين والربط الحكومي
          </h2>

          <p style="font-size: 1.05rem; color: #E2E8F0; line-height: 1.8; margin-bottom: 30px;">
            تمت هندسة المنصة وفق أعلى المعايير المعمارية: أتمتة كاملة لخرائط سير العمل (BPMN)، قاعدة بيانات علائقية متوافقة مع ضوابط الأمن السيبراني وسدايا، نظام تسجيل دخول موحد برمز الجوال والنفاذ الوطني، ولوحات رقابة فورية لمجلس الإدارة.
          </p>

          <div style="display: flex; justify-content: center; gap: 14px; flex-wrap: wrap;">
            <button class="btn btn-gold btn-lg" onclick="AthqPresentation.close(); switchRole('admin');" style="font-weight: 800; padding: 12px 30px;">
              <i class="fa-solid fa-shield-halved"></i> الانتقال إلى لوحة القيادة المركزية
            </button>
            <button class="btn btn-outline btn-lg" onclick="AthqPresentation.close()" style="border-color: #FFFFFF; color: #FFFFFF; font-weight: 700; padding: 12px 26px;">
              إغلاق العرض والعودة للمنصة
            </button>
          </div>
        </div>
      `;
    }

    modal.innerHTML = `
      <div style="position: absolute; top: 24px; left: 32px; display: flex; align-items: center; gap: 16px; z-index: 10;">
        <span style="color: #CBD5E1; font-size: 0.9rem; font-weight: 700;">الشريحة ${this.currentSlide} من ${this.totalSlides}</span>
        <button onclick="AthqPresentation.close()" style="background: rgba(255,255,255,0.15); border: none; color: #FFFFFF; width: 40px; height: 40px; border-radius: 50%; font-size: 1.2rem; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: 0.2s;" title="إغلاق العرض (Esc)">
          &times;
        </button>
      </div>

      <div style="position: absolute; top: 24px; right: 32px; display: flex; align-items: center; gap: 12px;">
        <span style="background: rgba(217,155,38,0.25); color: #F4BA44; border: 1px solid #D99B26; padding: 4px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 800;">
          <i class="fa-solid fa-lock"></i> جلسة عرض تنفيذي معتمدة
        </span>
      </div>

      <div style="width: 100%; height: 100%; display: flex; flex-direction: column; justify-content: center; padding: 60px 40px 100px 40px; box-sizing: border-box;">
        ${slideContent}
      </div>

      <!-- Bottom Controls Bar -->
      <div style="position: absolute; bottom: 24px; left: 50%; transform: translateX(-50%); display: flex; align-items: center; gap: 16px; background: rgba(0,0,0,0.4); padding: 8px 20px; border-radius: 30px; border: 1px solid rgba(255,255,255,0.15);">
        <button onclick="AthqPresentation.prev()" class="btn btn-outline btn-sm" style="border-color: rgba(255,255,255,0.3); color: #FFF; padding: 4px 12px;" ${this.currentSlide === 1 ? 'disabled style="opacity:0.4;"' : ''}>
          <i class="fa-solid fa-arrow-right"></i> السابق
        </button>
        
        <div style="display: flex; gap: 8px;">
          ${[1, 2, 3, 4].map(num => `
            <span onclick="AthqPresentation.goTo(${num})" style="width: 12px; height: 12px; border-radius: 50%; cursor: pointer; background: ${this.currentSlide === num ? '#D99B26' : 'rgba(255,255,255,0.3)'}; transition: 0.2s;"></span>
          `).join('')}
        </div>

        <button onclick="AthqPresentation.next()" class="btn btn-outline btn-sm" style="border-color: rgba(255,255,255,0.3); color: #FFF; padding: 4px 12px;" ${this.currentSlide === this.totalSlides ? 'disabled style="opacity:0.4;"' : ''}>
          التالي <i class="fa-solid fa-arrow-left"></i>
        </button>
      </div>
    `;
  }
}

window.AthqPresentation = new AthqExecutivePresentation();
window.openExecutivePresentation = () => window.AthqPresentation.open();
