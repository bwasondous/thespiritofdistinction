// --- Age Verification Gate with 10-Minute Expiry ---

document.addEventListener("DOMContentLoaded", () => {
  const ageGate = document.getElementById('age-gate');
  if (!ageGate) return;

  const TEN_MINUTES = 10 * 60 * 1000; // 10 minutes in milliseconds
  const lastVerified = localStorage.getItem('ageVerifiedTime');
  const now = Date.now();

  // If they verified less than 10 minutes ago, hide the gate immediately
  if (lastVerified && (now - lastVerified < TEN_MINUTES)) {
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