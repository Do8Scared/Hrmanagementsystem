document.addEventListener('DOMContentLoaded', () => {
  // --- Mock Data ---
  let employees = [
    { id: 'EMP001', name: 'Maria Santos', email: 'maria.santos@corazon.ph', phone: '+63 917 123 4567', department: 'Human Resources', position: 'HR Manager', status: 'Active', initials: 'MS', gender: 'Female', birthDate: '1985-04-12', joinDate: '2023-01-15', salary: 85000, address: 'Makati City, Metro Manila', emergencyContact: 'Juan Santos - +63 917 111 2222' },
    { id: 'EMP002', name: 'Juan dela Cruz', email: 'juan.delacruz@corazon.ph', phone: '+63 918 234 5678', department: 'Engineering', position: 'Senior Developer', status: 'Active', initials: 'JD', gender: 'Male', birthDate: '1990-08-25', joinDate: '2022-06-01', salary: 120000, address: 'Quezon City, Metro Manila', emergencyContact: 'Maria dela Cruz - +63 918 222 3333' },
    { id: 'EMP003', name: 'Ana Reyes', email: 'ana.reyes@corazon.ph', phone: '+63 919 345 6789', department: 'Marketing', position: 'Marketing Specialist', status: 'On Leave', initials: 'AR', gender: 'Female', birthDate: '1992-11-30', joinDate: '2024-02-10', salary: 45000, address: 'Taguig City, Metro Manila', emergencyContact: 'Pedro Reyes - +63 919 333 4444' },
    { id: 'EMP004', name: 'Pedro Garcia', email: 'pedro.garcia@corazon.ph', phone: '+63 920 456 7890', department: 'Finance', position: 'Accountant', status: 'Active', initials: 'PG', gender: 'Male', birthDate: '1988-03-15', joinDate: '2021-11-20', salary: 60000, address: 'Pasig City, Metro Manila', emergencyContact: 'Elena Garcia - +63 920 444 5555' },
    { id: 'EMP005', name: 'Elena Mendoza', email: 'elena.mendoza@corazon.ph', phone: '+63 921 567 8901', department: 'Operations', position: 'Operations Manager', status: 'Active', initials: 'EM', gender: 'Female', birthDate: '1982-07-08', joinDate: '2020-03-05', salary: 95000, address: 'Mandaluyong City, Metro Manila', emergencyContact: 'Carlos Mendoza - +63 921 555 6666' },
    { id: 'EMP006', name: 'Carlos Bautista', email: 'carlos.bautista@corazon.ph', phone: '+63 922 678 9012', department: 'Sales', position: 'Sales Executive', status: 'Active', initials: 'CB', gender: 'Male', birthDate: '1995-01-22', joinDate: '2025-05-18', salary: 50000, address: 'Pasay City, Metro Manila', emergencyContact: 'Luisa Bautista - +63 922 666 7777' },
    { id: 'EMP007', name: 'Luisa Torres', email: 'luisa.torres@corazon.ph', phone: '+63 923 789 0123', department: 'Design', position: 'UI/UX Designer', status: 'Inactive', initials: 'LT', gender: 'Female', birthDate: '1993-09-14', joinDate: '2024-08-01', salary: 70000, address: 'San Juan City, Metro Manila', emergencyContact: 'Miguel Torres - +63 923 777 8888' },
    { id: 'EMP008', name: 'Miguel Cruz', email: 'miguel.cruz@corazon.ph', phone: '+63 924 890 1234', department: 'Engineering', position: 'QA Engineer', status: 'Active', initials: 'MC', gender: 'Male', birthDate: '1991-05-05', joinDate: '2023-09-12', salary: 65000, address: 'Marikina City, Metro Manila', emergencyContact: 'Sofia Cruz - +63 924 888 9999' },
    { id: 'EMP009', name: 'Sofia Garcia', email: 'sofia.garcia@corazon.ph', phone: '+63 925 901 2345', department: 'Human Resources', position: 'HR Specialist', status: 'Active', initials: 'SG', gender: 'Female', birthDate: '1994-12-10', joinDate: '2025-01-25', salary: 55000, address: 'Valenzuela City, Metro Manila', emergencyContact: 'Antonio Garcia - +63 925 999 0000' },
    { id: 'EMP010', name: 'Antonio Reyes', email: 'antonio.reyes@corazon.ph', phone: '+63 926 012 3456', department: 'Marketing', position: 'SEO Specialist', status: 'Active', initials: 'AR', gender: 'Male', birthDate: '1996-02-28', joinDate: '2026-03-10', salary: 48000, address: 'Caloocan City, Metro Manila', emergencyContact: 'Rosa Reyes - +63 926 000 1111' },
    { id: 'EMP011', name: 'Rosa Santos', email: 'rosa.santos@corazon.ph', phone: '+63 927 123 4567', department: 'Finance', position: 'Billing Clerk', status: 'On Leave', initials: 'RS', gender: 'Female', birthDate: '1989-10-18', joinDate: '2022-07-22', salary: 35000, address: 'Malabon City, Metro Manila', emergencyContact: 'Jose Santos - +63 927 111 2222' },
    { id: 'EMP012', name: 'Jose dela Cruz', email: 'jose.delacruz@corazon.ph', phone: '+63 928 234 5678', department: 'Operations', position: 'Logistics Coordinator', status: 'Active', initials: 'JC', gender: 'Male', birthDate: '1987-06-03', joinDate: '2021-04-14', salary: 42000, address: 'Navotas City, Metro Manila', emergencyContact: 'Carmen dela Cruz - +63 928 222 3333' }
  ];

  let currentPage = 1;
  const itemsPerPage = 8;
  
  let currentSearch = '';
  let currentDeptFilter = 'All';
  let currentStatusFilter = 'All';

  // Elements
  const tbody = document.getElementById('employee-table-body');
  const countEl = document.getElementById('employee-count');
  const searchInput = document.getElementById('search-input');
  const deptFilter = document.getElementById('dept-filter');
  const statusFilter = document.getElementById('status-filter');
  
  const paginationContainer = document.getElementById('pagination-container');
  const paginationInfo = document.getElementById('pagination-info');
  const paginationButtons = document.getElementById('pagination-buttons');

  const mainView = document.getElementById('employee-list-view');
  const profileView = document.getElementById('employee-profile-view');
  const backBtn = document.getElementById('back-to-list-btn');

  // Modals
  const modal = document.getElementById('employee-modal');
  const form = document.getElementById('employee-form');
  const modalTitle = document.getElementById('modal-title');
  const cancelModalBtn = document.getElementById('cancel-modal-btn');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const addEmployeeBtn = document.getElementById('add-employee-btn');

  const deleteModal = document.getElementById('delete-modal');
  const cancelDeleteBtn = document.getElementById('cancel-delete-btn');
  const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
  let deleteId = null;

  function renderTable() {
    const filtered = employees.filter(e => {
      const matchSearch = e.name.toLowerCase().includes(currentSearch.toLowerCase()) || e.email.toLowerCase().includes(currentSearch.toLowerCase()) || e.id.toLowerCase().includes(currentSearch.toLowerCase());
      const matchDept = currentDeptFilter === 'All' || e.department === currentDeptFilter;
      const matchStatus = currentStatusFilter === 'All' || e.status === currentStatusFilter;
      return matchSearch && matchDept && matchStatus;
    });

    countEl.textContent = filtered.length;

    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    if (currentPage > totalPages && totalPages > 0) currentPage = totalPages;

    const startIdx = (currentPage - 1) * itemsPerPage;
    const paginated = filtered.slice(startIdx, startIdx + itemsPerPage);

    tbody.innerHTML = '';
    
    if (paginated.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" class="px-5 py-12 text-center text-muted-foreground text-sm">No employees found.</td></tr>`;
      paginationContainer.classList.add('hidden');
    } else {
      paginated.forEach((emp, i) => {
        const tr = document.createElement('tr');
 tr.className = `border-b border-border/50 hover:bg-gray-50 transition-colors cursor-pointer ${i % 2 === 0 ? '' : 'bg-secondary/10'}`;
        
        let statusHtml = '';
        if (emp.status === 'Active') {
          statusHtml = `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-emerald-600 bg-emerald-50 border border-emerald-100">Active</span>`;
        } else if (emp.status === 'On Leave') {
          statusHtml = `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-amber-600 bg-amber-50 border border-amber-100">On Leave</span>`;
        } else {
          statusHtml = `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-muted-foreground bg-secondary border border-border">Inactive</span>`;
        }

        tr.innerHTML = `
          <td class="px-5 py-4">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                <span class="text-white text-xs font-semibold">${emp.initials}</span>
              </div>
              <div>
                <div class="text-sm font-medium text-foreground">${emp.name}</div>
                <div class="text-xs text-muted-foreground">${emp.id} · ${emp.email}</div>
              </div>
            </div>
          </td>
          <td class="px-5 py-4 text-sm text-foreground">${emp.department}</td>
          <td class="px-5 py-4 text-sm text-muted-foreground">${emp.position}</td>
          <td class="px-5 py-4 text-sm text-muted-foreground">${emp.joinDate}</td>
          <td class="px-5 py-4">${statusHtml}</td>
          <td class="px-5 py-4">
            <div class="flex items-center gap-1">
              <button class="view-btn p-1.5 rounded-lg text-muted-foreground hover:bg-secondary hover:text-accent transition-colors" data-id="${emp.id}" title="View Profile">
                <i data-lucide="eye" style="width: 15px; height: 15px;"></i>
              </button>
              <button class="edit-btn p-1.5 rounded-lg text-muted-foreground hover:bg-amber-50 hover:text-amber-600 transition-colors" data-id="${emp.id}" title="Edit">
                <i data-lucide="pencil" style="width: 15px; height: 15px;"></i>
              </button>
              <button class="del-btn p-1.5 rounded-lg text-muted-foreground hover:bg-red-50 hover:text-red-600 transition-colors" data-id="${emp.id}" title="Delete">
                <i data-lucide="trash-2" style="width: 15px; height: 15px;"></i>
              </button>
            </div>
          </td>
        `;
        tbody.appendChild(tr);
      });

      // Pagination
      if (totalPages > 1) {
        paginationContainer.classList.remove('hidden');
        paginationInfo.textContent = `Showing ${startIdx + 1}–${Math.min(startIdx + itemsPerPage, filtered.length)} of ${filtered.length}`;
        
        paginationButtons.innerHTML = '';
        for (let p = 1; p <= totalPages; p++) {
          const btn = document.createElement('button');
          btn.className = `w-8 h-8 rounded-lg text-xs font-medium transition-colors ${p === currentPage ? 'bg-primary text-white' : 'text-muted-foreground hover:bg-secondary'}`;
          btn.textContent = p;
          btn.addEventListener('click', () => {
            currentPage = p;
            renderTable();
          });
          paginationButtons.appendChild(btn);
        }
      } else {
        paginationContainer.classList.add('hidden');
      }
    }

    if (typeof lucide !== 'undefined') lucide.createIcons();
    attachRowListeners();
  }

  function attachRowListeners() {
    document.querySelectorAll('.view-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        openProfile(id);
      });
    });
    document.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        openEdit(id);
      });
    });
    document.querySelectorAll('.del-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        deleteId = id;
        deleteModal.classList.remove('hidden');
      });
    });
  }

  // Filter Listeners
  searchInput.addEventListener('input', (e) => { currentSearch = e.target.value; currentPage = 1; renderTable(); });
  deptFilter.addEventListener('change', (e) => { currentDeptFilter = e.target.value; currentPage = 1; renderTable(); });
  statusFilter.addEventListener('change', (e) => { currentStatusFilter = e.target.value; currentPage = 1; renderTable(); });

  // Profile View
  function openProfile(id) {
    const emp = employees.find(e => e.id === id);
    if (!emp) return;

    document.getElementById('profile-initials').textContent = emp.initials;
    document.getElementById('profile-name').textContent = emp.name;
    document.getElementById('profile-position').textContent = emp.position;
    document.getElementById('profile-dept').textContent = emp.department;
    document.getElementById('profile-id').textContent = emp.id;
    document.getElementById('profile-join').textContent = emp.joinDate;
    
    let statusHtml = '';
    if (emp.status === 'Active') {
      statusHtml = `<span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-emerald-600 bg-emerald-50 border border-emerald-100">Active</span>`;
    } else if (emp.status === 'On Leave') {
      statusHtml = `<span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-amber-600 bg-amber-50 border border-amber-100">On Leave</span>`;
    } else {
      statusHtml = `<span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-muted-foreground bg-secondary border border-border">Inactive</span>`;
    }
    document.getElementById('profile-status-container').innerHTML = statusHtml;

    document.getElementById('prof-fullname').textContent = emp.name;
    document.getElementById('prof-gender').textContent = emp.gender;
    document.getElementById('prof-dob').textContent = emp.birthDate;
    document.getElementById('prof-address').textContent = emp.address;
    document.getElementById('prof-empid').textContent = emp.id;
    document.getElementById('prof-empdept').textContent = emp.department;
    document.getElementById('prof-emppos').textContent = emp.position;
    document.getElementById('prof-emphire').textContent = emp.joinDate;
    document.getElementById('prof-empsalary').textContent = `₱${emp.salary.toLocaleString()}`;
    document.getElementById('prof-email').textContent = emp.email;
    document.getElementById('prof-phone').textContent = emp.phone;
    document.getElementById('prof-emergency').textContent = emp.emergencyContact;

    mainView.classList.add('hidden');
    profileView.classList.remove('hidden');
    window.scrollTo(0,0);
  }

  backBtn.addEventListener('click', () => {
    profileView.classList.add('hidden');
    mainView.classList.remove('hidden');
  });

  // Modal logic
  function hideModal() {
    modal.classList.add('hidden');
  }

  function openEdit(id) {
    const emp = employees.find(e => e.id === id);
    if (!emp) return;

    modalTitle.textContent = 'Edit Employee';
    document.getElementById('form-id').value = emp.id;
    document.getElementById('form-name').value = emp.name;
    document.getElementById('form-gender').value = emp.gender;
    document.getElementById('form-dob').value = emp.birthDate;
    document.getElementById('form-address').value = emp.address;
    document.getElementById('form-department').value = emp.department;
    document.getElementById('form-position').value = emp.position;
    document.getElementById('form-joinDate').value = emp.joinDate;
    document.getElementById('form-salary').value = emp.salary;
    document.getElementById('form-email').value = emp.email;
    document.getElementById('form-phone').value = emp.phone;
    document.getElementById('form-emergency').value = emp.emergencyContact;

    modal.classList.remove('hidden');
  }

  addEmployeeBtn.addEventListener('click', () => {
    modalTitle.textContent = 'Add New Employee';
    form.reset();
    document.getElementById('form-id').value = '';
    modal.classList.remove('hidden');
  });

  cancelModalBtn.addEventListener('click', hideModal);
  closeModalBtn.addEventListener('click', hideModal);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('form-id').value;
    const name = document.getElementById('form-name').value;
    const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

    const newEmp = {
      name, initials,
      gender: document.getElementById('form-gender').value,
      birthDate: document.getElementById('form-dob').value,
      address: document.getElementById('form-address').value,
      department: document.getElementById('form-department').value,
      position: document.getElementById('form-position').value,
      joinDate: document.getElementById('form-joinDate').value,
      salary: Number(document.getElementById('form-salary').value),
      email: document.getElementById('form-email').value,
      phone: document.getElementById('form-phone').value,
      emergencyContact: document.getElementById('form-emergency').value,
    };

    if (id) {
      // Update
      employees = employees.map(emp => emp.id === id ? { ...emp, ...newEmp } : emp);
    } else {
      // Add
      const newId = `EMP${String(employees.length + 1).padStart(3, '0')}`;
      employees.push({ id: newId, status: 'Active', ...newEmp });
    }
    
    hideModal();
    renderTable();
  });

  // Delete
  cancelDeleteBtn.addEventListener('click', () => {
    deleteId = null;
    deleteModal.classList.add('hidden');
  });

  confirmDeleteBtn.addEventListener('click', () => {
    if (deleteId) {
      employees = employees.filter(e => e.id !== deleteId);
      deleteId = null;
      deleteModal.classList.add('hidden');
      renderTable();
    }
  });

  // Init
  renderTable();
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
});
