## Qu’est-ce que le formateur de code Prettier ?

Le formateur de code Prettier exécute directement dans votre navigateur le pipeline
officiel standalone de Prettier afin de normaliser des fichiers source sans
envoyer le code à un serveur. C’est utile lorsque vous avez besoin d’un
formatage rapide, que vous voulez comparer différents réglages de largeur de
ligne, ou que vous souhaitez obtenir immédiatement un fichier propre à copier
ou télécharger.

## Formats Pris En Charge

Cette version rewrite garde l’outil centré sur les formats que Prettier gère déjà bien dans le navigateur : JavaScript, JSX, TypeScript, TSX, Flow, les variantes de JSON, HTML, XML, CSS, PostCSS, SCSS, Less, Markdown, MDX, YAML, GraphQL, ainsi que des formats de templates comme Angular, Vue, Svelte, LWC, MJML et Handlebars. Le sélecteur de langue contrôle le parseur utilisé, et l’import d’un fichier détecte automatiquement le parseur lorsque l’extension est reconnue.

## Comment Fonctionne Cette Refonte

La refonte garde la logique de formatage lourde hors du chemin principal de
l’interface. Les requêtes de formatage sont construites à partir d’une
configuration locale pure, puis exécutées via un pipeline Prettier paresseux
piloté par un worker afin que la saisie reste fluide. Les grandes entrées
suspendent le formatage automatique et basculent vers une action explicite
`Formater maintenant`, ce qui est plus prévisible que de reformater un gros
fichier à chaque frappe.
