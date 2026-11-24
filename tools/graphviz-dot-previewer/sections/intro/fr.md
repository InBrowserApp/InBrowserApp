## Prévisualiser un graphe Graphviz DOT en ligne

Collez le code DOT d’un fichier, d’un script ou d’une documentation dans **Code DOT**. Le graphe se met à jour au fil de la saisie. Utilisez `digraph` et `->` pour des arêtes orientées, ou `graph` et `--` pour des arêtes non orientées. Les exemples intégrés montrent comment décrire des dépendances, des réseaux et des groupes de nœuds.

## Choisir un moteur de disposition Graphviz

Commencez par `dot` pour les graphes en couches comme les dépendances de compilation. Essayez `neato` ou `fdp` pour répartir les nœuds d’un réseau non orienté, `sfdp` pour un grand réseau, `circo` pour une disposition circulaire ou `twopi` pour un arbre radial. Graphviz propose aussi `osage` pour les graphes avec des groupes de nœuds et `patchwork` pour les cartes proportionnelles. Le code DOT reste dans l’éditeur lorsque vous changez de moteur.

## Comprendre les remarques de disposition et les erreurs de syntaxe

Graphviz peut signaler une erreur lorsqu’un opérateur d’arête ne correspond pas au type de graphe ou quand il manque une accolade ou un guillemet. Vérifiez la ligne indiquée et la précédente. L’aperçu peut aussi s’afficher avec des remarques sur les attributs que Graphviz n’a pas pu appliquer. Si le graphe définit son propre attribut `layout`, Graphviz utilise le moteur qui y est indiqué. Retrouvez les détails dans la [référence du langage DOT](https://graphviz.org/doc/info/lang.html) et le [guide des dispositions Graphviz](https://graphviz.org/docs/layouts/).

## Exporter un graphe Graphviz DOT en SVG ou en PDF

Choisissez **Télécharger le PDF** pour enregistrer le graphe entier sur une page à ses dimensions. Les formes et les lignes restent nettes au zoom et à l’impression. Utilisez **Télécharger le SVG** pour intégrer le graphe à une page web ou l’ouvrir dans un éditeur vectoriel. **Ajuster à la vue** et **Taille réelle** agissent uniquement sur l’aperçu. Conservez le code DOT pour modifier le graphe plus tard.
