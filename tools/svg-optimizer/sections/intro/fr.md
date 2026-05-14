## Ce que fait cet outil

Cet optimiseur SVG compresse un fichier SVG local ou un document SVG collé dans
votre navigateur. Il utilise des passes de nettoyage SVGO pour supprimer les
commentaires, les métadonnées, les attributs redondants, la précision inutile et
d'autres éléments de balisage qui ne modifient pas l'image visible.

## Pourquoi c'est utile

Les fichiers SVG exportés depuis des outils de conception contiennent souvent
des métadonnées d'éditeur, des chemins verbeux, des IDs inutilisés et des
commentaires. Les optimiser peut réduire la taille de téléchargement, améliorer
le chargement des pages et rendre le code SVG intégré plus facile à relire avant
son intégration dans un site web, une app, un e-mail ou une page de
documentation.

## Fonctionnement

Importez un fichier `.svg` ou collez du balisage SVG, choisissez le préréglage
sûr ou ajustez les passes SVGO individuelles, puis lancez l'optimisation. L'outil
affiche les aperçus original et optimisé, les octets économisés et le balisage
final afin que vous puissiez le copier ou télécharger un fichier `.optimized.svg`.
Le SVG n'a jamais besoin de quitter votre appareil.

## Notes pratiques

- Gardez le préréglage sûr quand le SVG dépend de CSS externe, d'IDs scriptés ou
  de références de symboles que vous ne pouvez pas inspecter facilement.
- Utilisez le préréglage agressif pour les icônes, logos et illustrations simples
  exportés où la suppression des dimensions et l'intégration des styles sont
  acceptables.
- Prévisualisez l'image optimisée avant de remplacer l'illustration source,
  surtout quand la source utilise des masques, des dégradés, des filtres ou des
  ressources liées.
