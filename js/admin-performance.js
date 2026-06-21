document.addEventListener('DOMContentLoaded', () => {
  // --- Mock Data ---
  const employees = [
    { id: 'EMP001', name: 'Maria Santos', department: 'Human Resources', status: 'Active' },
    { id: 'EMP002', name: 'Juan dela Cruz', department: 'Engineering', status: 'Active' },
    { id: 'EMP004', name: 'Pedro Garcia', department: 'Finance', status: 'Active' },
    { id: 'EMP005', name: 'Elena Mendoza', department: 'Operations', status: 'Active' },
    { id: 'EMP008', name: 'Miguel Cruz', department: 'Engineering', status: 'Active' },
    { id: 'EMP010', name: 'Antonio Reyes', department: 'Marketing', status: 'Active' }
  ];

  let evals = [
    { id: 'EVAL001', employeeId: 'EMP002', employeeName: 'Juan dela Cruz', department: 'Engineering', period: 'Q1 2026', criteria: { attendance: 4, productivity: 5, teamwork: 4, communication: 3, initiative: 4 }, overallRating: 4.0, evaluator: 'Sofia Garcia', date: '2026-04-05', comments: 'Great performance this quarter.' },
    { id: 'EVAL002', employeeId: 'EMP005', employeeName: 'Elena Mendoza', department: 'Operations', period: 'Q1 2026', criteria: { attendance: 3, productivity: 3, teamwork: 4, communication: 4, initiative: 3 }, overallRating: 3.4, evaluator: 'Sofia Garcia', date: '2026-04-10', comments: 'Steady work, could improve productivity.' }
  ];

  const CRITERIA = [
    { key: 'attendance', label: 'Attendance & Punctuality', description: 'Regularity and timeliness' },
    { key: 'productivity', label: 'Productivity & Output', description: 'Volume and quality of work' },
    { key: 'teamwork', label: 'Teamwork & Collaboration', description: 'Working effectively with others' },
    { key: 'communication', label: 'Communication Skills', description: 'Verbal and written clarity' },
    { key: 'initiative', label: 'Initiative & Innovation', description: 'Proactive problem solving' }
  ];

  const ratingLabels = ['', 'Poor', 'Below Average', 'Average', 'Good', 'Excellent'];

  let formCriteria = { attendance: 3, productivity: 3, teamwork: 3, communication: 3, initiative: 3 };

  function ratingColor(r) { return r >= 4.5 ? 'text-emerald-600' : r >= 3.5 ? 'text-accent' : r >= 2.5 ? 'text-amber-600' : 'text-red-600'; }
  function ratingBg(r) { return r >= 4.5 ? 'bg-emerald-50' : r >= 3.5 ? 'bg-secondary' : r >= 2.5 ? 'bg-amber-50' : 'bg-red-50'; }
  function overallRating(c) { return +(Object.values(c).reduce((s, v) => s + v, 0) / 5).toFixed(1); }

  function today() { return new Date().toISOString().slice(0, 10); }

  // --- Elements ---
  const container = document.getElementById('evals-container');
  const countLabel = document.getElementById('eval-count');
  const empSelect = document.getElementById('eval-emp');
  const formModal = document.getElementById('form-modal');
  const detailModal = document.getElementById('detail-modal');
  const detailModalContent = document.getElementById('detail-modal-content');
  const criteriaContainer = document.getElementById('criteria-container');
  const computedRating = document.getElementById('computed-rating');
  const evalForm = document.getElementById('eval-form');
  const evalPeriod = document.getElementById('eval-period');
  const evalComments = document.getElementById('eval-comments');

  // Populate Employees
  empSelect.innerHTML = '<option value="">Select employee...</option>' + employees.filter(e => e.status === 'Active').map(e => `<option value="${e.id}">${e.name} — ${e.department}</option>`).join('');

  // Render Functions
  function renderEvals() {
    countLabel.textContent = `${evals.length} evaluation records`;
    container.innerHTML = '';
    
    evals.forEach(ev => {
      let criteriaHtml = '';
      CRITERIA.forEach(({key, label}) => {
        criteriaHtml += `
          <div class="flex items-center gap-2">
            <span class="text-xs text-muted-foreground w-36 truncate">${label}</span>
            <div class="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
              <div class="h-full rounded-full bg-primary/70" style="width: ${(ev.criteria[key] / 5) * 100}%"></div>
            </div>
            <span class="text-xs font-medium text-foreground w-4 text-right">${ev.criteria[key]}</span>
          </div>
        `;
      });

      const initials = ev.employeeName.substring(0, 2).toUpperCase();

      const div = document.createElement('div');
      div.className = 'bg-card rounded-xl border border-border p-5 cursor-pointer hover:shadow-md transition-all hover:border-primary/20';
      div.innerHTML = `
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <span class="text-white text-sm font-semibold">${initials}</span>
            </div>
            <div>
              <div class="text-sm font-semibold text-foreground">${ev.employeeName}</div>
              <div class="text-xs text-muted-foreground">${ev.department} · ${ev.period}</div>
            </div>
          </div>
          <div class="px-3 py-1.5 rounded-lg ${ratingBg(ev.overallRating)}">
            <div class="text-xl font-bold ${ratingColor(ev.overallRating)}">${ev.overallRating.toFixed(1)}</div>
            <div class="text-xs text-muted-foreground text-center">/5.0</div>
          </div>
        </div>
        <div class="space-y-2">
          ${criteriaHtml}
        </div>
        <div class="mt-3 pt-3 border-t border-border flex justify-between text-xs text-muted-foreground">
          <span>Evaluator: ${ev.evaluator}</span>
          <span>${ev.date}</span>
        </div>
      `;

      div.addEventListener('click', () => openDetailModal(ev));
      container.appendChild(div);
    });
  }

  function renderFormCriteria() {
    criteriaContainer.innerHTML = '';
    CRITERIA.forEach(({key, label, description}) => {
      let starsHtml = '';
      for(let i=1; i<=5; i++) {
        starsHtml += `
          <button type="button" class="star-btn flex-1 p-1" data-key="${key}" data-val="${i}">
            <i data-lucide="star" class="w-full ${i <= formCriteria[key] ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}"></i>
          </button>
        `;
      }

      criteriaContainer.innerHTML += `
        <div>
          <div class="flex justify-between items-baseline mb-2">
            <div>
              <span class="text-sm font-medium text-foreground">${label}</span>
              <span class="text-xs text-muted-foreground ml-2">${description}</span>
            </div>
            <span class="text-sm font-bold text-primary">${formCriteria[key]} — ${ratingLabels[formCriteria[key]]}</span>
          </div>
          <div class="flex items-center gap-1">${starsHtml}</div>
        </div>
      `;
    });

    if(typeof lucide !== 'undefined') lucide.createIcons();
    
    // Bind stars
    document.querySelectorAll('.star-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const k = e.currentTarget.dataset.key;
        const v = parseInt(e.currentTarget.dataset.val);
        formCriteria[k] = v;
        updateComputedRating();
        renderFormCriteria();
      });
    });
  }

  function updateComputedRating() {
    const r = overallRating(formCriteria);
    computedRating.textContent = r.toFixed(1);
    computedRating.className = `text-3xl font-bold ${ratingColor(r)}`;
  }

  function openDetailModal(ev) {
    let criteriaHtml = '';
    CRITERIA.forEach(({key, label}) => {
      criteriaHtml += `
        <div>
          <div class="flex justify-between text-xs mb-1.5">
            <span class="font-medium text-foreground">${label}</span>
            <span class="text-muted-foreground">${ev.criteria[key]}/5 — ${ratingLabels[ev.criteria[key]]}</span>
          </div>
          <div class="h-2 bg-secondary rounded-full overflow-hidden">
            <div class="h-full rounded-full bg-primary transition-all" style="width: ${(ev.criteria[key] / 5) * 100}%"></div>
          </div>
        </div>
      `;
    });

    const initials = ev.employeeName.substring(0,2).toUpperCase();

    detailModalContent.innerHTML = `
      <div class="flex items-center justify-between px-6 py-5 border-b border-border">
        <h3 class="font-semibold text-foreground">Evaluation Detail</h3>
        <button class="close-modal-btn p-1.5 rounded-lg hover:bg-secondary text-muted-foreground"><i data-lucide="x" style="width:18px; height:18px;"></i></button>
      </div>
      <div class="p-6 space-y-5">
        <div class="flex items-center gap-4">
          <div class="w-14 h-14 rounded-xl bg-primary flex items-center justify-center">
            <span class="text-white text-lg font-bold">${initials}</span>
          </div>
          <div class="flex-1">
            <div class="font-semibold text-foreground">${ev.employeeName}</div>
            <div class="text-sm text-muted-foreground">${ev.department} · ${ev.period}</div>
            <div class="text-xs text-muted-foreground mt-1">Evaluated by ${ev.evaluator} on ${ev.date}</div>
          </div>
          <div class="text-center px-4 py-2 rounded-xl ${ratingBg(ev.overallRating)}">
            <div class="text-2xl font-bold ${ratingColor(ev.overallRating)}">${ev.overallRating.toFixed(1)}</div>
            <div class="text-xs text-muted-foreground">Overall</div>
          </div>
        </div>
        <div class="space-y-3">
          ${criteriaHtml}
        </div>
        ${ev.comments ? `
          <div class="bg-secondary rounded-xl p-4">
            <div class="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Evaluator Comments</div>
            <p class="text-sm text-foreground leading-relaxed">${ev.comments}</p>
          </div>
        ` : ''}
      </div>
    `;

    detailModal.classList.remove('hidden');
    if(typeof lucide !== 'undefined') lucide.createIcons();

    detailModalContent.querySelector('.close-modal-btn').addEventListener('click', () => {
      detailModal.classList.add('hidden');
    });
  }

  // --- Listeners ---
  document.getElementById('new-eval-btn').addEventListener('click', () => {
    empSelect.value = '';
    evalPeriod.value = 'Q2 2026';
    evalComments.value = '';
    formCriteria = { attendance: 3, productivity: 3, teamwork: 3, communication: 3, initiative: 3 };
    updateComputedRating();
    renderFormCriteria();
    formModal.classList.remove('hidden');
  });

  evalForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if(!empSelect.value) return;
    
    const emp = employees.find(x => x.id === empSelect.value);
    const newEval = {
      id: `EVAL${String(evals.length + 1).padStart(3, '0')}`,
      employeeId: emp.id,
      employeeName: emp.name,
      department: emp.department,
      period: evalPeriod.value,
      criteria: { ...formCriteria },
      overallRating: overallRating(formCriteria),
      evaluator: 'Admin User',
      date: today(),
      comments: evalComments.value
    };

    evals.unshift(newEval);
    formModal.classList.add('hidden');
    renderEvals();
  });

  document.querySelectorAll('.close-modal-btn').forEach(b => {
    b.addEventListener('click', (e) => {
      e.target.closest('.fixed').classList.add('hidden');
    });
  });

  // Init
  renderEvals();
  if(typeof lucide !== 'undefined') lucide.createIcons();
});
