import { useState, useEffect } from 'react';
import { Plus, X, Star } from 'lucide-react';
import { type EvaluationCriteria } from '../../data/mockData';
import { supabase } from '../../../lib/supabaseClient';
import { useAuth } from '../../../lib/useAuth';

const CRITERIA_LABELS: { key: keyof EvaluationCriteria; label: string; description: string }[] = [
  { key: 'attendance', label: 'Attendance & Punctuality', description: 'Regularity and timeliness' },
  { key: 'productivity', label: 'Productivity & Output', description: 'Volume and quality of work' },
  { key: 'teamwork', label: 'Teamwork & Collaboration', description: 'Working effectively with others' },
  { key: 'communication', label: 'Communication Skills', description: 'Verbal and written clarity' },
  { key: 'initiative', label: 'Initiative & Innovation', description: 'Proactive problem solving' },
];

const ratingLabels = ['', 'Poor', 'Below Average', 'Average', 'Good', 'Excellent'];

const EMPTY_FORM = {
  employeeId: '',
  period: 'Q2 2026',
  criteria: { attendance: 3, productivity: 3, teamwork: 3, communication: 3, initiative: 3 },
  comments: '',
};

export function PerformanceEvaluation() {
  const { user } = useAuth();
  const [evaluations, setEvaluations] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [selectedEval, setSelectedEval] = useState<any | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const [evalRes, empRes] = await Promise.all([
        supabase.from('performance_evaluations').select('*').order('date', { ascending: false }),
        supabase.from('employees').select('id, name, department, status')
      ]);
      if (evalRes.data) setEvaluations(evalRes.data);
      if (empRes.data) setEmployees(empRes.data);
      setLoading(false);
    }
    fetchData();
  }, []);

  const displayEvaluations = evaluations.map(ev => {
    const emp = employees.find(e => e.id === ev.employee_id);
    return {
      id: ev.id,
      employeeId: ev.employee_id,
      employeeName: emp ? emp.name : (ev.employee_name || 'Unknown'),
      department: emp ? emp.department : (ev.department || 'Unknown'),
      period: ev.period,
      evaluator: ev.evaluator,
      date: ev.date,
      comments: ev.comments,
      overallRating: ev.overall_rating,
      criteria: {
        attendance: ev.attendance_rating,
        productivity: ev.productivity_rating,
        teamwork: ev.teamwork_rating,
        communication: ev.communication_rating,
        initiative: ev.initiative_rating
      }
    };
  });

  const overallRating = (c: EvaluationCriteria) =>
    +(Object.values(c).reduce((s, v) => s + v, 0) / 5).toFixed(1);

  async function handleSubmit() {
    if (!form.employeeId || !user) return;
    const emp = employees.find(e => e.id === form.employeeId)!;
    
    const newEval = {
      employee_id: form.employeeId,
      employee_name: emp.name,
      department: emp.department,
      period: form.period,
      evaluator: user.name,
      date: new Date().toISOString().split('T')[0],
      comments: form.comments,
      attendance_rating: form.criteria.attendance,
      productivity_rating: form.criteria.productivity,
      teamwork_rating: form.criteria.teamwork,
      communication_rating: form.criteria.communication,
      initiative_rating: form.criteria.initiative,
      overall_rating: overallRating(form.criteria)
    };

    const { data, error } = await supabase.from('performance_evaluations').insert(newEval).select().single();
    
    if (data && !error) {
      setEvaluations(prev => [data, ...prev]);
    }
    
    setShowForm(false);
    setForm(EMPTY_FORM);
  }

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading performance data...</div>;

  const ratingColor = (r: number) => r >= 4.5 ? 'text-emerald-600' : r >= 3.5 ? 'text-blue-600' : r >= 2.5 ? 'text-amber-600' : 'text-red-600';
  const ratingBg = (r: number) => r >= 4.5 ? 'bg-emerald-50' : r >= 3.5 ? 'bg-blue-50' : r >= 2.5 ? 'bg-amber-50' : 'bg-red-50';

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-foreground">Performance Evaluations</h2>
          <p className="text-xs text-muted-foreground mt-0.5">{displayEvaluations.length} evaluation records</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus size={15} /> New Evaluation
        </button>
      </div>

      {/* Evaluation Cards */}
      <div className="grid grid-cols-2 gap-4">
        {displayEvaluations.map(ev => (
          <div
            key={ev.id}
            className="bg-card rounded-xl border border-border p-5 cursor-pointer hover:shadow-md transition-all hover:border-primary/20"
            onClick={() => setSelectedEval(ev)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">
                    {ev.employeeName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </span>
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">{ev.employeeName}</div>
                  <div className="text-xs text-muted-foreground">{ev.department} · {ev.period}</div>
                </div>
              </div>
              <div className={`px-3 py-1.5 rounded-lg ${ratingBg(ev.overallRating)}`}>
                <div className={`text-xl font-bold ${ratingColor(ev.overallRating)}`}>{ev.overallRating}</div>
                <div className="text-xs text-muted-foreground text-center">/5.0</div>
              </div>
            </div>
            <div className="space-y-2">
              {CRITERIA_LABELS.map(({ key, label }) => (
                <div key={key} className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground w-36 truncate">{label}</span>
                  <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary/70 transition-all"
                      style={{ width: `${(ev.criteria[key] / 5) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-foreground w-4 text-right">{ev.criteria[key]}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-border flex justify-between text-xs text-muted-foreground">
              <span>Evaluator: {ev.evaluator}</span>
              <span>{ev.date}</span>
            </div>
          </div>
        ))}
      </div>

      {/* New Evaluation Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-5 border-b border-border">
              <h3 className="font-semibold text-foreground">New Performance Evaluation</h3>
              <button onClick={() => setShowForm(false)} className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">Employee</label>
                  <select
                    value={form.employeeId}
                    onChange={e => setForm(f => ({ ...f, employeeId: e.target.value }))}
                    className="w-full px-3 py-2.5 bg-secondary rounded-lg text-sm border-0 outline-none text-foreground cursor-pointer"
                  >
                    <option value="">Select employee...</option>
                    {employees.filter(e => e.status === 'Active').map(e => (
                      <option key={e.id} value={e.id}>{e.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">Evaluation Period</label>
                  <select
                    value={form.period}
                    onChange={e => setForm(f => ({ ...f, period: e.target.value }))}
                    className="w-full px-3 py-2.5 bg-secondary rounded-lg text-sm border-0 outline-none text-foreground cursor-pointer"
                  >
                    {['Q1 2026', 'Q2 2026', 'Q3 2026', 'Q4 2026'].map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Rating Criteria</h4>
                <div className="space-y-4">
                  {CRITERIA_LABELS.map(({ key, label, description }) => (
                    <div key={key}>
                      <div className="flex justify-between items-baseline mb-2">
                        <div>
                          <span className="text-sm font-medium text-foreground">{label}</span>
                          <span className="text-xs text-muted-foreground ml-2">{description}</span>
                        </div>
                        <span className="text-sm font-bold text-primary">{form.criteria[key]} — {ratingLabels[form.criteria[key]]}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map(v => (
                          <button
                            key={v}
                            onClick={() => setForm(f => ({ ...f, criteria: { ...f.criteria, [key]: v } }))}
                            className="flex-1"
                          >
                            <Star
                              size={24}
                              className={`w-full transition-colors ${v <= form.criteria[key] ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-secondary rounded-xl p-4 text-center">
                <div className="text-xs text-muted-foreground mb-1">Computed Overall Rating</div>
                <div className={`text-3xl font-bold ${ratingColor(overallRating(form.criteria))}`}>
                  {overallRating(form.criteria).toFixed(1)}
                </div>
                <div className="text-xs text-muted-foreground">out of 5.0</div>
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Comments & Remarks</label>
                <textarea
                  value={form.comments}
                  onChange={e => setForm(f => ({ ...f, comments: e.target.value }))}
                  placeholder="Add evaluation notes, specific observations, and development recommendations..."
                  rows={3}
                  className="w-full px-3 py-2.5 bg-secondary rounded-lg text-sm border-0 outline-none resize-none text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 pb-5">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg text-sm text-muted-foreground hover:bg-secondary">Cancel</button>
              <button onClick={handleSubmit} className="px-5 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90">Submit Evaluation</button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedEval && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setSelectedEval(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-5 border-b border-border">
              <h3 className="font-semibold text-foreground">Evaluation Detail</h3>
              <button onClick={() => setSelectedEval(null)} className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-primary flex items-center justify-center">
                  <span className="text-white text-lg font-bold">
                    {selectedEval.employeeName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-foreground">{selectedEval.employeeName}</div>
                  <div className="text-sm text-muted-foreground">{selectedEval.department} · {selectedEval.period}</div>
                  <div className="text-xs text-muted-foreground mt-1">Evaluated by {selectedEval.evaluator} on {selectedEval.date}</div>
                </div>
                <div className={`text-center px-4 py-2 rounded-xl ${ratingBg(selectedEval.overallRating)}`}>
                  <div className={`text-2xl font-bold ${ratingColor(selectedEval.overallRating)}`}>{selectedEval.overallRating}</div>
                  <div className="text-xs text-muted-foreground">Overall</div>
                </div>
              </div>
              <div className="space-y-3">
                {CRITERIA_LABELS.map(({ key, label }) => (
                  <div key={key}>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="font-medium text-foreground">{label}</span>
                      <span className="text-muted-foreground">{selectedEval.criteria[key]}/5 — {ratingLabels[selectedEval.criteria[key]]}</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${(selectedEval.criteria[key] / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              {selectedEval.comments && (
                <div className="bg-secondary rounded-xl p-4">
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Evaluator Comments</div>
                  <p className="text-sm text-foreground leading-relaxed">{selectedEval.comments}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
