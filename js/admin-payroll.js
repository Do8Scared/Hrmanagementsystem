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
        <button class="view-btn px-2.5 py-1 rounded-md text-xs text-accent border border-accent/30 hover:bg-secondary transition-colors" data-id="${r.id}">
          View Payslip
        </button>
      `;
      if (r.status === 'Pending') {
        actionsHtml += `
          <button class="process-btn px-2.5 py-1 rounded-md text-xs text-emerald-700 border border-emerald-200 hover:bg-emerald-50 transition-colors" data-id="${r.id}">
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
  const closeCalcCancel = document.getElementById('close-calc-cancel');
  const addPayrollRecordBtn = document.getElementById('add-payroll-record-btn');

  function closeCalc() {
    calcModal.classList.add('hidden');
    document.getElementById('calc-name').value = '';
    document.getElementById('calc-period').value = '';
    document.getElementById('calc-basic').value = '';
    document.getElementById('calc-ot').value = '0';
    document.getElementById('calc-result').classList.add('hidden');
    addPayrollRecordBtn.classList.add('hidden');
  }

  calcPayrollBtn.addEventListener('click', () => {
    calcModal.classList.remove('hidden');
    if (typeof lucide !== 'undefined') lucide.createIcons();
  });
  closeCalcBtn.addEventListener('click', closeCalc);
  closeCalcCancel.addEventListener('click', closeCalc);
  calcModal.addEventListener('click', closeCalc);
  calcModal.querySelector('.bg-white').addEventListener('click', e => e.stopPropagation());

  // Philippine statutory deduction computation
  window.computePayroll = function() {
    const basic = parseFloat(document.getElementById('calc-basic').value) || 0;
    const ot = parseFloat(document.getElementById('calc-ot').value) || 0;
    if (basic <= 0) {
      document.getElementById('calc-result').classList.add('hidden');
      addPayrollRecordBtn.classList.add('hidden');
      return;
    }

    const gross = basic + ot;

    // SSS: Fixed contribution table 2023 (simplified based on gross)
    let sss = 0;
    if (gross <= 3250) sss = 135;
    else if (gross <= 6500) sss = 270;
    else if (gross <= 9750) sss = 405;
    else if (gross <= 13000) sss = 540;
    else if (gross <= 16250) sss = 675;
    else if (gross <= 19500) sss = 810;
    else if (gross <= 22750) sss = 945;
    else if (gross <= 26000) sss = 1080;
    else if (gross <= 29250) sss = 1215;
    else sss = 1350;

    // PhilHealth: 5% of basic, split 50/50, employee share capped at 5000/mo
    const philhealth = Math.min(basic * 0.025, 2500);

    // Pag-IBIG: fixed 100 (employee share)
    const pagibig = 100;

    // Withholding Tax (BIR 2023 revised rates — monthly)
    let tax = 0;
    const taxable = gross - sss - philhealth - pagibig;
    if (taxable <= 20833) tax = 0;
    else if (taxable <= 33333) tax = (taxable - 20833) * 0.15;
    else if (taxable <= 66667) tax = 1875 + (taxable - 33333) * 0.20;
    else if (taxable <= 166667) tax = 8541.80 + (taxable - 66667) * 0.25;
    else if (taxable <= 666667) tax = 33541.80 + (taxable - 166667) * 0.30;
    else tax = 183541.80 + (taxable - 666667) * 0.35;

    tax = Math.max(0, Math.round(tax * 100) / 100);
    const totalDed = sss + philhealth + pagibig + tax;
    const netPay = gross - totalDed;

    // Render
    const f = n => `₱${n.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    document.getElementById('r-basic').textContent = f(basic);
    document.getElementById('r-ot').textContent = f(ot);
    document.getElementById('r-gross').textContent = f(gross);
    document.getElementById('r-sss').textContent = f(sss);
    document.getElementById('r-philhealth').textContent = f(philhealth);
    document.getElementById('r-pagibig').textContent = f(pagibig);
    document.getElementById('r-tax').textContent = f(tax);
    document.getElementById('r-deductions').textContent = f(totalDed);
    document.getElementById('r-net').textContent = f(netPay);

    document.getElementById('calc-result').classList.remove('hidden');
    addPayrollRecordBtn.classList.remove('hidden');

    // Store for add-to-payroll
    addPayrollRecordBtn._computed = { gross, sss, philhealth, pagibig, tax, totalDed, netPay, basic, ot };
  };

  addPayrollRecordBtn.addEventListener('click', () => {
    const name = document.getElementById('calc-name').value.trim() || 'Unknown Employee';
    const period = document.getElementById('calc-period').value.trim() || 'Current Period';
    const c = addPayrollRecordBtn._computed;
    if (!c) return;

    const newId = `PR${String(records.length + 1).padStart(3, '0')}`;
    const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
    records.push({
      id: newId,
      employeeId: `CALC-${newId}`,
      employeeName: name,
      department: 'N/A',
      period,
      basicSalary: c.basic,
      overtime: c.ot,
      grossPay: c.gross,
      sss: c.sss,
      philhealth: c.philhealth,
      pagibig: c.pagibig,
      tax: c.tax,
      netPay: c.netPay,
      totalDeductions: c.totalDed,
      status: 'Pending',
    });
    closeCalc();
    renderTable();
    if (typeof lucide !== 'undefined') lucide.createIcons();
  });

  // Init
  renderTable();
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
});
