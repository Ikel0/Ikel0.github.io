const nav = document.querySelector('.nav-wrap');
const menu = document.querySelector('#menu');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

const setMenuState = open => {
  nav.classList.toggle('open', open);
  menu.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
};

window.addEventListener('scroll', () => {
  nav.classList.toggle('is-scrolled', window.scrollY > 10);
}, { passive: true });

menu.addEventListener('click', () => {
  setMenuState(!nav.classList.contains('open'));
});

document.querySelectorAll('nav a').forEach(link => {
  link.addEventListener('click', () => setMenuState(false));
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && nav.classList.contains('open')) {
    setMenuState(false);
    menu.focus();
  }
});

const revealTargets = document.querySelectorAll(
  '.reveal, .capability, .research-dossier, .journal-row, .timeline article'
);

if (reduceMotion.matches || !('IntersectionObserver' in window)) {
  revealTargets.forEach(element => element.classList.add('visible'));
} else {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealTargets.forEach(element => {
    element.classList.add('will-reveal');
    observer.observe(element);
  });
}
