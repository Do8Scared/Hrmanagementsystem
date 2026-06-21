import { db } from './db.js';

const CRITERIA_LABELS = [
  { key: 'attendance', label: 'Attendance & Punctuality', icon: '🕐' },
  { key: 'productivity', label: 'Productivity & Output', icon: '📊' },
  { key: 'teamwork', label: 'Teamwork & Collaboration', icon: '🤝' },
  { key: 'communication', label: 'Communication Skills', icon: '💬' },
  { key: 'initiative', label: 'Initiative & Innovation', icon: '💡' },
];

const ratingLabels = ['', 'Poor', 'Below Average', 'Average', 'Good', 'Excellent'];

const ratingColor = (r) => r >= 4.5 ? 'text-emerald-600' : r >= 3.5 ? 'text-accent' : r >= 2.5 ? 'text-amber-600' : 'text-red-600';
const ratingBg = (r) => r >= 4.5 ? 'bg-emerald-50 border-emerald-100' : r >= 3.5 ? 'bg-secondary border-border' : r >= 2.5 ? 'bg-amber-50 border-amber-100' : 'bg-red-50 border-red-100';
const barColor = (r) => r >= 4 ? 'bg-emerald-500' : r >= 3 ? 'bg-primary' : r >= 2 ? 'bg-amber-500' : 'bg-red-500';

document.addEventListener('DOMContentLoaded', () => {
  const EMP_ID = 'EMP002';
  const myEvals = db.performanceEvaluations.filter(e => e.employeeId === EMP_ID);
  
  if (myEvals.length > 0) {
    const latest = myEvals[0];
    document.getElementById('latest-eval-container').classList.remove('hidden');
    document.getElementById('eval-period').textContent = latest.period;
    document.getElementById('eval-meta').textContent = `Evaluated by ${latest.evaluator} · ${latest.date}`;
    document.getElementById('eval-comments').textContent = latest.comments;
    document.getElementById('eval-rating').textContent = latest.overallRating;

    const starsContainer = document.getElementById('eval-stars');
    starsContainer.innerHTML = '';
    const ratingInt = Math.round(latest.overallRating);
    for(let i=1; i<=5; i++) {
      if (i <= ratingInt) {
        starsContainer.innerHTML += `<i data-lucide="star" style="width: 14px; height: 14px;" class="text-amber-400 fill-amber-400"></i>`;
      } else {
        starsContainer.innerHTML += `<i data-lucide="star" style="width: 14px; height: 14px;" class="text-white/20 fill-white/20"></i>`;
      }
    }
  }

  const listContainer = document.getElementById('evaluations-list');
  listContainer.innerHTML = '';

  myEvals.forEach(ev => {
    let criteriaHtml = '';
    let barHtml = '';
    
    CRITERIA_LABELS.forEach(c => {
      const val = ev.criteria[c.key];
      criteriaHtml += `
        <div class="bg-secondary rounded-xl p-3 text-center">
          <div class="text-xl mb-1">${c.icon}</div>
          <div class="text-xl font-bold ${ratingColor(val)}">${val}</div>
          <div class="text-xs text-muted-foreground mt-0.5 leading-tight">${c.label.split(' ')[0]}</div>
          <div class="text-xs text-muted-foreground">${ratingLabels[Math.round(val)] || ''}</div>
        </div>
      `;

      barHtml += `
        <div class="flex items-center gap-3">
          <span class="text-xs text-muted-foreground w-44">${c.label}</span>
          <div class="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
            <div class="h-full rounded-full ${barColor(val)} transition-all" style="width: ${(val / 5) * 100}%"></div>
          </div>
          <span class="text-xs font-semibold text-foreground w-6 text-right">${val}/5</span>
        </div>
      `;
    });

    const commentsHtml = ev.comments ? `
      <div class="bg-secondary rounded-xl p-4 mt-5">
        <p class="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Evaluator Comments</p>
        <p class="text-sm text-foreground leading-relaxed">${ev.comments}</p>
      </div>
    ` : '';

    listContainer.innerHTML += `
      <div class="bg-card rounded-xl border border-border p-6">
        <div class="flex items-start justify-between mb-5">
          <div>
            <h3 class="font-semibold text-foreground">${ev.period} Performance Evaluation</h3>
            <p class="text-xs text-muted-foreground mt-0.5">Evaluated by ${ev.evaluator} · ${ev.date}</p>
          </div>
          <div class="px-4 py-2 rounded-xl border text-center ${ratingBg(ev.overallRating)}">
            <div class="text-2xl font-bold ${ratingColor(ev.overallRating)}">${ev.overallRating}</div>
            <div class="text-xs text-muted-foreground">Overall</div>
          </div>
        </div>

        <div class="grid grid-cols-5 gap-3 mb-5">
          ${criteriaHtml}
        </div>

        <div class="space-y-3">
          ${barHtml}
        </div>

        ${commentsHtml}
      </div>
    `;
  });

  if (typeof lucide !== 'undefined') lucide.createIcons();
});
