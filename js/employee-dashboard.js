

document.addEventListener('DOMContentLoaded', () => {
  const EMP_ID = 'EMP002'; // Alex Diaz
  const emp = db.employees.find(e => e.id === EMP_ID);
  const today = '2026-06-16';

  const greetingHour = 8;
  const greeting = greetingHour < 12 ? 'Good morning' : greetingHour < 17 ? 'Good afternoon' : 'Good evening';

  document.getElementById('greeting-text').textContent = `${greeting},`;
  document.getElementById('emp-name').textContent = emp.name;
  document.getElementById('emp-role').textContent = `${emp.position} · ${emp.department}`;
  document.getElementById('emp-date').textContent = `Tuesday, June 16, 2026`;
  document.getElementById('emp-initials').textContent = emp.initials;

  const todayRecord = db.attendanceRecords.find(r => r.employeeId === EMP_ID && r.date === today);
  const latestPayslip = db.payslips[0]; // mock
  const balance = db.leaveBalances.find(b => b.employeeId === EMP_ID);

  let timedIn = !!todayRecord?.timeIn;
  let timedOut = !!todayRecord?.timeOut;
  const currentTime = '08:07';

  // Stats for the month
  const myAtt = db.attendanceRecords.filter(r => r.employeeId === EMP_ID);
  const sumPresent = myAtt.filter(r => r.status === 'Present').length;
  const sumLate = myAtt.filter(r => r.status === 'Late').length;
  const sumAbsent = myAtt.filter(r => r.status === 'Absent').length;
  const sumUndertime = myAtt.filter(r => r.status === 'Undertime').length;

  document.getElementById('sum-present').textContent = sumPresent;
  document.getElementById('sum-late').textContent = sumLate;
  document.getElementById('sum-absent').textContent = sumAbsent;
  document.getElementById('sum-undertime').textContent = sumUndertime;

  // Leave Balances
  document.getElementById('vl-bal').textContent = `${balance.vacationLeave - balance.vacationUsed} days left`;
  document.getElementById('sl-bal').textContent = `${balance.sickLeave - balance.sickUsed} days left`;
  document.getElementById('el-bal').textContent = `${balance.emergencyLeave - balance.emergencyUsed} days left`;

  // Payslip
  if(latestPayslip) {
    document.getElementById('ps-period').textContent = latestPayslip.period;
    document.getElementById('ps-gross').textContent = `₱${latestPayslip.grossPay.toLocaleString('en-PH', { minimumFractionDigits: 2 })}`;
    document.getElementById('ps-net').textContent = `₱${latestPayslip.netPay.toLocaleString('en-PH', { minimumFractionDigits: 2 })}`;
  }

  function renderAttendance() {
    document.getElementById('time-in-val').textContent = timedIn ? currentTime : '—';
    document.getElementById('time-out-val').textContent = timedOut ? '17:00' : '—';
    
    const statusEl = document.getElementById('att-status-val');
    statusEl.textContent = timedIn ? 'Present' : 'Not Yet In';
    statusEl.className = `font-medium ${timedIn ? 'text-emerald-600' : 'text-red-500'}`;

    if (timedIn && !timedOut) {
      document.getElementById('active-pulse').classList.remove('hidden');
    } else {
      document.getElementById('active-pulse').classList.add('hidden');
    }

    // CTA buttons
    const ctnTimeIn = document.getElementById('btn-container-timein');
    const stTimeIn = document.getElementById('status-timein');
    const ctnTimeOut = document.getElementById('btn-container-timeout');
    const stTimeOut = document.getElementById('status-timeout');

    if (!timedIn) {
      ctnTimeIn.classList.remove('hidden');
      stTimeIn.classList.add('hidden');
      ctnTimeOut.classList.add('hidden');
      stTimeOut.classList.add('hidden');
    } else if (timedIn && !timedOut) {
      ctnTimeIn.classList.add('hidden');
      stTimeIn.classList.remove('hidden');
      document.getElementById('status-timein-text').textContent = `Timed In at ${currentTime}`;
      
      ctnTimeOut.classList.remove('hidden');
      stTimeOut.classList.add('hidden');
    } else if (timedOut) {
      ctnTimeIn.classList.add('hidden');
      stTimeIn.classList.remove('hidden');
      
      ctnTimeOut.classList.add('hidden');
      stTimeOut.classList.remove('hidden');
    }
  }

  document.getElementById('btn-timein').addEventListener('click', () => {
    timedIn = true;
    renderAttendance();
  });

  document.getElementById('btn-timeout').addEventListener('click', () => {
    timedOut = true;
    renderAttendance();
  });

  renderAttendance();
});
