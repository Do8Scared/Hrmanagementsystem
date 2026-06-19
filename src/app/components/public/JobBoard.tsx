import { useState } from 'react';
import { Search, Bookmark, Share2, Building2, Clock, X, Upload, CheckCircle2, ArrowLeft, ChevronRight } from 'lucide-react';
import { jobPostings, type JobPosting, type EmploymentType } from '../../data/recruitmentData';

type FilterType = 'All' | EmploymentType | 'Saved Jobs';
const FILTERS: FilterType[] = ['All', 'Full Time', 'Part Time', 'Contractual', 'Internship', 'Saved Jobs'];

const typeColor: Record<string, string> = {
  'Full Time': 'bg-secondary text-accent',
  'Part Time': 'bg-purple-50 text-purple-700',
  'Contractual': 'bg-amber-50 text-amber-700',
  'Internship': 'bg-emerald-50 text-emerald-700',
};

const publicJobs = jobPostings.filter(j => j.publishToBoard && j.status !== 'Draft');

export function JobBoard({ onBack }: { onBack?: () => void }) {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filter, setFilter] = useState<FilterType>('All');
  const [saved, setSaved] = useState<string[]>([]);
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [showApply, setShowApply] = useState(false);
  const [applyJob, setApplyJob] = useState<JobPosting | null>(null);
  const [appForm, setAppForm] = useState({ name: '', email: '', phone: '', resume: '', coverLetter: '' });
  const [appSuccess, setAppSuccess] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const filtered = publicJobs.filter(j => {
    const matchSearch = !searchKeyword || j.title.toLowerCase().includes(searchKeyword.toLowerCase()) || j.description.toLowerCase().includes(searchKeyword.toLowerCase());
    const matchFilter = filter === 'All' || (filter === 'Saved Jobs' ? saved.includes(j.id) : j.employmentType === filter);
    return matchSearch && matchFilter;
  });

  const visibleJobs = showAll ? filtered : filtered.slice(0, 6);

  function handleApply(e: React.FormEvent) {
    e.preventDefault();
    setAppSuccess(true);
  }

  if (selectedJob && !showApply) {
    return (
      <div className="min-h-screen bg-[#F7F8FA]">
        <header className="bg-white border-b border-[#E5E7EB] px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <button onClick={() => setSelectedJob(null)} className="flex items-center gap-2 text-sm text-[#6B7280] hover:text-[var(--foreground)] transition-colors">
            <ArrowLeft size={16} /> Back to Jobs
          </button>
          {onBack && <button onClick={onBack} className="text-xs text-[#6B7280] hover:text-[var(--foreground)]">Return to System</button>}
        </header>

        <div className="max-w-3xl mx-auto px-6 py-10">
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-8 shadow-sm">
            <div className="flex items-start justify-between mb-6">
              <div>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3 ${typeColor[selectedJob.employmentType] ?? 'bg-gray-100 text-gray-600'}`}>{selectedJob.employmentType}</span>
                <h1 className="text-2xl font-bold text-[var(--foreground)]">{selectedJob.title}</h1>
                <div className="flex items-center gap-4 mt-2 text-sm text-[#6B7280]">
                  <span className="flex items-center gap-1.5"><Building2 size={14} />{selectedJob.department}</span>
                  <span className="flex items-center gap-1.5"><Clock size={14} />Posted {selectedJob.datePosted}</span>
                </div>
              </div>
              <button
                onClick={() => { setApplyJob(selectedJob); setShowApply(true); setAppForm({ name: '', email: '', phone: '', resume: '', coverLetter: '' }); setAppSuccess(false); }}
                className="px-6 py-3 rounded-xl text-white font-semibold text-sm transition-all hover:opacity-90"
                style={{ background: 'var(--primary)', boxShadow: '0 4px 14px rgba(110,18,22,0.35)' }}
              >
                Apply Now
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8 p-4 bg-[#F7F8FA] rounded-xl">
              <div><div className="text-xs text-[#9CA3AF] mb-0.5">Application Deadline</div><div className="text-sm font-semibold text-[var(--foreground)]">{selectedJob.deadline}</div></div>
              <div><div className="text-xs text-[#9CA3AF] mb-0.5">Number of Slots</div><div className="text-sm font-semibold text-[var(--foreground)]">{selectedJob.slots}</div></div>
              <div><div className="text-xs text-[#9CA3AF] mb-0.5">Department</div><div className="text-sm font-semibold text-[var(--foreground)]">{selectedJob.department}</div></div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-[var(--foreground)] mb-3">Job Description</h3>
                <p className="text-sm text-[#374151] leading-relaxed">{selectedJob.description}</p>
              </div>
              <div>
                <h3 className="text-base font-bold text-[var(--foreground)] mb-3">Qualifications</h3>
                <p className="text-sm text-[#374151] leading-relaxed">{selectedJob.qualifications}</p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-[#E5E7EB]">
              <button
                onClick={() => { setApplyJob(selectedJob); setShowApply(true); setAppForm({ name: '', email: '', phone: '', resume: '', coverLetter: '' }); setAppSuccess(false); }}
                className="w-full py-3 rounded-xl text-white font-semibold text-sm"
                style={{ background: 'var(--primary)' }}
              >
                Apply Now
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-[#E5E7EB] px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'var(--primary)' }}>
            <Building2 size={18} className="text-white" />
          </div>
          <div>
            <div className="font-bold text-[var(--foreground)] text-sm">Corazon Travel and Tours</div>
            <div className="text-xs text-[#9CA3AF]">Careers Portal</div>
          </div>
        </div>
        {onBack && (
          <button onClick={onBack} className="flex items-center gap-1.5 text-xs text-[#6B7280] hover:text-[var(--foreground)] border border-[#E5E7EB] px-3 py-1.5 rounded-lg transition-colors">
            <ArrowLeft size={13} /> Return to System
          </button>
        )}
      </header>

      {/* Hero */}
      <section className="py-16 px-6 text-center bg-gradient-to-b from-[#F0F4FF] to-white">
        <h1 className="text-4xl font-bold text-[var(--foreground)] mb-3">Apply Now</h1>
        <p className="text-[#6B7280] max-w-xl mx-auto mb-8 leading-relaxed">
          Explore open positions and apply for a role that matches your skills and career goals.
        </p>
        {/* Search bar */}
        <div className="flex max-w-xl mx-auto gap-2 bg-white rounded-2xl border border-[#E5E7EB] p-2 shadow-sm">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
            <input
              value={searchKeyword}
              onChange={e => setSearchKeyword(e.target.value)}
              placeholder="Job Title / Keyword"
              className="w-full pl-9 pr-3 py-2.5 bg-transparent text-sm text-[var(--foreground)] outline-none placeholder:text-[#9CA3AF]"
            />
          </div>
          <button
            className="px-6 py-2.5 rounded-xl text-white text-sm font-semibold shrink-0"
            style={{ background: 'var(--primary)' }}
          >
            Search
          </button>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="px-8 py-4 border-b border-[#E5E7EB] bg-white sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex items-center gap-2 flex-wrap">
          {FILTERS.map(f => {
            const count = f === 'All' ? publicJobs.length : f === 'Saved Jobs' ? saved.length : publicJobs.filter(j => j.employmentType === f).length;
            const isActive = filter === f;
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all border ${isActive ? 'text-white border-primary' : 'border-[#E5E7EB] text-[#6B7280] bg-white hover:border-primary/40'}`}
                style={isActive ? { background: 'var(--primary)' } : {}}
              >
                {f}
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-[#F0F0F0] text-[#6B7280]'}`}>{count}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Job Cards Grid */}
      <section className="max-w-6xl mx-auto px-8 py-10">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-[#6B7280]">Showing <strong className="text-[var(--foreground)]">{filtered.length}</strong> open position{filtered.length !== 1 ? 's' : ''}</p>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16 text-[#9CA3AF]">No jobs match your search.</div>
        ) : (
          <div className="grid grid-cols-3 gap-5">
            {visibleJobs.map(job => (
              <JobCard
                key={job.id}
                job={job}
                isSaved={saved.includes(job.id)}
                onToggleSave={() => setSaved(s => s.includes(job.id) ? s.filter(x => x !== job.id) : [...s, job.id])}
                onLearnMore={() => setSelectedJob(job)}
                onApply={() => { setApplyJob(job); setShowApply(true); setAppForm({ name: '', email: '', phone: '', resume: '', coverLetter: '' }); setAppSuccess(false); }}
              />
            ))}
          </div>
        )}

        {/* See All Jobs button */}
        {filtered.length > 6 && (
          <div className="flex justify-center mt-10">
            <button
              onClick={() => setShowAll(v => !v)}
              className="flex items-center gap-2 px-8 py-3 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90"
              style={{ background: 'var(--primary)', boxShadow: '0 4px 14px rgba(110,18,22,0.25)' }}
            >
              {showAll ? 'Show Less' : 'See All Jobs'}
              <ChevronRight size={16} className={`transition-transform ${showAll ? 'rotate-90' : ''}`} />
            </button>
          </div>
        )}
      </section>

      {/* Application Modal */}
      {showApply && applyJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => { setShowApply(false); setAppSuccess(false); }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#E5E7EB]">
              <div>
                <h3 className="font-bold text-[var(--foreground)]">Apply for this Position</h3>
                <p className="text-xs text-[#6B7280] mt-0.5">{applyJob.title} · {applyJob.department}</p>
              </div>
              <button onClick={() => { setShowApply(false); setAppSuccess(false); }} className="p-1.5 rounded-lg hover:bg-[#F7F8FA] text-[#9CA3AF]"><X size={18} /></button>
            </div>

            {appSuccess ? (
              <div className="flex flex-col items-center text-center px-8 py-12">
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mb-4">
                  <CheckCircle2 size={32} className="text-emerald-500" />
                </div>
                <h3 className="text-xl font-bold text-[var(--foreground)] mb-2">Application Submitted!</h3>
                <p className="text-sm text-[#6B7280] leading-relaxed">Your application for <strong>{applyJob.title}</strong> has been received. We'll review it and get back to you shortly.</p>
                <button onClick={() => { setShowApply(false); setAppSuccess(false); }} className="mt-6 px-6 py-2.5 rounded-xl text-white text-sm font-semibold" style={{ background: 'var(--primary)' }}>Done</button>
              </div>
            ) : (
              <form onSubmit={handleApply} className="p-6 space-y-4">
                <AppField label="Full Name" value={appForm.name} onChange={v => setAppForm(f => ({ ...f, name: v }))} placeholder="Juan dela Cruz" required />
                <AppField label="Email Address" value={appForm.email} onChange={v => setAppForm(f => ({ ...f, email: v }))} placeholder="juan@email.com" type="email" required />
                <AppField label="Contact Number" value={appForm.phone} onChange={v => setAppForm(f => ({ ...f, phone: v }))} placeholder="+63 9XX XXX XXXX" />
                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1.5">Resume (PDF only) <span className="text-red-500">*</span></label>
                  <label className="flex items-center gap-3 px-4 py-3 border-2 border-dashed border-[#E5E7EB] rounded-xl cursor-pointer hover:border-primary/30 transition-colors bg-[#F7F8FA]">
                    <Upload size={18} className="text-[#9CA3AF]" />
                    <div>
                      <div className="text-sm text-[#374151] font-medium">{appForm.resume || 'Click to upload your resume'}</div>
                      <div className="text-xs text-[#9CA3AF]">PDF files only, max 5MB</div>
                    </div>
                    <input type="file" accept=".pdf" className="hidden" onChange={e => setAppForm(f => ({ ...f, resume: e.target.files?.[0]?.name ?? '' }))} />
                  </label>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1.5">Cover Letter <span className="text-[#9CA3AF] font-normal">(Optional)</span></label>
                  <textarea value={appForm.coverLetter} onChange={e => setAppForm(f => ({ ...f, coverLetter: e.target.value }))} rows={4} placeholder="Tell us why you're a great fit for this role..." className="w-full px-3 py-2.5 bg-[#F7F8FA] border border-[#E5E7EB] rounded-xl text-sm text-[var(--foreground)] outline-none resize-none placeholder:text-[#9CA3AF]" />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90"
                  style={{ background: 'var(--primary)', boxShadow: '0 4px 14px rgba(110,18,22,0.35)' }}
                >
                  Submit Application
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function JobCard({ job, isSaved, onToggleSave, onLearnMore, onApply }: {
  job: JobPosting; isSaved: boolean;
  onToggleSave: () => void; onLearnMore: () => void; onApply: () => void;
}) {
  const desc = job.description.length > 120 ? job.description.slice(0, 120) + '...' : job.description;
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 flex flex-col hover:shadow-md hover:border-primary/20 transition-all">
      <div className="flex items-start justify-between mb-3">
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${typeColor[job.employmentType] ?? 'bg-gray-100 text-gray-600'}`}>{job.employmentType}</span>
        <div className="flex items-center gap-1">
          <button onClick={onToggleSave} className={`p-1.5 rounded-lg transition-colors ${isSaved ? 'text-[var(--foreground)]' : 'text-[#D1D5DB] hover:text-[var(--foreground)]'}`}>
            <Bookmark size={15} fill={isSaved ? 'currentColor' : 'none'} />
          </button>
          <button className="p-1.5 rounded-lg text-[#D1D5DB] hover:text-[var(--foreground)] transition-colors"><Share2 size={15} /></button>
        </div>
      </div>

      <h3 className="font-bold text-[var(--foreground)] text-base leading-tight mb-1">{job.title}</h3>
      <div className="flex items-center gap-1.5 text-xs text-[#9CA3AF] mb-3">
        <Building2 size={12} /> {job.department}
      </div>

      <p className="text-xs text-[#6B7280] leading-relaxed flex-1 mb-4">
        {desc}
        {job.description.length > 120 && (
          <button onClick={onLearnMore} className="text-[#2B6CB0] font-medium ml-1 hover:underline">...See more</button>
        )}
      </p>

      <div className="flex items-center justify-between mt-auto">
        <button
          onClick={onLearnMore}
          className="px-4 py-2 rounded-xl border border-primary text-[var(--foreground)] text-xs font-semibold hover:bg-[var(--foreground)] hover:text-white transition-all"
        >
          Learn More
        </button>
        <span className="text-xs text-[#9CA3AF] px-2.5 py-1 bg-[#F7F8FA] rounded-full">{job.department}</span>
      </div>
    </div>
  );
}

function AppField({ label, value, onChange, placeholder, type = 'text', required }: {
  label: string; value: string; onChange: (v: string) => void; placeholder: string; type?: string; required?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-[#374151] mb-1.5">{label} {required && <span className="text-red-500">*</span>}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} required={required} className="w-full px-3 py-2.5 bg-[#F7F8FA] border border-[#E5E7EB] rounded-xl text-sm text-[var(--foreground)] outline-none focus:ring-2 focus:ring-[var(--foreground)]/10 placeholder:text-[#9CA3AF]" />
    </div>
  );
}
