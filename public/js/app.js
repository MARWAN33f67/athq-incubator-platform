// ==========================================================================
// حاضنة ومسرعة عذق - جمعية البر بالمدينة المنورة
// منطق المنصة التفاعلي وسير العمليات (Core Application Logic & State)
// ==========================================================================

const API_BASE = window.location.origin.includes('http') ? '' : 'http://localhost:8088';

// State Management
const STATE = {
  currentRole: 'visitor', // 'visitor' | 'association' | 'consultant' | 'admin'
  theme: localStorage.getItem('athq_theme') || 'light',
  stats: { ...ATHQ_DATA },
  applications: [],
  consultants: [],
  consultations: [],
  facilities: [],
  bookings: [],
  activeAssociation: null,
  activeConsultant: null
};

// ========================== Initialization ==========================
document.addEventListener('DOMContentLoaded', async () => {
  initTheme();
  setupRoleSwitcher();
  setupNavLinks();
  renderStaticSections();
  setupChatWidget();
  setupModalEvents();

  // Fetch initial dynamic data from backend API (with resilient offline fallback)
  await loadPlatformData();

  renderAllViews();
});

// ========================== Theme Toggle ==========================
function initTheme() {
  document.documentElement.setAttribute('data-theme', STATE.theme);
  const themeBtn = document.getElementById('theme-toggle-btn');
  if (themeBtn) {
    themeBtn.innerHTML = STATE.theme === 'dark' ? '☀️' : '🌙';
    themeBtn.addEventListener('click', () => {
      STATE.theme = STATE.theme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', STATE.theme);
      localStorage.setItem('athq_theme', STATE.theme);
      themeBtn.innerHTML = STATE.theme === 'dark' ? '☀️' : '🌙';
    });
  }
}

// ========================== Role Switching ==========================
function setupRoleSwitcher() {
  const roleBtns = document.querySelectorAll('.role-btn');
  roleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetRole = btn.dataset.role;
      switchRole(targetRole);
    });
  });
}

function switchRole(role) {
  STATE.currentRole = role;

  // Update buttons
  document.querySelectorAll('.role-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.role === role);
  });

  // Toggle visible views
  const visitorView = document.getElementById('view-visitor');
  const associationView = document.getElementById('view-association');
  const consultantView = document.getElementById('view-consultant');
  const adminView = document.getElementById('view-admin');

  if (visitorView) visitorView.style.display = role === 'visitor' ? 'block' : 'none';
  if (associationView) associationView.classList.toggle('active', role === 'association');
  if (consultantView) consultantView.classList.toggle('active', role === 'consultant');
  if (adminView) adminView.classList.toggle('active', role === 'admin');

  // Trigger relevant view renders
  if (role === 'association') renderAssociationDashboard();
  if (role === 'consultant') renderConsultantDashboard();
  if (role === 'admin') renderAdminDashboard();

  window.scrollTo({ top: 0, behavior: 'smooth' });
  showToast(`تم التبديل إلى: ${getRoleTitle(role)}`, 'info');
}

function getRoleTitle(role) {
  switch (role) {
    case 'visitor': return 'الزائر العام (المرحلة 1)';
    case 'association': return 'بوابة الجمعيات المحتضنة (المرحلة 2)';
    case 'consultant': return 'بوابة الخبراء والمستشارين (المرحلة 3)';
    case 'admin': return 'لوحة الإدارة المركزية (المرحلة 4)';
    default: return role;
  }
}

// ========================== Navigation Links ==========================
function setupNavLinks() {
  const links = document.querySelectorAll('.nav-link');
  links.forEach(l => {
    l.addEventListener('click', (e) => {
      links.forEach(item => item.classList.remove('active'));
      l.classList.add('active');
    });
  });
}

// ========================== Backend API Data Loading ==========================
async function loadPlatformData() {
  try {
    const [resStats, resApps, resCns, resCnslt, resFac, resBk] = await Promise.all([
      fetch(`${API_BASE}/api/stats`).then(r => r.json()).catch(() => null),
      fetch(`${API_BASE}/api/applications`).then(r => r.json()).catch(() => null),
      fetch(`${API_BASE}/api/consultants`).then(r => r.json()).catch(() => null),
      fetch(`${API_BASE}/api/consultations`).then(r => r.json()).catch(() => null),
      fetch(`${API_BASE}/api/facilities`).then(r => r.json()).catch(() => null),
      fetch(`${API_BASE}/api/bookings`).then(r => r.json()).catch(() => null)
    ]);

    if (resStats && resStats.success) STATE.stats = resStats.data;
    if (resApps && resApps.success) STATE.applications = resApps.data;
    if (resCns && resCns.success) STATE.consultants = resCns.data;
    if (resCnslt && resCnslt.success) STATE.consultations = resCnslt.data;
    if (resFac && resFac.success) STATE.facilities = resFac.data;
    if (resBk && resBk.success) STATE.bookings = resBk.data;

    if (STATE.applications.length > 0 && !STATE.activeAssociation) {
      STATE.activeAssociation = STATE.applications[0];
    }
    if (STATE.consultants.length > 0 && !STATE.activeConsultant) {
      STATE.activeConsultant = STATE.consultants[0];
    }
  } catch (err) {
    console.warn('API loaded with local fallback state:', err);
  }
}

// ========================== Static Content Renderers ==========================
function renderStaticSections() {
  renderLeadershipQuotes();
  renderPillars();
  renderGoals();
  renderStagesRoadmap();
  renderPrograms();
  renderFacilities();
  renderEntitiesNetwork();
  renderFAQs();
}

function renderLeadershipQuotes() {
  const container = document.getElementById('leadership-quotes-container');
  if (!container || !ATHQ_DATA.leadershipQuotes) return;
  container.innerHTML = ATHQ_DATA.leadershipQuotes.map(q => `
    <div class="leadership-card">
      <div class="quote-icon-badge">${q.icon || '❝'}</div>
      <div class="leadership-quote-text">"${q.quote}"</div>
      <div class="leadership-author">
        <div class="leadership-avatar-icon">${q.icon || '🏛️'}</div>
        <div>
          <div class="leadership-name">${q.author}</div>
          <div class="leadership-title">${q.title}</div>
        </div>
      </div>
    </div>
  `).join('');
}

