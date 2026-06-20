document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide icons
  lucide.createIcons();

  // --- Dropdown Logic ---
  const notifBtn = document.getElementById('notif-btn');
  const notifDropdown = document.getElementById('notif-dropdown');
  
  const profileBtn = document.getElementById('profile-btn');
  const profileDropdown = document.getElementById('profile-dropdown');
  const profileChevron = document.getElementById('profile-chevron');

  function toggleDropdown(dropdown, button, chevron = null) {
    const isHidden = dropdown.classList.contains('hidden');
    // Hide all
    notifDropdown.classList.add('hidden');
    profileDropdown.classList.add('hidden');
    if (profileChevron) profileChevron.classList.remove('rotate-180');

    if (isHidden) {
      dropdown.classList.remove('hidden');
      if (chevron) chevron.classList.add('rotate-180');
    }
  }

  notifBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleDropdown(notifDropdown, notifBtn);
  });

  profileBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleDropdown(profileDropdown, profileBtn, profileChevron);
  });

  document.addEventListener('click', () => {
    notifDropdown.classList.add('hidden');
    profileDropdown.classList.add('hidden');
    profileChevron.classList.remove('rotate-180');
  });

  [notifDropdown, profileDropdown].forEach(el => {
    el.addEventListener('click', (e) => e.stopPropagation());
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

  sidebarToggle.addEventListener('click', () => {
    sidebarOpen = !sidebarOpen;

    if (sidebarOpen) {
      sidebar.classList.remove('w-16');
      sidebar.classList.add('w-64');
      
      sidebarLogoContainer.classList.remove('px-2', 'justify-center');
      sidebarLogoContainer.classList.add('px-3');
      
      sidebarLogoFull.classList.remove('hidden');
      sidebarLogoMini.classList.add('hidden');
      
      sidebarRole.classList.remove('hidden');
      
      navLabels.forEach(lbl => lbl.classList.remove('hidden'));
      navIndicators.forEach(ind => ind.classList.remove('hidden'));
      
      sidebarUserFull.classList.remove('hidden');
      sidebarUserMini.classList.add('hidden');
      
      menuIcon.setAttribute('data-lucide', 'x');
    } else {
      sidebar.classList.remove('w-64');
      sidebar.classList.add('w-16');
      
      sidebarLogoContainer.classList.remove('px-3');
      sidebarLogoContainer.classList.add('px-2', 'justify-center');
      
      sidebarLogoFull.classList.add('hidden');
      sidebarLogoMini.classList.remove('hidden');
      
      sidebarRole.classList.add('hidden');
      
      navLabels.forEach(lbl => lbl.classList.add('hidden'));
      navIndicators.forEach(ind => ind.classList.add('hidden'));
      
      sidebarUserFull.classList.add('hidden');
      sidebarUserMini.classList.remove('hidden');
      
      menuIcon.setAttribute('data-lucide', 'menu');
    }
    
    // Re-initialize icon since we changed the data-lucide attribute on menuIcon
    lucide.createIcons();
  });

  // --- Chart.js ---
  const ctx = document.getElementById('attendanceChart').getContext('2d');
  
  // Data from mockData.ts
  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const presentData = [18, 19, 18, 20, 21, 20];
  const lateData = [3, 2, 4, 2, 1, 2];
  const absentData = [1, 1, 0, 0, 1, 0];
  const undertimeData = [0, 0, 0, 1, 0, 1];

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Present',
          data: presentData,
          backgroundColor: '#10B981',
          borderRadius: { topLeft: 3, topRight: 3, bottomLeft: 0, bottomRight: 0 }
        },
        {
          label: 'Late',
          data: lateData,
          backgroundColor: '#F59E0B',
          borderRadius: { topLeft: 3, topRight: 3, bottomLeft: 0, bottomRight: 0 }
        },
        {
          label: 'Absent',
          data: absentData,
          backgroundColor: '#EF4444',
          borderRadius: { topLeft: 3, topRight: 3, bottomLeft: 0, bottomRight: 0 }
        },
        {
          label: 'Undertime',
          data: undertimeData,
          backgroundColor: '#F97316',
          borderRadius: { topLeft: 3, topRight: 3, bottomLeft: 0, bottomRight: 0 }
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: '#FFFFFF',
          titleColor: '#2A1215',
          bodyColor: '#7A5C50',
          borderColor: '#E8D8C8',
          borderWidth: 1,
          padding: 10,
          boxPadding: 4,
          usePointStyle: true
        }
      },
      scales: {
        x: {
          stacked: false,
          grid: {
            display: false
          },
          ticks: {
            color: '#7A5C50',
            font: {
              family: "'Nunito', system-ui, sans-serif",
              size: 12
            }
          },
          border: {
            display: false
          }
        },
        y: {
          stacked: false,
          grid: {
            color: '#F0E6D8',
            tickLength: 0
          },
          ticks: {
            color: '#7A5C50',
            font: {
              family: "'Nunito', system-ui, sans-serif",
              size: 12
            }
          },
          border: {
            display: false,
            dash: [3, 3]
          }
        }
      }
    }
  });
});
