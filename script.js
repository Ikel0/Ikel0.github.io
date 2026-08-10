const nav = document.querySelector('.nav-wrap');
const menu = document.querySelector('#menu');
const lang = document.querySelector('#langToggle');
let english = false;
window.addEventListener('scroll', () => nav.classList.toggle('is-scrolled', window.scrollY > 10));
menu.addEventListener('click', () => nav.classList.toggle('open'));
document.querySelectorAll('nav a').forEach(link => link.addEventListener('click', () => nav.classList.remove('open')));
lang.addEventListener('click', () => {
  english = !english;
  document.documentElement.lang = english ? 'en' : 'fr';
  lang.firstChild.textContent = english ? 'EN ' : 'FR ';
  lang.setAttribute('aria-label', english ? 'Passer en français' : 'Switch to English');
  document.querySelectorAll('[data-fr]').forEach(node => node.textContent = node.dataset[english ? 'en' : 'fr']);
});
const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); }), {threshold:.12});
document.querySelectorAll('.reveal, .capability, .project, .timeline article').forEach(el => { el.classList.add('will-reveal'); observer.observe(el); });

const demos = [
  { href: 'https://trust-layer-ikel-vt39.onrender.com', label: 'ESSAYER EN LIGNE ↗' },
  { href: 'https://signal-ikel.onrender.com', label: 'ESSAYER EN LIGNE ↗' },
  { href: 'https://flow-ikel-cgdd.onrender.com', label: 'ESSAYER EN LIGNE ↗' }
];
document.querySelectorAll('.case-footer span:last-child').forEach((label, index) => {
  const link = document.createElement('a');
  link.className = 'demo-link';
  link.href = demos[index].href;
  link.target = '_blank';
  link.rel = 'noopener';
  link.textContent = demos[index].label;
  label.replaceWith(link);
});

document.querySelectorAll('.build-status').forEach(status => { status.textContent = 'V1 DISPONIBLE'; });
const projectDescription = document.querySelector('.project-intro > p');
if (projectDescription) projectDescription.textContent = 'Trois prototypes publiés pour montrer un travail concret : code lisible, données de démonstration, tests et une base prête à évoluer. Chaque dépôt détaille le périmètre actuel et les prochaines itérations.';