function renderPillars() {
  const container = document.getElementById('pillars-container');
  if (!container || !ATHQ_DATA.pillars) return;
  container.innerHTML = ATHQ_DATA.pillars.map(p => `
    <div class="pillar-item-card">
      <div class="pillar-num-col">
        <div class="pillar-num-circle">${p.num}</div>
      </div>
      <div class="pillar-body">
        <h3 class="pillar-keyword">${p.keyword}</h3>
        <p class="pillar-desc">${p.desc}</p>
      </div>
    </div>
  `).join('');
}

function renderGoals() {
  const container = document.getElementById('goals-container');
  if (!container) return;
  container.innerHTML = ATHQ_DATA.goals.map(g => `
    <div class="stage-card">
      <span class="stage-badge-phase">الهدف ${g.num}</span>
      <h3 class="stage-card-title">${g.title}</h3>
      <p class="stage-card-desc">${g.desc}</p>
    </div>
  `).join('');
}

function renderStagesRoadmap() {
  const container = document.getElementById('stages-pyramid-container') || document.getElementById('stages-roadmap-container');
  if (!container) return;

  container.innerHTML = ATHQ_DATA.incubationStages.map((s, idx) => `
    <div class="pyramid-tier-card ${idx === 0 ? 'active' : ''}" onclick="selectPyramidTier(this, '${s.id}')">
      <div class="pyramid-tier-head">
        <div class="pyramid-tier-title-wrap">
          <div class="pyramid-tier-icon">${s.icon}</div>
          <div>
            <div class="pyramid-tier-name">${s.number}: ${s.title}</div>
            <div class="pyramid-tier-subtitle">${s.subtitle}</div>
          </div>
        </div>
        <span class="pyramid-tier-level-badge">المستوى ${idx + 1}</span>
      </div>
      <p style="font-size: 0.92rem; color: var(--c-text-muted); margin-top: 0.85rem; line-height: 1.7;">
        ${s.desc}
      </p>
      <div class="pyramid-tier-deliverables">
        ${s.deliverables.map(d => `
          <div class="deliverable-chip">
            <span>✓</span>
            <div>${d}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');
}

function selectPyramidTier(el, stageId) {
  document.querySelectorAll('.pyramid-tier-card').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
}

let activeProgramId = "prog-gov";

function renderPrograms() {
  const navContainer = document.getElementById('programs-tab-nav');
  const cardContainer = document.getElementById('active-program-card-wrap');
  if (!navContainer || !cardContainer) return;

  // Render Nav Pills
  navContainer.innerHTML = ATHQ_DATA.programs.map(p => `
    <button class="prog-nav-pill ${p.id === activeProgramId ? 'active' : ''}" onclick="switchProgramTab('${p.id}', this)">
      <span>${p.icon}</span>
      <span>${p.title}</span>
    </button>
  `).join('');

  // Render Active Card
  const activeProg = ATHQ_DATA.programs.find(p => p.id === activeProgramId) || ATHQ_DATA.programs[0];
  cardContainer.innerHTML = `
    <div class="program-detail-card">
      <div class="program-detail-head">
        <div>
          <span class="badge badge-gold" style="margin-bottom: 0.5rem;">⏱️ المدة الزمنية المعتمدة: ${activeProg.duration}</span>
          <h3 style="font-size: 1.75rem; color: var(--c-primary); font-weight: 900; margin-top: 0.35rem;">
            ${activeProg.icon} ${activeProg.title}
          </h3>
          <p style="font-size: 1.05rem; color: var(--c-text-muted); margin-top: 0.5rem; line-height: 1.8;">
            ${activeProg.desc}
          </p>
        </div>
        <div>
          <button class="btn btn-gold btn-sm" onclick="openModal('modal-new-application')">
            ✍️ انضم لهذا المسار
          </button>
        </div>
      </div>

      <div style="font-weight: 800; font-size: 1.1rem; color: var(--c-text-main); margin-top: 1.5rem;">
        📋 أبرز محاور ومناهج المسار التدريبية والتنفيذية:
      </div>

      <div class="program-curriculum-grid">
        ${activeProg.items.map(item => `
          <div class="curriculum-item-box">
            <span class="check-icon">✓</span>
            <span>${item}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function switchProgramTab(progId, btn) {
  activeProgramId = progId;
  document.querySelectorAll('.prog-nav-pill').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderPrograms();
}

let activeFacilityCategory = 'all';

function renderFacilities() {
  const container = document.getElementById('facilities-container');
  if (!container) return;

  const list = activeFacilityCategory === 'all' 
    ? ATHQ_DATA.facilities 
    : ATHQ_DATA.facilities.filter(f => f.title.includes(activeFacilityCategory) || f.badge.includes(activeFacilityCategory));

  container.innerHTML = list.map(f => `
    <div class="facility-card-luxury">
      <div class="facility-media-banner">
        <div class="facility-icon">${f.icon}</div>
        <span class="facility-tag-overlay">${f.badge}</span>
      </div>
      <div class="facility-body-luxury">
        <h4 style="font-size: 1.25rem; font-weight: 800; margin-bottom: 0.5rem; color: var(--c-text-main);">
          ${f.title}
        </h4>
        <p style="font-size: 0.9rem; color: var(--c-text-muted); line-height: 1.7; margin-bottom: 1.5rem; flex-grow: 1;">
          ${f.desc}
        </p>
        <button class="btn btn-outline btn-sm" onclick="openFacilityBookingModal('${f.title}')" style="width: 100%;">
          📅 حجز المرفق للجمعية
        </button>
      </div>
    </div>
  `).join('');
}

function filterFacilities(category, btn) {
  activeFacilityCategory = category;
  document.querySelectorAll('.facility-filter-pill').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderFacilities();
}

let activeEntitiesTab = 'incubated';

const ALL_INCUBATED_ENTITIES = [
  { name: "وقف العمل الصالح", cat: "أوقاف وتنمية", workH: 360, volH: 70, vols: 16 },
  { name: "جمعية ديوان الشبابية", cat: "مبادرات وتمكين شبابي", workH: 1624, volH: 197, vols: 36 },
  { name: "جمعية التنمية الرياضية", cat: "رياضة وتنمية مجتمعية", workH: 120, volH: 1240, vols: 56 },
  { name: "الجمعية الفلكية بالمدينة", cat: "علوم وفلك وأبحاث", workH: 210, volH: 450, vols: 20 },
  { name: "جمعية الوفاء الرياضية", cat: "تطوير رياضي", workH: 150, volH: 320, vols: 18 },
  { name: "جمعية إرشاد للمتعافين", cat: "رعاية وإرشاد", workH: 280, volH: 510, vols: 25 },
  { name: "جمعية همم لذوي الإعاقة", cat: "تأهيل ورعاية", workH: 180, volH: 30, vols: 4 },
  { name: "جمعية النقاء للتوعية الصحية", cat: "صحة وتوعية", workH: 40, volH: 6000, vols: 100 },
  { name: "جمعية الرياضة النسائية", cat: "تمكين رياضي", workH: 190, volH: 420, vols: 22 },
  { name: "جمعية عيون طيبة", cat: "خدمات طبية", workH: 310, volH: 890, vols: 35 },
  { name: "جمعية صيانة الأهلية", cat: "صيانة مجتمعية وتدريب", workH: 250, volH: 100, vols: 5 },
  { name: "جمعية سفراء الخير", cat: "تطوع ومساندة", workH: 220, volH: 780, vols: 40 },
  { name: "إحسان الطبية للتوعية والتدريب", cat: "توعية صحية", workH: 175, volH: 640, vols: 28 },
  { name: "مؤسسة نسيج الأهلية", cat: "تمكين مجتمعي", workH: 300, volH: 950, vols: 45 },
  { name: "جمعية الإدارة القيادية", cat: "موارد بشرية وحوكمة", workH: 260, volH: 520, vols: 30 }
];

const ALL_GRADUATED_ENTITIES = [
  { name: "جمعية تكوين", cat: "تخرجت دفعة 2025", desc: "استقلت وحققت معايير الحوكمة والاستدامة المالية" },
  { name: "جمعية الأدب والأدباء", cat: "تخرجت دفعة 2025", desc: "نشر ثقافي وتنظيم ملتقيات وطنية رائدة" },
  { name: "هيئة الصحفيين السعوديين (فرع المدينة)", cat: "تخرجت دفعة 2025", desc: "تمكين إعلامي وتدريب كفاءات وطنية" },
  { name: "جمعية رحاب لخدمات الحج والعمرة", cat: "تخرجت دفعة 2025", desc: "خدمة ضيوف الرحمن بأحدث البرامج المؤسسية" },
  { name: "جمعية رعاية الأرامل والمطلقات", cat: "تخرجت دفعة 2024", desc: "مشاريع تنموية وتمكين اقتصادي للأسر" },
  { name: "مجلس شباب المدينة المنورة", cat: "تخرجت دفعة 2024", desc: "مبادرات شبابية ومشاريع تنموية مستدامة" },
  { name: "الجمعية السعودية للجودة (فرع المدينة)", cat: "تخرجت دفعة 2024", desc: "تطبيق معايير الآيزو والجودة المؤسسية" }
];

const STRATEGIC_PARTNERS = [
  { name: "المركز الوطني لتنمية القطاع غير الربحي", role: "المظلة الإشرافية والاعتماد الرسمي", icon: "🏛️" },
  { name: "شركة المتقن (ALMUTQEN)", role: "الشريك المشغل المتخصص للحاضنة والمسرعة", icon: "⚙️" },
  { name: "منصة أثر التنموية", role: "إدراج الجمعيات وتقديم الدعم المعرفي وقياس الأثر", icon: "📊" },
  { name: "جمعية جسور (منطقة نجران)", role: "تحالف استراتيجي لتبادل الخبرات وتطوير القطاع", icon: "🤝" },
  { name: "جمعية تطوير", role: "تمكين القطاع غير الربحي ورفع الكفاءة التشغيلية", icon: "🚀" }
];

function renderEntitiesNetwork() {
  const grid = document.getElementById('entities-luxury-grid');
  if (!grid) return;

  if (activeEntitiesTab === 'incubated') {
    grid.innerHTML = ALL_INCUBATED_ENTITIES.map(e => `
      <div class="entity-luxury-card">
        <div class="entity-card-top">
          <div class="entity-logo-circle">🌱</div>
          <div>
            <div style="font-weight: 800; font-size: 1rem; color: var(--c-text-main);">${e.name}</div>
            <div style="font-size: 0.8rem; color: var(--c-primary); font-weight: 700;">${e.cat}</div>
          </div>
        </div>
        <div class="entity-metrics-row">
          <div>💼 عمل: <span class="entity-metric-val">+${e.workH} س</span></div>
          <div>⏱️ تطوع: <span class="entity-metric-val">+${e.volH} س</span></div>
          <div>👥 متطوعين: <span class="entity-metric-val">${e.vols}</span></div>
        </div>
      </div>
    `).join('');
  } else if (activeEntitiesTab === 'graduated') {
    grid.innerHTML = ALL_GRADUATED_ENTITIES.map(e => `
      <div class="entity-luxury-card" style="border-right: 4px solid var(--c-gold);">
        <div class="entity-card-top">
          <div class="entity-logo-circle" style="background: var(--c-gold-subtle); color: var(--c-gold-dark);">🎓</div>
          <div>
            <div style="font-weight: 800; font-size: 1rem; color: var(--c-text-main);">${e.name}</div>
            <div style="font-size: 0.8rem; color: var(--c-gold-dark); font-weight: 700;">${e.cat}</div>
          </div>
        </div>
        <p style="font-size: 0.85rem; color: var(--c-text-muted); line-height: 1.6; margin-top: 0.5rem;">
          ${e.desc}
        </p>
      </div>
    `).join('');
  } else {
    grid.innerHTML = STRATEGIC_PARTNERS.map(p => `
      <div class="entity-luxury-card" style="border-right: 4px solid var(--c-primary);">
        <div class="entity-card-top">
          <div class="entity-logo-circle">${p.icon}</div>
          <div>
            <div style="font-weight: 800; font-size: 1rem; color: var(--c-text-main);">${p.name}</div>
            <div style="font-size: 0.82rem; color: var(--c-primary); font-weight: 700;">${p.role}</div>
          </div>
        </div>
      </div>
    `).join('');
  }
}

function switchEntitiesTab(tab, btn) {
  activeEntitiesTab = tab;
  document.querySelectorAll('.entities-tab-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderEntitiesNetwork();
}

function handleQuickContact(e) {
  e.preventDefault();
  showToast('شكراً لتواصلك! تم استلام استفسارك وسيقوم فريق الحاضنة بالرد عليك قريباً.', 'success');
  e.target.reset();
}

function renderFAQs() {
  const container = document.getElementById('faqs-container');
  if (!container) return;
  container.innerHTML = ATHQ_DATA.faqs.map((f, i) => `
    <div class="faq-item ${i === 0 ? 'open' : ''}">
      <button class="faq-trigger" onclick="toggleFaq(this)">
        <span>${f.q}</span>
        <span class="faq-icon">▾</span>
      </button>
      <div class="faq-content">
        ${f.a.replace(/\n/g, '<br>')}
      </div>
    </div>
  `).join('');
}

function toggleFaq(btn) {
  const item = btn.closest('.faq-item');
  item.classList.toggle('open');
}

// ========================== View Renderers ==========================
function renderAllViews() {
  renderStatsNumbers();
  renderPublicConsultants();
  renderAssociationDashboard();
  renderConsultantDashboard();
  renderAdminDashboard();
}

function renderStatsNumbers() {
  const s = STATE.stats;
  const setVal = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.innerText = val ? val.toLocaleString('ar-SA') : '0';
  };
  setVal('stat-volunteers', s.volunteers || 1122);
  setVal('stat-volunteer-hours', s.volunteer_hours || 16311);
  setVal('stat-work-hours', s.work_hours || 4470);
  setVal('stat-consultations', s.consultations || 28);
  setVal('stat-incubated', s.active_incubated || 15);
  setVal('stat-graduated', s.graduated || 7);
}

function renderPublicConsultants() {
  const wrap = document.getElementById('public-consultants-grid');
  if (!wrap) return;
  wrap.innerHTML = STATE.consultants.map(c => `
    <div class="consultant-card">
      <div class="consultant-head">
        <div class="consultant-avatar">🧑‍💼</div>
        <div>
          <h4 class="consultant-name">${c.name}</h4>
          <span class="badge badge-gold">${c.specialty}</span>
          <div class="consultant-title">${c.title}</div>
        </div>
      </div>
      <p class="consultant-bio">${c.bio}</p>
      <div class="consultant-slots-list">
        <strong style="font-size: 0.82rem; color: var(--c-primary);">أوقات التفرغ المتاحة:</strong>
        ${(c.availableSlots || []).map(s => `
          <div class="consultant-slot-tag">
            <span>🗓️ ${s.day} (${s.time})</span>
            <span class="badge badge-info">${s.type}</span>
          </div>
        `).join('')}
      </div>
      <button class="btn btn-primary btn-sm" onclick="openBookConsultationModal('${c.id}', '${c.name}')">
        📅 حجز جلسة استشارية
      </button>
    </div>
  `).join('');
}

// ========================== Association Dashboard (المرحلة 2) ==========================
function renderAssociationDashboard() {
  const app = STATE.activeAssociation;
  if (!app) return;

  const nameEl = document.getElementById('assoc-dash-name');
  const stageEl = document.getElementById('assoc-dash-stage');
  const progressText = document.getElementById('assoc-dash-progress-text');
  const progressBar = document.getElementById('assoc-dash-progress-bar');
  const detailsEl = document.getElementById('assoc-details-card');

  if (nameEl) nameEl.innerText = app.associationName;
  if (stageEl) stageEl.innerText = app.stage;
  if (progressText) progressText.innerText = `${app.stageProgress}% من رحلة الاحتضان مكتملة`;
  if (progressBar) progressBar.style.width = `${app.stageProgress}%`;

  if (detailsEl) {
    detailsEl.innerHTML = `
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-top: 1rem;">
        <div class="stage-step-item">
          <div class="stage-step-info">
            <div class="stage-step-sub">رقم الترخيص</div>
            <div class="stage-step-title">${app.licenseNumber || 'قيد الاستخراج'}</div>
          </div>
        </div>
        <div class="stage-step-item">
          <div class="stage-step-info">
            <div class="stage-step-sub">الرقم الوطني الموحد 700</div>
            <div class="stage-step-title">${app.nationalNumber700 || 'قيد التفعيل'}</div>
          </div>
        </div>
        <div class="stage-step-item">
          <div class="stage-step-info">
            <div class="stage-step-sub">ساعات العمل بالحاضنة</div>
            <div class="stage-step-title text-primary">${app.workHours || 0} ساعة</div>
          </div>
        </div>
        <div class="stage-step-item">
          <div class="stage-step-info">
            <div class="stage-step-sub">الساعات التطوعية المعتمدة</div>
            <div class="stage-step-title" style="color: var(--c-gold-dark);">${app.volunteerHours || 0} ساعة</div>
          </div>
        </div>
      </div>
    `;
  }

  // Render Evidences
  const evList = document.getElementById('assoc-evidences-list');
  if (evList) {
    if (!app.evidences || app.evidences.length === 0) {
      evList.innerHTML = `<p style="color: var(--c-text-muted); padding: 1rem;">لا توجد وثائق مرفوعة حالياً. استخدم الزر أدناه لرفع الشواهد.</p>`;
    } else {
      evList.innerHTML = app.evidences.map(ev => `
        <div class="stage-step-item" style="margin-bottom: 0.65rem;">
          <div class="stage-step-num">📄</div>
          <div class="stage-step-info">
            <div class="stage-step-title">${ev.title}</div>
            <div class="stage-step-sub">تاريخ الاعتماد: ${ev.date}</div>
          </div>
          <span class="badge ${ev.status === 'معتمد' ? 'badge-success' : 'badge-warning'}">${ev.status}</span>
        </div>
      `).join('');
    }
  }

  // Render Association Bookings
  const bkList = document.getElementById('assoc-bookings-list');
  if (bkList) {
    const assocBookings = STATE.bookings.filter(b => b.associationName === app.associationName);
    if (assocBookings.length === 0) {
      bkList.innerHTML = `<p style="color: var(--c-text-muted); padding: 1rem;">لا توجد حجوزات مرافق حالية. يمكنك حجز قاعة أو مكتب الآن.</p>`;
    } else {
      bkList.innerHTML = assocBookings.map(b => `
        <div class="stage-step-item" style="margin-bottom: 0.65rem;">
          <div class="stage-step-num">🏢</div>
          <div class="stage-step-info">
            <div class="stage-step-title">${b.facilityName}</div>
            <div class="stage-step-sub">${b.bookingDate} (${b.timeSlot}) - الغرض: ${b.purpose}</div>
          </div>
          <span class="badge badge-success">${b.status}</span>
        </div>
      `).join('');
    }
  }

  // Render Association Consultations
  const cnsltList = document.getElementById('assoc-consultations-list');
  if (cnsltList) {
    const assocCnslt = STATE.consultations.filter(c => c.associationName === app.associationName);
    if (assocCnslt.length === 0) {
      cnsltList.innerHTML = `<p style="color: var(--c-text-muted); padding: 1rem;">لم يتم طلب جلسات استشارية بعد. تصفح الخبراء واطلب استشارتك الأولى.</p>`;
    } else {
      cnsltList.innerHTML = assocCnslt.map(c => `
        <div class="stage-step-item" style="margin-bottom: 0.85rem; flex-direction: column; align-items: stretch;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <div>
              <span class="badge badge-gold">${c.consultantName}</span>
              <h4 style="margin-top: 0.35rem; font-size: 1rem;">${c.topic}</h4>
            </div>
            <span class="badge ${c.status === 'مكتملة' ? 'badge-success' : 'badge-info'}">${c.status}</span>
          </div>
          <div style="font-size: 0.82rem; color: var(--c-text-muted); margin-top: 0.35rem;">
            الموعد: ${c.sessionDate} (${c.time}) • النمط: ${c.mode}
          </div>
          ${c.report ? `
            <div style="background: var(--c-primary-subtle); padding: 0.75rem; border-radius: var(--radius-sm); margin-top: 0.5rem; font-size: 0.85rem;">
              <strong>تقرير وتوصيات المستشار:</strong>
              <div>${c.report}</div>
              <div style="color: var(--c-primary-dark); font-weight: 700; margin-top: 0.3rem;">التوصيات: ${c.recommendations}</div>
            </div>
          ` : ''}
        </div>
      `).join('');
    }
  }
}

// ========================== Consultant Dashboard (المرحلة 3) ==========================
function renderConsultantDashboard() {
  const cns = STATE.activeConsultant;
  if (!cns) return;

  const nameEl = document.getElementById('cns-dash-name');
  const titleEl = document.getElementById('cns-dash-title');
  const hoursEl = document.getElementById('cns-dash-hours');
  const slotsList = document.getElementById('cns-dash-slots');
  const sessionsList = document.getElementById('cns-dash-sessions');

  if (nameEl) nameEl.innerText = cns.name;
  if (titleEl) titleEl.innerText = `${cns.specialty} • ${cns.title}`;
  if (hoursEl) hoursEl.innerText = `${cns.consultingHours || 0} ساعة استشارية موثقة`;

  if (slotsList) {
    slotsList.innerHTML = (cns.availableSlots || []).map(s => `
      <div class="stage-step-item" style="margin-bottom: 0.5rem;">
        <div class="stage-step-num">⏰</div>
        <div class="stage-step-info">
          <div class="stage-step-title">${s.day} (${s.date || 'أسبوعي'})</div>
          <div class="stage-step-sub">${s.time} - ${s.type}</div>
        </div>
        <span class="badge badge-success">${s.status}</span>
      </div>
    `).join('');
  }

  if (sessionsList) {
    const mySessions = STATE.consultations.filter(c => c.consultantId === cns.id || c.consultantName === cns.name);
    if (mySessions.length === 0) {
      sessionsList.innerHTML = `<p style="color: var(--c-text-muted); padding: 1rem;">لا توجد جلسات محجوزة مع الجمعيات حالياً.</p>`;
    } else {
      sessionsList.innerHTML = mySessions.map(s => `
        <div class="stage-step-item" style="margin-bottom: 0.85rem; flex-direction: column; align-items: stretch;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <div>
              <span class="badge badge-gold">${s.associationName}</span>
              <h4 style="margin-top: 0.35rem; font-size: 1rem;">${s.topic}</h4>
            </div>
            <span class="badge ${s.status === 'مكتملة' ? 'badge-success' : 'badge-warning'}">${s.status}</span>
          </div>
          <div style="font-size: 0.82rem; color: var(--c-text-muted); margin-block: 0.35rem;">
            الموعد: ${s.sessionDate} (${s.time}) • النمط: ${s.mode}
          </div>
          <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem;">
            <button class="btn btn-outline btn-sm" onclick="alert('ملف واحتياج الجمعية:\\nالاسم: ${s.associationName}\\nالموضوع: ${s.topic}\\nالحالة: مسجلة في حاضنة عذق')">
              👁️ استعراض ملف الجمعية
            </button>
            <button class="btn btn-primary btn-sm" onclick="openSubmitReportModal('${s.id}')">
              ✍️ ${s.status === 'مكتملة' ? 'تعديل التقرير والتوصيات' : 'عقد الجلسة وكتابة التقرير'}
            </button>
          </div>
        </div>
      `).join('');
    }
  }
}

// ========================== Admin Dashboard (المرحلة 4) ==========================
function renderAdminDashboard() {
  const tableBody = document.getElementById('admin-apps-tbody');
  const countNew = document.getElementById('admin-count-new');
  const countAccepted = document.getElementById('admin-count-accepted');
  const countGraduated = document.getElementById('admin-count-graduated');

  const newApps = STATE.applications.filter(a => a.status === 'جديد');
  const acceptedApps = STATE.applications.filter(a => a.status === 'مقبول');
  const graduatedApps = STATE.applications.filter(a => a.status === 'متخرجة بنجاح' || a.stageProgress >= 100);

  if (countNew) countNew.innerText = newApps.length;
  if (countAccepted) countAccepted.innerText = acceptedApps.length;
  if (countGraduated) countGraduated.innerText = graduatedApps.length + 7;

  if (tableBody) {
    tableBody.innerHTML = STATE.applications.map(app => {
      let badgeClass = 'badge-warning';
      if (app.status === 'مقبول') badgeClass = 'badge-success';
      if (app.status === 'مرفوض') badgeClass = 'badge-danger';
      if (app.status === 'متخرجة بنجاح') badgeClass = 'badge-gold';

      return `
        <tr>
          <td>
            <strong>${app.associationName}</strong>
            <div style="font-size: 0.78rem; color: var(--c-text-muted);">${app.id} • ${app.city}</div>
          </td>
          <td>${app.field}</td>
          <td>
            <div>${app.stage}</div>
            <div class="progress-bar-wrap" style="width: 140px;">
              <div class="progress-bar-fill" style="width: ${app.stageProgress}%;"></div>
            </div>
          </td>
          <td><span class="badge ${badgeClass}">${app.status}</span></td>
          <td>
            <div style="display: flex; gap: 0.35rem;">
              <button class="btn btn-outline btn-sm" onclick="adminReviewApp('${app.id}')">
                🔍 فحص واتخاذ قرار
              </button>
              <button class="btn btn-gold btn-sm" onclick="adminAdvanceStage('${app.id}')" title="ترقية المرحلة بنظام BPMN">
                ⬆️ ترقية المرحلة
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  // Render Admin Bookings List
  const adminBkBody = document.getElementById('admin-bookings-tbody');
  if (adminBkBody) {
    adminBkBody.innerHTML = STATE.bookings.map(bk => `
      <tr>
        <td><strong>${bk.facilityName}</strong></td>
        <td>${bk.associationName}</td>
        <td>${bk.bookingDate} (${bk.timeSlot})</td>
        <td>${bk.purpose}</td>
        <td><span class="badge badge-success">${bk.status}</span></td>
        <td>
          <button class="btn btn-sm btn-outline" onclick="alert('تم اعتماد تأكيد الحجز لمرفق: ${bk.facilityName}')">
            ✓ معتمد
          </button>
        </td>
      </tr>
    `).join('');
  }
}

// ========================== Admin Operations ==========================
window.adminReviewApp = function(appId) {
  const app = STATE.applications.find(a => a.id === appId);
  if (!app) return;

  const decision = prompt(
    `فحص طلب الجمعية: ${app.associationName}\nالرقم الوطني: ${app.nationalNumber700}\nنوع الاحتضان: ${app.incubationType}\n\nاكتب قرار الإدارة: (مقبول / مرفوض / استكمال بيانات)`,
    app.status === 'جديد' ? 'مقبول' : app.status
  );

  if (decision) {
    const notes = prompt('اكتب الملاحظات أو التوجيهات التي ستصل للجمعية:', app.notes);
    updateAppDecision(appId, decision, notes);
  }
};

async function updateAppDecision(id, status, notes) {
  try {
    const res = await fetch(`${API_BASE}/api/applications/decision`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status, notes })
    }).then(r => r.json()).catch(() => null);

    if (res && res.success) {
      showToast(res.message, 'success');
      const idx = STATE.applications.findIndex(a => a.id === id);
      if (idx !== -1) STATE.applications[idx] = res.data;
    } else {
      // Offline fallback
      const app = STATE.applications.find(a => a.id === id);
      if (app) {
        app.status = status;
        if (notes) app.notes = notes;
        if (status === 'مقبول' && app.stageProgress < 25) app.stageProgress = 25;
      }
      showToast('تم تحديث حالة الطلب محلياً بنجاح', 'success');
    }
    renderAdminDashboard();
    renderAssociationDashboard();
  } catch (err) {
    console.error(err);
  }
}

window.adminAdvanceStage = async function(id) {
  try {
    const res = await fetch(`${API_BASE}/api/applications/advance-stage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    }).then(r => r.json()).catch(() => null);

    if (res && res.success) {
      showToast(res.message, 'success');
      const idx = STATE.applications.findIndex(a => a.id === id);
      if (idx !== -1) STATE.applications[idx] = res.data;
    } else {
      // Offline fallback
      const app = STATE.applications.find(a => a.id === id);
      if (app) {
        app.stageProgress = Math.min(100, app.stageProgress + 25);
        if (app.stageProgress >= 75) app.stage = 'المرحلة الرابعة: مسرعة عذق';
        else if (app.stageProgress >= 50) app.stage = 'المرحلة الثالثة: الاحتضان المكاني';
        else if (app.stageProgress >= 25) app.stage = 'المرحلة الثانية: التهيئة المؤسسية';
        if (app.stageProgress === 100) app.status = 'متخرجة بنجاح';
      }
      showToast('تم ترقية مرحلة الاحتضان بنجاح', 'success');
    }
    renderAdminDashboard();
    renderAssociationDashboard();
  } catch (err) {
    console.error(err);
  }
};

// ========================== Modal Management ==========================
function setupModalEvents() {
  // New Application Form
  const formApp = document.getElementById('form-new-application');
  if (formApp) {
    formApp.addEventListener('submit', async (e) => {
      e.preventDefault();
      const payload = {
        associationName: document.getElementById('app-assoc-name').value,
        licenseNumber: document.getElementById('app-assoc-license').value,
        nationalNumber700: document.getElementById('app-assoc-700').value,
        repName: document.getElementById('app-rep-name').value,
        repPhone: document.getElementById('app-rep-phone').value,
        repEmail: document.getElementById('app-rep-email').value,
        field: document.getElementById('app-field').value,
        incubationType: document.getElementById('app-type').value,
        city: "المدينة المنورة"
      };

      try {
        const res = await fetch(`${API_BASE}/api/applications`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }).then(r => r.json()).catch(() => null);

        let created = null;
        if (res && res.success) {
          created = res.data;
          STATE.applications.unshift(created);
          showToast(res.message, 'success');
        } else {
          // Offline fallback
          created = {
            id: `APP-2026-${String(STATE.applications.length + 1).padStart(3, '0')}`,
            ...payload,
            stage: "المرحلة الأولى: احتضان الفكرة",
            stageProgress: 15,
            status: "جديد",
            score: 88,
            notes: "تم استلام الطلب",
            createdAt: new Date().toISOString(),
            workHours: 0,
            volunteerHours: 0,
            evidences: []
          };
          STATE.applications.unshift(created);
          showToast('تم تسجيل طلب الجمعية بنجاح!', 'success');
        }

        STATE.activeAssociation = created;
        closeAllModals();
        switchRole('association');
      } catch (err) {
        console.error(err);
      }
    });
  }

  // New Consultant Form
  const formCns = document.getElementById('form-new-consultant');
  if (formCns) {
    formCns.addEventListener('submit', async (e) => {
      e.preventDefault();
      const payload = {
        name: document.getElementById('cns-reg-name').value,
        title: document.getElementById('cns-reg-title').value,
        specialty: document.getElementById('cns-reg-specialty').value,
        field: document.getElementById('cns-reg-specialty').value,
        experienceYears: parseInt(document.getElementById('cns-reg-exp').value || 5),
        volunteerType: "تطوع تخصصي",
        bio: document.getElementById('cns-reg-bio').value
      };

      try {
        const res = await fetch(`${API_BASE}/api/consultants`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }).then(r => r.json()).catch(() => null);

        let created = null;
        if (res && res.success) {
          created = res.data;
          STATE.consultants.push(created);
          showToast(res.message, 'success');
        } else {
          created = {
            id: `CNS-${String(STATE.consultants.length + 1).padStart(3, '0')}`,
            ...payload,
            consultingHours: 0,
            rating: 5.0,
            status: "معتمد",
            availableSlots: [
              { id: "SLOT-1", day: "الإثنين", time: "05:00 م - 07:00 م", type: "حضوري بالحاضنة", status: "متاح" }
            ]
          };
          STATE.consultants.push(created);
          showToast('تم اعتماد حساب المستشار بنجاح!', 'success');
        }

        STATE.activeConsultant = created;
        closeAllModals();
        switchRole('consultant');
      } catch (err) {
        console.error(err);
      }
    });
  }

  // Facility Booking Form
  const formBk = document.getElementById('form-book-facility');
  if (formBk) {
    formBk.addEventListener('submit', async (e) => {
      e.preventDefault();
      const facilityName = document.getElementById('bk-fac-name').value;
      const date = document.getElementById('bk-date').value;
      const timeSlot = document.getElementById('bk-time').value;
      const purpose = document.getElementById('bk-purpose').value;
      const assocName = STATE.activeAssociation ? STATE.activeAssociation.associationName : "جمعية ديوان الشبابية";

      const payload = {
        facilityId: "FAC-GEN",
        facilityName,
        associationName: assocName,
        bookingDate: date,
        timeSlot,
        purpose
      };

      try {
        const res = await fetch(`${API_BASE}/api/bookings`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }).then(r => r.json()).catch(() => null);

        let created = null;
        if (res && res.success) {
          created = res.data;
          STATE.bookings.unshift(created);
          showToast(res.message, 'success');
        } else {
          created = { id: `BK-${Math.floor(Math.random() * 900) + 100}`, ...payload, status: "مؤكد" };
          STATE.bookings.unshift(created);
          showToast('تم تأكيد حجز المرفق بنجاح!', 'success');
        }

        closeAllModals();
        renderAssociationDashboard();
        renderAdminDashboard();
      } catch (err) {
        console.error(err);
      }
    });
  }

  // Consultation Session Booking Form
  const formCnsBooking = document.getElementById('form-book-consultation');
  if (formCnsBooking) {
    formCnsBooking.addEventListener('submit', async (e) => {
      e.preventDefault();
      const cnsId = document.getElementById('book-cns-id').value;
      const cnsName = document.getElementById('book-cns-name').value;
      const topic = document.getElementById('book-cns-topic').value;
      const date = document.getElementById('book-cns-date').value;
      const time = document.getElementById('book-cns-time').value;
      const mode = document.getElementById('book-cns-mode').value;
      const assocName = STATE.activeAssociation ? STATE.activeAssociation.associationName : "جمعية ديوان الشبابية";

      const payload = {
        associationName: assocName,
        consultantId: cnsId,
        consultantName: cnsName,
        topic,
        sessionDate: date,
        time,
        mode
      };

      try {
        const res = await fetch(`${API_BASE}/api/consultations/book`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }).then(r => r.json()).catch(() => null);

        let created = null;
        if (res && res.success) {
          created = res.data;
          STATE.consultations.unshift(created);
          showToast(res.message, 'success');
        } else {
          created = { id: `CNSLT-${Math.floor(Math.random() * 900) + 100}`, ...payload, status: "مؤكدة", report: "", recommendations: "", loggedHours: 0 };
          STATE.consultations.unshift(created);
          showToast('تم حجز الجلسة بنجاح مع المستشار!', 'success');
        }

        closeAllModals();
        renderAssociationDashboard();
        renderConsultantDashboard();
      } catch (err) {
        console.error(err);
      }
    });
  }

  // Submit Consultation Report Form
  const formReport = document.getElementById('form-submit-report');
  if (formReport) {
    formReport.addEventListener('submit', async (e) => {
      e.preventDefault();
      const id = document.getElementById('report-session-id').value;
      const report = document.getElementById('report-text').value;
      const recommendations = document.getElementById('report-recommendations').value;
      const hours = parseInt(document.getElementById('report-hours').value || 2);

      try {
        const res = await fetch(`${API_BASE}/api/consultations/report`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, report, recommendations, hours })
        }).then(r => r.json()).catch(() => null);

        if (res && res.success) {
          showToast(res.message, 'success');
          const idx = STATE.consultations.findIndex(c => c.id === id);
          if (idx !== -1) STATE.consultations[idx] = res.data;
        } else {
          const cnslt = STATE.consultations.find(c => c.id === id);
          if (cnslt) {
            cnslt.report = report;
            cnslt.recommendations = recommendations;
            cnslt.status = "مكتملة";
            cnslt.loggedHours = hours;
          }
          if (STATE.activeConsultant) {
            STATE.activeConsultant.consultingHours += hours;
          }
          STATE.stats.volunteer_hours = (STATE.stats.volunteer_hours || 16311) + hours;
          STATE.stats.consultations = (STATE.stats.consultations || 28) + 1;
          showToast(`تم حفظ التقرير واحتساب ${hours} ساعات في رصيدك`, 'success');
        }

        closeAllModals();
        renderConsultantDashboard();
        renderAssociationDashboard();
        renderStatsNumbers();
      } catch (err) {
        console.error(err);
      }
    });
  }
}

