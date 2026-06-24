import { db } from './db.js';
import { getStatusBadge } from './shared.js';

document.addEventListener('DOMContentLoaded', () => {
  const EMP_ID = 'EMP002';
  let year = 2026;
  let month = 6;
  const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  function generateMonthRecords(y, m) {
    const days = new Date(y, m, 0).getDate();
    const result = [];
    for (let d = 1; d <= days; d++) {
      const dow = new Date(y, m - 1, d).getDay();
      if (dow === 0 || dow === 6) continue;
      const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const existing = db.attendanceRecords.find(r => r.employeeId === EMP_ID && r.date === dateStr);
      if (existing) {
        result.push(existing);
      } else if (!(y === 2026 && m === 6 && d > 16)) {
        const seed = (d * 37 + m * 11) % 100;
        const status = seed < 70 ? 'Present' : seed < 82 ? 'Late' : seed < 90 ? 'Absent' : 'Undertime';
        result.push({
          id: `GEN-${dateStr}`,
          employeeId: EMP_ID,
          date: dateStr,
          timeIn: status === 'Absent' ? null : status === 'Late' ? `09:${String((seed % 30) + 10).padStart(2, '0')}` : `08:0${seed % 8}`,
          timeOut: status === 'Absent' ? null : status === 'Undertime' ? `15:${String(seed % 59).padStart(2, '0')}` : `17:0${seed % 5}`,
          totalHours: status === 'Absent' ? null : status === 'Late' ? 7 + (seed % 15) / 10 : 8 + (seed % 15) / 10,
          status,
        });
      }
    }
    return result;
  }

  function render() {
    document.getElementById('month-year-disp').textContent = `${MONTHS[month - 1]} ${year}`;

    const records = generateMonthRecords(year, month);
    const present = records.filter(r => r.status === 'Present').length;
    const late = records.filter(r => r.status === 'Late').length;
    const absent = records.filter(r => r.status === 'Absent').length;
    const undertime = records.filter(r => r.status === 'Undertime').length;
    const totalHours = records.reduce((s, r) => s + (r.totalHours ?? 0), 0);

    document.getElementById('sum-workdays').textContent = records.length;
    document.getElementById('sum-present').textContent = present;
    document.getElementById('sum-late').textContent = late;
    document.getElementById('sum-absent').textContent = absent;
    document.getElementById('sum-hours').textContent = `${totalHours.toFixed(1)}h`;

    const tbody = document.getElementById('attendance-tbody');
    tbody.innerHTML = '';

    records.forEach((r, i) => {
      const d = new Date(r.date);
      const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()];
      
      let bgClass = '';
      if (r.status === 'Absent') bgClass = 'bg-red-50/40';
      else if (r.status === 'Late') bgClass = 'bg-amber-50/40';
      else if (r.status === 'Undertime') bgClass = 'bg-orange-50/40';
      else if (i % 2 !== 0) bgClass = 'bg-secondary/10';

      let remarks = '';
      if (r.status === 'Late') remarks = 'Deducted from salary';
      else if (r.status === 'Absent') remarks = 'No pay for this day';
      else if (r.status === 'Undertime') remarks = 'Partial deduction';

      const tr = document.createElement('tr');
 tr.className = `border-b border-border/50 hover:bg-gray-50 transition-colors cursor-pointer ${bgClass}`;
      tr.innerHTML = `
        <td class="px-5 py-3 text-sm text-foreground font-medium">${r.date}</td>
        <td class="px-5 py-3 text-sm text-muted-foreground">${dayName}</td>
        <td class="px-5 py-3 text-sm text-foreground">${r.timeIn ?? '—'}</td>
        <td class="px-5 py-3 text-sm text-foreground">${r.timeOut ?? '—'}</td>
        <td class="px-5 py-3 text-sm text-foreground">${r.totalHours ? `${r.totalHours.toFixed(2)} hrs` : '—'}</td>
        <td class="px-5 py-3">${getStatusBadge(r.status)}</td>
        <td class="px-5 py-3 text-xs text-muted-foreground">${remarks}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  document.getElementById('prev-month-btn').addEventListener('click', () => {
    if (month === 1) { month = 12; year--; }
    else month--;
    render();
  });

  document.getElementById('next-month-btn').addEventListener('click', () => {
    if (month === 12) { month = 1; year++; }
    else month++;
    render();
  });

  render();
});
