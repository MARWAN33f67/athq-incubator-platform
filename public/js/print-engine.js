/**
 * حاضنة ومسرعة عذق - جمعية البر بالمدينة المنورة
 * محرك الطباعة وتوليد مستندات PDF الرسمية المعتمدة (Universal Official Print & PDF Engine)
 * يقوم بتوليد شهادات التخرج، عقود الاحتضان، تقارير الجلسات، والتقارير التنفيذية بدقة A4 وبأعلى معايير التنسيق الرسمي.
 */

class AthqPrintEngine {
  constructor() {
    this.containerId = 'athq-printable-document';
    this.modalId = 'modalPrintPreview';
  }

  // الترويسة الرسمية الموحدة لكافة المستندات
  getHeaderHtml(docTitle, docRefNumber, docDate = '') {
    const todayH = docDate || '1446/08/15هـ';
    const todayG = new Date().toLocaleDateString('ar-SA');

    return `
      <div class="print-official-header" style="border-bottom: 2px solid #0D6E46; padding-bottom: 14px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; direction: rtl;">
        <div style="text-align: right; width: 30%;">
          <img src="assets/images/bir-logo.png" style="height: 65px; width: auto; object-fit: contain; margin-bottom: 4px;">
          <div style="font-size: 0.75rem; font-weight: 800; color: #07472C;">جمعية البر بالمدينة المنورة</div>
          <div style="font-size: 0.68rem; color: #475569;">تأسست 1379هـ • ترخيص رقم (22)</div>
        </div>

        <div style="text-align: center; width: 40%;">
          <div style="font-size: 0.72rem; color: #64748B; font-weight: 700; margin-bottom: 2px;">المملكة العربية السعودية</div>
          <div style="font-size: 0.72rem; color: #64748B; font-weight: 700; margin-bottom: 6px;">المركز الوطني لتنمية القطاع غير الربحي</div>
          <h2 style="font-size: 1.25rem; font-weight: 900; color: #0D6E46; margin: 0; line-height: 1.3;">${docTitle}</h2>
          <span style="display: inline-block; background: #FEF3C7; color: #92400E; border: 1px solid #D99B26; padding: 2px 10px; border-radius: 6px; font-weight: 800; font-size: 0.7rem; margin-top: 4px;">
            وثيقة إلكترونية معتمدة رسميـاً ✓
          </span>
        </div>

        <div style="text-align: left; width: 30%; direction: ltr;">
          <img src="assets/images/athq-logo.png" style="height: 65px; width: auto; object-fit: contain; margin-bottom: 4px;">
          <div style="font-size: 0.72rem; font-weight: 800; color: #0D6E46; direction: rtl;">حاضنة ومسرعة عذق</div>
          <div style="font-size: 0.68rem; color: #475569; direction: rtl;">الرقم المرجعي: <code style="color: #0D6E46; font-weight: 700;">${docRefNumber}</code></div>
          <div style="font-size: 0.68rem; color: #475569; direction: rtl;">التاريخ: ${todayH}</div>
        </div>
      </div>
    `;
  }

  // التذييل الرسمي وصندوق الأختام والتوقيع ورمز QR
  getFooterAndSignatureHtml(firstPartyTitle = 'المشرف العام على حاضنة عذق', secondPartyTitle = 'الممثل النظامي المفوض للجمعية') {
    return `
      <div class="print-signatures-box" style="margin-top: 30px; padding-top: 16px; border-top: 1.5px dashed #CBD5E1; direction: rtl;">
        <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 20px;">
          
          <!-- الطرف الأول -->
          <div style="text-align: center; width: 30%;">
            <div style="font-size: 0.82rem; font-weight: 800; color: #1E293B; margin-bottom: 8px;">${firstPartyTitle}</div>
            <div style="font-size: 0.8rem; color: #0D6E46; font-weight: 700; margin-bottom: 8px;">د. سليمان بن إبراهيم الحربي</div>
            <div style="display: inline-block; padding: 4px 14px; border: 1.5px solid #0D6E46; background: #F0FDF4; color: #0D6E46; border-radius: 8px; font-weight: 800; font-size: 0.75rem;">
              معتمد وموقّع إلكترونياً ✓
            </div>
          </div>

          <!-- الختم الرسمي ورمز QR -->
          <div style="text-align: center; width: 35%;">
            <div style="display: inline-flex; flex-direction: column; align-items: center; justify-content: center; width: 100px; height: 100px; border: 2.5px solid #D99B26; border-radius: 50%; color: #92400E; background: #FFFDF5; margin-bottom: 4px; box-shadow: 0 0 0 3px rgba(217,155,38,0.2);">
              <i class="fa-solid fa-stamp" style="font-size: 1.3rem; margin-bottom: 2px;"></i>
              <span style="font-size: 0.62rem; font-weight: 900; line-height: 1.2;">ختم المنظومة</span>
              <span style="font-size: 0.58rem; font-weight: 700;">جمعية البر بالمدينة</span>
            </div>
            <div style="font-size: 0.65rem; color: #64748B;">الرمز الوطني المعتمد (22)</div>
          </div>

          <!-- الطرف الثاني -->
          <div style="text-align: center; width: 30%;">
            <div style="font-size: 0.82rem; font-weight: 800; color: #1E293B; margin-bottom: 8px;">${secondPartyTitle}</div>
            <div style="font-size: 0.8rem; color: #0D6E46; font-weight: 700; margin-bottom: 8px;">م. عبدالله بن حمد الحربي</div>
            <div style="display: inline-block; padding: 4px 14px; border: 1.5px solid #0D6E46; background: #F0FDF4; color: #0D6E46; border-radius: 8px; font-weight: 800; font-size: 0.75rem;">
              تم التوقيع والمطابقة ✓
            </div>
          </div>
        </div>

        <!-- شريط الباركود والتذييل الأمني -->
        <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 10px 16px; display: flex; justify-content: space-between; align-items: center;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="background: #FFFFFF; border: 1px solid #CBD5E1; padding: 4px; border-radius: 6px; display: flex; align-items: center; justify-content: center;">
              <!-- Simulated QR SVG -->
              <svg width="42" height="42" viewBox="0 0 33 33" fill="#0D6E46">
                <rect x="0" y="0" width="9" height="9" fill="#0D6E46"/>
                <rect x="2" y="2" width="5" height="5" fill="#FFFFFF"/>
                <rect x="24" y="0" width="9" height="9" fill="#0D6E46"/>
                <rect x="26" y="2" width="5" height="5" fill="#FFFFFF"/>
                <rect x="0" y="24" width="9" height="9" fill="#0D6E46"/>
                <rect x="2" y="26" width="5" height="5" fill="#FFFFFF"/>
                <rect x="12" y="4" width="3" height="3" fill="#0D6E46"/>
                <rect x="16" y="8" width="4" height="4" fill="#0D6E46"/>
                <rect x="12" y="16" width="8" height="8" fill="#0D6E46"/>
                <rect x="24" y="14" width="6" height="6" fill="#0D6E46"/>
              </svg>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 0.72rem; font-weight: 800; color: #1E293B;">رمز التوثيق الإلكتروني المعتمد (NCNP-VERIFY)</div>
              <div style="font-size: 0.65rem; color: #64748B;">امسح الرمز أو زر: athq.biralmadinah.org.sa/verify للتحقق من صحة الوثيقة.</div>
            </div>
          </div>
          <div style="font-size: 0.68rem; color: #64748B; text-align: left;">
            <div>المدينة المنورة - حي الأصيفرين</div>
            <div>ethq@biralmadinah.org.sa</div>
          </div>
        </div>
      </div>
    `;
  }

