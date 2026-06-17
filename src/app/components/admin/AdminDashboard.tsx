import { Users, UserCheck, UserX, DollarSign, TrendingUp, Activity } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { employees, monthlyAttendanceData, recentActivities, attendanceRecords } from '../../data/mockData';
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const [empRes, attRes] = await Promise.all([
        supabase.from('employees').select('*'),
        supabase.from('attendance_records').select('*')
      ]);
      if (empRes.data) setEmployees(empRes.data);
      if (attRes.data) setAttendanceRecords(attRes.data);
      setLoading(false);
    }
    fetchData();
  }, []);

  const today = '2026-06-16';
  const todayRecords = attendanceRecords.filter(r => r.date === today);
  const activeCount = employees.filter(e => e.status === 'Active').length;
  const onLeaveCount = employees.filter(e => e.status === 'On Leave').length;
  const presentToday = todayRecords.filter(r => r.status === 'Present' || r.status === 'Late').length;

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
      value: 9,
      sub: 'June 2026 — ₱525,537.00',
      icon: DollarSign,
      color: 'bg-violet-500',
      light: 'bg-violet-50',
      textColor: 'text-violet-600',
    },
  ];

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
              <span className="text-emerald-600 font-medium">92.4%</span> avg rate
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={monthlyAttendanceData} barSize={18} barGap={2} barCategoryGap="20%">
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
            {recentActivities.map(activity => (
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
            <p className="text-xs text-muted-foreground mt-0.5">June 16, 2026</p>
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
              {employees.filter(e => e.status !== 'Inactive').slice(0, 7).map((emp, i) => {
                const record = attendanceRecords.find(r => r.employee_id === emp.id && r.date === today);
                const statusLabel = emp.status === 'On Leave' ? 'On Leave' : (record?.status ?? 'Absent');
                const statusColor: Record<string, string> = {
                  Present: 'text-emerald-600 bg-emerald-50',
                  Late: 'text-amber-700 bg-amber-50',
                  Absent: 'text-red-600 bg-red-50',
                  Undertime: 'text-orange-700 bg-orange-50',
                  'On Leave': 'text-blue-700 bg-blue-50',
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
