// --- Age Verification Gate with 10-Minute Expiry ---

document.addEventListener("DOMContentLoaded", () => {
  const ageGate = document.getElementById('age-gate');
  if (!ageGate) return;

  const TEN_MINUTES = 10 * 60 * 1000;
  const lastVerified = localStorage.getItem('ageVerifiedTime');
  const now = Date.now();

  if (lastVerified && (now - lastVerified < TEN_MINUTES)) {
    // Already verified — check if there's a redirect param
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get('redirect');
    if (redirect) {
      window.location.href = '/' + redirect;
      return;
    }
    ageGate.style.display = 'none';
    document.body.style.overflow = '';
  } else {
    ageGate.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }
});

function enterSite() {
  const ageGate = document.getElementById('age-gate');
  if (ageGate) {
    localStorage.setItem('ageVerifiedTime', Date.now());

    ageGate.classList.add('hidden');
    document.body.style.overflow = '';

    setTimeout(() => {
      ageGate.style.display = 'none';

      // Redirect after verification if param is present
      const params = new URLSearchParams(window.location.search);
      const redirect = params.get('redirect');
      if (redirect) {
        window.location.href = '/' + redirect;
      }
    }, 800);
  }
}

function denyEntry() {
  const deniedMessage = document.getElementById('age-denied');
  if (deniedMessage) {
    deniedMessage.style.display = 'block';
  }
}

// --- Newsletter Submit Handler ---
function handleNewsletterSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const input = form.querySelector('.newsletter-input');
  const btn = form.querySelector('.newsletter-submit');
  if (input && btn) {
    btn.textContent = 'Subscribed ✓';
    btn.style.background = 'var(--mahogany)';
    input.value = '';
    input.placeholder = "You're on the list.";
    input.disabled = true;
    btn.disabled = true;
  }
}

// --- Concierge Form ---
function handleConcierge(event) {
  event.preventDefault();
  const confirm = document.getElementById('concierge-confirm');
  if (confirm) {
    confirm.style.display = 'block';
    event.target.reset();
  }
}

// --- Nav Scroll Behavior ---
const nav = document.getElementById('main-nav');

window.addEventListener('scroll', () => {
  if (nav) {
    if (window.scrollY > 20) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }
});

// --- Scroll Reveal ---
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

// --- Custom Cursor ---
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');

if (cursor && ring) {
  let mx = 0, my = 0, rx = 0, ry = 0;

  window.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
  });

  requestAnimationFrame(function animCursor() {
    cursor.style.transform = `translate3d(${mx - 5}px, ${my - 5}px, 0)`;

    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;

    ring.style.transform = `translate3d(${rx - 19}px, ${ry - 19}px, 0)`;

    requestAnimationFrame(animCursor);
  });
}

// --- Mobile Menu ---
function toggleMobileMenu() {
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const menuDrawer = document.getElementById('mobileDrawer');

  if (menuToggle && menuDrawer) {
    menuToggle.classList.toggle('active');
    menuDrawer.classList.toggle('open');

    if (menuDrawer.classList.contains('open')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }
}