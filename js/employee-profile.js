import { db } from './db.js';

document.addEventListener('DOMContentLoaded', () => {
  const EMP_ID = 'EMP002';
  let emp = db.employees.find(e => e.id === EMP_ID);

  // Derive initials and position alias
  emp.initials = (emp.name || '').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  emp.position = emp.role;

  let personal = {
    name: emp.name, birthDate: emp.birthDate, gender: emp.gender,
    civilStatus: emp.civilStatus || 'Single', phone: emp.phone, email: emp.email,
  };
  let draft = { ...personal };

  const GOVT_IDS = [
    { label: 'SSS Number',       key: 'sss',       value: '34-5678901-2',    masked: '**-*****01-2'    },
    { label: 'PhilHealth Number', key: 'philhealth', value: '1234-5678-9012', masked: '****-****-9012'  },
    { label: 'Pag-IBIG Number',  key: 'pagibig',   value: '1234-5678-9012',  masked: '****-****-9012'  },
    { label: 'TIN',              key: 'tin',        value: '123-456-789-000', masked: '***-***-789-000' },
  ];
  let visibleIds = {};

  // Header render
  function renderHeader() {
    document.getElementById('prof-initials').textContent = emp.initials;
    document.getElementById('prof-name').textContent = personal.name;
    document.getElementById('prof-position').textContent = emp.position;
    document.getElementById('prof-dept-id').textContent = `${emp.department} · ${emp.id}`;
  }

  function renderView() {
    document.getElementById('personal-info-view').innerHTML = `
      <div><div class="text-xs font-semibold text-muted-foreground mb-1">Full Name</div><div class="text-sm font-semibold text-foreground">${personal.name}</div></div>
      <div><div class="text-xs font-semibold text-muted-foreground mb-1">Employee ID</div><div class="text-sm font-semibold text-foreground">${emp.id}</div></div>
      <div><div class="text-xs font-semibold text-muted-foreground mb-1">Date of Birth</div><div class="text-sm font-semibold text-foreground">${personal.birthDate}</div></div>
      <div><div class="text-xs font-semibold text-muted-foreground mb-1">Gender</div><div class="text-sm font-semibold text-foreground">${personal.gender}</div></div>
      <div><div class="text-xs font-semibold text-muted-foreground mb-1">Civil Status</div><div class="text-sm font-semibold text-foreground">${personal.civilStatus}</div></div>
      <div><div class="text-xs font-semibold text-muted-foreground mb-1">Contact Number</div><div class="text-sm font-semibold text-foreground">${personal.phone}</div></div>
      <div><div class="text-xs font-semibold text-muted-foreground mb-1">Personal Email</div><div class="text-sm font-semibold text-foreground">${personal.email}</div></div>
    `;

    document.getElementById('employment-details').innerHTML = `
      <div><div class="text-xs font-semibold text-muted-foreground mb-1">Department</div><div class="text-sm font-semibold text-foreground">${emp.department}</div></div>
      <div><div class="text-xs font-semibold text-muted-foreground mb-1">Position / Job Title</div><div class="text-sm font-semibold text-foreground">${emp.position || '—'}</div></div>
      <div><div class="text-xs font-semibold text-muted-foreground mb-1">Employment Type</div><div class="text-sm font-semibold text-foreground">${emp.employmentType || 'Regular'}</div></div>
      <div><div class="text-xs font-semibold text-muted-foreground mb-1">Date Hired</div><div class="text-sm font-semibold text-foreground">${emp.dateHired || '—'}</div></div>
      <div><div class="text-xs font-semibold text-muted-foreground mb-1">Reporting Supervisor</div><div class="text-sm font-semibold text-foreground">${emp.supervisor || '—'}</div></div>
      <div><div class="text-xs font-semibold text-muted-foreground mb-1">Work Email</div><div class="text-sm font-semibold text-foreground">${emp.workEmail || emp.email || '—'}</div></div>
    `;

    renderGovtIds();
  }

  function renderGovtIds() {
    const container = document.getElementById('govt-ids');
    container.innerHTML = '';
    GOVT_IDS.forEach(id => {
      container.innerHTML += `
        <div>
          <div class="text-xs font-semibold text-muted-foreground mb-1.5">${id.label}</div>
          <div class="flex items-center gap-2">
            <span class="text-sm font-semibold text-foreground font-mono tracking-wide">
              ${visibleIds[id.key] ? id.value : id.masked}
            </span>
            <button data-key="${id.key}" class="toggle-id-btn p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
              <i data-lucide="${visibleIds[id.key] ? 'eye-off' : 'eye'}" style="width: 14px; height: 14px;"></i>
            </button>
          </div>
        </div>
      `;
    });

    document.querySelectorAll('.toggle-id-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const key = e.currentTarget.dataset.key;
        visibleIds[key] = !visibleIds[key];
        renderGovtIds();
      });
    });

    if (typeof lucide !== 'undefined') lucide.createIcons();
  }

  function renderEdit() {
    document.getElementById('personal-info-edit').innerHTML = `
      <div><label class="block text-xs font-semibold text-muted-foreground mb-1.5">Full Name</label><input type="text" id="draft-name" value="${draft.name}" class="field-cls"></div>
      <div><div class="text-xs font-semibold text-muted-foreground mb-1">Employee ID</div><div class="text-sm font-semibold text-foreground">${emp.id}</div></div>
      <div><label class="block text-xs font-semibold text-muted-foreground mb-1.5">Date of Birth</label><input type="date" id="draft-dob" value="${draft.birthDate}" class="field-cls"></div>
      <div>
        <label class="block text-xs font-semibold text-muted-foreground mb-1.5">Gender</label>
        <select id="draft-gender" class="field-cls cursor-pointer">
          <option ${draft.gender === 'Male' ? 'selected' : ''}>Male</option>
          <option ${draft.gender === 'Female' ? 'selected' : ''}>Female</option>
        </select>
      </div>
      <div>
        <label class="block text-xs font-semibold text-muted-foreground mb-1.5">Civil Status</label>
        <select id="draft-civil" class="field-cls cursor-pointer">
          <option ${draft.civilStatus === 'Single' ? 'selected' : ''}>Single</option>
          <option ${draft.civilStatus === 'Married' ? 'selected' : ''}>Married</option>
          <option ${draft.civilStatus === 'Widowed' ? 'selected' : ''}>Widowed</option>
          <option ${draft.civilStatus === 'Separated' ? 'selected' : ''}>Separated</option>
        </select>
      </div>
      <div><label class="block text-xs font-semibold text-muted-foreground mb-1.5">Contact Number</label><input type="text" id="draft-phone" value="${draft.phone}" class="field-cls"></div>
      <div><label class="block text-xs font-semibold text-muted-foreground mb-1.5">Personal Email</label><input type="email" id="draft-email" value="${draft.email}" class="field-cls"></div>
    `;

    document.getElementById('draft-name').addEventListener('input', e => draft.name = e.target.value);
    document.getElementById('draft-dob').addEventListener('input', e => draft.birthDate = e.target.value);
    document.getElementById('draft-gender').addEventListener('change', e => draft.gender = e.target.value);
    document.getElementById('draft-civil').addEventListener('change', e => draft.civilStatus = e.target.value);
    document.getElementById('draft-phone').addEventListener('input', e => draft.phone = e.target.value);
    document.getElementById('draft-email').addEventListener('input', e => draft.email = e.target.value);
  }

  function setEditMode(isEdit) {
    if (isEdit) {
      draft = { ...personal };
      renderEdit();
      document.getElementById('personal-info-view').classList.add('hidden');
      document.getElementById('personal-info-edit').classList.remove('hidden');
      document.getElementById('edit-icon-btn').classList.add('hidden');
      document.getElementById('edit-btns-container').classList.add('hidden');
      document.getElementById('save-btns-container').classList.remove('hidden');
    } else {
      document.getElementById('personal-info-view').classList.remove('hidden');
      document.getElementById('personal-info-edit').classList.add('hidden');
      document.getElementById('edit-icon-btn').classList.remove('hidden');
      document.getElementById('edit-btns-container').classList.remove('hidden');
      document.getElementById('save-btns-container').classList.add('hidden');
    }
  }

  document.getElementById('edit-profile-btn').addEventListener('click', () => setEditMode(true));
  document.getElementById('edit-icon-btn').addEventListener('click', () => setEditMode(true));
  
  document.getElementById('cancel-edit-btn').addEventListener('click', () => {
    draft = { ...personal };
    setEditMode(false);
  });

  document.getElementById('save-edit-btn').addEventListener('click', () => {
    personal = { ...draft };
    renderHeader();
    renderView();
    setEditMode(false);
  });

  // Password Modal
  const pwModal = document.getElementById('pw-modal');
  document.getElementById('change-pw-btn').addEventListener('click', () => pwModal.classList.remove('hidden'));
  document.querySelectorAll('.close-pw-modal').forEach(btn => {
    btn.addEventListener('click', () => {
      pwModal.classList.add('hidden');
      document.getElementById('pw-form').reset();
      document.getElementById('pw-error').classList.add('hidden');
    });
  });

  document.getElementById('pw-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const current = document.getElementById('pw-current').value;
    const npw = document.getElementById('pw-new').value;
    const confirm = document.getElementById('pw-confirm').value;
    const err = document.getElementById('pw-error');

    if (current !== 'password123') {
      err.textContent = 'Current password is incorrect';
      err.classList.remove('hidden');
      return;
    }
    if (npw.length < 8) {
      err.textContent = 'New password must be at least 8 characters';
      err.classList.remove('hidden');
      return;
    }
    if (npw !== confirm) {
      err.textContent = 'New passwords do not match';
      err.classList.remove('hidden');
      return;
    }

    err.classList.add('hidden');
    pwModal.innerHTML = `
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-8 text-center" id="pw-modal-content">
        <div class="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
          <i data-lucide="check" style="width: 32px; height: 32px;" class="text-emerald-600"></i>
        </div>
        <h3 class="font-bold text-lg text-foreground mb-2">Password Updated!</h3>
        <p class="text-sm text-muted-foreground mb-6">Your password has been changed successfully.</p>
        <button id="pw-done-btn" class="w-full py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-all">Done</button>
      </div>
    `;
    if (typeof lucide !== 'undefined') lucide.createIcons();
    document.getElementById('pw-done-btn').addEventListener('click', () => {
      window.location.reload();
    });
  });

  document.querySelectorAll('.pw-toggle').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const btnEl = e.currentTarget;
      const input = btnEl.previousElementSibling;
      if (!input || input.tagName !== 'INPUT') return;
      
      if (input.type === 'password') {
        input.type = 'text';
        btnEl.innerHTML = '<i data-lucide="eye-off" style="width: 16px; height: 16px;"></i>';
      } else {
        input.type = 'password';
        btnEl.innerHTML = '<i data-lucide="eye" style="width: 16px; height: 16px;"></i>';
      }
      if (typeof lucide !== 'undefined') lucide.createIcons();
    });
  });

  renderHeader();
  renderView();

  if (window.location.search.includes('action=change-password')) {
    setTimeout(() => {
      const btn = document.getElementById('change-pw-btn');
      if (btn) btn.click();
    }, 100);
  }
});
