// --- Age Verification Gate with 30-Minute Expiry ---

document.addEventListener("DOMContentLoaded", () => {
  const ageGate = document.getElementById('age-gate');
  if (!ageGate) return;

  const THIRTY_MINUTES = 30 * 60 * 1000; // 30 minutes in milliseconds
  const lastVerified = localStorage.getItem('ageVerifiedTime');
  const now = Date.now();

  // If they verified less than 30 minutes ago, hide the gate immediately
  if (lastVerified && (now - lastVerified < THIRTY_MINUTES)) {
    ageGate.style.display = 'none'; 
    document.body.style.overflow = ''; // Allow scrolling
  } else {
    // Otherwise, they need to verify (or re-verify)
    ageGate.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Lock scrolling
  }
});

function enterSite() {
  const ageGate = document.getElementById('age-gate');
  if (ageGate) {
    // 1. Save the exact current time to the browser's memory
    localStorage.setItem('ageVerifiedTime', Date.now());
    
    // 2. Hide the gate and restore scrolling
    ageGate.classList.add('hidden');
    document.body.style.overflow = '';
    
    // Clean up display property after opacity fade transition completes
    setTimeout(() => {
      ageGate.style.display = 'none';
    }, 800);
  }
}

function denyEntry() {
  const deniedMessage = document.getElementById('age-denied');
  if (deniedMessage) {
    deniedMessage.style.display = 'block';
  }
}

function handleReserve(btn) {
  const input = btn.previousElementSibling;
  if (input.value && input.value.includes('@')) {
    btn.textContent = 'Reserved ✓';
    btn.style.background = '#5C2E0E';
    input.value = '';
    input.placeholder = 'You\'re on the list!';
  } else {
    input.style.borderBottom = '1px solid #7A1E1E';
    input.focus();
  }
}

// Update the Nav scroll behavior in script.js
const nav = document.getElementById('main-nav');

window.addEventListener('scroll', () => {
  if (nav) {
    // We only use the class now for secondary effects like the blur
    // the gradient remains fixed via the CSS 'nav' selector above
    if (window.scrollY > 20) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }
});

// Scroll reveal
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

reveals.forEach(el => observer.observe(el));

// Custom Cursor Logic
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');

if (cursor && ring) {
  let mx = 0, my = 0, rx = 0, ry = 0;
  
  window.addEventListener('mousemove', e => { 
    mx = e.clientX; 
    my = e.clientY; 
  });

  // Track coordinates cleanly through animation frames
  requestAnimationFrame(function animCursor() {
    cursor.style.transform = `translate3d(${mx - 5}px, ${my - 5}px, 0)`;
    
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    
    ring.style.transform = `translate3d(${rx - 19}px, ${ry - 19}px, 0)`;
    
    requestAnimationFrame(animCursor);
  });
}

// Mobile Menu Trigger Functionality
function toggleMobileMenu() {
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const menuDrawer = document.getElementById('mobileDrawer');
  
  if (menuToggle && menuDrawer) {
    menuToggle.classList.toggle('active');
    menuDrawer.classList.toggle('open');
    
    // Prevent underlying main content area from scrolling while mobile panel stays open
    if (menuDrawer.classList.contains('open')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }
}

// Footer accordion (Explore / Social) — mobile only, no-op visually on desktop
function toggleFooterCol(btn) {
  const col = btn.closest('.footer-nav-col');
  if (!col) return;
  const isOpen = col.classList.toggle('open');
  btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
}
// --- Hide header on scroll down, bring it back on scroll up ---
// Scrolling down: the header moves up with the page, so it feels like you are scrolling past it.
// Scrolling up: the header slides smoothly back into view.
(() => {
  const header = document.getElementById('main-nav');
  if (!header) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const SLIDE_IN = 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)';
  const UP_THRESHOLD = 4; // ignore tiny finger/trackpad jitters
  let lastY = Math.max(window.scrollY, 0);
  let offset = 0; // how far the header is pushed up, in px
  let ticking = false;

  // Extra 50px also hides the gradient/blur that extends below the bar
  const hideDistance = () => header.offsetHeight + 50;

  function apply(animate) {
    header.style.transition = animate && !reduceMotion ? SLIDE_IN : 'none';
    header.style.transform = offset ? `translate3d(0, ${-offset}px, 0)` : '';
  }

  function show() {
    if (offset !== 0) { offset = 0; apply(true); }
  }

  function update() {
    ticking = false;
    const y = Math.max(window.scrollY, 0);
    const dy = y - lastY;
    lastY = y;

    // Keep the header visible while the mobile menu is open
    const drawer = document.getElementById('mobileDrawer');
    if (drawer && drawer.classList.contains('open')) { show(); return; }

    // Ignore the iOS bounce at the very bottom of the page
    const atBottom = window.innerHeight + y >= document.documentElement.scrollHeight - 2;

    if (dy > 0) {
      const next = Math.min(hideDistance(), offset + dy);
      if (next !== offset) { offset = next; apply(false); }
    } else if (dy < -UP_THRESHOLD && !atBottom) {
      show();
    }
  }

  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });

  // Bring the header back if someone tabs into it with the keyboard
  header.addEventListener('focusin', show);
})();