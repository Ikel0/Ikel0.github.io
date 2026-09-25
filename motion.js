import { animate, stagger } from 'https://cdn.jsdelivr.net/npm/motion@11.11.13/+esm';

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reducedMotion) {
  const selectors = [
    '.hero .reveal',
    '.section-heading',
    '.capability',
    '.approach',
    '.collection-meta',
    '.project-feature',
    '.workshop-heading',
    '.workshop-card',
    '.workshop-footnote',
    '.delivery-grid article',
    '.delivery-note',
    '.timeline article',
    '.contact > div'
  ];

  const targets = [...document.querySelectorAll(selectors.join(','))];
  targets.forEach(target => target.classList.add('motion-target'));
  document.documentElement.classList.add('motion-ready');

  const heroTargets = [...document.querySelectorAll('.hero .motion-target')];
  requestAnimationFrame(() => {
    animate(heroTargets, { opacity: [0.78, 1], y: [18, 0] }, {
      delay: stagger(0.08),
      duration: 0.72,
      easing: [0.22, 1, 0.36, 1]
    });
  });

  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting || entry.target.dataset.motionSeen) return;

      entry.target.dataset.motionSeen = 'true';
      const sectionTargets = [...entry.target.querySelectorAll('.motion-target')];
      animate(sectionTargets, { opacity: [0.78, 1], y: [20, 0] }, {
        delay: stagger(0.055),
        duration: 0.62,
        easing: [0.22, 1, 0.36, 1]
      });
      sectionObserver.unobserve(entry.target);
    });
  }, { threshold: 0.04 });

  document.querySelectorAll('.section-shell:not(.hero)').forEach(section => sectionObserver.observe(section));
}
