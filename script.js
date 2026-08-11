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

const observer = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) entry.target.classList.add('visible');
}), { threshold: .12 });
document.querySelectorAll('.reveal, .capability, .project, .timeline article').forEach(element => {
  element.classList.add('will-reveal');
  observer.observe(element);
});

const lab = document.querySelector('.work');
if (lab) {
  lab.innerHTML = `
    <section class="research-lab" aria-labelledby="research-title">
      <div class="lab-heading research-heading">
        <div><span class="section-index">03 / RECHERCHE APPLIQUÉE</span><h2 id="research-title">Les sujets où je prends le temps de <em>creuser.</em></h2></div>
        <p>Certains problèmes demandent plus qu’une démo. Ici, je documente les choix, les limites et la manière dont je compte vérifier que le produit est réellement utile.</p>
      </div>
      <article class="research-dossier">
        <div class="dossier-number">01<br><span>2026</span></div>
        <div class="dossier-main">
          <p class="journal-type">RAG AUDITABLE · KNOWLEDGE SYSTEMS</p>
          <h3>Evidence Desk</h3>
          <p class="dossier-lede">Je veux comprendre comment construire un assistant documentaire qui ne demande pas de faire confiance aveuglément à sa réponse.</p>
          <div class="dossier-grid">
            <div><small>POINT DE DÉPART</small><p>Les politiques et les procédures existent, mais sont difficiles à retrouver et à vérifier quand une décision doit être prise.</p></div>
            <div><small>CE QUI EST CONSTRUIT</small><p>Ingestion versionnée, découpage, recherche FTS5, reranking, extraits cités, score de confiance et tests de retrieval.</p></div>
            <div><small>CE QUE JE VEUX MESURER</small><p>La qualité du retrieval, la capacité à s’abstenir et l’utilité des citations pour une personne qui doit valider la réponse.</p></div>
          </div>
          <div class="dossier-actions"><a href="https://github.com/Ikel0/evidence-desk" target="_blank" rel="noopener">Voir le code <span>↗</span></a><a href="https://github.com/Ikel0/evidence-desk/blob/main/docs/working-paper.md" target="_blank" rel="noopener">Lire la fiche de travail <span>↗</span></a></div>
        </div>
        <aside class="dossier-aside"><span>État du projet</span><strong>Prototype<br>fonctionnel</strong><p>Local-first, sans clé requise. Le mode LLM est volontairement optionnel.</p><small>Python · SQLite FTS5 · HTTP API · tests</small></aside>
      </article>
      <article class="research-dossier research-dossier-pacte">
        <div class="dossier-number">02<br><span>2026</span></div>
        <div class="dossier-main">
          <p class="journal-type">DATA CONTRACTS · QUALITY · LINEAGE</p>
          <h3>Pacte</h3>
          <p class="dossier-lede">Je voulais sortir de l’idée qu’un pipeline est fiable parce qu’il a tourné. Pour moi, la vraie question est : est-ce que la donnée reçue respecte encore ce que les équipes ont décidé ensemble ?</p>
          <div class="dossier-grid">
            <div><small>POINT DE DÉPART</small><p>Une colonne change, un identifiant n’est plus unique ou un statut métier dérive. Le problème se voit souvent trop tard, une fois les tables aval déjà touchées.</p></div>
            <div><small>CE QUI EST CONSTRUIT</small><p>Contrat versionné, contrôles de schéma et de qualité, décision d’ingestion, visualisation de l’impact et journal d’audit SQLite.</p></div>
            <div><small>CE QUE JE VEUX MESURER</small><p>Le temps nécessaire pour comprendre une anomalie, justifier une mise en quarantaine et prévenir les bonnes personnes.</p></div>
          </div>
          <div class="dossier-actions"><a href="https://pacte-ikel.onrender.com" target="_blank" rel="noopener">Ouvrir la démo <span>↗</span></a><a href="https://github.com/Ikel0/pacte" target="_blank" rel="noopener">Voir le code <span>↗</span></a><a href="https://github.com/Ikel0/pacte/blob/main/docs/working-paper.md" target="_blank" rel="noopener">Lire la fiche de travail <span>↗</span></a></div>
        </div>
        <aside class="dossier-aside"><span>État du projet</span><strong>Prototype<br>fonctionnel</strong><p>Trois lots de démonstration permettent de tester un cas sain, une dérive qualité et une dérive de schéma.</p><small>Python · contracts JSON · SQLite · HTTP API</small></aside>
      </article>
      <article class="research-dossier research-dossier-routier">
        <div class="dossier-number">03<br><span>2026</span></div>
        <div class="dossier-main">
          <p class="journal-type">STREAMING · DATA CONTRACTS · OPERATIONS</p>
          <h3>Routier</h3>
          <p class="dossier-lede">Je voulais construire un flux pour une équipe qui ne peut pas attendre le prochain dashboard : il faut savoir quel signal mérite une action, et pouvoir dire pourquoi.</p>
          <div class="dossier-grid">
            <div><small>POINT DE DÉPART</small><p>Des positions et états véhicule arrivent en continu. Sans contrat ni règle de priorité, les incidents importants se perdent dans le bruit.</p></div>
            <div><small>CE QUI EST CONSTRUIT</small><p>Topic Kafka-compatible, contrôle de contrat, worker idempotent, topic de rejet, règles d’alerte explicables et tableau d’exploitation.</p></div>
            <div><small>CE QUE JE VEUX MESURER</small><p>Le délai événement-vers-tableau, le taux de rejet par source et la pertinence des seuils pour une personne en charge du service.</p></div>
          </div>
          <div class="dossier-actions"><a href="https://routier-ikel.onrender.com" target="_blank" rel="noopener">Ouvrir la démo <span>↗</span></a><a href="https://github.com/Ikel0/routier" target="_blank" rel="noopener">Voir le code <span>↗</span></a><a href="https://github.com/Ikel0/routier/blob/main/docs/working-paper.md" target="_blank" rel="noopener">Lire la fiche de travail <span>↗</span></a></div>
        </div>
        <aside class="dossier-aside"><span>État du projet</span><strong>Pile locale<br>fonctionnelle</strong><p>Les données de démonstration sont synthétiques. Le parcours complet Kafka/Redpanda est lançable avec Docker.</p><small>Python · Kafka / Redpanda · Docker · SQLite</small></aside>
      </article>
    </section>

    <section class="playground" aria-labelledby="playground-title">
      <div class="lab-heading playground-heading">
        <div><span class="section-index">04 / L’ATELIER</span><h2 id="playground-title">Des projets courts, <em>pour apprendre en faisant.</em></h2></div>
        <p>Ce sont des outils plus petits que j’aimerais savoir traiter dans une vraie équipe data. Ils sont déployés, testables rapidement, et chacun me permet de travailler un problème précis.</p>
      </div>
      <ol class="project-journal">
        <li class="journal-row"><div class="journal-no">01</div><div class="journal-main"><p class="journal-type">DATA QUALITY</p><h3>Un export CSV avant un dashboard</h3><p>Avant de réutiliser un fichier, je veux pouvoir voir ce qui ne va pas. <strong>Trust Layer</strong> contrôle un export simple et rend les anomalies lisibles.</p><div class="journal-answer"><span>À tester</span><p>Identifiants manquants, emails invalides, montants incohérents et dates mal formatées.</p></div></div><div class="journal-side"><span>Trust Layer</span><a href="https://trust-layer-ikel-vt39.onrender.com" target="_blank" rel="noopener">Ouvrir la démo ↗</a><a href="https://github.com/Ikel0/trust-layer" target="_blank" rel="noopener">Voir le code</a></div></li>
        <li class="journal-row"><div class="journal-no">02</div><div class="journal-main"><p class="journal-type">KNOWLEDGE SEARCH</p><h3>Retrouver une règle dans une pile de documents</h3><p>Quand la réponse existe déjà quelque part, il faut surtout retrouver le bon passage. <strong>Signal</strong> aide à chercher et garde la source visible.</p><div class="journal-answer"><span>À tester</span><p>Une question, les extraits les plus proches, puis les documents d’où ils viennent.</p></div></div><div class="journal-side"><span>Signal</span><a href="https://signal-ikel.onrender.com" target="_blank" rel="noopener">Ouvrir la démo ↗</a><a href="https://github.com/Ikel0/signal" target="_blank" rel="noopener">Voir le code</a></div></li>
        <li class="journal-row"><div class="journal-no">03</div><div class="journal-main"><p class="journal-type">EVENT MONITORING</p><h3>Un événement banal, ou un signal à regarder ?</h3><p><strong>Flow</strong> est un petit terrain de jeu pour poser des règles de surveillance explicables sur des événements JSON.</p><div class="journal-answer"><span>À tester</span><p>Une latence, un montant ou un champ dépasse le seuil prévu, et le système explique pourquoi il alerte.</p></div></div><div class="journal-side"><span>Flow</span><a href="https://flow-ikel-cgdd.onrender.com" target="_blank" rel="noopener">Ouvrir la démo ↗</a><a href="https://github.com/Ikel0/flow" target="_blank" rel="noopener">Voir le code</a></div></li>
        <li class="journal-row"><div class="journal-no">04</div><div class="journal-main"><p class="journal-type">ANALYTICS ENGINEERING</p><h3>Passer de fichiers bruts aux bons indicateurs</h3><p><strong>Metric Lab</strong> est une mini data platform e-commerce : elle ingère plusieurs sources, construit un modèle de données et affiche les métriques utiles pour suivre une activité.</p><div class="journal-answer"><span>À tester</span><p>Les commandes, produits et clients deviennent des tables reliées ; le dashboard affiche chiffre d’affaires, panier moyen et évolution quotidienne.</p></div></div><div class="journal-side"><span>Metric Lab</span><a href="https://metric-lab-ikel.onrender.com" target="_blank" rel="noopener">Ouvrir la démo ↗</a><a href="https://github.com/Ikel0/metric-lab" target="_blank" rel="noopener">Voir le code</a></div></li>
        <li class="journal-row"><div class="journal-no">05</div><div class="journal-main"><p class="journal-type">KAFKA · STREAMING</p><h3>Une lecture de température, puis une décision</h3><p><strong>Glacis</strong> est un exercice court de chaîne du froid : un relevé passe par un topic Kafka, le contrat le vérifie et le tableau montre immédiatement s’il faut le regarder.</p><div class="journal-answer"><span>À tester</span><p>Chargez les cinq relevés synthétiques, puis repérez les deux écarts de consigne et la lecture critique.</p></div></div><div class="journal-side"><span>Glacis</span><a href="https://glacis-ikel.onrender.com" target="_blank" rel="noopener">Ouvrir la démo ↗</a><a href="https://github.com/Ikel0/glacis" target="_blank" rel="noopener">Voir le code</a></div></li>
      </ol>
    </section>`;
  lab.querySelectorAll('.research-dossier, .journal-row').forEach(element => {
    element.classList.add('will-reveal');
    observer.observe(element);
  });
}
