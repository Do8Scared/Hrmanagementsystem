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

  // --- Portal SPA-style Navigation ---
  const mainContainer = document.querySelector('main#main-content') || document.querySelector('main.flex-1.overflow-y-auto') || document.querySelector('main');
  const headerTitle = document.querySelector('header h1, header h2');
  const sidebarNavItems = document.querySelectorAll('.nav-item');

  const portalCategory = (() => {
    const path = window.location.pathname;
    if (path.includes('/portals/admin/')) return 'admin';
    if (path.includes('/portals/manager/')) return 'manager';
    if (path.includes('/portals/employee/')) return 'employee';
    return null;
  })();

  const normalizeLabel = (text) => text.toLowerCase().replace(/[^a-z0-9&\/ ]+/g, '').replace(/\s+/g, ' ').trim();

  const portalRouteMap = {
    admin: {
      'dashboard': 'admin-dashboard.html',
      'employee management': 'admin-employees.html',
      'payroll & attendance': 'admin-payroll.html',
      'payroll': 'admin-payroll.html',
      'leave management': 'admin-leave.html',
      'leave mgmt': 'admin-leave.html',
      'recruitment': 'admin-recruitment.html',
      'hr admin / er': 'admin-hr.html',
      'employee hub': 'admin-employees.html',
      'announcements': 'admin-announcements.html',
      'attendance': 'admin-attendance.html',
      'performance': 'admin-performance.html'
    },
    manager: {
      'dashboard': 'manager-dashboard.html',
      'interviews': 'manager-interviews.html',
      'manpower requests': 'manager-manpower.html',
      'manpower': 'manager-manpower.html',
      'announcements': 'manager-dashboard.html'
    },
    employee: {
      'dashboard': 'employee-dashboard.html',
      'my profile': 'employee-profile.html',
      'my attendance': 'employee-attendance.html',
      'my leaves': 'employee-leave.html',
      'my payslips': 'employee-payslips.html',
      'my performance': 'employee-performance.html',
      'hr admin / er cases': 'employee-hrcases.html',
      'hr admin / er': 'employee-hrcases.html',
      'performance': 'employee-performance.html',
      'attendance': 'employee-attendance.html',
      'payslips': 'employee-payslips.html',
      'leave': 'employee-leave.html'
    }
  };

  const routeTitleMap = {
    'admin-dashboard.html': 'Dashboard',
    'admin-employees.html': 'Employee Management',
    'admin-payroll.html': 'Payroll & Attendance',
    'admin-leave.html': 'Leave Management',
    'admin-recruitment.html': 'Recruitment',
    'admin-hr.html': 'HR Admin / ER',
    'admin-announcements.html': 'Announcements',
    'admin-attendance.html': 'Attendance',
    'admin-performance.html': 'Performance',
    'manager-dashboard.html': 'Manager Dashboard',
    'manager-interviews.html': 'Interviews',
    'manager-manpower.html': 'Manpower Requests',
    'employee-dashboard.html': 'Dashboard',
    'employee-profile.html': 'My Profile',
    'employee-attendance.html': 'My Attendance',
    'employee-leave.html': 'My Leaves',
    'employee-payslips.html': 'My Payslips',
    'employee-performance.html': 'My Performance',
    'employee-hrcases.html': 'HR Admin / ER Cases'
  };

  const getRouteFromNavItem = (item) => {
    if (!item) return null;
    const href = item.getAttribute('href');
    if (href && href.trim() && !href.startsWith('#') && !href.startsWith('javascript:')) {
      return href.split('#')[0];
    }
    const routeAttr = item.dataset.route;
    if (routeAttr) return routeAttr;

    const label = item.querySelector('.nav-label')?.textContent || item.textContent || '';
    const normalized = normalizeLabel(label);
    return portalCategory && portalRouteMap[portalCategory][normalized] ? portalRouteMap[portalCategory][normalized] : null;
  };

  const setActiveNavItem = (activeItem) => {
    sidebarNavItems.forEach((item) => {
      item.classList.remove('active');
      if (item.querySelector('span.nav-indicator')) {
        item.querySelector('span.nav-indicator').classList.add('hidden');
      }
    });
    if (!activeItem) return;
    activeItem.classList.add('active');
    const indicator = activeItem.querySelector('span.nav-indicator');
    if (indicator) indicator.classList.remove('hidden');
  };

  const updateHeaderTitle = (titleText) => {
    if (!titleText || !headerTitle) return;
    headerTitle.textContent = titleText;
  };

  const appendPageScripts = async (htmlDoc) => {
    const scripts = Array.from(htmlDoc.querySelectorAll('script[src]'))
      .filter((script) => {
        const src = script.getAttribute('src');
        return src && !src.includes('shared.js') && !src.includes('tailwindcss.com') && !src.includes('unpkg.com/lucide') && !src.includes('cdn.jsdelivr.net/npm/chart.js');
      });

    for (const script of scripts) {
      const src = script.getAttribute('src');
      if (!src) continue;
      const existing = document.querySelector(`script[src="${src}"]`);
      if (existing) continue;

      await new Promise((resolve, reject) => {
        const newScript = document.createElement('script');
        newScript.src = src;
        newScript.async = false;
        newScript.onload = resolve;
        newScript.onerror = () => resolve();
        document.body.appendChild(newScript);
      });
    }
  };

  const loadPage = async (targetPath, pushState = true, clickedItem = null) => {
    if (!mainContainer || !targetPath) return;
    const absoluteUrl = new URL(targetPath, window.location.href).href;

    try {
      const response = await fetch(absoluteUrl, { cache: 'no-store' });
      if (!response.ok) return;
      const htmlText = await response.text();
      const parser = new DOMParser();
      const newDoc = parser.parseFromString(htmlText, 'text/html');
      const newMain = newDoc.querySelector('main#main-content') || newDoc.querySelector('main.flex-1.overflow-y-auto') || newDoc.querySelector('main');
      if (newMain) {
        mainContainer.innerHTML = newMain.innerHTML;
      }

      const newTitle = newDoc.title || routeTitleMap[targetPath] || routeTitleMap[targetPath.split('/').pop()] || '';
      if (newTitle) {
        document.title = newTitle.includes('Corazon Travel') ? newTitle : `${newTitle} - Corazon Travel and Tours`;
        updateHeaderTitle(routeTitleMap[targetPath.split('/').pop()] || newTitle);
      }

      await appendPageScripts(newDoc);

      if (pushState) {
        const route = targetPath.split('/').pop();
        history.pushState({ path: route }, '', route);
      }

      if (clickedItem) {
        setActiveNavItem(clickedItem);
      } else {
        setActiveByPath(targetPath.split('/').pop());
      }
    } catch (error) {
      console.warn('Portal navigation failed:', error);
    }
  };

  const setActiveByPath = (path) => {
    if (!path) return;
    sidebarNavItems.forEach((item) => {
      const route = getRouteFromNavItem(item);
      if (route && route.split('/').pop() === path) {
        setActiveNavItem(item);
      }
    });
  };

  const linkClickHandler = (event, item) => {
    const targetRoute = getRouteFromNavItem(item);
    if (!targetRoute) return;

    const normalizedTarget = targetRoute.split('#')[0];
    const currentPage = window.location.pathname.split('/').pop();
    if (normalizedTarget === currentPage) {
      setActiveNavItem(item);
      event.preventDefault();
      return;
    }

    event.preventDefault();
    loadPage(normalizedTarget, true, item);
  };

  sidebarNavItems.forEach((item) => {
    item.addEventListener('click', (event) => {
      if (item.tagName.toLowerCase() === 'a') {
        linkClickHandler(event, item);
        return;
      }
      const route = getRouteFromNavItem(item);
      if (route) {
        event.preventDefault();
        loadPage(route, true, item);
      }
    });
  });

  window.addEventListener('popstate', (event) => {
    const route = event.state?.path || window.location.pathname.split('/').pop();
    if (route) {
      loadPage(route, false); 
    }
  });

  setActiveByPath(window.location.pathname.split('/').pop());
});
