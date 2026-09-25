const nav = document.querySelector('.nav-wrap');
const menu = document.querySelector('#menu');
const scrollProgress = document.querySelector('#scroll-progress-bar');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const setMenuState = open => {
  nav.classList.toggle('open', open);
  menu.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
};

const updatePageState = () => {
  nav.classList.toggle('is-scrolled', window.scrollY > 10);

  if (scrollProgress) {
    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollableHeight > 0 ? Math.min(window.scrollY / scrollableHeight, 1) : 0;
    scrollProgress.style.transform = `scaleX(${progress})`;
  }
};

updatePageState();
window.addEventListener('scroll', updatePageState, { passive: true });
menu.addEventListener('click', () => setMenuState(!nav.classList.contains('open')));
document.querySelectorAll('nav a').forEach(link => link.addEventListener('click', () => setMenuState(false)));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && nav.classList.contains('open')) {
    setMenuState(false);
    menu.focus();
  }
});

// Change this value when your availability changes: available | limited | unavailable.
const availabilityMode = 'available';
const availability = {
  available: {
    label: 'Libre',
    note: 'Ouvert aux opportunités et aux échanges.'
  },
  limited: {
    label: 'Un peu occupé',
    note: 'Quelques créneaux restent possibles selon le sujet.'
  },
  unavailable: {
    label: 'Indisponible',
    note: 'Je ne prends pas de nouveau sujet pour le moment.'
  }
};

const availabilityElement = document.querySelector('#availability');
const currentAvailability = availability[availabilityMode] ?? availability.available;

if (availabilityElement) {
  availabilityElement.dataset.mode = availabilityMode;
  availabilityElement.querySelector('strong').textContent = currentAvailability.label;
  availabilityElement.querySelector('.availability-note').textContent = currentAvailability.note;
}

const navigationLinks = [...document.querySelectorAll('nav a[href^="#"]')];
const navigationSections = navigationLinks
  .map(link => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

const setCurrentSection = sectionId => {
  navigationLinks.forEach(link => {
    const isCurrent = link.getAttribute('href') === `#${sectionId}`;
    if (isCurrent) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
};

if (navigationSections.length) {
  const sectionObserver = new IntersectionObserver(entries => {
    const active = entries
      .filter(entry => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (active) setCurrentSection(active.target.id);
  }, { rootMargin: '-18% 0px -64% 0px', threshold: [0.12, 0.35, 0.6] });

  navigationSections.forEach(section => sectionObserver.observe(section));
}

if (!prefersReducedMotion && window.matchMedia('(hover: hover)').matches) {
  document.querySelectorAll('.capability, .project-feature, .workshop-card, .delivery-grid article').forEach(surface => {
    surface.addEventListener('pointermove', event => {
      const bounds = surface.getBoundingClientRect();
      surface.style.setProperty('--pointer-x', `${((event.clientX - bounds.left) / bounds.width) * 100}%`);
      surface.style.setProperty('--pointer-y', `${((event.clientY - bounds.top) / bounds.height) * 100}%`);
    });
  });
}
