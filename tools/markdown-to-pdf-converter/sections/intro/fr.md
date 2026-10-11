## Convertir un document Markdown localement

Ouvrez un document local `.md`, `.markdown`, `.mdown` ou `.txt`, examinez les pages générées et téléchargez le PDF affiché dans l’aperçu. Un fichier PDF est généré directement, sans passer par une boîte de dialogue d’impression. Les sources en UTF-8 et en UTF-16 avec marqueur d’ordre des octets (BOM) sont prises en charge. Pour lire ou modifier la source, utilisez l’[Aperçu Markdown](../markdown-previewer/).

## Résultat d’impression et sources prises en charge

Le Markdown standard ainsi que les tableaux, les listes de tâches, les textes barrés et les blocs de code clôturés de style GitHub sont pris en charge. Le document est mis en page avec un thème d’impression fixe sur des pages A4 en orientation portrait avec des marges de 18 mm, puis capturé sous forme de pages d’images à 150 DPI. Les états des tâches restent visibles et les détails repliés sont développés. Les tableaux larges et le code sont remis en page pour s’adapter à la largeur des pages. Le texte du PDF n’est pas sélectionnable ; aucune reconnaissance de texte (OCR) ni aucun lien interactif ne sont ajoutés. Les polices, l’espacement et la pagination peuvent différer de ceux d’autres outils Markdown. Vérifiez chaque page avant de vous fier au résultat.

Les images manquantes et les images intégrées illisibles arrêtent la conversion sans proposer de téléchargement partiel. Utilisez des images matricielles intégrées dans un document autonome. Le HTML en ligne est nettoyé ; les scripts, les styles, les formulaires, les applications intégrées, le SVG et le MathML sont omis. La coloration syntaxique, les formules mathématiques, les diagrammes, les notes de bas de page et les autres extensions de dialecte ne sont pas rendus ; les notations non prises en charge peuvent rester sous forme de texte.

## Confidentialité et ressources du navigateur

Votre document reste dans ce navigateur. Les images et autres ressources ne sont jamais récupérées sur votre ordinateur ni sur le réseau, et le contenu des fichiers n’est jamais envoyé. Les données matricielles intégrées sont lues dans le document sélectionné. Les fichiers volumineux peuvent prendre du temps et consommer de la mémoire, car chaque page est rendue sous forme d’image. Vous pouvez annuler, fermer ou remplacer le document. Il n’y a pas de quota fixe de taille de fichier ou de nombre de pages ; les véritables insuffisances de ressources du navigateur produisent une erreur lorsqu’elles peuvent être détectées.
