## Pourquoi cet outil est utile

La plupart des sites n’ont pas besoin d’un grand système de sitemaps. Les moteurs de recherche ont besoin d’un document XML valide avec des URL stables, des indications de mise à jour raisonnables et aucune erreur de formatage accidentelle. Cet outil se concentre sur ce travail central.

## Ce qu’il couvre

- Créer un sitemap `urlset` standard pour les pages d’un site.
- Créer un document `sitemapindex` lorsque vous avez déjà séparé un grand site en plusieurs fichiers sitemap.
- Utiliser des URL absolues ou des chemins relatifs propres joints à une URL de base.

## Points à surveiller

- Les emplacements du sitemap doivent pointer vers les URL canoniques finales, pas vers des redirections temporaires.
- `lastmod`, `changefreq` et `priority` sont des indications, pas des garanties de comportement d’exploration.
- Si chaque ligne est déjà une URL complète, désactivez la jointure automatique avec l’URL de base pour garder un XML explicite.
