import { useState, useEffect } from 'react';
import { Send, CalendarDays, Info } from 'lucide-react';
import { StatusBadge } from '../StatusBadge';
import { useAuth } from '../../../lib/useAuth';
import { supabase } from '../../../lib/supabaseClient';

type LeaveType = 'Vacation Leave' | 'Sick Leave' | 'Emergency Leave' | 'Bereavement Leave' | 'Paternity Leave';
const LEAVE_TYPES: LeaveType[] = ['Vacation Leave', 'Sick Leave', 'Emergency Leave', 'Bereavement Leave', 'Paternity Leave'];

interface FormState {
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  reason: string;
}

const EMPTY_FORM: FormState = {
  leaveType: 'Vacation Leave',
  startDate: '',
  endDate: '',
  reason: '',
};

export function LeaveRequest() {
  const { user } = useAuth();
  const [balance, setBalance] = useState<any>(null);
  const [myRequests, setMyRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [empId, setEmpId] = useState<string | null>(null);

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    async function fetchData() {
      if (!user) return;
      setLoading(true);
      const empRes = await supabase.from('employees').select('id').eq('email', user.email).single();
      if (empRes.data) {
        setEmpId(empRes.data.id);
        const [balRes, reqRes] = await Promise.all([
          supabase.from('leave_balances').select('*').eq('employee_id', empRes.data.id).single(),
          supabase.from('leave_requests').select('*').eq('employee_id', empRes.data.id).order('applied_date', { ascending: false })
        ]);
        if (balRes.data) setBalance(balRes.data);
        if (reqRes.data) setMyRequests(reqRes.data);
      }
      setLoading(false);
    }
    fetchData();
  }, [user]);

  const workDays = (() => {
    if (!form.startDate || !form.endDate) return 0;
    const start = new Date(form.startDate);
    const end = new Date(form.endDate);
    let count = 0;
    const cur = new Date(start);
    while (cur <= end) {
      const dow = cur.getDay();
      if (dow !== 0 && dow !== 6) count++;
      cur.setDate(cur.getDate() + 1);
    }
    return count;
  })();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.startDate || !form.endDate || !form.reason || !empId) return;

    const newReq = {
      employee_id: empId,
      leave_type: form.leaveType,
      start_date: form.startDate,
      end_date: form.endDate,
      days: workDays,
      reason: form.reason,
      status: 'Pending',
      applied_date: new Date().toISOString().split('T')[0]
    };

    const { data } = await supabase.from('leave_requests').insert(newReq).select().single();

    if (data) {
      setMyRequests(prev => [data, ...prev]);
    }

    setForm(EMPTY_FORM);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  }

  const leaveBalanceMap: Record<string, number> = {
    'Vacation Leave': balance ? balance.vacation_leave - balance.vacation_used : 0,
    'Sick Leave': balance ? balance.sick_leave - balance.sick_used : 0,
    'Emergency Leave': balance ? balance.emergency_leave - balance.emergency_used : 0,
    'Bereavement Leave': 5,
    'Paternity Leave': 7,
  };

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading leave requests...</div>;

  return (
    <div className="space-y-5">
      {/* Leave Balance Overview */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Vacation Leave', used: balance?.vacation_used || 0, total: balance?.vacation_leave || 0, color: 'bg-blue-500' },
          { label: 'Sick Leave', used: balance?.sick_used || 0, total: balance?.sick_leave || 0, color: 'bg-emerald-500' },
          { label: 'Emergency Leave', used: balance?.emergency_used || 0, total: balance?.emergency_leave || 0, color: 'bg-purple-500' },
        ].map(b => {
          const remaining = b.total - b.used;
          const pct = b.total ? (b.used / b.total) * 100 : 0;
          return (
            <div key={b.label} className="bg-card rounded-xl border border-border p-5">
              <div className="flex justify-between items-baseline mb-3">
                <span className="text-sm font-medium text-foreground">{b.label}</span>
                <span className="text-2xl font-bold text-foreground">{remaining}</span>
              </div>
              <div className="h-1.5 bg-secondary rounded-full overflow-hidden mb-2">
                <div className={`h-full rounded-full ${b.color}`} style={{ width: `${pct}%` }} />
              </div>
              <div className="text-xs text-muted-foreground">{b.used} used out of {b.total} days</div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-5 gap-4">
        {/* Request Form */}
        <div className="col-span-2 bg-card rounded-xl border border-border p-5">
          <div className="flex items-center gap-2 mb-5">
            <CalendarDays size={18} className="text-accent" />
            <h3 className="font-semibold text-foreground">File a Leave Request</h3>
          </div>

          {submitted && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700 flex items-center gap-2">
              <Info size={14} /> Leave request submitted! Awaiting HR approval.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Leave Type</label>
              <select
                value={form.leaveType}
                onChange={e => setForm(f => ({ ...f, leaveType: e.target.value as LeaveType }))}
                className="w-full px-3 py-2.5 bg-secondary rounded-lg text-sm border-0 outline-none text-foreground cursor-pointer focus:ring-2 focus:ring-accent/30"
              >
                {LEAVE_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <Info size={11} />
                Available balance: <strong>{leaveBalanceMap[form.leaveType]} days</strong>
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Start Date</label>
                <input
                  type="date"
                  value={form.startDate}
                  onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))}
                  min="2026-06-17"
                  className="w-full px-3 py-2.5 bg-secondary rounded-lg text-sm border-0 outline-none text-foreground focus:ring-2 focus:ring-accent/30"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">End Date</label>
                <input
                  type="date"
                  value={form.endDate}
                  onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))}
                  min={form.startDate || '2026-06-17'}
                  className="w-full px-3 py-2.5 bg-secondary rounded-lg text-sm border-0 outline-none text-foreground focus:ring-2 focus:ring-accent/30"
                  required
                />
              </div>
            </div>

            {workDays > 0 && (
              <div className="px-3 py-2 bg-blue-50 rounded-lg text-xs text-blue-700">
                Duration: <strong>{workDays} working day{workDays > 1 ? 's' : ''}</strong>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Reason</label>
              <textarea
                value={form.reason}
                onChange={e => setForm(f => ({ ...f, reason: e.target.value }))}
                placeholder="Please provide a brief reason for your leave request..."
                rows={4}
                className="w-full px-3 py-2.5 bg-secondary rounded-lg text-sm border-0 outline-none resize-none text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-accent/30"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              <Send size={15} /> Submit Leave Request
            </button>
          </form>
        </div>

        {/* Leave History */}
        <div className="col-span-3 bg-card rounded-xl border border-border overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h3 className="font-semibold text-foreground">My Leave History</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{myRequests.length} total requests</p>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary/40">
                {['Leave Type', 'Duration', 'Days', 'Reason', 'Applied', 'Status'].map(col => (
                  <th key={col} className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {myRequests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-muted-foreground text-sm">No leave requests yet.</td>
                </tr>
              ) : myRequests.map((r, i) => (
                <tr key={r.id} className={`border-b border-border/50 hover:bg-secondary/20 transition-colors ${i % 2 !== 0 ? 'bg-secondary/10' : ''}`}>
                  <td className="px-4 py-3">
                    <span className="text-xs bg-secondary text-foreground px-2.5 py-1 rounded-full whitespace-nowrap">{r.leave_type}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-xs text-foreground">{r.start_date}</div>
                    {r.end_date !== r.start_date && <div className="text-xs text-muted-foreground">to {r.end_date}</div>}
                  </td>
                  <td className="px-4 py-3 text-xs font-semibold text-foreground">{r.days}d</td>
                  <td className="px-4 py-3">
                    <p className="text-xs text-muted-foreground max-w-36 truncate" title={r.reason}>{r.reason}</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{r.applied_date}</td>
                  <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
