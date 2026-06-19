import { useState } from 'react';
import { Check, X as XIcon, Search, Filter } from 'lucide-react';
import { leaveRequests as initialRequests, leaveBalances, employees, type LeaveRequest } from '../../data/mockData';
import { StatusBadge } from '../StatusBadge';

const LEAVE_TYPES = ['All', 'Vacation Leave', 'Sick Leave', 'Emergency Leave', 'Maternity Leave', 'Paternity Leave', 'Bereavement Leave'];

export function LeaveManagement() {
  const [requests, setRequests] = useState(initialRequests);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [tab, setTab] = useState<'requests' | 'balances'>('requests');
  const [confirmAction, setConfirmAction] = useState<{ id: string; action: 'approve' | 'reject' } | null>(null);

  const filtered = requests.filter(r => {
    const matchSearch = r.employeeName.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'All' || r.leaveType === typeFilter;
    const matchStatus = statusFilter === 'All' || r.status === statusFilter;
    return matchSearch && matchType && matchStatus;
  });

  function handleAction(id: string, action: 'approve' | 'reject') {
    setRequests(prev => prev.map(r =>
      r.id === id ? { ...r, status: action === 'approve' ? 'Approved' : 'Rejected' } : r
    ));
    setConfirmAction(null);
  }

  return (
    <div className="space-y-5">
      {/* Tabs */}
      <div className="flex border-b border-border">
        {(['requests', 'balances'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-3 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${tab === t ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
          >
            {t === 'requests' ? 'Leave Requests' : 'Leave Balances'}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-1 pb-2">
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          <span className="text-xs text-muted-foreground">{requests.filter(r => r.status === 'Pending').length} pending</span>
        </div>
      </div>

      {tab === 'requests' ? (
        <>
          {/* Filters */}
          <div className="bg-card rounded-xl border border-border p-4 flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-44">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by employee name..."
                className="w-full pl-8 pr-4 py-2 bg-secondary rounded-lg text-sm border-0 outline-none text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter size={14} className="text-muted-foreground" />
              <select
                value={typeFilter}
                onChange={e => setTypeFilter(e.target.value)}
                className="px-3 py-2 bg-secondary rounded-lg text-sm border-0 outline-none text-foreground cursor-pointer"
              >
                {LEAVE_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-secondary rounded-lg text-sm border-0 outline-none text-foreground cursor-pointer"
              >
                {['All', 'Pending', 'Approved', 'Rejected'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* Requests Table */}
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-secondary/40">
                  {['Employee', 'Leave Type', 'Duration', 'Days', 'Reason', 'Applied', 'Status', 'Actions'].map(col => (
                    <th key={col} className="text-left text-xs font-semibold text-muted-foreground px-5 py-3">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((r, i) => (
                  <tr key={r.id} className={`border-b border-border/50 hover:bg-secondary/20 transition-colors ${i % 2 === 0 ? '' : 'bg-secondary/10'}`}>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-xs font-semibold">
                            {r.employeeName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </span>
                        </div>
                        <div>
                          <div className="text-xs font-medium text-foreground">{r.employeeName}</div>
                          <div className="text-xs text-muted-foreground">{r.department}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs bg-secondary text-foreground px-2.5 py-1 rounded-full">{r.leaveType}</span>
                    </td>
                    <td className="px-5 py-4 text-xs text-muted-foreground">
                      <div>{r.startDate}</div>
                      {r.endDate !== r.startDate && <div>to {r.endDate}</div>}
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm font-semibold text-foreground">{r.days}</span>
                      <span className="text-xs text-muted-foreground ml-1">day{r.days > 1 ? 's' : ''}</span>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-xs text-muted-foreground max-w-36 truncate" title={r.reason}>{r.reason}</p>
                    </td>
                    <td className="px-5 py-4 text-xs text-muted-foreground">{r.appliedDate}</td>
                    <td className="px-5 py-4"><StatusBadge status={r.status} /></td>
                    <td className="px-5 py-4">
                      {r.status === 'Pending' ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setConfirmAction({ id: r.id, action: 'approve' })}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs text-emerald-700 border border-emerald-200 hover:bg-emerald-50 transition-colors"
                          >
                            <Check size={12} /> Approve
                          </button>
                          <button
                            onClick={() => setConfirmAction({ id: r.id, action: 'reject' })}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs text-red-600 border border-red-200 hover:bg-red-50 transition-colors"
                          >
                            <XIcon size={12} /> Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary/40">
                {['Employee', 'Vacation Leave', 'Sick Leave', 'Emergency Leave'].map(col => (
                  <th key={col} className="text-left text-xs font-semibold text-muted-foreground px-5 py-3">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {employees.slice(0, 5).map((emp, i) => {
                const bal = leaveBalances.find(b => b.employeeId === emp.id);
                if (!bal) return null;
                return (
                  <tr key={emp.id} className={`border-b border-border/50 ${i % 2 === 0 ? '' : 'bg-secondary/10'}`}>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                          <span className="text-white text-xs font-semibold">{emp.initials}</span>
                        </div>
                        <div>
                          <div className="text-xs font-medium text-foreground">{emp.name}</div>
                          <div className="text-xs text-muted-foreground">{emp.department}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <LeaveBalanceBar used={bal.vacationUsed} total={bal.vacationLeave} color="bg-primary" />
                    </td>
                    <td className="px-5 py-4">
                      <LeaveBalanceBar used={bal.sickUsed} total={bal.sickLeave} color="bg-emerald-500" />
                    </td>
                    <td className="px-5 py-4">
                      <LeaveBalanceBar used={bal.emergencyUsed} total={bal.emergencyLeave} color="bg-purple-500" />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Confirm Dialog */}
      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm mx-4">
            <h3 className="font-semibold text-foreground mb-2">
              {confirmAction.action === 'approve' ? 'Approve Leave Request?' : 'Reject Leave Request?'}
            </h3>
            <p className="text-sm text-muted-foreground mb-5">
              {confirmAction.action === 'approve'
                ? 'The employee will be notified that their leave has been approved.'
                : 'The employee will be notified that their leave request was rejected.'}
            </p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmAction(null)} className="flex-1 py-2 rounded-lg border border-border text-sm text-foreground hover:bg-secondary">Cancel</button>
              <button
                onClick={() => handleAction(confirmAction.id, confirmAction.action)}
                className={`flex-1 py-2 rounded-lg text-white text-sm font-medium transition-colors ${confirmAction.action === 'approve' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-destructive hover:bg-destructive/90'}`}
              >
                {confirmAction.action === 'approve' ? 'Approve' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function LeaveBalanceBar({ used, total, color }: { used: number; total: number; color: string }) {
  const remaining = total - used;
  const pct = (used / total) * 100;
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-muted-foreground">{remaining} remaining</span>
        <span className="text-muted-foreground">{used}/{total} used</span>
      </div>
      <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
