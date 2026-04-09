## Qu'est-ce que SQL Formatter & Linter ?

SQL Formatter & Linter reformate les requêtes SQL dans votre navigateur et les vérifie en même temps pour un petit ensemble de problèmes à forte valeur signal. Il est utile quand vous voulez une présentation plus propre des requêtes, une casse cohérente pour les mots-clés et un retour rapide sur des patterns risqués comme `SELECT *` ou des instructions `UPDATE` sans clause `WHERE`.

## Quand l'utiliser

Utilisez cet outil lorsque vous relisez du SQL écrit à la main, nettoyez des requêtes collées avant de les partager, ou comparez le formatage entre différents dialectes SQL. Il convient bien à la relecture ponctuelle de requêtes, au nettoyage de pull requests et au formatage uniquement dans le navigateur, sans envoyer votre SQL vers un serveur.

## Ce qu'il vérifie

Cette version garde le formateur et le linter séparés mais coordonnés. Le formatage utilise `sql-formatter` avec des options de mise en page adaptées au dialecte, tandis que le lint signale les erreurs d’analyse, les points-virgules manquants, l’usage large de `SELECT *`, les mutations dangereuses, les lignes trop longues et les divergences de casse des mots-clés.
