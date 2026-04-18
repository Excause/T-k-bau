/**
 * TK Bau – app.js
 * ================
 * Passwortschutz (SHA-256) + Navigation + Animationen
 *
 * Standard-Passwort: TKBau2025!
 * Hash ändern:
 *   1. Browser-Konsole öffnen
 *   2. Eingeben: const h=await crypto.subtle.digest('SHA-256',new TextEncoder().encode('DeinNeuesPasswort')); console.log([...new Uint8Array(h)].map(b=>b.toString(16).padStart(2,'0')).join(''))
 *   3. Hex-String in PASS_HASH unten ersetzen
 */

'use strict';

/* ── PASSWORT-KONFIGURATION ────────────────────────────────
   SHA-256 Hash von "TKBau2025!"
   Um das Passwort zu ändern: Hash oben laut Anleitung neu berechnen.
   ──────────────────────────────────────────────────────── */
const PASS_HASH = 'de654b6f652686ba6e01142e5ea8f831ccc54da66279bffc625357c711dbaf10';
const SESS_KEY  = 'tkbau-auth';

/* ══════════════════════════════════════════════════════════
   PASSWORT-GATE
══════════════════════════════════════════════════════════ */
async function sha256hex(str) {
  const buf  = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
}

function unlockSite() {
  sessionStorage.setItem(SESS_KEY, '1');
  const gate = document.getElementById('pw-gate');
  const site = document.getElementById('site');
  gate.style.transition = 'opacity .4s ease';
  gate.style.opacity = '0';
  setTimeout(() => {
    gate.remove();
    site.hidden = false;
    initSite();
  }, 400);
}

async function initGate() {
  // Bereits authentifiziert?
  if (sessionStorage.getItem(SESS_KEY)) {
    document.getElementById('pw-gate').remove();
    document.getElementById('site').hidden = false;
    initSite();
    return;
  }

  const form   = document.getElementById('pw-form');
  const input  = document.getElementById('pw-input');
  const error  = document.getElementById('pw-error');
  const toggle = document.getElementById('pw-toggle');

  // Passwort anzeigen/verbergen
  toggle.addEventListener('click', () => {
    const isText = input.type === 'text';
    input.type = isText ? 'password' : 'text';
    toggle.setAttribute('aria-label', isText ? 'Passwort anzeigen' : 'Passwort verbergen');
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    error.textContent = '';

    const val = input.value.trim();
    if (!val) {
      error.textContent = 'Bitte ein Passwort eingeben.';
      input.focus();
      return;
    }

    const hash = await sha256hex(val);
    if (hash === PASS_HASH) {
      unlockSite();
    } else {
      input.value = '';
      error.textContent = 'Falsches Passwort. Bitte erneut versuchen.';
      input.focus();
      // Shake-Animation
      const card = document.querySelector('.pw-gate__card');
      card.style.animation = 'none';
      card.offsetHeight; // reflow
      card.style.animation = 'shake .4s ease';
    }
  });
}

/* Shake-Keyframe dynamisch einfügen */
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
  @keyframes shake {
    0%,100% { transform: translateX(0); }
    20%     { transform: translateX(-10px); }
    40%     { transform: translateX(10px); }
    60%     { transform: translateX(-8px); }
    80%     { transform: translateX(6px); }
  }
`;
document.head.appendChild(shakeStyle);

/* ══════════════════════════════════════════════════════════
   HAUPTSEITE
══════════════════════════════════════════════════════════ */
function initSite() {
  initNav();
  initScrollProgress();
  initScrollReveal();
  initCounters();
  initContactForm();
  setFooterYear();
}

/* ── NAVIGATION ── */
function initNav() {
  const header    = document.getElementById('header');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');
  const links     = navLinks.querySelectorAll('.nav__link');

  // Scrolled-Klasse
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
    updateActiveLink();
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Hamburger
  hamburger.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open);
  });

  // Links schließen Menü auf Mobile
  links.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
}

function updateActiveLink() {
  const sections = document.querySelectorAll('section[id]');
  const navH     = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'));
  let current    = '';

  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - navH - 80) {
      current = sec.id;
    }
  });

  document.querySelectorAll('.nav__link').forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + current);
  });
}

/* ── SCROLL PROGRESS ── */
function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const total    = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (total > 0 ? (scrolled / total) * 100 : 0) + '%';
  }, { passive: true });
}

/* ── SCROLL REVEAL ── */
function initScrollReveal() {
  const targets = document.querySelectorAll(
    '.service-card, .ref-card, .news-card, .stat, .ueber__text, .ueber__media, .kontakt__info, .kontakt__form, .section__header'
  );

  targets.forEach((el, i) => {
    el.classList.add('reveal');
    const delay = i % 4;
    if (delay > 0) el.classList.add(`reveal-delay-${delay}`);
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  targets.forEach(el => observer.observe(el));
}

/* ── COUNTER ANIMATION ── */
function initCounters() {
  const counters = document.querySelectorAll('.stat__number[data-target]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const duration = 1600;
      const step     = 16;
      const total    = Math.ceil(duration / step);
      let count      = 0;

      const timer = setInterval(() => {
        count++;
        const progress = count / total;
        // Ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target);
        if (count >= total) {
          el.textContent = target;
          clearInterval(timer);
        }
      }, step);

      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

/* ── KONTAKTFORMULAR ── */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const feedback = document.getElementById('form-feedback');
    const btn      = form.querySelector('[type="submit"]');

    btn.disabled    = true;
    btn.textContent = 'Wird gesendet…';
    feedback.textContent = '';
    feedback.className = 'form__feedback';

    // Simulierte Verarbeitung (echte Implementierung: Formspree / Netlify Forms / mailto)
    await new Promise(r => setTimeout(r, 1200));

    // Hier können Sie Formspree o.Ä. einbinden:
    // const data = new FormData(form);
    // const res  = await fetch('https://formspree.io/f/YOUR_ID', { method:'POST', body:data });

    feedback.textContent = 'Vielen Dank! Ihre Nachricht wurde gesendet. Wir melden uns bald.';
    feedback.classList.add('success');
    form.reset();
    btn.disabled    = false;
    btn.textContent = 'Nachricht senden';
  });
}

/* ── FOOTER JAHR ── */
function setFooterYear() {
  const el = document.getElementById('footer-year');
  if (el) el.textContent = new Date().getFullYear();
}

/* ══════════════════════════════════════════════════════════
   START
══════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', initGate);
