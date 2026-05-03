/* ============================================================
   PROPIAI — main.js
   Navigation · FAQ · Pricing toggle · Counters · Scroll FX
============================================================ */

/* ── Sticky nav shadow on scroll ───────────────────────── */
const nav = document.getElementById('nav');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ── Mobile burger menu ─────────────────────────────────── */
const burger = document.getElementById('burger');

burger.addEventListener('click', () => {
  nav.classList.toggle('menu-open');
  const isOpen = nav.classList.contains('menu-open');
  burger.setAttribute('aria-expanded', isOpen);

  const spans = burger.querySelectorAll('span');
  if (isOpen) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity  = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});

document.querySelectorAll('.nav__links a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('menu-open');
    const spans = burger.querySelectorAll('span');
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});

/* ── FAQ accordion ──────────────────────────────────────── */
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const answer  = btn.nextElementSibling;
    const isOpen  = btn.getAttribute('aria-expanded') === 'true';

    document.querySelectorAll('.faq-question').forEach(b => {
      b.setAttribute('aria-expanded', 'false');
      b.nextElementSibling.classList.remove('open');
    });

    if (!isOpen) {
      btn.setAttribute('aria-expanded', 'true');
      answer.classList.add('open');
    }
  });
});

/* ── Billing toggle (monthly ↔ annual) ──────────────────── */
const toggleBtn    = document.getElementById('billing-toggle');
const labelMonthly = document.getElementById('label-monthly');
const labelAnnual  = document.getElementById('label-annual');
const proPrice     = document.getElementById('pro-price');
const studioPrice  = document.getElementById('studio-price');

let isAnnual = false;

toggleBtn.addEventListener('click', () => {
  isAnnual = !isAnnual;
  toggleBtn.classList.toggle('active', isAnnual);
  toggleBtn.setAttribute('aria-checked', isAnnual);

  labelMonthly.classList.toggle('toggle-label--active', !isAnnual);
  labelAnnual.classList.toggle('toggle-label--active',   isAnnual);

  if (isAnnual) {
    animatePrice(proPrice,    19, 15, '€');
    animatePrice(studioPrice, 39, 31, '€');
  } else {
    animatePrice(proPrice,    15, 19, '€');
    animatePrice(studioPrice, 31, 39, '€');
  }
});

function animatePrice(el, from, to, symbol) {
  const duration = 400;
  const start    = performance.now();

  function step(now) {
    const t   = Math.min((now - start) / duration, 1);
    const val = Math.round(from + (to - from) * easeOut(t));
    el.textContent = `${val}${symbol}`;
    if (t < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

/* ── Animated counters ──────────────────────────────────── */
function animateCounter(el, target, duration = 1800, suffix = '') {
  const start = performance.now();

  function step(now) {
    const t   = Math.min((now - start) / duration, 1);
    const val = Math.round(target * easeOut(t));
    el.textContent = val.toLocaleString('fr-FR') + suffix;
    if (t < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

/* ── Intersection Observer for counters + fade-ups ─────── */
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    const el = entry.target;

    if (el.classList.contains('stat-number')) {
      const target = parseInt(el.dataset.count, 10);
      animateCounter(el, target);
      counterObserver.unobserve(el);
    }

    if (el.classList.contains('problem-stat')) {
      const target = parseInt(el.dataset.count, 10);
      const suffix = target > 10 ? '%' : '';
      animateCounter(el, target, 1200, suffix);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.4 });

document.querySelectorAll('.stat-number, .problem-stat').forEach(el => {
  counterObserver.observe(el);
});

/* ── Scroll fade-up animations ──────────────────────────── */
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

const fadeTargets = [
  '.feature-card',
  '.problem-card',
  '.testimonial-card',
  '.pricing-card',
  '.stat-item',
  '.step',
  '.faq-item',
  '.section-title',
  '.hero__badge',
  '.logos-bar__items',
];

fadeTargets.forEach(selector => {
  document.querySelectorAll(selector).forEach((el, i) => {
    el.classList.add('fade-up');
    el.style.transitionDelay = `${i * 60}ms`;
    fadeObserver.observe(el);
  });
});

/* ── Smooth scroll for anchor links ─────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* ── Mockup shimmer restart on viewport entry ───────────── */
const mockupObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    entry.target.querySelectorAll('.result-line, .ai-line').forEach(line => {
      line.style.animation = 'none';
      line.offsetHeight;
      line.style.animation = '';
    });
  });
}, { threshold: 0.5 });

document.querySelectorAll('.hero__mockup').forEach(el => mockupObserver.observe(el));

/* ── CTA button ripple effect ───────────────────────────── */
document.querySelectorAll('.btn--primary').forEach(btn => {
  btn.addEventListener('click', function (e) {
    const ripple = document.createElement('span');
    const rect   = this.getBoundingClientRect();
    const size   = Math.max(rect.width, rect.height) * 2;
    ripple.style.cssText = `
      position: absolute;
      width:  ${size}px;
      height: ${size}px;
      top:    ${e.clientY - rect.top  - size / 2}px;
      left:   ${e.clientX - rect.left - size / 2}px;
      border-radius: 50%;
      background: rgba(255,255,255,0.25);
      transform: scale(0);
      animation: ripple 0.55s ease-out forwards;
      pointer-events: none;
    `;
    this.style.position = 'relative';
    this.style.overflow = 'hidden';
    this.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  });
});

const style = document.createElement('style');
style.textContent = `
  @keyframes ripple {
    to { transform: scale(1); opacity: 0; }
  }
`;
document.head.appendChild(style);
