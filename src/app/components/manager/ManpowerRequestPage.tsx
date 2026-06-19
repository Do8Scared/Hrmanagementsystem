import { useState } from 'react';
import {
  Send, Save, Eye, X, ChevronRight, Check, Clock, AlertCircle,
  Users, CalendarDays, Briefcase, Star, ShieldAlert, CheckCircle2, TrendingUp
} from 'lucide-react';
import { manpowerRequests as initialRequests, interviews, type ManpowerRequest, type EmploymentType, type UrgencyLevel } from '../../data/recruitmentData';
import { employees, attendanceRecords, leaveRequests, nteRecords } from '../../data/mockData';
import { StatusBadge } from '../StatusBadge';
import { type Page } from '../Layout';

// ── Constants ─────────────────────────────────────────────────────────────────
const MANAGER_NAME = 'Maria Santos';
const MANAGER_DEPT = 'Operations';

const urgencyColor: Record<UrgencyLevel, string> = {
  Low:      'bg-gray-100 text-gray-600',
  Medium:   'bg-amber-50 text-amber-700',
  High:     'bg-orange-50 text-orange-700',
  Critical: 'bg-red-50 text-red-600',
};

const EMPTY_FORM = {
  positionTitle: '',
  employmentType: 'Full Time' as EmploymentType,
  headcount: '1',
  jobDescription: '',
  qualifications: '',
  preferredStartDate: '',
  justification: '',
  urgency: 'Medium' as UrgencyLevel,
};

