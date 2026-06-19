import { useState } from 'react';
import {
  FileWarning, Gavel, Clock, CheckCircle2, AlertCircle,
  Upload, X, Lock, Shield, FileText, ChevronDown, ChevronUp
} from 'lucide-react';
import { nteRecords, nodRecords, type NTERecord, type NTEStatus } from '../../data/mockData';

const MY_EMPLOYEE_ID = 'EMP002';

function statusCfg(s: NTEStatus) {
  const map: Record<NTEStatus, { bg: string; text: string; border: string; dot: string; label: string; icon: typeof AlertCircle }> = {
    'Pending Explanation':   { bg: 'bg-amber-50',   text: 'text-amber-800',   border: 'border-amber-300', dot: 'bg-amber-500',   label: 'Action Required — Submit Your Explanation', icon: AlertCircle },
    'Explanation Submitted': { bg: 'bg-violet-50',  text: 'text-violet-800',  border: 'border-violet-200', dot: 'bg-violet-500',  label: 'Explanation Submitted — Under HR Review',   icon: Clock },
    'Under Review':          { bg: 'bg-purple-50',  text: 'text-purple-800',  border: 'border-purple-200', dot: 'bg-purple-500',  label: 'Under Review by HR',                       icon: Clock },
    'Decision Issued':       { bg: 'bg-orange-50',  text: 'text-orange-800',  border: 'border-orange-200', dot: 'bg-orange-500',  label: 'Decision Has Been Issued',                 icon: Gavel },
    'Closed':                { bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200', dot: 'bg-emerald-500', label: 'Case Closed',                             icon: CheckCircle2 },
    'Voided':                { bg: 'bg-gray-50',    text: 'text-gray-600',    border: 'border-gray-200',  dot: 'bg-gray-400',    label: 'Case Voided',                              icon: X },
  };
  return map[s];
}

// ── Upload Modal ──────────────────────────────────────────────────────────────

interface UploadProps { nte: NTERecord; onClose: () => void; onSubmit: (id: string, filename: string) => void; }

function UploadModal({ nte, onClose, onSubmit }: UploadProps) {
  const [file, setFile] = useState('');
  const [text, setText] = useState('');
  const [done, setDone] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const name = file || `Explanation_${nte.employeeName.replace(' ', '')}_${nte.id}.pdf`;
    setDone(true);
    setTimeout(() => { onSubmit(nte.id, name); onClose(); }, 1200);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center">
              <Upload size={18} className="text-accent" />
            </div>
            <div>
              <div className="font-bold text-foreground">Submit Explanation Letter</div>
              <div className="text-xs text-muted-foreground">In response to {nte.id} · Deadline: {nte.responseDeadline}</div>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground"><X size={18} /></button>
        </div>

        {done ? (
          <div className="py-12 flex flex-col items-center gap-3 text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center">
              <CheckCircle2 size={28} className="text-emerald-600" />
            </div>
            <div className="font-bold text-foreground">Explanation Submitted</div>
            <div className="text-sm text-muted-foreground">Your letter has been securely delivered to HR.</div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="flex items-start gap-2 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600">
              <Lock size={12} className="mt-0.5 flex-shrink-0 text-slate-500" />
              Your letter is <strong className="mx-1">confidential</strong> — visible only to you, your manager, and HR.
            </div>
            <label className="flex flex-col items-center gap-2 px-4 py-6 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-accent hover:bg-secondary/40 transition-all">
              <Upload size={22} className="text-muted-foreground" />
              <div className="text-sm text-center text-muted-foreground">
                {file ? <span className="text-foreground font-semibold">{file}</span> : <><strong>Click to upload</strong> or drag file here<br /><span className="text-xs">PDF, DOCX, JPG — max 10 MB</span></>}
              </div>
              <input type="file" className="hidden" accept=".pdf,.docx,.jpg,.png" onChange={e => setFile(e.target.files?.[0]?.name ?? '')} />
            </label>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Or type your explanation</label>
              <textarea value={text} onChange={e => setText(e.target.value)} rows={5} placeholder="Be factual and concise — include dates, circumstances, and supporting details…"
                className="w-full px-3 py-2.5 rounded-xl border border-border bg-input-background text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
            </div>
            <div className="flex gap-3 pt-1">
              <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl border border-border text-sm font-semibold hover:bg-secondary transition-colors">Cancel</button>
              <button type="submit" disabled={!file && !text.trim()} className="flex-1 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                Submit Explanation
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

// ── Case Card ─────────────────────────────────────────────────────────────────

function CaseCard({ nte, nod, onUpload, onAcknowledge }: {
  nte: NTERecord;
  nod?: typeof nodRecords[0];
  onUpload: (nte: NTERecord) => void;
  onAcknowledge: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(nte.status === 'Pending Explanation');
  const cfg = statusCfg(nte.status);
  const Icon = cfg.icon;

  const timelineSteps = [
    { label: 'NTE Received',           done: true,                     date: nte.issuedDate },
    { label: 'You Acknowledged',       done: !!nte.acknowledgedAt,     date: nte.acknowledgedAt },
    { label: 'Explanation Submitted',  done: !!nte.explanationLetter,  date: nte.explanationLetter?.submittedDate },
    { label: 'Under HR Review',        done: ['Under Review','Decision Issued','Closed'].includes(nte.status), date: undefined },
    { label: 'Decision Issued',        done: !!nod,                    date: nod?.issuedDate },
    { label: 'Case Closed',            done: nte.status === 'Closed',  date: undefined },
  ];

  return (
    <div className={`bg-card rounded-2xl border ${cfg.border} overflow-hidden`}>
      {/* Header */}
      <button onClick={() => setExpanded(v => !v)} className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-secondary/20 transition-colors">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.bg}`}>
          <Icon size={18} className={cfg.text} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-foreground text-sm">{nte.id}</span>
            <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${cfg.bg} ${cfg.text} ${cfg.border}`}>{cfg.label}</span>
          </div>
          <div className="text-xs text-muted-foreground mt-0.5">{nte.incidentType} · Issued {nte.issuedDate} · Deadline {nte.responseDeadline}</div>
        </div>
        {expanded ? <ChevronUp size={16} className="text-muted-foreground flex-shrink-0" /> : <ChevronDown size={16} className="text-muted-foreground flex-shrink-0" />}
      </button>

      {expanded && (
        <div className="border-t border-border/50 px-5 pb-5 pt-4 space-y-4">
          {/* Incident notice */}
          <div>
            <div className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-1.5">Notice Content</div>
            <div className="bg-secondary/30 rounded-xl px-4 py-3 text-sm text-foreground leading-relaxed">{nte.description}</div>
          </div>

          {/* Timeline */}
          <div className="border border-border rounded-xl overflow-hidden">
            <div className="px-4 py-2.5 bg-secondary/30 border-b border-border text-xs font-bold text-muted-foreground uppercase tracking-wide">Case Timeline</div>
            <div className="p-4 relative pl-10">
              <div className="absolute left-7 top-4 bottom-4 w-0.5 bg-border" />
              <div className="space-y-4">
                {timelineSteps.map((s, i) => (
                  <div key={i} className="relative flex items-start gap-3 -ml-10 pl-10">
                    <div className={`absolute left-0 w-7 h-7 rounded-full flex items-center justify-center z-10 flex-shrink-0 border-2 ${
                      s.done ? 'bg-emerald-500 border-emerald-500' : 'bg-white border-border'
                    }`}>
                      {s.done && <CheckCircle2 size={13} className="text-white" />}
                    </div>
                    <div className="pt-0.5">
                      <div className={`text-sm font-semibold ${s.done ? 'text-foreground' : 'text-muted-foreground'}`}>{s.label}</div>
                      {s.date && <div className="text-xs text-muted-foreground">{s.date}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Acknowledge */}
          {!nte.acknowledgedAt && (
            <div className="flex items-start gap-3 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl">
              <AlertCircle size={16} className="text-amber-700 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <div className="text-sm font-bold text-amber-900 mb-2">Please acknowledge receipt of this NTE.</div>
                <button onClick={() => onAcknowledge(nte.id)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-700 text-white text-sm font-bold hover:bg-amber-800 transition-colors">
                  <CheckCircle2 size={14} /> I have read and understood this NTE
                </button>
              </div>
            </div>
          )}

          {/* Explanation letter */}
          <div className="border border-border rounded-xl overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-secondary/30 border-b border-border">
              <Lock size={13} className="text-muted-foreground" />
              <span className="text-sm font-bold text-foreground">Your Explanation Letter</span>
              <span className="ml-auto text-xs bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full font-bold">Confidential</span>
            </div>
            {nte.explanationLetter ? (
              <div className="px-4 py-3 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                  <FileText size={16} className="text-emerald-700" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-foreground truncate">{nte.explanationLetter.filename}</div>
                  <div className="text-xs text-muted-foreground">Submitted {nte.explanationLetter.submittedDate}</div>
                </div>
                <span className="flex items-center gap-1 text-xs text-emerald-700 font-bold"><CheckCircle2 size={12} /> Submitted</span>
              </div>
            ) : (
              <div className="px-4 py-4 flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-foreground">Response required</div>
                  <div className="text-xs text-muted-foreground">Deadline: {nte.responseDeadline}</div>
                </div>
                {nte.status === 'Pending Explanation' && (
                  <button onClick={() => onUpload(nte)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors">
                    <Upload size={14} /> Submit Letter
                  </button>
                )}
              </div>
            )}
          </div>

          {/* NOD if issued */}
          {nod && (
            <div className="border border-orange-200 rounded-xl overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2.5 bg-orange-50 border-b border-orange-200">
                <Gavel size={14} className="text-orange-700" />
                <span className="text-sm font-bold text-orange-900">Notice of Decision</span>
                <span className={`ml-auto text-xs font-bold px-2.5 py-0.5 rounded-full ${
                  nod.decision === 'Exonerated' ? 'bg-emerald-100 text-emerald-800' :
                  nod.decision === 'Dismissal' ? 'bg-red-100 text-red-800' :
                  nod.decision === 'Suspension' ? 'bg-orange-100 text-orange-800' : 'bg-amber-100 text-amber-800'
                }`}>{nod.decision}{nod.suspensionDays ? ` — ${nod.suspensionDays} days` : ''}</span>
              </div>
              <div className="px-4 py-3 space-y-2">
                <div className="text-xs text-muted-foreground">Effective {nod.effectiveDate} · Issued by {nod.issuedBy} on {nod.issuedDate}</div>
                <p className="text-sm text-foreground leading-relaxed">{nod.details}</p>
                {!nod.acknowledgedAt && (
                  <div className="pt-2">
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors">
                      <CheckCircle2 size={14} /> I have read and understood this Decision
                    </button>
                  </div>
                )}
                {nod.acknowledgedAt && (
                  <div className="text-xs text-emerald-700 font-bold">✓ You acknowledged receipt on {nod.acknowledgedAt}</div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export function MyHRCases() {
  const [cases, setCases] = useState<NTERecord[]>([
    {
      id: 'NTE-DEMO-001', employeeId: MY_EMPLOYEE_ID, employeeName: 'Juan dela Cruz', department: 'Engineering',
      issuedBy: 'Sofia Garcia', issuedByRole: 'admin', assignedTo: 'Sofia Garcia',
      issuedDate: '2026-06-10', incidentDate: '2026-06-04', incidentType: 'Absenteeism Without Leave',
      description: 'You were recorded absent on June 4, 2026 without filing a leave application or notifying your supervisor. Please explain in writing the circumstances of your absence within the prescribed period.',
      responseDeadline: '2026-06-18', status: 'Pending Explanation', escalationRequired: false, auditLog: [],
    },
  ]);

  const [uploadTarget, setUploadTarget] = useState<NTERecord | null>(null);
  const myNODs = nodRecords.filter(n => n.employeeId === MY_EMPLOYEE_ID);

  function handleSubmit(nteId: string, filename: string) {
    setCases(prev => prev.map(n => n.id === nteId ? {
      ...n, status: 'Explanation Submitted' as const,
      explanationLetter: { filename, submittedDate: new Date().toISOString().slice(0, 10), submittedBy: 'Juan dela Cruz' },
    } : n));
  }

  function handleAcknowledge(nteId: string) {
    setCases(prev => prev.map(n => n.id === nteId ? { ...n, acknowledgedAt: new Date().toISOString().slice(0, 10) } : n));
  }

  const allEmpty = cases.length === 0 && myNODs.length === 0;

  return (
    <div className="space-y-5 max-w-3xl">
      <div className="flex items-start gap-3 px-4 py-3.5 bg-secondary border border-border rounded-xl">
        <Shield size={15} className="text-accent mt-0.5 flex-shrink-0" />
        <div className="text-sm text-primary">
          All records shown here are <strong>confidential</strong> — visible only to you, your manager, and HR.
          Questions? Contact HR at <strong>hr@corazontraveltours.ph</strong>
        </div>
      </div>

      {allEmpty ? (
        <div className="flex flex-col items-center gap-4 py-20">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
            <CheckCircle2 size={32} className="text-emerald-600" />
          </div>
          <div className="text-center">
            <div className="font-bold text-foreground">No Active HR Cases</div>
            <div className="text-sm text-muted-foreground mt-1">You have no disciplinary cases on record.</div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {cases.map(nte => (
            <CaseCard
              key={nte.id}
              nte={nte}
              nod={myNODs.find(n => n.nteId === nte.id)}
              onUpload={setUploadTarget}
              onAcknowledge={handleAcknowledge}
            />
          ))}
        </div>
      )}

      {uploadTarget && (
        <UploadModal nte={uploadTarget} onClose={() => setUploadTarget(null)} onSubmit={handleSubmit} />
      )}
    </div>
  );
}
