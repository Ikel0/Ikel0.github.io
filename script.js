const nav = document.querySelector('.main-nav');
const menu = document.querySelector('#menu');
const menuLabels = document.documentElement.lang === 'en'
  ? { close: 'Close menu', open: 'Open menu' }
  : { close: 'Fermer le menu', open: 'Ouvrir le menu' };

const setMenuState = open => {
  nav.classList.toggle('is-open', open);
  menu.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-label', open ? menuLabels.close : menuLabels.open);
};

menu.addEventListener('click', () => {
  setMenuState(!nav.classList.contains('is-open'));
  placeIndicator();
});
document.querySelectorAll('.main-nav a').forEach(link => {
  link.addEventListener('click', () => setMenuState(false));
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && nav.classList.contains('is-open')) {
    setMenuState(false);
    menu.focus();
  }
});

// Indicateur de lien courant : un seul trait, qui glisse sous le lien marqué aria-current.
// Posé sans transition la première fois et après un changement de taille, pour que rien ne
// bouge sans qu'on ait fait quelque chose.
const navIndicator = document.createElement('span');
navIndicator.className = 'nav-indicator';
navIndicator.setAttribute('aria-hidden', 'true');
nav.append(navIndicator);
const placeIndicator = (animate = true) => {
  const current = nav.querySelector('a[aria-current]');
  if (!current || nav.classList.contains('is-open')) {
    navIndicator.classList.remove('is-on');
    return;
  }
  const navBox = nav.getBoundingClientRect();
  const box = current.getBoundingClientRect();
  if (!animate || !navIndicator.classList.contains('is-on')) {
    navIndicator.classList.remove('is-live');
    void navIndicator.offsetWidth;
  }
  navIndicator.style.transform = `translateX(${box.left - navBox.left}px)`;
  navIndicator.style.width = `${box.width}px`;
  navIndicator.classList.add('is-on');
  requestAnimationFrame(() => navIndicator.classList.add('is-live'));
};
placeIndicator(false);
window.addEventListener('resize', () => placeIndicator(false));
if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => placeIndicator(false));

// Menu : souligne la section en cours de lecture (page d'accueil seulement). La section
// active est la dernière dont le haut a dépassé 20 % de la hauteur de l'écran.
const sectionLinks = [...document.querySelectorAll('.main-nav a[href^="#"]')];
const trackedSections = sectionLinks
  .map(link => [link, document.getElementById(link.getAttribute('href').slice(1))])
  .filter(([, section]) => section);
if (trackedSections.length) {
  let scheduled = false;
  const update = () => {
    scheduled = false;
    const line = window.innerHeight * 0.2;
    let current = null;
    trackedSections.forEach(([link, section]) => {
      if (section.getBoundingClientRect().top <= line) current = link;
    });
    sectionLinks.forEach(link => link.toggleAttribute('aria-current', link === current));
    if (current) current.setAttribute('aria-current', 'true');
    placeIndicator();
  };
  window.addEventListener('scroll', () => {
    if (!scheduled) { scheduled = true; requestAnimationFrame(update); }
  }, { passive: true });
  update();
}

const stackBand = document.querySelector('.stack-band');
if (stackBand && 'IntersectionObserver' in window) {
  new IntersectionObserver(([entry]) => stackBand.classList.toggle('is-away', !entry.isIntersecting)).observe(stackBand);
}
