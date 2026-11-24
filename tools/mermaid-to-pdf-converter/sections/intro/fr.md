## Convertir du code Mermaid en PDF

Collez le code Mermaid dans l’éditeur, déposez-y un fichier `.mmd` ou choisissez **Ouvrir un fichier**. Vous pouvez aussi coller un seul bloc de code `mermaid` provenant d’un document Markdown. Vérifiez l’aperçu, sélectionnez un format de page et cliquez sur **Télécharger le PDF**. Le diagramme et le PDF sont générés dans votre navigateur.

Choisissez **Charger un exemple** ou collez cet exemple de circuit de validation. Les étapes sont disposées de gauche à droite.

```mermaid
flowchart LR
  Draft --> Review
  Review --> Approved
```

## Choisir un format de page pour le partage ou l’impression

**Ajuster au diagramme** crée une page aux dimensions du diagramme entier. **A4** et **Lettre US** l’ajustent à une feuille standard avec des marges. Les diagrammes larges passent en orientation paysage. Si le texte d’un grand diagramme devient trop petit une fois ajusté à la feuille, choisissez **Ajuster au diagramme** pour permettre au lecteur de zoomer à l’écran.

## PDF vectoriel ou SVG

Le PDF préserve les formes vectorielles du diagramme. Les traits et les flèches restent nets à fort grossissement. Ce format convient aux rapports, aux documents à distribuer et aux pièces jointes. Téléchargez le **SVG** pour intégrer le diagramme à une page web ou l’ouvrir dans un éditeur vectoriel. Conservez le code Mermaid pour modifier le diagramme par la suite. Pour les modifications courantes et l’export en PNG, utilisez l’[Aperçu Mermaid](../mermaid-previewer/).

Les libellés sont enregistrés sous forme de contours vectoriels. Utilisez le fichier source pour copier ou modifier leur texte.

## Corriger un diagramme qui ne s’affiche pas

Commencez par une déclaration comme `flowchart LR` ou `sequenceDiagram`. Si le code vient d’un document Markdown, collez le bloc Mermaid seul. L’éditeur conserve le code même si le rendu échoue, afin que vous puissiez corriger la syntaxe. Retrouvez les autres types de diagrammes dans la [référence de syntaxe Mermaid](https://mermaid.js.org/intro/syntax-reference.html).
