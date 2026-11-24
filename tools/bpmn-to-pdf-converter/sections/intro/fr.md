## Convertir un fichier BPMN 2.0 en PDF

1. Déposez un fichier `.bpmn` ou `.xml` dans le convertisseur ou cliquez sur **Ouvrir un fichier BPMN**. Pour voir le résultat avant d’utiliser votre fichier, choisissez **Essayer un exemple** afin de charger un processus de validation.
2. Vérifiez l’aperçu et choisissez **Dimensions d’origine du diagramme**, **A4** ou **Lettre US** dans **Format de page PDF**.
3. Cliquez sur **Télécharger le PDF**. Le PDF reprend le nom du fichier source et contient l’ensemble du processus, même si vous avez zoomé sur une partie de l’aperçu.

## Choisir un format PDF pour le partage ou l’impression

Les dimensions d’origine conviennent à un grand diagramme destiné à être consulté à l’écran. Choisissez A4 ou Lettre US pour l’ajuster à une feuille avec des marges. Le convertisseur choisit l’orientation portrait ou paysage selon la forme du diagramme. Pour un processus dense sur une seule feuille, vérifiez la lisibilité des petits libellés avant d’imprimer.

Le PDF enregistre les formes et les connexions sous forme vectorielle pour qu’elles restent nettes à l’agrandissement. Utilisez **Télécharger le SVG** pour intégrer le diagramme à une page web ou le modifier dans un éditeur vectoriel. Conservez le fichier BPMN pour modifier le processus dans votre outil de modélisation.

Les libellés sont enregistrés sous forme de contours vectoriels. Utilisez le fichier source pour copier ou modifier leur texte.

## Ouvrir un fichier XML BPMN avec la disposition du diagramme

Le convertisseur utilise les données BPMN Diagram Interchange pour placer les activités, les couloirs, les événements et les connexions. Si le XML décrit uniquement le processus, ouvrez-le dans votre outil de modélisation, puis exportez-le de nouveau avec la disposition du diagramme. Les fichiers XML d’un autre format, comme le format natif de draw.io, doivent d’abord être exportés en BPMN 2.0 avec la disposition.

Le fichier est lu et converti localement dans votre navigateur. Pour examiner le processus et parcourir le diagramme, utilisez la [Visionneuse BPMN](../bpmn-viewer/).
