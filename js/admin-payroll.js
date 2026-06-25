document.addEventListener('DOMContentLoaded', () => {
  // --- Formatter ---
  const fmt = (n) => `₱${n.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  // --- Mock Data ---
  let records = [
    { id: 'PR001', employeeId: 'EMP001', employeeName: 'Maria Santos', department: 'Human Resources', period: 'June 1–30, 2026', basicSalary: 85000, overtime: 0, grossPay: 85000, sss: 1125, philhealth: 1275, pagibig: 100, tax: 15500, netPay: 67000, totalDeductions: 18000, status: 'Pending' },
    { id: 'PR002', employeeId: 'EMP002', employeeName: 'Juan dela Cruz', department: 'Engineering', period: 'June 1–30, 2026', basicSalary: 120000, overtime: 15000, grossPay: 135000, sss: 1125, philhealth: 1800, pagibig: 100, tax: 28500, netPay: 103475, totalDeductions: 31525, status: 'Processed' },
    { id: 'PR003', employeeId: 'EMP004', employeeName: 'Pedro Garcia', department: 'Finance', period: 'June 1–30, 2026', basicSalary: 60000, overtime: 0, grossPay: 60000, sss: 1125, philhealth: 900, pagibig: 100, tax: 8500, netPay: 49375, totalDeductions: 10625, status: 'Pending' },
    { id: 'PR004', employeeId: 'EMP005', employeeName: 'Elena Mendoza', department: 'Operations', period: 'June 1–30, 2026', basicSalary: 95000, overtime: 5000, grossPay: 100000, sss: 1125, philhealth: 1425, pagibig: 100, tax: 19500, netPay: 77850, totalDeductions: 22150, status: 'Pending' },
    { id: 'PR005', employeeId: 'EMP006', employeeName: 'Carlos Bautista', department: 'Sales', period: 'June 1–30, 2026', basicSalary: 50000, overtime: 12000, grossPay: 62000, sss: 1125, philhealth: 750, pagibig: 100, tax: 9200, netPay: 50825, totalDeductions: 11175, status: 'Processed' },
    { id: 'PR006', employeeId: 'EMP008', employeeName: 'Miguel Cruz', department: 'Engineering', period: 'June 1–30, 2026', basicSalary: 65000, overtime: 0, grossPay: 65000, sss: 1125, philhealth: 975, pagibig: 100, tax: 9800, netPay: 53000, totalDeductions: 12000, status: 'Pending' },
    { id: 'PR007', employeeId: 'EMP009', employeeName: 'Sofia Garcia', department: 'Human Resources', period: 'June 1–30, 2026', basicSalary: 55000, overtime: 0, grossPay: 55000, sss: 1125, philhealth: 825, pagibig: 100, tax: 7200, netPay: 45750, totalDeductions: 9250, status: 'Pending' },
    { id: 'PR008', employeeId: 'EMP010', employeeName: 'Antonio Reyes', department: 'Marketing', period: 'June 1–30, 2026', basicSalary: 48000, overtime: 3000, grossPay: 51000, sss: 1125, philhealth: 720, pagibig: 100, tax: 6500, netPay: 42555, totalDeductions: 8445, status: 'Pending' },
    { id: 'PR009', employeeId: 'EMP012', employeeName: 'Jose dela Cruz', department: 'Operations', period: 'June 1–30, 2026', basicSalary: 42000, overtime: 8000, grossPay: 50000, sss: 1125, philhealth: 630, pagibig: 100, tax: 6200, netPay: 41945, totalDeductions: 8055, status: 'Processed' },
  ];

  // Elements
  const tbody = document.getElementById('payroll-table-body');
  const totalNetPayEl = document.getElementById('total-net-pay');
  const pendingCountEl = document.getElementById('pending-count');
  const totalDeductionsEl = document.getElementById('total-deductions');
  const empCountLabel = document.getElementById('employee-count-label');
  const processAllBtn = document.getElementById('process-all-btn');

  // Modals
  const payslipModal = document.getElementById('payslip-modal');
  const closePayslipBtn = document.getElementById('close-payslip-btn');
  const processAllModal = document.getElementById('process-all-modal');
  const cancelProcessBtn = document.getElementById('cancel-process-btn');
  const confirmProcessBtn = document.getElementById('confirm-process-btn');

  function renderTable() {
    tbody.innerHTML = '';
    
    let totalNet = 0;
    let pendingCount = 0;
    let totalDed = 0;

    records.forEach((r, i) => {
      totalNet += r.netPay;
      totalDed += r.totalDeductions;
      if (r.status === 'Pending') pendingCount++;

      const tr = document.createElement('tr');
 tr.className = `border-b border-border/50 hover:bg-gray-50 transition-colors cursor-pointer ${i % 2 === 0 ? '' : 'bg-secondary/10'}`;

      const initials = r.employeeName.split(' ').map(n => n[0]).join('').slice(0, 2);
      
      let statusHtml = '';
      if (r.status === 'Processed') {
        statusHtml = `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-emerald-600 bg-emerald-50 border border-emerald-100">Processed</span>`;
      } else {
        statusHtml = `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-amber-600 bg-amber-50 border border-amber-100">Pending</span>`;
      }

      let actionsHtml = `
        <button class="view-btn whitespace-nowrap px-2.5 py-1 rounded-md text-xs text-accent border border-accent/30 hover:bg-secondary transition-colors" data-id="${r.id}">
          View Payslip
        </button>
      `;
      if (r.status === 'Pending') {
        actionsHtml += `
          <button class="process-btn whitespace-nowrap px-2.5 py-1 rounded-md text-xs text-emerald-700 border border-emerald-200 hover:bg-emerald-50 transition-colors" data-id="${r.id}">
            Process
          </button>
        `;
      }

      tr.innerHTML = `
        <td class="px-4 py-3">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
              <span class="text-white text-xs font-semibold">${initials}</span>
            </div>
            <div>
              <div class="text-xs font-medium text-foreground whitespace-nowrap">${r.employeeName}</div>
              <div class="text-xs text-muted-foreground">${r.department}</div>
            </div>
          </div>
        </td>
        <td class="px-4 py-3 text-xs text-foreground">${fmt(r.basicSalary)}</td>
        <td class="px-4 py-3 text-xs text-emerald-600">${r.overtime > 0 ? fmt(r.overtime) : '—'}</td>
        <td class="px-4 py-3 text-xs font-medium text-foreground">${fmt(r.grossPay)}</td>
        <td class="px-4 py-3 text-xs text-red-500">${fmt(r.sss)}</td>
        <td class="px-4 py-3 text-xs text-red-500">${fmt(r.philhealth)}</td>
        <td class="px-4 py-3 text-xs text-red-500">${fmt(r.pagibig)}</td>
        <td class="px-4 py-3 text-xs text-red-500">${fmt(r.tax)}</td>
        <td class="px-4 py-3 text-xs font-bold text-primary">${fmt(r.netPay)}</td>
        <td class="px-4 py-3">${statusHtml}</td>
        <td class="px-4 py-3">
          <div class="flex items-center gap-1">
            ${actionsHtml}
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });

    totalNetPayEl.textContent = fmt(totalNet);
    pendingCountEl.textContent = pendingCount;
    totalDeductionsEl.textContent = fmt(totalDed);
    empCountLabel.textContent = records.length;

    if (pendingCount > 0) {
      processAllBtn.classList.remove('hidden');
    } else {
      processAllBtn.classList.add('hidden');
    }

    attachRowListeners();
  }

  function attachRowListeners() {
    document.querySelectorAll('.view-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        openPayslip(id);
      });
    });
    document.querySelectorAll('.process-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        processRecord(id);
      });
    });
  }

  function processRecord(id) {
    records = records.map(r => r.id === id ? { ...r, status: 'Processed' } : r);
    renderTable();
  }

  // --- Modals ---
  processAllBtn.addEventListener('click', () => {
    processAllModal.classList.remove('hidden');
  });
  cancelProcessBtn.addEventListener('click', () => {
    processAllModal.classList.add('hidden');
  });
  confirmProcessBtn.addEventListener('click', () => {
    records = records.map(r => ({ ...r, status: 'Processed' }));
    processAllModal.classList.add('hidden');
    renderTable();
  });

  function openPayslip(id) {
    const slip = records.find(r => r.id === id);
    if (!slip) return;

    document.getElementById('slip-name').textContent = slip.employeeName;
    document.getElementById('slip-dept').textContent = slip.department;
    document.getElementById('slip-period').textContent = slip.period;
    
    let statusHtml = '';
    if (slip.status === 'Processed') {
      statusHtml = `<span class="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium text-emerald-600 bg-emerald-50 border border-emerald-100">Processed</span>`;
    } else {
      statusHtml = `<span class="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium text-amber-600 bg-amber-50 border border-amber-100">Pending</span>`;
    }
    document.getElementById('slip-status-container').innerHTML = statusHtml;

    document.getElementById('slip-basic').textContent = fmt(slip.basicSalary);
    document.getElementById('slip-ot').textContent = fmt(slip.overtime);
    
    const otRow = document.getElementById('slip-ot-row');
    if (slip.overtime > 0) {
      otRow.classList.remove('hidden');
      otRow.classList.add('flex');
    } else {
      otRow.classList.add('hidden');
      otRow.classList.remove('flex');
    }

    document.getElementById('slip-gross').textContent = fmt(slip.grossPay);
    document.getElementById('slip-sss').textContent = `(${fmt(slip.sss)})`;
    document.getElementById('slip-philhealth').textContent = `(${fmt(slip.philhealth)})`;
    document.getElementById('slip-pagibig').textContent = `(${fmt(slip.pagibig)})`;
    document.getElementById('slip-tax').textContent = `(${fmt(slip.tax)})`;
    document.getElementById('slip-total-deductions').textContent = fmt(slip.totalDeductions);
    document.getElementById('slip-net').textContent = fmt(slip.netPay);

    payslipModal.classList.remove('hidden');
  }

  closePayslipBtn.addEventListener('click', () => {
    payslipModal.classList.add('hidden');
  });
  payslipModal.addEventListener('click', () => {
    payslipModal.classList.add('hidden');
  });

  // --- Payroll Calculator ---
  const calcModal = document.getElementById('calc-modal');
  const calcPayrollBtn = document.getElementById('calc-payroll-btn');
  const closeCalcBtn = document.getElementById('close-calc-btn');

  function closeCalc() {
    calcModal.classList.add('hidden');
    // Clear inputs
    document.getElementById('emp-name').value = '';
    document.getElementById('pay-period').value = '';
    document.getElementById('basic-salary').value = '0';
    document.getElementById('overtime-pay').value = '0';
    document.getElementById('allowances').value = '0';
    document.getElementById('absences').value = '0';
    // Clear outputs
    document.getElementById('out-name').textContent = 'Juan dela Cruz';
    document.getElementById('out-period').textContent = 'June 1-30, 2026';
    document.getElementById('out-gross').textContent = '₱ 0.00';
    document.getElementById('out-sss').textContent = '₱ 0.00';
    document.getElementById('out-philhealth').textContent = '₱ 0.00';
    document.getElementById('out-pagibig').textContent = '₱ 200.00';
    document.getElementById('out-tax').textContent = '₱ 0.00';
    document.getElementById('out-total-deductions').textContent = '₱ 0.00';
    document.getElementById('out-net-pay').textContent = '₱ 0.00';
  }

  // Simplified logic based on standalone calculator requested
  window.computePayroll = function() {
    const name = document.getElementById('emp-name').value.trim() || 'Juan dela Cruz';
    const period = document.getElementById('pay-period').value.trim() || 'June 1-30, 2026';
    const basic = parseFloat(document.getElementById('basic-salary').value) || 0;
    const overtime = parseFloat(document.getElementById('overtime-pay').value) || 0;
    const allowances = parseFloat(document.getElementById('allowances').value) || 0;
    const absences = parseFloat(document.getElementById('absences').value) || 0;

    // Gross Pay
    const gross = basic + overtime + allowances - absences;

    // Statutory Deductions (Simplified)
    const sss = basic * 0.045;
    const philhealth = basic * 0.025;
    const pagibig = 200.00;

    // Taxable Income
    let taxableIncome = (basic + overtime) - (sss + philhealth + pagibig + absences);
    if (taxableIncome < 0) taxableIncome = 0;

    // Withholding Tax
    let tax = taxableIncome * 0.15;
    if (tax < 0) tax = 0;

    // Total Deductions
    const totalDed = sss + philhealth + pagibig + tax;

    // Net Pay
    let netPay = gross - totalDed;
    if (netPay < 0) netPay = 0;

    // Render
    const f = n => '₱ ' + n.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    
    document.getElementById('out-name').textContent = name;
    document.getElementById('out-period').textContent = period;
    document.getElementById('out-gross').textContent = f(gross);
    document.getElementById('out-sss').textContent = f(sss);
    document.getElementById('out-philhealth').textContent = f(philhealth);
    document.getElementById('out-pagibig').textContent = f(pagibig);
    document.getElementById('out-tax').textContent = f(tax);
    document.getElementById('out-total-deductions').textContent = f(totalDed);
    document.getElementById('out-net-pay').textContent = f(netPay);
  };

  calcPayrollBtn.addEventListener('click', () => {
    calcModal.classList.remove('hidden');
    window.computePayroll();
    if (typeof lucide !== 'undefined') lucide.createIcons();
  });
  
  const closeBtn = document.getElementById('close-calc-btn');
  if (closeBtn) closeBtn.addEventListener('click', closeCalc);
  calcModal.addEventListener('click', closeCalc);
  
  const modalInner = calcModal.querySelector('.bg-white');
  if(modalInner) modalInner.addEventListener('click', e => e.stopPropagation());

  // Attach event listeners to new inputs
  const calcInputs = ['emp-name', 'pay-period', 'basic-salary', 'overtime-pay', 'allowances', 'absences'];
  calcInputs.forEach(id => {
    const el = document.getElementById(id);
    if(el) el.addEventListener('input', window.computePayroll);
  });


  // Init
  renderTable();
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
});