  // 1. توليد وطباعة شهادة التخرج والاحتضان الرسمية الفاخرة (Certificate)
  printGraduationCertificate(assocName = 'جمعية ديوان الشبابية', lic = '1842') {
    const ref = `ATHQ-CERT-1446-${Math.floor(100 + Math.random() * 900)}`;

    const content = `
      <div class="certificate-paper" style="border: 6px double #D99B26; padding: 36px 30px; border-radius: 14px; background: #FCFDFD; position: relative; overflow: hidden; direction: rtl;">
        <!-- Watermark -->
        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); opacity: 0.04; pointer-events: none; width: 450px;">
          <img src="assets/images/athq-logo.png" style="width: 100%;">
        </div>

        ${this.getHeaderHtml('شهادة تخرج واحتضان مؤسسي معتمد', ref)}

        <div style="text-align: center; padding: 20px 10px;">
          <div style="font-size: 1.1rem; color: #64748B; margin-bottom: 12px; font-weight: 700;">تشهد حاضنة ومسرعة عذق بجمعية البر بالمدينة المنورة بأن:</div>
          
          <div style="font-size: 2.1rem; font-weight: 900; color: #0D6E46; margin-bottom: 6px; text-decoration: underline; text-decoration-color: #D99B26; text-underline-offset: 8px;">
            « ${assocName} »
          </div>
          <div style="font-size: 0.95rem; color: #475569; margin-bottom: 24px; font-weight: 700;">
            مسجلة بالمركز الوطني لتنمية القطاع غير الربحي بترخيص رقم: (<strong>${lic}</strong>)
          </div>

          <div style="font-size: 1.05rem; color: #1E293B; line-height: 1.9; max-width: 720px; margin: 0 auto 28px auto;">
            قد أتمت بنجاح واقتدار كافة متطلبات <strong>مسارات الاحتضان الخمسة ومسرعة عذق</strong>، واستوفت مؤشرات الأداء ومعايير الحوكمة والشفافية بنسبة امتثال بلغت (<strong style="color: #0D6E46;">92%</strong>)، وسجلت (<strong style="color: #0D6E46;">+1,624 ساعة عمل</strong>) و(<strong style="color: #0D6E46;">+197 ساعة تطوعية معتمدة</strong>). وبناءً عليه، مُنحت هذه الشهادة تزكيةً لجاهزيتها المؤسسية والاستدامة المالية.
          </div>

          <!-- جدول مخرجات الاحتضان المعتمدة -->
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 0.82rem; text-align: center;">
            <thead>
              <tr style="background: #F1F5F9; color: #0D6E46;">
                <th style="padding: 8px; border: 1px solid #CBD5E1;">مسار الحوكمة وبناء اللوائح</th>
                <th style="padding: 8px; border: 1px solid #CBD5E1;">مسار التمكين المؤسسي</th>
                <th style="padding: 8px; border: 1px solid #CBD5E1;">التأهيل والتدريب</th>
                <th style="padding: 8px; border: 1px solid #CBD5E1;">الاستشارات المنجزة</th>
                <th style="padding: 8px; border: 1px solid #CBD5E1;">النتيجة والاعتماد</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="padding: 8px; border: 1px solid #CBD5E1; color: #166534; font-weight: 700;">مستوفى بنجاح ✓</td>
                <td style="padding: 8px; border: 1px solid #CBD5E1; color: #166534; font-weight: 700;">مستوفى بنجاح ✓</td>
                <td style="padding: 8px; border: 1px solid #CBD5E1; color: #166534; font-weight: 700;">مستوفى بنجاح ✓</td>
                <td style="padding: 8px; border: 1px solid #CBD5E1; font-weight: 700;">28 جلسة تخصصية</td>
                <td style="padding: 8px; border: 1px solid #CBD5E1; background: #DCFCE7; color: #166534; font-weight: 900;">متخرجة ومعتمدة ✓</td>
              </tr>
            </tbody>
          </table>
        </div>

        ${this.getFooterAndSignatureHtml('المشرف العام على عذق', 'رئيس مجلس إدارة جمعية البر')}
      </div>
    `;

    this.showPrintPreview(content, `شهادة_تخرج_${assocName.replace(/\s+/g, '_')}`);
  }

  // 2. توليد وطباعة عقد الاحتضان الرسمي الموحد (Contract)
  printOfficialContract(assocName = 'جمعية ديوان الشبابية', lic = '1842', rep = 'م. عبدالله الحربي') {
    const ref = `ATHQ-CNT-1446-${Math.floor(1000 + Math.random() * 9000)}`;

    const content = `
      <div class="contract-paper" style="border: 2px solid #CBD5E1; padding: 30px; border-radius: 12px; background: #FFFFFF; direction: rtl; font-size: 0.88rem; line-height: 1.8;">
        ${this.getHeaderHtml('عقد احتضان وتمكين منظمة أهلية ناشئة', ref)}

        <div style="background: #F8FAFC; border: 1px solid #E2E8F0; padding: 12px 16px; border-radius: 8px; margin-bottom: 16px;">
          بعون الله تعالى وتوفيقه، تم إبرام هذا العقد بين كل من:
          <ul style="margin: 6px 0 0 0; padding-right: 20px;">
            <li><strong>الطرف الأول:</strong> حاضنة ومسرعة عذق للجمعيات الأهلية - جمعية البر بالمدينة المنورة (ترخيص 22).</li>
            <li><strong>الطرف الثاني:</strong> <strong style="color: #0D6E46;">${assocName}</strong>، ترخيص رقم (<strong>${lic}</strong>)، ويمثلها المفوض النظامي: <strong>${rep}</strong>.</li>
          </ul>
        </div>

        <h4 style="font-size: 0.95rem; font-weight: 800; color: #0D6E46; margin: 14px 0 6px 0;">البنود والالتزامات التعاقدية المعتمدة:</h4>
        <ol style="padding-right: 20px; margin-bottom: 18px;">
          <li><strong>تخصيص المقر والمرافق:</strong> يلتزم الطرف الأول بتخصيص مقر إداري مجهز (المكتب رقم 4) بالإضافة إلى الاستفادة من قاعات الاجتماعات والتدريب ومساحات العمل المشتركة.</li>
          <li><strong>الخدمات اللوجستية والاستشارية:</strong> يلتزم الطرف الأول بتقديم العنوان الوطني المعتمد، والربط المحاسبي السحابي، وتقديم جلسات استشارية دورية في الحوكمة وتنمية الموارد المالية.</li>
          <li><strong>التزامات الجمعية المحتضنة:</strong> يلتزم الطرف الثاني بتسجيل موظف متفرغ بدوام كامل لمتابعة أعمال الجمعية داخل الحاضنة، والالتزام بلائحة الأمان وساعات الدوام المعتمدة.</li>
          <li><strong>مدة الاحتضان:</strong> مدة هذا العقد (12 شهراً) تبدأ من تاريخ توقيع واستلام المقر، قابلة للتجديد بموافقة إدارة الحاضنة وفق مؤشرات الإنجاز.</li>
        </ol>

        <h4 style="font-size: 0.95rem; font-weight: 800; color: #0D6E46; margin: 14px 0 6px 0;">جدول استلام العهد والتجهيزات:</h4>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 0.8rem;">
          <tr style="background: #F1F5F9;">
            <th style="padding: 6px 10px; border: 1px solid #CBD5E1; text-align: right;">البند والمرفق</th>
            <th style="padding: 6px 10px; border: 1px solid #CBD5E1; text-align: center;">الحالة الفنية</th>
            <th style="padding: 6px 10px; border: 1px solid #CBD5E1; text-align: center;">تاريخ الاستلام</th>
            <th style="padding: 6px 10px; border: 1px solid #CBD5E1; text-align: center;">ملاحظات الاعتماد</th>
          </tr>
          <tr>
            <td style="padding: 6px 10px; border: 1px solid #CBD5E1;">مقر مكتبي مستقل (المكتب المجهز 4)</td>
            <td style="padding: 6px 10px; border: 1px solid #CBD5E1; text-align: center; color: #166534; font-weight: 700;">جاهز ومؤثث ✓</td>
            <td style="padding: 6px 10px; border: 1px solid #CBD5E1; text-align: center;">1446/08/15هـ</td>
            <td style="padding: 6px 10px; border: 1px solid #CBD5E1; text-align: center;">مفتاح ذكي + بصمة دخول</td>
          </tr>
          <tr>
            <td style="padding: 6px 10px; border: 1px solid #CBD5E1;">حزمة البرامج الاستشارية والحوكمة</td>
            <td style="padding: 6px 10px; border: 1px solid #CBD5E1; text-align: center; color: #166534; font-weight: 700;">مفعلة بالكامل ✓</td>
            <td style="padding: 6px 10px; border: 1px solid #CBD5E1; text-align: center;">1446/08/15هـ</td>
            <td style="padding: 6px 10px; border: 1px solid #CBD5E1; text-align: center;">إشراف مستشار حوكمة معتمد</td>
          </tr>
        </table>

        ${this.getFooterAndSignatureHtml('الطرف الأول (إدارة حاضنة عذق)', `الطرف الثاني (${rep})`)}
      </div>
    `;

    this.showPrintPreview(content, `عقد_احتضان_${assocName.replace(/\s+/g, '_')}`);
  }

