document.addEventListener('DOMContentLoaded', () => {
  // --- Mock Data ---
  let ntes = [
    { id: 'NTE-1718500000', employeeId: 'EMP002', employeeName: 'Juan dela Cruz', department: 'Engineering', issuedBy: 'Sofia Garcia', issuedByRole: 'admin', assignedTo: 'Sofia Garcia', issuedDate: '2026-06-16', incidentDate: '2026-06-15', incidentType: 'Habitual Tardiness', description: 'Late for 5 consecutive days without prior notice.', responseDeadline: '2026-06-21', status: 'Pending Explanation', escalationRequired: false, auditLog: [{ id: 'AL-1', action: 'NTE Issued', performedBy: 'Sofia Garcia', role: 'admin', timestamp: '2026-06-16, 09:00:00' }] },
    { id: 'NTE-1718400000', employeeId: 'EMP005', employeeName: 'Elena Mendoza', department: 'Operations', issuedBy: 'Sofia Garcia', issuedByRole: 'admin', assignedTo: 'Sofia Garcia', issuedDate: '2026-06-15', incidentDate: '2026-06-14', incidentType: 'Misconduct', description: 'Altercation with a coworker.', responseDeadline: '2026-06-20', status: 'Explanation Submitted', escalationRequired: false, explanationLetter: { filename: 'Explanation_Mendoza.pdf', submittedDate: '2026-06-18', submittedBy: 'Elena Mendoza' }, auditLog: [{ id: 'AL-2', action: 'NTE Issued', performedBy: 'Sofia Garcia', role: 'admin', timestamp: '2026-06-15, 10:00:00' }, { id: 'AL-3', action: 'Explanation Submitted', performedBy: 'Elena Mendoza', role: 'employee', timestamp: '2026-06-18, 14:00:00' }] },
    { id: 'NTE-1718300000', employeeId: 'EMP010', employeeName: 'Antonio Reyes', department: 'Marketing', issuedBy: 'Maria Santos', issuedByRole: 'manager', assignedTo: 'Sofia Garcia', issuedDate: '2026-06-14', incidentDate: '2026-06-13', incidentType: 'Insubordination', description: 'Refused to follow project guidelines.', responseDeadline: '2026-06-19', status: 'Under Review', escalationRequired: true, escalationApprovedBy: 'Sofia Garcia', escalationApprovedDate: '2026-06-14', managerRecommendation: 'Written warning suggested.', explanationLetter: { filename: 'Response_Reyes.pdf', submittedDate: '2026-06-16', submittedBy: 'Antonio Reyes' }, auditLog: [] }
  ];

  let nods = [];

  const employees = [
    { id: 'EMP001', name: 'Maria Santos', department: 'Human Resources' },
    { id: 'EMP002', name: 'Juan dela Cruz', department: 'Engineering' },
    { id: 'EMP004', name: 'Pedro Garcia', department: 'Finance' },
    { id: 'EMP005', name: 'Elena Mendoza', department: 'Operations' },
    { id: 'EMP008', name: 'Miguel Cruz', department: 'Engineering' },
    { id: 'EMP010', name: 'Antonio Reyes', department: 'Marketing' }
  ];

  const templates = [
    { id: 'TPL-1', type: 'NTE', name: 'Standard Tardiness', subject: 'Notice to Explain: Habitual Tardiness', body: 'Please explain in writing within 5 days why no disciplinary action should be taken regarding your tardiness on the following dates: [DATES].' },
    { id: 'TPL-2', type: 'NOD', name: 'Warning (Tardiness)', decisionType: 'Written Warning', subject: 'Notice of Decision: Written Warning', body: 'After reviewing your explanation, management has decided to issue a written warning. Further infractions will result in sterner penalties.' }
  ];

  const INCIDENT_TYPES = ['Habitual Tardiness', 'Absenteeism Without Leave', 'Insubordination', 'Unsatisfactory Work Quality', 'Misconduct', 'Violation of Company Policy', 'Other'];

  const statusCfg = {
    'Pending Explanation': { bg: 'bg-amber-100', text: 'text-amber-800', dot: 'bg-amber-500' },
    'Explanation Submitted': { bg: 'bg-violet-100', text: 'text-violet-800', dot: 'bg-violet-500' },
    'Under Review': { bg: 'bg-purple-100', text: 'text-purple-800', dot: 'bg-purple-500' },
    'Decision Issued': { bg: 'bg-orange-100', text: 'text-orange-800', dot: 'bg-orange-500' },
    'Closed': { bg: 'bg-emerald-100', text: 'text-emerald-800', dot: 'bg-emerald-500' },
    'Voided': { bg: 'bg-gray-100', text: 'text-gray-500', dot: 'bg-gray-400' }
  };

  const decisionCfg = {
    'Written Warning': 'bg-amber-100 text-amber-800',
    'Suspension': 'bg-orange-100 text-orange-800',
    'Dismissal': 'bg-red-100 text-red-800',
    'Exonerated': 'bg-emerald-100 text-emerald-800'
  };

  function today() { return new Date().toISOString().slice(0, 10); }

  // --- Elements ---
  const casesTbody = document.getElementById('cases-tbody');
  const searchInput = document.getElementById('search-cases');
  const filterStatus = document.getElementById('filter-status');
  const tabs = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  // Modals
  const detailModal = document.getElementById('detail-modal');
  const detailModalContent = document.getElementById('detail-modal-content');
  const issueNteModal = document.getElementById('issue-nte-modal');
  const issueNodModal = document.getElementById('issue-nod-modal');
  
  // Forms
  const issueNteForm = document.getElementById('issue-nte-form');
  const issueNodForm = document.getElementById('issue-nod-form');
  const nteEmployee = document.getElementById('nte-employee');
  const nteType = document.getElementById('nte-type');
  
  const nodDecisionBtns = document.querySelectorAll('.decision-btn');
  const nodDecisionInput = document.getElementById('nod-decision');
  const suspensionDaysDiv = document.getElementById('suspension-days-div');
  const nodDaysInput = document.getElementById('nod-days');

  // Populate Selects
  nteEmployee.innerHTML = '<option value="">Select employee...</option>' + employees.map(e => `<option value="${e.id}">${e.name} — ${e.department}</option>`).join('');
  nteType.innerHTML = '<option value="">Select type...</option>' + INCIDENT_TYPES.map(t => `<option value="${t}">${t}</option>`).join('');

  document.getElementById('nte-deadline').min = new Date(new Date().setDate(new Date().getDate() + 5)).toISOString().slice(0, 10);

  // --- Functions ---
  
  function renderCases() {
    const search = searchInput.value.toLowerCase();
    const status = filterStatus.value;
    
    casesTbody.innerHTML = '';
    const filtered = ntes.filter(n => {
      const matchSearch = n.employeeName.toLowerCase().includes(search) || n.id.toLowerCase().includes(search);
      const matchStatus = status === 'All' || n.status === status;
      return matchSearch && matchStatus;
    });

    if (filtered.length === 0) {
      casesTbody.innerHTML = '<tr><td colspan="7" class="text-center py-6 text-muted-foreground">No cases found.</td></tr>';
    }

    filtered.forEach(n => {
      const tr = document.createElement('tr');
      tr.className = "border-b border-border/50 hover:bg-secondary/20 transition-colors";
      
      const c = statusCfg[n.status];
      const statusHtml = `<span class="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-semibold ${c.bg} ${c.text}"><span class="w-1.5 h-1.5 rounded-full ${c.dot}"></span>${n.status}</span>`;
      
      tr.innerHTML = `
        <td class="px-4 py-3 text-xs font-mono text-primary font-medium">${n.id}</td>
        <td class="px-4 py-3">
          <div class="text-sm font-semibold text-foreground">${n.employeeName}</div>
          <div class="text-[10px] text-muted-foreground uppercase tracking-wider">${n.department}</div>
        </td>
        <td class="px-4 py-3 text-xs text-foreground">${n.incidentType}</td>
        <td class="px-4 py-3 text-xs text-muted-foreground">${n.issuedDate}</td>
        <td class="px-4 py-3">${statusHtml}</td>
        <td class="px-4 py-3 text-xs text-muted-foreground">${n.assignedTo}</td>
        <td class="px-4 py-3">
          <button class="view-case-btn px-3 py-1.5 rounded-lg text-xs font-bold border border-border text-foreground hover:bg-secondary transition-colors" data-id="${n.id}">View Details</button>
        </td>
      `;
      casesTbody.appendChild(tr);
    });

    document.querySelectorAll('.view-case-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        openDetailModal(e.currentTarget.dataset.id);
      });
    });
  }

  function renderReports() {
    const container = document.getElementById('reports-container');
    const total = ntes.length;
    const active = ntes.filter(n => !['Closed', 'Voided'].includes(n.status)).length;
    const nodCount = nods.length;

    container.innerHTML = `
      <div class="grid grid-cols-3 gap-4">
        <div class="bg-card rounded-xl border border-border p-4">
          <div class="text-2xl font-bold text-foreground">${total}</div>
          <div class="text-xs text-muted-foreground mt-0.5">Total Cases</div>
        </div>
        <div class="bg-card rounded-xl border border-border p-4">
          <div class="text-2xl font-bold text-amber-700">${active}</div>
          <div class="text-xs text-muted-foreground mt-0.5">Active Cases</div>
        </div>
        <div class="bg-card rounded-xl border border-border p-4">
          <div class="text-2xl font-bold text-purple-700">${nodCount}</div>
          <div class="text-xs text-muted-foreground mt-0.5">NODs Issued</div>
        </div>
      </div>
      <div class="bg-secondary/20 p-5 rounded-xl border border-border mt-5">
        <h3 class="font-bold text-sm mb-3">Cases by Department</h3>
        <div class="space-y-2">
          ${Object.entries(ntes.reduce((acc, curr) => { acc[curr.department] = (acc[curr.department]||0)+1; return acc; }, {})).map(([d, c]) => `
            <div class="flex items-center justify-between text-sm">
              <span class="text-muted-foreground">${d}</span>
              <span class="font-bold text-foreground">${c}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  function renderTemplates() {
    const container = document.getElementById('templates-container');
    container.innerHTML = '';
    templates.forEach(t => {
      container.innerHTML += `
        <div class="bg-secondary/10 border border-border rounded-xl p-4 flex flex-col gap-3">
          <div class="flex items-center gap-2">
            <div class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${t.type === 'NTE' ? 'bg-amber-100 text-amber-800' : 'bg-purple-100 text-purple-800'}">${t.type}</div>
            ${t.decisionType ? `<div class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${decisionCfg[t.decisionType]}">${t.decisionType}</div>` : ''}
          </div>
          <div class="font-bold text-foreground text-sm">${t.name}</div>
          <div class="text-xs text-muted-foreground italic line-clamp-2">${t.subject}</div>
          <div class="text-xs text-foreground bg-white border border-border p-2 rounded mt-2">${t.body}</div>
        </div>
      `;
    });
  }

  function openDetailModal(id) {
    const nte = ntes.find(n => n.id === id);
    const nod = nods.find(n => n.nteId === id);
    const c = statusCfg[nte.status];

    let actionsHtml = '';
    if (nte.status !== 'Voided' && nte.status !== 'Closed') {
      let btns = '';
      if (nte.status === 'Explanation Submitted' && !nod) {
        btns += `<button id="mark-review-btn" class="px-4 py-2 rounded-lg bg-purple-600 text-white text-sm font-bold hover:bg-purple-700">Mark Under Review</button>`;
      }
      if (nte.status === 'Under Review' && !nod) {
        btns += `<button id="issue-nod-open-btn" class="px-4 py-2 rounded-lg bg-primary text-white text-sm font-bold hover:bg-primary/90">Issue NOD</button>`;
      }
      btns += `<button id="void-btn" class="px-4 py-2 rounded-lg border border-red-200 text-sm font-bold text-red-600 hover:bg-red-50 ml-auto">Void NTE</button>`;
      actionsHtml = `<div class="flex items-center gap-2 px-6 py-4 border-t border-border bg-secondary/20 flex-shrink-0">${btns}</div>`;
    }

    detailModalContent.innerHTML = `
      <div class="flex items-center justify-between px-6 py-5 border-b border-border sticky top-0 bg-white">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <span class="font-black text-lg text-foreground">${nte.id}</span>
            <span class="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-semibold ${c.bg} ${c.text}"><span class="w-1.5 h-1.5 rounded-full ${c.dot}"></span>${nte.status}</span>
          </div>
          <div class="text-xs text-muted-foreground">${nte.employeeName} · ${nte.department}</div>
        </div>
        <button class="close-modal-btn p-1.5 rounded-lg hover:bg-secondary text-muted-foreground"><i data-lucide="x" style="width: 18px; height: 18px;"></i></button>
      </div>
      <div class="p-6 space-y-5">
        <div class="grid grid-cols-2 gap-4">
          <div class="bg-secondary/40 rounded-xl px-4 py-3"><div class="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-1">Incident Date</div><div class="text-sm font-bold text-foreground">${nte.incidentDate}</div></div>
          <div class="bg-secondary/40 rounded-xl px-4 py-3"><div class="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-1">Deadline</div><div class="text-sm font-bold text-foreground">${nte.responseDeadline}</div></div>
          <div class="bg-secondary/40 rounded-xl px-4 py-3"><div class="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-1">Type</div><div class="text-sm font-bold text-red-600">${nte.incidentType}</div></div>
          <div class="bg-secondary/40 rounded-xl px-4 py-3"><div class="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-1">Issued By</div><div class="text-sm font-bold text-foreground">${nte.issuedBy}</div></div>
        </div>
        <div>
          <div class="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-1.5">Description</div>
          <div class="bg-secondary/20 border border-border rounded-xl p-4 text-sm text-foreground leading-relaxed">${nte.description}</div>
        </div>
        ${nte.explanationLetter ? `
          <div class="p-4 border border-emerald-200 bg-emerald-50 rounded-xl">
            <div class="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2">Explanation Submitted</div>
            <div class="text-sm text-emerald-900 flex items-center gap-2"><i data-lucide="file-text" style="width: 16px; height: 16px;"></i> ${nte.explanationLetter.filename} (on ${nte.explanationLetter.submittedDate})</div>
          </div>
        ` : ''}
        ${nod ? `
          <div class="p-4 border border-purple-200 bg-purple-50 rounded-xl">
            <div class="flex items-center justify-between mb-2">
              <div class="text-xs font-bold text-purple-800 uppercase tracking-wider">Notice of Decision</div>
              <span class="text-[10px] font-bold px-2 py-0.5 rounded-full ${decisionCfg[nod.decision]} uppercase tracking-wider">${nod.decision}</span>
            </div>
            <div class="text-sm text-purple-900 leading-relaxed">${nod.details}</div>
          </div>
        ` : ''}
      </div>
      ${actionsHtml}
    `;

    detailModal.classList.remove('hidden');
    if (typeof lucide !== 'undefined') lucide.createIcons();

    // Bind dynamic buttons
    detailModalContent.querySelectorAll('.close-modal-btn').forEach(b => b.addEventListener('click', () => detailModal.classList.add('hidden')));
    
    const markBtn = document.getElementById('mark-review-btn');
    if (markBtn) markBtn.addEventListener('click', () => {
      nte.status = 'Under Review';
      detailModal.classList.add('hidden');
      renderCases();
    });

    const nodBtn = document.getElementById('issue-nod-open-btn');
    if (nodBtn) nodBtn.addEventListener('click', () => {
      detailModal.classList.add('hidden');
      document.getElementById('nod-nte-id').value = id;
      issueNodModal.classList.remove('hidden');
    });

    const voidBtn = document.getElementById('void-btn');
    if (voidBtn) voidBtn.addEventListener('click', () => {
      if(confirm('Void this NTE?')) {
        nte.status = 'Voided';
        detailModal.classList.add('hidden');
        renderCases();
      }
    });
  }

  // --- Listeners ---
  
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => {
        t.className = "tab-btn px-4 py-2 rounded-lg text-sm font-semibold transition-colors text-muted-foreground hover:text-foreground hover:bg-secondary";
      });
      tab.className = "tab-btn px-4 py-2 rounded-lg text-sm font-semibold transition-colors bg-primary text-white";

      tabContents.forEach(c => c.classList.add('hidden'));
      document.getElementById(tab.dataset.target).classList.remove('hidden');
    });
  });

  searchInput.addEventListener('input', renderCases);
  filterStatus.addEventListener('change', renderCases);

  document.getElementById('issue-nte-btn').addEventListener('click', () => {
    issueNteModal.classList.remove('hidden');
  });

  issueNteForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const empId = document.getElementById('nte-employee').value;
    const emp = employees.find(x => x.id === empId);
    
    ntes.unshift({
      id: `NTE-${Math.floor(Date.now()/1000)}`,
      employeeId: emp.id,
      employeeName: emp.name,
      department: emp.department,
      issuedBy: 'Admin User',
      issuedByRole: 'admin',
      assignedTo: 'Admin User',
      issuedDate: today(),
      incidentDate: document.getElementById('nte-date').value,
      incidentType: document.getElementById('nte-type').value,
      description: document.getElementById('nte-desc').value,
      responseDeadline: document.getElementById('nte-deadline').value,
      status: 'Pending Explanation',
      auditLog: []
    });

    issueNteModal.classList.add('hidden');
    issueNteForm.reset();
    renderCases();
    renderReports();
  });

  nodDecisionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      nodDecisionBtns.forEach(b => {
        b.className = "decision-btn px-3 py-2.5 rounded-xl border text-sm font-semibold text-left border-border hover:bg-secondary text-foreground";
      });
      const val = btn.dataset.val;
      let activeClass = '';
      if(val==='Exonerated') activeClass='border-emerald-500 bg-emerald-50 text-emerald-800';
      else if(val==='Dismissal') activeClass='border-red-500 bg-red-50 text-red-800';
      else if(val==='Suspension') activeClass='border-orange-500 bg-orange-50 text-orange-800';
      else activeClass='border-amber-500 bg-amber-50 text-amber-800';
      
      btn.className = `decision-btn px-3 py-2.5 rounded-xl border text-sm font-semibold text-left ${activeClass}`;
      nodDecisionInput.value = val;

      if(val === 'Suspension') suspensionDaysDiv.classList.remove('hidden');
      else suspensionDaysDiv.classList.add('hidden');
    });
  });

  issueNodForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const nteId = document.getElementById('nod-nte-id').value;
    const nte = ntes.find(n => n.id === nteId);
    if(!nte) return;

    nods.push({
      id: `NOD-${Math.floor(Date.now()/1000)}`,
      nteId: nte.id,
      employeeId: nte.employeeId,
      employeeName: nte.employeeName,
      department: nte.department,
      decision: nodDecisionInput.value,
      details: document.getElementById('nod-details').value,
      issuedDate: today()
    });

    nte.status = 'Decision Issued';
    
    issueNodModal.classList.add('hidden');
    issueNodForm.reset();
    suspensionDaysDiv.classList.add('hidden');
    nodDecisionBtns.forEach(b => b.className = "decision-btn px-3 py-2.5 rounded-xl border text-sm font-semibold text-left border-border hover:bg-secondary text-foreground");
    
    renderCases();
    renderReports();
  });

  document.querySelectorAll('.close-modal-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.target.closest('.fixed').classList.add('hidden');
    });
  });

  // Init
  renderCases();
  renderReports();
  renderTemplates();
  if (typeof lucide !== 'undefined') lucide.createIcons();
});
