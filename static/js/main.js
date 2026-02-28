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

// ── 3D PARTICLES (VANTA) & TILT EFFECT ──────
if (typeof VANTA !== 'undefined') {
  const isMobile = window.innerWidth < 768;
  VANTA.NET({
    el: "#particles-bg",
    mouseControls: true,
    touchControls: true,
    gyroControls: false,
    minHeight: 200.00,
    minWidth: 200.00,
    scale: 1.00,
    scaleMobile: 1.00,
    color: 0x63b3ed,
    backgroundColor: 0x080c14,
    points: isMobile ? 8.00 : 12.00,
    maxDistance: isMobile ? 18.00 : 22.00,
    spacing: isMobile ? 22.00 : 18.00
  });
}

if (typeof VanillaTilt !== 'undefined') {
  const isMobile = window.innerWidth < 768;
  VanillaTilt.init(document.querySelectorAll(".project-card, .skill-category, .service-card, .hero-code-card"), {
    max: isMobile ? 4 : 10,
    speed: 400,
    glare: true,
    "max-glare": 0.15,
    gyroscope: false // Mobile friendly: disable gyro to save battery and stop jumpiness
  });
}

// ── LENS SMOOTH SCROLLING ─────────────────────
if (typeof Lenis !== 'undefined') {
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);
}

// ── CUSTOM 3D CURSOR ──────────────────────────
const cursorDot = document.getElementById('cursor-dot');
const cursorOutline = document.getElementById('cursor-outline');

if (cursorDot && cursorOutline && window.innerWidth >= 768) {
  window.addEventListener('mousemove', (e) => {
    const posX = e.clientX;
    const posY = e.clientY;

    // Dot follows instantly
    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;

    // Outline follows with a slight delay using simple lerp via CSS/JS
    cursorOutline.animate({
      left: `${posX}px`,
      top: `${posY}px`
    }, { duration: 500, fill: "forwards" });
  });

  // Add hover effect to links and buttons
  document.querySelectorAll('a, button, .nav-logo').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
}

// ── MAGNETIC BUTTONS ──────────────────────────
const magneticBtns = document.querySelectorAll('.btn');
if (window.innerWidth >= 768) {
  magneticBtns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const h = rect.width / 2;
      const x = e.clientX - rect.left - h;
      const y = e.clientY - rect.top - h;
      // Move the button slightly towards the mouse
      btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      // Reset position
      btn.style.transform = `translate(0px, 0px)`;
    });
  });
}

// ── ADVANCED TEXT REVEALS (GSAP + SplitType) ──
if (typeof SplitType !== 'undefined' && typeof gsap !== 'undefined') {
  // Add reveal-text class to hero headings for animation
  const splitElements = document.querySelectorAll('.hero-title, .section-title');
  splitElements.forEach(el => el.classList.add('reveal-text'));

  const textToSplit = new SplitType('.reveal-text', { types: 'chars, words' });

  gsap.registerPlugin(ScrollTrigger);

  textToSplit.chars.forEach((char) => {
    gsap.fromTo(char,
      { y: '115%', opacity: 0 },
      {
        y: '0%',
        opacity: 1,
        duration: 0.8,
        stagger: 0.05,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: char.closest('.reveal-text'),
          start: 'top 90%',
        }
      }
    );
  });
}
