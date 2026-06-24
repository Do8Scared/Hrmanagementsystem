import { db } from './db.js';


document.addEventListener('DOMContentLoaded', () => {
  const EMP_ID = 'EMP002';
  
  function getMyRequests() {
    return db.leaveRequests.filter(r => r.employeeId === EMP_ID);
  }

  const balance = db.leaveBalances.find(b => b.employeeId === EMP_ID);
  
  function getLeaveBalanceMap() {
    return {
      'Vacation Leave': balance.vacationLeave - balance.vacationUsed,
      'Sick Leave': balance.sickLeave - balance.sickUsed,
      'Emergency Leave': balance.emergencyLeave - balance.emergencyUsed,
      'Bereavement Leave': 5,
      'Paternity Leave': 7,
    };
  }

  function renderBalances() {
    const container = document.getElementById('leave-balances-container');
    const items = [
      { label: 'Vacation Leave', used: balance.vacationUsed, total: balance.vacationLeave, color: 'bg-primary' },
      { label: 'Sick Leave', used: balance.sickUsed, total: balance.sickLeave, color: 'bg-emerald-500' },
      { label: 'Emergency Leave', used: balance.emergencyUsed, total: balance.emergencyLeave, color: 'bg-purple-500' },
    ];
    container.innerHTML = '';
    items.forEach(b => {
      const remaining = b.total - b.used;
      const pct = (b.used / b.total) * 100;
      container.innerHTML += `
        <div class="bg-card rounded-xl border border-border p-5">
          <div class="flex justify-between items-baseline mb-3">
            <span class="text-sm font-medium text-foreground">${b.label}</span>
            <span class="text-2xl font-bold text-foreground">${remaining}</span>
          </div>
          <div class="h-1.5 bg-secondary rounded-full overflow-hidden mb-2">
            <div class="h-full rounded-full ${b.color}" style="width: ${pct}%"></div>
          </div>
          <div class="text-xs text-muted-foreground">${b.used} used out of ${b.total} days</div>
        </div>
      `;
    });
  }

  function renderHistory() {
    const myReq = getMyRequests();
    document.getElementById('history-count').textContent = `${myReq.length} total requests`;
    const tbody = document.getElementById('leave-history-tbody');
    tbody.innerHTML = '';
    
    if (myReq.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" class="px-5 py-12 text-center text-muted-foreground text-sm">No leave requests yet.</td></tr>`;
      return;
    }

    myReq.forEach((r, i) => {
      const bgClass = i % 2 !== 0 ? 'bg-secondary/10' : '';
      let dateDisp = `<div class="text-xs text-foreground">${r.startDate}</div>`;
      if (r.endDate !== r.startDate) {
        dateDisp += `<div class="text-xs text-muted-foreground">to ${r.endDate}</div>`;
      }
      
      tbody.innerHTML += `
        <tr class="border-b border-border/50 hover:bg-secondary/20 transition-colors ${bgClass}">
          <td class="px-4 py-3"><span class="text-xs bg-secondary text-foreground px-2.5 py-1 rounded-full whitespace-nowrap">${r.leaveType}</span></td>
          <td class="px-4 py-3">${dateDisp}</td>
          <td class="px-4 py-3 text-xs font-semibold text-foreground">${r.days}d</td>
          <td class="px-4 py-3"><p class="text-xs text-muted-foreground max-w-36 truncate" title="${r.reason}">${r.reason}</p></td>
          <td class="px-4 py-3 text-xs text-muted-foreground">${r.appliedDate}</td>
          <td class="px-4 py-3">${getStatusBadge(r.status)}</td>
        </tr>
      `;
    });
  }

  function getWorkDays(startStr, endStr) {
    if (!startStr || !endStr) return 0;
    const start = new Date(startStr);
    const end = new Date(endStr);
    let count = 0;
    const cur = new Date(start);
    while (cur <= end) {
      const dow = cur.getDay();
      if (dow !== 0 && dow !== 6) count++;
      cur.setDate(cur.getDate() + 1);
    }
    return count;
  }

  const typeSel = document.getElementById('lv-type');
  const startInp = document.getElementById('lv-start');
  const endInp = document.getElementById('lv-end');
  const durDiv = document.getElementById('lv-duration');
  const durText = document.getElementById('lv-duration-text');
  const availText = document.getElementById('lv-avail');

  function updateFormUI() {
    const map = getLeaveBalanceMap();
    availText.textContent = `${map[typeSel.value]} days`;
    endInp.min = startInp.value || '2026-06-17';
    
    const wd = getWorkDays(startInp.value, endInp.value);
    if (wd > 0) {
      durDiv.classList.remove('hidden');
      durText.textContent = `${wd} working day${wd > 1 ? 's' : ''}`;
    } else {
      durDiv.classList.add('hidden');
    }
  }

  typeSel.addEventListener('change', updateFormUI);
  startInp.addEventListener('change', updateFormUI);
  endInp.addEventListener('change', updateFormUI);

  document.getElementById('leave-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const type = typeSel.value;
    const start = startInp.value;
    const end = endInp.value;
    const reason = document.getElementById('lv-reason').value;
    const wd = getWorkDays(start, end);

    if (!start || !end || !reason) return;

    const newReq = {
      id: `LV_NEW_${Date.now()}`,
      employeeId: EMP_ID,
      employeeName: 'Alex Diaz',
      department: 'Engineering',
      leaveType: type,
      startDate: start,
      endDate: end,
      days: wd,
      reason: reason,
      status: 'Pending',
      appliedDate: '2026-06-16',
    };

    db.leaveRequests.unshift(newReq);
    db.save();

    document.getElementById('leave-form').reset();
    updateFormUI();

    document.getElementById('submit-msg').classList.remove('hidden');
    setTimeout(() => {
      document.getElementById('submit-msg').classList.add('hidden');
    }, 4000);

    renderHistory();
  });

  renderBalances();
  renderHistory();
  updateFormUI();
});
