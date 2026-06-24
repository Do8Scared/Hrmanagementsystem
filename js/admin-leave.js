document.addEventListener('DOMContentLoaded', () => {
  // --- Mock Data ---
  let leaveRequests = [
    { id: 'LR001', employeeId: 'EMP001', employeeName: 'Maria Santos', department: 'Human Resources', leaveType: 'Vacation Leave', startDate: '2026-06-15', endDate: '2026-06-19', days: 5, reason: 'Family vacation in Palawan', status: 'Approved', appliedDate: '2026-05-20' },
    { id: 'LR002', employeeId: 'EMP002', employeeName: 'Juan dela Cruz', department: 'Engineering', leaveType: 'Sick Leave', startDate: '2026-06-10', endDate: '2026-06-11', days: 2, reason: 'Flu', status: 'Approved', appliedDate: '2026-06-09' },
    { id: 'LR003', employeeId: 'EMP004', employeeName: 'Pedro Garcia', department: 'Finance', leaveType: 'Emergency Leave', startDate: '2026-06-25', endDate: '2026-06-25', days: 1, reason: 'Family emergency', status: 'Pending', appliedDate: '2026-06-21' },
    { id: 'LR004', employeeId: 'EMP005', employeeName: 'Elena Mendoza', department: 'Operations', leaveType: 'Vacation Leave', startDate: '2026-07-01', endDate: '2026-07-05', days: 5, reason: 'Out of town trip', status: 'Pending', appliedDate: '2026-06-18' },
    { id: 'LR005', employeeId: 'EMP008', employeeName: 'Miguel Cruz', department: 'Engineering', leaveType: 'Sick Leave', startDate: '2026-06-05', endDate: '2026-06-05', days: 1, reason: 'Dental appointment', status: 'Approved', appliedDate: '2026-06-03' },
    { id: 'LR006', employeeId: 'EMP010', employeeName: 'Antonio Reyes', department: 'Marketing', leaveType: 'Vacation Leave', startDate: '2026-08-10', endDate: '2026-08-14', days: 5, reason: 'Trip to Japan', status: 'Rejected', appliedDate: '2026-06-01' },
  ];

  const employees = [
    { id: 'EMP001', name: 'Maria Santos', department: 'Human Resources', initials: 'MS' },
    { id: 'EMP002', name: 'Juan dela Cruz', department: 'Engineering', initials: 'JD' },
    { id: 'EMP004', name: 'Pedro Garcia', department: 'Finance', initials: 'PG' },
    { id: 'EMP005', name: 'Elena Mendoza', department: 'Operations', initials: 'EM' },
    { id: 'EMP008', name: 'Miguel Cruz', department: 'Engineering', initials: 'MC' },
  ];

  const leaveBalances = [
    { employeeId: 'EMP001', vacationLeave: 15, sickLeave: 15, emergencyLeave: 3, vacationUsed: 10, sickUsed: 2, emergencyUsed: 0 },
    { employeeId: 'EMP002', vacationLeave: 15, sickLeave: 15, emergencyLeave: 3, vacationUsed: 5, sickUsed: 5, emergencyUsed: 1 },
    { employeeId: 'EMP004', vacationLeave: 15, sickLeave: 15, emergencyLeave: 3, vacationUsed: 2, sickUsed: 0, emergencyUsed: 2 },
    { employeeId: 'EMP005', vacationLeave: 15, sickLeave: 15, emergencyLeave: 3, vacationUsed: 12, sickUsed: 1, emergencyUsed: 0 },
    { employeeId: 'EMP008', vacationLeave: 15, sickLeave: 15, emergencyLeave: 3, vacationUsed: 0, sickUsed: 1, emergencyUsed: 0 },
  ];

  // --- Elements ---
  const tabRequests = document.getElementById('tab-requests');
  const tabBalances = document.getElementById('tab-balances');
  const viewRequests = document.getElementById('view-requests');
  const viewBalances = document.getElementById('view-balances');
  
  const pendingCount = document.getElementById('pending-count');
  const searchInput = document.getElementById('search-input');
  const typeFilter = document.getElementById('type-filter');
  const statusFilter = document.getElementById('status-filter');
  
  const requestsTbody = document.getElementById('requests-tbody');
  const balancesTbody = document.getElementById('balances-tbody');

  const confirmModal = document.getElementById('confirm-modal');
  const confirmTitle = document.getElementById('confirm-title');
  const confirmDesc = document.getElementById('confirm-desc');
  const cancelConfirmBtn = document.getElementById('cancel-confirm-btn');
  const actionConfirmBtn = document.getElementById('action-confirm-btn');

  let currentTab = 'requests';
  let currentAction = null; // { id, action: 'approve'|'reject' }

  // --- Functions ---
  function renderTabs() {
    if (currentTab === 'requests') {
      tabRequests.className = "px-5 py-3 text-sm font-medium capitalize transition-colors border-b-2 -mb-px border-primary text-primary";
      tabBalances.className = "px-5 py-3 text-sm font-medium capitalize transition-colors border-b-2 -mb-px border-transparent text-muted-foreground hover:text-foreground";
      viewRequests.classList.remove('hidden');
      viewBalances.classList.add('hidden');
    } else {
      tabBalances.className = "px-5 py-3 text-sm font-medium capitalize transition-colors border-b-2 -mb-px border-primary text-primary";
      tabRequests.className = "px-5 py-3 text-sm font-medium capitalize transition-colors border-b-2 -mb-px border-transparent text-muted-foreground hover:text-foreground";
      viewBalances.classList.remove('hidden');
      viewRequests.classList.add('hidden');
    }
  }

  function renderRequests() {
    const search = searchInput.value.toLowerCase();
    const type = typeFilter.value;
    const status = statusFilter.value;

    const filtered = leaveRequests.filter(r => {
      const mSearch = r.employeeName.toLowerCase().includes(search);
      const mType = type === 'All' || r.leaveType === type;
      const mStatus = status === 'All' || r.status === status;
      return mSearch && mType && mStatus;
    });

    requestsTbody.innerHTML = '';
    filtered.forEach((r, i) => {
      const initials = r.employeeName.split(' ').map(n => n[0]).join('').slice(0, 2);
      
      let statusHtml = '';
      if (r.status === 'Approved') statusHtml = `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-emerald-600 bg-emerald-50 border border-emerald-100">Approved</span>`;
      else if (r.status === 'Rejected') statusHtml = `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-red-600 bg-red-50 border border-red-100">Rejected</span>`;
      else statusHtml = `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-amber-600 bg-amber-50 border border-amber-100">Pending</span>`;

      let actionsHtml = '';
      if (r.status === 'Pending') {
        actionsHtml = `
          <div class="flex items-center gap-1">
            <button class="approve-btn flex items-center gap-1 px-2.5 py-1 rounded-md text-xs text-emerald-700 border border-emerald-200 hover:bg-emerald-50 transition-colors" data-id="${r.id}">
              <i data-lucide="check" style="width: 12px; height: 12px;"></i> Approve
            </button>
            <button class="reject-btn flex items-center gap-1 px-2.5 py-1 rounded-md text-xs text-red-600 border border-red-200 hover:bg-red-50 transition-colors" data-id="${r.id}">
              <i data-lucide="x" style="width: 12px; height: 12px;"></i> Reject
            </button>
          </div>
        `;
      } else {
        actionsHtml = `<span class="text-xs text-muted-foreground">—</span>`;
      }

      const tr = document.createElement('tr');
 tr.className = `border-b border-border/50 hover:bg-gray-50 transition-colors cursor-pointer ${i % 2 === 0 ? '' : 'bg-secondary/10'}`;
      tr.innerHTML = `
        <td class="px-5 py-4">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
              <span class="text-white text-xs font-semibold">${initials}</span>
            </div>
            <div>
              <div class="text-xs font-medium text-foreground">${r.employeeName}</div>
              <div class="text-xs text-muted-foreground">${r.department}</div>
            </div>
          </div>
        </td>
        <td class="px-5 py-4"><span class="text-xs bg-secondary text-foreground px-2.5 py-1 rounded-full">${r.leaveType}</span></td>
        <td class="px-5 py-4 text-xs text-muted-foreground">
          <div>${r.startDate}</div>
          ${r.endDate !== r.startDate ? `<div>to ${r.endDate}</div>` : ''}
        </td>
        <td class="px-5 py-4">
          <span class="text-sm font-semibold text-foreground">${r.days}</span>
          <span class="text-xs text-muted-foreground ml-1">day${r.days > 1 ? 's' : ''}</span>
        </td>
        <td class="px-5 py-4">
          <p class="text-xs text-muted-foreground max-w-36 truncate" title="${r.reason}">${r.reason}</p>
        </td>
        <td class="px-5 py-4 text-xs text-muted-foreground">${r.appliedDate}</td>
        <td class="px-5 py-4">${statusHtml}</td>
        <td class="px-5 py-4">${actionsHtml}</td>
      `;
      requestsTbody.appendChild(tr);
    });

    pendingCount.textContent = leaveRequests.filter(r => r.status === 'Pending').length;

    if (typeof lucide !== 'undefined') lucide.createIcons();
    attachRowListeners();
  }

  function getBarHtml(used, total, colorClass) {
    const remaining = total - used;
    const pct = (used / total) * 100;
    return `
      <div>
        <div class="flex justify-between text-xs mb-1">
          <span class="text-muted-foreground">${remaining} remaining</span>
          <span class="text-muted-foreground">${used}/${total} used</span>
        </div>
        <div class="h-1.5 bg-secondary rounded-full overflow-hidden">
          <div class="h-full rounded-full ${colorClass}" style="width: ${pct}%"></div>
        </div>
      </div>
    `;
  }

  function renderBalances() {
    balancesTbody.innerHTML = '';
    employees.forEach((emp, i) => {
      const bal = leaveBalances.find(b => b.employeeId === emp.id);
      if (!bal) return;
      
      const tr = document.createElement('tr');
 tr.className = `border-b border-border/50 hover:bg-gray-50 transition-colors cursor-pointer ${i % 2 === 0 ? '' : 'bg-secondary/10'}`;
      tr.innerHTML = `
        <td class="px-5 py-4">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span class="text-white text-xs font-semibold">${emp.initials}</span>
            </div>
            <div>
              <div class="text-xs font-medium text-foreground">${emp.name}</div>
              <div class="text-xs text-muted-foreground">${emp.department}</div>
            </div>
          </div>
        </td>
        <td class="px-5 py-4">${getBarHtml(bal.vacationUsed, bal.vacationLeave, 'bg-primary')}</td>
        <td class="px-5 py-4">${getBarHtml(bal.sickUsed, bal.sickLeave, 'bg-emerald-500')}</td>
        <td class="px-5 py-4">${getBarHtml(bal.emergencyUsed, bal.emergencyLeave, 'bg-purple-500')}</td>
      `;
      balancesTbody.appendChild(tr);
    });
  }

  function attachRowListeners() {
    document.querySelectorAll('.approve-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        openConfirmModal(id, 'approve');
      });
    });
    document.querySelectorAll('.reject-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        openConfirmModal(id, 'reject');
      });
    });
  }

  function openConfirmModal(id, action) {
    currentAction = { id, action };
    
    if (action === 'approve') {
      confirmTitle.textContent = 'Approve Leave Request?';
      confirmDesc.textContent = 'The employee will be notified that their leave has been approved.';
      actionConfirmBtn.className = "flex-1 py-2 rounded-lg text-white text-sm font-medium transition-colors bg-emerald-600 hover:bg-emerald-700";
      actionConfirmBtn.textContent = 'Approve';
    } else {
      confirmTitle.textContent = 'Reject Leave Request?';
      confirmDesc.textContent = 'The employee will be notified that their leave request was rejected.';
      actionConfirmBtn.className = "flex-1 py-2 rounded-lg text-white text-sm font-medium transition-colors bg-red-600 hover:bg-red-700";
      actionConfirmBtn.textContent = 'Reject';
    }
    
    confirmModal.classList.remove('hidden');
  }

  // --- Listeners ---
  tabRequests.addEventListener('click', () => { currentTab = 'requests'; renderTabs(); renderRequests(); });
  tabBalances.addEventListener('click', () => { currentTab = 'balances'; renderTabs(); renderBalances(); });

  searchInput.addEventListener('input', renderRequests);
  typeFilter.addEventListener('change', renderRequests);
  statusFilter.addEventListener('change', renderRequests);

  cancelConfirmBtn.addEventListener('click', () => {
    confirmModal.classList.add('hidden');
    currentAction = null;
  });

  actionConfirmBtn.addEventListener('click', () => {
    if (currentAction) {
      const { id, action } = currentAction;
      leaveRequests = leaveRequests.map(r => r.id === id ? { ...r, status: action === 'approve' ? 'Approved' : 'Rejected' } : r);
      renderRequests();
      confirmModal.classList.add('hidden');
      currentAction = null;
    }
  });

  // Init
  renderTabs();
  renderRequests();
  renderBalances();
});
