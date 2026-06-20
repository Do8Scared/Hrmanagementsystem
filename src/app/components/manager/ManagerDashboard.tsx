import { useState, useEffect } from 'react';
import { Users, Clock, CalendarDays, Briefcase, Star, ShieldAlert, ChevronRight, CheckCircle2, AlertCircle, TrendingUp } from 'lucide-react';
import { supabase } from '../../../lib/supabaseClient';
import { useAuth } from '../../../lib/useAuth';
import { nteRecords } from '../../data/mockData';
import { type Page } from '../Layout';

interface Props {
  onNavigate: (page: Page) => void;
}

export function ManagerDashboard({ onNavigate }: Props) {
  const { user } = useAuth();
  const today = '2026-06-16'; // Using the mock date used across the app

  const [loading, setLoading] = useState(true);
  const [myTeam, setMyTeam] = useState<any[]>([]);
  const [todayAttendance, setTodayAttendance] = useState<any[]>([]);
  const [pendingLeaves, setPendingLeaves] = useState<any[]>([]);
  const [myRequests, setMyRequests] = useState<any[]>([]);
  const [myInterviews, setMyInterviews] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        // 1. Fetch team members (same department, excluding self)
        const { data: teamData } = await supabase
          .from('employees')
          .select('*')
          .eq('department', user.department)
          .neq('name', user.name);

        const team = teamData || [];
        setMyTeam(team);

        // 2. Fetch today's attendance for the team
        const { data: attendanceData } = await supabase
          .from('attendance_records')
          .select('*')
          .eq('date', today);

        const attendance = team.map(emp => {
          const rec = (attendanceData || []).find(r => r.employee_id === emp.id);
          return { emp, status: emp.status === 'On Leave' ? 'On Leave' : rec?.status ?? 'Absent' };
        });
        setTodayAttendance(attendance);

        // 3. Fetch pending leave requests for the team
        const teamIds = team.map(t => t.id);
        if (teamIds.length > 0) {
          const { data: leavesData } = await supabase
            .from('leave_requests')
            .select('*')
            .eq('status', 'Pending')
            .in('employee_id', teamIds);
          
          // Map to match the expected format in UI
          const leaves = (leavesData || []).map(l => {
            const emp = team.find(e => e.id === l.employee_id);
            return {
              id: l.id,
              employeeName: emp?.name || 'Unknown',
              leaveType: l.leave_type,
              startDate: l.start_date,
              endDate: l.end_date,
              days: l.days
            };
          });
          setPendingLeaves(leaves);
        }

        // 4. Fetch my manpower requests
        const { data: requestsData } = await supabase
          .from('manpower_requests')
          .select('*')
          .eq('requestingmanager', user.name); // Using snake_case table, assuming requestingmanager is column
        setMyRequests(requestsData || []);

        // 5. Fetch upcoming interviews
        const { data: interviewsData } = await supabase
          .from('interviews')
          .select('*')
          .eq('interviewer', user.name)
          .eq('status', 'Upcoming')
          .order('date', { ascending: true })
          .limit(3);
        setMyInterviews(interviewsData || []);

      } catch (err) {
        console.error('Error fetching manager data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (!user) return null;

  const presentCount = todayAttendance.filter(r => r.status === 'Present' || r.status === 'Late').length;
  const pendingRequests = myRequests.filter(r => r.status === 'Pending');

  // Employee Relations Cases (Fallback to mock data for now)
  const myERCases = nteRecords.filter(n => n.issuedBy === user.name && !['Closed', 'Voided'].includes(n.status));

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
      sub: myTeam.length > 0 ? `${Math.round((presentCount / myTeam.length) * 100)}% of team` : '0% of team',
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

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground">Loading Manager Dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="rounded-2xl px-8 py-6 flex items-center justify-between relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, var(--sidebar) 0%, #5A0D10 100%)' }}>
        <div className="absolute right-0 top-0 w-64 h-64 rounded-full bg-white/5 -translate-y-1/3 translate-x-1/4 pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-1" style={{ background: 'var(--sidebar-primary)' }} />
        <div>
          <p className="text-white/60 text-sm">Good morning,</p>
          <h2 className="text-white font-bold text-2xl">{user.name}</h2>
          <p className="text-white/50 text-sm mt-0.5">{user.position} · {user.department} Department</p>
          <p className="text-white/30 text-xs mt-2">Tuesday, June 16, 2026</p>
        </div>
        <div className="flex items-center gap-3 z-10">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
            style={{ background: 'var(--sidebar-primary)' }}>
            <span className="font-bold text-2xl" style={{ color: 'var(--sidebar-primary-foreground)' }}>{user.initials}</span>
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
              {myTeam.length > 0 ? Math.round((presentCount / myTeam.length) * 100) : 0}%
            </div>
          </div>
          <div className="divide-y divide-border/50 max-h-[300px] overflow-y-auto">
            {todayAttendance.map(({ emp, status }) => (
              <div key={emp.id} className="flex items-center gap-3 px-5 py-3">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-bold">{emp.initials || emp.name.substring(0,2)}</span>
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
            {todayAttendance.length === 0 && (
               <div className="p-4 text-center text-sm text-muted-foreground">No team members found.</div>
            )}
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
              <div className="divide-y divide-border/50 max-h-[200px] overflow-y-auto">
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
                      <div className="text-sm font-semibold text-foreground truncate">{i.applicantname || i.applicantName}</div>
                      <div className="text-xs text-muted-foreground">{i.jobtitle || i.jobTitle} · {i.date} {i.time}</div>
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
