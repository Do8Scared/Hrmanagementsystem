document.addEventListener('DOMContentLoaded', () => {
  // --- Mock Data ---
  const employees = [
    { id: 'EMP001', name: 'Maria Santos', department: 'Human Resources', position: 'HR Manager', initials: 'MS' },
    { id: 'EMP002', name: 'Juan dela Cruz', department: 'Engineering', position: 'Senior Developer', initials: 'JD' },
    { id: 'EMP003', name: 'Ana Reyes', department: 'Marketing', position: 'Marketing Specialist', initials: 'AR' },
    { id: 'EMP004', name: 'Pedro Garcia', department: 'Finance', position: 'Accountant', initials: 'PG' },
    { id: 'EMP005', name: 'Elena Mendoza', department: 'Operations', position: 'Operations Manager', initials: 'EM' }
  ];

  const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const statusColor = { Present: 'bg-emerald-500', Late: 'bg-amber-400', Absent: 'bg-red-400', Undertime: 'bg-orange-400' };

  let selectedEmpId = employees[0].id;
  let currentYear = 2026;
  let currentMonth = 6;
  let currentSearch = '';
  let view = 'table'; // 'table' or 'calendar'

  // --- Elements ---
  const statPresent = document.getElementById('stat-present');
  const statLate = document.getElementById('stat-late');
  const statAbsent = document.getElementById('stat-absent');
  const statUndertime = document.getElementById('stat-undertime');
  const statTotals = document.querySelectorAll('.stat-total');

  const empSearch = document.getElementById('emp-search');
  const empList = document.getElementById('emp-list');
  
  const activeInitials = document.getElementById('active-initials');
  const activeName = document.getElementById('active-name');
  const activeRole = document.getElementById('active-role');

  const monthYearLabel = document.getElementById('month-year-label');
  const prevMonthBtn = document.getElementById('prev-month-btn');
  const nextMonthBtn = document.getElementById('next-month-btn');

  const viewTableBtn = document.getElementById('view-table-btn');
  const viewCalendarBtn = document.getElementById('view-calendar-btn');
  const tableView = document.getElementById('table-view');
  const calendarView = document.getElementById('calendar-view');
  
  const attendanceTbody = document.getElementById('attendance-tbody');
  const calendarGrid = document.getElementById('calendar-grid');

  function generateMockAttendance(empId, year, month) {
    const daysInMonth = new Date(year, month, 0).getDate();
    const result = [];
    // Just mock 16 days of data for the current month.
    for (let d = 1; d <= daysInMonth; d++) {
      const dow = new Date(year, month - 1, d).getDay();
      if (dow === 0 || dow === 6) continue; // Skip weekends
      
      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      
      if (d <= 16 && year === 2026 && month === 6) {
        const rand = Math.random();
        let status = 'Present';
        if (rand > 0.9) status = 'Absent';
        else if (rand > 0.8) status = 'Undertime';
        else if (rand > 0.7) status = 'Late';

        const tIn = status === 'Absent' ? null : status === 'Late' ? '09:' + String(Math.floor(Math.random() * 30 + 10)).padStart(2, '0') + ' AM' : '08:0' + Math.floor(Math.random() * 9) + ' AM';
        const tOut = status === 'Absent' ? null : status === 'Undertime' ? '03:' + String(Math.floor(Math.random() * 59)).padStart(2, '0') + ' PM' : '05:0' + Math.floor(Math.random() * 5) + ' PM';
        const totalHours = status === 'Absent' ? null : (8 + Math.random() * 0.5);

        result.push({ date: dateStr, timeIn: tIn, timeOut: tOut, totalHours, status });
      } else {
        // Future or past empty mock
        if (new Date(year, month - 1, d) < new Date(2026, 5, 17)) {
          result.push({ date: dateStr, timeIn: '08:00 AM', timeOut: '05:00 PM', totalHours: 8, status: 'Present' });
        }
      }
    }
    return result;
  }

  function updateUI() {
    // Filter employees
    empList.innerHTML = '';
    const filtered = employees.filter(e => e.name.toLowerCase().includes(currentSearch.toLowerCase()) || e.department.toLowerCase().includes(currentSearch.toLowerCase()));
    
    filtered.forEach(e => {
      const isSelected = selectedEmpId === e.id;
      const btn = document.createElement('button');
      btn.className = `w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left transition-colors ${isSelected ? 'bg-primary text-white' : 'hover:bg-secondary text-foreground'}`;
      btn.innerHTML = `
        <div class="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-semibold ${isSelected ? 'bg-white/20 text-white' : 'bg-primary text-white'}">${e.initials}</div>
        <div class="min-w-0">
          <div class="text-xs font-medium truncate">${e.name}</div>
          <div class="text-xs truncate ${isSelected ? 'text-white/60' : 'text-muted-foreground'}">${e.department}</div>
        </div>
      `;
      btn.addEventListener('click', () => {
        selectedEmpId = e.id;
        updateUI();
      });
      empList.appendChild(btn);
    });

    const activeEmp = employees.find(e => e.id === selectedEmpId);
    if (activeEmp) {
      activeInitials.textContent = activeEmp.initials;
      activeName.textContent = activeEmp.name;
      activeRole.textContent = `${activeEmp.position} · ${activeEmp.department}`;
    }

    monthYearLabel.textContent = `${MONTHS[currentMonth - 1]} ${currentYear}`;

    // Get Data
    const records = generateMockAttendance(selectedEmpId, currentYear, currentMonth);

    // Stats
    const present = records.filter(r => r.status === 'Present').length;
    const late = records.filter(r => r.status === 'Late').length;
    const absent = records.filter(r => r.status === 'Absent').length;
    const undertime = records.filter(r => r.status === 'Undertime').length;
    
    statPresent.textContent = present;
    statLate.textContent = late;
    statAbsent.textContent = absent;
    statUndertime.textContent = undertime;
    statTotals.forEach(el => el.textContent = records.length);

    // Render Table
    attendanceTbody.innerHTML = '';
    records.forEach((r, i) => {
      const d = new Date(r.date);
      const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()];
      const tr = document.createElement('tr');
      
      let bgClass = '';
      if (r.status === 'Late' || r.status === 'Undertime') bgClass = 'bg-amber-50/30';
      else if (r.status === 'Absent') bgClass = 'bg-red-50/30';
      else if (i % 2 !== 0) bgClass = 'bg-secondary/10';

      tr.className = `border-b border-border/50 ${bgClass}`;
      
      let statusHtml = '';
      if (r.status === 'Present') statusHtml = `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-emerald-600 bg-emerald-50 border border-emerald-100">Present</span>`;
      else if (r.status === 'Late') statusHtml = `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-amber-600 bg-amber-50 border border-amber-100">Late</span>`;
      else if (r.status === 'Absent') statusHtml = `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-red-600 bg-red-50 border border-red-100">Absent</span>`;
      else if (r.status === 'Undertime') statusHtml = `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-orange-600 bg-orange-50 border border-orange-100">Undertime</span>`;

      tr.innerHTML = `
        <td class="px-5 py-3 text-sm text-foreground">${r.date}</td>
        <td class="px-5 py-3 text-sm text-muted-foreground">${dayName}</td>
        <td class="px-5 py-3 text-sm text-foreground">${r.timeIn || '—'}</td>
        <td class="px-5 py-3 text-sm text-foreground">${r.timeOut || '—'}</td>
        <td class="px-5 py-3 text-sm text-foreground">${r.totalHours ? r.totalHours.toFixed(2) + ' hrs' : '—'}</td>
        <td class="px-5 py-3">${statusHtml}</td>
      `;
      attendanceTbody.appendChild(tr);
    });

    // Render Calendar
    calendarGrid.innerHTML = '';
    const firstDow = new Date(currentYear, currentMonth - 1, 1).getDay();
    const days = new Date(currentYear, currentMonth, 0).getDate();
    
    for (let i = 0; i < firstDow; i++) {
      const emptyCell = document.createElement('div');
      emptyCell.className = "aspect-square rounded-lg bg-secondary/30";
      calendarGrid.appendChild(emptyCell);
    }
    
    for (let d = 1; d <= days; d++) {
      const dateStr = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const rec = records.find(r => r.date === dateStr);
      
      const cell = document.createElement('div');
      cell.className = "aspect-square rounded-lg flex flex-col items-center justify-center text-xs relative border border-border hover:shadow-sm";
      cell.innerHTML = `<span class="text-foreground font-medium">${d}</span>`;
      
      if (rec) {
        const dot = document.createElement('span');
        dot.className = `absolute bottom-1.5 w-1.5 h-1.5 rounded-full ${statusColor[rec.status]}`;
        cell.appendChild(dot);
      }
      calendarGrid.appendChild(cell);
    }

    if (typeof lucide !== 'undefined') lucide.createIcons();
  }

  // --- Listeners ---
  empSearch.addEventListener('input', (e) => {
    currentSearch = e.target.value;
    updateUI();
  });

  prevMonthBtn.addEventListener('click', () => {
    if (currentMonth === 1) { currentMonth = 12; currentYear--; }
    else currentMonth--;
    updateUI();
  });

  nextMonthBtn.addEventListener('click', () => {
    if (currentMonth === 12) { currentMonth = 1; currentYear++; }
    else currentMonth++;
    updateUI();
  });

  viewTableBtn.addEventListener('click', () => {
    view = 'table';
    viewTableBtn.className = "px-3 py-1.5 text-xs capitalize transition-colors bg-primary text-white";
    viewCalendarBtn.className = "px-3 py-1.5 text-xs capitalize transition-colors text-muted-foreground hover:bg-secondary";
    tableView.classList.remove('hidden');
    calendarView.classList.add('hidden');
  });

  viewCalendarBtn.addEventListener('click', () => {
    view = 'calendar';
    viewCalendarBtn.className = "px-3 py-1.5 text-xs capitalize transition-colors bg-primary text-white";
    viewTableBtn.className = "px-3 py-1.5 text-xs capitalize transition-colors text-muted-foreground hover:bg-secondary";
    calendarView.classList.remove('hidden');
    tableView.classList.add('hidden');
  });

  // Init
  updateUI();
});
