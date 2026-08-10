# Signal

Un prototype de recherche documentaire locale qui retourne les passages utiles avec leurs sources.

## Ce qui fonctionne

- indexation des fichiers Markdown de `knowledge/` ;
- classement lexical sans API ni clé secrète ;
- affichage de l’extrait et du fichier source.

```bash
cd projects/signal
python3 src/search.py "critères éligibilité"
```

Suite : ingestion PDF, embeddings, API, interface de chat et jeu d’évaluation.
