import { db } from './db.js';

document.addEventListener('DOMContentLoaded', () => {
  if (typeof lucide !== 'undefined') lucide.createIcons();

  // Published jobs from the shared db — filtered to board-visible, non-draft entries
  const publicJobs = db.getJobs().filter(j => j.publishToBoard && j.status !== 'Draft');

  // Page names, filter options, and employment type badge styles
  const PAGES   = ['home', 'about', 'services', 'careers', 'contact'];
  const FILTERS = ['All', 'Full Time', 'Part Time', 'Contractual', 'Internship', 'Saved Jobs'];
  const TYPE_STYLE = {
    'Full Time':   'background:#FEF2F2; color:#6E1216;',
    'Part Time':   'background:#FAF5FF; color:#7E22CE;',
    'Contractual': 'background:#FFFBEB; color:#B45309;',
    'Internship':  'background:#ECFDF5; color:#047857;',
  };

  // State — active filter, search text, saved job IDs, pagination toggle, current job
  let activeFilter = 'All';
  let searchQuery  = '';
  let savedJobs    = [];
  let showAll      = false;
  let currentJob   = null;

  // Page routing — hides all pages, shows the target, and updates nav active state
  function showPage(page) {
    PAGES.forEach(p => document.getElementById('page-' + p).classList.add('hidden'));
    document.getElementById('page-' + page).classList.remove('hidden');
    document.querySelectorAll('.nav-btn').forEach(btn => {
      const active = btn.dataset.nav === page;
      btn.style.background = active ? '#6E1216' : 'transparent';
      btn.style.color      = active ? '#ffffff' : '#7A5C50';
    });
    if (page === 'careers') {
      document.getElementById('careers-list-view').classList.remove('hidden');
      document.getElementById('careers-detail-view').classList.add('hidden');
    }
    window.scrollTo(0, 0);
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }

  // Global click delegation — handles all data-nav buttons across every page and the footer
  document.addEventListener('click', e => {
    const btn = e.target.closest('[data-nav]');
    if (btn && btn.dataset.nav) showPage(btn.dataset.nav);
  });

  // Featured jobs — renders the first 3 open positions on the Home page
  function renderFeaturedJobs() {
    const grid = document.getElementById('featured-jobs-grid');
    if (!grid) return;
    grid.innerHTML = '';
    publicJobs.slice(0, 3).forEach(job => {
      const typeStyle = TYPE_STYLE[job.employmentType] || 'background:#F3F4F6; color:#4B5563;';
      const card = document.createElement('div');
      card.className = 'bg-white rounded-xl border p-5 hover:shadow-md transition-all';
      card.style.borderColor = '#E8D8C8';
      card.innerHTML = `
        <span class="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold mb-3" style="${typeStyle}">${job.employmentType}</span>
        <h3 class="font-bold text-sm mb-1" style="color:#2A1215;">${job.title}</h3>
        <div class="text-xs mb-4 flex items-center gap-1" style="color:#7A5C50;"><i data-lucide="building-2" style="width:11px;height:11px;"></i> ${job.department}</div>
        <button class="apply-featured w-full py-2 rounded-xl text-xs font-bold border-2 transition-all" style="border-color:#6E1216; color:#6E1216;">Apply Now</button>
      `;
      const applyBtn = card.querySelector('.apply-featured');
      applyBtn.addEventListener('mouseenter', e => { e.currentTarget.style.background = '#6E1216'; e.currentTarget.style.color = '#fff'; });
      applyBtn.addEventListener('mouseleave', e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#6E1216'; });
      applyBtn.addEventListener('click', () => showPage('careers'));
      grid.appendChild(card);
    });
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }

  // Filter bar — employment type pills with per-type counts for the Careers page
  function renderFilters() {
    const container = document.getElementById('filter-container');
    if (!container) return;
    container.innerHTML = '';
    FILTERS.forEach(f => {
      const count  = f === 'All' ? publicJobs.length : f === 'Saved Jobs' ? savedJobs.length : publicJobs.filter(j => j.employmentType === f).length;
      const active = activeFilter === f;
      const btn    = document.createElement('button');
      btn.className  = 'flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold border transition-all';
      btn.style.cssText = active ? 'background:#6E1216; border-color:#6E1216; color:#fff;' : 'border-color:#E8D8C8; color:#7A5C50;';
      if (!active) {
        btn.onmouseover = () => { btn.style.borderColor = '#6E1216'; };
        btn.onmouseout  = () => { btn.style.borderColor = '#E8D8C8'; };
      }
      const badgeStyle = active ? 'background:rgba(255,255,255,0.2); color:#fff;' : 'background:#F0E6D8; color:#7A5C50;';
      btn.innerHTML = `${f} <span class="text-xs px-1.5 py-0.5 rounded-full" style="${badgeStyle}">${count}</span>`;
      btn.addEventListener('click', () => { activeFilter = f; renderFilters(); renderJobs(); });
      container.appendChild(btn);
    });
  }

  // Job grid — filters jobs by search and type, paginates to 6, renders cards with actions
  function renderJobs() {
    const grid     = document.getElementById('jobs-grid');
    const countEl  = document.getElementById('jobs-count');
    const pluralEl = document.getElementById('jobs-count-plural');
    const noJobs   = document.getElementById('no-jobs');
    const seeAll   = document.getElementById('see-all-container');
    if (!grid) return;
    const filtered = publicJobs.filter(j => {
      const matchSearch = !searchQuery || j.title.toLowerCase().includes(searchQuery.toLowerCase()) || j.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchFilter = activeFilter === 'All' || (activeFilter === 'Saved Jobs' ? savedJobs.includes(j.id) : j.employmentType === activeFilter);
      return matchSearch && matchFilter;
    });
    countEl.textContent  = filtered.length;
    pluralEl.textContent = filtered.length === 1 ? '' : 's';
    grid.innerHTML = '';
    if (filtered.length === 0) {
      noJobs.classList.remove('hidden');
      seeAll.classList.add('hidden');
      return;
    }
    noJobs.classList.add('hidden');
    const visible = showAll ? filtered : filtered.slice(0, 6);
    if (filtered.length > 6) { seeAll.classList.remove('hidden'); seeAll.classList.add('flex'); }
    else { seeAll.classList.add('hidden'); seeAll.classList.remove('flex'); }
    visible.forEach(job => {
      const isSaved   = savedJobs.includes(job.id);
      const typeStyle = TYPE_STYLE[job.employmentType] || 'background:#F3F4F6; color:#4B5563;';
      const shortDesc = job.description.length > 100 ? job.description.substring(0, 100) + '…' : job.description;
      const card = document.createElement('div');
      card.className = 'bg-white border rounded-2xl p-5 flex flex-col transition-all job-card';
      card.style.borderColor = '#E8D8C8';
      card.innerHTML = `
        <div class="flex items-start justify-between mb-3">
          <span class="px-2.5 py-1 rounded-full text-xs font-bold" style="${typeStyle}">${job.employmentType}</span>
          <div class="flex items-center gap-1">
            <button class="save-btn p-1.5 rounded-lg transition-colors" style="color:${isSaved ? '#6E1216' : '#D1D5DB'};"><i data-lucide="bookmark" style="width:15px;height:15px;" fill="${isSaved ? 'currentColor' : 'none'}"></i></button>
            <button class="p-1.5 rounded-lg" style="color:#D1D5DB;"><i data-lucide="share-2" style="width:15px;height:15px;"></i></button>
          </div>
        </div>
        <h3 class="font-bold text-sm leading-tight mb-1" style="color:#2A1215;">${job.title}</h3>
        <div class="flex items-center gap-1 text-xs mb-3" style="color:#7A5C50;"><i data-lucide="building-2" style="width:12px;height:12px;"></i> ${job.department}</div>
        <p class="text-xs leading-relaxed flex-1 mb-4" style="color:#6B7280;">${shortDesc}</p>
        <div class="job-card-actions">
          <button class="btn-view">View Details</button>
          <button class="btn-apply-card">Apply</button>
        </div>
      `;
      card.querySelector('.save-btn').addEventListener('click', ev => {
        ev.stopPropagation();
        savedJobs = isSaved ? savedJobs.filter(id => id !== job.id) : [...savedJobs, job.id];
        renderFilters();
        renderJobs();
      });
      card.querySelector('.btn-view').addEventListener('click', () => openJobDetails(job));
      card.querySelector('.btn-apply-card').addEventListener('click', () => { openJobDetails(job); openApplyModal(); });
      grid.appendChild(card);
    });
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }

  // Job detail view — populates the full job description panel and bookmark state
  function openJobDetails(job) {
    currentJob = job;
    document.getElementById('careers-list-view').classList.add('hidden');
    document.getElementById('careers-detail-view').classList.remove('hidden');
    window.scrollTo(0, 0);
    const typeStyle  = TYPE_STYLE[job.employmentType] || 'background:#F3F4F6; color:#4B5563;';
    const detailType = document.getElementById('detail-type');
    detailType.style.cssText = typeStyle;
    detailType.textContent   = job.employmentType;
    document.getElementById('detail-title').textContent        = job.title;
    document.getElementById('detail-dept').textContent         = job.department;
    document.getElementById('detail-deadline').textContent     = job.deadline;
    document.getElementById('detail-deadline-box').textContent = job.deadline;
    document.getElementById('detail-slots').textContent        = job.slots + ' slot' + (job.slots > 1 ? 's' : '');
    document.getElementById('detail-dept-box').textContent     = job.department;
    document.getElementById('detail-desc').textContent         = job.description;
    document.getElementById('detail-qualifications').textContent = job.qualifications;
    const bookmarkBtn  = document.getElementById('detail-bookmark-btn');
    const bookmarkIcon = document.getElementById('detail-bookmark-icon');
    updateBookmark(job, bookmarkBtn, bookmarkIcon);
    bookmarkBtn.onclick = () => {
      savedJobs = savedJobs.includes(job.id) ? savedJobs.filter(id => id !== job.id) : [...savedJobs, job.id];
      updateBookmark(job, bookmarkBtn, bookmarkIcon);
    };
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }

  // Bookmark helper — syncs the icon fill and button color to saved state
  function updateBookmark(job, btn, icon) {
    const saved = savedJobs.includes(job.id);
    btn.style.color = saved ? '#6E1216' : '#D1D5DB';
    icon.setAttribute('fill', saved ? 'currentColor' : 'none');
  }

  // Back to jobs — returns from the detail view to the job grid
  document.getElementById('back-to-jobs-btn').addEventListener('click', () => {
    currentJob = null;
    document.getElementById('careers-detail-view').classList.add('hidden');
    document.getElementById('careers-list-view').classList.remove('hidden');
    window.scrollTo(0, 0);
  });

  // Search input — live-filters the grid as the user types
  document.getElementById('search-input').addEventListener('input', e => { searchQuery = e.target.value; renderJobs(); });
  document.getElementById('search-btn').addEventListener('click', () => renderJobs());

  // See all toggle — expands or collapses the grid beyond 6 cards
  document.getElementById('see-all-btn').addEventListener('click', () => {
    showAll = !showAll;
    document.getElementById('see-all-text').textContent = showAll ? 'Show Less' : 'See All Jobs';
    document.getElementById('see-all-icon').style.transform = showAll ? 'rotate(90deg)' : 'none';
    renderJobs();
  });

  // Apply modal — resets and opens the application form for the selected job
  function openApplyModal() {
    if (!currentJob) return;
    const modal = document.getElementById('apply-modal');
    modal.classList.remove('hidden');
    document.getElementById('apply-form').classList.remove('hidden');
    document.getElementById('apply-success').style.display = 'none';
    document.getElementById('apply-subtitle').textContent = `${currentJob.title} · ${currentJob.department}`;
    document.getElementById('apply-form').reset();
    document.getElementById('file-name-display').textContent = 'Click to upload your resume';
  }

  document.getElementById('detail-apply-btn').addEventListener('click', openApplyModal);
  document.getElementById('detail-apply-btn2').addEventListener('click', openApplyModal);
  document.getElementById('close-apply-btn').addEventListener('click', () => document.getElementById('apply-modal').classList.add('hidden'));
  document.getElementById('apply-modal').addEventListener('click', () => document.getElementById('apply-modal').classList.add('hidden'));
  document.getElementById('apply-modal-content').addEventListener('click', e => e.stopPropagation());

  document.getElementById('app-resume').addEventListener('change', e => {
    const file = e.target.files[0];
    document.getElementById('file-name-display').textContent = file ? file.name : 'Click to upload your resume';
  });

  // Apply form — saves the application to db and shows the success state
  document.getElementById('apply-form').addEventListener('submit', e => {
    e.preventDefault();
    const firstName = document.getElementById('app-fname').value;
    const lastName  = document.getElementById('app-lname').value;
    const email     = document.getElementById('app-email').value;
    db.addApplication({ name: `${firstName} ${lastName}`, email, role: currentJob.title, jobId: currentJob.id });
    document.getElementById('apply-form').classList.add('hidden');
    const success = document.getElementById('apply-success');
    success.style.display = 'flex';
    document.getElementById('success-job-title').textContent = currentJob.title;
    if (typeof lucide !== 'undefined') lucide.createIcons();
  });

  document.getElementById('done-apply-btn').addEventListener('click', () => document.getElementById('apply-modal').classList.add('hidden'));

  // Contact form — shows a success message then resets after 5 seconds
  document.getElementById('contact-form').addEventListener('submit', e => {
    e.preventDefault();
    document.getElementById('contact-form').style.display = 'none';
    const success = document.getElementById('contact-success');
    success.style.display       = 'flex';
    success.style.flexDirection = 'column';
    success.style.alignItems    = 'center';
    if (typeof lucide !== 'undefined') lucide.createIcons();
    setTimeout(() => {
      success.style.display = 'none';
      document.getElementById('contact-form').style.display = '';
      document.getElementById('contact-form').reset();
    }, 5000);
  });

  // Init — populate all dynamic sections on first load
  renderFeaturedJobs();
  renderFilters();
  renderJobs();
});
