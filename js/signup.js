document.addEventListener('DOMContentLoaded', () => {
  // 1. If already logged in, redirect directly to the browse page
  const currentUser = localStorage.getItem('gpuse_current_user');
  if (currentUser) {
    window.location.href = 'browse.html';
    return;
  }

  // 2. Ensure default demo credentials exist in localStorage for testing
  let users = JSON.parse(localStorage.getItem('gpuse_users') || '[]');
  const demoEmail = 'demo@gpuse.com';
  const hasDemo = users.some(u => u.email.toLowerCase() === demoEmail);
  if (!hasDemo) {
    users.push({
      name: 'Demo User',
      handle: '@demouser',
      email: demoEmail,
      password: 'password123'
    });
    localStorage.setItem('gpuse_users', JSON.stringify(users));
  }

  // Select form and input fields
  const form = document.querySelector('form.auth-panel') || document.querySelector('form');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');

  if (!form || !emailInput || !passwordInput) {
    console.error('Login form elements not found.');
    return;
  }

  // Create or retrieve error message display container
  let errorMsg = document.getElementById('login-error-msg');
  if (!errorMsg) {
    errorMsg = document.createElement('p');
    errorMsg.id = 'login-error-msg';
    errorMsg.style.color = '#ef4444';
    errorMsg.style.fontSize = '14px';
    errorMsg.style.marginTop = '10px';
    errorMsg.style.marginBottom = '10px';
    errorMsg.style.display = 'none';

    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      form.insertBefore(errorMsg, submitBtn);
    } else {
      form.appendChild(errorMsg);
    }
  }

  function showError(msg) {
    errorMsg.textContent = msg;
    errorMsg.style.display = 'block';
  }

  function clearError() {
    errorMsg.textContent = '';
    errorMsg.style.display = 'none';
  }

  // 3. Handle Form Submission
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearError();

    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value;

    if (!email || !password) {
      showError('Please enter both your email and password.');
      return;
    }

    // Retrieve accounts saved in localStorage
    const storedUsers = JSON.parse(localStorage.getItem('gpuse_users') || '[]');

    // Find account with matching email and password
    const matched = storedUsers.find(
      u => u.email.toLowerCase() === email && u.password === password
    );

    if (!matched) {
      showError('Invalid email or password. (You can also log in with demo@gpuse.com / password123, or sign up on signup.html first!)');
      return;
    }

    // 4. Save active user session to localStorage
    const session = {
      name: matched.name || email.split('@')[0],
      handle: matched.handle || `@${email.split('@')[0]}`,
      email: matched.email,
      loggedInAt: new Date().toISOString()
    };
    localStorage.setItem('gpuse_current_user', JSON.stringify(session));

    // 5. Redirect user to Browse GPUs page
    window.location.href = 'browse.html';
  });
});