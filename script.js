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

menu.addEventListener('click', () => setMenuState(!nav.classList.contains('is-open')));
document.querySelectorAll('.main-nav a').forEach(link => {
  link.addEventListener('click', () => setMenuState(false));
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && nav.classList.contains('is-open')) {
    setMenuState(false);
    menu.focus();
  }
});

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
  };
  window.addEventListener('scroll', () => {
    if (!scheduled) { scheduled = true; requestAnimationFrame(update); }
  }, { passive: true });
  update();
}
