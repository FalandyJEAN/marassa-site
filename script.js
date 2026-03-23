/* ============================================================
   MARASSAH FONDATION — script.js
   ============================================================ */

/* ── Header ─────────────────────────────────────────────────── */
const header    = document.getElementById('header');
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  header.classList.toggle('scrolled', y > 60);
  backToTop.classList.toggle('visible', y > 500);
}, { passive: true });

/* ── Hamburger ──────────────────────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const navMenu   = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
  const open = hamburger.getAttribute('aria-expanded') === 'true';
  hamburger.setAttribute('aria-expanded', !open);
  navMenu.classList.toggle('open', !open);
});

navMenu.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => {
    hamburger.setAttribute('aria-expanded', 'false');
    navMenu.classList.remove('open');
  })
);

/* ── Nav scroll spy ─────────────────────────────────────────── */
const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
const spy = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting)
      navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id));
  });
}, { threshold: 0.35 });
document.querySelectorAll('section[id]').forEach(s => spy.observe(s));

/* ── Counters ───────────────────────────────────────────────── */
function animateCounter(el) {
  const target = +el.dataset.target;
  const step   = target / 120;
  let   cur    = 0;
  const tick = () => {
    cur = Math.min(cur + step, target);
    el.textContent = Math.floor(cur).toLocaleString('fr-FR');
    if (cur < target) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

const cObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { animateCounter(e.target); cObs.unobserve(e.target); } });
}, { threshold: 0.6 });
document.querySelectorAll('.counter').forEach(el => cObs.observe(el));

/* ── Reveal on scroll ───────────────────────────────────────── */
const rObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); rObs.unobserve(e.target); } });
}, { threshold: 0.1 });

document.querySelectorAll('.prog-card, .news-card, .don-tier, .about-content, .about-visuals, .don-info, .don-form-card, .contact-info, .contact-form').forEach((el, i) => {
  el.classList.add('reveal');
  if (i % 3 === 1) el.classList.add('reveal-d1');
  if (i % 3 === 2) el.classList.add('reveal-d2');
  rObs.observe(el);
});

/* ── Amount buttons ─────────────────────────────────────────── */
const amountBtns  = document.querySelectorAll('.amount-btn');
const amountInput = document.querySelector('.don-form input[type="number"]');

amountBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    amountBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    if (!amountInput) return;
    if (btn.dataset.amount === 'other') { amountInput.value = ''; amountInput.focus(); }
    else amountInput.value = btn.dataset.amount;
  });
});

/* ── Toast ──────────────────────────────────────────────────── */
function toast(msg, isError = false) {
  document.querySelector('.toast')?.remove();
  const t = Object.assign(document.createElement('div'), { className: 'toast' + (isError ? ' error' : ''), textContent: msg });
  document.body.appendChild(t);
  requestAnimationFrame(() => requestAnimationFrame(() => t.classList.add('show')));
  setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 400); }, 4500);
}

/* ── Donation form ──────────────────────────────────────────── */
document.querySelector('.don-form')?.addEventListener('submit', e => {
  e.preventDefault();
  const f = e.target;
  const prenom  = f.prenom?.value.trim();
  const nom     = f.nom?.value.trim();
  const email   = f.email?.value.trim();
  const montant = f.montant?.value;
  const mode    = f.mode?.value;

  if (!prenom || !nom || !email) return toast('Veuillez remplir tous les champs obligatoires.', true);
  if (!montant || +montant < 1)  return toast('Montant invalide.', true);
  if (!mode)                     return toast('Choisissez un mode de paiement.', true);

  const s = encodeURIComponent(`Don ${montant}$ — ${prenom} ${nom}`);
  const b = encodeURIComponent(`Don reçu\n\nNom : ${prenom} ${nom}\nEmail : ${email}\nMontant : ${montant} USD\nMode : ${mode}`);
  window.location.href = `mailto:marassahfondation@gmail.com?subject=${s}&body=${b}`;

  toast(`Merci ${prenom}. Votre contribution a bien été transmise.`);
  f.reset();
  amountBtns.forEach((b, i) => b.classList.toggle('active', i === 0));
  if (amountInput) amountInput.value = '25';
});

/* ── Contact form ───────────────────────────────────────────── */
document.querySelector('.contact-form')?.addEventListener('submit', e => {
  e.preventDefault();
  const f = e.target;
  const required = [...f.querySelectorAll('[required]')];
  let valid = true;
  required.forEach(el => {
    const ok = el.value.trim() !== '';
    el.style.borderColor = ok ? '' : '#EF4444';
    if (!ok) valid = false;
  });
  if (!valid) return toast('Merci de remplir tous les champs obligatoires.', true);

  const inputs  = f.querySelectorAll('input[type="text"]');
  const prenom  = inputs[0]?.value.trim();
  const nom     = inputs[1]?.value.trim();
  const email   = f.querySelector('input[type="email"]')?.value.trim();
  const sujet   = inputs[2]?.value.trim();
  const message = f.querySelector('textarea')?.value.trim();

  const s = encodeURIComponent(sujet || `Message — ${prenom} ${nom}`);
  const b = encodeURIComponent(`Nom : ${prenom} ${nom}\nEmail : ${email}\n\n${message}`);
  window.location.href = `mailto:marassahfondation@gmail.com?subject=${s}&body=${b}`;

  toast(`Message envoyé. Nous vous répondrons dans les plus brefs délais.`);
  f.reset();
});

/* ── Smooth scroll ──────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id === '#') { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    const target = document.querySelector(id);
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - header.offsetHeight - 8;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});