// Global modal helpers
window.openModal = function(id) {
  const m = document.getElementById(id);
  if (m) m.classList.add('open');
};

window.closeAllModals = function() {
  document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('open'));
};

window.openFacilityBookingModal = function(facilityName) {
  const field = document.getElementById('bk-fac-name');
  if (field) field.value = facilityName;
  openModal('modal-book-facility');
};

window.openBookConsultationModal = function(cnsId, cnsName) {
  const idEl = document.getElementById('book-cns-id');
  const nameEl = document.getElementById('book-cns-name');
  if (idEl) idEl.value = cnsId;
  if (nameEl) nameEl.value = cnsName;
  openModal('modal-book-consultation');
};

window.openSubmitReportModal = function(sessionId) {
  const session = STATE.consultations.find(s => s.id === sessionId);
  if (!session) return;
  document.getElementById('report-session-id').value = sessionId;
  document.getElementById('report-assoc-label').innerText = `${session.associationName} (${session.topic})`;
  document.getElementById('report-text').value = session.report || '';
  document.getElementById('report-recommendations').value = session.recommendations || '';
  openModal('modal-submit-report');
};

window.uploadEvidencePrompt = async function() {
  const app = STATE.activeAssociation;
  if (!app) return;

  const title = prompt('أدخل اسم الوثيقة أو الشاهد المراد رفعه (مثال: اللائحة الأساسية، محضر مجلس الإدارة، تقرير المحاسب):');
  if (!title) return;

  try {
    const res = await fetch(`${API_BASE}/api/applications/evidence`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: app.id, title })
    }).then(r => r.json()).catch(() => null);

    if (res && res.success) {
      showToast(res.message, 'success');
      const idx = STATE.applications.findIndex(a => a.id === app.id);
      if (idx !== -1) STATE.applications[idx] = res.data;
      STATE.activeAssociation = res.data;
    } else {
      if (!app.evidences) app.evidences = [];
      app.evidences.push({ title, date: new Date().toISOString().split('T')[0], status: 'معتمد' });
      showToast('تم إضافة الشاهد بنجاح', 'success');
    }
    renderAssociationDashboard();
  } catch (err) {
    console.error(err);
  }
};

