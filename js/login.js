document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // Views
  const loginView = document.getElementById('login-view');
  const forgotPwView = document.getElementById('forgot-pw-view');
  const forgotPwFormContainer = document.getElementById('forgot-pw-form-container');
  const forgotPwSuccess = document.getElementById('forgot-pw-success');

  // Role switching
  let currentRole = 'admin'; // 'admin', 'manager', or 'employee'
  const roleAdminBtn = document.getElementById('role-admin-btn');
  const roleManagerBtn = document.getElementById('role-manager-btn');
  const roleEmployeeBtn = document.getElementById('role-employee-btn');
  const emailInput = document.getElementById('email-input');

  function resetRoleButtons() {
    [roleAdminBtn, roleManagerBtn, roleEmployeeBtn].forEach(btn => {
      btn.style.background = 'transparent';
      btn.style.color = 'var(--text-muted)';
      btn.style.boxShadow = 'none';
    });
  }

  function updateRoleUI() {
    resetRoleButtons();
    if (currentRole === 'admin') {
      roleAdminBtn.style.background = 'var(--crimson)';
      roleAdminBtn.style.color = '#FFF5E9';
      roleAdminBtn.style.boxShadow = '0 2px 10px rgba(110,18,22,0.33)';
      emailInput.placeholder = 'admin@corazontraveltours.ph';
    } else if (currentRole === 'manager') {
      roleManagerBtn.style.background = 'var(--crimson)';
      roleManagerBtn.style.color = '#FFF5E9';
      roleManagerBtn.style.boxShadow = '0 2px 10px rgba(110,18,22,0.33)';
      emailInput.placeholder = 'manager@corazontraveltours.ph';
    } else {
      roleEmployeeBtn.style.background = 'var(--crimson)';
      roleEmployeeBtn.style.color = '#FFF5E9';
      roleEmployeeBtn.style.boxShadow = '0 2px 10px rgba(110,18,22,0.33)';
      emailInput.placeholder = 'employee@corazontraveltours.ph';
    }
  }

  roleAdminBtn.addEventListener('click', (e) => {
    e.preventDefault();
    currentRole = 'admin';
    updateRoleUI();
  });

  roleManagerBtn.addEventListener('click', (e) => {
    e.preventDefault();
    currentRole = 'manager';
    updateRoleUI();
  });

  roleEmployeeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    currentRole = 'employee';
    updateRoleUI();
  });

  // Input focus effects
  const inputs = document.querySelectorAll('input');
  inputs.forEach(input => {
    input.addEventListener('focus', () => {
      input.style.borderColor = 'var(--gold)';
      input.style.boxShadow = '0 0 0 3px rgba(200, 137, 10, 0.15)';
    });
    input.addEventListener('blur', () => {
      input.style.borderColor = 'var(--border)';
      input.style.boxShadow = 'none';
    });
  });

  // Password toggle
  const passwordInput = document.getElementById('password-input');
  const togglePasswordBtn = document.getElementById('toggle-password-btn');
  const passwordIcon = document.getElementById('password-icon');
  let showPassword = false;

  togglePasswordBtn.addEventListener('click', (e) => {
    e.preventDefault();
    showPassword = !showPassword;
    passwordInput.type = showPassword ? 'text' : 'password';
    passwordIcon.setAttribute('data-lucide', showPassword ? 'eye-off' : 'eye');
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  });

  // Remember me toggle
  const rememberMeBox = document.getElementById('remember-me-box');
  const rememberMeCheck = document.getElementById('remember-me-check');
  let rememberMe = false;

  rememberMeBox.addEventListener('click', (e) => {
    e.preventDefault();
    rememberMe = !rememberMe;
    if (rememberMe) {
      rememberMeBox.style.background = 'var(--gold)';
      rememberMeBox.style.borderColor = 'var(--gold)';
      rememberMeCheck.classList.remove('hidden');
    } else {
      rememberMeBox.style.background = '#fff';
      rememberMeBox.style.borderColor = 'var(--border)';
      rememberMeCheck.classList.add('hidden');
    }
  });

  // View toggling
  const forgotPwLink = document.getElementById('forgot-pw-link');
  const backToLoginBtn = document.getElementById('back-to-login-btn');
  const backToLoginSuccessBtn = document.getElementById('back-to-login-success-btn');

  function showLoginView() {
    loginView.classList.remove('hidden');
    forgotPwView.classList.add('hidden');
  }

  function showForgotPwView() {
    loginView.classList.add('hidden');
    forgotPwView.classList.remove('hidden');
    forgotPwFormContainer.classList.remove('hidden');
    forgotPwSuccess.classList.add('hidden');
  }

  forgotPwLink.addEventListener('click', (e) => {
    e.preventDefault();
    showForgotPwView();
  });

  backToLoginBtn.addEventListener('click', (e) => {
    e.preventDefault();
    showLoginView();
  });

  backToLoginSuccessBtn.addEventListener('click', (e) => {
    e.preventDefault();
    showLoginView();
  });

  // Login form submission
  const loginForm = document.getElementById('login-form');
  const loginError = document.getElementById('login-error');
  const submitBtn = document.getElementById('submit-btn');
  const submitText = document.getElementById('submit-text');
  const submitSpinner = document.getElementById('submit-spinner');
  const passwordInput2 = document.getElementById('password-input');

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!emailInput.value || !passwordInput2.value) {
      loginError.classList.remove('hidden');
      return;
    }
    loginError.classList.add('hidden');
    
    // Simulate loading
    submitText.classList.add('hidden');
    submitSpinner.classList.remove('hidden');
    submitBtn.style.opacity = '0.7';
    submitBtn.disabled = true;

    setTimeout(() => {
      // Direct routing based on role (mock implementation)
      if (currentRole === 'admin') {
        window.location.href = 'adminportal/admin-dashboard.html';
      } else if (currentRole === 'manager') {
        window.location.href = 'managerportal/manager-dashboard.html';
      } else {
        window.location.href = 'employeeportal/employee-dashboard.html';
      }
    }, 1200);
  });

  // Forgot password form submission
  const forgotPwForm = document.getElementById('forgot-pw-form');
  const resetEmailInput = document.getElementById('reset-email-input');
  const resetBtn = document.getElementById('reset-btn');
  const resetText = document.getElementById('reset-text');
  const resetIcon = document.getElementById('reset-icon');
  const resetSpinner = document.getElementById('reset-spinner');
  const successEmailText = document.getElementById('success-email-text');

  forgotPwForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!resetEmailInput.value) return;

    // Simulate loading
    resetText.classList.add('hidden');
    resetIcon.classList.add('hidden');
    resetSpinner.classList.remove('hidden');
    resetBtn.style.opacity = '0.7';
    resetBtn.disabled = true;

    setTimeout(() => {
      // Reset button state
      resetText.classList.remove('hidden');
      resetIcon.classList.remove('hidden');
      resetSpinner.classList.add('hidden');
      resetBtn.style.opacity = '1';
      resetBtn.disabled = false;

      // Show success
      successEmailText.textContent = resetEmailInput.value;
      forgotPwFormContainer.classList.add('hidden');
      forgotPwSuccess.classList.remove('hidden');
      resetEmailInput.value = '';
    }, 1000);
  });

  // Initialize
  updateRoleUI();
});
