import { db } from './db.js';

document.addEventListener('DOMContentLoaded', () => {
  // --- Database Integration ---
  
  // Load Job Postings from our DB simulator
  let jpList = db.getJobs();
  
  // Load Apps from DB simulator
  let appList = db.getApps();
  
  // Manpower requests remain mocked
  let mrList = [
    { id: 'MR-001', department: 'Engineering', requestingManager: 'Juan dela Cruz', positionTitle: 'Senior Frontend Developer', headcount: 2, dateRequested: '2026-06-15', preferredStartDate: '2026-07-15', employmentType: 'Full Time', urgency: 'High', status: 'Pending', jobDescription: 'Develop UI components using React and Tailwind.', qualifications: '5+ years experience in React. Strong CSS skills.', justification: 'Current team is overwhelmed with the new project.' },
    { id: 'MR-002', department: 'Marketing', requestingManager: 'Ana Reyes', positionTitle: 'SEO Specialist', headcount: 1, dateRequested: '2026-06-10', preferredStartDate: '2026-07-01', employmentType: 'Full Time', urgency: 'Medium', status: 'Approved', jobDescription: 'Manage SEO strategy and content.', qualifications: '3 years SEO experience.', justification: 'Replacement for resigned employee.' },
    { id: 'MR-003', department: 'Finance', requestingManager: 'Pedro Garcia', positionTitle: 'Accountant', headcount: 1, dateRequested: '2026-06-05', preferredStartDate: '2026-06-30', employmentType: 'Full Time', urgency: 'Low', status: 'Rejected', jobDescription: 'Handle payroll and taxes.', qualifications: 'CPA required.', justification: 'Need additional support.' },
  ];

  let intList = [
    { id: 'INT-001', applicantId: 'APP-003', applicantName: 'Luisa Fernandez', jobTitle: 'Senior Frontend Developer', date: '2026-06-19', time: '10:00', format: 'Virtual', interviewer: 'Juan dela Cruz', notes: 'Technical interview.', status: 'Upcoming' },
  ];

  let fbList = [];

  const urgencyColor = { Low: 'bg-gray-100 text-gray-600', Medium: 'bg-amber-50 text-amber-700', High: 'bg-orange-50 text-orange-700', Critical: 'bg-red-50 text-red-600' };
  const stageColor = { Applied: 'bg-gray-100 text-gray-600', Shortlisted: 'bg-secondary text-accent', 'Interview Scheduled': 'bg-purple-50 text-purple-700', Interviewed: 'bg-amber-50 text-amber-700', 'Job Offer': 'bg-orange-50 text-orange-700', Hired: 'bg-emerald-50 text-emerald-700', Rejected: 'bg-red-50 text-red-600' };
  const interviewStatusColor = { Upcoming: 'bg-amber-50 text-accent', Done: 'bg-emerald-100 text-emerald-700', Cancelled: 'bg-red-100 text-red-600' };
  const kanbanStages = ['Applied', 'Shortlisted', 'Interview Scheduled', 'Interviewed', 'Job Offer', 'Hired', 'Rejected'];

  // --- Elements ---
  const tabs = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  // MR Elements
  const inboxTbody = document.getElementById('inbox-tbody');
  const inboxPendingCount = document.getElementById('inbox-pending-count');
  const mrDrawer = document.getElementById('mr-drawer');
  const inboxList = document.getElementById('inbox-list');

  // JP Elements
  const jpTbody = document.getElementById('jp-tbody');
  const addJpBtn = document.getElementById('add-jp-btn');
  const addJpModal = document.getElementById('add-jp-modal');
  const addJpForm = document.getElementById('add-jp-form');

  // Tracker Elements
  const trackerContainer = document.getElementById('tracker-container');

  // Scheduling Elements
  const schedulingTbody = document.getElementById('scheduling-tbody');
  const weekGrid = document.getElementById('week-grid');
  const scheduleIntBtn = document.getElementById('schedule-int-btn');
  const scheduleIntModal = document.getElementById('schedule-int-modal');
  const scheduleIntForm = document.getElementById('schedule-int-form');
  const intApplicantSelect = document.getElementById('int-applicant');
  const scheduleNotif = document.getElementById('schedule-notif');
  const scheduleNotifMsg = document.getElementById('schedule-notif-msg');

  // Feedback Elements
  const feedbackNeededContainer = document.getElementById('feedback-needed-container');
  const feedbackNeededList = document.getElementById('feedback-needed-list');
  const feedbackList = document.getElementById('feedback-list');

  // Modals close buttons
  document.querySelectorAll('.close-modal-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.target.closest('.fixed').classList.add('hidden');
    });
  });

  // --- Tab Navigation ---
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.target;
      
      // Update Tab Styles
      tabs.forEach(t => {
        t.className = "tab-btn px-5 py-3.5 text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-px border-transparent text-muted-foreground hover:text-foreground";
      });
      tab.className = "tab-btn px-5 py-3.5 text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-px border-primary text-primary";

      // Show/Hide Content
      tabContents.forEach(c => c.classList.add('hidden'));
      document.getElementById(target).classList.remove('hidden');

      if (target === 'view-tracker') renderTracker();
      if (target === 'view-scheduling') renderScheduling();
      if (target === 'view-feedback') renderFeedback();
    });
  });

  // --- 1. Manpower Request Inbox ---
  function renderMR() {
    inboxTbody.innerHTML = '';
    let pendingCount = 0;
    
    mrList.forEach((mr, i) => {
      if (mr.status === 'Pending') pendingCount++;
      const tr = document.createElement('tr');
 tr.className = `border-b border-border/50 hover:bg-gray-50 transition-colors cursor-pointer ${i % 2 !== 0 ? 'bg-secondary/10' : ''}`;
      
      let statusHtml = '';
      if (mr.status === 'Approved') statusHtml = `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-emerald-600 bg-emerald-50 border border-emerald-100">Approved</span>`;
      else if (mr.status === 'Rejected') statusHtml = `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-red-600 bg-red-50 border border-red-100">Rejected</span>`;
      else statusHtml = `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-amber-600 bg-amber-50 border border-amber-100">Pending</span>`;

      tr.innerHTML = `
        <td class="px-3 py-3 text-xs font-mono text-primary font-medium">${mr.id}</td>
        <td class="px-3 py-3 text-xs text-foreground">${mr.department}</td>
        <td class="px-3 py-3 text-xs text-foreground">${mr.requestingManager}</td>
        <td class="px-3 py-3 text-xs font-medium text-foreground">${mr.positionTitle}</td>
        <td class="px-3 py-3 text-xs text-center text-foreground">${mr.headcount}</td>
        <td class="px-3 py-3 text-xs text-muted-foreground">${mr.dateRequested}</td>
        <td class="px-3 py-3"><span class="px-2 py-0.5 rounded-full text-xs font-medium ${urgencyColor[mr.urgency]}">${mr.urgency}</span></td>
        <td class="px-3 py-3">${statusHtml}</td>
        <td class="px-3 py-3">
          <button class="view-mr-btn px-2 py-1 rounded text-xs border border-border text-muted-foreground hover:bg-secondary transition-colors" data-id="${mr.id}">View</button>
        </td>
      `;
      inboxTbody.appendChild(tr);
    });
    
    inboxPendingCount.textContent = pendingCount;

    document.querySelectorAll('.view-mr-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        openMRDrawer(id);
      });
    });
  }

  function openMRDrawer(id) {
    const mr = mrList.find(m => m.id === id);
    if (!mr) return;

    inboxList.classList.add('pr-96');
    mrDrawer.classList.remove('hidden');

    let actionsHtml = '';
    if (mr.status === 'Pending') {
      actionsHtml = `
        <div class="space-y-2 pt-2 border-t border-border mt-4">
          <div class="flex gap-2">
            <button id="mr-approve-btn" class="flex-1 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors">Approve & Publish</button>
            <button id="mr-reject-btn" class="flex-1 py-2 rounded-lg border border-red-200 text-red-600 text-sm font-medium hover:bg-red-50 transition-colors">Reject</button>
          </div>
        </div>
      `;
    } else {
      let statusHtml = mr.status === 'Approved' ? `<span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-emerald-600 bg-emerald-50 border border-emerald-100">Approved</span>` : `<span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-red-600 bg-red-50 border border-red-100">Rejected</span>`;
      actionsHtml = `<div class="pt-2 border-t border-border mt-4">${statusHtml}</div>`;
    }

    mrDrawer.innerHTML = `
      <div class="flex items-center justify-between px-5 py-4 border-b border-border sticky top-0 bg-white z-10">
        <div>
          <span class="text-xs font-mono text-primary">${mr.id}</span>
          <h4 class="font-semibold text-foreground text-sm mt-0.5">${mr.positionTitle}</h4>
        </div>
        <button id="close-mr-btn" class="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground"><i data-lucide="x" style="width: 16px; height: 16px;"></i></button>
      </div>
      <div class="p-5 space-y-4">
        <div><span class="text-xs text-muted-foreground">Department</span><div class="text-sm font-medium text-foreground mt-0.5">${mr.department}</div></div>
        <div><span class="text-xs text-muted-foreground">Requesting Manager</span><div class="text-sm font-medium text-foreground mt-0.5">${mr.requestingManager}</div></div>
        <div><span class="text-xs text-muted-foreground">Employment Type</span><div class="text-sm font-medium text-foreground mt-0.5">${mr.employmentType}</div></div>
        <div><span class="text-xs text-muted-foreground">Headcount Needed</span><div class="text-sm font-medium text-foreground mt-0.5">${mr.headcount} slot(s)</div></div>
        <div><span class="text-xs text-muted-foreground">Preferred Start Date</span><div class="text-sm font-medium text-foreground mt-0.5">${mr.preferredStartDate}</div></div>
        <div><span class="text-xs text-muted-foreground">Urgency</span><div class="mt-1"><span class="px-2.5 py-1 rounded-full text-xs font-medium ${urgencyColor[mr.urgency]}">${mr.urgency}</span></div></div>
        <div><span class="text-xs text-muted-foreground">Job Description</span><p class="mt-1 text-sm text-foreground leading-relaxed">${mr.jobDescription}</p></div>
        <div><span class="text-xs text-muted-foreground">Qualifications</span><p class="mt-1 text-sm text-foreground leading-relaxed">${mr.qualifications}</p></div>
        ${actionsHtml}
      </div>
    `;

    document.getElementById('close-mr-btn').addEventListener('click', () => {
      inboxList.classList.remove('pr-96');
      mrDrawer.classList.add('hidden');
    });

    if (mr.status === 'Pending') {
      document.getElementById('mr-approve-btn').addEventListener('click', () => {
        mr.status = 'Approved';
        jpList.unshift({
          id: `JP-${String(jpList.length + 1).padStart(3, '0')}`,
          title: mr.positionTitle, department: mr.department, datePosted: '2026-06-16', deadline: mr.preferredStartDate, applicantCount: 0, status: 'Open', description: mr.jobDescription, qualifications: mr.qualifications, slots: mr.headcount, employmentType: mr.employmentType, publishToBoard: true
        });
        db.saveJobs(jpList);
        renderMR();
        renderJP();
        inboxList.classList.remove('pr-96');
        mrDrawer.classList.add('hidden');
      });
      document.getElementById('mr-reject-btn').addEventListener('click', () => {
        mr.status = 'Rejected';
        renderMR();
        inboxList.classList.remove('pr-96');
        mrDrawer.classList.add('hidden');
      });
    }

    if (typeof lucide !== 'undefined') lucide.createIcons();
  }

  // --- 2. Job Postings ---
  function renderJP() {
    jpTbody.innerHTML = '';
    jpList.forEach((jp, i) => {
      const tr = document.createElement('tr');
 tr.className = `border-b border-border/50 hover:bg-gray-50 transition-colors cursor-pointer ${i % 2 !== 0 ? 'bg-secondary/10' : ''}`;
      
      let statusHtml = '';
      if (jp.status === 'Open') statusHtml = `<span class="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">Open</span>`;
      else if (jp.status === 'Closed') statusHtml = `<span class="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">Closed</span>`;
      else statusHtml = `<span class="px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700">Draft</span>`;

      tr.innerHTML = `
        <td class="px-3 py-3 text-sm font-medium text-foreground">${jp.title}</td>
        <td class="px-3 py-3 text-xs text-muted-foreground">${jp.department}</td>
        <td class="px-3 py-3"><span class="px-2 py-0.5 rounded-full bg-secondary text-accent text-xs">${jp.employmentType}</span></td>
        <td class="px-3 py-3 text-xs text-muted-foreground">${jp.datePosted || '—'}</td>
        <td class="px-3 py-3 text-xs text-muted-foreground">${jp.deadline}</td>
        <td class="px-3 py-3 text-sm font-semibold text-foreground text-center">${jp.applicantCount}</td>
        <td class="px-3 py-3">${statusHtml}</td>
        <td class="px-3 py-3">
          <div class="flex gap-1">
            <button class="px-2 py-1 rounded text-xs border border-border text-muted-foreground hover:bg-secondary">View</button>
            ${jp.status === 'Open' ? `<button class="close-jp-btn px-2 py-1 rounded text-xs bg-red-50 text-red-600 border border-red-200 hover:bg-red-100" data-id="${jp.id}">Close</button>` : ''}
          </div>
        </td>
      `;
      jpTbody.appendChild(tr);
    });

    document.querySelectorAll('.close-jp-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        jpList = jpList.map(j => j.id === id ? { ...j, status: 'Closed' } : j);
        db.saveJobs(jpList);
        renderJP();
        renderTracker();
      });
    });
  }

  addJpBtn.addEventListener('click', () => { addJpModal.classList.remove('hidden'); });
  addJpForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('jp-title').value;
    const department = document.getElementById('jp-dept').value;
    jpList.unshift({
      id: `JP-${String(jpList.length + 1).padStart(3, '0')}`,
      title, department, datePosted: '2026-06-16', deadline: document.getElementById('jp-deadline').value, applicantCount: 0, status: 'Open', description: document.getElementById('jp-desc').value, qualifications: document.getElementById('jp-qual').value, slots: Number(document.getElementById('jp-slots').value), employmentType: document.getElementById('jp-type').value, publishToBoard: true
    });
    db.saveJobs(jpList);
    renderJP();
    renderTracker();
    addJpModal.classList.add('hidden');
    addJpForm.reset();
  });


  // --- 3. Applicant Tracker ---
  function renderTracker() {
    trackerContainer.innerHTML = '';
    
    // Create a section for each Open job
    const openJobs = jpList.filter(j => j.status === 'Open');

    if (openJobs.length === 0) {
      trackerContainer.innerHTML = '<div class="text-center text-muted-foreground py-10">No open job postings.</div>';
      return;
    }

    openJobs.forEach(job => {
      // Map 'Applied' etc for apps matched by jobId or jobPostingId (legacy fallback)
      const jobApps = appList.filter(a => a.jobId === job.id || a.jobPostingId === job.id);
      
      const jobDiv = document.createElement('div');
      jobDiv.className = "bg-secondary/10 border border-border rounded-xl p-5";
      
      const header = document.createElement('div');
      header.className = "mb-4 border-b border-border/50 pb-3";
      header.innerHTML = `<h4 class="text-lg font-bold text-foreground">${job.title}</h4><p class="text-sm text-muted-foreground">${job.department} · ${jobApps.length} Applicants</p>`;
      jobDiv.appendChild(header);

      const board = document.createElement('div');
      board.className = "flex gap-3 overflow-x-auto pb-3";

      kanbanStages.forEach(stage => {
        const stageApps = jobApps.filter(a => a.stage === stage);
        
        const col = document.createElement('div');
        col.className = "flex-shrink-0 w-56 bg-secondary/20 rounded-xl p-3 border border-border/50";
        
        col.innerHTML = `
          <div class="flex items-center justify-between mb-3 border-b border-border/50 pb-2">
            <span class="text-xs font-bold text-muted-foreground uppercase tracking-wider">${stage}</span>
            <span class="w-5 h-5 rounded-full bg-secondary text-muted-foreground text-xs flex items-center justify-center font-medium shadow-sm">${stageApps.length}</span>
          </div>
          <div class="space-y-2 min-h-24 apps-container" data-stage="${stage}">
          </div>
        `;

        const appsContainer = col.querySelector('.apps-container');

        if (stageApps.length === 0) {
          appsContainer.innerHTML = `<div class="h-16 border-2 border-dashed border-border rounded-xl flex items-center justify-center"><span class="text-xs text-muted-foreground">Empty</span></div>`;
        }

        stageApps.forEach(app => {
          const initials = app.name.split(' ').map(n => n[0]).join('').slice(0, 2);
          const card = document.createElement('div');
          card.className = "bg-card border border-border rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow relative group";
          card.innerHTML = `
            <div class="flex items-start justify-between gap-1 mb-1.5">
              <div class="w-7 h-7 rounded-full bg-primary flex items-center justify-center flex-shrink-0 shadow-inner">
                <span class="text-white text-[10px] font-bold">${initials}</span>
              </div>
              <i data-lucide="paperclip" style="width: 12px; height: 12px;" class="text-muted-foreground mt-1 flex-shrink-0"></i>
            </div>
            <div class="text-sm font-semibold text-foreground leading-tight">${app.name}</div>
            <div class="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider">${app.appliedDate || app.applicationDate}</div>
            <span class="inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-bold ${stageColor[app.stage]} shadow-sm border border-black/5">${app.stage}</span>
            <div class="flex items-center gap-1 mt-3 pt-2 border-t border-border/50">
              <button class="move-left-btn flex-1 py-1 rounded bg-secondary text-xs text-muted-foreground hover:bg-border transition-colors disabled:opacity-30" ${stage === kanbanStages[0] ? 'disabled' : ''} data-id="${app.id}">←</button>
              <button class="move-right-btn flex-1 py-1 rounded bg-secondary text-xs text-muted-foreground hover:bg-border transition-colors disabled:opacity-30" ${stage === kanbanStages[kanbanStages.length - 1] ? 'disabled' : ''} data-id="${app.id}">→</button>
            </div>
          `;

          if (stage === 'Shortlisted' || stage === 'Applied') {
            const schBtn = document.createElement('button');
            schBtn.className = "w-full mt-2 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-primary text-[11px] font-bold hover:bg-primary hover:text-white transition-colors shadow-sm";
            schBtn.textContent = "Schedule Interview";
            schBtn.addEventListener('click', () => {
              // Open modal immediately and pre-fill name
              openScheduleModal(app.id);
            });
            card.appendChild(schBtn);
          }

          appsContainer.appendChild(card);
        });

        board.appendChild(col);
      });

      jobDiv.appendChild(board);
      trackerContainer.appendChild(jobDiv);
    });

    document.querySelectorAll('.move-left-btn').forEach(btn => {
      btn.addEventListener('click', (e) => moveStage(e.currentTarget.dataset.id, -1));
    });
    document.querySelectorAll('.move-right-btn').forEach(btn => {
      btn.addEventListener('click', (e) => moveStage(e.currentTarget.dataset.id, 1));
    });

    if (typeof lucide !== 'undefined') lucide.createIcons();
  }

  function moveStage(id, dir) {
    const kanbanStagesExtended = ['New', 'Applied', 'Shortlisted', 'Interview Scheduled', 'Interviewed', 'Job Offer', 'Hired', 'Rejected', 'Screening', 'Interview'];
    
    appList = appList.map(a => {
      if (a.id !== id) return a;
      // In JS DB simulator, we match stages. Make sure 'New'/'Screening' map properly
      let currentStage = a.stage;
      if(currentStage === 'New' || currentStage === 'Screening') currentStage = 'Applied';
      if(currentStage === 'Interview') currentStage = 'Interview Scheduled';

      const idx = kanbanStages.indexOf(currentStage);
      let newIdx = Math.max(0, Math.min(kanbanStages.length - 1, idx + dir));
      // fallback
      if(idx === -1) newIdx = dir > 0 ? 1 : 0;
      
      return { ...a, stage: kanbanStages[newIdx] };
    });
    db.saveApps(appList);
    renderTracker();
  }

  // --- 4. Interview Scheduling ---
  function populateApplicantSelect() {
    intApplicantSelect.innerHTML = '<option value="">Select applicant...</option>';
    appList.forEach(a => {
      const opt = document.createElement('option');
      opt.value = a.id;
      opt.textContent = `${a.name} — ${a.role || a.jobTitle}`;
      intApplicantSelect.appendChild(opt);
    });
  }

  function openScheduleModal(appId = null) {
    populateApplicantSelect();
    if (appId) {
      intApplicantSelect.value = appId;
    }
    scheduleIntModal.classList.remove('hidden');
  }

  scheduleIntBtn.addEventListener('click', () => openScheduleModal());

  scheduleIntForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const appId = intApplicantSelect.value;
    const app = appList.find(a => a.id === appId);
    if (!app) return;

    intList.unshift({
      id: `INT-${String(intList.length + 1).padStart(3, '0')}`,
      applicantId: appId, applicantName: app.name, jobTitle: app.jobTitle,
      date: document.getElementById('int-date').value,
      time: document.getElementById('int-time').value,
      format: document.getElementById('int-format').value,
      interviewer: document.getElementById('int-interviewer').value,
      notes: '', status: 'Upcoming'
    });

    // Automatically update stage to 'Interview Scheduled' if they were early stage
    if (['New', 'Applied', 'Shortlisted', 'Screening'].includes(app.stage)) {
      app.stage = 'Interview Scheduled';
      db.saveApps(appList);
    }

    scheduleIntModal.classList.add('hidden');
    scheduleIntForm.reset();
    
    // Show notification on schedule tab
    scheduleNotifMsg.innerHTML = `Interview scheduled for <strong>${app.name}</strong>. Applicant and interviewer have been notified.`;
    scheduleNotif.classList.remove('hidden');
    setTimeout(() => scheduleNotif.classList.add('hidden'), 4000);

    // Switch to scheduling tab if we are not there
    document.querySelector('[data-target="view-scheduling"]').click();
  });

  function renderScheduling() {
    schedulingTbody.innerHTML = '';
    intList.forEach((iv, i) => {
      const tr = document.createElement('tr');
 tr.className = `border-b border-border/50 hover:bg-gray-50 transition-colors cursor-pointer ${i % 2 !== 0 ? 'bg-secondary/10' : ''}`;
      
      tr.innerHTML = `
        <td class="px-3 py-3 text-sm font-medium text-foreground">${iv.applicantName}</td>
        <td class="px-3 py-3 text-xs text-muted-foreground">${iv.jobTitle}</td>
        <td class="px-3 py-3 text-xs text-foreground">${iv.date} ${iv.time}</td>
        <td class="px-3 py-3"><span class="text-xs flex items-center gap-1">${iv.format === 'Virtual' ? `<i data-lucide="video" style="width:12px; height:12px;"></i>` : `<i data-lucide="map-pin" style="width:12px; height:12px;"></i>`}${iv.format}</span></td>
        <td class="px-3 py-3 text-xs text-foreground">${iv.interviewer}</td>
        <td class="px-3 py-3"><span class="px-2 py-0.5 rounded text-xs font-medium ${interviewStatusColor[iv.status]}">${iv.status}</span></td>
        <td class="px-3 py-3">
          ${iv.status === 'Upcoming' ? `<button class="cancel-int-btn px-2 py-1 rounded text-xs bg-red-50 text-red-600 border border-red-200 hover:bg-red-100" data-id="${iv.id}">Cancel</button>` : `<button class="done-int-btn px-2 py-1 rounded text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100" data-id="${iv.id}">Mark Done</button>`}
        </td>
      `;
      schedulingTbody.appendChild(tr);
    });

    document.querySelectorAll('.cancel-int-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        intList = intList.map(x => x.id === e.currentTarget.dataset.id ? { ...x, status: 'Cancelled' } : x);
        renderScheduling();
      });
    });
    
    document.querySelectorAll('.done-int-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        intList = intList.map(x => x.id === e.currentTarget.dataset.id ? { ...x, status: 'Done' } : x);
        // Also update applicant stage
        const iv = intList.find(x => x.id === e.currentTarget.dataset.id);
        const app = appList.find(a => a.id === iv.applicantId);
        if(app && app.stage === 'Interview Scheduled') {
          app.stage = 'Interviewed';
          db.saveApps(appList);
        }
        
        renderScheduling();
        renderTracker();
      });
    });

    // Render Weekly Grid
    weekGrid.innerHTML = '';
    ['Mon Jun 16', 'Tue Jun 17', 'Wed Jun 18', 'Thu Jun 19', 'Fri Jun 20'].forEach(day => {
      const dayDate = `2026-06-${day.slice(-2).trim()}`;
      const dayInterviews = intList.filter(i => i.date === dayDate);
      
      const col = document.createElement('div');
      col.className = "bg-white rounded-xl p-3 min-h-[96px] shadow-sm";
      col.innerHTML = `<div class="text-xs font-bold text-foreground mb-2 pb-1 border-b border-border/50">${day}</div>`;
      
      const list = document.createElement('div');
      list.className = "space-y-1.5";
      
      if (dayInterviews.length === 0) {
        list.innerHTML = `<div class="text-[10px] font-medium text-muted-foreground text-center py-2 bg-secondary/20 rounded-md border border-dashed border-border">No interviews</div>`;
      } else {
        dayInterviews.forEach(iv => {
          list.innerHTML += `
            <div class="px-2 py-1.5 rounded-lg text-xs border border-black/5 ${interviewStatusColor[iv.status]}">
              <div class="font-bold truncate text-[11px]">${iv.applicantName}</div>
              <div class="opacity-80 text-[10px] font-medium mt-0.5">${iv.time} · ${iv.format}</div>
            </div>
          `;
        });
      }
      col.appendChild(list);
      weekGrid.appendChild(col);
    });

    if (typeof lucide !== 'undefined') lucide.createIcons();
  }

  // --- 5. Interview Feedback ---
  function renderFeedback() {
    feedbackNeededList.innerHTML = '';
    const doneInterviews = intList.filter(i => i.status === 'Done');
    const needed = doneInterviews.filter(iv => !fbList.find(f => f.applicantId === iv.applicantId));

    if (needed.length > 0) {
      feedbackNeededContainer.classList.remove('hidden');
      needed.forEach(iv => {
        feedbackNeededList.innerHTML += `
          <div class="flex items-center justify-between bg-white rounded-lg px-3 py-2 shadow-sm">
            <div>
              <span class="text-sm font-bold text-foreground">${iv.applicantName}</span>
              <span class="text-[11px] font-medium text-muted-foreground ml-2">· ${iv.jobTitle} · Interviewed ${iv.date}</span>
            </div>
            <button class="add-fb-btn px-3 py-1 rounded bg-amber-100 text-amber-700 text-[11px] font-bold hover:bg-amber-200 transition-colors" data-app-id="${iv.applicantId}" data-int-id="${iv.id}">Add Feedback</button>
          </div>
        `;
      });
    } else {
      feedbackNeededContainer.classList.add('hidden');
    }

    feedbackList.innerHTML = '';
    if (fbList.length === 0) {
      feedbackList.innerHTML = `<div class="col-span-2 text-center text-muted-foreground py-10">No feedback submitted yet.</div>`;
    }

    fbList.forEach(fb => {
      feedbackList.innerHTML += `
        <div class="bg-card border border-border rounded-xl p-5 shadow-sm">
          <div class="flex items-start justify-between mb-3 border-b border-border/50 pb-3">
            <div>
              <div class="text-base font-bold text-foreground">${fb.applicantName}</div>
              <div class="text-xs font-medium text-muted-foreground mt-0.5">${fb.position}</div>
            </div>
            <div class="text-center px-3 py-1.5 bg-emerald-50 rounded-lg border border-emerald-100 shadow-inner">
              <div class="text-lg font-black text-emerald-700">${fb.overallImpression}</div>
              <div class="text-[10px] font-bold text-emerald-600/70 uppercase">Score</div>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-x-4 gap-y-3 mb-4">
            <div><div class="flex justify-between text-[11px] font-bold mb-1"><span class="text-muted-foreground">Communication</span><span class="text-foreground">${fb.communicationSkills}/5</span></div><div class="h-1.5 bg-secondary rounded-full overflow-hidden"><div class="h-full bg-primary rounded-full shadow-sm" style="width: ${(fb.communicationSkills/5)*100}%"></div></div></div>
            <div><div class="flex justify-between text-[11px] font-bold mb-1"><span class="text-muted-foreground">Technical</span><span class="text-foreground">${fb.technicalKnowledge}/5</span></div><div class="h-1.5 bg-secondary rounded-full overflow-hidden"><div class="h-full bg-primary rounded-full shadow-sm" style="width: ${(fb.technicalKnowledge/5)*100}%"></div></div></div>
            <div><div class="flex justify-between text-[11px] font-bold mb-1"><span class="text-muted-foreground">Culture Fit</span><span class="text-foreground">${fb.cultureFit}/5</span></div><div class="h-1.5 bg-secondary rounded-full overflow-hidden"><div class="h-full bg-primary rounded-full shadow-sm" style="width: ${(fb.cultureFit/5)*100}%"></div></div></div>
            <div><div class="flex justify-between text-[11px] font-bold mb-1"><span class="text-muted-foreground">Problem Solving</span><span class="text-foreground">${fb.problemSolving}/5</span></div><div class="h-1.5 bg-secondary rounded-full overflow-hidden"><div class="h-full bg-primary rounded-full shadow-sm" style="width: ${(fb.problemSolving/5)*100}%"></div></div></div>
          </div>
          <div class="flex items-center justify-between text-[11px] font-bold bg-secondary/30 rounded-lg p-2">
            <span class="text-muted-foreground">By ${fb.evaluatorName}</span>
            <span class="px-2 py-1 rounded-md ${fb.recommendation === 'Hire' ? 'bg-emerald-100 text-emerald-800' : fb.recommendation === 'Reject' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'} shadow-sm border border-black/5">${fb.recommendation}</span>
          </div>
        </div>
      `;
    });

    document.querySelectorAll('.add-fb-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const appId = e.currentTarget.dataset.appId;
        const app = appList.find(a => a.id === appId);
        const intv = intList.find(i => i.id === e.currentTarget.dataset.intId);
        if (!app || !intv) return;

        // Auto generate perfect mock feedback for demo
        fbList.push({
          id: `FB-${String(fbList.length + 1).padStart(3, '0')}`,
          interviewId: intv.id, applicantId: appId, applicantName: app.name, position: app.jobTitle,
          evaluatorName: intv.interviewer, submittedDate: '2026-06-21',
          overallImpression: 5, communicationSkills: 5, technicalKnowledge: 5, cultureFit: 5, problemSolving: 5,
          recommendation: 'Hire', strengths: 'Excellent across the board.', areasOfConcern: 'None.'
        });
        
        // Auto update stage to Job Offer
        app.stage = 'Job Offer';
        db.saveApps(appList);

        renderFeedback();
        renderTracker();
      });
    });
  }

  // --- Initial Render ---
  renderMR();
  renderJP();
  renderTracker();
  renderScheduling();
  renderFeedback();
});
