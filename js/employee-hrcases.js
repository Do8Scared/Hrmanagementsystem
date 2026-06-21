import { db } from './db.js';

function statusCfg(s) {
  const map = {
    'Pending Explanation':   { bg: 'bg-amber-50',   text: 'text-amber-800',   border: 'border-amber-300', dot: 'bg-amber-500',   label: 'Action Required — Submit Your Explanation', icon: 'alert-circle' },
    'Explanation Submitted': { bg: 'bg-violet-50',  text: 'text-violet-800',  border: 'border-violet-200', dot: 'bg-violet-500',  label: 'Explanation Submitted — Under HR Review',   icon: 'clock' },
    'Under Review':          { bg: 'bg-purple-50',  text: 'text-purple-800',  border: 'border-purple-200', dot: 'bg-purple-500',  label: 'Under Review by HR',                       icon: 'clock' },
    'Decision Issued':       { bg: 'bg-orange-50',  text: 'text-orange-800',  border: 'border-orange-200', dot: 'bg-orange-500',  label: 'Decision Has Been Issued',                 icon: 'gavel' },
    'Closed':                { bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200', dot: 'bg-emerald-500', label: 'Case Closed',                             icon: 'check-circle-2' },
    'Voided':                { bg: 'bg-gray-50',    text: 'text-gray-600',    border: 'border-gray-200',  dot: 'bg-gray-400',    label: 'Case Voided',                              icon: 'x' },
  };
  return map[s];
}

document.addEventListener('DOMContentLoaded', () => {
  const EMP_ID = 'EMP002';
  
  function getCases() {
    return db.nteRecords.filter(n => n.employeeId === EMP_ID);
  }
  function getNODs() {
    return db.nodRecords.filter(n => n.employeeId === EMP_ID);
  }

  const container = document.getElementById('cases-container');
  const emptyState = document.getElementById('empty-state');

  function render() {
    const cases = getCases();
    const myNODs = getNODs();

    if (cases.length === 0 && myNODs.length === 0) {
      container.classList.add('hidden');
      emptyState.classList.remove('hidden');
      emptyState.classList.add('flex');
      return;
    } else {
      container.classList.remove('hidden');
      emptyState.classList.add('hidden');
      emptyState.classList.remove('flex');
    }

    container.innerHTML = '';

    cases.forEach(nte => {
      const nod = myNODs.find(n => n.nteId === nte.id);
      const cfg = statusCfg(nte.status);
      
      const timelineSteps = [
        { label: 'NTE Received',           done: true,                     date: nte.issuedDate },
        { label: 'You Acknowledged',       done: !!nte.acknowledgedAt,     date: nte.acknowledgedAt },
        { label: 'Explanation Submitted',  done: !!nte.explanationLetter,  date: nte.explanationLetter?.submittedDate },
        { label: 'Under HR Review',        done: ['Under Review','Decision Issued','Closed'].includes(nte.status), date: undefined },
        { label: 'Decision Issued',        done: !!nod,                    date: nod?.issuedDate },
        { label: 'Case Closed',            done: nte.status === 'Closed',  date: undefined },
      ];

      const expanded = nte.status === 'Pending Explanation';
      const cardId = `card-${nte.id}`;
      
      const card = document.createElement('div');
      card.className = `bg-card rounded-2xl border ${cfg.border} overflow-hidden`;
      card.innerHTML = `
        <button class="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-secondary/20 transition-colors toggle-card" data-id="${nte.id}">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.bg}">
            <i data-lucide="${cfg.icon}" style="width: 18px; height: 18px;" class="${cfg.text}"></i>
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="font-bold text-foreground text-sm">${nte.id}</span>
              <span class="text-xs px-2.5 py-0.5 rounded-full font-bold border ${cfg.bg} ${cfg.text} ${cfg.border}">${cfg.label}</span>
            </div>
            <div class="text-xs text-muted-foreground mt-0.5">${nte.incidentType} · Issued ${nte.issuedDate} · Deadline ${nte.responseDeadline}</div>
          </div>
          <i data-lucide="${expanded ? 'chevron-up' : 'chevron-down'}" style="width: 16px; height: 16px;" class="text-muted-foreground flex-shrink-0 toggle-icon"></i>
        </button>

        <div class="card-content ${expanded ? 'block' : 'hidden'} border-t border-border/50 px-5 pb-5 pt-4 space-y-4">
          <!-- Notice Content -->
          <div>
            <div class="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-1.5">Notice Content</div>
            <div class="bg-secondary/30 rounded-xl px-4 py-3 text-sm text-foreground leading-relaxed">${nte.description}</div>
          </div>

          <!-- Timeline -->
          <div class="border border-border rounded-xl overflow-hidden">
            <div class="px-4 py-2.5 bg-secondary/30 border-b border-border text-xs font-bold text-muted-foreground uppercase tracking-wide">Case Timeline</div>
            <div class="p-4 relative pl-10">
              <div class="absolute left-7 top-4 bottom-4 w-0.5 bg-border"></div>
              <div class="space-y-4">
                ${timelineSteps.map(s => `
                  <div class="relative flex items-start gap-3 -ml-10 pl-10">
                    <div class="absolute left-0 w-7 h-7 rounded-full flex items-center justify-center z-10 flex-shrink-0 border-2 ${s.done ? 'bg-emerald-500 border-emerald-500' : 'bg-white border-border'}">
                      ${s.done ? `<i data-lucide="check-circle-2" style="width: 13px; height: 13px;" class="text-white"></i>` : ''}
                    </div>
                    <div class="pt-0.5">
                      <div class="text-sm font-semibold ${s.done ? 'text-foreground' : 'text-muted-foreground'}">${s.label}</div>
                      ${s.date ? `<div class="text-xs text-muted-foreground">${s.date}</div>` : ''}
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>

          <!-- Acknowledge -->
          ${!nte.acknowledgedAt ? `
            <div class="flex items-start gap-3 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl">
              <i data-lucide="alert-circle" style="width: 16px; height: 16px;" class="text-amber-700 mt-0.5 flex-shrink-0"></i>
              <div class="flex-1">
                <div class="text-sm font-bold text-amber-900 mb-2">Please acknowledge receipt of this NTE.</div>
                <button class="ack-btn flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-700 text-white text-sm font-bold hover:bg-amber-800 transition-colors" data-id="${nte.id}">
                  <i data-lucide="check-circle-2" style="width: 14px; height: 14px;"></i> I have read and understood this NTE
                </button>
              </div>
            </div>
          ` : ''}

          <!-- Explanation letter -->
          <div class="border border-border rounded-xl overflow-hidden">
            <div class="flex items-center gap-2 px-4 py-2.5 bg-secondary/30 border-b border-border">
              <i data-lucide="lock" style="width: 13px; height: 13px;" class="text-muted-foreground"></i>
              <span class="text-sm font-bold text-foreground">Your Explanation Letter</span>
              <span class="ml-auto text-xs bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full font-bold">Confidential</span>
            </div>
            ${nte.explanationLetter ? `
              <div class="px-4 py-3 flex items-center gap-3">
                <div class="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                  <i data-lucide="file-text" style="width: 16px; height: 16px;" class="text-emerald-700"></i>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="text-sm font-bold text-foreground truncate">${nte.explanationLetter.filename}</div>
                  <div class="text-xs text-muted-foreground">Submitted ${nte.explanationLetter.submittedDate}</div>
                </div>
                <span class="flex items-center gap-1 text-xs text-emerald-700 font-bold"><i data-lucide="check-circle-2" style="width: 12px; height: 12px;"></i> Submitted</span>
              </div>
            ` : `
              <div class="px-4 py-4 flex items-center justify-between">
                <div>
                  <div class="text-sm font-bold text-foreground">Response required</div>
                  <div class="text-xs text-muted-foreground">Deadline: ${nte.responseDeadline}</div>
                </div>
                ${nte.status === 'Pending Explanation' ? `
                  <button class="upload-btn flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors" data-id="${nte.id}" data-deadline="${nte.responseDeadline}" data-name="${nte.employeeName}">
                    <i data-lucide="upload" style="width: 14px; height: 14px;"></i> Submit Letter
                  </button>
                ` : ''}
              </div>
            `}
          </div>

          <!-- NOD if issued -->
          ${nod ? `
            <div class="border border-orange-200 rounded-xl overflow-hidden">
              <div class="flex items-center gap-2 px-4 py-2.5 bg-orange-50 border-b border-orange-200">
                <i data-lucide="gavel" style="width: 14px; height: 14px;" class="text-orange-700"></i>
                <span class="text-sm font-bold text-orange-900">Notice of Decision</span>
                <span class="ml-auto text-xs font-bold px-2.5 py-0.5 rounded-full ${
                  nod.decision === 'Exonerated' ? 'bg-emerald-100 text-emerald-800' :
                  nod.decision === 'Dismissal' ? 'bg-red-100 text-red-800' :
                  nod.decision === 'Suspension' ? 'bg-orange-100 text-orange-800' : 'bg-amber-100 text-amber-800'
                }">${nod.decision}${nod.suspensionDays ? ` — ${nod.suspensionDays} days` : ''}</span>
              </div>
              <div class="px-4 py-3 space-y-2">
                <div class="text-xs text-muted-foreground">Effective ${nod.effectiveDate} · Issued by ${nod.issuedBy} on ${nod.issuedDate}</div>
                <p class="text-sm text-foreground leading-relaxed">${nod.details}</p>
                ${!nod.acknowledgedAt ? `
                  <div class="pt-2">
                    <button class="ack-nod-btn flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors" data-id="${nod.id}">
                      <i data-lucide="check-circle-2" style="width: 14px; height: 14px;"></i> I have read and understood this Decision
                    </button>
                  </div>
                ` : `
                  <div class="text-xs text-emerald-700 font-bold">✓ You acknowledged receipt on ${nod.acknowledgedAt}</div>
                `}
              </div>
            </div>
          ` : ''}
        </div>
      `;

      container.appendChild(card);
    });

    if (typeof lucide !== 'undefined') lucide.createIcons();

    // Toggle Handlers
    document.querySelectorAll('.toggle-card').forEach(btn => {
      btn.addEventListener('click', (e) => {
        // Prevent toggle if clicking inside the button but it's a specific action (like acknowledge)
        if (e.target.closest('.ack-btn') || e.target.closest('.upload-btn') || e.target.closest('.ack-nod-btn')) return;
        
        const content = btn.nextElementSibling;
        const icon = btn.querySelector('.toggle-icon');
        if (content.classList.contains('hidden')) {
          content.classList.remove('hidden');
          content.classList.add('block');
          icon.setAttribute('data-lucide', 'chevron-up');
        } else {
          content.classList.add('hidden');
          content.classList.remove('block');
          icon.setAttribute('data-lucide', 'chevron-down');
        }
        if (typeof lucide !== 'undefined') lucide.createIcons();
      });
    });

    // Ack Handlers
    document.querySelectorAll('.ack-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const idx = db.nteRecords.findIndex(n => n.id === id);
        if (idx >= 0) {
          db.nteRecords[idx].acknowledgedAt = new Date().toISOString().slice(0, 10);
          db.save();
          render();
        }
      });
    });

    // Upload Handlers
    document.querySelectorAll('.upload-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        currentUploadId = btn.dataset.id;
        currentUploadName = btn.dataset.name;
        document.getElementById('upload-meta').textContent = `In response to ${currentUploadId} · Deadline: ${btn.dataset.deadline}`;
        document.getElementById('upload-modal').classList.remove('hidden');
      });
    });

    // Ack NOD Handlers
    document.querySelectorAll('.ack-nod-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const idx = db.nodRecords.findIndex(n => n.id === id);
        if (idx >= 0) {
          db.nodRecords[idx].acknowledgedAt = new Date().toISOString().slice(0, 10);
          db.save();
          render();
        }
      });
    });
  }

  let currentUploadId = null;
  let currentUploadName = null;
  const modal = document.getElementById('upload-modal');
  const fileInput = document.getElementById('file-input');
  const textInput = document.getElementById('text-input');
  const submitBtn = document.getElementById('submit-upload');

  function checkSubmitState() {
    if (fileInput.files.length > 0 || textInput.value.trim().length > 0) {
      submitBtn.disabled = false;
    } else {
      submitBtn.disabled = true;
    }
  }

  fileInput.addEventListener('change', () => {
    if (fileInput.files.length > 0) {
      document.getElementById('file-label').innerHTML = `<span class="text-foreground font-semibold">${fileInput.files[0].name}</span>`;
    } else {
      document.getElementById('file-label').innerHTML = `<strong>Click to upload</strong> or drag file here<br /><span class="text-xs">PDF, DOCX, JPG — max 10 MB</span>`;
    }
    checkSubmitState();
  });

  textInput.addEventListener('input', checkSubmitState);

  function resetModal() {
    fileInput.value = '';
    textInput.value = '';
    document.getElementById('file-label').innerHTML = `<strong>Click to upload</strong> or drag file here<br /><span class="text-xs">PDF, DOCX, JPG — max 10 MB</span>`;
    submitBtn.disabled = true;
    document.getElementById('upload-form').classList.remove('hidden');
    document.getElementById('upload-success').classList.add('hidden');
    document.getElementById('upload-success').classList.remove('flex');
    modal.classList.add('hidden');
    currentUploadId = null;
    currentUploadName = null;
  }

  document.getElementById('close-upload').addEventListener('click', resetModal);
  document.getElementById('cancel-upload').addEventListener('click', resetModal);

  document.getElementById('upload-form').addEventListener('submit', (e) => {
    e.preventDefault();
    if (!currentUploadId) return;

    let filename = fileInput.files.length > 0 ? fileInput.files[0].name : `Explanation_${currentUploadName.replace(' ', '')}_${currentUploadId}.pdf`;

    document.getElementById('upload-form').classList.add('hidden');
    document.getElementById('upload-success').classList.remove('hidden');
    document.getElementById('upload-success').classList.add('flex');

    setTimeout(() => {
      const idx = db.nteRecords.findIndex(n => n.id === currentUploadId);
      if (idx >= 0) {
        db.nteRecords[idx].status = 'Explanation Submitted';
        db.nteRecords[idx].explanationLetter = {
          filename,
          submittedDate: new Date().toISOString().slice(0, 10),
          submittedBy: currentUploadName
        };
        db.save();
      }
      resetModal();
      render();
    }, 1200);
  });

  render();
});
