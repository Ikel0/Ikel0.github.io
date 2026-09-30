// Ajouter une publication ici, puis créer sa page HTML si elle doit être longue.
// Pour un média, ajouter par exemple :
// media: { type: "image", src: "media/mon-image.jpg", alt: "Description de l’image" }
// Les types pris en charge sont image, video et embed.
window.publicationPosts = [
  {
    id: "sources-rag",
    type: "ai",
    label: "AI engineering",
    date: "2026-09-18",
    readingTime: "5 min",
    title: "Une réponse IA sans source peut sembler juste et rester inutilisable.",
    summary: "Dans un assistant documentaire, je cherche moins une réponse brillante qu’un chemin vérifiable vers le passage qui la soutient.",
    tags: ["RAG", "Citations", "Confiance"],
    href: "rag-sources.html"
  },
  {
    id: "data-contracts",
    type: "data",
    label: "Data",
    date: "2026-09-11",
    readingTime: "4 min",
    title: "Un data contract protège surtout les décisions prises après le pipeline.",
    summary: "Un schéma décrit une structure. Un contrat rend aussi visibles les règles, les hypothèses et les changements qui peuvent fausser une décision, humaine ou assistée par IA.",
    tags: ["Data quality", "Contrats", "Gouvernance"],
    href: "data-contracts.html"
  },
  {
    id: "llm-evaluation",
    type: "ai",
    label: "AI engineering",
    date: "2026-09-04",
    readingTime: "6 min",
    title: "Avant d’évaluer un LLM, il faut décider ce qu’une bonne réponse signifie.",
    summary: "Une réponse peut être fluide, rapide et peu utile. L’évaluation commence par des critères explicites : source, pertinence, refus, coût et délai.",
    tags: ["LLM evals", "RAG", "Qualité"],
    href: "evaluer-llm.html"
  },
  {
    id: "idempotence-events",
    type: "systems",
    label: "Systèmes",
    date: "2026-08-28",
    readingTime: "3 min",
    title: "Dans un flux d’événements, les doublons ne sont pas une exception.",
    summary: "Les rejouements arrivent. Le sujet n’est pas de les empêcher à tout prix, mais de rendre leur effet prévisible et vérifiable.",
    tags: ["Événements", "Idempotence", "Fiabilité"],
    href: "idempotence.html"
  },
  {
    id: "mcp-authorization",
    type: "ai",
    label: "AI engineering",
    date: "2026-08-21",
    readingTime: "5 min",
    title: "MCP : connecter un modèle à un outil ne suffit pas à le rendre utile.",
    summary: "Le protocole facilite l’accès aux outils. Il ne remplace ni l’autorisation, ni la validation, ni la trace de ce qui a réellement été demandé.",
    tags: ["MCP", "Autorisation", "Sécurité"],
    href: "mcp-autorisation.html"
  },
  {
    id: "data-freshness",
    type: "data",
    label: "Data",
    date: "2026-08-14",
    readingTime: "4 min",
    title: "La fraîcheur d’une donnée est une promesse, pas un simple timestamp.",
    summary: "Dire qu’une table est fraîche ne veut rien dire sans préciser pour quel usage, avec quel délai acceptable et quelle action prendre lorsqu’il est dépassé.",
    tags: ["Freshness", "SLA", "Qualité"],
    href: "fraicheur-donnee.html"
  },
  {
    id: "audit-trail",
    type: "data",
    label: "Data",
    date: "2026-08-07",
    readingTime: "4 min",
    title: "Un journal d’audit utile doit permettre de reconstruire une décision.",
    summary: "Un log technique dit qu’un traitement a eu lieu. Un journal d’audit explique quelles données, quelles règles et quelle version ont mené à un résultat.",
    tags: ["Lineage", "Audit", "Traçabilité"],
    href: "journal-audit.html"
  },
  {
    id: "api-problem-details",
    type: "systems",
    label: "Systèmes",
    date: "2026-07-31",
    readingTime: "3 min",
    title: "Une API fiable doit expliquer pourquoi elle refuse.",
    summary: "Un code 4xx ou 5xx est rarement suffisant pour corriger le problème. Une erreur exploitable doit indiquer la cause, le contexte et la suite possible.",
    tags: ["API", "Erreurs", "Contrat"],
    href: "api-erreurs.html"
  },
  {
    id: "agents-tools",
    type: "ai",
    label: "AI engineering",
    date: "2026-07-24",
    readingTime: "5 min",
    title: "Un agent n’est pas autonome parce qu’il peut appeler des outils.",
    summary: "La capacité d’agir n’est utile que si les limites sont claires : outils disponibles, permissions, validation et moment où une personne doit reprendre la main.",
    tags: ["Agents", "Tool use", "Garde-fous"],
    href: "agents-outils.html"
  },
  {
    id: "observability",
    type: "systems",
    label: "Systèmes",
    date: "2026-07-17",
    readingTime: "5 min",
    title: "Surveiller un système IA, ce n’est pas seulement mesurer sa latence.",
    summary: "Le temps de réponse compte, mais il ne dit ni si la recherche était bonne, ni quel outil a été appelé, ni si le résultat a aidé la personne qui l’utilise.",
    tags: ["Observabilité", "Traces", "Évaluation"],
    href: "observabilite.html"
  }
];