// ── Manager Dashboard ─────────────────────────────────────────────────────────
function ManagerDashboardView({ onNavigate, requests }: { onNavigate: (p: Page) => void; requests: ManpowerRequest[] }) {
  const today = '2026-06-16';
  const myTeam = employees.filter(e => e.department === MANAGER_DEPT && e.name !== MANAGER_NAME);

  const todayAtt = myTeam.map(emp => {
    const rec = attendanceRecords.find(r => r.employeeId === emp.id && r.date === today);
    return { emp, status: emp.status === 'On Leave' ? 'On Leave' : rec?.status ?? 'Absent' };
  });

  const presentCount = todayAtt.filter(r => r.status === 'Present' || r.status === 'Late').length;
  const pendingLeaves = leaveRequests.filter(l => l.status === 'Pending' && myTeam.some(e => e.id === l.employeeId));
  const pendingRequests = requests.filter(r => r.status === 'Pending');
  const myInterviews = interviews.filter(i => i.interviewer === MANAGER_NAME && i.status === 'Upcoming').slice(0, 3);
  const myERCases = nteRecords.filter(n => n.issuedBy === MANAGER_NAME && !['Closed', 'Voided'].includes(n.status));

  const attColor: Record<string, string> = {
    Present:   'bg-emerald-100 text-emerald-800',
    Late:      'bg-amber-100 text-amber-800',
    Absent:    'bg-red-100 text-red-800',
    Undertime: 'bg-orange-100 text-orange-800',
    'On Leave':'bg-violet-100 text-violet-800',
  };

  const stats = [
    { label: 'Team Members',   value: myTeam.length,        sub: `${presentCount} present today`,  icon: Users,         col: 'bg-red-50 text-primary' },
    { label: 'Present Today',  value: presentCount,          sub: `${myTeam.length > 0 ? Math.round((presentCount/myTeam.length)*100) : 0}% of team`, icon: CheckCircle2,  col: 'bg-emerald-50 text-emerald-700' },
    { label: 'Pending Leaves', value: pendingLeaves.length,  sub: 'from your team',                icon: CalendarDays,  col: 'bg-amber-50 text-amber-700' },
    { label: 'Open Requests',  value: pendingRequests.length, sub: 'submitted to HR',              icon: Briefcase,     col: 'bg-violet-50 text-violet-700', action: () => onNavigate('manager-request') },
  ];

  const modules = [
    { title: 'Manpower Request',   desc: 'Request headcount for your team', icon: Briefcase,   page: 'manager-request' as Page, light: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-100', stat: `${requests.length} total requests` },
    { title: 'Interview Feedback', desc: 'Submit feedback on candidates',   icon: Star,        page: 'manager-feedback' as Page, light: 'bg-amber-50',  text: 'text-amber-700',  border: 'border-amber-100', stat: `${myInterviews.length} upcoming` },
    { title: 'Employee Relations', desc: 'Issue NTE / track ER cases',      icon: ShieldAlert, page: 'hr-admin' as Page, light: 'bg-red-50',   text: 'text-primary',    border: 'border-red-100',   stat: myERCases.length > 0 ? `${myERCases.length} active` : 'No active cases', alert: myERCases.length > 0 },
  ];

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
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg z-10"
          style={{ background: 'var(--sidebar-primary)' }}>
          <span className="font-bold text-2xl" style={{ color: 'var(--sidebar-primary-foreground)' }}>MS</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} onClick={() => (s as any).action?.()} className={`bg-card rounded-xl border border-border p-5 flex items-start gap-4 hover:shadow-sm transition-shadow ${ (s as any).action ? 'cursor-pointer' : ''}`}>
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${s.col}`}><Icon size={20} /></div>
              <div>
                <div className="text-2xl font-bold text-foreground">{s.value}</div>
                <div className="text-sm font-semibold text-foreground mt-0.5">{s.label}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{s.sub}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Module shortcuts */}
      <div>
        <h2 className="font-bold text-foreground mb-3">My Modules</h2>
        <div className="grid grid-cols-3 gap-3">
          {modules.map(mod => {
            const Icon = mod.icon;
            return (
              <button key={mod.title} onClick={() => onNavigate(mod.page)}
                className={`group relative bg-card rounded-xl border ${mod.border} p-5 text-left hover:shadow-md hover:-translate-y-0.5 transition-all overflow-hidden`}>
                {mod.alert && <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white" />}
                <div className={`w-10 h-10 rounded-xl ${mod.light} flex items-center justify-center mb-3`}><Icon size={20} className={mod.text} /></div>
                <div className="font-bold text-sm text-foreground">{mod.title}</div>
                <div className="text-xs text-muted-foreground mt-1 leading-snug">{mod.desc}</div>
                <div className={`mt-3 text-xs font-semibold ${mod.alert ? 'text-red-600' : mod.text}`}>{mod.stat}</div>
                <ChevronRight size={14} className="absolute bottom-4 right-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Team + Leaves */}
      <div className="grid grid-cols-2 gap-4">
        {/* Attendance */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div>
              <h3 className="font-bold text-foreground text-sm">Team Attendance — Today</h3>
              <p className="text-xs text-muted-foreground mt-0.5">June 16, 2026 · {myTeam.length} member{myTeam.length !== 1 ? 's' : ''}</p>
            </div>
            <div className="flex items-center gap-1 text-xs text-emerald-700 font-semibold">
              <TrendingUp size={12} /> {myTeam.length > 0 ? Math.round((presentCount/myTeam.length)*100) : 0}%
            </div>
          </div>
          <div className="divide-y divide-border/50">
            {todayAtt.length === 0 ? (
              <p className="px-5 py-4 text-sm text-muted-foreground">No team members found.</p>
            ) : todayAtt.map(({ emp, status }) => (
              <div key={emp.id} className="flex items-center gap-3 px-5 py-3">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-bold">{emp.initials}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-foreground truncate">{emp.name}</div>
                  <div className="text-xs text-muted-foreground">{emp.position}</div>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${attColor[status] ?? 'bg-secondary text-muted-foreground'}`}>{status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Pending leaves */}
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h3 className="font-bold text-foreground text-sm">Pending Leave Requests</h3>
              {pendingLeaves.length > 0 && (
                <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">{pendingLeaves.length}</span>
              )}
            </div>
            {pendingLeaves.length === 0 ? (
              <div className="px-5 py-5 text-center">
                <CheckCircle2 size={20} className="text-emerald-500 mx-auto mb-1" />
                <p className="text-sm text-muted-foreground">No pending requests</p>
              </div>
            ) : pendingLeaves.map(l => (
              <div key={l.id} className="flex items-center gap-3 px-5 py-3 border-b border-border/50 last:border-0">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-foreground truncate">{l.employeeName}</div>
                  <div className="text-xs text-muted-foreground">{l.leaveType} · {l.startDate}–{l.endDate}</div>
                </div>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">{l.days}d</span>
              </div>
            ))}
          </div>

          {/* Upcoming interviews */}
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h3 className="font-bold text-foreground text-sm">Upcoming Interviews</h3>
              <button onClick={() => onNavigate('manager-feedback')} className="text-xs text-accent hover:underline font-semibold">View all</button>
            </div>
            {myInterviews.length === 0 ? (
              <div className="px-5 py-5 text-center">
                <Clock size={20} className="text-muted-foreground mx-auto mb-1" />
                <p className="text-sm text-muted-foreground">No upcoming interviews</p>
              </div>
            ) : myInterviews.map(i => (
              <div key={i.id} className="flex items-center gap-3 px-5 py-3 border-b border-border/50 last:border-0">
                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <Star size={14} className="text-amber-700" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-foreground truncate">{i.applicantName}</div>
                  <div className="text-xs text-muted-foreground">{i.jobTitle} · {i.date}</div>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold">{i.format}</span>
              </div>
            ))}
          </div>

          {/* ER cases */}
          {myERCases.length > 0 && (
            <div className="bg-card rounded-xl border border-red-200 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-red-100 bg-red-50/50">
                <div className="flex items-center gap-2">
                  <AlertCircle size={14} className="text-primary" />
                  <h3 className="font-bold text-foreground text-sm">Active ER Cases</h3>
                </div>
                <button onClick={() => onNavigate('hr-admin')} className="text-xs text-primary hover:underline font-semibold">View</button>
              </div>
              {myERCases.map(n => (
                <div key={n.id} className="flex items-center gap-3 px-5 py-3 border-b border-border/50 last:border-0">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-foreground truncate">{n.employeeName}</div>
                    <div className="text-xs text-muted-foreground">{n.incidentType}</div>
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">{n.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Named export so App.tsx can import the dashboard directly ─────────────────
export function ManagerDashboard({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const requests = initialRequests.filter(r => r.requestingManager === MANAGER_NAME);
  return <ManagerDashboardView onNavigate={onNavigate} requests={requests} />;
}

// ── Manpower Request Form ─────────────────────────────────────────────────────
export function ManpowerRequestPage() {
  const [requests, setRequests] = useState(initialRequests.filter(r => r.requestingManager === MANAGER_NAME));
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitted, setSubmitted] = useState(false);
  const [savedDraft, setSavedDraft] = useState(false);
  const [viewRequest, setViewRequest] = useState<ManpowerRequest | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.positionTitle) return;
    const newReq: ManpowerRequest = {
      id: `MR-${String(requests.length + 10).padStart(3, '0')}`,
      department: 'Engineering',
      requestingManager: MANAGER_NAME,
      positionTitle: form.positionTitle,
      headcount: Number(form.headcount),
      dateRequested: '2026-06-16',
      status: 'Pending',
      employmentType: form.employmentType,
      jobDescription: form.jobDescription,
      qualifications: form.qualifications,
      urgency: form.urgency,
      justification: form.justification,
      preferredStartDate: form.preferredStartDate,
    };
    setRequests(prev => [newReq, ...prev]);
    setForm(EMPTY_FORM);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  }

  function getTimelineStep(status: string): number {
    if (status === 'Rejected') return 2;
    if (status === 'Pending') return 1;
    if (status === 'Approved') return 2;
    return 3;
  }

  const inputCls = 'w-full px-3 py-2.5 bg-input-background border border-border rounded-xl text-sm text-foreground outline-none focus:ring-2 focus:ring-accent/20 placeholder:text-muted-foreground';
  const textArea = inputCls + ' resize-none';

  return (
    <div className="space-y-6">
      {/* Form */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="px-6 py-5 border-b border-border">
          <h2 className="font-semibold text-foreground">Request Additional Manpower</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Fill in the details below and submit for HR review.</p>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {submitted && (
            <div className="flex items-center gap-3 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700">
              <Check size={16} className="flex-shrink-0" /> Request submitted! HR will review and respond shortly.
            </div>
          )}
          {savedDraft && (
            <div className="flex items-center gap-3 px-4 py-3 bg-secondary border border-border rounded-xl text-sm text-accent">
              <Save size={16} className="flex-shrink-0" /> Draft saved.
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">Department</label>
              <input value="Engineering" readOnly className={inputCls + ' opacity-60 cursor-not-allowed'} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">Position / Role Title <span className="text-red-500">*</span></label>
              <input value={form.positionTitle} onChange={e => setForm(f => ({ ...f, positionTitle: e.target.value }))} placeholder="e.g. Senior React Developer" className={inputCls} required />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">Employment Type</label>
              <select value={form.employmentType} onChange={e => setForm(f => ({ ...f, employmentType: e.target.value as EmploymentType }))} className={inputCls + ' cursor-pointer'}>
                {(['Full Time','Part Time','Contractual','Internship'] as EmploymentType[]).map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">Headcount Needed</label>
              <input type="number" min="1" value={form.headcount} onChange={e => setForm(f => ({ ...f, headcount: e.target.value }))} className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">Preferred Start Date</label>
              <input type="date" value={form.preferredStartDate} onChange={e => setForm(f => ({ ...f, preferredStartDate: e.target.value }))} className={inputCls} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">Job Description</label>
            <textarea value={form.jobDescription} onChange={e => setForm(f => ({ ...f, jobDescription: e.target.value }))} rows={4} placeholder="Describe the role, responsibilities, and day-to-day tasks..." className={textArea} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">Required Qualifications</label>
            <textarea value={form.qualifications} onChange={e => setForm(f => ({ ...f, qualifications: e.target.value }))} rows={3} placeholder="Education, skills, certifications..." className={textArea} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">Justification / Reason for Request</label>
            <textarea value={form.justification} onChange={e => setForm(f => ({ ...f, justification: e.target.value }))} rows={3} placeholder="Why is this position needed now?" className={textArea} />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-2">Urgency Level</label>
            <div className="flex gap-2">
              {(['Low','Medium','High','Critical'] as UrgencyLevel[]).map(u => (
                <button key={u} type="button" onClick={() => setForm(f => ({ ...f, urgency: u }))}
                  className={`flex-1 py-2 rounded-xl text-sm font-semibold border transition-all ${form.urgency === u ? 'border-primary bg-primary text-white' : 'border-border bg-secondary text-muted-foreground hover:border-primary/40'}`}>
                  {u}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => { setSavedDraft(true); setTimeout(() => setSavedDraft(false), 3000); }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border text-sm font-semibold text-foreground hover:bg-secondary transition-colors">
              <Save size={15} /> Save as Draft
            </button>
            <button type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-white text-sm font-bold hover:opacity-90 transition-all"
              style={{ background: 'var(--primary)', boxShadow: '0 4px 14px rgba(110,18,22,0.35)' }}>
              <Send size={15} /> Submit Request
            </button>
          </div>
        </form>
      </div>

      {/* History */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h3 className="font-semibold text-foreground">My Request History</h3>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-secondary/40">
              {['Request ID','Position','Headcount','Date Submitted','Status','Actions'].map(col => (
                <th key={col} className="text-left text-xs font-bold text-muted-foreground px-5 py-3">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {requests.map((r, i) => (
              <tr key={r.id} className={`border-b border-border/50 hover:bg-secondary/20 ${i % 2 !== 0 ? 'bg-secondary/10' : ''}`}>
                <td className="px-5 py-3 text-xs font-mono text-primary font-bold">{r.id}</td>
                <td className="px-5 py-3 text-sm font-semibold text-foreground">{r.positionTitle}</td>
                <td className="px-5 py-3 text-sm text-foreground">{r.headcount}</td>
                <td className="px-5 py-3 text-xs text-muted-foreground">{r.dateRequested}</td>
                <td className="px-5 py-3"><StatusBadge status={r.status} /></td>
                <td className="px-5 py-3">
                  <button onClick={() => setViewRequest(r)} className="flex items-center gap-1 px-2.5 py-1 rounded text-xs border border-border text-muted-foreground hover:bg-secondary transition-colors">
                    <Eye size={12} /> View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail modal */}
      {viewRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setViewRequest(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-5 border-b border-border">
              <div>
                <span className="text-xs font-mono text-primary">{viewRequest.id}</span>
                <h3 className="font-bold text-foreground mt-0.5">{viewRequest.positionTitle}</h3>
              </div>
              <button onClick={() => setViewRequest(null)} className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-5">
              {/* Timeline */}
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Request Timeline</p>
                <div className="flex items-center">
                  {(viewRequest.status === 'Rejected' ? ['Submitted','Under Review','Rejected'] : ['Submitted','Under Review','Approved','Published']).map((step, idx, arr) => {
                    const active = getTimelineStep(viewRequest.status);
                    const isActive = idx <= active;
                    const isCurrent = idx === active;
                    const isRejected = step === 'Rejected';
                    return (
                      <div key={step} className="flex items-center flex-1 last:flex-none">
                        <div className="flex flex-col items-center">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${isRejected ? 'bg-red-500 text-white' : isActive ? 'bg-primary text-white' : 'bg-secondary text-muted-foreground'}`}>
                            {isRejected ? <X size={12} /> : isActive ? <Check size={12} /> : <span>{idx+1}</span>}
                          </div>
                          <span className={`text-xs mt-1 text-center ${isCurrent ? 'font-bold text-foreground' : 'text-muted-foreground'}`}>{step}</span>
                        </div>
                        {idx < arr.length - 1 && <div className={`flex-1 h-0.5 mx-1 ${isActive && idx < active ? 'bg-primary' : 'bg-secondary'}`} />}
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border">
                {[
                  { l: 'Department', v: viewRequest.department },
                  { l: 'Employment Type', v: viewRequest.employmentType },
                  { l: 'Headcount', v: String(viewRequest.headcount) },
                  { l: 'Preferred Start', v: viewRequest.preferredStartDate || '—' },
                ].map(f => (
                  <div key={f.l}><span className="text-xs text-muted-foreground">{f.l}</span><div className="text-sm font-semibold text-foreground mt-0.5">{f.v}</div></div>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Urgency:</span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${urgencyColor[viewRequest.urgency]}`}>{viewRequest.urgency}</span>
              </div>
              {viewRequest.jobDescription && <div><span className="text-xs text-muted-foreground">Job Description</span><p className="text-sm text-foreground mt-1 leading-relaxed">{viewRequest.jobDescription}</p></div>}
              {viewRequest.qualifications && <div><span className="text-xs text-muted-foreground">Qualifications</span><p className="text-sm text-foreground mt-1 leading-relaxed">{viewRequest.qualifications}</p></div>}
              {viewRequest.justification && <div><span className="text-xs text-muted-foreground">Justification</span><p className="text-sm text-foreground mt-1 leading-relaxed">{viewRequest.justification}</p></div>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