  // 3. توليد وطباعة التقرير التنفيذي الشامل للإدارة (Executive Report)
  printExecutiveReport() {
    const ref = `ATHQ-EXEC-1446-${Math.floor(100 + Math.random() * 900)}`;

    const content = `
      <div class="report-paper" style="border: 2px solid #CBD5E1; padding: 28px; border-radius: 12px; background: #FFFFFF; direction: rtl; font-size: 0.86rem; line-height: 1.7;">
        ${this.getHeaderHtml('التقرير التنفيذي الشامل للأداء ومؤشرات الأثر', ref)}

        <!-- الإحصائيات والأرقام المعتمدة -->
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 20px; text-align: center;">
          <div style="background: #F0FDF4; border: 1px solid #86EFAC; padding: 12px 8px; border-radius: 8px;">
            <div style="font-size: 1.6rem; font-weight: 900; color: #166534;">+16,311</div>
            <div style="font-size: 0.75rem; font-weight: 700; color: #1E293B;">ساعة تطوعية معتمدة</div>
          </div>
          <div style="background: #FEF3C7; border: 1px solid #FDE68A; padding: 12px 8px; border-radius: 8px;">
            <div style="font-size: 1.6rem; font-weight: 900; color: #92400E;">+4,470</div>
            <div style="font-size: 0.75rem; font-weight: 700; color: #1E293B;">ساعة عمل بالحاضنة</div>
          </div>
          <div style="background: #E0F2FE; border: 1px solid #BAE6FD; padding: 12px 8px; border-radius: 8px;">
            <div style="font-size: 1.6rem; font-weight: 900; color: #075985;">15</div>
            <div style="font-size: 0.75rem; font-weight: 700; color: #1E293B;">جهة محتضنة حالياً</div>
          </div>
          <div style="background: #F1F5F9; border: 1px solid #CBD5E1; padding: 12px 8px; border-radius: 8px;">
            <div style="font-size: 1.6rem; font-weight: 900; color: #334155;">7</div>
            <div style="font-size: 0.75rem; font-weight: 700; color: #1E293B;">جهات متخرجة بنجاح</div>
          </div>
        </div>

        <h4 style="font-size: 0.95rem; font-weight: 800; color: #0D6E46; margin: 16px 0 8px 0;">قائمة الجهات المحتضنة المعتمدة ونسب الإنجاز:</h4>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 0.8rem;">
          <thead>
            <tr style="background: #F8FAFC; color: #1E293B;">
              <th style="padding: 7px 10px; border: 1px solid #CBD5E1; text-align: right;">الجهة / الجمعية</th>
              <th style="padding: 7px 10px; border: 1px solid #CBD5E1; text-align: center;">الترخيص</th>
              <th style="padding: 7px 10px; border: 1px solid #CBD5E1; text-align: right;">المسار التنموي</th>
              <th style="padding: 7px 10px; border: 1px solid #CBD5E1; text-align: center;">ساعات العمل</th>
              <th style="padding: 7px 10px; border: 1px solid #CBD5E1; text-align: center;">ساعات التطوع</th>
              <th style="padding: 7px 10px; border: 1px solid #CBD5E1; text-align: center;">الحالة</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 7px 10px; border: 1px solid #CBD5E1; font-weight: 700;">وقف العمل الصالح</td>
              <td style="padding: 7px 10px; border: 1px solid #CBD5E1; text-align: center;">1530</td>
              <td style="padding: 7px 10px; border: 1px solid #CBD5E1;">مسار البناء والتمكين المؤسسي</td>
              <td style="padding: 7px 10px; border: 1px solid #CBD5E1; text-align: center;">+360 س</td>
              <td style="padding: 7px 10px; border: 1px solid #CBD5E1; text-align: center;">+70 س</td>
              <td style="padding: 7px 10px; border: 1px solid #CBD5E1; text-align: center; color: #166534; font-weight: 800;">محتضنة ✓</td>
            </tr>
            <tr>
              <td style="padding: 7px 10px; border: 1px solid #CBD5E1; font-weight: 700;">جمعية ديوان الشبابية</td>
              <td style="padding: 7px 10px; border: 1px solid #CBD5E1; text-align: center;">1842</td>
              <td style="padding: 7px 10px; border: 1px solid #CBD5E1;">مسار الحوكمة والتمكين الشامل</td>
              <td style="padding: 7px 10px; border: 1px solid #CBD5E1; text-align: center;">+1,624 س</td>
              <td style="padding: 7px 10px; border: 1px solid #CBD5E1; text-align: center;">+197 س</td>
              <td style="padding: 7px 10px; border: 1px solid #CBD5E1; text-align: center; color: #166534; font-weight: 800;">محتضنة ✓</td>
            </tr>
            <tr>
              <td style="padding: 7px 10px; border: 1px solid #CBD5E1; font-weight: 700;">جمعية التنمية الرياضية</td>
              <td style="padding: 7px 10px; border: 1px solid #CBD5E1; text-align: center;">1920</td>
              <td style="padding: 7px 10px; border: 1px solid #CBD5E1;">مسار التأهيل والتدريب المتخصص</td>
              <td style="padding: 7px 10px; border: 1px solid #CBD5E1; text-align: center;">+120 س</td>
              <td style="padding: 7px 10px; border: 1px solid #CBD5E1; text-align: center;">+1,240 س</td>
              <td style="padding: 7px 10px; border: 1px solid #CBD5E1; text-align: center; color: #166534; font-weight: 800;">محتضنة ✓</td>
            </tr>
            <tr>
              <td style="padding: 7px 10px; border: 1px solid #CBD5E1; font-weight: 700;">الجمعية الفلكية بالمدينة</td>
              <td style="padding: 7px 10px; border: 1px solid #CBD5E1; text-align: center;">1680</td>
              <td style="padding: 7px 10px; border: 1px solid #CBD5E1;">مسار الابتكار وتطوير المبادرات</td>
              <td style="padding: 7px 10px; border: 1px solid #CBD5E1; text-align: center;">+180 س</td>
              <td style="padding: 7px 10px; border: 1px solid #CBD5E1; text-align: center;">+95 س</td>
              <td style="padding: 7px 10px; border: 1px solid #CBD5E1; text-align: center; color: #166534; font-weight: 800;">محتضنة ✓</td>
            </tr>
          </tbody>
        </table>

        ${this.getFooterAndSignatureHtml('مدير الرقابة والامتثال', 'رئيس المجلس التنفيذي')}
      </div>
    `;

    this.showPrintPreview(content, `التقرير_التنفيذي_الشامل_لحاضنة_عذق`);
  }

  // 4. توليد وطباعة تقرير الجلسة الاستشارية والتوصيات (Consultation Report)
  printConsultationReport(assocName = 'جمعية ديوان الشبابية', consultantName = 'د. سليمان الحربي', field = 'حوكمة المنظمات وبناء مصفوفة الصلاحيات') {
    const ref = `ATHQ-CNS-1446-${Math.floor(100 + Math.random() * 900)}`;

    const content = `
      <div class="consultation-paper" style="border: 2px solid #CBD5E1; padding: 28px; border-radius: 12px; background: #FFFFFF; direction: rtl; font-size: 0.88rem; line-height: 1.8;">
        ${this.getHeaderHtml('تقرير جلسة استشارية وتوصيات التطوير المؤسسي', ref)}

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 0.85rem;">
          <tr style="background: #F8FAFC;">
            <td style="padding: 8px 12px; border: 1px solid #CBD5E1; width: 25%; font-weight: 800; color: #0D6E46;">الجهة المستفيدة:</td>
            <td style="padding: 8px 12px; border: 1px solid #CBD5E1; width: 25%; font-weight: 700;">${assocName}</td>
            <td style="padding: 8px 12px; border: 1px solid #CBD5E1; width: 25%; font-weight: 800; color: #0D6E46;">المستشار الخبير:</td>
            <td style="padding: 8px 12px; border: 1px solid #CBD5E1; width: 25%; font-weight: 700;">${consultantName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 12px; border: 1px solid #CBD5E1; font-weight: 800; color: #0D6E46;">مجال الاستشارة:</td>
            <td style="padding: 8px 12px; border: 1px solid #CBD5E1;" colspan="3"><strong>${field}</strong></td>
          </tr>
          <tr style="background: #F8FAFC;">
            <td style="padding: 8px 12px; border: 1px solid #CBD5E1; font-weight: 800; color: #0D6E46;">تاريخ وتوقيت الجلسة:</td>
            <td style="padding: 8px 12px; border: 1px solid #CBD5E1;">1446/08/15هـ (10:00 ص - 12:00 م)</td>
            <td style="padding: 8px 12px; border: 1px solid #CBD5E1; font-weight: 800; color: #0D6E46;">مقر الانعقاد:</td>
            <td style="padding: 8px 12px; border: 1px solid #CBD5E1;">القاعة الاستشارية الأولى (حضوري)</td>
          </tr>
        </table>

        <h4 style="font-size: 0.95rem; font-weight: 800; color: #0D6E46; margin: 16px 0 6px 0;">محاور النقاش والتشخيص المؤسسي:</h4>
        <ul style="padding-right: 20px; margin-bottom: 16px;">
          <li>مراجعة الهيكل التنظيمي للجمعية ومطابقته مع دليل الحوكمة الإلزامي الصادر من المركز الوطني.</li>
          <li>تحديد فجوات الصلاحيات المالية والإدارية بين مجلس الإدارة والإدارة التنفيذية.</li>
          <li>تدقيق سياسة الإفصاح والتعارض في المصالح وتفعيل لجان المراجعة الداخلية.</li>
        </ul>

        <h4 style="font-size: 0.95rem; font-weight: 800; color: #0D6E46; margin: 16px 0 6px 0;">التوصيات وخطة العمل المعتمدة:</h4>
        <ol style="padding-right: 20px; margin-bottom: 24px;">
          <li>تحديث اللائحة الأساسية واعتماد جدول الصلاحيات في اجتماع الجمعية العمومية القادم.</li>
          <li>رفع نسبة الامتثال في معيار السلامة المالية من (82%) إلى (92%) خلال شهرين.</li>
          <li>إسناد إعداد الخطة التشغيلية لعام 2025 إلى الفريق المفرغ بمكتب الحاضنة.</li>
        </ol>

        <div style="background: #F0FDF4; border: 1px solid #86EFAC; padding: 10px 16px; border-radius: 8px; font-weight: 800; color: #166534; font-size: 0.8rem; margin-bottom: 20px;">
          ✓ تم توثيق (ساعتان استشاريتان وتطوعيتان) في رصيد المستشار عبر المنصة الوطنية للعمل التطوعي.
        </div>

        ${this.getFooterAndSignatureHtml(`المستشار الخبير (${consultantName})`, `ممثل الجهة المستفيدة (${assocName})`)}
      </div>
    `;

    this.showPrintPreview(content, `تقرير_استشارة_${assocName.replace(/\s+/g, '_')}`);
  }

