import { Users, Clock, CalendarDays, Briefcase, Star, ShieldAlert, ChevronRight, CheckCircle2, AlertCircle, TrendingUp } from 'lucide-react';
import { employees, attendanceRecords, leaveRequests, nteRecords } from '../../data/mockData';
import { manpowerRequests, interviews } from '../../data/recruitmentData';
import { type Page } from '../Layout';

interface Props {
  onNavigate: (page: Page) => void;
}

// Manager: Maria Santos, Operations dept
const MANAGER_NAME = 'Maria Santos';
const MANAGER_DEPT = 'Operations';

export function ManagerDashboard({ onNavigate }: Props) {
  const today = '2026-06-16';

  // Team = employees whose dept matches (excluding the manager herself)
  const myTeam = employees.filter(e => e.department === MANAGER_DEPT && e.name !== MANAGER_NAME);

  // Today's attendance for the team
  const todayAttendance = myTeam.map(emp => {
    const rec = attendanceRecords.find(r => r.employeeId === emp.id && r.date === today);
    return { emp, status: emp.status === 'On Leave' ? 'On Leave' : rec?.status ?? 'Absent' };
  });
  const presentCount = todayAttendance.filter(r => r.status === 'Present' || r.status === 'Late').length;
  const onLeaveCount = todayAttendance.filter(r => r.status === 'On Leave').length;

  // Pending leave requests from my team
  const pendingLeaves = leaveRequests.filter(l =>
    l.status === 'Pending' && myTeam.some(e => e.id === l.employeeId)
  );

  // My manpower requests
  const myRequests = manpowerRequests.filter(r => r.requestingManager === MANAGER_NAME);
  const pendingRequests = myRequests.filter(r => r.status === 'Pending');

  // Upcoming interviews where I am the interviewer
  const myInterviews = interviews
    .filter(i => i.interviewer === MANAGER_NAME && i.status === 'Upcoming')
    .slice(0, 3);

  // ER cases I initiated
  const myERCases = nteRecords.filter(n => n.issuedBy === MANAGER_NAME && !['Closed', 'Voided'].includes(n.status));

  const statCards = [
    {
      label: 'Team Members',
      value: myTeam.length,
      sub: `${presentCount} present today`,
      icon: Users,
      color: 'bg-red-50 text-primary',
      page: null as Page | null,
    },
    {
      label: 'Present Today',
      value: presentCount,
      sub: `${Math.round((presentCount / myTeam.length) * 100)}% of team`,
      icon: CheckCircle2,
      color: 'bg-emerald-50 text-emerald-700',
      page: null as Page | null,
    },
    {
      label: 'Pending Leave Requests',
      value: pendingLeaves.length,
      sub: 'awaiting your approval',
      icon: CalendarDays,
      color: 'bg-amber-50 text-amber-700',
      page: null as Page | null,
    },
    {
      label: 'Open Manpower Requests',
      value: pendingRequests.length,
      sub: 'submitted to HR',
      icon: Briefcase,
      color: 'bg-violet-50 text-violet-700',
      page: 'manager-request' as Page,
    },
  ];

  const modules = [
    {
      title: 'Manpower Request',
      desc: 'Request additional headcount for your team',
      icon: Briefcase,
      page: 'manager-request' as Page,
      stat: `${myRequests.length} total requests`,
      light: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-100',
    },
    {
      title: 'Interview Feedback',
      desc: 'Submit feedback on candidates you interviewed',
      icon: Star,
      page: 'manager-feedback' as Page,
      stat: `${myInterviews.length} upcoming`,
      light: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-100',
    },
    {
      title: 'Employee Relations',
      desc: 'Issue NTE or track disciplinary cases for your team',
      icon: ShieldAlert,
      page: 'hr-admin' as Page,
      stat: myERCases.length > 0 ? `${myERCases.length} active case${myERCases.length > 1 ? 's' : ''}` : 'No active cases',
      light: 'bg-red-50', text: 'text-primary', border: 'border-red-100',
      alert: myERCases.length > 0,
    },
  ];

  const attendanceColor: Record<string, string> = {
    Present: 'text-emerald-600 bg-emerald-50',
    Late: 'text-amber-700 bg-amber-50',
    Absent: 'text-red-600 bg-red-50',
    Undertime: 'text-orange-700 bg-orange-50',
    'On Leave': 'text-violet-700 bg-violet-50',
  };

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="rounded-2xl px-8 py-6 flex items-center justify-between relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, var(--sidebar) 0%, #5A0D10 100%)' }}>
        <div className="absolute right-0 top-0 w-64 h-64 rounded-full bg-white/5 -translate-y-1/3 translate-x-1/4 pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-1" style={{ background: 'var(--sidebar-primary)' }} />
        <div>
          <p className="text-white/60 text-sm">Good morning,</p>
          <h2 className="text-white font-bold text-2xl">{MANAGER_NAME}</h2>
          <p className="text-white/50 text-sm mt-0.5">Operations Manager · {MANAGER_DEPT} Department</p>
          <p className="text-white/30 text-xs mt-2">Tuesday, June 16, 2026</p>
        </div>
        <div className="flex items-center gap-3 z-10">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
            style={{ background: 'var(--sidebar-primary)' }}>
            <span className="font-bold text-2xl" style={{ color: 'var(--sidebar-primary-foreground)' }}>MS</span>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-4">
        {statCards.map(card => {
          const Icon = card.icon;
          return (
            <div key={card.label}
              onClick={() => card.page && onNavigate(card.page)}
              className={`bg-card rounded-xl border border-border p-5 flex items-start gap-4 transition-shadow hover:shadow-sm ${card.page ? 'cursor-pointer' : ''}`}>
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${card.color}`}>
                <Icon size={20} />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{card.value}</div>
                <div className="text-sm font-semibold text-foreground mt-0.5">{card.label}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{card.sub}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Module quick-access */}
      <div>
        <h2 className="font-bold text-foreground mb-3">My Modules</h2>
        <div className="grid grid-cols-3 gap-3">
          {modules.map(mod => {
            const Icon = mod.icon;
            return (
              <button key={mod.title} onClick={() => onNavigate(mod.page)}
                className={`group relative bg-card rounded-xl border ${mod.border} p-5 text-left hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 overflow-hidden`}>
                {mod.alert && <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white" />}
                <div className={`w-10 h-10 rounded-xl ${mod.light} flex items-center justify-center mb-3`}>
                  <Icon size={20} className={mod.text} />
                </div>
                <div className="font-bold text-sm text-foreground">{mod.title}</div>
                <div className="text-xs text-muted-foreground mt-1 leading-snug">{mod.desc}</div>
                <div className={`mt-3 text-xs font-semibold ${mod.alert ? 'text-red-600' : mod.text}`}>{mod.stat}</div>
                <ChevronRight size={14} className="absolute bottom-4 right-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Two-column lower section */}
      <div className="grid grid-cols-2 gap-4">
        {/* Team attendance today */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div>
              <h3 className="font-bold text-foreground text-sm">Team Attendance Today</h3>
              <p className="text-xs text-muted-foreground mt-0.5">June 16, 2026 · {myTeam.length} members</p>
            </div>
            <div className="flex items-center gap-1 text-xs text-emerald-700 font-semibold">
              <TrendingUp size={13} />
              {Math.round((presentCount / myTeam.length) * 100)}%
            </div>
          </div>
          <div className="divide-y divide-border/50">
            {todayAttendance.map(({ emp, status }) => (
              <div key={emp.id} className="flex items-center gap-3 px-5 py-3">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-bold">{emp.initials}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-foreground truncate">{emp.name}</div>
                  <div className="text-xs text-muted-foreground">{emp.position}</div>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${attendanceColor[status] ?? 'bg-secondary text-muted-foreground'}`}>
                  {status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right column: pending leaves + upcoming interviews */}
        <div className="space-y-4">
          {/* Pending leaves */}
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h3 className="font-bold text-foreground text-sm">Pending Leave Requests</h3>
              {pendingLeaves.length > 0 && (
                <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
                  {pendingLeaves.length} pending
                </span>
              )}
            </div>
            {pendingLeaves.length === 0 ? (
              <div className="px-5 py-6 text-center">
                <CheckCircle2 size={22} className="text-emerald-500 mx-auto mb-1.5" />
                <p className="text-sm text-muted-foreground">No pending leave requests</p>
              </div>
            ) : (
              <div className="divide-y divide-border/50">
                {pendingLeaves.map(l => (
                  <div key={l.id} className="flex items-center gap-3 px-5 py-3">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-foreground truncate">{l.employeeName}</div>
                      <div className="text-xs text-muted-foreground">{l.leaveType} · {l.startDate} – {l.endDate}</div>
                    </div>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">{l.days}d</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming interviews */}
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h3 className="font-bold text-foreground text-sm">Upcoming Interviews</h3>
              <button onClick={() => onNavigate('manager-feedback')}
                className="text-xs text-accent hover:underline font-semibold flex items-center gap-0.5">
                View all <ChevronRight size={12} />
              </button>
            </div>
            {myInterviews.length === 0 ? (
              <div className="px-5 py-6 text-center">
                <Clock size={22} className="text-muted-foreground mx-auto mb-1.5" />
                <p className="text-sm text-muted-foreground">No upcoming interviews</p>
              </div>
            ) : (
              <div className="divide-y divide-border/50">
                {myInterviews.map(i => (
                  <div key={i.id} className="flex items-center gap-3 px-5 py-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                      <Star size={14} className="text-amber-700" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-foreground truncate">{i.applicantName}</div>
                      <div className="text-xs text-muted-foreground">{i.jobTitle} · {i.date} {i.time}</div>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold capitalize">{i.format}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Active ER cases */}
          {myERCases.length > 0 && (
            <div className="bg-card rounded-xl border border-red-200 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-red-100 bg-red-50/50">
                <div className="flex items-center gap-2">
                  <AlertCircle size={15} className="text-primary" />
                  <h3 className="font-bold text-foreground text-sm">Active ER Cases</h3>
                </div>
                <button onClick={() => onNavigate('hr-admin')}
                  className="text-xs text-primary hover:underline font-semibold flex items-center gap-0.5">
                  View <ChevronRight size={12} />
                </button>
              </div>
              <div className="divide-y divide-border/50">
                {myERCases.map(n => (
                  <div key={n.id} className="flex items-center gap-3 px-5 py-3">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-foreground truncate">{n.employeeName}</div>
                      <div className="text-xs text-muted-foreground">{n.incidentType} · {n.id}</div>
                    </div>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      n.status === 'Pending Explanation' ? 'bg-amber-100 text-amber-800' :
                      n.status === 'Explanation Submitted' ? 'bg-violet-100 text-violet-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>{n.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
