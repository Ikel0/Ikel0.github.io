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

// Bascule clair / sombre. Le thème initial est posé dans le <head> avant l'affichage.
const themeButton = document.querySelector('.theme-toggle');
if (themeButton) {
  const root = document.documentElement;
  const english = root.lang === 'en';
  const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const currentTheme = () => root.dataset.theme || (darkQuery.matches ? 'dark' : 'light');
  const updateLabel = () => {
    const dark = currentTheme() === 'dark';
    themeButton.textContent = english ? (dark ? 'Light' : 'Dark') : (dark ? 'Clair' : 'Sombre');
    themeButton.setAttribute('aria-label', english
      ? (dark ? 'Switch to light theme' : 'Switch to dark theme')
      : (dark ? 'Passer en thème clair' : 'Passer en thème sombre'));
  };
  themeButton.addEventListener('click', () => {
    const next = currentTheme() === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (error) { /* stockage indisponible : le choix vaut pour la page */ }
    updateLabel();
  });
  darkQuery.addEventListener('change', updateLabel);
  updateLabel();
}

// Raccourcis clavier : « t » bascule le thème, « ? » ouvre la liste des raccourcis dans un
// dialog natif (Échap le ferme). Rien n'est capturé quand le focus est dans un champ.
const inField = element => Boolean(element && element.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"])'));
const shortcutsText = document.documentElement.lang === 'en'
  ? { title: 'Keyboard shortcuts', theme: 'Switch theme', list: 'Show this list', esc: 'Esc', close: 'Close' }
  : { title: 'Raccourcis clavier', theme: 'Changer de thème', list: 'Afficher cette liste', esc: 'Échap', close: 'Fermer' };
let shortcutsDialog = null;
const toggleShortcuts = () => {
  if (!shortcutsDialog) {
    shortcutsDialog = document.createElement('dialog');
    shortcutsDialog.className = 'shortcuts';
    shortcutsDialog.setAttribute('aria-labelledby', 'shortcuts-title');
    shortcutsDialog.innerHTML = `<h2 id="shortcuts-title">${shortcutsText.title}</h2>
      <dl><dt><kbd>t</kbd></dt><dd>${shortcutsText.theme}</dd><dt><kbd>?</kbd></dt><dd>${shortcutsText.list}</dd><dt><kbd>${shortcutsText.esc}</kbd></dt><dd>${shortcutsText.close}</dd></dl>
      <form method="dialog"><button type="submit">${shortcutsText.close}</button></form>`;
    document.body.append(shortcutsDialog);
  }
  if (shortcutsDialog.open) shortcutsDialog.close(); else shortcutsDialog.showModal();
};
document.addEventListener('keydown', event => {
  if (event.altKey || event.ctrlKey || event.metaKey || inField(event.target)) return;
  if (event.key === 't' && themeButton && !(shortcutsDialog && shortcutsDialog.open)) {
    event.preventDefault();
    themeButton.click();
  } else if (event.key === '?') {
    event.preventDefault();
    toggleShortcuts();
  }
});
