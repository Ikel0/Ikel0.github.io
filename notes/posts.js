// Liste des publications, de la plus récente à la plus ancienne. Le champ project relie
// chaque note au dépôt qui la soutient.
window.publicationPosts = [
  {
    "id": "olist-backtest",
    "type": "analytics",
    "label": "Analytics",
    "href": "olist-backtest.html",
    "title": "J’ai testé trois règles de date de livraison sur les commandes Olist de 2018",
    "summary": "Calibrées sur 2017, mesurées sur 2018 : recalculer la date par trajet ou en glissant sur 14 jours ne fait pas mieux qu’Olist. Seuls 5 jours de plus sur 25 trajets à risque retirent 12 % des retards.",
    "project": {
      "name": "Comptoir",
      "href": "https://ikel0.github.io/comptoir/"
    }
  },
  {
    "id": "olist-pieges",
    "type": "analytics",
    "label": "Analytics",
    "href": "olist-pieges.html",
    "title": "Sept pièges du jeu de données Olist, et ce que j’en ai fait",
    "summary": "customer_id qui change à chaque commande, mois presque vides, avis en double, dates impossibles : ce qu’il faut corriger avant de calculer un taux de réachat ou une note moyenne.",
    "project": {
      "name": "Comptoir",
      "href": "https://ikel0.github.io/comptoir/"
    }
  },
  {
    "id": "couche-semantique",
    "type": "analytics",
    "label": "Analytics",
    "href": "couche-semantique.html",
    "title": "Couche sémantique : un format commun existe, la portabilité reste à prouver",
    "summary": "MetricFlow ouvert, OSI devenu Apache Ossie, un benchmark dbt de 2026 : où en est la couche sémantique, et pourquoi la définition des métriques compte encore plus quand un LLM interroge l’entrepôt.",
    "project": {
      "name": "Comptoir",
      "href": "https://github.com/Ikel0/comptoir/blob/main/METRICS.md"
    }
  },
  {
    "id": "text-to-sql",
    "type": "analytics",
    "label": "Analytics",
    "href": "text-to-sql.html",
    "title": "Text-to-SQL : les scores des benchmarks face aux entrepôts réels",
    "summary": "Spider 2.0, BIRD, BEAVER et un benchmark dbt de 2026 : les scores du text-to-SQL, l’écart avec les entrepôts réels, et ce qui aide un LLM à écrire un SQL juste."
  },
  {
    "id": "formats-tables",
    "type": "data",
    "label": "Data engineering",
    "href": "formats-tables.html",
    "title": "Formats de tables ouverts en 2026 : la décision se joue sur le catalogue",
    "summary": "Iceberg v3 et le catalogue REST, Snowflake ouvert aux écritures externes, Delta et Hudi tournés vers le catalogue, DuckLake 1.0 : ce qu’un Data Engineer venu de Snowflake doit vérifier en premier."
  },
  {
    "id": "data-contracts",
    "type": "data",
    "label": "Data engineering",
    "href": "data-contracts.html",
    "title": "Data contracts : ce qui bloque chez les producteurs, ce que les outils savent versionner",
    "summary": "Ce que disent les praticiens des data contracts (le blocage est côté producteurs), où en sont ODCS 3.2.0, les contrats dbt et datacontract-cli sur le versionnage, et ce que Pacte couvre ou non.",
    "project": {
      "name": "Pacte",
      "href": "https://github.com/Ikel0/pacte"
    }
  },
  {
    "id": "fraicheur-donnee",
    "type": "data",
    "label": "Data engineering",
    "href": "fraicheur-donnee.html",
    "title": "Mesurer la fraîcheur d’une donnée commence par choisir l’horodatage",
    "summary": "Trois mesures derrière le mot « fraîcheur », ce que fait la commande freshness de dbt en 2026, les fausses alertes du week-end, et pourquoi Pacte déclare 24 h sans les contrôler.",
    "project": {
      "name": "Pacte",
      "href": "https://github.com/Ikel0/pacte"
    }
  },
  {
    "id": "idempotence",
    "type": "systems",
    "label": "Systèmes",
    "href": "idempotence.html",
    "title": "Exactly once avec Kafka : où s’arrête la garantie des transactions",
    "summary": "Ce que les transactions Kafka garantissent vraiment, les malentendus fréquents, le 2PC de la KIP-939 accepté mais pas livré, et ce que cela confirme dans Routier.",
    "project": {
      "name": "Routier",
      "href": "https://github.com/Ikel0/routier"
    }
  },
  {
    "id": "rag-sources",
    "type": "ai",
    "label": "IA appliquée",
    "href": "rag-sources.html",
    "title": "Évaluer un RAG : mesurer la recherche à part et compter les refus",
    "summary": "Ce que mesurent les praticiens pour évaluer un RAG : recherche évaluée à part, fidélité au contexte, refus comptés séparément, et pourquoi le 4 sur 4 d’Evidence Desk est facile.",
    "project": {
      "name": "Evidence Desk",
      "href": "https://github.com/Ikel0/evidence-desk"
    }
  },
  {
    "id": "mcp-donnees",
    "type": "ai",
    "label": "IA appliquée",
    "href": "mcp-donnees.html",
    "title": "Brancher un modèle sur un entrepôt via MCP : les contrôles que j’exigerais",
    "summary": "Ce que la spécification MCP impose sur l’autorisation, comment l’injection passe par les résultats d’outils (cas Supabase), ce que recommande OWASP, et les contrôles à exiger avant de brancher un modèle sur un entrepôt."
  },
  {
    "id": "agents-outils",
    "type": "ai",
    "label": "IA appliquée",
    "href": "agents-outils.html",
    "title": "Agents IA d’astreinte : ce que mesure le premier banc d’essai",
    "summary": "Les agents d’astreinte de PagerDuty, Datadog et Monte Carlo préparent l’enquête, mais un banc d’essai de l’été 2026 montre qu’ils trouvent rarement toute la cause : la décision reste humaine.",
    "project": {
      "name": "Sillage",
      "href": "https://github.com/Ikel0/sillage-ai"
    }
  }
];