  // 5. توليد وطباعة بطاقة تصريح حجز قاعة / مرفق (Booking Pass)
  printBookingPass(assocName = 'جمعية ديوان الشبابية', facilityName = 'قاعة الاجتماعات الكبرى الذكية', bookingDate = '1446/08/20هـ', bookingTime = '10:00 ص - 12:00 م') {
    const ref = `ATHQ-BKG-${Math.floor(100 + Math.random() * 900)}`;

    const content = `
      <div class="booking-paper" style="border: 2px solid #CBD5E1; padding: 28px; border-radius: 12px; background: #FFFFFF; direction: rtl; font-size: 0.88rem; line-height: 1.8;">
        ${this.getHeaderHtml('بطاقة تصريح حجز مرفق وقاعة بالحاضنة', ref)}

        <div style="text-align: center; margin-bottom: 20px;">
          <span style="background: #DCFCE7; color: #166534; padding: 4px 14px; border-radius: 20px; font-weight: 800; font-size: 0.85rem; border: 1px solid #86EFAC;">
            حجز مؤكد ومجدول رسمياً ✓
          </span>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 0.85rem;">
          <tr style="background: #F8FAFC;">
            <td style="padding: 10px 14px; border: 1px solid #CBD5E1; width: 30%; font-weight: 800; color: #0D6E46;">اسم الجهة المحتضنة:</td>
            <td style="padding: 10px 14px; border: 1px solid #CBD5E1; font-weight: 800;">${assocName}</td>
          </tr>
          <tr>
            <td style="padding: 10px 14px; border: 1px solid #CBD5E1; font-weight: 800; color: #0D6E46;">المرفق المحجوز:</td>
            <td style="padding: 10px 14px; border: 1px solid #CBD5E1; font-weight: 800; color: #0D6E46;">${facilityName}</td>
          </tr>
          <tr style="background: #F8FAFC;">
            <td style="padding: 10px 14px; border: 1px solid #CBD5E1; font-weight: 800; color: #0D6E46;">تاريخ وتوقيت الاستخدام:</td>
            <td style="padding: 10px 14px; border: 1px solid #CBD5E1;"><strong>${bookingDate}</strong> | <strong>${bookingTime}</strong></td>
          </tr>
          <tr>
            <td style="padding: 10px 14px; border: 1px solid #CBD5E1; font-weight: 800; color: #0D6E46;">التجهيزات الفنية المشمولة:</td>
            <td style="padding: 10px 14px; border: 1px solid #CBD5E1;">شاشات عرض ذكية، نظام صوتي لاسلكي، ضيافة كاملة، إنترنت عالي السرعة.</td>
          </tr>
        </table>

        <div style="background: #FEF3C7; border: 1px solid #FDE68A; padding: 12px 16px; border-radius: 8px; color: #92400E; font-size: 0.8rem; margin-bottom: 20px;">
          <strong>إرشادات الاستخدام:</strong> يرجى الحضور قبل الموعد بـ 15 دقيقة، وإبراز هذا التصريح عند بوابة الدخول أو عبر قارئ الباركود الذكي بمقر الحاضنة.
        </div>

        ${this.getFooterAndSignatureHtml('مسؤول المرافق والتجهيزات', 'ممثل الجهة الطالبة')}
      </div>
    `;

    this.showPrintPreview(content, `تصريح_حجز_${facilityName.replace(/\s+/g, '_')}`);
  }

  // 6. توليد وطباعة إشعار وسند استلام طلب احتضان (Application Receipt)
  printApplicationReceipt(assocName = 'جمعية روافد التنموية', track = 'مسار الحوكمة والتمكين الشامل', appId = 'ATHQ-2025-018') {
    const ref = appId || `ATHQ-APP-1446-${Math.floor(100 + Math.random() * 900)}`;

    const content = `
      <div class="booking-paper" style="border: 2px solid #CBD5E1; padding: 28px; border-radius: 12px; background: #FFFFFF; direction: rtl; font-size: 0.88rem; line-height: 1.8;">
        ${this.getHeaderHtml('إشعار استلام وقيد طلب احتضان وتسجيل رسمي', ref)}

        <div style="text-align: center; margin-bottom: 20px;">
          <span style="background: #E0F2FE; color: #0369A1; padding: 4px 16px; border-radius: 20px; font-weight: 800; font-size: 0.88rem; border: 1px solid #BAE6FD;">
            تم استلام الطلب وتوثيقه بنجاح في سجلات الحاضنة ✓
          </span>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 0.85rem;">
          <tr style="background: #F8FAFC;">
            <td style="padding: 10px 14px; border: 1px solid #CBD5E1; width: 30%; font-weight: 800; color: #0D6E46;">رقم الطلب الرسمي:</td>
            <td style="padding: 10px 14px; border: 1px solid #CBD5E1; font-weight: 900; color: #0D6E46; font-size: 1rem;">${ref}</td>
          </tr>
          <tr>
            <td style="padding: 10px 14px; border: 1px solid #CBD5E1; font-weight: 800; color: #0D6E46;">اسم المنظمة المتقدمة:</td>
            <td style="padding: 10px 14px; border: 1px solid #CBD5E1; font-weight: 800;">${assocName}</td>
          </tr>
          <tr style="background: #F8FAFC;">
            <td style="padding: 10px 14px; border: 1px solid #CBD5E1; font-weight: 800; color: #0D6E46;">المسار التنموي المختار:</td>
            <td style="padding: 10px 14px; border: 1px solid #CBD5E1; font-weight: 700;">${track}</td>
          </tr>
          <tr>
            <td style="padding: 10px 14px; border: 1px solid #CBD5E1; font-weight: 800; color: #0D6E46;">الجهة المشرفة والضامنة:</td>
            <td style="padding: 10px 14px; border: 1px solid #CBD5E1;">جمعية البر بالمدينة المنورة • المركز الوطني لتنمية القطاع غير الربحي</td>
          </tr>
        </table>

        <div style="background: #F0FDF4; border: 1px solid #86EFAC; padding: 14px 18px; border-radius: 10px; margin-bottom: 20px;">
          <h4 style="margin: 0 0 6px 0; color: #166534; font-size: 0.9rem; font-weight: 800;">الإجراءات القادمة ومراحل الفرز المعتمدة:</h4>
          <ol style="margin: 0; padding-right: 20px; font-size: 0.82rem; color: #1E293B; line-height: 1.7;">
            <li>مراجعة الوثائق المرفقة ومطابقة ترخيص المركز الوطني خلال 48 ساعة عمل.</li>
            <li>التواصل المباشر مع ممثل الجمعية لتحديد موعد جلسة التهيئة والمقابلة الميدانية.</li>
            <li>تقديم اختبار الانطلاقة الأولى وتوقيع اتفاقية الاحتضان وتخصيص المقر المكتبي.</li>
          </ol>
        </div>

        ${this.getFooterAndSignatureHtml('لجنة الفرز والقبول المركزية', 'الممثل النظامي للجهة المتقدمة')}
      </div>
    `;

    this.showPrintPreview(content, `إشعار_تقديم_${assocName.replace(/\s+/g, '_')}`);
  }

