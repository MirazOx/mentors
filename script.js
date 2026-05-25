/**
 * Miraz Mentors - Premium Minimalist Interaction Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize floating header scroll listener
  initHeaderScroll();

  // Initialize scroll-triggered reveal animations
  initScrollReveals();

  // Initialize smooth scrolling for anchor links
  initSmoothScroll();

  // Initialize twinkling star canvas background
  initSparkles();
});

/**
 * Adds 'scrolled' class to header when window is scrolled down
 */
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const checkScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  // Run once immediately to capture state on page reload
  checkScroll();
  window.addEventListener('scroll', checkScroll, { passive: true });
}

/**
 * Registers intersection observer to trigger scroll reveal animations
 */
function initScrollReveals() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if (revealElements.length === 0) return;

  const observerOptions = {
    root: null, // use browser viewport
    rootMargin: '0px',
    threshold: 0.12 // trigger when 12% of the element is visible
  };

  const observer = new IntersectionObserver((entries, observerInstance) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Unobserve once revealed to maintain performance
        observerInstance.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(element => {
    observer.observe(element);
  });
}

/**
 * Handles ultra-smooth scrolling animation for anchors
 */
function initSmoothScroll() {
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  
  anchorLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (!targetElement) return;

      // Prevent default immediate jump
      e.preventDefault();

      // Get target coordinate relative to viewport
      const elementPosition = targetElement.getBoundingClientRect().top;
      // Get current scroll position
      const offsetPosition = elementPosition + window.pageYOffset;

      // Smooth scroll using native window scroll
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    });
  });
}

/**
 * Renders the high-end vanilla canvas sparkle particle animation at the hero section
 */
function initSparkles() {
  const canvas = document.getElementById('sparkles');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let particles = [];
  let W = 0;
  let H = 0;

  function size() {
    const r = canvas.parentElement.getBoundingClientRect();
    W = r.width; 
    H = r.height;
    canvas.width = W * dpr; 
    canvas.height = H * dpr;
    canvas.style.width = W + 'px'; 
    canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    seed();
  }

  function seed() {
    // density scales with area; capped for performance
    const count = Math.min(150, Math.round(W * H / 9000));
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.6 + 0.4,
        baseA: Math.random() * 0.5 + 0.15,
        a: Math.random(),
        tw: Math.random() * 0.025 + 0.005,   // twinkle speed
        dir: Math.random() < 0.5 ? 1 : -1,
        vy: -(Math.random() * 0.22 + 0.04),  // gentle upward drift
        vx: (Math.random() - 0.5) * 0.12,
        gold: Math.random() < 0.18           // ~18% are warm gold
      });
    }
  }

  function frame() {
    ctx.clearRect(0, 0, W, H);
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.a += p.tw * p.dir;
      if (p.a > 1) {
        p.a = 1; 
        p.dir = -1;
      } else if (p.a < 0.1) {
        p.a = 0.1; 
        p.dir = 1;
      }
      
      if (!reduce) {
        p.x += p.vx; 
        p.y += p.vy;
        if (p.y < -4) {
          p.y = H + 4; 
          p.x = Math.random() * W;
        }
        if (p.x < -4) {
          p.x = W + 4;
        } else if (p.x > W + 4) {
          p.x = -4;
        }
      }
      
      const alpha = p.baseA * p.a;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.gold
        ? 'rgba(201,163,94,' + alpha + ')'
        : 'rgba(250,246,239,' + alpha + ')';
      ctx.fill();
    }
    requestAnimationFrame(frame);
  }

  size();
  window.addEventListener('resize', size);
  requestAnimationFrame(frame);
}

