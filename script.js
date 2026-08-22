const nav = document.querySelector('.nav-wrap');
const menu = document.querySelector('#menu');

const setMenuState = open => {
  nav.classList.toggle('open', open);
  menu.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
};

window.addEventListener('scroll', () => nav.classList.toggle('is-scrolled', window.scrollY > 10), { passive: true });
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