  // 7. توليد وطباعة تذكرة موعد استشاري (Consultation Ticket)
  printConsultationTicket(assocName = 'جمعية ديوان الشبابية', consultantName = 'د. سليمان الحربي', date = '1446/08/25هـ', time = '10:00 ص') {
    const ref = `ATHQ-TCK-${Math.floor(100 + Math.random() * 900)}`;

    const content = `
      <div class="booking-paper" style="border: 2px solid #CBD5E1; padding: 28px; border-radius: 12px; background: #FFFFFF; direction: rtl; font-size: 0.88rem; line-height: 1.8;">
        ${this.getHeaderHtml('تذكرة موعد جلسة استشارية وتطوير مؤسسي', ref)}

        <div style="text-align: center; margin-bottom: 20px;">
          <span style="background: #DCFCE7; color: #166534; padding: 4px 16px; border-radius: 20px; font-weight: 800; font-size: 0.88rem; border: 1px solid #86EFAC;">
            موعد مؤكد ومحجوز في جدول المستشار ✓
          </span>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 0.85rem;">
          <tr style="background: #F8FAFC;">
            <td style="padding: 10px 14px; border: 1px solid #CBD5E1; width: 30%; font-weight: 800; color: #0D6E46;">الجمعية المستفيدة:</td>
            <td style="padding: 10px 14px; border: 1px solid #CBD5E1; font-weight: 800;">${assocName}</td>
          </tr>
          <tr>
            <td style="padding: 10px 14px; border: 1px solid #CBD5E1; font-weight: 800; color: #0D6E46;">المستشار الخبير:</td>
            <td style="padding: 10px 14px; border: 1px solid #CBD5E1; font-weight: 800; color: #0D6E46;">${consultantName}</td>
          </tr>
          <tr style="background: #F8FAFC;">
            <td style="padding: 10px 14px; border: 1px solid #CBD5E1; font-weight: 800; color: #0D6E46;">تاريخ وتوقيت الجلسة:</td>
            <td style="padding: 10px 14px; border: 1px solid #CBD5E1;"><strong>${date}</strong> | <strong>${time}</strong></td>
          </tr>
          <tr>
            <td style="padding: 10px 14px; border: 1px solid #CBD5E1; font-weight: 800; color: #0D6E46;">طبيعة ومقر الجلسة:</td>
            <td style="padding: 10px 14px; border: 1px solid #CBD5E1;">حضوري بمقر حاضنة عذق (قاعة الاستشارات التخصصية) أو افتراضياً عبر الربط المباشر.</td>
          </tr>
        </table>

        ${this.getFooterAndSignatureHtml('منسق الجلسات والاستشارات', 'ممثل الجمعية المستفيدة')}
      </div>
    `;

    this.showPrintPreview(content, `تذكرة_موعد_${assocName.replace(/\s+/g, '_')}`);
  }

  // 8. توليد وطباعة بطاقة الأثر المؤسسي (Impact Dossier Card)
  printOrgImpactCard(orgName = 'جمعية ديوان الشبابية', track = 'مسار الحوكمة والتمكين الشامل', score = 92, metrics = {}) {
    const ref = `ATHQ-IMP-${Math.floor(100 + Math.random() * 900)}`;

    const content = `
      <div class="report-paper" style="border: 2px solid #CBD5E1; padding: 28px; border-radius: 12px; background: #FFFFFF; direction: rtl; font-size: 0.88rem; line-height: 1.8;">
        ${this.getHeaderHtml('بطاقة قياس الأثر والجاهزية المؤسسية', ref)}

        <div style="background: #F8FAFC; border: 1.5px solid #E2E8F0; padding: 18px; border-radius: 12px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <h3 style="margin: 0 0 6px 0; color: #0D6E46; font-size: 1.25rem; font-weight: 900;">${orgName}</h3>
            <div style="font-size: 0.85rem; color: #64748B;">${track}</div>
          </div>
          <div style="text-align: center; background: #DCFCE7; border: 2px solid #16A34A; padding: 10px 20px; border-radius: 12px;">
            <div style="font-size: 1.8rem; font-weight: 900; color: #166534;">${score}%</div>
            <div style="font-size: 0.72rem; font-weight: 800; color: #166534;">مؤشر الامتثال المؤسسي</div>
          </div>
        </div>

        <h4 style="font-size: 0.95rem; font-weight: 800; color: #0D6E46; margin: 16px 0 8px 0;">المؤشرات التراكمية وساعات العطاء المعتمدة:</h4>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 20px; text-align: center;">
          <div style="background: #F0FDF4; border: 1px solid #86EFAC; padding: 14px; border-radius: 8px;">
            <div style="font-size: 1.5rem; font-weight: 900; color: #166534;">+1,624</div>
            <div style="font-size: 0.78rem; font-weight: 700; color: #1E293B;">ساعة عمل بالحاضنة</div>
          </div>
          <div style="background: #FEF3C7; border: 1px solid #FDE68A; padding: 14px; border-radius: 8px;">
            <div style="font-size: 1.5rem; font-weight: 900; color: #92400E;">+197</div>
            <div style="font-size: 0.78rem; font-weight: 700; color: #1E293B;">ساعة تطوع موثقة</div>
          </div>
          <div style="background: #E0F2FE; border: 1px solid #BAE6FD; padding: 14px; border-radius: 8px;">
            <div style="font-size: 1.5rem; font-weight: 900; color: #075985;">28</div>
            <div style="font-size: 0.78rem; font-weight: 700; color: #1E293B;">جلسة استشارية منجزة</div>
          </div>
        </div>

        <div style="background: #F1F5F9; border: 1px solid #CBD5E1; padding: 14px; border-radius: 8px; margin-bottom: 20px; font-size: 0.84rem;">
          <strong>حالة المطابقة النظامية:</strong>
          <span style="color: #166534; font-weight: 800;"> مستوفية لمعايير المركز الوطني لتنمية القطاع غير الربحي (NCNP) • لائحة أساسية معتمدة • عنوان وطني مفعل • نظام محاسبي سحابي نشط.</span>
        </div>

        ${this.getFooterAndSignatureHtml('مشرف الرقابة وقياس الأثر', 'الممثل النظامي للجمعية')}
      </div>
    `;

    this.showPrintPreview(content, `بطاقة_أثر_${orgName.replace(/\s+/g, '_')}`);
  }

