## Qu'est-ce qu'un générateur de robots.txt ?

Un générateur de robots.txt vous aide à créer le fichier texte simple qui indique aux robots quelles parties de votre site ils peuvent explorer. Il regroupe des groupes de user-agent, des règles allow/disallow, des liens de sitemap et des directives facultatives dans un fichier robots.txt prêt à être publié à la racine du site.

## Que pouvez-vous configurer ?

Vous pouvez créer des groupes de règles distincts pour différents robots, appliquer des préréglages courants, ajouter une ou plusieurs URL de sitemap et définir éventuellement Host ou Crawl-delay si les robots ciblés les prennent en charge. C'est utile si vous voulez des règles larges pour tous les bots et des restrictions plus strictes pour des chemins comme /admin/ ou d'autres zones peu utiles.

## Comment publier le fichier ?

Vérifiez la sortie générée, enregistrez-la sous le nom robots.txt, puis téléversez-la à la racine de votre domaine, par exemple https://example.com/robots.txt. Après la publication, testez le fichier avec votre Search Console ou vos outils de crawl et confirmez que les chemins et les URL de sitemap correspondent bien à la structure réelle du site.

## Quelles sont les limites ?

robots.txt est une instruction d'exploration, pas un système de contrôle d'accès. Il peut guider les robots bien élevés, mais il ne protège pas le contenu privé et n'empêche pas les requêtes directes. Les pages sensibles doivent donc toujours être protégées par une authentification ou des autorisations côté serveur.
