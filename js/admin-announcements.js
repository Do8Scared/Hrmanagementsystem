document.addEventListener('DOMContentLoaded', () => {
  // --- Mock Data ---
  let docs = [
    { id: 'ANN-001', type: 'Policy', title: 'Updated Remote Work Guidelines', refNumber: 'POL-2026-001', publishedDate: '2026-06-01', effectivityDate: '2026-06-15', targetAudience: 'All Employees', requiresAcknowledgement: true, status: 'Published', totalRecipients: 24, readCount: 18, publishedBy: 'Sofia Garcia', content: 'Details about remote work...' },
    { id: 'ANN-002', type: 'Memorandum', title: 'Q3 Office Relocation Schedule', refNumber: 'MEM-2026-012', publishedDate: '2026-06-10', effectivityDate: '2026-07-01', targetAudience: 'Specific Department', targetDepartments: ['Engineering', 'Operations'], requiresAcknowledgement: false, status: 'Published', totalRecipients: 10, readCount: 0, publishedBy: 'Maria Santos', content: 'Moving to the new office...' },
    { id: 'ANN-003', type: 'Advisory', title: 'System Maintenance Window', refNumber: 'ADV-2026-005', publishedDate: '2026-06-14', effectivityDate: '2026-06-16', targetAudience: 'All Employees', requiresAcknowledgement: false, status: 'Published', totalRecipients: 24, readCount: 0, publishedBy: 'Sofia Garcia', content: 'System will be down...' },
    { id: 'ANN-004', type: 'Policy', title: 'Data Privacy Manual Update', refNumber: 'POL-2026-002', publishedDate: '', effectivityDate: '', targetAudience: 'All Employees', requiresAcknowledgement: true, status: 'Draft', totalRecipients: 24, readCount: 0, publishedBy: 'Sofia Garcia', content: 'Draft of new privacy manual...' }
  ];

  let acks = {
    'ANN-001': [
      { employeeId: 'EMP001', employeeName: 'Maria Santos', department: 'Human Resources', role: 'HR Manager', status: 'Read', dateRead: '2026-06-02' },
      { employeeId: 'EMP002', employeeName: 'Juan dela Cruz', department: 'Engineering', role: 'Software Engineer', status: 'Unread' },
      { employeeId: 'EMP005', employeeName: 'Elena Mendoza', department: 'Operations', role: 'Operations Lead', status: 'Pending' }
    ]
  };

  const DEPARTMENTS = ['Engineering', 'Marketing', 'Finance', 'Human Resources', 'Operations', 'Sales', 'Design'];

  const typeConfig = {
    Advisory: { color: 'text-accent', bg: 'bg-secondary', border: 'border-l-blue-500', icon: 'megaphone' },
    Memorandum: { color: 'text-purple-700', bg: 'bg-purple-50', border: 'border-l-purple-500', icon: 'file-text' },
    Policy: { color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-l-emerald-500', icon: 'book-open' }
  };

  const statusConfig = {
    Published: 'bg-emerald-50 text-emerald-700',
    Draft: 'bg-amber-50 text-amber-700',
    Archived: 'bg-gray-100 text-gray-500'
  };

  const ackStatusConfig = {
    Read: { icon: 'check-circle-2', color: 'text-emerald-600', bg: 'bg-emerald-50', label: 'Read' },
    Unread: { icon: 'x', color: 'text-red-500', bg: 'bg-red-50', label: 'Unread' },
    Pending: { icon: 'clock', color: 'text-amber-600', bg: 'bg-amber-50', label: 'Pending' }
  };

  let currentTab = 'All';
  let reminderSent = [];

  // --- Elements ---
  const tbody = document.getElementById('docs-tbody');
  const tabs = document.querySelectorAll('.doc-tab-btn');
  const summary = document.getElementById('docs-summary');
  
  const createMenuBtn = document.getElementById('create-menu-btn');
  const createDropdown = document.getElementById('create-dropdown');
  const slideOver = document.getElementById('slide-over');
  const slideOverPanel = document.getElementById('slide-over-panel');
  
  const viewList = document.getElementById('view-list');
  const viewTracker = document.getElementById('view-tracker');

  // Form Fields
  const formDocId = document.getElementById('form-doc-id');
  const formTitle = document.getElementById('form-title');
  const formRef = document.getElementById('form-ref');
  const formDate = document.getElementById('form-date');
  const formAudience = document.getElementById('form-audience');
  const formDeptsDiv = document.getElementById('form-depts-div');
  const formAckToggle = document.getElementById('form-ack-toggle');
  const formContent = document.getElementById('form-content');
  const docTypeBtns = document.querySelectorAll('.doc-type-btn');
  let currentFormType = 'Advisory';
  let formRequiresAck = false;
  let formSelectedDepts = [];

  function today() { return new Date().toISOString().slice(0, 10); }

  // --- Functions ---
  
  function updateCounts() {
    const pub = docs.filter(d => d.status === 'Published').length;
    const draft = docs.filter(d => d.status === 'Draft').length;
    summary.textContent = `${pub} published · ${draft} drafts`;

    document.getElementById('count-All').textContent = docs.length;
    document.getElementById('count-Advisory').textContent = docs.filter(d => d.type === 'Advisory').length;
    document.getElementById('count-Memorandum').textContent = docs.filter(d => d.type === 'Memorandum').length;
    document.getElementById('count-Policy').textContent = docs.filter(d => d.type === 'Policy').length;
  }

  function renderDocs() {
    tbody.innerHTML = '';
    const filtered = docs.filter(d => currentTab === 'All' || d.type === currentTab);

    if (filtered.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" class="text-center py-6 text-muted-foreground">No documents found.</td></tr>';
    }

    filtered.forEach((doc, i) => {
      const cfg = typeConfig[doc.type];
      const pct = doc.totalRecipients > 0 ? Math.round((doc.readCount / doc.totalRecipients) * 100) : 0;
      
      let readRateHtml = '<span class="text-xs text-muted-foreground">—</span>';
      if (doc.status === 'Published' && doc.requiresAcknowledgement) {
        readRateHtml = `
          <button class="tracker-btn group text-left" data-id="${doc.id}">
            <div class="text-xs text-muted-foreground mb-1 group-hover:text-accent">${doc.readCount} / ${doc.totalRecipients} read</div>
            <div class="w-24 h-1.5 bg-secondary rounded-full overflow-hidden">
              <div class="h-full bg-emerald-500 rounded-full" style="width: ${pct}%"></div>
            </div>
          </button>
        `;
      }

      const tr = document.createElement('tr');
      tr.className = `border-b border-border/50 hover:bg-secondary/20 ${i%2!==0?'bg-secondary/10':''}`;
      tr.innerHTML = `
        <td class="px-5 py-4">
          <div class="font-medium text-sm text-foreground">${doc.title}</div>
          <div class="text-xs text-muted-foreground mt-0.5">${doc.refNumber}</div>
        </td>
        <td class="px-5 py-4">
          <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.color}">
            <i data-lucide="${cfg.icon}" style="width: 11px; height: 11px;"></i> ${doc.type}
          </span>
        </td>
        <td class="px-5 py-4 text-xs text-muted-foreground">${doc.publishedDate || '—'}</td>
        <td class="px-5 py-4 text-xs text-foreground">${doc.targetAudience}</td>
        <td class="px-5 py-4"><span class="px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig[doc.status]}">${doc.status}</span></td>
        <td class="px-5 py-4">${readRateHtml}</td>
        <td class="px-5 py-4">
          <div class="flex gap-1">
            <button class="edit-btn p-1.5 rounded-lg text-muted-foreground hover:bg-amber-50 hover:text-amber-600 transition-colors" data-id="${doc.id}" title="Edit"><i data-lucide="pencil" style="width: 14px; height: 14px;"></i></button>
            ${doc.status !== 'Archived' ? `<button class="archive-btn p-1.5 rounded-lg text-muted-foreground hover:bg-gray-100 hover:text-gray-600 transition-colors" data-id="${doc.id}" title="Archive"><i data-lucide="archive" style="width: 14px; height: 14px;"></i></button>` : ''}
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });

    if(typeof lucide !== 'undefined') lucide.createIcons();

    // Bindings
    document.querySelectorAll('.tracker-btn').forEach(btn => {
      btn.addEventListener('click', (e) => openTracker(e.currentTarget.dataset.id));
    });
    document.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', (e) => openForm(e.currentTarget.dataset.id));
    });
    document.querySelectorAll('.archive-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const d = docs.find(x => x.id === e.currentTarget.dataset.id);
        if(d) { d.status = 'Archived'; renderDocs(); updateCounts(); }
      });
    });
  }

  // --- Form Logic ---

  function openForm(docId = null, defaultType = 'Advisory') {
    createDropdown.classList.add('hidden');
    
    // Reset
    formDocId.value = '';
    formTitle.value = '';
    formDate.value = '';
    formAudience.value = 'All Employees';
    formContent.value = '';
    formRequiresAck = false;
    formSelectedDepts = [];
    currentFormType = defaultType;
    
    if (docId) {
      const doc = docs.find(d => d.id === docId);
      if(doc) {
        formDocId.value = doc.id;
        currentFormType = doc.type;
        formTitle.value = doc.title;
        formRef.value = doc.refNumber;
        formDate.value = doc.effectivityDate;
        formAudience.value = doc.targetAudience;
        formContent.value = doc.content;
        formRequiresAck = doc.requiresAcknowledgement;
        formSelectedDepts = doc.targetDepartments || [];
      }
    } else {
      const prefix = currentFormType === 'Advisory' ? 'ADV' : currentFormType === 'Memorandum' ? 'MEM' : 'POL';
      const num = String(docs.filter(d => d.type === currentFormType).length + 1).padStart(3, '0');
      formRef.value = `${prefix}-2026-${num}`;
    }

    updateFormUI();
    
    slideOver.classList.remove('hidden');
    setTimeout(() => {
      slideOverPanel.classList.remove('translate-x-full');
    }, 10);
  }

  function closeForm() {
    slideOverPanel.classList.add('translate-x-full');
    setTimeout(() => {
      slideOver.classList.add('hidden');
    }, 300);
  }

  function updateFormUI() {
    docTypeBtns.forEach(b => {
      const val = b.dataset.val;
      if (val === currentFormType) {
        b.className = `doc-type-btn flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 text-sm font-medium ${typeConfig[val].bg} ${typeConfig[val].color} border-current`;
      } else {
        b.className = `doc-type-btn flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 text-sm font-medium border-border text-muted-foreground hover:border-primary/30`;
      }
    });

    if (formAudience.value === 'Specific Department') {
      formDeptsDiv.classList.remove('hidden');
      formDeptsDiv.innerHTML = DEPARTMENTS.map(d => `
        <button type="button" class="dept-btn px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${formSelectedDepts.includes(d) ? 'bg-primary text-white' : 'bg-secondary text-muted-foreground hover:bg-border'}" data-dept="${d}">${d}</button>
      `).join('');
      document.querySelectorAll('.dept-btn').forEach(b => {
        b.addEventListener('click', (e) => {
          const dept = e.target.dataset.dept;
          if (formSelectedDepts.includes(dept)) formSelectedDepts = formSelectedDepts.filter(x => x !== dept);
          else formSelectedDepts.push(dept);
          updateFormUI();
        });
      });
    } else {
      formDeptsDiv.classList.add('hidden');
    }

    const toggleSpan = formAckToggle.querySelector('span');
    if (formRequiresAck) {
      formAckToggle.classList.replace('bg-gray-300', 'bg-primary');
      toggleSpan.classList.replace('left-0.5', 'left-5');
    } else {
      formAckToggle.classList.replace('bg-primary', 'bg-gray-300');
      toggleSpan.classList.replace('left-5', 'left-0.5');
    }

    if(typeof lucide !== 'undefined') lucide.createIcons();
  }

  function saveDoc(publish) {
    if(!formTitle.value.trim()) return alert("Title is required");

    const newDoc = {
      id: formDocId.value || `ANN-${String(docs.length+1).padStart(3,'0')}`,
      type: currentFormType,
      title: formTitle.value,
      refNumber: formRef.value,
      effectivityDate: formDate.value,
      targetAudience: formAudience.value,
      targetDepartments: [...formSelectedDepts],
      requiresAcknowledgement: formRequiresAck,
      content: formContent.value,
      status: publish ? 'Published' : 'Draft',
      publishedDate: publish ? today() : '',
      publishedBy: 'Admin User',
      totalRecipients: formAudience.value === 'All Employees' ? 24 : formAudience.value === 'Managers Only' ? 6 : 8,
      readCount: 0
    };

    if (formDocId.value) {
      const idx = docs.findIndex(d => d.id === formDocId.value);
      if(idx !== -1) {
        if(!publish) newDoc.publishedDate = docs[idx].publishedDate; // Keep if previously published
        docs[idx] = { ...docs[idx], ...newDoc };
      }
    } else {
      docs.unshift(newDoc);
    }

    closeForm();
    renderDocs();
    updateCounts();
  }

  // --- Tracker ---

  function openTracker(docId) {
    const doc = docs.find(d => d.id === docId);
    if(!doc) return;

    viewList.classList.add('hidden');
    viewTracker.classList.remove('hidden');

    reminderSent = [];
    const tAcks = acks[doc.id] || [];

    const cfg = typeConfig[doc.type];
    document.getElementById('tracker-icon-container').className = `w-10 h-10 rounded-xl ${cfg.bg} flex items-center justify-center flex-shrink-0`;
    document.getElementById('tracker-icon-container').innerHTML = `<i data-lucide="${cfg.icon}" class="${cfg.color}" style="width:18px; height:18px;"></i>`;
    
    document.getElementById('tracker-doc-type').className = `inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold mb-1 ${cfg.bg} ${cfg.color}`;
    document.getElementById('tracker-doc-type').textContent = doc.type;
    
    document.getElementById('tracker-doc-title').textContent = doc.title;
    document.getElementById('tracker-doc-meta').textContent = `Ref: ${doc.refNumber} · Published ${doc.publishedDate}`;

    // Stats
    const readC = tAcks.filter(a => a.status === 'Read').length;
    const unreadC = tAcks.filter(a => a.status === 'Unread').length;
    const pendingC = tAcks.filter(a => a.status === 'Pending').length;

    document.getElementById('tracker-stats').innerHTML = `
      <div class="rounded-xl border p-4 bg-card">
        <div class="text-2xl font-bold text-foreground">${doc.totalRecipients}</div><div class="text-xs text-muted-foreground mt-0.5">Total Recipients</div>
      </div>
      <div class="rounded-xl border p-4 bg-emerald-50 border-emerald-100">
        <div class="text-2xl font-bold text-emerald-700">${readC}</div><div class="text-xs text-muted-foreground mt-0.5">Read</div>
      </div>
      <div class="rounded-xl border p-4 bg-red-50 border-red-100">
        <div class="text-2xl font-bold text-red-600">${unreadC}</div><div class="text-xs text-muted-foreground mt-0.5">Unread</div>
      </div>
      <div class="rounded-xl border p-4 bg-amber-50 border-amber-100">
        <div class="text-2xl font-bold text-amber-700">${pendingC}</div><div class="text-xs text-muted-foreground mt-0.5">Pending</div>
      </div>
    `;

    renderTrackerTable(tAcks);
  }

  function renderTrackerTable(tAcks) {
    const tbody = document.getElementById('tracker-tbody');
    tbody.innerHTML = '';
    
    if(tAcks.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" class="text-center py-6 text-muted-foreground">No acknowledgements found.</td></tr>';
      return;
    }

    tAcks.forEach((ack, i) => {
      const sc = ackStatusConfig[ack.status];
      const sent = reminderSent.includes(ack.employeeId);

      const actionHtml = ack.status !== 'Read' ? `
        <button class="send-rem-btn flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${sent ? 'bg-emerald-50 text-emerald-700' : 'border border-border text-muted-foreground hover:bg-secondary'}" data-emp="${ack.employeeId}">
          <i data-lucide="${sent ? 'check' : 'send'}" style="width:11px; height:11px;"></i> ${sent ? 'Sent' : 'Send Reminder'}
        </button>
      ` : '';

      const tr = document.createElement('tr');
      tr.className = `border-b border-border/50 hover:bg-secondary/20 ${i % 2 !== 0 ? 'bg-secondary/10' : ''}`;
      tr.innerHTML = `
        <td class="px-5 py-3">
          <div class="flex items-center gap-2.5">
            <div class="w-7 h-7 rounded-full bg-primary flex items-center justify-center"><span class="text-white text-xs font-semibold">${ack.employeeName.substring(0,2).toUpperCase()}</span></div>
            <span class="text-sm font-medium text-foreground">${ack.employeeName}</span>
          </div>
        </td>
        <td class="px-5 py-3 text-sm text-muted-foreground">${ack.department}</td>
        <td class="px-5 py-3 text-sm text-muted-foreground">${ack.role}</td>
        <td class="px-5 py-3 text-sm text-foreground">${ack.dateRead ?? '—'}</td>
        <td class="px-5 py-3"><span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${sc.bg} ${sc.color}"><i data-lucide="${sc.icon}" style="width:12px; height:12px;"></i> ${sc.label}</span></td>
        <td class="px-5 py-3">${actionHtml}</td>
      `;
      tbody.appendChild(tr);
    });

    if(typeof lucide !== 'undefined') lucide.createIcons();

    document.querySelectorAll('.send-rem-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        reminderSent.push(e.currentTarget.dataset.emp);
        renderTrackerTable(tAcks);
      });
    });
  }

  // --- Listeners ---

  tabs.forEach(t => {
    t.addEventListener('click', (e) => {
      tabs.forEach(tab => {
        tab.classList.remove('border-primary', 'text-primary');
        tab.classList.add('border-transparent', 'text-muted-foreground');
        tab.querySelector('span').className = "ml-2 text-xs px-1.5 py-0.5 rounded-full bg-secondary text-muted-foreground";
      });
      e.currentTarget.classList.remove('border-transparent', 'text-muted-foreground');
      e.currentTarget.classList.add('border-primary', 'text-primary');
      e.currentTarget.querySelector('span').className = "ml-2 text-xs px-1.5 py-0.5 rounded-full bg-primary/10 text-primary";
      
      currentTab = e.currentTarget.dataset.tab;
      renderDocs();
    });
  });

  createMenuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    createDropdown.classList.toggle('hidden');
  });
  document.addEventListener('click', () => createDropdown.classList.add('hidden'));
  
  document.querySelectorAll('.create-option').forEach(btn => {
    btn.addEventListener('click', (e) => {
      openForm(null, e.currentTarget.dataset.type);
    });
  });

  docTypeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      currentFormType = e.currentTarget.dataset.val;
      const prefix = currentFormType === 'Advisory' ? 'ADV' : currentFormType === 'Memorandum' ? 'MEM' : 'POL';
      const num = String(docs.filter(d => d.type === currentFormType).length + 1).padStart(3, '0');
      formRef.value = `${prefix}-2026-${num}`;
      updateFormUI();
    });
  });

  formAudience.addEventListener('change', updateFormUI);
  formAckToggle.addEventListener('click', () => { formRequiresAck = !formRequiresAck; updateFormUI(); });

  document.getElementById('close-form-btn').addEventListener('click', closeForm);
  document.getElementById('cancel-form-btn').addEventListener('click', closeForm);
  document.getElementById('slide-over-bg').addEventListener('click', closeForm);

  document.getElementById('save-draft-btn').addEventListener('click', () => saveDoc(false));
  document.getElementById('publish-btn').addEventListener('click', () => saveDoc(true));

  document.getElementById('tracker-back-btn').addEventListener('click', () => {
    viewTracker.classList.add('hidden');
    viewList.classList.remove('hidden');
  });

  document.getElementById('tracker-remind-all').addEventListener('click', () => {
    document.getElementById('tracker-remind-text').textContent = 'Reminders Sent ✓';
    document.querySelectorAll('.send-rem-btn').forEach(b => b.click());
  });

  // Init
  updateCounts();
  renderDocs();
  if (typeof lucide !== 'undefined') lucide.createIcons();
});
