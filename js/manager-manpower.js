import { db } from './db.js';

document.addEventListener('DOMContentLoaded', () => {
  const MANAGER_NAME = 'Maria Santos';
  let formUrgency = 'Medium';
  const tbody = document.getElementById('mr-tbody');
  const urgencyBtns = document.querySelectorAll('.urgency-btn');
  const viewModal = document.getElementById('view-mr-modal');

  const statusColor = {
    'Approved': '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-emerald-600 bg-emerald-50 border border-emerald-100">Approved</span>',
    'Rejected': '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-red-600 bg-red-50 border border-red-100">Rejected</span>',
    'Pending': '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-amber-600 bg-amber-50 border border-amber-100">Pending</span>'
  };

  const urgencyColor = {
    'Low': 'bg-gray-100 text-gray-600',
    'Medium': 'bg-amber-50 text-amber-700',
    'High': 'bg-orange-50 text-orange-700',
    'Critical': 'bg-red-50 text-red-600'
  };

  function renderTable() {
    const requests = db.manpowerRequests.filter(r => r.requestingManager === MANAGER_NAME);
    tbody.innerHTML = '';
    requests.forEach((r, i) => {
      const tr = document.createElement('tr');
      tr.className = `border-b border-border/50 hover:bg-secondary/20 ${i % 2 !== 0 ? 'bg-secondary/10' : ''}`;
      tr.innerHTML = `
        <td class="px-5 py-3 text-xs font-mono text-primary font-medium">${r.id}</td>
        <td class="px-5 py-3 text-sm font-medium text-foreground">${r.positionTitle}</td>
        <td class="px-5 py-3 text-sm text-foreground">${r.headcount}</td>
        <td class="px-5 py-3 text-xs text-muted-foreground">${r.dateRequested}</td>
        <td class="px-5 py-3">${statusColor[r.status] || r.status}</td>
        <td class="px-5 py-3">
          <button data-id="${r.id}" class="view-btn flex items-center gap-1 px-2.5 py-1 rounded text-xs border border-border text-muted-foreground hover:bg-secondary">
            <i data-lucide="eye" style="width: 12px; height: 12px;"></i> View
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    document.querySelectorAll('.view-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const req = db.manpowerRequests.find(x => x.id === e.currentTarget.dataset.id);
        if (req) openViewModal(req);
      });
    });

    if (typeof lucide !== 'undefined') lucide.createIcons();
  }

  function openViewModal(req) {
    document.getElementById('view-mr-id').textContent = req.id;
    document.getElementById('view-mr-title').textContent = req.positionTitle;
    
    const content = document.getElementById('view-mr-content');
    
    function getTimelineStep(status) {
      if (status === 'Rejected') return -1;
      if (status === 'Pending') return 1;
      if (status === 'Approved') return 2;
      return 3;
    }
    
    const steps = req.status === 'Rejected' ? ['Submitted', 'Under Review', 'Rejected'] : ['Submitted', 'Under Review', 'Approved', 'Published'];
    const activeStep = getTimelineStep(req.status) === -1 ? 2 : getTimelineStep(req.status);
    
    let timelineHtml = '<div class="flex items-center">';
    steps.forEach((step, idx) => {
      const isActive = req.status === 'Rejected' ? true : idx <= activeStep;
      const isCurrent = idx === activeStep;
      const isRejected = step === 'Rejected';
      
      let icon = `<span>${idx + 1}</span>`;
      if (isRejected) icon = `<i data-lucide="x" style="width: 12px; height: 12px;"></i>`;
      else if (isActive) icon = `<i data-lucide="check" style="width: 12px; height: 12px;"></i>`;
      
      const circleClass = isRejected ? 'bg-red-500 text-white' : isActive ? 'bg-primary text-white' : 'bg-secondary text-muted-foreground';
      const textClass = isCurrent ? 'font-semibold text-foreground' : 'text-muted-foreground';
      
      timelineHtml += `
        <div class="flex items-center flex-1 last:flex-none">
          <div class="flex flex-col items-center">
            <div class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${circleClass}">
              ${icon}
            </div>
            <span class="text-xs mt-1 text-center ${textClass}">${step}</span>
          </div>
          ${idx < steps.length - 1 ? `<div class="flex-1 h-0.5 mx-1 ${isActive && idx < activeStep ? 'bg-primary' : 'bg-secondary'}"></div>` : ''}
        </div>
      `;
    });
    timelineHtml += '</div>';

    content.innerHTML = `
      <div>
        <p class="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Request Timeline</p>
        ${timelineHtml}
      </div>
      <div class="grid grid-cols-2 gap-4 pt-2 border-t border-border mt-5">
        <div><span class="text-xs text-muted-foreground">Department</span><div class="text-sm font-medium text-foreground mt-0.5">${req.department}</div></div>
        <div><span class="text-xs text-muted-foreground">Employment Type</span><div class="text-sm font-medium text-foreground mt-0.5">${req.employmentType}</div></div>
        <div><span class="text-xs text-muted-foreground">Headcount</span><div class="text-sm font-medium text-foreground mt-0.5">${req.headcount}</div></div>
        <div><span class="text-xs text-muted-foreground">Preferred Start</span><div class="text-sm font-medium text-foreground mt-0.5">${req.preferredStartDate}</div></div>
      </div>
      <div class="flex items-center gap-2 mt-4">
        <span class="text-xs text-muted-foreground">Urgency:</span>
        <span class="px-2.5 py-0.5 rounded-full text-xs font-medium ${urgencyColor[req.urgency]}">${req.urgency}</span>
      </div>
      <div class="mt-4"><span class="text-xs text-muted-foreground">Job Description</span><p class="text-sm text-foreground mt-1 leading-relaxed">${req.jobDescription}</p></div>
      <div class="mt-4"><span class="text-xs text-muted-foreground">Qualifications</span><p class="text-sm text-foreground mt-1 leading-relaxed">${req.qualifications}</p></div>
      <div class="mt-4"><span class="text-xs text-muted-foreground">Justification</span><p class="text-sm text-foreground mt-1 leading-relaxed">${req.justification}</p></div>
    `;

    viewModal.classList.remove('hidden');
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }

  document.querySelectorAll('.close-modal-btn').forEach(btn => {
    btn.addEventListener('click', (e) => e.target.closest('.fixed').classList.add('hidden'));
  });

  urgencyBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const val = e.currentTarget.dataset.val;
      formUrgency = val;
      urgencyBtns.forEach(b => {
        b.className = `urgency-btn flex-1 py-2 rounded-xl text-sm font-medium border transition-all ${b.dataset.val === val ? 'border-primary bg-primary text-white' : 'border-border bg-secondary text-muted-foreground hover:border-primary/40'}`;
        const dot = b.querySelector('span');
        if(dot) dot.remove();
        if (b.dataset.val === val) {
          b.innerHTML += `<span class="ml-2 inline-block w-2 h-2 rounded-full ${val === 'Critical' ? 'bg-red-300' : val === 'High' ? 'bg-orange-300' : val === 'Medium' ? 'bg-amber-300' : 'bg-gray-400'}"></span>`;
        }
      });
    });
  });

  document.getElementById('mr-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const newReq = {
      id: `MR-${String(db.manpowerRequests.length + 10).padStart(3, '0')}`,
      department: 'Engineering',
      requestingManager: MANAGER_NAME,
      positionTitle: document.getElementById('mr-position').value,
      headcount: Number(document.getElementById('mr-headcount').value),
      dateRequested: '2026-06-16',
      status: 'Pending',
      employmentType: document.getElementById('mr-type').value,
      jobDescription: document.getElementById('mr-desc').value,
      qualifications: document.getElementById('mr-qual').value,
      urgency: formUrgency,
      justification: document.getElementById('mr-just').value,
      preferredStartDate: document.getElementById('mr-start').value,
    };
    db.manpowerRequests.unshift(newReq);
    renderTable();
    e.target.reset();
    formUrgency = 'Medium';
    document.querySelector('[data-val="Medium"]').click();
    
    document.getElementById('submit-success').classList.remove('hidden');
    setTimeout(() => document.getElementById('submit-success').classList.add('hidden'), 4000);
  });

  document.getElementById('draft-btn').addEventListener('click', () => {
    document.getElementById('draft-success').classList.remove('hidden');
    setTimeout(() => document.getElementById('draft-success').classList.add('hidden'), 3000);
  });

  renderTable();
});
