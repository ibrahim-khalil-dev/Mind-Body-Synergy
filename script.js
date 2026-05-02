/**
 * MindBody Synergy — script.js
 * Vanilla JavaScript: Navbar, Scroll Animations, Smooth Scroll, Mobile Menu, Subscribe
 */

'use strict';

/* ── DOM References ─────────────────────────────────────── */
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

/* ── 1. Sticky Navbar — blur on scroll ───────────────────── */
let lastScrollY = 0;

function handleNavbarScroll() {
  const scrollY = window.scrollY;
  if (scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  lastScrollY = scrollY;
}

window.addEventListener('scroll', handleNavbarScroll, { passive: true });
// Run once in case page is loaded mid-scroll
handleNavbarScroll();

/* ── 2. Mobile Menu Toggle ───────────────────────────────── */
hamburger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
  // Prevent body scroll while menu is open
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Close menu on any nav link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

// Close menu on outside click
document.addEventListener('click', (e) => {
  if (navLinks.classList.contains('open') &&
      !navLinks.contains(e.target) &&
      !hamburger.contains(e.target)) {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
});

/* ── 3. Smooth Scroll for Anchor Links ───────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const targetId = anchor.getAttribute('href');
    if (targetId === '#') return;

    const target = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();

    const navbarH = navbar.offsetHeight;
    const targetTop = target.getBoundingClientRect().top + window.scrollY - navbarH;

    window.scrollTo({ top: targetTop, behavior: 'smooth' });
  });
});

/* ── 4. Intersection Observer — Scroll Fade Animations ───── */
const animatedEls = document.querySelectorAll('.fade-up, .fade-left, .fade-right');

const observerOptions = {
  root: null,
  rootMargin: '0px 0px -60px 0px',
  threshold: 0.12,
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Unobserve after animating to save resources
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Fallback: if IntersectionObserver is unavailable, show all elements
if ('IntersectionObserver' in window) {
  animatedEls.forEach(el => observer.observe(el));
} else {
  animatedEls.forEach(el => el.classList.add('visible'));
}

/* ── 5. Subscribe Form Handler ───────────────────────────── */
function handleSubscribe(e) {
  e.preventDefault();
  const form   = e.target;
  const input  = form.querySelector('input[type="email"]');
  const btn    = form.querySelector('button[type="submit"]');
  const email  = input.value.trim();

  if (!email) return;

  // Visual feedback
  btn.textContent = 'Subscribed ✓';
  btn.style.background = '#0f9688';
  btn.disabled = true;
  input.value = '';
  input.disabled = true;

  // Reset after 4 seconds
  setTimeout(() => {
    btn.textContent = 'Subscribe';
    btn.style.background = '';
    btn.disabled = false;
    input.disabled = false;
    input.placeholder = 'Your email address';
  }, 4000);
}

/* ── 6. Subtle Card Tilt on Hover (Service Cards) ─────────── */
document.querySelectorAll('.service-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect   = card.getBoundingClientRect();
    const cx     = rect.left + rect.width  / 2;
    const cy     = rect.top  + rect.height / 2;
    const dx     = (e.clientX - cx) / (rect.width  / 2);
    const dy     = (e.clientY - cy) / (rect.height / 2);
    const tiltX  = (-dy * 4).toFixed(2);
    const tiltY  = ( dx * 4).toFixed(2);

    card.style.transform =
      `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-6px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ── 7. Active Nav Link Highlighting on Scroll ─────────────── */
const sections  = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

function highlightActiveNav() {
  const scrollMid = window.scrollY + window.innerHeight / 3;

  sections.forEach(section => {
    const top    = section.offsetTop;
    const bottom = top + section.offsetHeight;

    if (scrollMid >= top && scrollMid < bottom) {
      navAnchors.forEach(a => a.classList.remove('active'));
      const corresponding = document.querySelector(`.nav-links a[href="#${section.id}"]`);
      if (corresponding) corresponding.classList.add('active');
    }
  });
}

window.addEventListener('scroll', highlightActiveNav, { passive: true });
