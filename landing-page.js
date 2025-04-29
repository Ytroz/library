document.addEventListener('DOMContentLoaded', function() {
  // Navbar scroll effect
  window.addEventListener('scroll', function() {
      const navbar = document.querySelector('.navbar');
      if (window.scrollY > 50) {
          navbar.classList.add('scrolled');
      } else {
          navbar.classList.remove('scrolled');
      }
  });

  // Scroll animations for fadeInUp elements
  const fadeElements = document.querySelectorAll('.fadeInUp');
  
  const fadeInOnScroll = function() {
      fadeElements.forEach(element => {
          const elementTop = element.getBoundingClientRect().top;
          const windowHeight = window.innerHeight;
          
          if (elementTop < windowHeight - 100) {
              element.style.opacity = '1';
              element.style.transform = 'translateY(0)';
          }
      });
  };
  
  // Initial check for fade-in animations
  fadeInOnScroll();
  
  // Check on scroll
  window.addEventListener('scroll', fadeInOnScroll);

  // Search functionality
  const searchForm = document.querySelector('.hero-section form');
  if (searchForm) {
      searchForm.addEventListener('submit', function(e) {
          e.preventDefault();
          const searchInput = this.querySelector('input').value.trim();
          if (searchInput) {
              alert(`Searching for: ${searchInput}`);
          }
      });
  }

  // Newsletter form submission
  const newsletterForm = document.querySelector('.newsletter-form');
  if (newsletterForm) {
      newsletterForm.addEventListener('submit', function(e) {
          e.preventDefault();
          const emailInput = this.querySelector('input').value.trim();
          if (emailInput && validateEmail(emailInput)) {
              alert('Thank you for subscribing!');
              this.reset();
          } else {
              alert('Please enter a valid email address.');
          }
      });
  }

  // Email validation helper function
  function validateEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
  }

  // Borrow button functionality
  const borrowButtons = document.querySelectorAll('.btn-borrow');
  borrowButtons.forEach(button => {
      button.addEventListener('click', function(e) {
          e.preventDefault();
          if (!this.classList.contains('btn-disabled')) {
              alert('Book borrowing request sent!');
          }
      });
  });

  // Smooth scroll for nav links
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
      link.addEventListener('click', function(e) {
          const href = this.getAttribute('href');
          if (href.startsWith('#')) {
              e.preventDefault();
              const target = document.querySelector(href);
              if (target) {
                  window.scrollTo({
                      top: target.offsetTop - 80,
                      behavior: 'smooth'
                  });
              }
          }
      });
  });

  // Authentication functionality
  const authButton = document.querySelector('.btn-outline-primary');
  let isLoggedIn = false;
  let currentUser = null;
  let hasRegistered = false;
  const users = []; // Mock in-memory user storage

  // Initialize button as "Register"
  authButton.textContent = 'Register';
  authButton.classList.add('btn-outline-primary');

  // Create registration modal dynamically
  const registerModalHtml = `
      <div class="modal fade" id="registerModal" tabindex="-1" aria-labelledby="registerModalLabel" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content">
                  <div class="modal-header">
                      <h5 class="modal-title" id="registerModalLabel">Register for City Public Library</h5>
                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                      <form id="registerForm">
                          <div class="mb-3">
                              <label for="registerEmailInput" class="form-label">Email address</label>
                              <input type="email" class="form-control" id="registerEmailInput" placeholder="Enter your email" required>
                          </div>
                          <div class="mb-3">
                              <label for="registerPasswordInput" class="form-label">Password</label>
                              <input type="password" class="form-control" id="registerPasswordInput" placeholder="Enter your password" required>
                          </div>
                          <div class="mb-3">
                              <label for="confirmPasswordInput" class="form-label">Confirm Password</label>
                              <input type="password" class="form-control" id="confirmPasswordInput" placeholder="Confirm your password" required>
                          </div>
                          <button type="submit" class="btn btn-primary w-100">Register</button>
                      </form>
                  </div>
              </div>
          </div>
      </div>
  `;
  document.body.insertAdjacentHTML('beforeend', registerModalHtml);

  // Create login modal dynamically
  const loginModalHtml = `
      <div class="modal fade" id="loginModal" tabindex="-1" aria-labelledby="loginModalLabel" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content">
                  <div class="modal-header">
                      <h5 class="modal-title" id="loginModalLabel">Login to City Public Library</h5>
                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                      <form id="loginForm">
                          <div class="mb-3">
                              <label for="emailInput" class="form-label">Email address</label>
                              <input type="email" class="form-control" id="emailInput" placeholder="Enter your email" required>
                          </div>
                          <div class="mb-3">
                              <label for="passwordInput" class="form-label">Password</label>
                              <input type="password" class="form-control" id="passwordInput" placeholder="Enter your password" required>
                          </div>
                          <button type="submit" class="btn btn-primary w-100">Login</button>
                      </form>
                      <div class="mt-3 text-center">
                          <a href="#" class="text-muted">Forgot password?</a>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  `;
  document.body.insertAdjacentHTML('beforeend', loginModalHtml);

  // Handle auth button click
  authButton.addEventListener('click', function(e) {
      e.preventDefault();
      if (isLoggedIn) {
          // Handle logout
          isLoggedIn = false;
          currentUser = null;
          authButton.textContent = 'Login';
          authButton.classList.remove('btn-danger');
          authButton.classList.add('btn-outline-primary');
          alert('You have logged out successfully.');
          // Hide welcome message
          const welcomeMessage = document.querySelector('.welcome-message');
          if (welcomeMessage) {
              welcomeMessage.parentElement.classList.add('d-none');
          }
          // Stay on current page (e.g., catalog or home)
          // window.location.href = '/index.html'; // Uncomment to redirect to home
      } else if (!hasRegistered) {
          // Show register modal
          const registerModal = new bootstrap.Modal(document.getElementById('registerModal'));
          registerModal.show();
      } else {
          // Show login modal
          const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
          loginModal.show();
      }
  });

  // Handle registration form submission
  const registerForm = document.getElementById('registerForm');
  registerForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const email = document.getElementById('registerEmailInput').value.trim();
      const password = document.getElementById('registerPasswordInput').value.trim();
      const confirmPassword = document.getElementById('confirmPasswordInput').value.trim();

      if (!validateEmail(email)) {
          alert('Please enter a valid email address.');
          return;
      }
      if (password.length < 6) {
          alert('Password must be at least 6 characters long.');
          return;
      }
      if (password !== confirmPassword) {
          alert('Passwords do not match.');
          return;
      }
      if (users.some(user => user.email === email)) {
          alert('This email is already registered.');
          return;
      }

      // Simulate registration
      setTimeout(() => {
          users.push({ email, password }); // Store in mock database
          hasRegistered = true;
          authButton.textContent = 'Login';
          authButton.classList.add('btn-outline-primary');

          // Close register modal
          const registerModal = bootstrap.Modal.getInstance(document.getElementById('registerModal'));
          registerModal.hide();

          // Show login modal
          const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
          loginModal.show();

          alert('Registration successful! Please login.');
          registerForm.reset();
      }, 1000); // Simulate network delay
  });

  // Handle login form submission
  const loginForm = document.getElementById('loginForm');
  loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const email = document.getElementById('emailInput').value.trim();
      const password = document.getElementById('passwordInput').value.trim();

      if (!validateEmail(email)) {
          alert('Please enter a valid email address.');
          return;
      }
      if (password.length < 6) {
          alert('Password must be at least 6 characters long.');
          return;
      }

      // Simulate authentication
      setTimeout(() => {
          const user = users.find(u => u.email === email && u.password === password);
          if (!user) {
              alert('Invalid email or password.');
              return;
          }

          // Successful login
          isLoggedIn = true;
          currentUser = { email };
          authButton.textContent = 'Logout';
          authButton.classList.remove('btn-outline-primary');
          authButton.classList.add('btn-danger');

          // Close login modal
          const loginModal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
          loginModal.hide();

          // Show welcome message
          const welcomeMessage = document.querySelector('.welcome-message') || createWelcomeMessage();
          welcomeMessage.textContent = `Welcome, ${email.split('@')[0]}!`;
          welcomeMessage.parentElement.classList.remove('d-none');

          // Redirect to catalog
          window.location.href = '/catalog.html'; // Adjust path as needed

          // Reset form
          loginForm.reset();
      }, 1000); // Simulate network delay
  });

  // Create welcome message element
  function createWelcomeMessage() {
      const navbarNav = document.querySelector('.navbar-nav');
      const welcomeMessage = document.createElement('li');
      welcomeMessage.classList.add('nav-item', 'ms-lg-3');
      welcomeMessage.innerHTML = '<span class="nav-link welcome-message"></span>';
      navbarNav.appendChild(welcomeMessage);
      return welcomeMessage.querySelector('.welcome-message');
  }
});