window.printExecutiveReport = function() {
  window.print();
};

// ========================== Interactive Chat Assistant (مساعد عذق) ==========================
function setupChatWidget() {
  const trigger = document.getElementById('chat-trigger-btn');
  const win = document.getElementById('chat-window');
  const close = document.getElementById('chat-close-btn');
  const send = document.getElementById('chat-send-btn');
  const input = document.getElementById('chat-input');
  const messagesBox = document.getElementById('chat-messages');

  if (!trigger || !win) return;

  trigger.addEventListener('click', () => {
    win.classList.toggle('open');
    if (win.classList.contains('open')) {
      input.focus();
    }
  });

  if (close) {
    close.addEventListener('click', () => win.classList.remove('open'));
  }

  const handleSend = async () => {
    const text = input.value.trim();
    if (!text) return;

    // Append user message
    appendChatBubble(text, 'user');
    input.value = '';

    // Query backend
    try {
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: text })
      }).then(r => r.json()).catch(() => null);

      if (res && res.reply) {
        appendChatBubble(res.reply, 'bot');
      } else {
        // Simple fallback
        let reply = "أهلاً بك في حاضنة ومسرعة عذق! يمكنك الاستفسار عن برامجنا (الحوكمة، التدريب، الاستشارات، المقرات)، أو شروط الانضمام، أو رحلة الاحتضان المكونة من 4 مراحل.";
        if (text.includes('مرافق') || text.includes('قاعات')) {
          reply = "توفر الحاضنة أكثر من 13 مقراً مجهزاً، و18 مساحة عمل مشتركة، و3 قاعات استشارية، وقاعات تدريب واجتماعات كبرى، وأركان ضيافة.";
        } else if (text.includes('مراحل') || text.includes('رحلة')) {
          reply = "تمر الجمعيات بـ 4 مراحل تكاملية:\n1. احتضان الفكرة.\n2. التهيئة المؤسسية.\n3. الاحتضان المكاني.\n4. مسرعة عذق.";
        }
        appendChatBubble(reply, 'bot');
      }
    } catch (e) {
      appendChatBubble("مرحباً بك! يسعدنا تواصلك مع حاضنة عذق عبر الهاتف أو البريد الرسمي: ethq@biralmadinah.org.sa", 'bot');
    }
  };

  if (send) send.addEventListener('click', handleSend);
  if (input) {
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleSend();
    });
  }
}

function appendChatBubble(text, sender) {
  const messagesBox = document.getElementById('chat-messages');
  if (!messagesBox) return;
  const bubble = document.createElement('div');
  bubble.className = `chat-bubble chat-bubble-${sender}`;
  bubble.innerText = text;
  messagesBox.appendChild(bubble);
  messagesBox.scrollTop = messagesBox.scrollHeight;
}

window.askBotQuick = function(query) {
  const win = document.getElementById('chat-window');
  if (win && !win.classList.contains('open')) win.classList.add('open');
  const input = document.getElementById('chat-input');
  if (input) {
    input.value = query;
    document.getElementById('chat-send-btn').click();
  }
};

// ========================== Toast Alerts ==========================
function showToast(msg, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span>${type === 'success' ? '✓' : type === 'danger' ? '✕' : 'ℹ'}</span><span>${msg}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-20px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}