  // 9. توليد وطباعة تقرير الأثر ونسبة التقدم من شهر لآخر (Month-over-Month Impact & Progress Report)
  printMonthlyImpactAndProgressReport(targetMonth = 'ربيع الأول 1446هـ', compareMonth = 'صفر 1446هـ', filterMode = 'all') {
    const ref = `ATHQ-MOM-1446-${Math.floor(100 + Math.random() * 900)}`;

    const reportData = [
      {
        name: "وقف العمل الصالح", lic: "1530", mode: "accelerator", modeLabel: "مسرعة أعمال",
        prevProgress: 75, currProgress: 90, momChange: "+15.0%",
        beneficiaries: "1,200", volHours: "+70 س", funding: "350,000 ر.س", compliance: "95%",
        note: "توسيع الاستدامة المالية وتوقيع 3 شراكات مانحة."
      },
      {
        name: "جمعية ديوان الشبابية", lic: "1842", mode: "spatial", modeLabel: "احتضان مكاني",
        prevProgress: 58, currProgress: 76, momChange: "+18.0%",
        beneficiaries: "3,400", volHours: "+197 س", funding: "520,000 ر.س", compliance: "92%",
        note: "استكمال 4 لوائح حوكمة وتجهيز المكتب رقم 4."
      },
      {
        name: "جمعية همم الشبابية", lic: "2104", mode: "idea", modeLabel: "فكرة ومبادرة",
        prevProgress: 30, currProgress: 52, momChange: "+22.0%",
        beneficiaries: "450", volHours: "+30 س", funding: "85,000 ر.س", compliance: "84%",
        note: "صياغة المبادرة والتهيئة لاستكمال مسوغات التأسيس."
      },
      {
        name: "جمعية التنمية الرياضية", lic: "1920", mode: "spatial", modeLabel: "احتضان مكاني",
        prevProgress: 60, currProgress: 74, momChange: "+14.0%",
        beneficiaries: "2,100", volHours: "+1,240 س", funding: "210,000 ر.س", compliance: "88%",
        note: "تفعيل المتطوعين وإطلاق دوري الأحياء المجتمعي."
      },
      {
        name: "الجمعية الفلكية بالمدينة", lic: "1680", mode: "spatial", modeLabel: "احتضان مكاني",
        prevProgress: 65, currProgress: 78, momChange: "+13.0%",
        beneficiaries: "1,800", volHours: "+95 س", funding: "140,000 ر.س", compliance: "90%",
        note: "شراكة مع المركز الوطني لتطوير رصد الأهلة."
      },
      {
        name: "جمعية إرشاد التنموية", lic: "1322", mode: "accelerator", modeLabel: "مسرعة أعمال",
        prevProgress: 80, currProgress: 94, momChange: "+14.0%",
        beneficiaries: "2,600", volHours: "+240 س", funding: "600,000 ر.س", compliance: "96%",
        note: "الجاهزية التامة للتخرج والحصول على شهادة الامتثال."
      },
      {
        name: "جمعية النقاء الصحية", lic: "1450", mode: "spatial", modeLabel: "احتضان مكاني",
        prevProgress: 70, currProgress: 88, momChange: "+18.0%",
        beneficiaries: "3,300", volHours: "+6,000 س", funding: "545,000 ر.س", compliance: "94%",
        note: "توسع العيادات المتنقلة وتحقيق أعلى ساعات تطوعية."
      }
    ];

    const filtered = (filterMode === 'all') 
      ? reportData 
      : reportData.filter(d => d.mode === filterMode);

    const rowsHtml = filtered.map(d => {
      let modeBadgeStyle = 'background: #E0F2FE; color: #0369A1; border: 1px solid #BAE6FD;';
      if (d.mode === 'idea') modeBadgeStyle = 'background: #FEF3C7; color: #92400E; border: 1px solid #FCD34D;';
      if (d.mode === 'accelerator') modeBadgeStyle = 'background: #EDE9FE; color: #5B21B6; border: 1px solid #DDD6FE;';

      return `
        <tr>
          <td style="padding: 8px 10px; border: 1px solid #CBD5E1; text-align: right;">
            <div style="font-weight: 800; color: #0D6E46; font-size: 0.86rem;">${d.name}</div>
            <span style="font-size: 0.7rem; color: #64748B;">ترخيص: ${d.lic}</span>
          </td>
          <td style="padding: 8px 10px; border: 1px solid #CBD5E1; text-align: center;">
            <span style="display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 0.7rem; font-weight: 700; ${modeBadgeStyle}">
              ${d.modeLabel}
            </span>
          </td>
          <td style="padding: 8px 10px; border: 1px solid #CBD5E1; text-align: center; color: #64748B; font-weight: 700;">
            ${d.prevProgress}%
          </td>
          <td style="padding: 8px 10px; border: 1px solid #CBD5E1; text-align: center; color: #0D6E46; font-weight: 800; font-size: 0.9rem;">
            ${d.currProgress}%
          </td>
          <td style="padding: 8px 10px; border: 1px solid #CBD5E1; text-align: center;">
            <span style="background: #DCFCE7; color: #166534; font-weight: 800; padding: 2px 8px; border-radius: 4px; font-size: 0.75rem; border: 1px solid #86EFAC;">
              ${d.momChange} ↗
            </span>
          </td>
          <td style="padding: 8px 10px; border: 1px solid #CBD5E1; text-align: center;">
            <div style="font-weight: 800; color: #1E293B; font-size: 0.82rem;">${d.beneficiaries}</div>
            <span style="font-size: 0.68rem; color: #64748B;">${d.volHours} تطوع</span>
          </td>
          <td style="padding: 8px 10px; border: 1px solid #CBD5E1; text-align: center; font-weight: 800; color: #0D6E46;">
            ${d.compliance}
          </td>
          <td style="padding: 8px 10px; border: 1px solid #CBD5E1; text-align: right; font-size: 0.72rem; color: #475569; line-height: 1.5;">
            ${d.note}
          </td>
        </tr>
      `;
    }).join('');

    const content = `
      <div class="report-paper" style="border: 2px solid #CBD5E1; padding: 26px; border-radius: 12px; background: #FFFFFF; direction: rtl; font-size: 0.85rem; line-height: 1.7;">
        ${this.getHeaderHtml('تقرير قياس الأثر ونسبة التقدم الشهري المقارن (MoM)', ref)}

        <!-- فترة التقرير والتعريف -->
        <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 12px 16px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
          <div>
            <div style="font-size: 0.95rem; font-weight: 800; color: #0D6E46;">
              <i class="fa-solid fa-calendar-check"></i> فترة التقرير المقارنة: ${targetMonth} مقارنة بـ (${compareMonth})
            </div>
            <div style="font-size: 0.75rem; color: #64748B; margin-top: 2px;">
              صادر عن وحدة الرقابة والامتثال وقياس الأثر • معتمد لرفع التقارير للمركز الوطني NCNP ومجلس الإدارة
            </div>
          </div>
          <div style="background: #ECFDF5; border: 1px solid #A7F3D0; color: #065F46; padding: 4px 12px; border-radius: 20px; font-weight: 800; font-size: 0.75rem;">
            تحديث دوري معتمد ✓
          </div>
        </div>

        <!-- KPI Cards Grid -->
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 20px; text-align: center;">
          <div style="background: #F0FDF4; border: 1.5px solid #86EFAC; padding: 10px 6px; border-radius: 8px;">
            <div style="font-size: 1.5rem; font-weight: 900; color: #166534;">+16.4% ↗</div>
            <div style="font-size: 0.72rem; font-weight: 800; color: #1E293B;">متوسط النمو الشهري (MoM)</div>
          </div>
          <div style="background: #EFF6FF; border: 1.5px solid #BFDBFE; padding: 10px 6px; border-radius: 8px;">
            <div style="font-size: 1.5rem; font-weight: 900; color: #1D4ED8;">14,850</div>
            <div style="font-size: 0.72rem; font-weight: 800; color: #1E293B;">إجمالي المستفيدين المباشرين</div>
          </div>
          <div style="background: #FEF3C7; border: 1.5px solid #FDE68A; padding: 10px 6px; border-radius: 8px;">
            <div style="font-size: 1.5rem; font-weight: 900; color: #92400E;">2.45M ر.س</div>
            <div style="font-size: 0.72rem; font-weight: 800; color: #1E293B;">التمويل والمنح المستقطبة</div>
          </div>
          <div style="background: #FAF5FF; border: 1.5px solid #E9D5FF; padding: 10px 6px; border-radius: 8px;">
            <div style="font-size: 1.5rem; font-weight: 900; color: #6B21A8;">91.2%</div>
            <div style="font-size: 0.72rem; font-weight: 800; color: #1E293B;">متوسط الامتثال والحوكمة NCNP</div>
          </div>
        </div>

        <!-- جدول المقارنة التفصيلي -->
        <div style="margin-bottom: 18px;">
          <h4 style="font-size: 0.92rem; font-weight: 800; color: #0D6E46; margin-bottom: 8px; display: flex; align-items: center; justify-content: space-between;">
            <span><i class="fa-solid fa-table-list"></i> مصفوفة أداء الجمعيات ونسبة التقدم من شهر لآخر:</span>
            <span style="font-size: 0.72rem; color: #64748B; font-weight: normal;">عدد المنظمات المشمولة: (${filtered.length})</span>
          </h4>
          <table style="width: 100%; border-collapse: collapse; font-size: 0.78rem;">
            <thead>
              <tr style="background: #F1F5F9; color: #1E293B;">
                <th style="padding: 7px 8px; border: 1px solid #CBD5E1; text-align: right;">الجمعية والترخيص</th>
                <th style="padding: 7px 8px; border: 1px solid #CBD5E1; text-align: center;">وضع الجمعية</th>
                <th style="padding: 7px 8px; border: 1px solid #CBD5E1; text-align: center;">إنجاز (${compareMonth.split(' ')[0]})</th>
                <th style="padding: 7px 8px; border: 1px solid #CBD5E1; text-align: center;">إنجاز (${targetMonth.split(' ')[0]})</th>
                <th style="padding: 7px 8px; border: 1px solid #CBD5E1; text-align: center;">النمو الشهري (MoM)</th>
                <th style="padding: 7px 8px; border: 1px solid #CBD5E1; text-align: center;">المستفيدون والأثر</th>
                <th style="padding: 7px 8px; border: 1px solid #CBD5E1; text-align: center;">الحوكمة والامتثال</th>
                <th style="padding: 7px 8px; border: 1px solid #CBD5E1; text-align: right; width: 22%;">ملاحظات وتوصيات الإشراف</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>
        </div>

        <!-- خلاصات وتوصيات لجنة الإشراف -->
        <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 12px 16px; margin-bottom: 20px; font-size: 0.78rem; line-height: 1.6;">
          <strong style="color: #0D6E46; display: block; margin-bottom: 4px;"><i class="fa-solid fa-clipboard-check"></i> ملخص وتوصيات لجنة الإشراف والتقييم:</strong>
          <ul style="margin: 0; padding-right: 18px; color: #334155;">
            <li>سجلت المنظومة نمواً شهرياً متصاعداً بنسبة <strong>+16.4%</strong> مع تفوق مسرعة الأعمال في تحقيق الاستدامة وجذب المنح.</li>
            <li>الجمعيات في طور الفكرة حققت أعلى قفزة في التأسيس المؤسسي بمعدل تقدم بلغ <strong>+22.0%</strong>.</li>
            <li>توصي اللجنة باستمرار ربط الجمعيات ذات الامتثال الأقل من 85% بجلسات إرشاد حوكمة مكثفة قبل نهاية الربع الحالي.</li>
          </ul>
        </div>

        ${this.getFooterAndSignatureHtml('المشرف العام على حاضنة ومسرعة عذق', 'مشرف وحدة الرقابة وقياس الأثر')}
      </div>
    `;

    this.showPrintPreview(content, `تقرير_الأثر_والتقدم_الشهري_${targetMonth.replace(/\s+/g, '_')}`);
  }

