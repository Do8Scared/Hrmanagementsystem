document.addEventListener('DOMContentLoaded', () => {
  const docs = [
    { id: 'ANN-001', type: 'Policy', title: 'Updated Remote Work Guidelines', refNumber: 'POL-2026-001', publishedDate: '2026-06-01', effectivityDate: '2026-06-15', targetAudience: 'All Employees', requiresAcknowledgement: true, publishedBy: 'Sofia Garcia', content: 'This policy outlines the updated guidelines for remote work arrangements effective June 15, 2026. All employees working remotely are required to maintain core hours between 9:00 AM and 3:00 PM, ensure stable internet connectivity, attend all scheduled meetings, and complete their assigned tasks as evaluated by their direct supervisor. Requests for remote work must be submitted one week in advance and are subject to management approval.' },
    { id: 'ANN-002', type: 'Memorandum', title: 'Q3 Office Relocation Schedule', refNumber: 'MEM-2026-012', publishedDate: '2026-06-10', effectivityDate: '2026-07-01', targetAudience: 'Specific Department', targetDepartments: ['Engineering', 'Operations'], requiresAcknowledgement: false, publishedBy: 'Maria Santos', content: 'This memorandum informs the Engineering and Operations departments of the planned office relocation scheduled for July 1, 2026. All personal items and workstation equipment must be packed and labeled by June 28, 2026. The facilities team will handle the physical move. Please coordinate with your department head for specific logistical requirements.' },
    { id: 'ANN-003', type: 'Advisory', title: 'System Maintenance Window', refNumber: 'ADV-2026-005', publishedDate: '2026-06-14', effectivityDate: '2026-06-16', targetAudience: 'All Employees', requiresAcknowledgement: false, publishedBy: 'Sofia Garcia', content: 'The company HR information system will undergo scheduled maintenance on June 16, 2026 from 12:00 AM to 4:00 AM. During this period, attendance logging, payroll access, and leave filing will be temporarily unavailable. Please complete any urgent tasks before the maintenance window begins.' },
  ];

  const TYPE_CONFIG = {
    Advisory:   { color: 'text-accent',      bg: 'bg-secondary',  icon: 'megaphone'  },
    Memorandum: { color: 'text-purple-700',  bg: 'bg-purple-50',  icon: 'file-text'  },
    Policy:     { color: 'text-emerald-700', bg: 'bg-emerald-50', icon: 'book-open'  },
  };

  let acknowledged = ['ANN-001'];
  let currentTab = 'All';

  const createBtn = document.getElementById('create-menu-btn');
  if (createBtn) createBtn.style.display = 'none';

  function updateCounts() {
    const countEl = document.getElementById('count-All');
    if (countEl) countEl.textContent = docs.length;
    ['Advisory', 'Memorandum', 'Policy'].forEach(t => {
      const el = document.getElementById('count-' + t);
      if (el) el.textContent = docs.filter(d => d.type === t).length;
    });
    const summary = document.getElementById('docs-summary');
    if (summary) summary.textContent = docs.length + ' published announcements';
  }

  function renderDocs() {
    const tbody = document.getElementById('docs-tbody');
    if (!tbody) return;
    const filtered = docs.filter(d => currentTab === 'All' || d.type === currentTab);
    tbody.innerHTML = '';

    if (!filtered.length) {
      tbody.innerHTML = '<tr><td colspan="7" class="text-center py-8 text-muted-foreground">No announcements found.</td></tr>';
      return;
    }

    filtered.forEach((doc, i) => {
      const cfg = TYPE_CONFIG[doc.type];
      const isAcked = acknowledged.includes(doc.id);
      const needsAck = doc.requiresAcknowledgement && !isAcked;

      const ackCell = doc.requiresAcknowledgement
        ? isAcked
          ? '<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700"><i data-lucide="check-circle-2" style="width:12px;height:12px;"></i> Acknowledged</span>'
          : '<button class="ack-btn inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-primary text-primary text-xs font-medium hover:bg-primary hover:text-white transition-all" data-id="' + doc.id + '"><i data-lucide="check" style="width:12px;height:12px;"></i> Acknowledge</button>'
        : '<span class="text-xs text-muted-foreground">&mdash;</span>';

      const tr = document.createElement('tr');
      tr.className = 'border-b border-border/50 hover:bg-gray-50 transition-colors cursor-pointer' + (i % 2 ? ' bg-secondary/10' : '');
      tr.innerHTML = '<td class="px-5 py-4"><div class="font-medium text-sm text-foreground flex items-center gap-2">' +
        (needsAck ? '<span class="w-2 h-2 rounded-full bg-primary flex-shrink-0 inline-block"></span>' : '') +
        doc.title + '</div><div class="text-xs text-muted-foreground mt-0.5">' + doc.refNumber + '</div></td>' +
        '<td class="px-5 py-4"><span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ' + cfg.bg + ' ' + cfg.color + '"><i data-lucide="' + cfg.icon + '" style="width:11px;height:11px;"></i> ' + doc.type + '</span></td>' +
        '<td class="px-5 py-4 text-xs text-muted-foreground">' + doc.publishedDate + '</td>' +
        '<td class="px-5 py-4 text-xs text-foreground">' + doc.targetAudience + '</td>' +
        '<td class="px-5 py-4"><span class="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">Published</span></td>' +
        '<td class="px-5 py-4">' + ackCell + '</td>' +
        '<td class="px-5 py-4"><button class="view-btn p-1.5 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors" data-id="' + doc.id + '"><i data-lucide="eye" style="width:14px;height:14px;"></i></button></td>';

      tr.addEventListener('click', e => { if (!e.target.closest('.ack-btn')) openDoc(doc.id); });
      tbody.appendChild(tr);
    });

    if (typeof lucide !== 'undefined') lucide.createIcons();

    tbody.querySelectorAll('.ack-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        acknowledged.push(e.currentTarget.dataset.id);
        renderDocs();
      });
    });
    tbody.querySelectorAll('.view-btn').forEach(btn => {
      btn.addEventListener('click', e => { e.stopPropagation(); openDoc(e.currentTarget.dataset.id); });
    });
  }

  function openDoc(docId) {
    const doc = docs.find(d => d.id === docId);
    if (!doc) return;
    const cfg = TYPE_CONFIG[doc.type];
    const isAcked = acknowledged.includes(doc.id);
    const panel = document.getElementById('slide-over-panel');
    const overlay = document.getElementById('slide-over');
    if (!panel || !overlay) return;

    panel.innerHTML =
      '<div class="flex flex-col h-full">' +
        '<div class="flex items-center justify-between px-6 py-5 border-b border-border">' +
          '<div class="flex items-center gap-3">' +
            '<div class="w-10 h-10 rounded-xl ' + cfg.bg + ' flex items-center justify-center flex-shrink-0"><i data-lucide="' + cfg.icon + '" class="' + cfg.color + '" style="width:18px;height:18px;"></i></div>' +
            '<div><span class="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold mb-0.5 ' + cfg.bg + ' ' + cfg.color + '">' + doc.type + '</span><h3 class="font-semibold text-foreground text-sm leading-tight">' + doc.title + '</h3></div>' +
          '</div>' +
          '<button id="close-doc-btn" class="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground"><i data-lucide="x" style="width:18px;height:18px;"></i></button>' +
        '</div>' +
        '<div class="flex-1 overflow-y-auto p-6 space-y-5">' +
          '<div class="grid grid-cols-2 gap-3">' +
            '<div class="rounded-xl p-4 bg-secondary"><div class="text-xs text-muted-foreground mb-0.5">Reference No.</div><div class="text-sm font-semibold text-foreground">' + doc.refNumber + '</div></div>' +
            '<div class="rounded-xl p-4 bg-secondary"><div class="text-xs text-muted-foreground mb-0.5">Published By</div><div class="text-sm font-semibold text-foreground">' + doc.publishedBy + '</div></div>' +
            '<div class="rounded-xl p-4 bg-secondary"><div class="text-xs text-muted-foreground mb-0.5">Date Published</div><div class="text-sm font-semibold text-foreground">' + doc.publishedDate + '</div></div>' +
            '<div class="rounded-xl p-4 bg-secondary"><div class="text-xs text-muted-foreground mb-0.5">Effectivity Date</div><div class="text-sm font-semibold text-foreground">' + (doc.effectivityDate || '&mdash;') + '</div></div>' +
          '</div>' +
          '<div><div class="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Content</div><p class="text-sm text-foreground leading-relaxed">' + doc.content + '</p></div>' +
          (doc.requiresAcknowledgement
            ? '<div class="pt-4 border-t border-border">' +
                (isAcked
                  ? '<div class="flex items-center gap-2 text-sm font-medium text-emerald-700"><i data-lucide="check-circle-2" style="width:18px;height:18px;"></i> You have acknowledged this document.</div>'
                  : '<button id="modal-ack-btn" data-id="' + doc.id + '" class="w-full py-3 rounded-xl font-bold text-sm text-white hover:opacity-90 transition-all" style="background:var(--primary);">Acknowledge this Document</button>') +
              '</div>'
            : '') +
        '</div>' +
      '</div>';

    overlay.classList.remove('hidden');
    setTimeout(() => panel.classList.remove('translate-x-full'), 10);
    if (typeof lucide !== 'undefined') lucide.createIcons();

    document.getElementById('close-doc-btn').addEventListener('click', closeDoc);
    const ackBtn = document.getElementById('modal-ack-btn');
    if (ackBtn) {
      ackBtn.addEventListener('click', () => {
        acknowledged.push(ackBtn.dataset.id);
        closeDoc();
        renderDocs();
      });
    }
  }

  function closeDoc() {
    const panel = document.getElementById('slide-over-panel');
    const overlay = document.getElementById('slide-over');
    if (panel) panel.classList.add('translate-x-full');
    setTimeout(() => { if (overlay) overlay.classList.add('hidden'); }, 300);
  }

  const bgEl = document.getElementById('slide-over-bg');
  if (bgEl) bgEl.addEventListener('click', closeDoc);

  document.querySelectorAll('.doc-tab-btn').forEach(t => {
    t.addEventListener('click', e => {
      document.querySelectorAll('.doc-tab-btn').forEach(tab => {
        tab.classList.remove('border-primary', 'text-primary');
        tab.classList.add('border-transparent', 'text-muted-foreground');
        tab.querySelector('span').className = 'ml-2 text-xs px-1.5 py-0.5 rounded-full bg-secondary text-muted-foreground';
      });
      e.currentTarget.classList.remove('border-transparent', 'text-muted-foreground');
      e.currentTarget.classList.add('border-primary', 'text-primary');
      e.currentTarget.querySelector('span').className = 'ml-2 text-xs px-1.5 py-0.5 rounded-full bg-primary/10 text-primary';
      currentTab = e.currentTarget.dataset.tab;
      renderDocs();
    });
  });

  updateCounts();
  renderDocs();
  if (typeof lucide !== 'undefined') lucide.createIcons();
});
