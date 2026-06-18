import { useState } from 'react';
import { Plus, Eye, Check, X, FileText, ChevronRight, ChevronLeft, Star, Paperclip, ArrowRight, Calendar, Video, MapPin, Send, Briefcase } from 'lucide-react';
import {
  APPLICANT_STAGES,
  type ManpowerRequest, type JobPosting, type Applicant, type Interview, type InterviewFeedback,
  type ApplicantStage, type EmploymentType, type ManpowerRequestStatus,
} from '../../data/recruitmentData';
import { useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { StatusBadge } from '../StatusBadge';

type Tab = 'inbox' | 'postings' | 'tracker' | 'scheduling' | 'feedback';

const TABS: { id: Tab; label: string }[] = [
  { id: 'inbox', label: 'Manpower Request Inbox' },
  { id: 'postings', label: 'Job Postings' },
  { id: 'tracker', label: 'Applicant Tracker' },
  { id: 'scheduling', label: 'Interview Scheduling' },
  { id: 'feedback', label: 'Interview Feedback' },
];

const urgencyColor: Record<string, string> = {
  Low: 'bg-gray-100 text-gray-600',
  Medium: 'bg-amber-50 text-amber-700',
  High: 'bg-orange-50 text-orange-700',
  Critical: 'bg-red-50 text-red-600',
};

const stageColor: Record<ApplicantStage, string> = {
  Applied: 'bg-gray-100 text-gray-600',
  Shortlisted: 'bg-blue-50 text-blue-700',
  'Interview Scheduled': 'bg-purple-50 text-purple-700',
  Interviewed: 'bg-amber-50 text-amber-700',
  'Job Offer': 'bg-orange-50 text-orange-700',
  Hired: 'bg-emerald-50 text-emerald-700',
  Rejected: 'bg-red-50 text-red-600',
};

const interviewStatusColor: Record<string, string> = {
  Upcoming: 'bg-blue-100 text-blue-700',
  Done: 'bg-emerald-100 text-emerald-700',
  Cancelled: 'bg-red-100 text-red-600',
};

export function JobPostingManagement() {
  const [tab, setTab] = useState<Tab>('inbox');
  const [mrList, setMrList] = useState<ManpowerRequest[]>([]);
  const [jpList, setJpList] = useState<JobPosting[]>([]);
  const [appList, setAppList] = useState<Applicant[]>([]);
  const [intList, setIntList] = useState<Interview[]>([]);
  const [fbList, setFbList] = useState<InterviewFeedback[]>([]);

  useEffect(() => {
    async function fetchData() {
      const [mrRes, jpRes, appRes, intRes, fbRes] = await Promise.all([
        supabase.from('manpower_requests').select('*'),
        supabase.from('job_postings').select('*'),
        supabase.from('applicants').select('*'),
        supabase.from('interviews').select('*'),
        supabase.from('interview_feedbacks').select('*')
      ]);
      // Map DB (all lowercase) to TypeScript interface (camelCase)
      if (mrRes.data) setMrList(mrRes.data.map((r: any) => ({
        id: r.id, department: r.department, requestingManager: r.requestingmanager,
        positionTitle: r.positiontitle, headcount: r.headcount, dateRequested: r.daterequested,
        status: r.status, employmentType: r.employmenttype, jobDescription: r.jobdescription,
        qualifications: r.qualifications, urgency: r.urgency, justification: r.justification,
        preferredStartDate: r.preferredstartdate,
      })));
      if (jpRes.data) setJpList(jpRes.data.map((r: any) => ({
        id: r.id, title: r.title, department: r.department, datePosted: r.dateposted,
        deadline: r.deadline, applicantCount: r.applicantcount, status: r.status,
        description: r.description, qualifications: r.qualifications, slots: r.slots,
        employmentType: r.employmenttype, publishToBoard: r.publishtoboard,
        manpowerRequestId: r.manpowerrequestid,
      })));
      if (appRes.data) setAppList(appRes.data.map((r: any) => ({
        id: r.id, name: r.name, email: r.email, phone: r.phone,
        jobPostingId: r.jobpostingid, jobTitle: r.jobtitle,
        applicationDate: r.applicationdate, stage: r.stage, resumeFile: r.resumefile,
      })));
      if (intRes.data) setIntList(intRes.data.map((r: any) => ({
        id: r.id, applicantId: r.applicantid, applicantName: r.applicantname,
        jobTitle: r.jobtitle, date: r.date, time: r.time, format: r.format,
        interviewer: r.interviewer, notes: r.notes, status: r.status,
      })));
      if (fbRes.data) setFbList(fbRes.data.map((r: any) => ({
        id: r.id, applicantId: r.applicantid, applicantName: r.applicantname,
        position: r.position, interviewerId: r.interviewerid,
        evaluatorName: r.evaluatorname, overallImpression: r.overallimpression,
        communicationSkills: r.communicationskills, technicalKnowledge: r.technicalknowledge,
        cultureFit: r.culturefit, problemSolving: r.problemsolving,
        strengths: r.strengths, areasOfConcern: r.areasofconcern,
        recommendation: r.recommendation, submittedDate: r.submitteddate,
      })));
    }
    fetchData();
  }, []);

  return (
    <div className="space-y-5">
      {/* Tabs */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="flex border-b border-border overflow-x-auto">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-5 py-3.5 text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-px ${tab === t.id ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="p-5">
          {tab === 'inbox' && <ManpowerRequestInbox mrList={mrList} setMrList={setMrList} jpList={jpList} setJpList={setJpList} />}
          {tab === 'postings' && <JobPostingsList jpList={jpList} setJpList={setJpList} />}
          {tab === 'tracker' && <ApplicantTracker appList={appList} setAppList={setAppList} jpList={jpList} setTab={setTab} />}
          {tab === 'scheduling' && <InterviewScheduling intList={intList} setIntList={setIntList} appList={appList} />}
          {tab === 'feedback' && <FeedbackAdmin fbList={fbList} setFbList={setFbList} intList={intList} setIntList={setIntList} appList={appList} />}
        </div>
      </div>
    </div>
  );
}

// ─── Manpower Request Inbox ────────────────────────────────────────────────
function ManpowerRequestInbox({ mrList, setMrList, jpList, setJpList }: {
  mrList: ManpowerRequest[]; setMrList: React.Dispatch<React.SetStateAction<ManpowerRequest[]>>;
  jpList: JobPosting[]; setJpList: React.Dispatch<React.SetStateAction<JobPosting[]>>;
}) {
  const [selected, setSelected] = useState<ManpowerRequest | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);

  async function handleApprove(mr: ManpowerRequest) {
    await supabase.from('manpower_requests').update({ status: 'Approved' }).eq('id', mr.id);
    setMrList(prev => prev.map(r => r.id === mr.id ? { ...r, status: 'Approved' } : r));
    // Map camelCase to DB lowercase
    const newPosting = {
      title: mr.positionTitle,
      department: mr.department,
      dateposted: '2026-06-16',
      deadline: mr.preferredStartDate || null,
      applicantcount: 0,
      status: 'Open',
      description: mr.jobDescription,
      qualifications: mr.qualifications,
      slots: mr.headcount,
      employmenttype: mr.employmentType,
      publishtoboard: true,
      manpowerrequestid: mr.id,
    };
    const { data } = await supabase.from('job_postings').insert(newPosting).select().single();
    if (data) {
      const mapped: JobPosting = {
        id: data.id, title: data.title, department: data.department,
        datePosted: data.dateposted, deadline: data.deadline,
        applicantCount: data.applicantcount, status: data.status,
        description: data.description, qualifications: data.qualifications,
        slots: data.slots, employmentType: data.employmenttype,
        publishToBoard: data.publishtoboard, manpowerRequestId: data.manpowerrequestid,
      };
      setJpList(prev => [mapped, ...prev]);
    }
    setSelected(null);
  }

  async function handleReject(mr: ManpowerRequest) {
    if (!rejectReason) return;
    await supabase.from('manpower_requests').update({ status: 'Rejected' }).eq('id', mr.id);
    setMrList(prev => prev.map(r => r.id === mr.id ? { ...r, status: 'Rejected' } : r));
    setShowRejectInput(false);
    setRejectReason('');
    setSelected(null);
  }

  const statusMap: Record<ManpowerRequestStatus, string> = { Pending: 'Pending', Approved: 'Approved', Rejected: 'Rejected' };

  return (
    <div className="relative">
      <div className={`transition-all ${selected ? 'pr-96' : ''}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">Manpower Request Inbox</h3>
          <span className="text-xs text-muted-foreground">{mrList.filter(r => r.status === 'Pending').length} pending</span>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-secondary/40">
              {['Request ID', 'Department', 'Requesting Manager', 'Position', 'Headcount', 'Date', 'Urgency', 'Status', 'Actions'].map(col => (
                <th key={col} className="text-left text-xs font-semibold text-muted-foreground px-3 py-3">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {mrList.map((mr, i) => (
              <tr key={mr.id} className={`border-b border-border/50 hover:bg-secondary/20 transition-colors ${i % 2 !== 0 ? 'bg-secondary/10' : ''}`}>
                <td className="px-3 py-3 text-xs font-mono text-primary font-medium">{mr.id}</td>
                <td className="px-3 py-3 text-xs text-foreground">{mr.department}</td>
                <td className="px-3 py-3 text-xs text-foreground">{mr.requestingManager}</td>
                <td className="px-3 py-3 text-xs font-medium text-foreground">{mr.positionTitle}</td>
                <td className="px-3 py-3 text-xs text-center text-foreground">{mr.headcount}</td>
                <td className="px-3 py-3 text-xs text-muted-foreground">{mr.dateRequested}</td>
                <td className="px-3 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${urgencyColor[mr.urgency]}`}>{mr.urgency}</span>
                </td>
                <td className="px-3 py-3"><StatusBadge status={statusMap[mr.status]} /></td>
                <td className="px-3 py-3">
                  <div className="flex gap-1">
                    <button onClick={() => setSelected(mr)} className="px-2 py-1 rounded text-xs border border-border text-muted-foreground hover:bg-secondary transition-colors flex items-center gap-1"><Eye size={12} /> View</button>
                    {mr.status === 'Pending' && (
                      <>
                        <button onClick={() => handleApprove(mr)} className="px-2 py-1 rounded text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors flex items-center gap-1"><Check size={12} /></button>
                        <button onClick={() => { setSelected(mr); setShowRejectInput(true); }} className="px-2 py-1 rounded text-xs bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-colors flex items-center gap-1"><X size={12} /></button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Side Drawer */}
      {selected && (
        <div className="absolute right-0 top-0 w-96 h-full bg-white border-l border-border rounded-r-xl overflow-y-auto" style={{ boxShadow: '-4px 0 20px rgba(0,0,0,0.06)' }}>
          <div className="flex items-center justify-between px-5 py-4 border-b border-border sticky top-0 bg-white z-10">
            <div>
              <span className="text-xs font-mono text-primary">{selected.id}</span>
              <h4 className="font-semibold text-foreground text-sm mt-0.5">{selected.positionTitle}</h4>
            </div>
            <button onClick={() => { setSelected(null); setShowRejectInput(false); }} className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground"><X size={16} /></button>
          </div>
          <div className="p-5 space-y-4">
            <InfoRow label="Department" value={selected.department} />
            <InfoRow label="Requesting Manager" value={selected.requestingManager} />
            <InfoRow label="Employment Type" value={selected.employmentType} />
            <InfoRow label="Headcount Needed" value={`${selected.headcount} slot${selected.headcount > 1 ? 's' : ''}`} />
            <InfoRow label="Preferred Start Date" value={selected.preferredStartDate} />
            <div>
              <span className="text-xs text-muted-foreground">Urgency</span>
              <div className="mt-1"><span className={`px-2.5 py-1 rounded-full text-xs font-medium ${urgencyColor[selected.urgency]}`}>{selected.urgency}</span></div>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Job Description</span>
              <p className="mt-1 text-sm text-foreground leading-relaxed">{selected.jobDescription}</p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Qualifications</span>
              <p className="mt-1 text-sm text-foreground leading-relaxed">{selected.qualifications}</p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Justification</span>
              <p className="mt-1 text-sm text-foreground leading-relaxed">{selected.justification}</p>
            </div>

            {selected.status === 'Pending' && (
              <div className="space-y-2 pt-2 border-t border-border">
                {!showRejectInput ? (
                  <div className="flex gap-2">
                    <button onClick={() => handleApprove(selected)} className="flex-1 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                      <Check size={15} /> Approve & Publish
                    </button>
                    <button onClick={() => setShowRejectInput(true)} className="flex-1 py-2 rounded-lg border border-red-200 text-red-600 text-sm font-medium hover:bg-red-50 transition-colors flex items-center justify-center gap-2">
                      <X size={15} /> Reject
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)} placeholder="Enter rejection reason..." rows={3} className="w-full px-3 py-2 bg-secondary rounded-lg text-sm border-0 outline-none resize-none text-foreground placeholder:text-muted-foreground" />
                    <div className="flex gap-2">
                      <button onClick={() => { setShowRejectInput(false); setRejectReason(''); }} className="flex-1 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:bg-secondary">Cancel</button>
                      <button onClick={() => handleReject(selected)} className="flex-1 py-2 rounded-lg bg-destructive text-white text-sm font-medium hover:bg-destructive/90">Confirm Reject</button>
                    </div>
                  </div>
                )}
              </div>
            )}
            {selected.status !== 'Pending' && (
              <div className="pt-2 border-t border-border">
                <StatusBadge status={selected.status} size="md" />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Job Postings List ────────────────────────────────────────────────────
function JobPostingsList({ jpList, setJpList }: { jpList: JobPosting[]; setJpList: React.Dispatch<React.SetStateAction<JobPosting[]>> }) {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', department: '', employmentType: 'Full Time' as EmploymentType, description: '', qualifications: '', slots: '1', deadline: '', publishToBoard: true });

  async function handleAdd() {
    if (!form.title || !form.department) return;
    // Map camelCase to DB lowercase
    const newJp = {
      title: form.title, department: form.department,
      dateposted: form.publishToBoard ? '2026-06-16' : null,
      deadline: form.deadline || null, applicantcount: 0,
      status: form.publishToBoard ? 'Open' : 'Draft',
      description: form.description, qualifications: form.qualifications,
      slots: Number(form.slots), employmenttype: form.employmentType,
      publishtoboard: form.publishToBoard,
    };
    const { data } = await supabase.from('job_postings').insert(newJp).select().single();
    if (data) {
      const mapped: JobPosting = {
        id: data.id, title: data.title, department: data.department,
        datePosted: data.dateposted, deadline: data.deadline,
        applicantCount: data.applicantcount, status: data.status,
        description: data.description, qualifications: data.qualifications,
        slots: data.slots, employmentType: data.employmenttype,
        publishToBoard: data.publishtoboard, manpowerRequestId: data.manpowerrequestid,
      };
      setJpList(prev => [mapped, ...prev]);
    }
    setShowModal(false);
    setForm({ title: '', department: '', employmentType: 'Full Time', description: '', qualifications: '', slots: '1', deadline: '', publishToBoard: true });
  }

  const statusTag: Record<string, string> = { Open: 'bg-emerald-50 text-emerald-700', Closed: 'bg-gray-100 text-gray-600', Draft: 'bg-amber-50 text-amber-700' };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">Job Postings</h3>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors">
          <Plus size={15} /> Add Job Posting
        </button>
      </div>
      <table className="w-full">
        <thead>
          <tr className="border-b border-border bg-secondary/40">
            {['Job Title', 'Department', 'Type', 'Date Posted', 'Deadline', 'Applicants', 'Status', 'Actions'].map(col => (
              <th key={col} className="text-left text-xs font-semibold text-muted-foreground px-3 py-3">{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {jpList.map((jp, i) => (
            <tr key={jp.id} className={`border-b border-border/50 hover:bg-secondary/20 ${i % 2 !== 0 ? 'bg-secondary/10' : ''}`}>
              <td className="px-3 py-3 text-sm font-medium text-foreground">{jp.title}</td>
              <td className="px-3 py-3 text-xs text-muted-foreground">{jp.department}</td>
              <td className="px-3 py-3"><span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs">{jp.employmentType}</span></td>
              <td className="px-3 py-3 text-xs text-muted-foreground">{jp.datePosted || '—'}</td>
              <td className="px-3 py-3 text-xs text-muted-foreground">{jp.deadline}</td>
              <td className="px-3 py-3 text-sm font-semibold text-foreground text-center">{jp.applicantCount}</td>
              <td className="px-3 py-3"><span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusTag[jp.status]}`}>{jp.status}</span></td>
              <td className="px-3 py-3">
                <div className="flex gap-1">
                  <button className="px-2 py-1 rounded text-xs border border-border text-muted-foreground hover:bg-secondary">View</button>
                  <button className="px-2 py-1 rounded text-xs border border-border text-muted-foreground hover:bg-secondary">Edit</button>
                  {jp.status === 'Open' && <button onClick={async () => { await supabase.from('job_postings').update({ status: 'Closed' }).eq('id', jp.id); setJpList(p => p.map(j => j.id === jp.id ? { ...j, status: 'Closed' } : j)); }} className="px-2 py-1 rounded text-xs bg-red-50 text-red-600 border border-red-200 hover:bg-red-100">Close</button>}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-5 border-b border-border">
              <h3 className="font-semibold text-foreground">Add Job Posting</h3>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <MField label="Job Title" value={form.title} onChange={v => setForm(f => ({ ...f, title: v }))} placeholder="e.g. Senior Developer" />
                <MField label="Department" value={form.department} onChange={v => setForm(f => ({ ...f, department: v }))} placeholder="e.g. Engineering" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">Employment Type</label>
                  <select value={form.employmentType} onChange={e => setForm(f => ({ ...f, employmentType: e.target.value as EmploymentType }))} className="w-full px-3 py-2.5 bg-secondary rounded-lg text-sm border-0 outline-none cursor-pointer text-foreground">
                    {(['Full Time', 'Part Time', 'Contractual', 'Internship'] as EmploymentType[]).map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <MField label="Number of Slots" value={form.slots} onChange={v => setForm(f => ({ ...f, slots: v }))} type="number" placeholder="1" />
                <MField label="Application Deadline" value={form.deadline} onChange={v => setForm(f => ({ ...f, deadline: v }))} type="date" placeholder="" />
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Job Description</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={4} placeholder="Describe the role, responsibilities, and expectations..." className="w-full px-3 py-2.5 bg-secondary rounded-lg text-sm border-0 outline-none resize-none text-foreground placeholder:text-muted-foreground" />
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Qualifications</label>
                <textarea value={form.qualifications} onChange={e => setForm(f => ({ ...f, qualifications: e.target.value }))} rows={3} placeholder="List required skills, experience, and certifications..." className="w-full px-3 py-2.5 bg-secondary rounded-lg text-sm border-0 outline-none resize-none text-foreground placeholder:text-muted-foreground" />
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <div onClick={() => setForm(f => ({ ...f, publishToBoard: !f.publishToBoard }))} className={`w-10 h-5 rounded-full transition-colors relative ${form.publishToBoard ? 'bg-primary' : 'bg-gray-300'}`}>
                  <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${form.publishToBoard ? 'left-5' : 'left-0.5'}`} />
                </div>
                <span className="text-sm text-foreground">Publish to Public Job Board</span>
              </label>
            </div>
            <div className="flex justify-end gap-3 px-6 pb-5">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:bg-secondary">Cancel</button>
              <button onClick={handleAdd} className="px-5 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90">Save Posting</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Applicant Tracker (Kanban) ──────────────────────────────────────────
function ApplicantTracker({ appList, setAppList, jpList, setTab }: {
  appList: Applicant[]; setAppList: React.Dispatch<React.SetStateAction<Applicant[]>>;
  jpList: JobPosting[]; setTab: (t: Tab) => void;
}) {
  const [selectedJob, setSelectedJob] = useState(jpList.find(j => j.status === 'Open')?.id ?? jpList[0]?.id);
  const jobApplicants = appList.filter(a => a.jobPostingId === selectedJob);
  const kanbanStages: ApplicantStage[] = ['Applied', 'Shortlisted', 'Interview Scheduled', 'Interviewed', 'Job Offer', 'Hired', 'Rejected'];

  async function moveStage(applicantId: string, direction: 1 | -1) {
    const a = appList.find(app => app.id === applicantId);
    if (!a) return;
    const idx = kanbanStages.indexOf(a.stage);
    const newIdx = Math.max(0, Math.min(kanbanStages.length - 1, idx + direction));
    const newStage = kanbanStages[newIdx];
    await supabase.from('applicants').update({ stage: newStage }).eq('id', applicantId);
    setAppList(prev => prev.map(a => a.id === applicantId ? { ...a, stage: newStage } : a));
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-foreground">Applicant Tracker</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Drag applicants across stages or use arrow buttons</p>
        </div>
        <select value={selectedJob} onChange={e => setSelectedJob(e.target.value)} className="px-3 py-2 bg-secondary rounded-lg text-sm border-0 outline-none text-foreground cursor-pointer">
          {jpList.map(j => <option key={j.id} value={j.id}>{j.title} — {j.department}</option>)}
        </select>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-3">
        {kanbanStages.map(stage => {
          const stageApps = jobApplicants.filter(a => a.stage === stage);
          return (
            <div key={stage} className="flex-shrink-0 w-48">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-muted-foreground truncate">{stage}</span>
                <span className="w-5 h-5 rounded-full bg-secondary text-muted-foreground text-xs flex items-center justify-center font-medium">{stageApps.length}</span>
              </div>
              <div className="space-y-2 min-h-24">
                {stageApps.map(app => (
                  <div key={app.id} className="bg-card border border-border rounded-xl p-3 hover:shadow-sm transition-shadow">
                    <div className="flex items-start justify-between gap-1 mb-1.5">
                      <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-semibold">{app.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</span>
                      </div>
                      <Paperclip size={12} className="text-muted-foreground mt-1 flex-shrink-0" />
                    </div>
                    <div className="text-xs font-medium text-foreground leading-tight">{app.name}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{app.applicationDate}</div>
                    <span className={`inline-block mt-1.5 px-1.5 py-0.5 rounded text-xs font-medium ${stageColor[app.stage]}`}>{app.stage}</span>
                    <div className="flex items-center gap-1 mt-2">
                      <button onClick={() => moveStage(app.id, -1)} disabled={stage === kanbanStages[0]} className="flex-1 py-1 rounded bg-secondary text-xs text-muted-foreground hover:bg-border disabled:opacity-30 transition-colors">←</button>
                      <button onClick={() => moveStage(app.id, 1)} disabled={stage === kanbanStages[kanbanStages.length - 1]} className="flex-1 py-1 rounded bg-secondary text-xs text-muted-foreground hover:bg-border disabled:opacity-30 transition-colors">→</button>
                    </div>
                    {(stage === 'Shortlisted' || stage === 'Applied') && (
                      <button onClick={() => setTab('scheduling')} className="w-full mt-1.5 py-1 rounded bg-blue-50 text-blue-700 text-xs hover:bg-blue-100 transition-colors">Schedule Interview</button>
                    )}
                  </div>
                ))}
                {stageApps.length === 0 && (
                  <div className="h-20 border-2 border-dashed border-border rounded-xl flex items-center justify-center">
                    <span className="text-xs text-muted-foreground">Empty</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Interview Scheduling ────────────────────────────────────────────────
function InterviewScheduling({ intList, setIntList, appList }: {
  intList: Interview[]; setIntList: React.Dispatch<React.SetStateAction<Interview[]>>;
  appList: Applicant[];
}) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ applicantId: '', date: '', time: '10:00', format: 'Virtual' as 'Virtual' | 'On-site', interviewer: '', notes: '' });
  const [showNotif, setShowNotif] = useState<string | null>(null);

  const WEEKDAYS = ['Mon Jun 16', 'Tue Jun 17', 'Wed Jun 18', 'Thu Jun 19', 'Fri Jun 20'];

  async function handleSchedule() {
    if (!form.applicantId || !form.date) return;
    const app = appList.find(a => a.id === form.applicantId);
    if (!app) return;
    // Map camelCase to DB lowercase
    const newInt = {
      applicantid: form.applicantId, applicantname: app.name, jobtitle: app.jobTitle,
      date: form.date, time: form.time, format: form.format, interviewer: form.interviewer,
      notes: form.notes, status: 'Upcoming',
    };
    const { data } = await supabase.from('interviews').insert(newInt).select().single();
    if (data) {
      const mapped: Interview = {
        id: data.id, applicantId: data.applicantid, applicantName: data.applicantname,
        jobTitle: data.jobtitle, date: data.date, time: data.time, format: data.format,
        interviewer: data.interviewer, notes: data.notes, status: data.status,
      };
      setIntList(prev => [mapped, ...prev]);
    }
    setShowNotif(app.name);
    setShowForm(false);
    setForm({ applicantId: '', date: '', time: '10:00', format: 'Virtual', interviewer: '', notes: '' });
    setTimeout(() => setShowNotif(null), 4000);
  }

  return (
    <div className="space-y-5">
      {showNotif && (
        <div className="flex items-center gap-3 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700">
          <Check size={16} className="flex-shrink-0" />
          Interview scheduled for <strong>{showNotif}</strong>. Applicant and interviewer have been notified.
        </div>
      )}

      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground">Interview Scheduling</h3>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors">
          <Plus size={15} /> Schedule Interview
        </button>
      </div>

      {/* Weekly Calendar */}
      <div className="bg-secondary/30 rounded-xl p-4">
        <h4 className="text-sm font-semibold text-foreground mb-3">Week of June 16–20, 2026</h4>
        <div className="grid grid-cols-5 gap-2">
          {WEEKDAYS.map(day => {
            const dayDate = `2026-06-${day.slice(-2).trim()}`;
            const dayInterviews = intList.filter(i => i.date === dayDate || (day === 'Mon Jun 16' && i.date === '2026-06-16') || (day === 'Tue Jun 17' && i.date === '2026-06-17') || (day === 'Wed Jun 18' && i.date === '2026-06-18') || (day === 'Thu Jun 19' && i.date === '2026-06-19') || (day === 'Fri Jun 20' && i.date === '2026-06-20'));
            return (
              <div key={day} className="bg-white rounded-xl p-3 min-h-24">
                <div className="text-xs font-semibold text-foreground mb-2">{day}</div>
                <div className="space-y-1.5">
                  {dayInterviews.map(iv => (
                    <div key={iv.id} className={`px-2 py-1.5 rounded-lg text-xs ${interviewStatusColor[iv.status]}`}>
                      <div className="font-medium truncate">{iv.applicantName}</div>
                      <div className="opacity-70">{iv.time} · {iv.format === 'Virtual' ? <Video size={9} className="inline" /> : <MapPin size={9} className="inline" />} {iv.format}</div>
                    </div>
                  ))}
                  {dayInterviews.length === 0 && <div className="text-xs text-muted-foreground text-center py-2">No interviews</div>}
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border">
          {[{ label: 'Upcoming', c: 'bg-blue-100 text-blue-700' }, { label: 'Done', c: 'bg-emerald-100 text-emerald-700' }, { label: 'Cancelled', c: 'bg-red-100 text-red-600' }].map(s => (
            <span key={s.label} className={`px-2.5 py-0.5 rounded text-xs font-medium ${s.c}`}>{s.label}</span>
          ))}
        </div>
      </div>

      {/* All Interviews Table */}
      <table className="w-full">
        <thead><tr className="border-b border-border bg-secondary/40">
          {['Applicant', 'Position', 'Date & Time', 'Format', 'Interviewer', 'Status', 'Actions'].map(c => (
            <th key={c} className="text-left text-xs font-semibold text-muted-foreground px-3 py-3">{c}</th>
          ))}
        </tr></thead>
        <tbody>
          {intList.map((iv, i) => (
            <tr key={iv.id} className={`border-b border-border/50 hover:bg-secondary/20 ${i % 2 !== 0 ? 'bg-secondary/10' : ''}`}>
              <td className="px-3 py-3 text-sm font-medium text-foreground">{iv.applicantName}</td>
              <td className="px-3 py-3 text-xs text-muted-foreground">{iv.jobTitle}</td>
              <td className="px-3 py-3 text-xs text-foreground">{iv.date} {iv.time}</td>
              <td className="px-3 py-3"><span className="text-xs flex items-center gap-1">{iv.format === 'Virtual' ? <Video size={12} /> : <MapPin size={12} />}{iv.format}</span></td>
              <td className="px-3 py-3 text-xs text-foreground">{iv.interviewer}</td>
              <td className="px-3 py-3"><span className={`px-2 py-0.5 rounded text-xs font-medium ${interviewStatusColor[iv.status]}`}>{iv.status}</span></td>
              <td className="px-3 py-3">
                {iv.status === 'Upcoming' && (
                  <button onClick={async () => { await supabase.from('interviews').update({ status: 'Cancelled' }).eq('id', iv.id); setIntList(p => p.map(x => x.id === iv.id ? { ...x, status: 'Cancelled' } : x)); }} className="px-2 py-1 rounded text-xs bg-red-50 text-red-600 border border-red-200 hover:bg-red-100">Cancel</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Schedule Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-5 border-b border-border">
              <h3 className="font-semibold text-foreground">Schedule an Interview</h3>
              <button onClick={() => setShowForm(false)} className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Applicant</label>
                <select value={form.applicantId} onChange={e => setForm(f => ({ ...f, applicantId: e.target.value }))} className="w-full px-3 py-2.5 bg-secondary rounded-lg text-sm border-0 outline-none cursor-pointer text-foreground">
                  <option value="">Select applicant...</option>
                  {appList.map(a => <option key={a.id} value={a.id}>{a.name} — {a.jobTitle}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <MField label="Interview Date" value={form.date} onChange={v => setForm(f => ({ ...f, date: v }))} type="date" placeholder="" />
                <MField label="Time" value={form.time} onChange={v => setForm(f => ({ ...f, time: v }))} type="time" placeholder="" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">Format</label>
                  <select value={form.format} onChange={e => setForm(f => ({ ...f, format: e.target.value as 'On-site' | 'Virtual' }))} className="w-full px-3 py-2.5 bg-secondary rounded-lg text-sm border-0 outline-none cursor-pointer text-foreground">
                    <option>Virtual</option><option>On-site</option>
                  </select>
                </div>
                <MField label="Interviewer / Panel" value={form.interviewer} onChange={v => setForm(f => ({ ...f, interviewer: v }))} placeholder="e.g. Maria Santos" />
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Notes</label>
                <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2} placeholder="Preparation notes for interviewer..." className="w-full px-3 py-2.5 bg-secondary rounded-lg text-sm border-0 outline-none resize-none text-foreground placeholder:text-muted-foreground" />
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 pb-5">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:bg-secondary">Cancel</button>
              <button onClick={handleSchedule} className="px-5 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90">Confirm Schedule</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Feedback Admin View ─────────────────────────────────────────────────
function FeedbackAdmin({ fbList, setFbList, intList, setIntList, appList }: {
  fbList: InterviewFeedback[]; setFbList: React.Dispatch<React.SetStateAction<InterviewFeedback[]>>;
  intList: Interview[]; setIntList: React.Dispatch<React.SetStateAction<Interview[]>>;
  appList: Applicant[];
}) {
  const [selected, setSelected] = useState<InterviewFeedback | null>(null);
  const doneInterviews = intList.filter(i => i.status === 'Done');

  return (
    <div className="space-y-5">
      <h3 className="font-semibold text-foreground">Interview Feedback</h3>

      {/* Feedback Needed */}
      {doneInterviews.filter(iv => !fbList.find(f => f.applicantId === iv.applicantId)).length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-xs font-semibold text-amber-700 mb-2">Awaiting Feedback from Interviewer</p>
          <div className="space-y-2">
            {doneInterviews.filter(iv => !fbList.find(f => f.applicantId === iv.applicantId)).map(iv => (
              <div key={iv.id} className="flex items-center justify-between bg-white rounded-lg px-3 py-2">
                <div>
                  <span className="text-xs font-medium text-foreground">{iv.applicantName}</span>
                  <span className="text-xs text-muted-foreground ml-2">· {iv.jobTitle} · Interviewed {iv.date}</span>
                </div>
                <span className="text-xs text-amber-600 font-medium">Pending Feedback</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Submitted Feedback */}
      <div className="grid grid-cols-2 gap-4">
        {fbList.map(fb => (
          <div key={fb.id} onClick={() => setSelected(fb)} className="bg-card border border-border rounded-xl p-5 cursor-pointer hover:shadow-md transition-all hover:border-primary/20">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="text-sm font-semibold text-foreground">{fb.applicantName}</div>
                <div className="text-xs text-muted-foreground">{fb.position}</div>
              </div>
              <div className="text-center px-3 py-1.5 bg-emerald-50 rounded-lg">
                <div className="text-lg font-bold text-emerald-700">{fb.overallImpression}</div>
                <div className="text-xs text-muted-foreground">/5</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-3">
              {[
                { label: 'Communication', val: fb.communicationSkills },
                { label: 'Technical', val: fb.technicalKnowledge },
                { label: 'Culture Fit', val: fb.cultureFit },
                { label: 'Problem Solving', val: fb.problemSolving },
              ].map(c => (
                <div key={c.label}>
                  <div className="flex justify-between text-xs mb-0.5">
                    <span className="text-muted-foreground">{c.label}</span>
                    <span className="font-medium text-foreground">{c.val}/5</span>
                  </div>
                  <div className="h-1 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${(c.val / 5) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">By {fb.evaluatorName} · {fb.submittedDate}</span>
              <span className={`px-2 py-0.5 rounded-full font-medium ${fb.recommendation === 'Hire' ? 'bg-emerald-50 text-emerald-700' : fb.recommendation === 'Reject' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-700'}`}>{fb.recommendation}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-5 border-b border-border">
              <h3 className="font-semibold text-foreground">Interview Feedback — {selected.applicantName}</h3>
              <button onClick={() => setSelected(null)} className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <InfoRow label="Position" value={selected.position} />
                <InfoRow label="Evaluator" value={selected.evaluatorName} />
                <InfoRow label="Submitted" value={selected.submittedDate} />
                <div><span className="text-xs text-muted-foreground">Recommendation</span>
                  <div className="mt-1"><span className={`px-2.5 py-1 rounded-full text-xs font-medium ${selected.recommendation === 'Hire' ? 'bg-emerald-50 text-emerald-700' : selected.recommendation === 'Reject' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-700'}`}>{selected.recommendation}</span></div>
                </div>
              </div>
              <div className="space-y-2">
                {[
                  { label: 'Overall Impression', val: selected.overallImpression },
                  { label: 'Communication Skills', val: selected.communicationSkills },
                  { label: 'Technical Knowledge', val: selected.technicalKnowledge },
                  { label: 'Culture Fit', val: selected.cultureFit },
                  { label: 'Problem Solving', val: selected.problemSolving },
                ].map(c => (
                  <div key={c.label} className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-40">{c.label}</span>
                    <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${(c.val / 5) * 100}%` }} />
                    </div>
                    <span className="text-xs font-semibold text-foreground w-8 text-right">{c.val}/5</span>
                  </div>
                ))}
              </div>
              <InfoBlock label="Strengths" value={selected.strengths} />
              <InfoBlock label="Areas of Concern" value={selected.areasOfConcern} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return <div><span className="text-xs text-muted-foreground">{label}</span><div className="text-sm font-medium text-foreground mt-0.5">{value}</div></div>;
}
function InfoBlock({ label, value }: { label: string; value: string }) {
  return <div><span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{label}</span><p className="text-sm text-foreground mt-1 leading-relaxed">{value}</p></div>;
}
function MField({ label, value, onChange, placeholder, type = 'text' }: { label: string; value: string; onChange: (v: string) => void; placeholder: string; type?: string }) {
  return <div><label className="block text-xs font-medium text-foreground mb-1.5">{label}</label><input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="w-full px-3 py-2.5 bg-secondary rounded-lg text-sm border-0 outline-none text-foreground placeholder:text-muted-foreground" /></div>;
}
