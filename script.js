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
  <div class="lab-heading"><div><span class="section-index">03 / CE QUE JE CONSTRUIS</span><h2>Des projets pour<br /><em>apprendre en faisant.</em></h2></div><p>J’ai choisi trois situations que j’aimerais savoir traiter dans une vraie équipe data. Chaque projet est volontairement petit, déployé, testable — et il y a encore des choses à améliorer.</p></div>
  <div class="lab-note"><b>Comment lire cette section :</b> pars d’un problème, ouvre la démo, puis regarde le code si tu veux comprendre comment j’ai abordé le sujet.</div>
  <ol class="project-journal">
    <li class="journal-row"><div class="journal-no">01</div><div class="journal-main"><p class="journal-type">DATA QUALITY</p><h3>Un export CSV avant un dashboard</h3><p>Un fichier arrive dans une équipe. Est-ce qu’on peut lui faire confiance ? J’ai créé <strong>Trust Layer</strong> pour le contrôler avant qu’il soit réutilisé.</p><div class="journal-answer"><span>Concrètement</span><p>Il relève les identifiants manquants, les emails invalides, les montants incohérents et les dates mal formatées.</p></div></div><div class="journal-side"><span>Trust Layer</span><a href="https://trust-layer-ikel-vt39.onrender.com" target="_blank" rel="noopener">Ouvrir la démo ↗</a><a href="https://github.com/Ikel0/trust-layer" target="_blank" rel="noopener">Voir le code</a></div></li>
    <li class="journal-row"><div class="journal-no">02</div><div class="journal-main"><p class="journal-type">KNOWLEDGE SEARCH</p><h3>Retrouver une règle dans une pile de documents</h3><p>Quand la réponse existe quelque part, l’enjeu n’est pas de la deviner : il faut retrouver le bon passage. <strong>Signal</strong> cherche et garde la source visible.</p><div class="journal-answer"><span>Concrètement</span><p>Tu poses une question, l’outil affiche les extraits les plus pertinents et les documents d’où ils viennent.</p></div></div><div class="journal-side"><span>Signal</span><a href="https://signal-ikel.onrender.com" target="_blank" rel="noopener">Ouvrir la démo ↗</a><a href="https://github.com/Ikel0/signal" target="_blank" rel="noopener">Voir le code</a></div></li>
    <li class="journal-row"><div class="journal-no">03</div><div class="journal-main"><p class="journal-type">EVENT MONITORING</p><h3>Un événement banal, ou un signal à regarder ?</h3><p>Un système peut envoyer beaucoup d’événements sans qu’ils soient tous importants. <strong>Flow</strong> permet d’exercer des règles de surveillance simples et explicables.</p><div class="journal-answer"><span>Concrètement</span><p>Il reçoit un événement JSON et alerte si une latence, un montant ou un champ dépasse les seuils prévus.</p></div></div><div class="journal-side"><span>Flow</span><a href="https://flow-ikel-cgdd.onrender.com" target="_blank" rel="noopener">Ouvrir la démo ↗</a><a href="https://github.com/Ikel0/flow" target="_blank" rel="noopener">Voir le code</a></div></li>
  </ol>`;

if (lab) lab.querySelector('.project-journal').insertAdjacentHTML('beforeend', `<li class="journal-row"><div class="journal-no">04</div><div class="journal-main"><p class="journal-type">ANALYTICS ENGINEERING</p><h3>Passer de fichiers bruts aux bons indicateurs</h3><p><strong>Metric Lab</strong> est une mini data platform e-commerce : elle ingère plusieurs sources, construit un modèle de données et affiche les métriques qui permettent de suivre une activité.</p><div class="journal-answer"><span>Concrètement</span><p>Les commandes, produits et clients deviennent des tables reliées ; le dashboard affiche ensuite chiffre d’affaires, panier moyen et évolution quotidienne.</p></div></div><div class="journal-side"><span>Metric Lab</span><a href="https://github.com/Ikel0/metric-lab" target="_blank" rel="noopener">Voir le projet ↗</a><a href="https://github.com/Ikel0/metric-lab" target="_blank" rel="noopener">Voir le code</a></div></li>`);
if (lab) { const metricDemo = lab.querySelector('.project-journal .journal-row:last-child .journal-side a'); metricDemo.href = 'https://metric-lab-ikel.onrender.com'; metricDemo.textContent = 'Ouvrir la démo ↗'; }
