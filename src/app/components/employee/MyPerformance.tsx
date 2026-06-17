import { Star } from 'lucide-react';
import { performanceEvaluations } from '../../data/mockData';

const CRITERIA_LABELS = [
  { key: 'attendance' as const, label: 'Attendance & Punctuality', icon: '🕐' },
  { key: 'productivity' as const, label: 'Productivity & Output', icon: '📊' },
  { key: 'teamwork' as const, label: 'Teamwork & Collaboration', icon: '🤝' },
  { key: 'communication' as const, label: 'Communication Skills', icon: '💬' },
  { key: 'initiative' as const, label: 'Initiative & Innovation', icon: '💡' },
];

const ratingLabels = ['', 'Poor', 'Below Average', 'Average', 'Good', 'Excellent'];

const ratingColor = (r: number) => r >= 4.5 ? 'text-emerald-600' : r >= 3.5 ? 'text-blue-600' : r >= 2.5 ? 'text-amber-600' : 'text-red-600';
const ratingBg = (r: number) => r >= 4.5 ? 'bg-emerald-50 border-emerald-100' : r >= 3.5 ? 'bg-blue-50 border-blue-100' : r >= 2.5 ? 'bg-amber-50 border-amber-100' : 'bg-red-50 border-red-100';
const barColor = (r: number) => r >= 4 ? 'bg-emerald-500' : r >= 3 ? 'bg-blue-500' : r >= 2 ? 'bg-amber-500' : 'bg-red-500';

export function MyPerformance() {
  const myEvals = performanceEvaluations.filter(e => e.employeeId === 'EMP002');
  const latest = myEvals[0];

  return (
    <div className="space-y-5">
      {/* Latest rating highlight */}
      {latest && (
        <div className="bg-primary rounded-2xl p-6 flex items-center gap-6 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-64 rounded-full bg-white/5 -translate-y-1/3 translate-x-1/4" />
          <div className="flex-1">
            <p className="text-white/60 text-xs uppercase tracking-wider font-semibold mb-1">Latest Evaluation</p>
            <h2 className="text-white font-bold text-xl mb-1">{latest.period}</h2>
            <p className="text-white/60 text-sm">Evaluated by {latest.evaluator} · {latest.date}</p>
            <p className="text-white/70 text-sm mt-3 max-w-md leading-relaxed">{latest.comments}</p>
          </div>
          <div className="text-center z-10 flex-shrink-0">
            <div className="w-28 h-28 rounded-2xl bg-white/10 flex flex-col items-center justify-center">
              <span className={`text-4xl font-bold text-white`}>{latest.overallRating}</span>
              <span className="text-white/60 text-sm">/ 5.0</span>
            </div>
            <div className="flex items-center justify-center gap-0.5 mt-2">
              {[1, 2, 3, 4, 5].map(v => (
                <Star
                  key={v}
                  size={14}
                  className={v <= Math.round(latest.overallRating) ? 'text-amber-400 fill-amber-400' : 'text-white/20 fill-white/20'}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Evaluations List */}
      <div className="space-y-4">
        {myEvals.map(ev => (
          <div key={ev.id} className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-start justify-between mb-5">
              <div>
                <h3 className="font-semibold text-foreground">{ev.period} Performance Evaluation</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Evaluated by {ev.evaluator} · {ev.date}</p>
              </div>
              <div className={`px-4 py-2 rounded-xl border text-center ${ratingBg(ev.overallRating)}`}>
                <div className={`text-2xl font-bold ${ratingColor(ev.overallRating)}`}>{ev.overallRating}</div>
                <div className="text-xs text-muted-foreground">Overall</div>
              </div>
            </div>

            {/* Criteria Grid */}
            <div className="grid grid-cols-5 gap-3 mb-5">
              {CRITERIA_LABELS.map(({ key, label, icon }) => (
                <div key={key} className="bg-secondary rounded-xl p-3 text-center">
                  <div className="text-xl mb-1">{icon}</div>
                  <div className={`text-xl font-bold ${ratingColor(ev.criteria[key])}`}>{ev.criteria[key]}</div>
                  <div className="text-xs text-muted-foreground mt-0.5 leading-tight">{label.split(' ')[0]}</div>
                  <div className="text-xs text-muted-foreground">{ratingLabels[ev.criteria[key]]}</div>
                </div>
              ))}
            </div>

            {/* Bar breakdown */}
            <div className="space-y-3 mb-4">
              {CRITERIA_LABELS.map(({ key, label }) => (
                <div key={key} className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-44">{label}</span>
                  <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${barColor(ev.criteria[key])} transition-all`}
                      style={{ width: `${(ev.criteria[key] / 5) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-foreground w-6 text-right">{ev.criteria[key]}/5</span>
                </div>
              ))}
            </div>

            {ev.comments && (
              <div className="bg-secondary rounded-xl p-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Evaluator Comments</p>
                <p className="text-sm text-foreground leading-relaxed">{ev.comments}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
