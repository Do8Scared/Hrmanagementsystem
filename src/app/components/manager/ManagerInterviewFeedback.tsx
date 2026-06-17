import { useState } from 'react';
import { Star, Check, X, Send } from 'lucide-react';
import { type Interview, type InterviewFeedback, type FeedbackRecommendation } from '../../data/recruitmentData';
import { useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';

const CRITERIA = [
  { key: 'communicationSkills' as const, label: 'Communication Skills' },
  { key: 'technicalKnowledge' as const, label: 'Technical Knowledge' },
  { key: 'cultureFit' as const, label: 'Culture Fit' },
  { key: 'problemSolving' as const, label: 'Problem Solving' },
];

const EMPTY_FORM = {
  overallImpression: 0,
  communicationSkills: 0,
  technicalKnowledge: 0,
  cultureFit: 0,
  problemSolving: 0,
  strengths: '',
  areasOfConcern: '',
  recommendation: '' as FeedbackRecommendation | '',
};

export function ManagerInterviewFeedback() {
  const [myInterviews, setMyInterviews] = useState<Interview[]>([]);
  const [feedbacks, setFeedbacks] = useState<InterviewFeedback[]>([]);

  useEffect(() => {
    supabase.from('interviews').select('*').eq('interviewer', 'Maria Santos').then(({ data }) => {
      if (data) {
        const mapped = data.map((r: any) => ({
          id: r.id, applicantId: r.applicantid, applicantName: r.applicantname,
          jobTitle: r.jobtitle, date: r.date, time: r.time, format: r.format,
          interviewer: r.interviewer, notes: r.notes, status: r.status,
        }));
        setMyInterviews(mapped as Interview[]);
      }
    });
    supabase.from('interview_feedbacks').select('*').eq('evaluatorname', 'Maria Santos').then(({ data }) => {
      if (data) {
        const mapped = data.map((r: any) => ({
          id: r.id, applicantId: r.applicantid, applicantName: r.applicantname,
          position: r.position, interviewerId: r.interviewerid,
          evaluatorName: r.evaluatorname, overallImpression: r.overallimpression,
          communicationSkills: r.communicationskills, technicalKnowledge: r.technicalknowledge,
          cultureFit: r.culturefit, problemSolving: r.problemsolving,
          strengths: r.strengths, areasOfConcern: r.areasofconcern,
          recommendation: r.recommendation, submittedDate: r.submitteddate,
        }));
        setFeedbacks(mapped as InterviewFeedback[]);
      }
    });
  }, []);
  const [activeApplicant, setActiveApplicant] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitted, setSubmitted] = useState<string[]>([]);

  function isSubmitted(applicantId: string) {
    return !!feedbacks.find(f => f.applicantId === applicantId) || submitted.includes(applicantId);
  }

  async function handleSubmit(interview: Interview) {
    if (!form.recommendation || form.overallImpression === 0) return;
    // Map camelCase to DB lowercase
    const newFb = {
      applicantid: interview.applicantId,
      applicantname: interview.applicantName,
      position: interview.jobTitle,
      interviewerid: 'EMP001',
      evaluatorname: 'Maria Santos',
      overallimpression: form.overallImpression,
      communicationskills: form.communicationSkills,
      technicalknowledge: form.technicalKnowledge,
      culturefit: form.cultureFit,
      problemsolving: form.problemSolving,
      strengths: form.strengths,
      areasofconcern: form.areasOfConcern,
      recommendation: form.recommendation as FeedbackRecommendation,
      submitteddate: new Date().toISOString().split('T')[0],
    };
    const { data } = await supabase.from('interview_feedbacks').insert(newFb).select().single();
    if (data) {
      const mapped: InterviewFeedback = {
        id: data.id, applicantId: data.applicantid, applicantName: data.applicantname,
        position: data.position, interviewerId: data.interviewerid,
        evaluatorName: data.evaluatorname, overallImpression: data.overallimpression,
        communicationSkills: data.communicationskills, technicalKnowledge: data.technicalknowledge,
        cultureFit: data.culturefit, problemSolving: data.problemsolving,
        strengths: data.strengths, areasOfConcern: data.areasofconcern,
        recommendation: data.recommendation, submittedDate: data.submitteddate,
      };
      setFeedbacks(p => [...p, mapped]);
    }
    setSubmitted(p => [...p, interview.applicantId]);
    setActiveApplicant(null);
    setForm(EMPTY_FORM);
  }

  const activeInterview = myInterviews.find(i => i.applicantId === activeApplicant);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-semibold text-foreground">Interview Feedback</h2>
        <p className="text-xs text-muted-foreground mt-0.5">Submit feedback for applicants you've interviewed.</p>
      </div>

      {/* Applicant List */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-secondary/40">
              {['Applicant', 'Position', 'Interview Date & Time', 'Format', 'Feedback Status', 'Action'].map(col => (
                <th key={col} className="text-left text-xs font-semibold text-muted-foreground px-5 py-3">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {myInterviews.map((iv, i) => {
              const done = isSubmitted(iv.applicantId);
              return (
                <tr key={iv.id} className={`border-b border-border/50 hover:bg-secondary/20 ${i % 2 !== 0 ? 'bg-secondary/10' : ''}`}>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                        <span className="text-white text-xs font-semibold">{iv.applicantName.split(' ').map(n => n[0]).join('').slice(0, 2)}</span>
                      </div>
                      <span className="text-sm font-medium text-foreground">{iv.applicantName}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-xs text-muted-foreground">{iv.jobTitle}</td>
                  <td className="px-5 py-3 text-xs text-foreground">{iv.date} · {iv.time}</td>
                  <td className="px-5 py-3 text-xs text-foreground">{iv.format}</td>
                  <td className="px-5 py-3">
                    {done ? (
                      <span className="flex items-center gap-1.5 text-xs text-emerald-700 font-medium bg-emerald-50 px-2.5 py-1 rounded-full w-fit">
                        <Check size={12} /> Feedback Submitted
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-xs text-amber-700 font-medium bg-amber-50 px-2.5 py-1 rounded-full w-fit">
                        Pending Feedback
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    {!done && iv.status === 'Done' && (
                      <button
                        onClick={() => { setActiveApplicant(iv.applicantId); setForm(EMPTY_FORM); }}
                        className="px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-medium hover:bg-primary/90 transition-colors"
                      >
                        Submit Feedback
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Feedback Form Modal */}
      {activeInterview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setActiveApplicant(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-5 border-b border-border">
              <div>
                <h3 className="font-semibold text-foreground">Interview Feedback Form</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Applicant: <strong>{activeInterview.applicantName}</strong> · {activeInterview.jobTitle}</p>
              </div>
              <button onClick={() => setActiveApplicant(null)} className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-5">
              {/* Overall Impression */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Overall Impression</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(v => (
                    <button key={v} type="button" onClick={() => setForm(f => ({ ...f, overallImpression: v }))}>
                      <Star size={28} className={v <= form.overallImpression ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'} />
                    </button>
                  ))}
                  {form.overallImpression > 0 && <span className="ml-2 text-sm text-muted-foreground self-center">{['', 'Poor', 'Below Average', 'Average', 'Good', 'Excellent'][form.overallImpression]}</span>}
                </div>
              </div>

              {/* Criteria */}
              <div className="space-y-4">
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">Criteria Ratings</label>
                {CRITERIA.map(c => (
                  <div key={c.key}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-foreground">{c.label}</span>
                      <span className="text-xs text-muted-foreground">{form[c.key]}/5</span>
                    </div>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(v => (
                        <button key={v} type="button" onClick={() => setForm(f => ({ ...f, [c.key]: v }))}>
                          <Star size={20} className={v <= form[c.key] ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'} />
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Strengths</label>
                <textarea value={form.strengths} onChange={e => setForm(f => ({ ...f, strengths: e.target.value }))} rows={3} placeholder="What did the applicant do well?" className="w-full px-3 py-2.5 bg-secondary rounded-lg text-sm border-0 outline-none resize-none text-foreground placeholder:text-muted-foreground" />
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Areas of Concern</label>
                <textarea value={form.areasOfConcern} onChange={e => setForm(f => ({ ...f, areasOfConcern: e.target.value }))} rows={3} placeholder="What areas need improvement?" className="w-full px-3 py-2.5 bg-secondary rounded-lg text-sm border-0 outline-none resize-none text-foreground placeholder:text-muted-foreground" />
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-2">Recommendation</label>
                <div className="flex gap-2">
                  {(['Hire', 'For Further Interview', 'Reject'] as FeedbackRecommendation[]).map(r => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setForm(f => ({ ...f, recommendation: r }))}
                      className={`flex-1 py-2 rounded-xl text-xs font-medium border transition-all ${form.recommendation === r
                        ? r === 'Hire' ? 'bg-emerald-600 text-white border-emerald-600'
                          : r === 'Reject' ? 'bg-red-500 text-white border-red-500'
                          : 'bg-primary text-white border-primary'
                        : 'border-border text-muted-foreground hover:border-primary/40'}`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 pb-5">
              <button onClick={() => setActiveApplicant(null)} className="px-4 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:bg-secondary">Cancel</button>
              <button
                onClick={() => handleSubmit(activeInterview)}
                disabled={!form.recommendation || form.overallImpression === 0}
                className="flex items-center gap-2 px-5 py-2 rounded-lg text-white text-sm font-medium transition-all disabled:opacity-50"
                style={{ background: '#1E2A4A' }}
              >
                <Send size={14} /> Submit Feedback
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