  // 10. توليد وطباعة خطة الـ 100 يوم التنفيذية للجمعية (100-Day Acceleration Roadmap PDF)
  print100DaysRoadmap(assocName = 'جمعية ديوان الشبابية', lic = '1842', roadmap = null) {
    const ref = `ATHQ-100D-1446-${Math.floor(100 + Math.random() * 900)}`;
    const currDay = (roadmap && roadmap.dayCurrent) ? roadmap.dayCurrent : 42;
    const progress = (roadmap && roadmap.overallProgress) ? roadmap.overallProgress : 68;

    const content = `
      <div class="report-paper" style="border: 2px solid #CBD5E1; padding: 26px; border-radius: 12px; background: #FFFFFF; direction: rtl; font-size: 0.86rem; line-height: 1.7;">
        ${this.getHeaderHtml('خطة الـ 100 يوم التنفيذية للانطلاقة والتمكين المؤسسي', ref)}

        <!-- Association & Roadmap Summary Bar -->
        <div style="background: #F8FAFC; border: 1.5px solid #E2E8F0; padding: 16px 20px; border-radius: 10px; margin-bottom: 22px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px;">
          <div>
            <div style="font-size: 1.25rem; font-weight: 900; color: #0D6E46; margin-bottom: 4px;">${assocName}</div>
            <div style="font-size: 0.82rem; color: #64748B;">
              <span>ترخيص رقم: <strong style="color: #0F172A;">${lic}</strong></span> • 
              <span>حاضنة ومسرعة عذق • المدينة المنورة</span>
            </div>
          </div>
          <div style="display: flex; gap: 14px; align-items: center;">
            <div style="background: #0F172A; color: #38BDF8; padding: 8px 16px; border-radius: 8px; text-align: center;">
              <span style="font-size: 0.72rem; display: block; color: #94A3B8;">الجدول الزمني:</span>
              <strong style="font-size: 1.15rem; font-weight: 900;">اليوم ${currDay} / 100</strong>
            </div>
            <div style="background: #DCFCE7; color: #166534; padding: 8px 16px; border-radius: 8px; text-align: center; border: 1px solid #86EFAC;">
              <span style="font-size: 0.72rem; display: block; color: #15803D;">نسبة الإنجاز التراكمي:</span>
              <strong style="font-size: 1.15rem; font-weight: 900;">${progress}% مكتمل</strong>
            </div>
          </div>
        </div>

        <!-- 4 Phases Breakdown Table -->
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 22px; font-size: 0.83rem;">
          <thead>
            <tr style="background: #0D6E46; color: #FFFFFF; text-align: right;">
              <th style="padding: 10px 12px; border: 1px solid #CBD5E1;">المرحلة والنطاق الزمني</th>
              <th style="padding: 10px 12px; border: 1px solid #CBD5E1;">المستهدفات والمخرجات التنفيذية</th>
              <th style="padding: 10px 12px; border: 1px solid #CBD5E1; text-align: center; width: 110px;">الحالة</th>
              <th style="padding: 10px 12px; border: 1px solid #CBD5E1; text-align: center; width: 100px;">نسبة الإنجاز</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 10px 12px; border: 1px solid #CBD5E1; font-weight: 800; background: #F8FAFC;">
                1. التهيئة والتأسيس المؤسسي<br><small style="color: #64748B; font-weight: normal;">(الأيام 1 - 25)</small>
              </td>
              <td style="padding: 10px 12px; border: 1px solid #CBD5E1;">
                • توقيع عقد الاحتضان ولوائح الحاضنة المعتمدة.<br>
                • استلام المقر المجهز وتفعيل العنوان الوطني الرسمي.<br>
                • فتح الحسابات البنكية المعتمدة باسم الكيان.<br>
                • تعيين المدير التنفيذي وتسكين الفريق الأساسي.
              </td>
              <td style="padding: 10px 12px; border: 1px solid #CBD5E1; text-align: center; color: #166534; font-weight: 800; background: #DCFCE7;">
                مكتمل ✓
              </td>
              <td style="padding: 10px 12px; border: 1px solid #CBD5E1; text-align: center; font-weight: 800; color: #166534;">
                100%
              </td>
            </tr>
            <tr>
              <td style="padding: 10px 12px; border: 1px solid #CBD5E1; font-weight: 800; background: #F8FAFC;">
                2. الامتثال والحوكمة الذكية<br><small style="color: #64748B; font-weight: normal;">(الأيام 26 - 50)</small>
              </td>
              <td style="padding: 10px 12px; border: 1px solid #CBD5E1;">
                • إقرار واعتماد اللائحة الأساسية واللوائح الداخلية الـ 7.<br>
                • تشكيل لجان مجلس الإدارة وتحديث مصفوفة الصلاحيات المالية.<br>
                • استيفاء مؤشرات السلامة المالية والشفافية بالمركز الوطني NCNP.<br>
                • جلسة المراجعة القانونية والحوكمة مع مستشار الحاضنة.
              </td>
              <td style="padding: 10px 12px; border: 1px solid #CBD5E1; text-align: center; color: #B45309; font-weight: 800; background: #FEF3C7;">
                جاري التنفيذ ⏳
              </td>
              <td style="padding: 10px 12px; border: 1px solid #CBD5E1; text-align: center; font-weight: 800; color: #B45309;">
                75%
              </td>
            </tr>
            <tr>
              <td style="padding: 10px 12px; border: 1px solid #CBD5E1; font-weight: 800; background: #F8FAFC;">
                3. بناء البرامج وتفعيل التطوع<br><small style="color: #64748B; font-weight: normal;">(الأيام 51 - 75)</small>
              </td>
              <td style="padding: 10px 12px; border: 1px solid #CBD5E1;">
                • اعتماد الخطة التشغيلية السنوية ومؤشرات الأثر المجتمعي.<br>
                • نشر أول فرصة تطوعية تخصصية عبر المنصة الوطنية NVG.<br>
                • عقد ورشة العمل التصميمية للمبادرة المجتمعية الأولى.<br>
                • الاستفادة من 3 استشارات تخصصية بقاعات عذق.
              </td>
              <td style="padding: 10px 12px; border: 1px solid #CBD5E1; text-align: center; color: #1D4ED8; font-weight: 800; background: #EFF6FF;">
                مجدول 📅
              </td>
              <td style="padding: 10px 12px; border: 1px solid #CBD5E1; text-align: center; font-weight: 800; color: #1D4ED8;">
                25%
              </td>
            </tr>
            <tr>
              <td style="padding: 10px 12px; border: 1px solid #CBD5E1; font-weight: 800; background: #F8FAFC;">
                4. إطلاق الأثر والاستدامة المالية<br><small style="color: #64748B; font-weight: normal;">(الأيام 76 - 100)</small>
              </td>
              <td style="padding: 10px 12px; border: 1px solid #CBD5E1;">
                • إطلاق المبادرة المجتمعية الأولى وتوثيق مؤشرات العائد.<br>
                • تفعيل المتجر الإلكتروني واستقطاب أول منحة تمويلية.<br>
                • مراجعة تقرير إنجاز خطة الـ 100 يوم مع لجنة التقييم.<br>
                • تسليم شهادة اجتياز خطة الـ 100 يوم والانتقال للتسريع.
              </td>
              <td style="padding: 10px 12px; border: 1px solid #CBD5E1; text-align: center; color: #6B21A8; font-weight: 800; background: #FAF5FF;">
                المرحلة القادمة
              </td>
              <td style="padding: 10px 12px; border: 1px solid #CBD5E1; text-align: center; font-weight: 800; color: #6B21A8;">
                0%
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Quality & Supervision Recommendation -->
        <div style="background: #FFFBEB; border: 1px solid #FCD34D; padding: 12px 16px; border-radius: 8px; margin-bottom: 20px; font-size: 0.82rem; color: #92400E;">
          <strong>توصية المشرف المتابع:</strong> الجمعية تسير وفق الجدول الزمني المخطط له، ويوصى باستكمال رفع سياسة الإبلاغ عن المخالفات قبل نهاية اليوم الـ 48 للانتقال السلس إلى مرحلة البرامج والتطوع.
        </div>

        ${this.getFooterAndSignatureHtml('مشرف حاضنة ومسرعة عذق', 'المدير التنفيذي للجمعية')}
      </div>
    `;

    this.showPrintPreview(content, `خطة_الـ_100_يوم_${assocName.replace(/\s+/g, '_')}`);
  }

