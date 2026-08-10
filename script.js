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

const lab = document.querySelector('.work');
if (lab) lab.innerHTML = `
  <div class="lab-heading"><div><span class="section-index">03 / PROJETS EN LIGNE</span><h2>Trois outils.<br /><em>Trois situations réelles.</em></h2></div><p>Pas de démos abstraites : chacun de ces projets part d’un moment très concret du quotidien d’une équipe data. Choisis celui qui t’intrigue et essaie-le directement.</p></div>
  <div class="project-roadmap"><span>01. un fichier douteux</span><i></i><span>02. une question métier</span><i></i><span>03. un signal à surveiller</span></div>
  <div class="showcase-grid">
    <article class="showcase-card trust-card"><div class="showcase-art"><span class="sticker">CHECK<br>ME</span><div class="trust-sheet"><b>DATA CHECK</b><i></i><i></i><i></i><small>4 issues found</small></div></div><div class="showcase-copy"><p class="project-label">POUR UNE ÉQUIPE QUI FIABILISE SES REPORTINGS</p><h3>Trust Layer</h3><p class="plain">Tu as reçu un CSV et tu ne sais pas s’il est propre ? Trust Layer le contrôle avant qu’il n’alimente un dashboard.</p><dl><div><dt>Il vérifie</dt><dd>IDs, emails, montants et dates.</dd></div><div><dt>Tu repars avec</dt><dd>Un rapport d’erreurs clair, ligne par ligne.</dd></div></dl><div class="showcase-actions"><a href="https://trust-layer-ikel-vt39.onrender.com" target="_blank" rel="noopener">Essayer l’outil <b>↗</b></a><a class="repo-link" href="https://github.com/Ikel0/trust-layer" target="_blank" rel="noopener">Code</a></div></div></article>
    <article class="showcase-card signal-card"><div class="showcase-art"><span class="sticker">FIND<br>IT</span><div class="signal-notes"><p>Quelle est la règle ?</p><b>Politique 2026</b><i></i><i></i><small>source vérifiable</small></div></div><div class="showcase-copy"><p class="project-label">POUR UNE ÉQUIPE QUI CHERCHE DANS SES DOCUMENTS</p><h3>Signal</h3><p class="plain">Tu poses une question. Signal retrouve le bon extrait et t’indique le document qui permet de le vérifier.</p><dl><div><dt>Il recherche</dt><dd>Une base de documents interne.</dd></div><div><dt>Tu repars avec</dt><dd>Une réponse accompagnée de sa source.</dd></div></dl><div class="showcase-actions"><a href="https://signal-ikel.onrender.com" target="_blank" rel="noopener">Essayer l’outil <b>↗</b></a><a class="repo-link" href="https://github.com/Ikel0/signal" target="_blank" rel="noopener">Code</a></div></div></article>
    <article class="showcase-card flow-card"><div class="showcase-art"><span class="sticker">KEEP<br>UP</span><div class="flow-tape"><b>event → check → alert</b><i></i><i></i><i></i><small>2 signals need attention</small></div></div><div class="showcase-copy"><p class="project-label">POUR UNE ÉQUIPE QUI SUIT DES ÉVÉNEMENTS EN TEMPS RÉEL</p><h3>Flow</h3><p class="plain">Tu envoies des événements. Flow applique des règles et sépare les signaux ordinaires de ceux qui méritent une alerte.</p><dl><div><dt>Il surveille</dt><dd>Latence, montants et champs manquants.</dd></div><div><dt>Tu repars avec</dt><dd>Des alertes compréhensibles et traçables.</dd></div></dl><div class="showcase-actions"><a href="https://flow-ikel-cgdd.onrender.com" target="_blank" rel="noopener">Essayer l’outil <b>↗</b></a><a class="repo-link" href="https://github.com/Ikel0/flow" target="_blank" rel="noopener">Code</a></div></div></article>
  </div>`;
