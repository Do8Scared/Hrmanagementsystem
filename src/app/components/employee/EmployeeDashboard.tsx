import { useState, useEffect } from 'react';
import { Clock, CalendarDays, DollarSign, LogIn, LogOut, CheckCircle2 } from 'lucide-react';
import { type Page } from '../Layout';
import { useAuth } from '../../../lib/useAuth';
import { supabase } from '../../../lib/supabaseClient';

interface Props {
  onNavigate: (page: Page) => void;
}

const fmt = (n: number) => `₱${n.toLocaleString('en-PH', { minimumFractionDigits: 2 })}`;

export function EmployeeDashboard({ onNavigate }: Props) {
  const { user } = useAuth();
  const [emp, setEmp] = useState<any>(null);
  const [todayRecord, setTodayRecord] = useState<any>(null);
  const [latestPayslip, setLatestPayslip] = useState<any>(null);
  const [balance, setBalance] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [timedIn, setTimedIn] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    async function fetchData() {
      if (!user) return;
      setLoading(true);

      const today = new Date().toISOString().split('T')[0];

      const [empRes, attRes, payRes, balRes] = await Promise.all([
        supabase.from('employees').select('*').eq('email', user.email).single(),
        supabase.from('attendance_records').select('*').eq('date', today), // we will filter by employee_id after if needed, or query specifically
        supabase.from('payroll_records').select('*').order('period', { ascending: false }).limit(1),
        supabase.from('leave_balances').select('*')
      ]);

      if (empRes.data) {
        setEmp(empRes.data);
        
        // Refetch attendance with employee id to be safe
        const { data: myAtt } = await supabase.from('attendance_records')
          .select('*')
          .eq('employee_id', empRes.data.id)
          .eq('date', today)
          .maybeSingle();
        
        if (myAtt) {
          setTodayRecord(myAtt);
          setTimedIn(!!myAtt.time_in);
          setTimedOut(!!myAtt.time_out);
          if (myAtt.time_in) setCurrentTime(myAtt.time_in);
        }

        const { data: myPay } = await supabase.from('payroll_records')
          .select('*')
          .eq('employee_id', empRes.data.id)
          .order('id', { ascending: false })
          .limit(1)
          .maybeSingle();
        
        if (myPay) setLatestPayslip(myPay);

        const { data: myBal } = await supabase.from('leave_balances')
          .select('*')
          .eq('employee_id', empRes.data.id)
          .maybeSingle();
        
        if (myBal) setBalance(myBal);
      }
      setLoading(false);
    }
    fetchData();
  }, [user]);

  async function handleTimeIn() {
    if (!emp) return;
    const now = new Date();
    const timeStr = now.toTimeString().slice(0, 5);
    const today = now.toISOString().split('T')[0];

    setCurrentTime(timeStr);
    setTimedIn(true);

    const record = {
      employee_id: emp.id,
      date: today,
      time_in: timeStr,
      status: 'Present' // Simplification
    };

    const { data } = await supabase.from('attendance_records').insert(record).select().single();
    if (data) setTodayRecord(data);
  }

  async function handleTimeOut() {
    if (!emp || !todayRecord) return;
    const now = new Date();
    const timeStr = now.toTimeString().slice(0, 5);
    
    setTimedOut(true);

    const { data } = await supabase.from('attendance_records')
      .update({ time_out: timeStr })
      .eq('id', todayRecord.id)
      .select().single();

    if (data) setTodayRecord(data);
  }

  const greetingHour = new Date().getHours();
  const greeting = greetingHour < 12 ? 'Good morning' : greetingHour < 17 ? 'Good afternoon' : 'Good evening';

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading dashboard...</div>;
  if (!emp) return <div className="p-8 text-center text-muted-foreground">Employee record not found.</div>;

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
          <p className="text-white/40 text-xs mt-3">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-3 z-10">
          <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
            <span className="text-white text-2xl font-bold">{user?.initials}</span>
          </div>
        </div>
      </div>

      {/* Quick Cards */}
      <div className="grid grid-cols-3 gap-4">
        {/* Today's Attendance */}
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                <Clock size={16} className="text-blue-600" />
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
              <span className="font-medium text-foreground">{timedOut && todayRecord?.time_out ? todayRecord.time_out : '—'}</span>
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
              <span className="font-medium text-foreground">{balance ? balance.vacation_leave - balance.vacation_used : 0} days left</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Sick Leave</span>
              <span className="font-medium text-foreground">{balance ? balance.sick_leave - balance.sick_used : 0} days left</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Emergency Leave</span>
              <span className="font-medium text-foreground">{balance ? balance.emergency_leave - balance.emergency_used : 0} days left</span>
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
              <span className="font-medium text-foreground">{latestPayslip ? latestPayslip.period : '—'}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Gross Pay</span>
              <span className="font-medium text-foreground">{latestPayslip ? fmt(latestPayslip.gross_pay) : '—'}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Net Pay</span>
              <span className="font-bold text-primary">{latestPayslip ? fmt(latestPayslip.net_pay) : '—'}</span>
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
              onClick={handleTimeIn}
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
              onClick={handleTimeOut}
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
                <div className="text-sm font-semibold text-gray-700">Timed Out at {todayRecord?.time_out}</div>
                <div className="text-xs text-gray-500">Shift complete</div>
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
    </div>
  );
}
