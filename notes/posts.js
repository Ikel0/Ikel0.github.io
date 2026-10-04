// Liste des publications, de la plus récente à la plus ancienne. Le champ project relie
// chaque note au dépôt qui la soutient.
window.publicationPosts = [
  {
    "id": "olist-backtest",
    "type": "analytics",
    "label": "Analytics",
    "readingTime": "3 min",
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
    "readingTime": "3 min",
    "href": "olist-pieges.html",
    "title": "Sept pièges du jeu de données Olist, et ce que j’en ai fait",
    "summary": "customer_id qui change à chaque commande, mois presque vides, avis en double, dates impossibles : ce qu’il faut corriger avant de calculer un taux de réachat ou une note moyenne.",
    "project": {
      "name": "Comptoir",
      "href": "https://ikel0.github.io/comptoir/"
    }
  },
  {
    "id": "data-contracts",
    "type": "data",
    "label": "Data engineering",
    "readingTime": "3 min",
    "href": "data-contracts.html",
    "title": "Pourquoi une colonne en trop met une publication Pacte en attente",
    "summary": "Un lot avec une colonne en trop, currency, aux valeurs toutes valides : Pacte ne le publie pas et attend la revue du propriétaire du contrat. Le contrat, les règles et la décision.",
    "project": {
      "name": "Pacte",
      "href": "https://github.com/Ikel0/pacte"
    }
  },
  {
    "id": "audit-trail",
    "type": "data",
    "label": "Data engineering",
    "readingTime": "3 min",
    "href": "journal-audit.html",
    "title": "Le reçu d’audit de Pacte, champ par champ",
    "summary": "Valider deux fois le même fichier sous le même contrat ne crée qu’une ligne d’audit : l’identifiant du reçu vient des empreintes du lot et du contrat. Ce que ça garantit, et sa limite.",
    "project": {
      "name": "Pacte",
      "href": "https://github.com/Ikel0/pacte"
    }
  },
  {
    "id": "data-freshness",
    "type": "data",
    "label": "Data engineering",
    "readingTime": "3 min",
    "href": "fraicheur-donnee.html",
    "title": "Pourquoi Pacte déclare une fraîcheur de 24 heures sans la contrôler",
    "summary": "Le contrat promet 24 heures, mais les fichiers de démonstration ne portent pas d’horodatage de livraison. J’ai laissé l’écart visible plutôt que de le combler avec une mesure fausse.",
    "project": {
      "name": "Pacte",
      "href": "https://github.com/Ikel0/pacte"
    }
  },
  {
    "id": "idempotence-events",
    "type": "systems",
    "label": "Systèmes",
    "readingTime": "3 min",
    "href": "idempotence.html",
    "title": "Comment Routier traite la relecture d’un même événement Kafka",
    "summary": "Commit de l’offset après l’effet, clé primaire sur event_id, réponse duplicate et journal d’ingestion : ce qui se passe quand Kafka redonne un message déjà traité.",
    "project": {
      "name": "Routier",
      "href": "https://github.com/Ikel0/routier"
    }
  },
  {
    "id": "api-errors",
    "type": "systems",
    "label": "Systèmes",
    "readingTime": "3 min",
    "href": "api-erreurs.html",
    "title": "Courier API, refus par refus : ordre des contrôles et écart avec la RFC 9457",
    "summary": "401, 403, 409, 422, 429 : chaque refus de Courier API, dans quel ordre il est vérifié, et pourquoi un refus libère la clé d’idempotence.",
    "project": {
      "name": "Courier API",
      "href": "https://github.com/Ikel0/courier-api"
    }
  },
  {
    "id": "sources-rag",
    "type": "ai",
    "label": "IA appliquée",
    "readingTime": "3 min",
    "href": "rag-sources.html",
    "title": "Evidence Desk : citer le passage exact et sa version dans une réponse documentaire",
    "summary": "Recherche SQLite FTS5, sélection de passages actifs, citation au format source@version#passage et abstention quand les preuves manquent. Sans LLM par défaut.",
    "project": {
      "name": "Evidence Desk",
      "href": "https://github.com/Ikel0/evidence-desk"
    }
  },
  {
    "id": "llm-evaluation",
    "type": "ai",
    "label": "IA appliquée",
    "readingTime": "3 min",
    "href": "evaluer-llm.html",
    "title": "Pourquoi le 4 sur 4 d’Evidence Desk est facile à obtenir",
    "summary": "Quatre cas, dont un refus attendu, et cinq contrôles séparés : retrieval, ancrage, citation, traçabilité et abstention. Ce que chaque contrôle attrape.",
    "project": {
      "name": "Evidence Desk",
      "href": "https://github.com/Ikel0/evidence-desk"
    }
  },
  {
    "id": "agents-tools",
    "type": "ai",
    "label": "IA appliquée",
    "readingTime": "3 min",
    "href": "agents-outils.html",
    "title": "Sillage : un triage d’incident data qui propose un runbook et attend une décision humaine",
    "summary": "Un score de routage déterministe, un runbook versionné, une décision humaine obligatoire et un journal d’audit chaîné. Aucune action sur les données n’est automatisée.",
    "project": {
      "name": "Sillage",
      "href": "https://github.com/Ikel0/sillage-ai"
    }
  }
];
