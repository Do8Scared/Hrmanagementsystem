import { db } from './db.js';

document.addEventListener('DOMContentLoaded', () => {
  if (typeof lucide !== 'undefined') lucide.createIcons();

  const allJobs = db.getJobs();
  const publicJobs = allJobs.filter(j => j.publishToBoard && j.status !== 'Draft');

  let savedJobs = [];
  let filter = 'All';
  let searchKeyword = '';
  let showAll = false;

  const typeStyles = {
    'Full Time':    { badge: 'background: #FEF2F2; color: #6E1216;',   label: 'Full Time'    },
    'Part Time':    { badge: 'background: #FAF5FF; color: #7E22CE;',   label: 'Part Time'    },
    'Contractual':  { badge: 'background: #FFFBEB; color: #B45309;',   label: 'Contractual'  },
    'Internship':   { badge: 'background: #ECFDF5; color: #047857;',   label: 'Internship'   },
  };

  const filtersList = ['All', 'Full Time', 'Part Time', 'Contractual', 'Internship', 'Saved Jobs'];

  // DOM
  const filterContainer   = document.getElementById('filter-container');
  const jobsGrid          = document.getElementById('jobs-grid');
  const jobsCount         = document.getElementById('jobs-count');
  const jobsCountPlural   = document.getElementById('jobs-count-plural');
  const noJobsMsg         = document.getElementById('no-jobs');
  const searchInput       = document.getElementById('search-input');
  const searchBtn         = document.getElementById('search-btn');
  const seeAllContainer   = document.getElementById('see-all-container');
  const seeAllBtn         = document.getElementById('see-all-btn');
  const seeAllText        = document.getElementById('see-all-text');
  const seeAllIcon        = document.getElementById('see-all-icon');
  const mainView          = document.getElementById('main-view');
  const detailsView       = document.getElementById('details-view');
  const applyModal        = document.getElementById('apply-modal');
  const applyForm         = document.getElementById('apply-form');
  const applySuccess      = document.getElementById('apply-success');
  const applySubtitle     = document.getElementById('apply-subtitle');
  const successJobTitle   = document.getElementById('success-job-title');
  const appResumeInput    = document.getElementById('app-resume');
  const fileNameDisplay   = document.getElementById('file-name-display');

  let currentJob = null;

  // ── Filter bar ──────────────────────────────────────────────────────────────
  function renderFilters() {
    filterContainer.innerHTML = '';
    filtersList.forEach(f => {
      let count = 0;
      if (f === 'All')         count = publicJobs.length;
      else if (f === 'Saved Jobs') count = savedJobs.length;
      else                     count = publicJobs.filter(j => j.employmentType === f).length;

      const isActive = filter === f;
      const btn = document.createElement('button');
      btn.className = 'flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold border transition-all';
      btn.style.cssText = isActive
        ? 'background: rgb(110,18,22); border-color: rgb(110,18,22); color: white;'
        : 'border-color: rgb(232,216,200); color: rgb(122,92,80);';

      if (!isActive) {
        btn.onmouseover = () => { btn.style.borderColor = 'rgb(110,18,22)'; };
        btn.onmouseout  = () => { btn.style.borderColor = 'rgb(232,216,200)'; };
      }

      const badgeStyle = isActive
        ? 'background: rgba(255,255,255,0.2); color: white;'
        : 'background: rgb(240,230,216); color: rgb(122,92,80);';

      btn.innerHTML = `${f} <span class="text-xs px-1.5 py-0.5 rounded-full" style="${badgeStyle}">${count}</span>`;
      btn.addEventListener('click', () => { filter = f; renderFilters(); renderJobs(); });
      filterContainer.appendChild(btn);
    });
  }

  // ── Job cards ────────────────────────────────────────────────────────────────
  function renderJobs() {
    const filtered = publicJobs.filter(j => {
      const matchSearch = !searchKeyword ||
        j.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        j.description.toLowerCase().includes(searchKeyword.toLowerCase());
      const matchFilter = filter === 'All' ||
        (filter === 'Saved Jobs' ? savedJobs.includes(j.id) : j.employmentType === filter);
      return matchSearch && matchFilter;
    });

    jobsCount.textContent = filtered.length;
    jobsCountPlural.textContent = filtered.length === 1 ? '' : 's';
    jobsGrid.innerHTML = '';

    if (filtered.length === 0) {
      noJobsMsg.classList.remove('hidden');
      seeAllContainer.classList.add('hidden');
      return;
    }
    noJobsMsg.classList.add('hidden');

    const visibleJobs = showAll ? filtered : filtered.slice(0, 6);

    if (filtered.length > 6) {
      seeAllContainer.classList.remove('hidden');
      seeAllContainer.classList.add('flex');
    } else {
      seeAllContainer.classList.add('hidden');
      seeAllContainer.classList.remove('flex');
    }

    visibleJobs.forEach(job => {
      const isSaved    = savedJobs.includes(job.id);
      const shortDesc  = job.description.length > 100 ? job.description.substring(0, 100) + '…' : job.description;
      const typeStyle  = (typeStyles[job.employmentType] || { badge: 'background: #F3F4F6; color: #4B5563;' }).badge;
      const bookmarkFill = isSaved ? 'currentColor' : 'none';
      const bookmarkColor = isSaved ? 'rgb(110,18,22)' : '#D1D5DB';

      const card = document.createElement('div');
      card.className = 'bg-white border rounded-2xl p-5 flex flex-col transition-all job-card';
      card.style.borderColor = 'rgb(232,216,200)';

      card.innerHTML = `
        <div class="flex items-start justify-between mb-3">
          <span class="px-2.5 py-1 rounded-full text-xs font-bold" style="${typeStyle}">${job.employmentType}</span>
          <div class="flex items-center gap-1">
            <button class="save-btn p-1.5 rounded-lg transition-colors" style="color: ${bookmarkColor};">
              <i data-lucide="bookmark" style="width:15px; height:15px;" fill="${bookmarkFill}"></i>
            </button>
            <button class="p-1.5 rounded-lg transition-colors" style="color: #D1D5DB;">
              <i data-lucide="share-2" style="width:15px; height:15px;"></i>
            </button>
          </div>
        </div>
        <h3 class="font-bold text-sm leading-tight mb-1" style="color: rgb(42,18,21);">${job.title}</h3>
        <div class="flex items-center gap-1 text-xs mb-3" style="color: rgb(122,92,80);">
          <i data-lucide="building-2" style="width:12px; height:12px;"></i> ${job.department}
        </div>
        <p class="text-xs leading-relaxed flex-1 mb-4" style="color: #6B7280;">${shortDesc}</p>
        <div class="job-card-actions">
          <button class="btn-view-details">View Details</button>
          <button class="btn-apply">Apply</button>
        </div>
      `;

      // Save
      card.querySelector('.save-btn').addEventListener('click', e => {
        e.stopPropagation();
        if (isSaved) savedJobs = savedJobs.filter(id => id !== job.id);
        else savedJobs.push(job.id);
        renderFilters();
        renderJobs();
      });

      // View Details
      card.querySelector('.btn-view-details').addEventListener('click', () => openJobDetails(job));

      // Apply
      card.querySelector('.btn-apply').addEventListener('click', () => {
        openJobDetails(job);
        openApplyModal();
      });

      jobsGrid.appendChild(card);
    });

    if (typeof lucide !== 'undefined') lucide.createIcons();
  }

  // ── Search ───────────────────────────────────────────────────────────────────
  searchInput.addEventListener('input', e => { searchKeyword = e.target.value; renderJobs(); });
  searchBtn.addEventListener('click', () => renderJobs());

  seeAllBtn.addEventListener('click', () => {
    showAll = !showAll;
    seeAllText.textContent = showAll ? 'Show Less' : 'See All Jobs';
    seeAllIcon.classList.toggle('rotate-90', showAll);
    renderJobs();
  });

  // ── Detail view ──────────────────────────────────────────────────────────────
  function openJobDetails(job) {
    currentJob = job;
    mainView.classList.add('hidden');
    detailsView.classList.remove('hidden');
    window.scrollTo(0, 0);

    const typeStyle = (typeStyles[job.employmentType] || { badge: 'background: #F3F4F6; color: #4B5563;' }).badge;
    const detailType = document.getElementById('detail-type');
    detailType.style.cssText = typeStyle;
    detailType.textContent = job.employmentType;

    document.getElementById('detail-title').textContent     = job.title;
    document.getElementById('detail-dept').textContent      = job.department;
    document.getElementById('detail-posted').textContent    = job.deadline;
    document.getElementById('detail-deadline').textContent  = job.deadline;
    document.getElementById('detail-slots').textContent     = job.slots + ' slot' + (job.slots > 1 ? 's' : '');
    document.getElementById('detail-dept-box').textContent  = job.department;
    document.getElementById('detail-desc').textContent      = job.description;
    document.getElementById('detail-qualifications').textContent = job.qualifications;

    // Bookmark state
    const bookmarkBtn  = document.getElementById('detail-bookmark-btn');
    const bookmarkIcon = document.getElementById('detail-bookmark-icon');
    updateDetailBookmark(job, bookmarkBtn, bookmarkIcon);
    bookmarkBtn.onclick = () => {
      if (savedJobs.includes(job.id)) savedJobs = savedJobs.filter(id => id !== job.id);
      else savedJobs.push(job.id);
      updateDetailBookmark(job, bookmarkBtn, bookmarkIcon);
    };

    if (typeof lucide !== 'undefined') lucide.createIcons();
  }

  function updateDetailBookmark(job, btn, icon) {
    const isSaved = savedJobs.includes(job.id);
    btn.style.color  = isSaved ? 'rgb(110,18,22)' : '#D1D5DB';
    icon.setAttribute('fill', isSaved ? 'currentColor' : 'none');
  }

  document.getElementById('back-to-jobs-btn').addEventListener('click', () => {
    currentJob = null;
    detailsView.classList.add('hidden');
    mainView.classList.remove('hidden');
    document.getElementById('careers-section').scrollIntoView({ behavior: 'smooth' });
  });

  // ── Apply modal ──────────────────────────────────────────────────────────────
  function openApplyModal() {
    if (!currentJob) return;
    applyModal.classList.remove('hidden');
    applyForm.classList.remove('hidden');
    applySuccess.classList.add('hidden');
    applySubtitle.textContent = `${currentJob.title} · ${currentJob.department}`;
    applyForm.reset();
    fileNameDisplay.textContent = 'Click to upload your resume';
  }

  document.getElementById('detail-apply-btn1').addEventListener('click', openApplyModal);
  document.getElementById('detail-apply-btn2').addEventListener('click', openApplyModal);

  document.getElementById('close-apply-btn').addEventListener('click', () => applyModal.classList.add('hidden'));
  applyModal.addEventListener('click', () => applyModal.classList.add('hidden'));
  document.getElementById('apply-modal-content').addEventListener('click', e => e.stopPropagation());

  appResumeInput.addEventListener('change', e => {
    const file = e.target.files[0];
    fileNameDisplay.textContent = file ? file.name : 'Click to upload your resume';
  });

  applyForm.addEventListener('submit', e => {
    e.preventDefault();
    const firstName = document.getElementById('app-fname').value;
    const lastName  = document.getElementById('app-lname').value;
    const email     = document.getElementById('app-email').value;
    db.addApplication({ name: `${firstName} ${lastName}`, email, role: currentJob.title, jobId: currentJob.id });
    applyForm.classList.add('hidden');
    applySuccess.classList.remove('hidden');
    successJobTitle.textContent = currentJob.title;
  });

  document.getElementById('done-apply-btn').addEventListener('click', () => applyModal.classList.add('hidden'));

  // Init
  renderFilters();
  renderJobs();
});
