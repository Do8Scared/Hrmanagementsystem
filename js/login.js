document.addEventListener('DOMContentLoaded', () => {
  // Views
  const loginView = document.getElementById('login-view');
  const forgotPwView = document.getElementById('forgot-pw-view');
  const forgotPwFormContainer = document.getElementById('forgot-pw-form-container');
  const forgotPwSuccess = document.getElementById('forgot-pw-success');

  // Role switching
  let currentRole = 'admin'; // 'admin' or 'employee'
  const roleAdminBtn = document.getElementById('role-admin-btn');
  const roleEmployeeBtn = document.getElementById('role-employee-btn');
  const emailInput = document.getElementById('email-input');

  function updateRoleUI() {
    if (currentRole === 'admin') {
      roleAdminBtn.style.background = 'var(--crimson)';
      roleAdminBtn.style.color = '#FFF5E9';
      roleAdminBtn.style.boxShadow = '0 2px 10px rgba(110,18,22,0.33)';
      
      roleEmployeeBtn.style.background = 'transparent';
      roleEmployeeBtn.style.color = 'var(--text-muted)';
      roleEmployeeBtn.style.boxShadow = 'none';
      
      emailInput.placeholder = 'admin@corazontraveltours.ph';
    } else {
      roleEmployeeBtn.style.background = 'var(--crimson)';
      roleEmployeeBtn.style.color = '#FFF5E9';
      roleEmployeeBtn.style.boxShadow = '0 2px 10px rgba(110,18,22,0.33)';
      
      roleAdminBtn.style.background = 'transparent';
      roleAdminBtn.style.color = 'var(--text-muted)';
      roleAdminBtn.style.boxShadow = 'none';
      
      emailInput.placeholder = 'employee@corazontraveltours.ph';
    }
  }

  roleAdminBtn.addEventListener('click', () => { currentRole = 'admin'; updateRoleUI(); });
  roleEmployeeBtn.addEventListener('click', () => { currentRole = 'employee'; updateRoleUI(); });

  // Input focus effects
  const inputs = document.querySelectorAll('input');
  inputs.forEach(input => {
    input.addEventListener('focus', () => input.style.borderColor = 'var(--gold)');
    input.addEventListener('blur', () => input.style.borderColor = 'var(--border)');
  });

  // Password toggle
  const passwordInput = document.getElementById('password-input');
  const togglePasswordBtn = document.getElementById('toggle-password-btn');
  const passwordIcon = document.getElementById('password-icon');
  let showPassword = false;

  togglePasswordBtn.addEventListener('click', () => {
    showPassword = !showPassword;
    passwordInput.type = showPassword ? 'text' : 'password';
    passwordIcon.setAttribute('data-lucide', showPassword ? 'eye-off' : 'eye');
    lucide.createIcons();
  });

  // Remember me toggle
  const rememberMeBox = document.getElementById('remember-me-box');
  const rememberMeCheck = document.getElementById('remember-me-check');
  let rememberMe = false;

  rememberMeBox.addEventListener('click', () => {
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

  forgotPwLink.addEventListener('click', showForgotPwView);
  backToLoginBtn.addEventListener('click', showLoginView);
  backToLoginSuccessBtn.addEventListener('click', showLoginView);

  // Login form submission
  const loginForm = document.getElementById('login-form');
  const loginError = document.getElementById('login-error');
  const submitBtn = document.getElementById('submit-btn');
  const submitText = document.getElementById('submit-text');
  const submitSpinner = document.getElementById('submit-spinner');

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!emailInput.value || !passwordInput.value) {
      loginError.classList.remove('hidden');
      return;
    }
    loginError.classList.add('hidden');
    
    // Simulate loading
    submitText.classList.add('hidden');
    submitSpinner.classList.remove('hidden');
    submitBtn.style.background = 'var(--text-muted)';
    submitBtn.style.boxShadow = 'none';
    submitBtn.disabled = true;

    setTimeout(() => {
      // Direct routing based on role (mock implementation)
      if (currentRole === 'admin') {
        window.location.href = 'admin-dashboard.html';
      } else {
        window.location.href = 'employee-dashboard.html';
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
    resetBtn.style.background = 'var(--text-muted)';
    resetBtn.style.boxShadow = 'none';
    resetBtn.disabled = true;

    setTimeout(() => {
      // Reset button state
      resetText.classList.remove('hidden');
      resetIcon.classList.remove('hidden');
      resetSpinner.classList.add('hidden');
      resetBtn.style.background = 'linear-gradient(135deg, var(--crimson), var(--crimson-dark))';
      resetBtn.style.boxShadow = '0 6px 20px rgba(110,18,22,0.33)';
      resetBtn.disabled = false;

      // Show success
      successEmailText.textContent = resetEmailInput.value;
      forgotPwFormContainer.classList.add('hidden');
      forgotPwSuccess.classList.remove('hidden');
      resetEmailInput.value = '';
    }, 1000);
  });
});
