/* ══════════════════════════════════════════
   ARYAN SATAM PORTFOLIO — main.js
   - Navbar scroll effect + hamburger
   - Scroll reveal animations
   - Animated counters + skill bars
   - Dynamic Client Work Manager (localStorage)
   - Contact form handler
   - Admin auth (password modal)
══════════════════════════════════════════ */

// ── NAVBAR ──────────────────────────────────────
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
const allNavLinks = document.querySelectorAll('.nav-link');

if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
    highlightActiveSection();
  });
}

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open);
  });

  // Close menu on nav link click (mobile)
  navLinks.addEventListener('click', e => {
    if (e.target.closest('.nav-link, .nav-cta')) {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });
}

function highlightActiveSection() {
  const sections = document.querySelectorAll('section[id]');
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 110) current = s.id;
  });
  allNavLinks.forEach(l => {
    l.classList.toggle('active', l.getAttribute('href') === `#${current}`);
  });
}

// ── SCROLL REVEAL ───────────────────────────────
const revealEls = document.querySelectorAll('.reveal-up,.reveal-left,.reveal-right');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Animate skill bars when skills section enters view
      if (entry.target.classList.contains('skill-category')) {
        animateSkillBars(entry.target);
      }
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

revealEls.forEach(el => revealObs.observe(el));

// ── SKILL BARS ──────────────────────────────────
function animateSkillBars(container) {
  container.querySelectorAll('.skill-bar-fill').forEach(bar => {
    const w = bar.getAttribute('data-width');
    bar.style.width = w + '%';
  });
}

// ── COUNTER ANIMATION ───────────────────────────
function animateCounters() {
  document.querySelectorAll('.stat-number').forEach(el => {
    const target = parseInt(el.getAttribute('data-count'), 10);
    let current = 0;
    const step = Math.ceil(target / 40);
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = current;
      if (current >= target) clearInterval(timer);
    }, 35);
  });
}

// Trigger counters when hero stats come into view
const statsEl = document.querySelector('.hero-stats');
if (statsEl) {
  const statsObs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      animateCounters();
      statsObs.disconnect();
    }
  }, { threshold: 0.5 });
  statsObs.observe(statsEl);
}

// ══════════════════════════════════════════════
// ════════════ CONTACT FORM ════════════════════
// ══════════════════════════════════════════════
const contactForm = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');
const formFail = document.getElementById('form-fail');
const contactSubmit = document.getElementById('contact-submit');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    formSuccess.hidden = true;
    formFail.hidden = true;

    const name = document.getElementById('cf-name').value.trim();
    const email = document.getElementById('cf-email').value.trim();
    const budget = document.getElementById('cf-budget').value.trim();
    const message = document.getElementById('cf-message').value.trim();

    if (!name || !email || !message) return;

    const waMessage = `Hi, I'm ${name}.\nEmail: ${email}` + (budget ? `\nBudget: ${budget}` : '') + `\n\nProject Details:\n${message}`;
    const waUrl = `https://wa.me/917045464243?text=${encodeURIComponent(waMessage)}`;

    window.open(waUrl, '_blank');

    formSuccess.hidden = false;
    contactForm.reset();
  });
}

// ── PARTICLES (lightweight canvas dots) ──────
(function initParticles() {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const parent = document.getElementById('particles-bg');
  canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%';
  parent.appendChild(canvas);

  let W, H, dots = [];
  const N = 55;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function mkDot() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.5 + 0.4,
      dx: (Math.random() - 0.5) * 0.35,
      dy: (Math.random() - 0.5) * 0.35,
      a: Math.random() * 0.4 + 0.1,
    };
  }

  resize();
  dots = Array.from({ length: N }, mkDot);
  window.addEventListener('resize', resize);

  function draw() {
    ctx.clearRect(0, 0, W, H);
    dots.forEach(d => {
      d.x += d.dx; d.y += d.dy;
      if (d.x < 0 || d.x > W) d.dx *= -1;
      if (d.y < 0 || d.y > H) d.dy *= -1;
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(99,179,237,${d.a})`;
      ctx.fill();
    });
    // Draw connecting lines
    for (let i = 0; i < dots.length; i++) {
      for (let j = i + 1; j < dots.length; j++) {
        const dist = Math.hypot(dots[i].x - dots[j].x, dots[i].y - dots[j].y);
        if (dist < 140) {
          ctx.beginPath();
          ctx.moveTo(dots[i].x, dots[i].y);
          ctx.lineTo(dots[j].x, dots[j].y);
          ctx.strokeStyle = `rgba(99,179,237,${0.06 * (1 - dist / 140)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
})();
