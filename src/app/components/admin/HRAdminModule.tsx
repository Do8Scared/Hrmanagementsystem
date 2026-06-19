import { useState, useMemo } from 'react';
import {
  FileWarning, Gavel, AlertCircle, CheckCircle2, Clock, Shield,
  Plus, Download, X, Search, Lock, FileText,
  BarChart2, BookOpen, ClipboardList, Edit3, Ban,
  ChevronRight, Upload, Users, AlertTriangle, ArrowRight, Filter
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import {
  nteRecords as initialNTEs,
  nodRecords as initialNODs,
  nteTemplates as defaultTemplates,
  employees,
  type NTERecord, type NODRecord, type NTEStatus, type NODDecision,
  type IncidentType, type NTETemplate, type AuditEntry,
} from '../../data/mockData';

// ── Constants ─────────────────────────────────────────────────────────────────

const INCIDENT_TYPES: IncidentType[] = [
  'Habitual Tardiness', 'Absenteeism Without Leave', 'Insubordination',
  'Unsatisfactory Work Quality', 'Misconduct', 'Violation of Company Policy', 'Other',
];

const NOD_DECISIONS: NODDecision[] = ['Written Warning', 'Suspension', 'Dismissal', 'Exonerated'];

const DEPARTMENTS = ['All', 'Engineering', 'Operations', 'Sales', 'Finance', 'Marketing', 'Design', 'Human Resources'];

const HR_STAFF = ['Sofia Garcia', 'Maria Santos'];

const ALL_STATUSES: NTEStatus[] = [
  'Pending Explanation', 'Explanation Submitted', 'Under Review',
  'Decision Issued', 'Closed', 'Voided',
];

// DOLE twin-notice rule: minimum 5 calendar days to respond
const DOLE_MIN_DAYS = 5;

// ── Helpers ───────────────────────────────────────────────────────────────────

function statusCfg(s: NTEStatus) {
  const map: Record<NTEStatus, { bg: string; text: string; dot: string; border: string }> = {
    'Pending Explanation':   { bg: 'bg-amber-100',   text: 'text-amber-800',   dot: 'bg-amber-500',   border: 'border-amber-200' },
    'Explanation Submitted': { bg: 'bg-violet-100',  text: 'text-violet-800',  dot: 'bg-violet-500',  border: 'border-violet-200' },
    'Under Review':          { bg: 'bg-purple-100',  text: 'text-purple-800',  dot: 'bg-purple-500',  border: 'border-purple-200' },
    'Decision Issued':       { bg: 'bg-orange-100',  text: 'text-orange-800',  dot: 'bg-orange-500',  border: 'border-orange-200' },
    'Closed':                { bg: 'bg-emerald-100', text: 'text-emerald-800', dot: 'bg-emerald-500', border: 'border-emerald-200' },
    'Voided':                { bg: 'bg-gray-100',    text: 'text-gray-500',    dot: 'bg-gray-400',    border: 'border-gray-200' },
  };
  return map[s];
}

function decisionCfg(d: NODDecision) {
  const map: Record<NODDecision, string> = {
    'Written Warning': 'bg-amber-100 text-amber-800',
    'Suspension':      'bg-orange-100 text-orange-800',
    'Dismissal':       'bg-red-100 text-red-800',
    'Exonerated':      'bg-emerald-100 text-emerald-800',
  };
  return map[d];
}

function addDays(dateStr: string, days: number) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function today() { return new Date().toISOString().slice(0, 10); }

function newAuditEntry(action: string, by: string, role: AuditEntry['role'], details?: string): AuditEntry {
  return { id: `AL-${Date.now()}`, action, performedBy: by, role, timestamp: new Date().toLocaleString(), details };
}

// ── NTE Status Badge ──────────────────────────────────────────────────────────

function NTEStatusBadge({ status }: { status: NTEStatus }) {
  const c = statusCfg(status);
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-semibold ${c.bg} ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {status}
    </span>
  );
}

// ── Case Timeline ─────────────────────────────────────────────────────────────

