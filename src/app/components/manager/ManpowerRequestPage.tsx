import { useState } from 'react';
import { Send, Save, Eye, X, ChevronRight, Check, Clock, AlertCircle } from 'lucide-react';
import { type ManpowerRequest, type EmploymentType, type UrgencyLevel } from '../../data/recruitmentData';
import { StatusBadge } from '../StatusBadge';
import { useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';

const urgencyColor: Record<UrgencyLevel, string> = {
  Low: 'bg-gray-100 text-gray-600',
  Medium: 'bg-amber-50 text-amber-700',
  High: 'bg-orange-50 text-orange-700',
  Critical: 'bg-red-50 text-red-600',
};

type TimelineStep = 'Submitted' | 'Under Review' | 'Approved' | 'Rejected' | 'Published';

const TIMELINE_STEPS: TimelineStep[] = ['Submitted', 'Under Review', 'Approved', 'Published'];

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

export function ManpowerRequestPage() {
  const [requests, setRequests] = useState<ManpowerRequest[]>([]);
  useEffect(() => {
    supabase.from('manpower_requests').select('*').eq('requestingmanager', 'Maria Santos').then(({ data }) => {
      if (data) {
        const mapped = data.map((r: any) => ({
          id: r.id, department: r.department, requestingManager: r.requestingmanager,
          positionTitle: r.positiontitle, headcount: r.headcount, dateRequested: r.daterequested,
          status: r.status, employmentType: r.employmenttype, jobDescription: r.jobdescription,
          qualifications: r.qualifications, urgency: r.urgency, justification: r.justification,
          preferredStartDate: r.preferredstartdate,
        }));
        setRequests(mapped as ManpowerRequest[]);
      }
    });
  }, []);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitted, setSubmitted] = useState(false);
  const [savedDraft, setSavedDraft] = useState(false);
  const [viewRequest, setViewRequest] = useState<ManpowerRequest | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.positionTitle) return;
    // Map camelCase to DB lowercase
    const newReq = {
      department: 'Engineering',
      requestingmanager: 'Maria Santos',
      positiontitle: form.positionTitle,
      headcount: Number(form.headcount),
      daterequested: new Date().toISOString().split('T')[0],
      status: 'Pending',
      employmenttype: form.employmentType,
      jobdescription: form.jobDescription,
      qualifications: form.qualifications,
      urgency: form.urgency,
      justification: form.justification,
      preferredstartdate: form.preferredStartDate || null,
    };
    const { data } = await supabase.from('manpower_requests').insert(newReq).select().single();
    if (data) {
      const mapped: ManpowerRequest = {
        id: data.id, department: data.department, requestingManager: data.requestingmanager,
        positionTitle: data.positiontitle, headcount: data.headcount, dateRequested: data.daterequested,
        status: data.status, employmentType: data.employmenttype, jobDescription: data.jobdescription,
        qualifications: data.qualifications, urgency: data.urgency, justification: data.justification,
        preferredStartDate: data.preferredstartdate,
      };
      setRequests(prev => [mapped, ...prev]);
    }
    setForm(EMPTY_FORM);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  }

  function getTimelineStep(status: string): number {
    if (status === 'Rejected') return -1;
    if (status === 'Pending') return 1;
    if (status === 'Approved') return 2;
    return 3;
  }

  const textArea = "w-full px-3 py-2.5 bg-[#F7F8FA] border border-[#E5E7EB] rounded-xl text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/20 resize-none placeholder:text-muted-foreground";
  const inputCls = "w-full px-3 py-2.5 bg-[#F7F8FA] border border-[#E5E7EB] rounded-xl text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground";

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
              <Check size={16} className="flex-shrink-0" /> Request submitted successfully! HR will review and respond shortly.
            </div>
          )}
          {savedDraft && (
            <div className="flex items-center gap-3 px-4 py-3 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-700">
              <Save size={16} className="flex-shrink-0" /> Draft saved successfully.
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Department</label>
              <input value="Engineering" readOnly className={inputCls + ' bg-gray-50 text-muted-foreground cursor-not-allowed'} />
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Position / Role Title <span className="text-red-500">*</span></label>
              <input value={form.positionTitle} onChange={e => setForm(f => ({ ...f, positionTitle: e.target.value }))} placeholder="e.g. Senior React Developer" className={inputCls} required />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Employment Type</label>
              <select value={form.employmentType} onChange={e => setForm(f => ({ ...f, employmentType: e.target.value as EmploymentType }))} className={inputCls + ' cursor-pointer'}>
                {(['Full Time', 'Part Time', 'Contractual', 'Internship'] as EmploymentType[]).map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Number of Headcount Needed</label>
              <input type="number" min="1" value={form.headcount} onChange={e => setForm(f => ({ ...f, headcount: e.target.value }))} className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Preferred Start Date</label>
              <input type="date" value={form.preferredStartDate} onChange={e => setForm(f => ({ ...f, preferredStartDate: e.target.value }))} className={inputCls} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">Job Description</label>
            <textarea value={form.jobDescription} onChange={e => setForm(f => ({ ...f, jobDescription: e.target.value }))} rows={4} placeholder="Describe the role, key responsibilities, and day-to-day tasks..." className={textArea} />
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">Required Qualifications</label>
            <textarea value={form.qualifications} onChange={e => setForm(f => ({ ...f, qualifications: e.target.value }))} rows={3} placeholder="List required education, skills, certifications, and experience..." className={textArea} />
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">Justification / Reason for Request</label>
            <textarea value={form.justification} onChange={e => setForm(f => ({ ...f, justification: e.target.value }))} rows={3} placeholder="Explain why this position is needed at this time..." className={textArea} />
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-2">Urgency Level</label>
            <div className="flex gap-2">
              {(['Low', 'Medium', 'High', 'Critical'] as UrgencyLevel[]).map(u => (
                <button
                  key={u}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, urgency: u }))}
                  className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-all ${form.urgency === u ? 'border-primary bg-primary text-white' : 'border-border bg-secondary text-muted-foreground hover:border-primary/40'}`}
                >
                  {u}
                  {form.urgency === u && <span className={`ml-2 inline-block w-2 h-2 rounded-full ${u === 'Critical' ? 'bg-red-300' : u === 'High' ? 'bg-orange-300' : u === 'Medium' ? 'bg-amber-300' : 'bg-gray-400'}`} />}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => { setSavedDraft(true); setTimeout(() => setSavedDraft(false), 3000); }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-secondary transition-colors"
            >
              <Save size={15} /> Save as Draft
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-white text-sm font-medium transition-all hover:opacity-90"
              style={{ background: '#1E2A4A', boxShadow: '0 4px 14px rgba(30,42,74,0.3)' }}
            >
              <Send size={15} /> Submit Request
            </button>
          </div>
        </form>
      </div>

      {/* My Requests History */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h3 className="font-semibold text-foreground">My Request History</h3>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-secondary/40">
              {['Request ID', 'Position', 'Headcount', 'Date Submitted', 'Status', 'Actions'].map(col => (
                <th key={col} className="text-left text-xs font-semibold text-muted-foreground px-5 py-3">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {requests.map((r, i) => (
              <tr key={r.id} className={`border-b border-border/50 hover:bg-secondary/20 ${i % 2 !== 0 ? 'bg-secondary/10' : ''}`}>
                <td className="px-5 py-3 text-xs font-mono text-primary font-medium">{r.id}</td>
                <td className="px-5 py-3 text-sm font-medium text-foreground">{r.positionTitle}</td>
                <td className="px-5 py-3 text-sm text-foreground">{r.headcount}</td>
                <td className="px-5 py-3 text-xs text-muted-foreground">{r.dateRequested}</td>
                <td className="px-5 py-3"><StatusBadge status={r.status} /></td>
                <td className="px-5 py-3">
                  <button onClick={() => setViewRequest(r)} className="flex items-center gap-1 px-2.5 py-1 rounded text-xs border border-border text-muted-foreground hover:bg-secondary">
                    <Eye size={12} /> View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View Request Detail Modal with Timeline */}
      {viewRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setViewRequest(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-5 border-b border-border">
              <div>
                <span className="text-xs font-mono text-primary">{viewRequest.id}</span>
                <h3 className="font-semibold text-foreground mt-0.5">{viewRequest.positionTitle}</h3>
              </div>
              <button onClick={() => setViewRequest(null)} className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-5">
              {/* Status Timeline */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Request Timeline</p>
                <div className="flex items-center">
                  {(viewRequest.status === 'Rejected' ? ['Submitted', 'Under Review', 'Rejected'] : ['Submitted', 'Under Review', 'Approved', 'Published']).map((step, idx, arr) => {
                    const activeStep = getTimelineStep(viewRequest.status);
                    const isActive = idx <= activeStep;
                    const isCurrent = idx === activeStep;
                    const isRejected = step === 'Rejected';
                    return (
                      <div key={step} className="flex items-center flex-1 last:flex-none">
                        <div className="flex flex-col items-center">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${isRejected ? 'bg-red-500 text-white' : isActive ? 'bg-primary text-white' : 'bg-secondary text-muted-foreground'}`}>
                            {isRejected ? <X size={12} /> : isActive ? <Check size={12} /> : <span>{idx + 1}</span>}
                          </div>
                          <span className={`text-xs mt-1 text-center ${isCurrent ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>{step}</span>
                        </div>
                        {idx < arr.length - 1 && <div className={`flex-1 h-0.5 mx-1 ${isActive && idx < activeStep ? 'bg-primary' : 'bg-secondary'}`} />}
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
                  { l: 'Preferred Start', v: viewRequest.preferredStartDate },
                ].map(f => (
                  <div key={f.l}><span className="text-xs text-muted-foreground">{f.l}</span><div className="text-sm font-medium text-foreground mt-0.5">{f.v}</div></div>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Urgency:</span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${urgencyColor[viewRequest.urgency]}`}>{viewRequest.urgency}</span>
              </div>
              <div><span className="text-xs text-muted-foreground">Job Description</span><p className="text-sm text-foreground mt-1 leading-relaxed">{viewRequest.jobDescription}</p></div>
              <div><span className="text-xs text-muted-foreground">Qualifications</span><p className="text-sm text-foreground mt-1 leading-relaxed">{viewRequest.qualifications}</p></div>
              <div><span className="text-xs text-muted-foreground">Justification</span><p className="text-sm text-foreground mt-1 leading-relaxed">{viewRequest.justification}</p></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
