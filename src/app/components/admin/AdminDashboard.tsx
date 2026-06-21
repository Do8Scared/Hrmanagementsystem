import { Users, UserCheck, UserX, DollarSign, TrendingUp, Activity, ChevronRight, CalendarDays, Briefcase, ShieldAlert, Clock } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { employees, monthlyAttendanceData, recentActivities, attendanceRecords, nteRecords, leaveRequests } from '../../data/mockData';
import { type Page } from '../Layout';

interface Props {
  onNavigate: (page: Page) => void;
}

const activityIcons: Record<string, string> = {
  employee: '👤',
  leave: '📅',
  payroll: '💰',
  performance: '⭐',
  'hr-admin': '🛡️',
};

const activityColors: Record<string, string> = {
  employee: 'bg-red-50 text-primary',
  leave: 'bg-purple-50 text-purple-600',
  payroll: 'bg-emerald-50 text-emerald-600',
  performance: 'bg-amber-50 text-amber-600',
  'hr-admin': 'bg-red-50 text-red-600',
};

export function AdminDashboard({ onNavigate }: Props) {
  const today = '2026-06-16';
  const todayRecords = attendanceRecords.filter(r => r.date === today);
  const activeCount = employees.filter(e => e.status === 'Active').length;
  const onLeaveCount = employees.filter(e => e.status === 'On Leave').length;
  const presentToday = todayRecords.filter(r => r.status === 'Present' || r.status === 'Late').length;
  const pendingLeaves = leaveRequests.filter(l => l.status === 'Pending').length;
  const openNTEs = nteRecords.filter(n => !['Closed', 'Voided'].includes(n.status)).length;

  const statCards = [
    {
      label: 'Total Employees',
      value: employees.length,
      sub: `${activeCount} active · ${onLeaveCount} on leave`,
      icon: Users,
      color: 'bg-primary',
      light: 'bg-red-50',
      text: 'text-primary',
    },
    {
      label: 'Present Today',
      value: presentToday,
      sub: `${Math.round((presentToday / activeCount) * 100)}% attendance rate`,
      icon: UserCheck,
      color: 'bg-emerald-500',
      light: 'bg-emerald-50',
      text: 'text-emerald-600',
    },
    {
      label: 'Pending Leaves',
      value: pendingLeaves,
      sub: 'Awaiting HR approval',
      icon: CalendarDays,
      color: 'bg-amber-500',
      light: 'bg-amber-50',
      text: 'text-amber-600',
    },
    {
      label: 'Pending Payroll',
      value: 9,
      sub: 'June 2026 — ₱525,537.00',
      icon: DollarSign,
      color: 'bg-violet-500',
      light: 'bg-violet-50',
      text: 'text-violet-600',
    },
  ];

  // Module navigation cards — exactly the 5 system modules
  const modules = [
    {
      title: 'Employee Management',
      description: 'Employee records, profiles, and information',
      icon: Users,
      page: 'employees' as Page,
      accent: 'bg-primary',
      light: 'bg-red-50',
      text: 'text-primary',
      border: 'border-red-100',
      stat: `${employees.length} employees`,
    },
    {
      title: 'Compensation & Benefits',
      description: 'Payroll processing, timekeeping, and statutory deductions',
      icon: DollarSign,
      page: 'payroll-attendance' as Page,
      accent: 'bg-violet-500',
      light: 'bg-violet-50',
      text: 'text-violet-600',
      border: 'border-violet-100',
      stat: '9 pending payroll',
    },
    {
      title: 'Leave Management',
      description: 'Leave requests, balances, and approvals',
      icon: CalendarDays,
      page: 'leaves' as Page,
      accent: 'bg-amber-500',
      light: 'bg-amber-50',
      text: 'text-amber-600',
      border: 'border-amber-100',
      stat: `${pendingLeaves} pending requests`,
    },
    {
      title: 'Recruitment',
      description: 'Job postings, applicants, and hiring pipeline',
      icon: Briefcase,
      page: 'recruitment' as Page,
      accent: 'bg-emerald-500',
      light: 'bg-emerald-50',
      text: 'text-emerald-600',
      border: 'border-emerald-100',
      stat: '3 open positions',
    },
    {
      title: 'Employee Relations',
      description: 'NTE, Notice of Decision — DOLE-compliant due process',
      icon: ShieldAlert,
      page: 'hr-admin' as Page,
      accent: 'bg-red-500',
      light: 'bg-red-50',
      text: 'text-red-600',
      border: 'border-red-100',
      stat: openNTEs > 0 ? `${openNTEs} active case${openNTEs > 1 ? 's' : ''}` : 'No active cases',
      alert: openNTEs > 0,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-4">
        {statCards.map(card => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-card rounded-xl border border-border p-5 flex items-start gap-4 hover:shadow-sm transition-shadow">
              <div className={`w-11 h-11 rounded-xl ${card.light} flex items-center justify-center flex-shrink-0`}>
                <Icon size={20} className={card.text} />
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

      {/* Module Navigation — the 5 system modules */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-foreground">System Modules</h2>
          <span className="text-xs text-muted-foreground">5 modules</span>
        </div>
        <div className="grid grid-cols-5 gap-3">
          {modules.map(mod => {
            const Icon = mod.icon;
            return (
              <button
                key={mod.title}
                onClick={() => onNavigate(mod.page)}
                className={`group relative bg-card rounded-xl border ${mod.border} p-4 text-left hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 overflow-hidden`}
              >
                {/* Alert indicator for active ER cases */}
                {mod.alert && (
                  <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white" />
                )}
                <div className={`w-10 h-10 rounded-xl ${mod.light} flex items-center justify-center mb-3`}>
                  <Icon size={20} className={mod.text} />
                </div>
                <div className="font-semibold text-sm text-foreground leading-tight">{mod.title}</div>
                <div className="text-xs text-muted-foreground mt-1 leading-snug">{mod.description}</div>
                <div className={`mt-3 text-xs font-medium ${mod.alert ? 'text-red-600' : mod.text}`}>{mod.stat}</div>
                <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ChevronRight size={14} className="text-muted-foreground" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Chart + Activity */}
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 bg-card rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-semibold text-foreground">Monthly Attendance Overview</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Company-wide — Jan to Jun 2026</p>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <TrendingUp size={14} className="text-emerald-500" />
              <span className="text-emerald-600 font-medium">92.4%</span>
              <span className="text-muted-foreground ml-1">avg rate</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyAttendanceData} barSize={16} barGap={2} barCategoryGap="22%">
              <CartesianGrid key="grid" strokeDasharray="3 3" stroke="#F0E6D8" vertical={false} />
              <XAxis key="x" dataKey="month" tick={{ fontSize: 12, fill: '#7A5C50' }} axisLine={false} tickLine={false} />
              <YAxis key="y" tick={{ fontSize: 12, fill: '#7A5C50' }} axisLine={false} tickLine={false} />
              <Tooltip key="tooltip"
                contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E8D8C8', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                cursor={{ fill: '#F5EBE0' }}
              />
              <Bar key="present" dataKey="present" name="Present" fill="#10B981" radius={[3, 3, 0, 0]} isAnimationActive={false} />
              <Bar key="late" dataKey="late" name="Late" fill="#F59E0B" radius={[3, 3, 0, 0]} isAnimationActive={false} />
              <Bar key="absent" dataKey="absent" name="Absent" fill="#EF4444" radius={[3, 3, 0, 0]} isAnimationActive={false} />
              <Bar key="undertime" dataKey="undertime" name="Undertime" fill="#F97316" radius={[3, 3, 0, 0]} isAnimationActive={false} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-center gap-5 pt-3 border-t border-border">
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

        <div className="bg-card rounded-xl border border-border p-5 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Recent Activity</h3>
            <Activity size={16} className="text-muted-foreground" />
          </div>
          <div className="space-y-3 flex-1">
            {recentActivities.slice(0, 6).map(activity => (
              <div key={activity.id} className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg ${activityColors[activity.type] ?? 'bg-secondary text-muted-foreground'} flex items-center justify-center flex-shrink-0 text-sm`}>
                  {activityIcons[activity.type] ?? '•'}
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
            <p className="text-xs text-muted-foreground mt-0.5">June 16, 2026</p>
          </div>
          <button
            onClick={() => onNavigate('payroll-attendance')}
            className="flex items-center gap-1 text-xs text-accent hover:underline font-medium"
          >
            <Clock size={12} /> View Full Report
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
              {employees.filter(e => e.status !== 'Inactive').slice(0, 7).map((emp, i) => {
                const record = attendanceRecords.find(r => r.employeeId === emp.id && r.date === today);
                const statusLabel = emp.status === 'On Leave' ? 'On Leave' : (record?.status ?? 'Absent');
                const statusColor: Record<string, string> = {
                  Present: 'text-emerald-600 bg-emerald-50',
                  Late: 'text-amber-700 bg-amber-50',
                  Absent: 'text-red-600 bg-red-50',
                  Undertime: 'text-orange-700 bg-orange-50',
                  'On Leave': 'text-accent bg-secondary',
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
                    <td className="py-3 pr-4 text-sm text-foreground">{record?.timeIn ?? '—'}</td>
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