function CaseTimeline({ nte, nod }: { nte: NTERecord; nod?: NODRecord }) {
  const steps = [
    { label: 'NTE Issued',             done: true,                               date: nte.issuedDate,                         by: nte.issuedBy },
    { label: 'Employee Acknowledged',  done: !!nte.acknowledgedAt,               date: nte.acknowledgedAt,                     by: nte.employeeName },
    { label: 'Explanation Submitted',  done: !!nte.explanationLetter,            date: nte.explanationLetter?.submittedDate,   by: nte.employeeName },
    { label: 'Under Review',           done: ['Under Review','Decision Issued','Closed'].includes(nte.status), date: undefined, by: nte.assignedTo },
    { label: 'Decision Issued (NOD)',  done: !!nod,                              date: nod?.issuedDate,                        by: nod?.issuedBy },
    { label: 'Case Closed',            done: nte.status === 'Closed',            date: undefined,                              by: undefined },
  ];

  return (
    <div className="relative pl-8">
      <div className="absolute left-3.5 top-2 bottom-2 w-0.5 bg-border" />
      <div className="space-y-5">
        {steps.map((s, i) => (
          <div key={i} className="relative flex items-start gap-3 -ml-8 pl-8">
            <div className={`absolute left-0 w-7 h-7 rounded-full flex items-center justify-center z-10 flex-shrink-0 border-2 ${
              nte.status === 'Voided' && !s.done ? 'bg-gray-100 border-gray-200' :
              s.done ? 'bg-emerald-500 border-emerald-500' : 'bg-white border-border'
            }`}>
              {s.done && <CheckCircle2 size={14} className="text-white" />}
            </div>
            <div className="flex-1 min-w-0 pt-0.5">
              <div className={`text-sm font-semibold ${s.done ? 'text-foreground' : 'text-muted-foreground'}`}>{s.label}</div>
              {(s.date || s.by) && (
                <div className="text-xs text-muted-foreground mt-0.5">
                  {s.date && <span>{s.date}</span>}
                  {s.date && s.by && <span> · </span>}
                  {s.by && <span>{s.by}</span>}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Case Detail Modal ─────────────────────────────────────────────────────────

interface DetailProps {
  nte: NTERecord;
  nod?: NODRecord;
  canSeeLetters: boolean;
  isManager: boolean;
  onClose: () => void;
  onIssueNOD: (nte: NTERecord) => void;
  onMarkUnderReview: (id: string) => void;
  onVoid: (id: string) => void;
  onAssign: (id: string, to: string) => void;
}

function CaseDetailModal({ nte, nod, canSeeLetters, isManager, onClose, onIssueNOD, onMarkUnderReview, onVoid, onAssign }: DetailProps) {
  const [subTab, setSubTab] = useState<'overview' | 'letter' | 'audit'>('overview');
  const [assignTo, setAssignTo] = useState(nte.assignedTo);
  const [showAssign, setShowAssign] = useState(false);

  const c = statusCfg(nte.status);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-8" style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[88vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-4 px-6 py-4 border-b border-border flex-shrink-0">
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
            <FileWarning size={20} className="text-amber-700" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-foreground">{nte.id}</span>
              <NTEStatusBadge status={nte.status} />
              {nte.escalationRequired && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 font-semibold">Escalated</span>
              )}
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">
              {nte.employeeName} · {nte.department} · Assigned to <strong>{nte.assignedTo}</strong>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground flex-shrink-0">
            <X size={18} />
          </button>
        </div>

        {/* Sub tabs */}
        <div className="flex gap-1 px-6 pt-3 pb-0 border-b border-border flex-shrink-0">
          {(['overview', 'letter', 'audit'] as const).map(t => (
            <button key={t} onClick={() => setSubTab(t)}
              className={`px-4 py-2 text-sm font-semibold capitalize rounded-t-lg transition-colors ${
                subTab === t ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {t === 'letter' ? 'Explanation Letter' : t === 'audit' ? 'Audit Log' : 'Overview'}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {subTab === 'overview' && (
            <>
              {/* Employee + dates grid */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Employee', value: nte.employeeName },
                  { label: 'Department', value: nte.department },
                  { label: 'Incident Date', value: nte.incidentDate },
                  { label: 'Response Deadline', value: nte.responseDeadline },
                  { label: 'Issued By', value: `${nte.issuedBy} (${nte.issuedByRole})` },
                  { label: 'Issued Date', value: nte.issuedDate },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-secondary/40 rounded-xl px-4 py-3">
                    <div className="text-xs text-muted-foreground">{label}</div>
                    <div className="text-sm font-semibold text-foreground mt-0.5">{value}</div>
                  </div>
                ))}
              </div>

              {/* Incident type */}
              <div>
                <div className="text-xs text-muted-foreground mb-1.5">Incident Type</div>
                <span className="text-xs px-3 py-1 rounded-full bg-red-100 text-red-700 font-semibold">{nte.incidentType}</span>
              </div>

              {/* Description */}
              <div>
                <div className="text-xs text-muted-foreground mb-1.5">Incident Description</div>
                <div className="bg-secondary/30 rounded-xl p-4 text-sm text-foreground leading-relaxed">{nte.description}</div>
              </div>

              {/* Escalation info */}
              {nte.escalationRequired && nte.escalationApprovedBy && (
                <div className="flex items-start gap-3 px-4 py-3 bg-purple-50 border border-purple-200 rounded-xl">
                  <Shield size={15} className="text-purple-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-purple-800">
                    Manager-initiated NTE approved by <strong>{nte.escalationApprovedBy}</strong> on {nte.escalationApprovedDate}.
                  </div>
                </div>
              )}

              {/* Manager recommendation */}
              {nte.managerRecommendation && (
                <div className="border border-border rounded-xl overflow-hidden">
                  <div className="px-4 py-2.5 bg-secondary/40 border-b border-border text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Manager Recommendation
                  </div>
                  <div className="px-4 py-3 text-sm text-foreground leading-relaxed">{nte.managerRecommendation}</div>
                </div>
              )}

              {/* Timeline */}
              <div className="border border-border rounded-xl overflow-hidden">
                <div className="px-4 py-2.5 bg-secondary/40 border-b border-border text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Case Timeline
                </div>
                <div className="p-4"><CaseTimeline nte={nte} nod={nod} /></div>
              </div>

              {/* Related NOD */}
              {nod && (
                <div className="border border-purple-200 rounded-xl overflow-hidden">
                  <div className="flex items-center gap-2 px-4 py-3 bg-purple-50 border-b border-purple-200">
                    <Gavel size={14} className="text-purple-600" />
                    <span className="text-sm font-semibold text-purple-900">Notice of Decision — {nod.id}</span>
                    <span className={`ml-auto text-xs px-2.5 py-0.5 rounded-full font-semibold ${decisionCfg(nod.decision)}`}>{nod.decision}{nod.suspensionDays ? ` (${nod.suspensionDays}d)` : ''}</span>
                  </div>
                  <div className="px-4 py-3 space-y-1">
                    <div className="text-xs text-muted-foreground">Issued {nod.issuedDate} · Effective {nod.effectiveDate} · by {nod.issuedBy}</div>
                    {nod.acknowledgedAt && <div className="text-xs text-emerald-700 font-semibold">✓ Acknowledged by employee on {nod.acknowledgedAt}</div>}
                    <div className="text-sm text-foreground leading-relaxed mt-2">{nod.details}</div>
                  </div>
                </div>
              )}
            </>
          )}

          {subTab === 'letter' && (
            canSeeLetters ? (
              nte.explanationLetter ? (
                <div className="space-y-4">
                  <div className="flex items-start gap-3 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <Lock size={14} className="text-slate-500 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-slate-700">
                      This document is <strong>confidential</strong> — accessible only to HR and the employee involved.
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-5 border border-border rounded-xl bg-secondary/20">
                    <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
                      <FileText size={22} className="text-accent" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-foreground truncate">{nte.explanationLetter.filename}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        Submitted by <strong>{nte.explanationLetter.submittedBy}</strong> on {nte.explanationLetter.submittedDate}
                      </div>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors">
                      <Download size={14} /> View / Download
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3 py-12 text-center">
                  <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center">
                    <Clock size={26} className="text-amber-600" />
                  </div>
                  <div className="font-semibold text-foreground">No letter submitted yet</div>
                  <div className="text-sm text-muted-foreground">Employee has until <strong>{nte.responseDeadline}</strong> to respond.</div>
                </div>
              )
            ) : (
              <div className="flex items-start gap-3 px-4 py-4 bg-slate-50 border border-slate-200 rounded-xl">
                <Lock size={15} className="text-slate-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-slate-600">
                  The explanation letter is <strong>confidential</strong> — visible to HR and the employee only.
                  {nte.explanationLetter && <span className="ml-2 text-emerald-700 font-semibold">✓ Received</span>}
                </div>
              </div>
            )
          )}

          {subTab === 'audit' && (
            <div className="space-y-2">
              {[...nte.auditLog].reverse().map(entry => (
                <div key={entry.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-secondary/30 transition-colors">
                  <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                    entry.role === 'admin' ? 'bg-primary' : entry.role === 'manager' ? 'bg-purple-500' : 'bg-emerald-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-foreground">{entry.action}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold capitalize ${
                        entry.role === 'admin' ? 'bg-red-100 text-red-700' : entry.role === 'manager' ? 'bg-purple-100 text-purple-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>{entry.role}</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">{entry.performedBy} · {entry.timestamp}</div>
                    {entry.details && <div className="text-xs text-muted-foreground mt-1 italic">{entry.details}</div>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer actions */}
        {!isManager && nte.status !== 'Voided' && nte.status !== 'Closed' && (
          <div className="flex items-center gap-2 px-6 py-4 border-t border-border bg-secondary/20 flex-shrink-0 flex-wrap">
            {nte.status === 'Explanation Submitted' && !nod && (
              <button onClick={() => onMarkUnderReview(nte.id)} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-purple-600 text-white text-sm font-semibold hover:bg-purple-700 transition-colors">
                <ArrowRight size={14} /> Mark Under Review
              </button>
            )}
            {nte.status === 'Under Review' && !nod && (
              <button onClick={() => { onClose(); onIssueNOD(nte); }} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors">
                <Gavel size={14} /> Issue NOD
              </button>
            )}
            {/* Assign */}
            {showAssign ? (
              <div className="flex items-center gap-2">
                <select value={assignTo} onChange={e => setAssignTo(e.target.value)} className="text-sm px-3 py-1.5 rounded-lg border border-border bg-background">
                  {HR_STAFF.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <button onClick={() => { onAssign(nte.id, assignTo); setShowAssign(false); }} className="px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold">Save</button>
                <button onClick={() => setShowAssign(false)} className="px-3 py-1.5 rounded-lg border border-border text-xs">Cancel</button>
              </div>
            ) : (
              <button onClick={() => setShowAssign(true)} className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:bg-secondary transition-colors">
                <Users size={13} /> Reassign
              </button>
            )}
            <button onClick={() => { if (confirm('Void this NTE? This action is logged.')) { onVoid(nte.id); onClose(); } }} className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-red-200 text-sm text-red-600 hover:bg-red-50 transition-colors ml-auto">
              <Ban size={13} /> Void NTE
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Issue NTE Modal ───────────────────────────────────────────────────────────

interface IssueNTEProps {
  viewerRole: 'admin' | 'manager';
  templates: NTETemplate[];
  onClose: () => void;
  onSubmit: (nte: NTERecord) => void;
}

function IssueNTEModal({ viewerRole, templates, onClose, onSubmit }: IssueNTEProps) {
  const nteTemplates = templates.filter(t => t.type === 'NTE');
  const [selectedTemplate, setSelectedTemplate] = useState<NTETemplate | null>(null);
  const [form, setForm] = useState({
    employeeId: '',
    incidentDate: '',
    incidentType: '' as IncidentType | '',
    description: '',
    responseDeadline: '',
    recommendation: '',
  });

  const deadlineMin = form.incidentDate ? addDays(today(), DOLE_MIN_DAYS) : '';

  function applyTemplate(tpl: NTETemplate) {
    setSelectedTemplate(tpl);
    setForm(f => ({ ...f, incidentType: tpl.incidentType ?? f.incidentType, description: tpl.body }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const emp = employees.find(em => em.id === form.employeeId);
    if (!emp) return;
    const isManager = viewerRole === 'manager';
    const newNTE: NTERecord = {
      id: `NTE-${Date.now()}`,
      employeeId: form.employeeId,
      employeeName: emp.name,
      department: emp.department,
      issuedBy: isManager ? 'Maria Santos' : 'Sofia Garcia',
      issuedByRole: viewerRole,
      assignedTo: 'Sofia Garcia',
      issuedDate: today(),
      incidentDate: form.incidentDate,
      incidentType: form.incidentType as IncidentType,
      description: form.description,
      responseDeadline: form.responseDeadline,
      status: isManager ? 'Pending Explanation' : 'Pending Explanation',
      escalationRequired: isManager,
      escalationApprovedBy: isManager ? undefined : 'Sofia Garcia',
      escalationApprovedDate: isManager ? undefined : today(),
      managerRecommendation: form.recommendation || undefined,
      auditLog: [
        newAuditEntry(
          isManager ? 'NTE Initiated by Manager' : 'NTE Issued',
          isManager ? 'Maria Santos' : 'Sofia Garcia',
          viewerRole,
          isManager ? 'Pending HR escalation review' : `NTE issued to ${emp.name}`,
        ),
      ],
    };
    onSubmit(newNTE);
  }

  const isValid = form.employeeId && form.incidentDate && form.incidentType && form.description && form.responseDeadline;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <FileWarning size={20} className="text-amber-700" />
            </div>
            <div>
              <div className="font-bold text-foreground">Issue Notice to Explain</div>
              <div className="text-xs text-muted-foreground">DOLE twin-notice rule — min. {DOLE_MIN_DAYS} calendar days to respond</div>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground"><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Templates */}
          {nteTemplates.length > 0 && (
            <div>
              <div className="text-xs text-muted-foreground mb-2 font-semibold uppercase tracking-wide">Use a Template</div>
              <div className="flex flex-wrap gap-2">
                {nteTemplates.map(t => (
                  <button key={t.id} type="button" onClick={() => applyTemplate(t)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                      selectedTemplate?.id === t.id ? 'bg-primary text-white border-primary' : 'border-border hover:bg-secondary text-foreground'
                    }`}
                  >{t.name}</button>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-semibold text-foreground mb-1.5">Employee *</label>
              <select value={form.employeeId} onChange={e => setForm(f => ({ ...f, employeeId: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl border border-border bg-input-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" required>
                <option value="">Select employee…</option>
                {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.name} — {emp.department}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Incident Date *</label>
              <input type="date" value={form.incidentDate} onChange={e => setForm(f => ({ ...f, incidentDate: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl border border-border bg-input-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                Response Deadline * <span className="text-xs text-muted-foreground font-normal">(min. {DOLE_MIN_DAYS} days from today)</span>
              </label>
              <input type="date" value={form.responseDeadline} min={deadlineMin}
                onChange={e => setForm(f => ({ ...f, responseDeadline: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl border border-border bg-input-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" required />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">Incident Type *</label>
            <select value={form.incidentType} onChange={e => setForm(f => ({ ...f, incidentType: e.target.value as IncidentType }))}
              className="w-full px-3 py-2.5 rounded-xl border border-border bg-input-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" required>
              <option value="">Select type…</option>
              {INCIDENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">Incident Description *</label>
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={5}
              className="w-full px-3 py-2.5 rounded-xl border border-border bg-input-background text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              placeholder="Describe the incident in detail. Include dates, witnesses, and prior warnings." required />
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">Manager Recommendation <span className="text-xs font-normal text-muted-foreground">(optional)</span></label>
            <textarea value={form.recommendation} onChange={e => setForm(f => ({ ...f, recommendation: e.target.value }))} rows={2}
              className="w-full px-3 py-2.5 rounded-xl border border-border bg-input-background text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              placeholder="Suggested sanction or context for HR…" />
          </div>

          {viewerRole === 'manager' && (
            <div className="flex items-start gap-2 px-3 py-2.5 bg-purple-50 border border-purple-200 rounded-xl text-xs text-purple-800">
              <AlertTriangle size={13} className="mt-0.5 flex-shrink-0" />
              This NTE will be sent to HR for review and approval before being issued to the employee.
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl border border-border text-sm font-semibold hover:bg-secondary transition-colors">Cancel</button>
            <button type="submit" disabled={!isValid} className="flex-1 px-4 py-2.5 rounded-xl bg-amber-600 text-white text-sm font-bold hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
              {viewerRole === 'manager' ? 'Submit for HR Review' : 'Issue NTE'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Issue NOD Modal ───────────────────────────────────────────────────────────

interface IssueNODProps {
  nte: NTERecord;
  templates: NTETemplate[];
  onClose: () => void;
  onSubmit: (nod: NODRecord) => void;
}

function IssueNODModal({ nte, templates, onClose, onSubmit }: IssueNODProps) {
  const nodTemplates = templates.filter(t => t.type === 'NOD');
  const [form, setForm] = useState({ decision: '' as NODDecision | '', suspensionDays: '', effectiveDate: today(), details: '' });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const nod: NODRecord = {
      id: `NOD-${Date.now()}`,
      nteId: nte.id,
      employeeId: nte.employeeId,
      employeeName: nte.employeeName,
      department: nte.department,
      issuedBy: 'Sofia Garcia',
      issuedDate: today(),
      decision: form.decision as NODDecision,
      suspensionDays: form.decision === 'Suspension' && form.suspensionDays ? parseInt(form.suspensionDays) : undefined,
      effectiveDate: form.effectiveDate,
      details: form.details,
      managerRecommendation: nte.managerRecommendation,
      auditLog: [newAuditEntry('NOD Issued', 'Sofia Garcia', 'admin', `Decision: ${form.decision}`)],
    };
    onSubmit(nod);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
              <Gavel size={20} className="text-purple-700" />
            </div>
            <div>
              <div className="font-bold text-foreground">Issue Notice of Decision</div>
              <div className="text-xs text-muted-foreground">Re: {nte.id} · {nte.employeeName}</div>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {nte.managerRecommendation && (
            <div className="px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-900">
              <strong>Manager Recommendation:</strong> {nte.managerRecommendation}
            </div>
          )}

          {/* Template shortcuts */}
          {nodTemplates.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {nodTemplates.map(t => (
                <button key={t.id} type="button"
                  onClick={() => setForm(f => ({ ...f, decision: t.decisionType ?? f.decision, details: t.body }))}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-border hover:bg-secondary transition-colors">
                  Use "{t.name}" template
                </button>
              ))}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Decision *</label>
            <div className="grid grid-cols-2 gap-2">
              {NOD_DECISIONS.map(d => (
                <button key={d} type="button" onClick={() => setForm(f => ({ ...f, decision: d }))}
                  className={`px-3 py-2.5 rounded-xl border text-sm font-semibold text-left transition-all ${
                    form.decision === d ? (
                      d === 'Exonerated' ? 'border-emerald-500 bg-emerald-50 text-emerald-800' :
                      d === 'Dismissal' ? 'border-red-500 bg-red-50 text-red-800' :
                      d === 'Suspension' ? 'border-orange-500 bg-orange-50 text-orange-800' :
                      'border-amber-500 bg-amber-50 text-amber-800'
                    ) : 'border-border hover:bg-secondary text-foreground'
                  }`}>{d}</button>
              ))}
            </div>
          </div>

          {form.decision === 'Suspension' && (
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Suspension Duration (working days) *</label>
              <input type="number" min="1" max="30" value={form.suspensionDays} onChange={e => setForm(f => ({ ...f, suspensionDays: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl border border-border bg-input-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="e.g. 3" />
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">Effective Date *</label>
            <input type="date" value={form.effectiveDate} onChange={e => setForm(f => ({ ...f, effectiveDate: e.target.value }))}
              className="w-full px-3 py-2.5 rounded-xl border border-border bg-input-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" required />
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">Decision Rationale *</label>
            <textarea value={form.details} onChange={e => setForm(f => ({ ...f, details: e.target.value }))} rows={5}
              className="w-full px-3 py-2.5 rounded-xl border border-border bg-input-background text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              placeholder="State management's findings and the basis for this decision…" required />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl border border-border text-sm font-semibold hover:bg-secondary transition-colors">Cancel</button>
            <button type="submit" disabled={!form.decision || !form.details}
              className="flex-1 px-4 py-2.5 rounded-xl bg-purple-700 text-white text-sm font-bold hover:bg-purple-800 disabled:opacity-50 transition-colors">
              Issue NOD
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Reports Tab ───────────────────────────────────────────────────────────────

function ReportsTab({ ntes, nods }: { ntes: NTERecord[]; nods: NODRecord[] }) {
  const byDept = useMemo(() => {
    const map: Record<string, number> = {};
    ntes.forEach(n => { map[n.department] = (map[n.department] ?? 0) + 1; });
    return Object.entries(map).map(([dept, count]) => ({ dept, count })).sort((a, b) => b.count - a.count);
  }, [ntes]);

  const byType = useMemo(() => {
    const map: Record<string, number> = {};
    ntes.forEach(n => { map[n.incidentType] = (map[n.incidentType] ?? 0) + 1; });
    return Object.entries(map).map(([type, count]) => ({ type, count })).sort((a, b) => b.count - a.count);
  }, [ntes]);

  const repeatOffenders = useMemo(() => {
    const map: Record<string, { name: string; dept: string; count: number }> = {};
    ntes.filter(n => n.status !== 'Voided').forEach(n => {
      if (!map[n.employeeId]) map[n.employeeId] = { name: n.employeeName, dept: n.department, count: 0 };
      map[n.employeeId].count++;
    });
    return Object.values(map).filter(e => e.count >= 1).sort((a, b) => b.count - a.count);
  }, [ntes]);

  const statuses: NTEStatus[] = ['Pending Explanation', 'Explanation Submitted', 'Under Review', 'Decision Issued', 'Closed', 'Voided'];
  const byStatus = statuses.map(s => ({ status: s, count: ntes.filter(n => n.status === s).length }));

  return (
    <div className="space-y-5">
      {/* Summary row */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Cases', value: ntes.filter(n => n.status !== 'Voided').length, color: 'text-foreground' },
          { label: 'Active Cases', value: ntes.filter(n => !['Closed','Voided'].includes(n.status)).length, color: 'text-amber-700' },
          { label: 'NODs Issued', value: nods.length, color: 'text-purple-700' },
          { label: 'Repeat Offenders', value: repeatOffenders.filter(e => e.count > 1).length, color: 'text-red-700' },
        ].map(s => (
          <div key={s.label} className="bg-card rounded-xl border border-border p-4">
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* By department */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="font-bold text-foreground mb-4">NTEs by Department</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={byDept} barSize={22} layout="vertical">
              <CartesianGrid key="grid" strokeDasharray="3 3" horizontal={false} stroke="#F0E6D8" />
              <XAxis key="x" type="number" tick={{ fontSize: 11, fill: '#7A5C50' }} axisLine={false} tickLine={false} allowDecimals={false} />
              <YAxis key="y" type="category" dataKey="dept" tick={{ fontSize: 11, fill: '#7A5C50' }} axisLine={false} tickLine={false} width={90} />
              <Tooltip key="tooltip" contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E8D8C8' }} />
              <Bar key="count" dataKey="count" name="Cases" fill="#8B1A1E" radius={[0, 4, 4, 0]} isAnimationActive={false} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* By status */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="font-bold text-foreground mb-4">Cases by Status</h3>
          <div className="space-y-2.5">
            {byStatus.filter(s => s.count > 0).map(s => {
              const cfg = statusCfg(s.status);
              const pct = ntes.length > 0 ? Math.round((s.count / ntes.length) * 100) : 0;
              return (
                <div key={s.status} className="flex items-center gap-3">
                  <span className={`text-xs font-semibold w-40 truncate ${cfg.text}`}>{s.status}</span>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${cfg.dot}`} style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-xs text-muted-foreground w-6 text-right">{s.count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* By incident type */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="font-bold text-foreground mb-4">Top Incident Types</h3>
          <div className="space-y-2.5">
            {byType.map(({ type, count }) => (
              <div key={type} className="flex items-center justify-between gap-2">
                <span className="text-sm text-foreground truncate flex-1">{type}</span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-red-100 text-red-800">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Repeat offenders */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="font-bold text-foreground mb-4">Case History by Employee</h3>
          <div className="space-y-2">
            {repeatOffenders.map(e => (
              <div key={e.name} className="flex items-center gap-3 px-3 py-2 rounded-xl bg-secondary/40">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-bold">{e.name.split(' ').map(n => n[0]).join('').slice(0,2)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-foreground truncate">{e.name}</div>
                  <div className="text-xs text-muted-foreground">{e.dept}</div>
                </div>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${e.count >= 2 ? 'bg-red-100 text-red-800' : 'bg-muted text-muted-foreground'}`}>
                  {e.count} case{e.count > 1 ? 's' : ''}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Templates Tab ─────────────────────────────────────────────────────────────

function TemplatesTab({ templates }: { templates: NTETemplate[] }) {
  const [preview, setPreview] = useState<NTETemplate | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-900">
        <Shield size={15} className="mt-0.5 flex-shrink-0 text-amber-700" />
        These templates are DOLE-compliant. Replace bracketed placeholders (e.g. [EMPLOYEE_NAME]) before issuing.
      </div>
      <div className="grid grid-cols-2 gap-3">
        {templates.map(t => (
          <div key={t.id} className="bg-card border border-border rounded-xl p-4 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${t.type === 'NTE' ? 'bg-amber-100 text-amber-800' : 'bg-purple-100 text-purple-800'}`}>{t.type}</div>
              {t.decisionType && <div className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${decisionCfg(t.decisionType)}`}>{t.decisionType}</div>}
            </div>
            <div className="font-bold text-foreground">{t.name}</div>
            <div className="text-xs text-muted-foreground italic line-clamp-2">{t.subject}</div>
            <button onClick={() => setPreview(t)} className="flex items-center gap-1.5 text-xs text-accent font-semibold hover:underline mt-auto">
              <BookOpen size={12} /> Preview Template
            </button>
          </div>
        ))}
      </div>

      {preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div>
                <div className="font-bold text-foreground">{preview.name}</div>
                <div className="text-xs text-muted-foreground">{preview.subject}</div>
              </div>
              <button onClick={() => setPreview(null)} className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground"><X size={18} /></button>
            </div>
            <div className="p-6">
              <pre className="whitespace-pre-wrap text-sm text-foreground font-sans leading-relaxed bg-secondary/30 rounded-xl p-5">{preview.body}</pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Global Audit Log Tab ──────────────────────────────────────────────────────

function AuditLogTab({ ntes, nods }: { ntes: NTERecord[]; nods: NODRecord[] }) {
  const all = useMemo(() => {
    const entries: (AuditEntry & { caseId: string })[] = [];
    ntes.forEach(n => n.auditLog.forEach(e => entries.push({ ...e, caseId: n.id })));
    nods.forEach(n => n.auditLog.forEach(e => entries.push({ ...e, caseId: n.id })));
    return entries.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  }, [ntes, nods]);

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="px-5 py-3 border-b border-border bg-secondary/30 flex items-center justify-between">
        <span className="font-bold text-foreground text-sm">All Actions — {all.length} entries</span>
      </div>
      <div className="divide-y divide-border/50">
        {all.map((entry, i) => (
          <div key={`${entry.id}-${i}`} className="flex items-start gap-4 px-5 py-3.5 hover:bg-secondary/20 transition-colors">
            <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
              entry.role === 'admin' ? 'bg-primary' : entry.role === 'manager' ? 'bg-purple-500' : 'bg-emerald-500'
            }`} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-semibold text-foreground">{entry.action}</span>
                <span className="font-mono text-xs text-muted-foreground">{entry.caseId}</span>
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                <span className={`font-semibold mr-1 ${entry.role === 'admin' ? 'text-primary' : entry.role === 'manager' ? 'text-purple-600' : 'text-emerald-600'}`}>
                  {entry.performedBy}
                </span>
                · {entry.timestamp}
              </div>
              {entry.details && <div className="text-xs text-muted-foreground mt-0.5 italic">{entry.details}</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export function HRAdminModule({ viewerRole = 'admin' }: { viewerRole?: 'admin' | 'manager' }) {
  const isManager = viewerRole === 'manager';
  const canSeeLetters = true; // both HR admin and manager can see letters (manager only sees their team's)

  const [activeTab, setActiveTab] = useState<'cases' | 'reports' | 'templates' | 'audit'>('cases');
  const [ntes, setNTEs] = useState<NTERecord[]>(initialNTEs);
  const [nods, setNODs] = useState<NODRecord[]>(initialNODs);
  const [templates] = useState<NTETemplate[]>(defaultTemplates);

  const [selectedCase, setSelectedCase] = useState<NTERecord | null>(null);
  const [showIssueNTE, setShowIssueNTE] = useState(false);
  const [nodTarget, setNodTarget] = useState<NTERecord | null>(null);

  // Filters
  const [search, setSearch] = useState('');
  const [filterDept, setFilterDept] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  // Manager sees only cases they initiated OR from their department
  const visibleNTEs = useMemo(() => {
    let list = isManager
      ? ntes.filter(n => n.issuedBy === 'Maria Santos' || n.department === 'Operations')
      : ntes;
    if (search) list = list.filter(n =>
      n.employeeName.toLowerCase().includes(search.toLowerCase()) ||
      n.id.toLowerCase().includes(search.toLowerCase()) ||
      n.incidentType.toLowerCase().includes(search.toLowerCase())
    );
    if (filterDept !== 'All') list = list.filter(n => n.department === filterDept);
    if (filterStatus !== 'All') list = list.filter(n => n.status === filterStatus);
    return list;
  }, [ntes, isManager, search, filterDept, filterStatus]);

  const visibleNODs = useMemo(() =>
    isManager ? nods.filter(n => n.department === 'Operations' || ntes.find(t => t.id === n.nteId && t.issuedBy === 'Maria Santos')) : nods,
    [nods, isManager, ntes]
  );

  const openCount = ntes.filter(n => !['Closed','Voided'].includes(n.status)).length;
  const pendingCount = ntes.filter(n => n.status === 'Pending Explanation').length;
  const reviewCount = ntes.filter(n => n.status === 'Under Review').length;

  function handleIssueNTE(nte: NTERecord) {
    setNTEs(prev => [nte, ...prev]);
    setShowIssueNTE(false);
  }

  function handleIssueNOD(nod: NODRecord) {
    setNODs(prev => [nod, ...prev]);
    setNTEs(prev => prev.map(n => n.id === nod.nteId
      ? { ...n, status: 'Decision Issued', auditLog: [...n.auditLog, newAuditEntry('NOD Issued', 'Sofia Garcia', 'admin', `${nod.decision} — ${nod.id}`)] }
      : n
    ));
    setNodTarget(null);
    setActiveTab('cases');
  }

  function handleMarkUnderReview(id: string) {
    setNTEs(prev => prev.map(n => n.id === id
      ? { ...n, status: 'Under Review', auditLog: [...n.auditLog, newAuditEntry('Status → Under Review', 'Sofia Garcia', 'admin', 'HR reviewing explanation letter')] }
      : n
    ));
    setSelectedCase(prev => prev?.id === id ? { ...prev, status: 'Under Review' } : prev);
  }

  function handleVoid(id: string) {
    setNTEs(prev => prev.map(n => n.id === id
      ? { ...n, status: 'Voided', auditLog: [...n.auditLog, newAuditEntry('NTE Voided', 'Sofia Garcia', 'admin', 'Voided by HR — issued in error or case withdrawn')] }
      : n
    ));
  }

  function handleAssign(id: string, to: string) {
    setNTEs(prev => prev.map(n => n.id === id
      ? { ...n, assignedTo: to, auditLog: [...n.auditLog, newAuditEntry('Case Reassigned', 'Sofia Garcia', 'admin', `Assigned to ${to}`)] }
      : n
    ));
  }

  const tabs = isManager
    ? [{ id: 'cases', label: 'My Team\'s Cases', icon: ClipboardList }]
    : [
        { id: 'cases', label: 'Cases', icon: ClipboardList },
        { id: 'reports', label: 'Reports', icon: BarChart2 },
        { id: 'templates', label: 'Templates', icon: BookOpen },
        { id: 'audit', label: 'Audit Log', icon: ClipboardList },
      ];

  return (
    <div className="space-y-5">
      {/* Summary cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Open Cases', value: openCount, sub: 'active or pending', icon: AlertCircle, col: 'bg-amber-100 text-amber-700' },
          { label: 'Awaiting Response', value: pendingCount, sub: 'employee to reply', icon: Clock, col: 'bg-amber-50 text-accent' },
          { label: 'Under Review', value: reviewCount, sub: 'HR reviewing now', icon: Search, col: 'bg-purple-100 text-purple-700' },
          { label: 'NODs Issued', value: visibleNODs.length, sub: 'decisions made', icon: Gavel, col: 'bg-emerald-100 text-emerald-700' },
        ].map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-card rounded-xl border border-border p-4 flex items-start gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${s.col}`}>
                <Icon size={18} />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{s.value}</div>
                <div className="text-sm font-semibold text-foreground">{s.label}</div>
                <div className="text-xs text-muted-foreground">{s.sub}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* DOLE compliance banner */}
      <div className="flex items-center gap-3 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl">
        <Shield size={15} className="text-amber-700 flex-shrink-0" />
        <span className="text-sm text-amber-900">
          <strong>DOLE Compliance:</strong> All cases follow the twin-notice rule — NTE (≥5 days to respond) followed by NOD after due deliberation.
        </span>
      </div>

      {/* Tab bar + actions */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex gap-1 bg-card border border-border rounded-xl p-1">
          {tabs.map(t => {
            const Icon = t.icon;
            return (
              <button key={t.id} onClick={() => setActiveTab(t.id as typeof activeTab)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === t.id ? 'bg-primary text-white' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}>
                <Icon size={14} />{t.label}
              </button>
            );
          })}
        </div>
        {activeTab === 'cases' && (
          <button onClick={() => setShowIssueNTE(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors">
            <Plus size={15} /> Issue NTE
          </button>
        )}
      </div>

      {/* Cases tab */}
      {activeTab === 'cases' && (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          {/* Filters */}
          <div className="flex items-center gap-3 px-5 py-3.5 border-b border-border bg-secondary/20 flex-wrap">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search cases…"
                className="pl-9 pr-4 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring w-48" />
            </div>
            <select value={filterDept} onChange={e => setFilterDept(e.target.value)}
              className="px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring">
              {DEPARTMENTS.map(d => <option key={d} value={d}>{d === 'All' ? 'All Departments' : d}</option>)}
            </select>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
              className="px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring">
              <option value="All">All Statuses</option>
              {ALL_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            {(search || filterDept !== 'All' || filterStatus !== 'All') && (
              <button onClick={() => { setSearch(''); setFilterDept('All'); setFilterStatus('All'); }}
                className="text-xs text-muted-foreground hover:text-foreground font-semibold underline">Clear</button>
            )}
            <span className="ml-auto text-xs text-muted-foreground">{visibleNTEs.length} record{visibleNTEs.length !== 1 ? 's' : ''}</span>
          </div>

          {/* NTE Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-secondary/30">
                  {['Case ID', 'Employee', 'Incident Type', 'Issued By', 'Deadline', 'Status', 'Letter', ''].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {visibleNTEs.length === 0 ? (
                  <tr><td colSpan={8} className="px-5 py-10 text-center text-muted-foreground">No cases found</td></tr>
                ) : visibleNTEs.map(nte => {
                  const cfg = statusCfg(nte.status);
                  return (
                    <tr key={nte.id} className="hover:bg-secondary/20 transition-colors cursor-pointer" onClick={() => setSelectedCase(nte)}>
                      <td className="px-4 py-3.5">
                        <span className="font-mono text-xs font-bold text-primary">{nte.id}</span>
                        {nte.escalationRequired && <span className="ml-1 text-xs text-purple-600" title="Escalated">↑</span>}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="font-semibold text-foreground">{nte.employeeName}</div>
                        <div className="text-xs text-muted-foreground">{nte.department}</div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-xs px-2.5 py-1 rounded-full bg-red-100 text-red-800 font-semibold">{nte.incidentType}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="text-sm text-foreground">{nte.issuedBy}</div>
                        <div className="text-xs text-muted-foreground capitalize">{nte.issuedByRole}</div>
                      </td>
                      <td className="px-4 py-3.5 text-sm text-muted-foreground whitespace-nowrap">{nte.responseDeadline}</td>
                      <td className="px-4 py-3.5"><NTEStatusBadge status={nte.status} /></td>
                      <td className="px-4 py-3.5">
                        {nte.explanationLetter ? (
                          <span className="inline-flex items-center gap-1 text-xs text-emerald-700 font-semibold"><CheckCircle2 size={12} /> Received</span>
                        ) : <span className="text-xs text-muted-foreground">Pending</span>}
                      </td>
                      <td className="px-4 py-3.5">
                        <ChevronRight size={15} className="text-muted-foreground" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'reports' && !isManager && <ReportsTab ntes={ntes} nods={nods} />}
      {activeTab === 'templates' && !isManager && <TemplatesTab templates={templates} />}
      {activeTab === 'audit' && !isManager && <AuditLogTab ntes={ntes} nods={nods} />}

      {/* Modals */}
      {selectedCase && (
        <CaseDetailModal
          nte={selectedCase}
          nod={nods.find(n => n.nteId === selectedCase.id)}
          canSeeLetters={canSeeLetters}
          isManager={isManager}
          onClose={() => setSelectedCase(null)}
          onIssueNOD={nte => { setSelectedCase(null); setNodTarget(nte); }}
          onMarkUnderReview={handleMarkUnderReview}
          onVoid={handleVoid}
          onAssign={handleAssign}
        />
      )}
      {showIssueNTE && (
        <IssueNTEModal viewerRole={viewerRole} templates={templates} onClose={() => setShowIssueNTE(false)} onSubmit={handleIssueNTE} />
      )}
      {nodTarget && (
        <IssueNODModal nte={nodTarget} templates={templates} onClose={() => setNodTarget(null)} onSubmit={handleIssueNOD} />
      )}
    </div>
  );
}
