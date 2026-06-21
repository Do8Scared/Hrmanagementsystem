import { db } from './db.js';
import { getStatusBadge } from './shared.js';

const fmt = (n) => `₱${n.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

document.addEventListener('DOMContentLoaded', () => {
  const EMP_ID = 'EMP002';
  const myPayslips = db.payslips.filter(p => p.employeeId === EMP_ID);
  
  if(myPayslips.length > 0) {
    const latest = myPayslips[0];
    document.getElementById('latest-net').textContent = fmt(latest.netPay);
    document.getElementById('latest-period').textContent = latest.period;
    document.getElementById('basic-salary').textContent = fmt(latest.basicSalary);
    document.getElementById('latest-deductions').textContent = fmt(latest.totalDeductions);
  }

  const tbody = document.getElementById('payslips-tbody');
  tbody.innerHTML = '';

  myPayslips.forEach((p, i) => {
    const tr = document.createElement('tr');
    tr.className = `border-b border-border/50 cursor-pointer hover:bg-secondary/30 transition-colors ${i % 2 !== 0 ? 'bg-secondary/10' : ''}`;
    tr.innerHTML = `
      <td class="px-5 py-4 text-sm font-medium text-foreground">${p.period}</td>
      <td class="px-5 py-4 text-sm text-foreground">${fmt(p.basicSalary)}</td>
      <td class="px-5 py-4 text-sm text-emerald-600">${p.overtime > 0 ? fmt(p.overtime) : '—'}</td>
      <td class="px-5 py-4 text-sm font-medium text-foreground">${fmt(p.grossPay)}</td>
      <td class="px-5 py-4 text-sm text-red-500">(${fmt(p.totalDeductions)})</td>
      <td class="px-5 py-4 text-sm font-bold text-primary">${fmt(p.netPay)}</td>
      <td class="px-5 py-4">${getStatusBadge(p.status)}</td>
      <td class="px-5 py-4 text-muted-foreground"><i data-lucide="chevron-right" style="width: 15px; height: 15px;"></i></td>
    `;
    
    tr.addEventListener('click', () => {
      openModal(p);
    });

    tbody.appendChild(tr);
  });

  if (typeof lucide !== 'undefined') lucide.createIcons();

  const modal = document.getElementById('payslip-modal');
  function openModal(p) {
    document.getElementById('m-period').textContent = p.period;
    document.getElementById('m-status').innerHTML = getStatusBadge(p.status);
    document.getElementById('m-basic').textContent = fmt(p.basicSalary);
    
    const otRow = document.getElementById('m-overtime-row');
    if(p.overtime > 0) {
      otRow.classList.remove('hidden');
      document.getElementById('m-overtime').textContent = `+${fmt(p.overtime)}`;
    } else {
      otRow.classList.add('hidden');
    }

    document.getElementById('m-gross').textContent = fmt(p.grossPay);
    document.getElementById('m-sss').textContent = `(${fmt(p.sss)})`;
    document.getElementById('m-philhealth').textContent = `(${fmt(p.philhealth)})`;
    document.getElementById('m-pagibig').textContent = `(${fmt(p.pagibig)})`;
    document.getElementById('m-tax').textContent = `(${fmt(p.tax)})`;
    document.getElementById('m-deductions').textContent = `(${fmt(p.totalDeductions)})`;
    document.getElementById('m-net').textContent = fmt(p.netPay);

    modal.classList.remove('hidden');
  }

  document.querySelectorAll('.close-payslip').forEach(btn => {
    btn.addEventListener('click', () => {
      modal.classList.add('hidden');
    });
  });

  modal.addEventListener('click', (e) => {
    if(e.target === modal) {
      modal.classList.add('hidden');
    }
  });
});
