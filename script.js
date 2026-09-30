const nav = document.querySelector('.main-nav');
const menu = document.querySelector('#menu');

const setMenuState = open => {
  nav.classList.toggle('is-open', open);
  menu.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
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
