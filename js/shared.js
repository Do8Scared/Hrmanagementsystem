document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // --- Dropdown Logic ---
  const notifBtn = document.getElementById('notif-btn');
  const notifDropdown = document.getElementById('notif-dropdown');
  
  const profileBtn = document.getElementById('profile-btn');
  const profileDropdown = document.getElementById('profile-dropdown');
  const profileChevron = document.getElementById('profile-chevron');

  function toggleDropdown(dropdown, button, chevron = null) {
    if (!dropdown) return;
    const isHidden = dropdown.classList.contains('hidden');
    // Hide all
    if (notifDropdown) notifDropdown.classList.add('hidden');
    if (profileDropdown) profileDropdown.classList.add('hidden');
    if (profileChevron) profileChevron.classList.remove('rotate-180');

    if (isHidden) {
      dropdown.classList.remove('hidden');
      if (chevron) chevron.classList.add('rotate-180');
    }
  }

  if (notifBtn) {
    notifBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleDropdown(notifDropdown, notifBtn);
    });
  }

  if (profileBtn) {
    profileBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleDropdown(profileDropdown, profileBtn, profileChevron);
    });
  }

  document.addEventListener('click', () => {
    if (notifDropdown) notifDropdown.classList.add('hidden');
    if (profileDropdown) profileDropdown.classList.add('hidden');
    if (profileChevron) profileChevron.classList.remove('rotate-180');
  });

  [notifDropdown, profileDropdown].forEach(el => {
    if (el) el.addEventListener('click', (e) => e.stopPropagation());
  });

  // --- Sidebar Logic ---
  const sidebarToggle = document.getElementById('sidebar-toggle');
  const sidebar = document.getElementById('sidebar');
  const sidebarLogoFull = document.getElementById('sidebar-logo-full');
  const sidebarLogoMini = document.getElementById('sidebar-logo-mini');
  const sidebarLogoContainer = document.getElementById('sidebar-logo-container');
  const sidebarRole = document.getElementById('sidebar-role');
  const navLabels = document.querySelectorAll('.nav-label');
  const navIndicators = document.querySelectorAll('.nav-indicator');
  const sidebarUserFull = document.getElementById('sidebar-user-full');
  const sidebarUserMini = document.getElementById('sidebar-user-mini');
  const menuIcon = document.getElementById('menu-icon');

  let sidebarOpen = true;

  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', () => {
      sidebarOpen = !sidebarOpen;

      if (sidebarOpen) {
        sidebar.classList.remove('w-16');
        sidebar.classList.add('w-64');
        
        if (sidebarLogoContainer) {
          sidebarLogoContainer.classList.remove('px-2', 'justify-center');
          sidebarLogoContainer.classList.add('px-3');
        }
        
        if (sidebarLogoFull) sidebarLogoFull.classList.remove('hidden');
        if (sidebarLogoMini) sidebarLogoMini.classList.add('hidden');
        
        if (sidebarRole) sidebarRole.classList.remove('hidden');
        
        navLabels.forEach(lbl => lbl.classList.remove('hidden'));
        navIndicators.forEach(ind => ind.classList.remove('hidden'));
        
        if (sidebarUserFull) sidebarUserFull.classList.remove('hidden');
        if (sidebarUserMini) sidebarUserMini.classList.add('hidden');
        
        if (menuIcon) menuIcon.setAttribute('data-lucide', 'x');
      } else {
        sidebar.classList.remove('w-64');
        sidebar.classList.add('w-16');
        
        if (sidebarLogoContainer) {
          sidebarLogoContainer.classList.remove('px-3');
          sidebarLogoContainer.classList.add('px-2', 'justify-center');
        }
        
        if (sidebarLogoFull) sidebarLogoFull.classList.add('hidden');
        if (sidebarLogoMini) sidebarLogoMini.classList.remove('hidden');
        
        if (sidebarRole) sidebarRole.classList.add('hidden');
        
        navLabels.forEach(lbl => lbl.classList.add('hidden'));
        navIndicators.forEach(ind => ind.classList.add('hidden'));
        
        if (sidebarUserFull) sidebarUserFull.classList.add('hidden');
        if (sidebarUserMini) sidebarUserMini.classList.remove('hidden');
        
        if (menuIcon) menuIcon.setAttribute('data-lucide', 'menu');
      }
      
      // Re-initialize icon since we changed the data-lucide attribute on menuIcon
      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      }
    });
  }

  // --- Global Logout Logic ---
  document.addEventListener('click', (e) => {
    // Traverse up to find the clicked button
    let target = e.target;
    while (target && target !== document) {
      if (target.tagName === 'BUTTON') {
        const title = target.getAttribute('title') || '';
        const text = target.textContent || '';
        if (title.toLowerCase().includes('log out') || title.toLowerCase().includes('logout') || 
            text.toLowerCase().includes('log out') || text.toLowerCase().includes('logout')) {
          
          e.preventDefault();
          // Find path to index.html depending on current depth
          const isRoot = window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('jobboard.html');
          const isPortal = window.location.pathname.includes('/portals/');
          
          if (isPortal) {
            window.location.href = '../../index.html';
          } else {
            window.location.href = 'index.html';
          }
          return;
        }

        // --- Sidebar Navigation Logic ---
        const navLabel = target.querySelector('.nav-label');
        if (target.classList.contains('nav-item') || navLabel) {
          const btnText = (navLabel ? navLabel.textContent : text).trim().toLowerCase();
          const pathParts = window.location.pathname.split('/');
          const currentRole = pathParts[pathParts.length - 2]; // e.g. 'admin', 'manager', 'employee'
          
          if (!['admin', 'manager', 'employee'].includes(currentRole)) return;
          
          e.preventDefault();
          let targetPage = '';
          
          if (btnText.includes('dashboard')) targetPage = `${currentRole}-dashboard.html`;
          else if (btnText.includes('employee management')) targetPage = `${currentRole}-employees.html`;
          else if (btnText.includes('payroll')) targetPage = `${currentRole}-payroll.html`;
          else if (btnText.includes('attendance')) targetPage = `${currentRole}-attendance.html`;
          else if (btnText.includes('leave')) targetPage = `${currentRole}-leave.html`;
          else if (btnText.includes('recruitment')) targetPage = `${currentRole}-recruitment.html`;
          else if (btnText.includes('hr admin') || btnText.includes('hr cases')) targetPage = currentRole === 'admin' ? 'admin-hr.html' : 'employee-hrcases.html';
          else if (btnText.includes('announcements')) targetPage = `${currentRole}-announcements.html`;
          else if (btnText.includes('profile')) targetPage = `${currentRole}-profile.html`;
          else if (btnText.includes('payslip')) targetPage = `${currentRole}-payslips.html`;
          else if (btnText.includes('performance')) targetPage = `${currentRole}-performance.html`;
          else if (btnText.includes('interview')) targetPage = `${currentRole}-interviews.html`;
          else if (btnText.includes('manpower')) targetPage = `${currentRole}-manpower.html`;
          
          if (targetPage) {
            window.location.href = targetPage;
          }
        }

        // --- Switch Role Logic ---
        if (text.toLowerCase().includes('switch to manager')) {
          e.preventDefault();
          window.location.href = '../manager/manager-dashboard.html';
        } else if (text.toLowerCase().includes('switch to admin')) {
          e.preventDefault();
          window.location.href = '../admin/admin-dashboard.html';
        } else if (text.toLowerCase().includes('switch to employee')) {
          e.preventDefault();
          window.location.href = '../employee/employee-dashboard.html';
        }
      }
      target = target.parentNode;
    }
  });
});
