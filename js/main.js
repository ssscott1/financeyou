/* Finance You — Main JS */
/* Calculator + Form Handling + Navigation */

'use strict';

/* ─── Mobile Navigation ─── */
(function initMobileNav() {
  const btn = document.getElementById('mobile-menu-btn');
  const nav = document.getElementById('mobile-nav');
  const body = document.body;

  if (!btn || !nav) return;

  btn.addEventListener('click', function () {
    const isOpen = nav.classList.contains('open');
    nav.classList.toggle('open', !isOpen);
    btn.setAttribute('aria-expanded', String(!isOpen));
    body.style.overflow = isOpen ? '' : 'hidden';

    // Swap icon
    const openIcon = btn.querySelector('.icon-menu');
    const closeIcon = btn.querySelector('.icon-close');
    if (openIcon) openIcon.classList.toggle('hidden', !isOpen);
    if (closeIcon) closeIcon.classList.toggle('hidden', isOpen);
  });

  // Close on outside click
  document.addEventListener('click', function (e) {
    if (nav.classList.contains('open') && !nav.contains(e.target) && !btn.contains(e.target)) {
      nav.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      body.style.overflow = '';
    }
  });

  // Mobile sub-menus
  const mobileToggleBtns = nav.querySelectorAll('[data-mobile-toggle]');
  mobileToggleBtns.forEach(function (toggleBtn) {
    toggleBtn.addEventListener('click', function () {
      const targetId = this.getAttribute('data-mobile-toggle');
      const target = document.getElementById(targetId);
      if (target) target.classList.toggle('hidden');
    });
  });
})();

/* ─── Sticky Header ─── */
(function initStickyHeader() {
  const header = document.getElementById('site-header');
  if (!header) return;

  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 40);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
})();

/* ─── Active Nav ─── */
(function initActiveNav() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  const links = document.querySelectorAll('.main-nav a, .mobile-nav a');
  links.forEach(function (link) {
    const href = link.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
})();

/* ─── Back to Top ─── */
(function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', function () {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ─── FAQ Accordion ─── */
(function initFAQ() {
  const questions = document.querySelectorAll('.faq-question');
  questions.forEach(function (q) {
    q.addEventListener('click', function () {
      const answer = this.nextElementSibling;
      const isOpen = this.classList.contains('open');

      // Close all
      questions.forEach(function (other) {
        other.classList.remove('open');
        other.setAttribute('aria-expanded', 'false');
        const ans = other.nextElementSibling;
        if (ans) ans.classList.remove('open');
      });

      // Open clicked (if was closed)
      if (!isOpen) {
        this.classList.add('open');
        this.setAttribute('aria-expanded', 'true');
        if (answer) answer.classList.add('open');
      }
    });
  });
})();

/* ─── Loan Calculator ─── */
(function initCalculator() {
  const calc = document.getElementById('loan-calculator');
  if (!calc) return;

  // Rate config per type
  const RATES = {
    equipment: 7.49,
    car: 6.99,
    truck: 7.24,
    personal: 12.99,
    commercial: 8.49
  };

  let currentType = calc.getAttribute('data-default-type') || 'equipment';
  let loanAmount = 50000;
  let termYears = 5;

  // Elements
  const tabs = calc.querySelectorAll('.calc-tab');
  const amountSlider = calc.querySelector('#calc-amount');
  const amountDisplay = calc.querySelector('#calc-amount-display');
  const termBtns = calc.querySelectorAll('.term-btn');
  const rateDisplay = calc.querySelector('#calc-rate-display');
  const monthlyDisplay = calc.querySelector('#calc-monthly');
  const totalInterestDisplay = calc.querySelector('#calc-total-interest');
  const totalAmountDisplay = calc.querySelector('#calc-total-amount');

  function formatCurrency(val) {
    return '$' + Math.round(val).toLocaleString('en-AU');
  }

  function calculateRepayment(principal, annualRate, years) {
    const r = (annualRate / 100) / 12;
    const n = years * 12;
    if (r === 0) return principal / n;
    return principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  }

  function updateCalc() {
    const rate = RATES[currentType] || 7.99;
    const monthly = calculateRepayment(loanAmount, rate, termYears);
    const total = monthly * termYears * 12;
    const interest = total - loanAmount;

    if (rateDisplay) rateDisplay.innerHTML = 'Indicative rate from <strong>' + rate.toFixed(2) + '% p.a.</strong>';
    if (monthlyDisplay) monthlyDisplay.textContent = formatCurrency(monthly);
    if (totalInterestDisplay) totalInterestDisplay.textContent = formatCurrency(interest);
    if (totalAmountDisplay) totalAmountDisplay.textContent = formatCurrency(total);

    // Update slider fill
    if (amountSlider) {
      const min = parseFloat(amountSlider.min);
      const max = parseFloat(amountSlider.max);
      const pct = ((loanAmount - min) / (max - min)) * 100;
      amountSlider.style.background =
        'linear-gradient(to right, #f59e0b ' + pct + '%, rgba(255,255,255,.2) ' + pct + '%)';
    }
  }

  // Tab switching
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      tabs.forEach(function (t) { t.classList.remove('active'); });
      this.classList.add('active');
      currentType = this.getAttribute('data-type');
      updateCalc();
    });
  });

  // Amount slider
  if (amountSlider) {
    amountSlider.addEventListener('input', function () {
      loanAmount = parseFloat(this.value);
      if (amountDisplay) amountDisplay.textContent = formatCurrency(loanAmount);
      updateCalc();
    });
    // Init display value
    loanAmount = parseFloat(amountSlider.value) || 50000;
    if (amountDisplay) amountDisplay.textContent = formatCurrency(loanAmount);
  }

  // Term buttons
  termBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      termBtns.forEach(function (b) { b.classList.remove('active'); });
      this.classList.add('active');
      termYears = parseInt(this.getAttribute('data-years'), 10);
      updateCalc();
    });
  });

  updateCalc();
})();

