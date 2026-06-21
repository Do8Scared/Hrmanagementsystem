import { useState } from 'react';
import { Clock, CalendarDays, DollarSign, LogIn, LogOut, CheckCircle2 } from 'lucide-react';
import { employees, attendanceRecords, employeePayslips, leaveBalances } from '../../data/mockData';
import { type Page } from '../Layout';

interface Props {
  onNavigate: (page: Page) => void;
}

const fmt = (n: number) => `₱${n.toLocaleString('en-PH', { minimumFractionDigits: 2 })}`;

export function EmployeeDashboard({ onNavigate }: Props) {
  const emp = employees.find(e => e.id === 'EMP002')!;
  const todayRecord = attendanceRecords.find(r => r.employeeId === 'EMP002' && r.date === '2026-06-16');
  const latestPayslip = employeePayslips[0];
  const balance = leaveBalances.find(b => b.employeeId === 'EMP002')!;
  const [timedIn, setTimedIn] = useState(!!todayRecord?.timeIn);
  const [timedOut, setTimedOut] = useState(!!todayRecord?.timeOut);
  const [currentTime] = useState('08:07');

  const greetingHour = 8;
  const greeting = greetingHour < 12 ? 'Good morning' : greetingHour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="space-y-6">
      {/* Greeting Header */}
      <div className="bg-primary rounded-2xl p-6 flex items-center justify-between overflow-hidden relative">
        <div className="absolute right-0 top-0 w-64 h-64 rounded-full bg-white/5 -translate-y-1/3 translate-x-1/4" />
        <div className="absolute right-24 bottom-0 w-40 h-40 rounded-full bg-white/5 translate-y-1/2" />
        <div>
          <p className="text-white/60 text-sm">{greeting},</p>
          <h2 className="text-white font-bold text-2xl">{emp.name}</h2>
          <p className="text-white/60 text-sm mt-1">{emp.position} · {emp.department}</p>
          <p className="text-white/40 text-xs mt-3">Tuesday, June 16, 2026</p>
        </div>
        <div className="flex items-center gap-3 z-10">
          <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
            <span className="text-white text-2xl font-bold">{emp.initials}</span>
          </div>
        </div>
      </div>

      {/* Quick Cards */}
      <div className="grid grid-cols-3 gap-4">
        {/* Today's Attendance */}
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                <Clock size={16} className="text-accent" />
              </div>
              <span className="text-sm font-medium text-foreground">Today's Attendance</span>
            </div>
            {timedIn && !timedOut && (
              <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Active
              </span>
            )}
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Time In</span>
              <span className="font-medium text-foreground">{timedIn ? currentTime : '—'}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Time Out</span>
              <span className="font-medium text-foreground">{timedOut ? '17:00' : '—'}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Status</span>
              <span className={`font-medium ${timedIn ? 'text-emerald-600' : 'text-red-500'}`}>
                {timedIn ? 'Present' : 'Not Yet In'}
              </span>
            </div>
          </div>
        </div>

        {/* Leave Balance */}
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
              <CalendarDays size={16} className="text-purple-600" />
            </div>
            <span className="text-sm font-medium text-foreground">Leave Balance</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Vacation Leave</span>
              <span className="font-medium text-foreground">{balance.vacationLeave - balance.vacationUsed} days left</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Sick Leave</span>
              <span className="font-medium text-foreground">{balance.sickLeave - balance.sickUsed} days left</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Emergency Leave</span>
              <span className="font-medium text-foreground">{balance.emergencyLeave - balance.emergencyUsed} days left</span>
            </div>
          </div>
        </div>

        {/* Latest Payslip */}
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
              <DollarSign size={16} className="text-emerald-600" />
            </div>
            <span className="text-sm font-medium text-foreground">Latest Payslip</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Period</span>
              <span className="font-medium text-foreground">{latestPayslip.period}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Gross Pay</span>
              <span className="font-medium text-foreground">{fmt(latestPayslip.grossPay)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Net Pay</span>
              <span className="font-bold text-primary">{fmt(latestPayslip.netPay)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Time In / Out CTAs */}
      <div className="bg-card rounded-xl border border-border p-5">
        <h3 className="font-semibold text-foreground mb-4">Quick Actions</h3>
        <div className="flex items-center gap-4">
          {!timedIn ? (
            <button
              onClick={() => setTimedIn(true)}
              className="flex items-center gap-3 px-6 py-3 rounded-xl bg-primary text-white font-medium hover:bg-primary/90 transition-all shadow-sm hover:shadow-md"
            >
              <LogIn size={18} />
              <div className="text-left">
                <div className="text-sm font-semibold">Time In</div>
                <div className="text-xs text-white/70">Record your arrival</div>
              </div>
            </button>
          ) : (
            <div className="flex items-center gap-3 px-6 py-3 rounded-xl bg-emerald-50 border border-emerald-200">
              <CheckCircle2 size={18} className="text-emerald-600" />
              <div>
                <div className="text-sm font-semibold text-emerald-700">Timed In at {currentTime}</div>
                <div className="text-xs text-emerald-600">You're clocked in today</div>
              </div>
            </div>
          )}
          {timedIn && !timedOut ? (
            <button
              onClick={() => setTimedOut(true)}
              className="flex items-center gap-3 px-6 py-3 rounded-xl bg-foreground text-white font-medium hover:bg-foreground/90 transition-all shadow-sm hover:shadow-md"
            >
              <LogOut size={18} />
              <div className="text-left">
                <div className="text-sm font-semibold">Time Out</div>
                <div className="text-xs text-white/70">End your shift</div>
              </div>
            </button>
          ) : timedOut ? (
            <div className="flex items-center gap-3 px-6 py-3 rounded-xl bg-gray-50 border border-gray-200">
              <CheckCircle2 size={18} className="text-gray-500" />
              <div>
                <div className="text-sm font-semibold text-gray-700">Timed Out at 17:00</div>
                <div className="text-xs text-gray-500">Shift complete · 8h 53m</div>
              </div>
            </div>
          ) : null}
          <div className="ml-auto flex gap-2">
            <button
              onClick={() => onNavigate('leave-request')}
              className="px-4 py-2 rounded-lg border border-border text-sm text-foreground hover:bg-secondary transition-colors"
            >
              File Leave
            </button>
            <button
              onClick={() => onNavigate('my-payslips')}
              className="px-4 py-2 rounded-lg border border-border text-sm text-foreground hover:bg-secondary transition-colors"
            >
              View Payslips
            </button>
          </div>
        </div>
      </div>

      {/* This Month Summary */}
      <div className="bg-card rounded-xl border border-border p-5">
        <h3 className="font-semibold text-foreground mb-4">June 2026 Attendance Summary</h3>
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Present', value: 9, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Late', value: 2, color: 'text-amber-600', bg: 'bg-amber-50' },
            { label: 'Absent', value: 1, color: 'text-red-600', bg: 'bg-red-50' },
            { label: 'Undertime', value: 1, color: 'text-orange-600', bg: 'bg-orange-50' },
          ].map(s => (
            <div key={s.label} className={`rounded-xl p-4 ${s.bg} text-center`}>
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className={`text-xs font-medium ${s.color} mt-0.5`}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