  // 11. توليد وطباعة أي مستند أو وثيقة عامة بصيغة رسمية معتمدة
  printGenericDocument(title, category, contentHtml) {
    const ref = `ATHQ-DOC-${Math.floor(100 + Math.random() * 900)}`;

    const content = `
      <div class="report-paper" style="border: 2px solid #CBD5E1; padding: 28px; border-radius: 12px; background: #FFFFFF; direction: rtl; font-size: 0.88rem; line-height: 1.8;">
        ${this.getHeaderHtml(title, ref)}

        <div style="margin-bottom: 20px;">
          ${contentHtml}
        </div>

        ${this.getFooterAndSignatureHtml('المشرف العام على الحاضنة', 'المسؤول المفوض')}
      </div>
    `;

    this.showPrintPreview(content, title.replace(/\s+/g, '_'));
  }

  // 10. معالج الطباعة التلقائي الذكي - يحول أي نافذة مفتوحة أو دور حالي إلى مستند رسمي فوري
  autoHandlePrint() {
    // 1. فحص إذا كان هناك نافذة استشارة مفتوحة
    const consModal = document.getElementById('modalConsSessionReport');
    if (consModal && consModal.classList.contains('active')) {
      const title = document.getElementById('cons-rep-modal-title')?.textContent || 'تقرير جلسة استشارية';
      const content = document.getElementById('cons-rep-modal-content')?.innerHTML || '';
      this.printGenericDocument(title, 'تقرير استشاري', content);
      return true;
    }

    // 2. فحص إذا كان هناك نافذة توقيع عقد أو عقد إدارة مفتوحة
    const contractModal = document.getElementById('modalContractSigning');
    if (contractModal && contractModal.classList.contains('active')) {
      this.printOfficialContract();
      return true;
    }

    const adminDocModal = document.getElementById('modalAdminDocGenerator');
    if (adminDocModal && adminDocModal.classList.contains('active')) {
      const selectAssoc = document.getElementById('gen-assoc-select');
      const assocName = selectAssoc ? selectAssoc.options[selectAssoc.selectedIndex]?.text.split('(')[0].trim() : 'جمعية ديوان الشبابية';
      const docType = document.getElementById('gen-doc-type')?.value || 'contract';
      if (docType === 'contract') {
        this.printOfficialContract(assocName);
      } else {
        const paperContent = document.getElementById('gen-doc-paper-content')?.innerHTML || '';
        this.printGenericDocument('وثيقة رسمية معتمدة', 'إدارة الحاضنة', paperContent);
      }
      return true;
    }

    const adminPreviewModal = document.getElementById('modalAdminDocPreview');
    if (adminPreviewModal && adminPreviewModal.classList.contains('active')) {
      const title = document.getElementById('admin-doc-modal-title')?.textContent || 'وثيقة إدارية معتمدة';
      const paperContent = document.getElementById('admin-doc-modal-content')?.innerHTML || '';
      this.printGenericDocument(title, 'إدارة الحاضنة', paperContent);
      return true;
    }

    // 3. فحص إذا كان هناك نافذة شهادة مفتوحة
    const certModal = document.getElementById('modalDigitalCertificate');
    if (certModal && certModal.classList.contains('active')) {
      const assocName = document.getElementById('cert-assoc-name')?.textContent || 'جمعية ديوان الشبابية';
      this.printGraduationCertificate(assocName);
      return true;
    }

    // 4. فحص إذا كان هناك نافذة أثر جمعية مفتوحة
    const impactModal = document.getElementById('modalOrgImpact');
    if (impactModal && impactModal.classList.contains('active')) {
      const orgName = document.getElementById('impactOrgName')?.textContent || 'جمعية ديوان الشبابية';
      const track = document.getElementById('impactOrgTrack')?.textContent || 'مسار الحوكمة والتمكين الشامل';
      this.printOrgImpactCard(orgName, track, 92);
      return true;
    }

    // 5. فحص إذا كان هناك نافذة حجز موعد مفتوحة (Ticket)
    const bookingModal = document.getElementById('modalBookConsultant');
    if (bookingModal && bookingModal.classList.contains('active')) {
      const assocName = document.getElementById('ticket-assoc-name')?.textContent || 'جمعية ديوان الشبابية';
      this.printConsultationTicket(assocName);
      return true;
    }

    // 6. فحص إذا كان هناك إشعار تقديم مفتوح
    const wizardModal = document.getElementById('modalApplicationWizard');
    if (wizardModal && wizardModal.classList.contains('active')) {
      const assocName = document.getElementById('receipt-assoc-name')?.textContent || 'جمعية روافد التنموية';
      const track = document.getElementById('receipt-assoc-track')?.textContent || 'مسار الحوكمة والتمكين الشامل';
      const appId = document.getElementById('receipt-app-id')?.textContent || 'ATHQ-2025-018';
      this.printApplicationReceipt(assocName, track, appId);
      return true;
    }

    // 7. إذا لم يكن هناك أي نافذة منبثقة، نحدد بناءً على الدور الحالي
    const activeRole = window.CURRENT_ROLE || 'admin';
    if (activeRole === 'association') {
      this.printGraduationCertificate('جمعية ديوان الشبابية');
    } else if (activeRole === 'consultant') {
      this.printConsultationReport('جمعية ديوان الشبابية', 'د. سليمان الحربي');
    } else {
      this.printExecutiveReport();
    }
    return true;
  }

  // نافذة المعاينة والطباعة الفاخرة
  showPrintPreview(documentHtml, filename = 'وثيقة_عذق_الرسمية') {
    let modal = document.getElementById(this.modalId);
    if (!modal) {
      modal = document.createElement('div');
      modal.id = this.modalId;
      modal.className = 'modal-overlay';
      modal.style.zIndex = '99999999';
      modal.style.background = 'rgba(15, 23, 42, 0.85)';
      modal.style.backdropFilter = 'blur(8px)';
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div style="background: #FFFFFF; width: 95%; max-width: 860px; max-height: 92vh; border-radius: 16px; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 25px 60px rgba(0,0,0,0.4); animation: modalZoomIn 0.25s ease;">
        
        <!-- Header Bar -->
        <div style="background: #07472C; color: #FFFFFF; padding: 14px 20px; display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #D99B26; direction: rtl;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <div style="background: rgba(217,155,38,0.2); color: #FCD34D; width: 34px; height: 34px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 1.1rem;">
              <i class="fa-solid fa-file-pdf"></i>
            </div>
            <div>
              <h4 style="margin: 0; font-size: 1rem; font-weight: 800;">معاينة الوثيقة الرسمية للطباعة والحفظ كـ PDF</h4>
              <span style="font-size: 0.72rem; color: #A7F3D0;">جاهزة ومطابقة لمقاس A4 القياسي • معتمدة بالأختام والتواقيع الرسمية ✓</span>
            </div>
          </div>

          <div style="display: flex; gap: 10px;">
            <button class="btn btn-gold btn-sm" onclick="AthqPrint.executePrint()" style="font-weight: 800; font-size: 0.85rem; padding: 6px 18px;">
              <i class="fa-solid fa-print"></i> طباعة / حفظ كـ PDF فوري
            </button>
            <button onclick="AthqPrint.closePrintPreview()" style="background: rgba(255,255,255,0.15); border: none; color: #FFFFFF; width: 34px; height: 34px; border-radius: 8px; cursor: pointer; font-size: 1.2rem; display: flex; align-items: center; justify-content: center;">
              &times;
            </button>
          </div>
        </div>

        <!-- Preview Document Body -->
        <div style="flex: 1; overflow-y: auto; padding: 24px; background: #F1F5F9; display: flex; justify-content: center;">
          <div id="${this.containerId}" style="width: 100%; max-width: 780px; background: #FFFFFF; box-shadow: 0 4px 20px rgba(0,0,0,0.08); border-radius: 8px;">
            ${documentHtml}
          </div>
        </div>
      </div>
    `;

    modal.classList.add('active');
  }

  closePrintPreview() {
    const modal = document.getElementById(this.modalId);
    if (modal) modal.classList.remove('active');
  }

  // تنفيذ الطباعة بعزل الوثيقة النظيفة فقط
  executePrint() {
    if (typeof showToast === 'function') {
      showToast('جاري فتح معالج الطباعة وحفظ PDF القياسي A4...', 'success');
    }
    setTimeout(() => {
      window.print();
    }, 250);
  }
}

// تهيئة محرك الطباعة العام
window.AthqPrint = new AthqPrintEngine();

// إتاحة اختصار موحد للطباعة عبر المنظومة بالكامل
window.athqPrintNow = function() {
  window.AthqPrint.autoHandlePrint();
};
