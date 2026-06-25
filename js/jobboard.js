import { db } from './db.js';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // --- Mock Data ---
  const allJobs = db.getJobs();

  const publicJobs = allJobs.filter(j => j.publishToBoard && j.status !== 'Draft');
  
  let savedJobs = [];
  let filter = 'All';
  let searchKeyword = '';
  let showAll = false;

  const typeStyles = {
    'Full Time': 'background: var(--secondary); color: var(--accent);',
    'Part Time': 'background: #FAF5FF; color: #7E22CE;',
    'Contractual': 'background: #FFFBEB; color: #B45309;',
    'Internship': 'background: #ECFDF5; color: #047857;',
  };

  const filtersList = ['All', 'Full Time', 'Part Time', 'Contractual', 'Internship', 'Saved Jobs'];

  // DOM Elements
  const filterContainer = document.getElementById('filter-container');
  const jobsGrid = document.getElementById('jobs-grid');
  const jobsCount = document.getElementById('jobs-count');
  const noJobsMsg = document.getElementById('no-jobs');
  const searchInput = document.getElementById('search-input');
  const searchBtn = document.getElementById('search-btn');
  const seeAllContainer = document.getElementById('see-all-container');
  const seeAllBtn = document.getElementById('see-all-btn');
  const seeAllText = document.getElementById('see-all-text');
  const seeAllIcon = document.getElementById('see-all-icon');

  // Main vs Detail Views
  const mainView = document.getElementById('main-view');
  const detailsView = document.getElementById('details-view');
  
  // Application Modal
  const applyModal = document.getElementById('apply-modal');
  const applyForm = document.getElementById('apply-form');
  const applySuccess = document.getElementById('apply-success');
  const applySubtitle = document.getElementById('apply-subtitle');
  const successJobTitle = document.getElementById('success-job-title');
  const appResumeInput = document.getElementById('app-resume');
  const fileNameDisplay = document.getElementById('file-name-display');

  // Currently selected
  let currentJob = null;

  function renderFilters() {
    filterContainer.innerHTML = '';
    filtersList.forEach(f => {
      let count = 0;
      if (f === 'All') count = publicJobs.length;
      else if (f === 'Saved Jobs') count = savedJobs.length;
      else count = publicJobs.filter(j => j.employmentType === f).length;

      const isActive = filter === f;
      
      const btn = document.createElement('button');
      btn.className = `flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all border ${isActive ? 'text-white' : 'text-[#6B7280] bg-white'}`;
          if (isActive) {
            btn.style.background = 'var(--primary)';
            btn.style.borderColor = 'var(--primary)';
          } else {
            btn.style.borderColor = '#E5E7EB';
            btn.onmouseover = () => btn.style.borderColor = 'var(--primary)';
            btn.onmouseout = () => btn.style.borderColor = '#E5E7EB';
          };
      
      const badgeClass = isActive ? 'bg-white/20 text-white' : 'bg-[#F0F0F0] text-[#6B7280]';
      
      btn.innerHTML = `${f} <span class="text-xs px-1.5 py-0.5 rounded-full ${badgeClass}">${count}</span>`;
      
      btn.addEventListener('click', () => {
        filter = f;
        renderFilters();
        renderJobs();
      });
      
      filterContainer.appendChild(btn);
    });
  }

  function renderJobs() {
    const filtered = publicJobs.filter(j => {
      const matchSearch = !searchKeyword || j.title.toLowerCase().includes(searchKeyword.toLowerCase()) || j.description.toLowerCase().includes(searchKeyword.toLowerCase());
      const matchFilter = filter === 'All' || (filter === 'Saved Jobs' ? savedJobs.includes(j.id) : j.employmentType === filter);
      return matchSearch && matchFilter;
    });

    jobsCount.textContent = filtered.length;
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
      const isSaved = savedJobs.includes(job.id);
      const shortDesc = job.description.length > 120 ? job.description.substring(0, 120) + '...' : job.description;
      const typeStyle = typeStyles[job.employmentType] || 'background: #F3F4F6; color: #4B5563;';

      const card = document.createElement('div');
      card.className = "bg-white border border-[#E5E7EB] rounded-2xl p-5 flex flex-col transition-all job-card";
      
      let descHtml = `${shortDesc}`;
      if (job.description.length > 120) {
        descHtml += ` <button class="text-[#2B6CB0] font-medium ml-1 hover:underline learn-more-inline">...See more</button>`;
      }

      card.innerHTML = `
        <div class="flex items-start justify-between mb-3">
          <span class="px-2.5 py-1 rounded-full text-xs font-semibold" style="${typeStyle}">${job.employmentType}</span>
          <div class="flex items-center gap-1">
            <button class="save-btn p-1.5 rounded-lg transition-colors ${isSaved ? 'text-[var(--foreground)]' : 'text-[#D1D5DB] hover:text-[var(--foreground)]'}">
              <i data-lucide="bookmark" class="w-[15px] h-[15px]" fill="${isSaved ? 'currentColor' : 'none'}"></i>
            </button>
            <button class="p-1.5 rounded-lg text-[#D1D5DB] hover:text-[var(--foreground)] transition-colors">
              <i data-lucide="share-2" class="w-[15px] h-[15px]"></i>
            </button>
          </div>
        </div>
        <h3 class="font-bold text-[var(--foreground)] text-base leading-tight mb-1">${job.title}</h3>
        <div class="flex items-center gap-1.5 text-xs text-[#9CA3AF] mb-3">
          <i data-lucide="building-2" class="w-[12px] h-[12px]"></i> ${job.department}
        </div>
        <p class="text-xs text-[#6B7280] leading-relaxed flex-1 mb-4">
          ${descHtml}
        </p>
        <div class="flex items-center justify-between mt-auto">
          <button class="learn-more-btn px-4 py-2 rounded-xl border border-[var(--primary)] text-[var(--foreground)] text-xs font-semibold hover:bg-[var(--foreground)] hover:text-white transition-all">
            Learn More
          </button>
          <span class="text-xs text-[#9CA3AF] px-2.5 py-1 bg-[#F7F8FA] rounded-full">${job.department}</span>
        </div>
      `;

      // Event Listeners
      const saveBtn = card.querySelector('.save-btn');
      saveBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (isSaved) savedJobs = savedJobs.filter(id => id !== job.id);
        else savedJobs.push(job.id);
        renderFilters();
        renderJobs();
      });

      const learnMoreBtn = card.querySelector('.learn-more-btn');
      const inlineLearnMore = card.querySelector('.learn-more-inline');
      
      const openDetails = () => openJobDetails(job);
      
      learnMoreBtn.addEventListener('click', openDetails);
      if (inlineLearnMore) inlineLearnMore.addEventListener('click', openDetails);

      jobsGrid.appendChild(card);
    });

    if (typeof lucide !== 'undefined') lucide.createIcons();
  }

  // --- Search & Filters ---
  searchInput.addEventListener('input', (e) => {
    searchKeyword = e.target.value;
    renderJobs();
  });

  searchBtn.addEventListener('click', () => {
    renderJobs();
  });

  seeAllBtn.addEventListener('click', () => {
    showAll = !showAll;
    seeAllText.textContent = showAll ? 'Show Less' : 'See All Jobs';
    seeAllIcon.classList.toggle('rotate-90', showAll);
    renderJobs();
  });

  // --- Details View ---
  function openJobDetails(job) {
    currentJob = job;
    mainView.classList.add('hidden');
    detailsView.classList.remove('hidden');
    window.scrollTo(0,0);

    const typeStyle = typeStyles[job.employmentType] || 'background: #F3F4F6; color: #4B5563;';
    const detailType = document.getElementById('detail-type');
    const typeStyle = typeStyles[job.employmentType] || 'background: #F3F4F6; color: #4B5563;';
        detailType.className = `inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3`;
        detailType.style.cssText = typeStyle;
    detailType.textContent = job.employmentType;

    document.getElementById('detail-title').textContent = job.title;
    document.getElementById('detail-dept').textContent = job.department;
    document.getElementById('detail-posted').textContent = job.datePosted;
    document.getElementById('detail-deadline').textContent = job.deadline;
    document.getElementById('detail-slots').textContent = job.slots;
    document.getElementById('detail-dept-box').textContent = job.department;
    document.getElementById('detail-desc').textContent = job.description;
    document.getElementById('detail-qualifications').textContent = job.qualifications;
  }

  document.getElementById('back-to-jobs-btn').addEventListener('click', () => {
    currentJob = null;
    detailsView.classList.add('hidden');
    mainView.classList.remove('hidden');
    window.scrollTo(0,0);
  });

  // --- Apply Modal ---
  function openApplyModal() {
    if (!currentJob) return;
    applyModal.classList.remove('hidden');
    applyForm.classList.remove('hidden');
    applySuccess.classList.add('hidden');
    applySubtitle.textContent = `${currentJob.title} · ${currentJob.department}`;
    
    // Reset form
    applyForm.reset();
    fileNameDisplay.textContent = 'Click to upload your resume';
  }

  document.getElementById('detail-apply-btn1').addEventListener('click', openApplyModal);
  document.getElementById('detail-apply-btn2').addEventListener('click', openApplyModal);

  document.getElementById('close-apply-btn').addEventListener('click', () => {
    applyModal.classList.add('hidden');
  });

  applyModal.addEventListener('click', () => {
    applyModal.classList.add('hidden');
  });

  document.getElementById('apply-modal-content').addEventListener('click', (e) => {
    e.stopPropagation();
  });

  appResumeInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      fileNameDisplay.textContent = file.name;
    } else {
      fileNameDisplay.textContent = 'Click to upload your resume';
    }
  });

  applyForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Save to DB simulator
    const name = document.getElementById('app-name').value;
    const email = document.getElementById('app-email').value;
    
    db.addApplication({
      name: name,
      email: email,
      role: currentJob.title,
      jobId: currentJob.id
    });

    applyForm.classList.add('hidden');
    applySuccess.classList.remove('hidden');
    successJobTitle.textContent = currentJob.title;
  });

  document.getElementById('done-apply-btn').addEventListener('click', () => {
    applyModal.classList.add('hidden');
  });

  // Initial render
  renderFilters();
  renderJobs();
});
