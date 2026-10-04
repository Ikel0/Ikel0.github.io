# Ikel Ouedraogo · Portfolio

Site : https://ikel0.github.io · English : https://ikel0.github.io/en/

Data Engineer orienté analytics, avec l’IA appliquée en complément. Le site présente :

- **Compétences** : data engineering, analytics (Data Analyst / Analytics Engineer) et IA appliquée, chacune reliée à ses preuves ;
- **Projets** : Retail Core, Metric Lab, Pacte, Routier, Evidence Desk, Sillage AI, plus des prototypes courts (Atelier) ;
- **Publications** : notes de terrain dans `notes/`.

## Structure

| Chemin | Contenu |
|---|---|
| `index.html`, `en/index.html` | Page d’accueil FR et EN |
| `portfolio.css`, `script.js` | Styles et menu mobile, communs à toutes les pages |
| `notes/` | Articles ; la liste est générée par `notes/posts.js` et `notes/feed.js` |
| `privacy.html` | Mesure d’audience (GoatCounter, sans cookie) |

Site statique, sans build : servi tel quel par GitHub Pages depuis `main`.

```bash
python3 -m http.server 8000
```
