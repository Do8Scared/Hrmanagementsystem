import { db } from './db.js';

// Manager Dashboard Logic
document.addEventListener('DOMContentLoaded', () => {
  const MANAGER_NAME = 'Maria Santos';
  const MANAGER_DEPT = 'Operations';
  const today = '2026-06-16';

  document.getElementById('current-date').textContent = `Tuesday, June 16, 2026`;

  const myTeam = db.employees.filter(e => e.department === MANAGER_DEPT && e.name !== MANAGER_NAME);

  const todayAttendance = myTeam.map(emp => {
    const rec = db.attendanceRecords.find(r => r.employeeId === emp.id && r.date === today);
    return { emp, status: emp.status === 'On Leave' ? 'On Leave' : rec?.status ?? 'Absent' };
  });
  const presentCount = todayAttendance.filter(r => r.status === 'Present' || r.status === 'Late').length;
  const onLeaveCount = todayAttendance.filter(r => r.status === 'On Leave').length;

  const pendingLeaves = db.leaveRequests.filter(l =>
    l.status === 'Pending' && myTeam.some(e => e.id === l.employeeId)
  );

  const myRequests = db.manpowerRequests.filter(r => r.requestingManager === MANAGER_NAME);
  const pendingRequests = myRequests.filter(r => r.status === 'Pending');

  const myInterviews = db.interviews
    .filter(i => i.interviewer === MANAGER_NAME && i.status === 'Upcoming')
    .slice(0, 3);

  const myERCases = db.nteRecords.filter(n => n.issuedBy === MANAGER_NAME && !['Closed', 'Voided'].includes(n.status));

  // Render Stats
  const statCards = [
    { label: 'Team Members', value: myTeam.length, sub: `${presentCount} present today`, icon: 'users', color: 'bg-red-50 text-primary', link: 'manager-dashboard.html' },
    { label: 'Present Today', value: presentCount, sub: `${Math.round((presentCount / myTeam.length) * 100)}% of team`, icon: 'check-circle-2', color: 'bg-emerald-50 text-emerald-700', link: 'manager-dashboard.html' },
    { label: 'Pending Leave Requests', value: pendingLeaves.length, sub: 'awaiting your approval', icon: 'calendar-days', color: 'bg-amber-50 text-amber-700', link: 'manager-dashboard.html' },
    { label: 'Open Manpower Requests', value: pendingRequests.length, sub: 'submitted to HR', icon: 'briefcase', color: 'bg-violet-50 text-violet-700', link: 'manager-manpower.html' },
  ];

  const mgrStats = document.getElementById('mgr-stats');
  statCards.forEach(card => {
    mgrStats.innerHTML += `
      <a href="${card.link}" class="bg-card rounded-xl border border-border p-5 flex items-start gap-4 transition-shadow hover:shadow-sm">
        <div class="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${card.color}">
          <i data-lucide="${card.icon}" style="width: 20px; height: 20px;"></i>
        </div>
        <div>
          <div class="text-2xl font-bold text-foreground">${card.value}</div>
          <div class="text-sm font-semibold text-foreground mt-0.5">${card.label}</div>
          <div class="text-xs text-muted-foreground mt-0.5">${card.sub}</div>
        </div>
      </a>
    `;
  });

  // Render Modules
  const modules = [
    { title: 'Manpower Request', desc: 'Request additional headcount for your team', icon: 'briefcase', page: 'manager-manpower.html', stat: `${myRequests.length} total requests`, light: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-100' },
    { title: 'Interview Feedback', desc: 'Submit feedback on candidates you interviewed', icon: 'star', page: 'manager-interviews.html', stat: `${myInterviews.length} upcoming`, light: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-100' },
    { title: 'Employee Relations', desc: 'Issue NTE or track disciplinary cases for your team', icon: 'shield-alert', page: '#', stat: myERCases.length > 0 ? `${myERCases.length} active cases` : 'No active cases', light: 'bg-red-50', text: 'text-primary', border: 'border-red-100', alert: myERCases.length > 0 },
  ];

  const mgrModules = document.getElementById('mgr-modules');
  modules.forEach(mod => {
    mgrModules.innerHTML += `
      <a href="${mod.page}" class="group relative bg-card rounded-xl border ${mod.border} p-5 text-left hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 overflow-hidden block">
        ${mod.alert ? '<span class="absolute top-3 right-3 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white"></span>' : ''}
        <div class="w-10 h-10 rounded-xl ${mod.light} flex items-center justify-center mb-3">
          <i data-lucide="${mod.icon}" style="width: 20px; height: 20px;" class="${mod.text}"></i>
        </div>
        <div class="font-bold text-sm text-foreground">${mod.title}</div>
        <div class="text-xs text-muted-foreground mt-1 leading-snug">${mod.desc}</div>
        <div class="mt-3 text-xs font-semibold ${mod.alert ? 'text-red-600' : mod.text}">${mod.stat}</div>
        <i data-lucide="chevron-right" style="width: 14px; height: 14px;" class="absolute bottom-4 right-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"></i>
      </a>
    `;
  });

  // Render Team Attendance
  const attendanceColor = {
    Present: 'text-emerald-600 bg-emerald-50',
    Late: 'text-amber-700 bg-amber-50',
    Absent: 'text-red-600 bg-red-50',
    Undertime: 'text-orange-700 bg-orange-50',
    'On Leave': 'text-violet-700 bg-violet-50',
  };

  document.getElementById('team-att-subtitle').textContent = `June 16, 2026 · ${myTeam.length} members`;
  document.getElementById('team-att-percent').innerHTML = `<i data-lucide="trending-up" style="width: 13px; height: 13px;"></i> ${Math.round((presentCount / myTeam.length) * 100)}%`;

  const teamAttList = document.getElementById('team-att-list');
  todayAttendance.forEach(({ emp, status }) => {
    teamAttList.innerHTML += `
      <div class="flex items-center gap-3 px-5 py-3">
        <div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
          <span class="text-white text-xs font-bold">${emp.initials}</span>
        </div>
        <div class="flex-1 min-w-0">
          <div class="text-sm font-semibold text-foreground truncate">${emp.name}</div>
          <div class="text-xs text-muted-foreground">${emp.position}</div>
        </div>
        <span class="text-xs font-semibold px-2.5 py-0.5 rounded-full ${attendanceColor[status] ?? 'bg-secondary text-muted-foreground'}">${status}</span>
      </div>
    `;
  });

  // Pending Leaves
  const pendingLeavesBadge = document.getElementById('pending-leaves-badge');
  const pendingLeavesList = document.getElementById('pending-leaves-list');
  if (pendingLeaves.length > 0) {
    pendingLeavesBadge.textContent = `${pendingLeaves.length} pending`;
    pendingLeavesBadge.classList.remove('hidden');
    pendingLeaves.forEach(l => {
      pendingLeavesList.innerHTML += `
        <div class="flex items-center gap-3 px-5 py-3">
          <div class="flex-1 min-w-0">
            <div class="text-sm font-semibold text-foreground truncate">${l.employeeName}</div>
            <div class="text-xs text-muted-foreground">${l.leaveType} · ${l.startDate} – ${l.endDate}</div>
          </div>
          <span class="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">${l.days}d</span>
        </div>
      `;
    });
  } else {
    pendingLeavesList.innerHTML = `
      <div class="px-5 py-6 text-center">
        <i data-lucide="check-circle-2" style="width: 22px; height: 22px;" class="text-emerald-500 mx-auto mb-1.5"></i>
        <p class="text-sm text-muted-foreground">No pending leave requests</p>
      </div>
    `;
  }

  // Upcoming Interviews
  const upcomingInterviewsList = document.getElementById('upcoming-interviews-list');
  if (myInterviews.length > 0) {
    myInterviews.forEach(i => {
      upcomingInterviewsList.innerHTML += `
        <div class="flex items-center gap-3 px-5 py-3">
          <div class="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
            <i data-lucide="star" style="width: 14px; height: 14px;" class="text-amber-700"></i>
          </div>
          <div class="flex-1 min-w-0">
            <div class="text-sm font-semibold text-foreground truncate">${i.applicantName}</div>
            <div class="text-xs text-muted-foreground">${i.jobTitle} · ${i.date} ${i.time}</div>
          </div>
          <span class="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold capitalize">${i.format}</span>
        </div>
      `;
    });
  } else {
    upcomingInterviewsList.innerHTML = `
      <div class="px-5 py-6 text-center">
        <i data-lucide="clock" style="width: 22px; height: 22px;" class="text-muted-foreground mx-auto mb-1.5"></i>
        <p class="text-sm text-muted-foreground">No upcoming interviews</p>
      </div>
    `;
  }

  // ER Cases
  if (myERCases.length > 0) {
    document.getElementById('active-er-cases').classList.remove('hidden');
    const activeErList = document.getElementById('active-er-list');
    myERCases.forEach(n => {
      activeErList.innerHTML += `
        <div class="flex items-center gap-3 px-5 py-3">
          <div class="flex-1 min-w-0">
            <div class="text-sm font-semibold text-foreground truncate">${n.employeeName}</div>
            <div class="text-xs text-muted-foreground">${n.incidentType} · ${n.id}</div>
          </div>
          <span class="text-xs font-semibold px-2 py-0.5 rounded-full ${
            n.status === 'Pending Explanation' ? 'bg-amber-100 text-amber-800' :
            n.status === 'Explanation Submitted' ? 'bg-violet-100 text-violet-800' :
            'bg-purple-100 text-purple-800'
          }">${n.status}</span>
        </div>
      `;
    });
  }

  if (typeof lucide !== 'undefined') lucide.createIcons();
});
