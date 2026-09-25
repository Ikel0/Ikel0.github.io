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

const filterButtons = [...document.querySelectorAll('[data-project-filter]')];
const filterSummary = document.querySelector('#project-filter-summary');
const projectCards = [...document.querySelectorAll('[data-project-topics]')];
const filterLabels = {
  all: 'Tous les projets',
  production: 'Systèmes pensés pour la production',
  ai: 'IA fiable et vérifiable',
  stream: 'Systèmes temps réel',
  api: 'APIs et contrats d’intégration'
};

const applyProjectFilter = topic => {
  let matchCount = 0;

  projectCards.forEach(card => {
    const matches = topic === 'all' || card.dataset.projectTopics.split(',').includes(topic);
    card.classList.toggle('is-filtered', !matches);
    if (matches) matchCount += 1;
  });

  filterButtons.forEach(button => {
    button.setAttribute('aria-pressed', String(button.dataset.projectFilter === topic));
  });

  if (filterSummary) {
    filterSummary.textContent = topic === 'all'
      ? filterLabels.all
      : `${matchCount} projets : ${filterLabels[topic]}`;
  }
};

filterButtons.forEach(button => {
  button.addEventListener('click', () => applyProjectFilter(button.dataset.projectFilter));
});

const commandDialog = document.querySelector('#command-palette');
const commandTrigger = document.querySelector('#command-trigger');
const commandClose = document.querySelector('#command-close');
const commandSearch = document.querySelector('#command-search');
const commandItems = [...document.querySelectorAll('[data-command-target]')];
const commandEmpty = document.querySelector('#command-empty');
let activeCommandIndex = 0;

const visibleCommandItems = () => commandItems.filter(item => !item.hidden);

const setActiveCommand = index => {
  const visibleItems = visibleCommandItems();
  if (!visibleItems.length) return;

  activeCommandIndex = (index + visibleItems.length) % visibleItems.length;
  visibleItems.forEach((item, itemIndex) => item.classList.toggle('is-command-active', itemIndex === activeCommandIndex));
};

const filterCommands = () => {
  const searchTerm = commandSearch.value.trim().toLocaleLowerCase('fr');

  commandItems.forEach(item => {
    const text = `${item.textContent} ${item.dataset.commandSearch}`.toLocaleLowerCase('fr');
    item.hidden = Boolean(searchTerm) && !text.includes(searchTerm);
  });

  if (commandEmpty) commandEmpty.hidden = visibleCommandItems().length > 0;
  activeCommandIndex = 0;
  setActiveCommand(activeCommandIndex);
};

const openCommandPalette = () => {
  if (!commandDialog || commandDialog.open) return;

  commandDialog.showModal();
  commandSearch.value = '';
  filterCommands();
  commandSearch.focus();
};

const runCommand = item => {
  const target = document.querySelector(item.dataset.commandTarget);
  if (!target) return;

  commandDialog.close();
  target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
  setCurrentSection(target.id);
};

if (commandDialog && commandTrigger && commandClose && commandSearch) {
  commandTrigger.addEventListener('click', openCommandPalette);
  commandClose.addEventListener('click', () => commandDialog.close());
  commandSearch.addEventListener('input', filterCommands);
  commandItems.forEach(item => item.addEventListener('click', () => runCommand(item)));

  document.addEventListener('keydown', event => {
    const isShortcut = (event.metaKey || event.ctrlKey) && event.key.toLocaleLowerCase('fr') === 'k';
    const isTyping = event.target instanceof HTMLElement && event.target.matches('input, textarea, [contenteditable="true"]');

    if (isShortcut) {
      event.preventDefault();
      openCommandPalette();
      return;
    }

    if (!commandDialog.open && event.key === '/' && !isTyping) {
      event.preventDefault();
      openCommandPalette();
      return;
    }

    if (!commandDialog.open) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      commandDialog.close();
      return;
    }

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveCommand(activeCommandIndex + (event.key === 'ArrowDown' ? 1 : -1));
      return;
    }

    if (event.key === 'Enter' && event.target === commandSearch) {
      event.preventDefault();
      const selectedItem = visibleCommandItems()[activeCommandIndex];
      if (selectedItem) runCommand(selectedItem);
    }
  });

  commandDialog.addEventListener('close', () => commandTrigger.focus());
}

const copyEmailButton = document.querySelector('#copy-email');

if (copyEmailButton) {
  const feedback = copyEmailButton.querySelector('span');

  copyEmailButton.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(copyEmailButton.dataset.email);
      feedback.textContent = 'Copié';
    } catch {
      feedback.textContent = 'À copier manuellement';
    }

    window.setTimeout(() => { feedback.textContent = ''; }, 2200);
  });
}
