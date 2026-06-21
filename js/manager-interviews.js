import { db } from './db.js';

document.addEventListener('DOMContentLoaded', () => {
  const MANAGER_NAME = 'Maria Santos';
  const tbody = document.getElementById('interviews-tbody');
  const modal = document.getElementById('feedback-modal');
  let activeInterview = null;

  const formState = {
    overallImpression: 0,
    communicationSkills: 0,
    technicalKnowledge: 0,
    cultureFit: 0,
    problemSolving: 0,
    recommendation: ''
  };

  const CRITERIA = [
    { key: 'communicationSkills', label: 'Communication Skills' },
    { key: 'technicalKnowledge', label: 'Technical Knowledge' },
    { key: 'cultureFit', label: 'Culture Fit' },
    { key: 'problemSolving', label: 'Problem Solving' }
  ];

  function isSubmitted(applicantId) {
    return !!db.interviewFeedbacks.find(f => f.applicantId === applicantId);
  }

  function renderTable() {
    const myInterviews = db.interviews.filter(i => i.interviewer === MANAGER_NAME);
    tbody.innerHTML = '';
    myInterviews.forEach((iv, i) => {
      const done = isSubmitted(iv.applicantId);
      const initials = iv.applicantName.split(' ').map(n => n[0]).join('').slice(0, 2);
      
      const tr = document.createElement('tr');
      tr.className = `border-b border-border/50 hover:bg-secondary/20 ${i % 2 !== 0 ? 'bg-secondary/10' : ''}`;
      tr.innerHTML = `
        <td class="px-5 py-3">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span class="text-white text-xs font-semibold">${initials}</span>
            </div>
            <span class="text-sm font-medium text-foreground">${iv.applicantName}</span>
          </div>
        </td>
        <td class="px-5 py-3 text-xs text-muted-foreground">${iv.jobTitle}</td>
        <td class="px-5 py-3 text-xs text-foreground">${iv.date} · ${iv.time}</td>
        <td class="px-5 py-3 text-xs text-foreground">${iv.format}</td>
        <td class="px-5 py-3">
          ${done ? `
            <span class="flex items-center gap-1.5 text-xs text-emerald-700 font-medium bg-emerald-50 px-2.5 py-1 rounded-full w-fit">
              <i data-lucide="check" style="width: 12px; height: 12px;"></i> Feedback Submitted
            </span>
          ` : `
            <span class="flex items-center gap-1.5 text-xs text-amber-700 font-medium bg-amber-50 px-2.5 py-1 rounded-full w-fit">
              Pending Feedback
            </span>
          `}
        </td>
        <td class="px-5 py-3">
          ${!done && iv.status === 'Done' ? `
            <button data-id="${iv.id}" class="submit-btn px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-medium hover:bg-primary/90 transition-colors">
              Submit Feedback
            </button>
          ` : ''}
        </td>
      `;
      tbody.appendChild(tr);
    });

    document.querySelectorAll('.submit-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        activeInterview = myInterviews.find(x => x.id === id);
        if (activeInterview) openModal();
      });
    });

    if (typeof lucide !== 'undefined') lucide.createIcons();
  }

  function renderStars() {
    const starOverall = document.getElementById('star-overall');
    const labels = ['', 'Poor', 'Below Average', 'Average', 'Good', 'Excellent'];
    
    starOverall.innerHTML = [1,2,3,4,5].map(v => `
      <button type="button" class="overall-star-btn" data-val="${v}">
        <i data-lucide="star" style="width: 28px; height: 28px; color: ${v <= formState.overallImpression ? '#fbbf24' : '#e5e7eb'}; fill: ${v <= formState.overallImpression ? '#fbbf24' : '#e5e7eb'};"></i>
      </button>
    `).join('') + (formState.overallImpression > 0 ? `<span class="ml-2 text-sm text-muted-foreground self-center">${labels[formState.overallImpression]}</span>` : '');

    const criteriaContainer = document.getElementById('criteria-container');
    criteriaContainer.innerHTML = CRITERIA.map(c => `
      <div>
        <div class="flex items-center justify-between mb-1">
          <span class="text-sm text-foreground">${c.label}</span>
          <span class="text-xs text-muted-foreground">${formState[c.key]}/5</span>
        </div>
        <div class="flex gap-1">
          ${[1,2,3,4,5].map(v => `
            <button type="button" class="crit-star-btn" data-key="${c.key}" data-val="${v}">
              <i data-lucide="star" style="width: 20px; height: 20px; color: ${v <= formState[c.key] ? '#fbbf24' : '#e5e7eb'}; fill: ${v <= formState[c.key] ? '#fbbf24' : '#e5e7eb'};"></i>
            </button>
          `).join('')}
        </div>
      </div>
    `).join('');

    if (typeof lucide !== 'undefined') lucide.createIcons();
    attachStarListeners();
    checkSubmit();
  }

  function attachStarListeners() {
    document.querySelectorAll('.overall-star-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        formState.overallImpression = parseInt(e.currentTarget.dataset.val);
        renderStars();
      });
    });

    document.querySelectorAll('.crit-star-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const key = e.currentTarget.dataset.key;
        const val = parseInt(e.currentTarget.dataset.val);
        formState[key] = val;
        renderStars();
      });
    });
  }

  function openModal() {
    document.getElementById('fb-applicant-name').textContent = activeInterview.applicantName;
    document.getElementById('fb-position').textContent = `· ${activeInterview.jobTitle}`;
    
    // Reset form
    formState.overallImpression = 0;
    CRITERIA.forEach(c => formState[c.key] = 0);
    formState.recommendation = '';
    document.getElementById('fb-strengths').value = '';
    document.getElementById('fb-concerns').value = '';
    document.querySelectorAll('.rec-btn').forEach(b => {
      b.className = "rec-btn flex-1 py-2 rounded-xl text-xs font-medium border transition-all border-border text-muted-foreground hover:border-primary/40";
    });
    
    renderStars();
    modal.classList.remove('hidden');
  }

  document.querySelectorAll('.close-modal-btn').forEach(btn => {
    btn.addEventListener('click', () => modal.classList.add('hidden'));
  });

  const recBtns = document.querySelectorAll('.rec-btn');
  recBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const r = e.currentTarget.dataset.val;
      formState.recommendation = r;
      recBtns.forEach(b => {
        b.className = `rec-btn flex-1 py-2 rounded-xl text-xs font-medium border transition-all ${
          formState.recommendation === b.dataset.val
            ? (r === 'Hire' ? 'bg-emerald-600 text-white border-emerald-600' :
               r === 'Reject' ? 'bg-red-500 text-white border-red-500' :
               'bg-primary text-white border-primary')
            : 'border-border text-muted-foreground hover:border-primary/40'
        }`;
      });
      checkSubmit();
    });
  });

  function checkSubmit() {
    const btn = document.getElementById('submit-fb-btn');
    btn.disabled = !(formState.recommendation && formState.overallImpression > 0);
  }

  document.getElementById('fb-form').addEventListener('submit', (e) => {
    e.preventDefault();
    if (!formState.recommendation || formState.overallImpression === 0) return;
    
    const newFb = {
      id: `FB-${String(db.interviewFeedbacks.length + 1).padStart(3, '0')}`,
      applicantId: activeInterview.applicantId,
      applicantName: activeInterview.applicantName,
      position: activeInterview.jobTitle,
      interviewerId: 'EMP001',
      evaluatorName: MANAGER_NAME,
      overallImpression: formState.overallImpression,
      communicationSkills: formState.communicationSkills,
      technicalKnowledge: formState.technicalKnowledge,
      cultureFit: formState.cultureFit,
      problemSolving: formState.problemSolving,
      strengths: document.getElementById('fb-strengths').value,
      areasOfConcern: document.getElementById('fb-concerns').value,
      recommendation: formState.recommendation,
      submittedDate: '2026-06-16',
    };
    
    db.interviewFeedbacks.push(newFb);
    renderTable();
    modal.classList.add('hidden');
  });

  renderTable();
});
