document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('attendanceChart');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          { label: 'Present',   data: [18, 19, 18, 20, 21, 20], backgroundColor: '#10B981', borderRadius: { topLeft: 3, topRight: 3 } },
          { label: 'Late',      data: [3, 2, 4, 2, 1, 2],       backgroundColor: '#F59E0B', borderRadius: { topLeft: 3, topRight: 3 } },
          { label: 'Absent',    data: [1, 1, 0, 0, 1, 0],       backgroundColor: '#EF4444', borderRadius: { topLeft: 3, topRight: 3 } },
          { label: 'Undertime', data: [0, 0, 0, 1, 0, 1],       backgroundColor: '#F97316', borderRadius: { topLeft: 3, topRight: 3 } },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#FFFFFF', titleColor: '#2A1215', bodyColor: '#7A5C50',
            borderColor: '#E8D8C8', borderWidth: 1, padding: 10, boxPadding: 4, usePointStyle: true,
          },
        },
        scales: {
          x: { stacked: false, grid: { display: false }, ticks: { color: '#7A5C50', font: { family: "'Nunito', system-ui, sans-serif", size: 12 } }, border: { display: false } },
          y: { stacked: false, grid: { color: '#F0E6D8', tickLength: 0 }, ticks: { color: '#7A5C50', font: { family: "'Nunito', system-ui, sans-serif", size: 12 } }, border: { display: false, dash: [3, 3] } },
        },
      },
    });
  }

  // Sidebar navigation
  const NAV_ROUTES = {
    'Dashboard':           'admin-dashboard.html',
    'Employee Management': 'admin-employees.html',
    'Payroll & Attendance':'admin-payroll.html',
    'Leave Management':    'admin-leave.html',
    'Recruitment':         'admin-recruitment.html',
    'HR Admin / ER':       'admin-hr.html',
    'Announcements':       'admin-announcements.html',
  };

  document.querySelectorAll('.nav-item').forEach(btn => {
    const label = btn.querySelector('.nav-label')?.textContent?.trim();
    const route = NAV_ROUTES[label];
    if (route) {
      btn.style.cursor = 'pointer';
      btn.addEventListener('click', () => { window.location.href = route; });
      if (route === 'admin-dashboard.html') {
        btn.style.background = 'rgba(255,255,255,0.15)';
        btn.style.color = 'white';
      }
    }
  });

  // Module card navigation
  const MODULE_ROUTES = {
    'Employee Management':   'admin-employees.html',
    'Compensation & Benefits': 'admin-payroll.html',
    'Leave Management':      'admin-leave.html',
    'Recruitment':           'admin-recruitment.html',
    'Employee Relations':    'admin-hr.html',
  };

  document.querySelectorAll('button').forEach(btn => {
    const heading = btn.querySelector('.font-semibold.text-sm.text-foreground.leading-tight');
    if (!heading) return;
    const route = MODULE_ROUTES[heading.textContent.trim()];
    if (route) {
      btn.style.cursor = 'pointer';
      btn.addEventListener('click', () => { window.location.href = route; });
    }
  });

  // Notification dropdown
  const notifBtn = document.getElementById('notif-btn');
  const notifDropdown = document.getElementById('notif-dropdown');
  if (notifBtn && notifDropdown) {
    notifBtn.addEventListener('click', e => { e.stopPropagation(); notifDropdown.classList.toggle('hidden'); });
    document.addEventListener('click', () => notifDropdown.classList.add('hidden'));
  }

  // Profile dropdown
  const profileBtn = document.getElementById('profile-btn');
  const profileDropdown = document.getElementById('profile-dropdown');
  const profileChevron = document.getElementById('profile-chevron');
  if (profileBtn && profileDropdown) {
    profileBtn.addEventListener('click', e => {
      e.stopPropagation();
      const hidden = profileDropdown.classList.toggle('hidden');
      if (profileChevron) profileChevron.style.transform = hidden ? 'rotate(0deg)' : 'rotate(180deg)';
    });
    document.addEventListener('click', () => {
      profileDropdown.classList.add('hidden');
      if (profileChevron) profileChevron.style.transform = 'rotate(0deg)';
    });
  }
});
