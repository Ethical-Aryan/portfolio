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

// ── GSAP SCROLL TIMELINE (DARK SIGMA) ─────────
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);

  // Smooth GSAP Canvas Sequence Scrubbing
  const canvas = document.getElementById("bg-canvas");
  if (canvas) {
    const context = canvas.getContext("2d");
    
    // Set fixed internal render size for canvas
    canvas.width = 1280;
    canvas.height = 720;
    
    const frameCount = 240;
    const currentFrame = index => (
      `/static/images/frames/frame_${(index + 1).toString().padStart(4, '0')}.jpg`
    );

    const images = [];
    const sequence = { frame: 0 };

    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      img.src = currentFrame(i);
      images.push(img);
    }

    gsap.to(sequence, {
      frame: frameCount - 1,
      snap: "frame",
      ease: "none",
      scrollTrigger: {
        trigger: "#scroll-timeline",
        start: "top top",
        end: "bottom bottom",
        scrub: 1.5
      },
      onUpdate: render
    });

    images[0].onload = render;

    function render() {
      if(images[sequence.frame] && images[sequence.frame].complete) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        // Canvas is sized via CSS object-fit: cover
        context.drawImage(images[sequence.frame], 0, 0, canvas.width, canvas.height);
      }
    }
  }

  // Cinematic Scrollytelling Animation
  const cardsLeft = document.querySelectorAll('.card-left');
  const cardsRight = document.querySelectorAll('.card-right');
  const allCards = [...cardsLeft, ...cardsRight];

  allCards.forEach(card => {
    gsap.fromTo(card,
      { y: 150, scale: 0.95, opacity: 0 },
      {
        y: 0,
        scale: 1,
        opacity: 1,
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          end: 'top 35%',
          scrub: 1.5
        }
      }
    );
    // Smooth fade out as it scrolls out of view
    gsap.to(card, {
      opacity: 0,
      scale: 0.95,
      scrollTrigger: {
        trigger: card,
        start: 'bottom 40%',
        end: 'bottom 5%',
        scrub: 1.5
      }
    });
  });

}

// ═══════════════════════ CUSTOM CURSOR ═══════════════════════
document.addEventListener("DOMContentLoaded", () => {
  let cursorDot = document.getElementById("cursor-dot");
  let cursorOutline = document.getElementById("cursor-outline");

  // Create cursor elements dynamically if missing from HTML
  if (!cursorDot) {
    cursorDot = document.createElement("div");
    cursorDot.id = "cursor-dot";
    document.body.appendChild(cursorDot);
  }
  if (!cursorOutline) {
    cursorOutline = document.createElement("div");
    cursorOutline.id = "cursor-outline";
    document.body.appendChild(cursorOutline);
  }

  // Track mouse movement
  window.addEventListener("mousemove", (e) => {
    const posX = e.clientX;
    const posY = e.clientY;

    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;

    // Smoothly drag outline behind dot
    cursorOutline.animate({
      left: `${posX}px`,
      top: `${posY}px`
    }, { duration: 500, fill: "forwards" });
  });

  // Add highly visible hover effect on interactive elements
  const interactiveElements = document.querySelectorAll('a, button, .cinematic-card, .btn');
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      document.body.classList.add('cursor-hover');
    });
    el.addEventListener('mouseleave', () => {
      document.body.classList.remove('cursor-hover');
    });
  });
});
