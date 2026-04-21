## Qu'est-ce qu'un générateur de robots.txt ?

Un générateur de robots.txt aide à combiner des règles user-agent, des chemins allow/disallow et des liens de sitemap pour créer le fichier robots.txt. Publiez-le à la racine du site sous /robots.txt pour que les robots le lisent.

### Ce que ce générateur vous aide à faire

- Créer des règles distinctes pour les moteurs de recherche, les robots d’IA ou des bots personnalisés
- Ajouter `Allow`, `Disallow`, le sitemap et des directives avancées facultatives au même endroit
- Copier ou télécharger un fichier `robots.txt` prêt à publier

### Exemple

```text
User-agent: *
Disallow: /admin/
Allow: /admin/help/
Sitemap: https://example.com/sitemap.xml
```

Cet exemple demande aux robots d’éviter la majeure partie de `/admin/`, laisse `/admin/help/` explorable et leur indique où se trouve le sitemap.

### Points importants

- Publiez le fichier à l’emplacement `/robots.txt` à la racine du site
- `robots.txt` est public et indicatif, pas un mécanisme de contrôle d’accès
- Tous les robots ne prennent pas en charge `Host` et `Crawl-delay`