/* ─── Form Validation & Submission ─── */
function initLeadForm(formId) {
  const form = document.getElementById(formId);
  if (!form) return;

  const successEl = form.parentElement.querySelector('.form-success');
  const assetGroup = form.querySelector('.asset-type-group');

  // Show/hide asset type based on finance type selection
  const financeTypeSelect = form.querySelector('[name="finance_type"]');
  if (financeTypeSelect && assetGroup) {
    financeTypeSelect.addEventListener('change', function () {
      const val = this.value;
      const showAsset = ['equipment', 'car', 'truck', 'asset'].includes(val);
      assetGroup.classList.toggle('hidden', !showAsset);
      const assetInput = assetGroup.querySelector('select, input');
      if (assetInput) assetInput.required = showAsset;
    });
  }

  function validateField(input) {
    const errorEl = input.parentElement.querySelector('.form-error');
    let valid = true;
    let message = '';

    input.classList.remove('error');
    if (errorEl) errorEl.classList.remove('visible');

    if (input.required && !input.value.trim()) {
      valid = false;
      message = 'This field is required.';
    } else if (input.type === 'email' && input.value) {
      const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRx.test(input.value)) { valid = false; message = 'Please enter a valid email address.'; }
    } else if (input.type === 'tel' && input.value) {
      const phoneRx = /^[\d\s\+\-\(\)]{8,15}$/;
      if (!phoneRx.test(input.value)) { valid = false; message = 'Please enter a valid phone number.'; }
    }

    if (!valid) {
      input.classList.add('error');
      if (errorEl) { errorEl.textContent = message; errorEl.classList.add('visible'); }
    }
    return valid;
  }

  // Live validation on blur
  form.querySelectorAll('input, select, textarea').forEach(function (input) {
    input.addEventListener('blur', function () { validateField(this); });
    input.addEventListener('input', function () {
      if (this.classList.contains('error')) validateField(this);
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    let allValid = true;
    form.querySelectorAll('input, select, textarea').forEach(function (input) {
      if (!validateField(input)) allValid = false;
    });

    if (!allValid) return;

    const submitBtn = form.querySelector('[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Submitting…';
    }

    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(new FormData(form)).toString()
    })
    .then(function () {
      form.classList.add('hidden');
      if (successEl) successEl.classList.add('visible');
    })
    .catch(function () {
      if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Get My Free Quote'; }
      alert('There was an error submitting your enquiry. Please call us on 1300 989 282.');
    });
  });
}

// Init all forms
['hero-form', 'contact-form', 'side-form', 'footer-form'].forEach(initLeadForm);

/* ─── Smooth Scroll for anchor links ─── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        const headerOffset = 80;
        const y = target.getBoundingClientRect().top + window.scrollY - headerOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
  });
})();

/* ─── Number counter animation for stats ─── */
(function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.getAttribute('data-count'));
      const suffix = el.getAttribute('data-suffix') || '';
      const prefix = el.getAttribute('data-prefix') || '';
      const duration = 1500;
      const start = performance.now();

      function tick(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = target * eased;
        el.textContent = prefix + (Number.isInteger(target) ? Math.round(value) : value.toFixed(1)) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(function (el) { observer.observe(el); });
})();
