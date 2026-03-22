// ARYAN SATAM PORTFOLIO — main.js

document.addEventListener("DOMContentLoaded", () => {
  // 1. Lenis Smooth Scroll
  if (typeof Lenis !== 'undefined') {
    const lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true
    });
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  // 2. Custom Magnetic Cursor (Mix-Blend-Mode)
  const cursor = document.getElementById("magnetic-cursor");
  if (cursor && typeof gsap !== 'undefined') {
    window.addEventListener("mousemove", (e) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.15,
        ease: "power2.out"
      });
    });

    // Expansion hover effect on interactable elements
    const interactives = document.querySelectorAll('a, button, .tilt-card, .hollow-text, .sub-hollow, .char');
    interactives.forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
    });
  }

  // Text Reveal Logic
  if (typeof SplitType !== 'undefined' && typeof gsap !== 'undefined') {
    const text1 = new SplitType('.hollow-text', { types: 'chars' });
    const text2 = new SplitType('.sub-hollow', { types: 'chars' });
    
    gsap.from(text1.chars, {
      y: 120, opacity: 0, rotationZ: 10, stagger: 0.04, duration: 1.2, ease: "power4.out", delay: 0.2
    });
    
    gsap.from(text2.chars, {
      y: 120, opacity: 0, rotationZ: -10, stagger: 0.04, duration: 1.2, ease: "power4.out", delay: 0.4
    });
    
    gsap.from('.hero-bottom-info p', {
      y: 20, opacity: 0, duration: 1, stagger: 0.2, delay: 1, ease: "power2.out"
    });
  }

  // Magnetic Buttons Logic
  const magneticBtns = document.querySelectorAll('.cyber-btn, .glow-button');
  magneticBtns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(btn, { x: x * 0.4, y: y * 0.4, duration: 0.3, ease: "power2.out" });
    });
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" });
    });
  });

  // 3. 3D Canvas Video Scrubbing (GSAP)
  const canvas = document.getElementById("bg-canvas");
  if (canvas && typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    
    const context = canvas.getContext("2d");
    canvas.width = 1280;
    canvas.height = 720;
    
    const frameCount = 192;
    const currentFrame = index => `/static/images/frames/frame_${(index + 1).toString().padStart(4, '0')}.jpg`;

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
      ease: "power1.inOut",
      scrollTrigger: {
        trigger: document.body, 
        start: "top top",
        end: "bottom bottom",
        scrub: 2.5
      },
      onUpdate: () => {
        if(images[sequence.frame] && images[sequence.frame].complete) {
          context.clearRect(0, 0, canvas.width, canvas.height);
          context.drawImage(images[sequence.frame], 0, 0, canvas.width, canvas.height);
        }
      }
    });

    images[0].onload = () => {
      context.drawImage(images[0], 0, 0, canvas.width, canvas.height);
    };

    // 4. GSAP Reverse-Gravity Reveals for 3D Cards
    const tiltCards = document.querySelectorAll('.tilt-card');
    tiltCards.forEach((card) => {
      gsap.fromTo(card,
        { y: 150, opacity: 0, rotateX: 10 },
        {
          y: 0, opacity: 1, rotateX: 0,
          duration: 1.2,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });

    // 6. Services Revel
    const services = document.querySelectorAll('.service-item');
    services.forEach((srv, index) => {
      gsap.fromTo(srv,
        { x: -50, opacity: 0 },
        {
          x: 0, opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: srv,
            start: "top 90%"
          }
        });
    });

    // 5. Stack Bar fills
    const stackFills = document.querySelectorAll('.stack-fill');
    stackFills.forEach(fill => {
      const width = fill.getAttribute('data-width');
      gsap.to(fill, {
        width: width + '%',
        duration: 1.5,
        ease: "power3.out",
        scrollTrigger: {
          trigger: fill,
          start: "top 90%"
        }
      });
    });
  }
});
