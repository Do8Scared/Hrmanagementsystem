import { Users, UserCheck, UserX, DollarSign, TrendingUp, Activity } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { type Page } from '../Layout';

interface Props {
  onNavigate: (page: Page) => void;
}

const activityIcons: Record<string, string> = {
  employee: '👤',
  leave: '📅',
  payroll: '💰',
  performance: '⭐',
};

const activityColors: Record<string, string> = {
  employee: 'bg-blue-50 text-blue-600',
  leave: 'bg-purple-50 text-purple-600',
  payroll: 'bg-emerald-50 text-emerald-600',
  performance: 'bg-amber-50 text-amber-600',
};

import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';

export function AdminDashboard({ onNavigate }: Props) {
  const [employees, setEmployees] = useState<any[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<any[]>([]);
  const [payrollRecords, setPayrollRecords] = useState<any[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<any[]>([]);
  const [performanceEvals, setPerformanceEvals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const [empRes, attRes, payRes, leaveRes, perfRes] = await Promise.all([
        supabase.from('employees').select('*'),
        supabase.from('attendance_records').select('*'),
        supabase.from('payroll_records').select('*'),
        supabase.from('leave_requests').select('*'),
        supabase.from('performance_evaluations').select('*')
      ]);
      if (empRes.data) setEmployees(empRes.data);
      if (attRes.data) setAttendanceRecords(attRes.data);
      if (payRes.data) setPayrollRecords(payRes.data);
      if (leaveRes.data) setLeaveRequests(leaveRes.data);
      if (perfRes.data) setPerformanceEvals(perfRes.data);
      setLoading(false);
    }
    fetchData();
  }, []);

  const today = new Date().toISOString().split('T')[0];
  const todayRecords = attendanceRecords.filter(r => r.date === today);
  const activeCount = employees.filter(e => e.status === 'Active').length;
  const onLeaveCount = employees.filter(e => e.status === 'On Leave').length;
  const presentToday = todayRecords.filter(r => r.status === 'Present' || r.status === 'Late').length;

  const monthlyDataMap: Record<string, any> = {
    'Jan': { month: 'Jan', present: 0, late: 0, absent: 0, undertime: 0 },
    'Feb': { month: 'Feb', present: 0, late: 0, absent: 0, undertime: 0 },
    'Mar': { month: 'Mar', present: 0, late: 0, absent: 0, undertime: 0 },
    'Apr': { month: 'Apr', present: 0, late: 0, absent: 0, undertime: 0 },
    'May': { month: 'May', present: 0, late: 0, absent: 0, undertime: 0 },
    'Jun': { month: 'Jun', present: 0, late: 0, absent: 0, undertime: 0 },
  };

  let totalPresentAndLate = 0;
  let totalExpected = 0;

  attendanceRecords.forEach(r => {
    const m = new Date(r.date).toLocaleString('default', { month: 'short' });
    if (monthlyDataMap[m]) {
      if (r.status === 'Present') monthlyDataMap[m].present += 1;
      else if (r.status === 'Late') monthlyDataMap[m].late += 1;
      else if (r.status === 'Absent') monthlyDataMap[m].absent += 1;
      else if (r.status === 'Undertime') monthlyDataMap[m].undertime += 1;
      
      totalExpected++;
      if (r.status === 'Present' || r.status === 'Late' || r.status === 'Undertime') {
        totalPresentAndLate++;
      }
    }
  });
  const computedMonthlyData = Object.values(monthlyDataMap);
  const avgAttendanceRate = totalExpected > 0 ? ((totalPresentAndLate / totalExpected) * 100).toFixed(1) : '0.0';

  const allActivities: any[] = [];

  attendanceRecords.filter(r => r.time_in).forEach(r => {
    const emp = employees.find(e => e.id === r.employee_id);
    const timeVal = r.time_out ? r.time_out : r.time_in;
    const dateObj = new Date(`${r.date}T${timeVal}`);
    allActivities.push({
      id: `att-${r.id}`,
      type: 'employee',
      action: r.time_out ? 'Timed Out' : 'Timed In',
      subject: emp ? emp.name : 'Employee',
      time: `${r.date} ${timeVal}`,
      timestamp: isNaN(dateObj.getTime()) ? 0 : dateObj.getTime()
    });
  });

  leaveRequests.forEach(l => {
    const dateObj = new Date(l.applied_date || l.start_date || '2026-06-01');
    const emp = employees.find(e => e.id === l.employee_id);
    allActivities.push({
      id: `leave-${l.id}`,
      type: 'leave',
      action: `Filed ${l.leave_type || 'Leave'}`,
      subject: emp ? emp.name : (l.employee_name || 'Employee'),
      time: l.applied_date || l.start_date,
      timestamp: isNaN(dateObj.getTime()) ? 0 : dateObj.getTime()
    });
  });

  payrollRecords.forEach(p => {
    // Attempt to parse 'period' e.g. "June 2026" or fallback
    const dateObj = new Date(p.period || '2026-06-01');
    const emp = employees.find(e => e.id === p.employee_id);
    allActivities.push({
      id: `pay-${p.id}`,
      type: 'payroll',
      action: `Payroll ${p.status || 'Processed'}`,
      subject: emp ? emp.name : (p.employee_name || 'Employee'),
      time: p.period,
      timestamp: isNaN(dateObj.getTime()) ? 0 : dateObj.getTime()
    });
  });

  performanceEvals.forEach(e => {
    const dateObj = new Date(e.date || '2026-06-01');
    const emp = employees.find(emp => emp.id === e.employee_id);
    allActivities.push({
      id: `perf-${e.id}`,
      type: 'performance',
      action: 'Evaluation Issued',
      subject: emp ? emp.name : (e.employee_name || 'Employee'),
      time: e.date,
      timestamp: isNaN(dateObj.getTime()) ? 0 : dateObj.getTime()
    });
  });

  const computedActivities = allActivities
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 5);

  const summaryCards = [
    {
      label: 'Total Employees',
      value: employees.length,
      sub: `${activeCount} active`,
      icon: Users,
      color: 'bg-blue-500',
      light: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      label: 'Present Today',
      value: presentToday,
      sub: activeCount ? `${Math.round((presentToday / activeCount) * 100)}% attendance rate` : '0% attendance rate',
      icon: UserCheck,
      color: 'bg-emerald-500',
      light: 'bg-emerald-50',
      textColor: 'text-emerald-600',
    },
    {
      label: 'On Leave',
      value: onLeaveCount,
      sub: 'Approved leaves this month',
      icon: UserX,
      color: 'bg-amber-500',
      light: 'bg-amber-50',
      textColor: 'text-amber-600',
    },
    {
      label: 'Pending Payroll',
      value: payrollRecords.filter(p => p.status === 'Pending').length,
      sub: `June 2026 — ₱${payrollRecords.filter(p => p.status === 'Pending').reduce((acc, p) => acc + (p.net_pay || 0), 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: 'bg-violet-500',
      light: 'bg-violet-50',
      textColor: 'text-violet-600',
    },
  ];

  const now = new Date();
  const currentHour = now.getHours();
  const currentMinutes = now.getMinutes();
  const isPast9AM = currentHour > 9 || (currentHour === 9 && currentMinutes > 0);

  const todayAttendanceSnapshot = employees
    .filter(e => e.status !== 'Inactive')
    .map(emp => {
      const record = attendanceRecords.find(r => r.employee_id === emp.id && r.date === today);
      let statusLabel = record?.status;
      
      if (emp.status === 'On Leave') {
        statusLabel = 'On Leave';
      } else if (!record) {
        statusLabel = isPast9AM ? 'Absent' : 'Pending';
      } else if (!statusLabel) {
        statusLabel = 'Absent';
      }
      
      return { emp, record, statusLabel };
    })
    .sort((a, b) => {
      const timeA = a.record?.time_in ? new Date(`${today}T${a.record.time_in}`).getTime() : 0;
      const timeB = b.record?.time_in ? new Date(`${today}T${b.record.time_in}`).getTime() : 0;
      if (isNaN(timeA) || isNaN(timeB)) return 0;
      return timeB - timeA;
    })
    .slice(0, 7);

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground">Loading dashboard data...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        {summaryCards.map(card => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-card rounded-xl border border-border p-5 flex items-start gap-4 hover:shadow-sm transition-shadow">
              <div className={`w-11 h-11 rounded-xl ${card.light} flex items-center justify-center flex-shrink-0`}>
                <Icon size={20} className={card.textColor} />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{card.value}</div>
                <div className="text-sm font-medium text-foreground mt-0.5">{card.label}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{card.sub}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts + Activity */}
      <div className="grid grid-cols-3 gap-4">
        {/* Monthly Attendance Chart */}
        <div className="col-span-2 bg-card rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-semibold text-foreground">Monthly Attendance Overview</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Company-wide attendance data — Jan to Jun 2026</p>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <TrendingUp size={14} className="text-emerald-500" />
              <span className="text-emerald-600 font-medium">{avgAttendanceRate}%</span> avg rate
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={computedMonthlyData} barSize={18} barGap={2} barCategoryGap="20%">
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E5E7EB', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                cursor={{ fill: '#F5F6FA' }}
              />
              <Bar dataKey="present" name="Present" fill="#10B981" radius={[3, 3, 0, 0]} isAnimationActive={false} />
              <Bar dataKey="late" name="Late" fill="#F59E0B" radius={[3, 3, 0, 0]} isAnimationActive={false} />
              <Bar dataKey="absent" name="Absent" fill="#EF4444" radius={[3, 3, 0, 0]} isAnimationActive={false} />
              <Bar dataKey="undertime" name="Undertime" fill="#F97316" radius={[3, 3, 0, 0]} isAnimationActive={false} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-center gap-5 pt-3">
            {[
              { label: 'Present', color: '#10B981' },
              { label: 'Late', color: '#F59E0B' },
              { label: 'Absent', color: '#EF4444' },
              { label: 'Undertime', color: '#F97316' },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm flex-shrink-0" style={{ background: item.color }} />
                <span className="text-xs text-muted-foreground">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Recent Activity</h3>
            <Activity size={16} className="text-muted-foreground" />
          </div>
          <div className="space-y-3">
            {computedActivities.map(activity => (
              <div key={activity.id} className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg ${activityColors[activity.type]} flex items-center justify-center flex-shrink-0 text-sm`}>
                  {activityIcons[activity.type]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-foreground leading-snug">{activity.action}</p>
                  <p className="text-xs font-medium text-primary mt-0.5 truncate">{activity.subject}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Today's Attendance Snapshot */}
      <div className="bg-card rounded-xl border border-border p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-foreground">Today's Attendance Snapshot</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
          </div>
          <button
            onClick={() => onNavigate('attendance')}
            className="text-xs text-accent hover:underline font-medium"
          >
            View Full Report →
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                {['Employee', 'Department', 'Time In', 'Status'].map(col => (
                  <th key={col} className="text-left text-xs font-semibold text-muted-foreground pb-3 pr-4">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {todayAttendanceSnapshot.map(({ emp, record, statusLabel }, i) => {
                const statusColor: Record<string, string> = {
                  Present: 'text-emerald-600 bg-emerald-50',
                  Late: 'text-amber-700 bg-amber-50',
                  Absent: 'text-red-600 bg-red-50',
                  Undertime: 'text-orange-700 bg-orange-50',
                  'On Leave': 'text-blue-700 bg-blue-50',
                  Pending: 'text-gray-600 bg-gray-100',
                };
                return (
                  <tr key={emp.id} className={`border-b border-border/50 ${i % 2 === 0 ? '' : 'bg-secondary/30'}`}>
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-xs font-semibold">{emp.initials}</span>
                        </div>
                        <span className="text-sm font-medium text-foreground">{emp.name}</span>
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-sm text-muted-foreground">{emp.department}</td>
                    <td className="py-3 pr-4 text-sm text-foreground">{record?.time_in ?? '—'}</td>
                    <td className="py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor[statusLabel] ?? 'text-gray-600 bg-gray-100'}`}>
                        {statusLabel}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
