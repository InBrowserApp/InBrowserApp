## Convertir du HTML enregistré localement

Ouvrez un document local `.html`, `.htm` ou `.xhtml` bien formé, examinez les pages générées et téléchargez le PDF affiché dans l’aperçu. Le fichier PDF est généré directement, sans boîte de dialogue d’impression. Pour lire sans convertir, utilisez la [Visionneuse HTML](../html-viewer/).

## Apparence et compatibilité du PDF

Le document est remis en page sur des pages A4 en orientation portrait avec des marges de 18 mm, puis capturé sous forme de pages d’images à 150 DPI. Les titres, paragraphes, listes, tableaux, code, sauts de page explicites, styles de base et images matricielles intégrées pris en charge sont inclus. Les tableaux larges et le code sont adaptés à la largeur de la page. Le texte du PDF n’est pas sélectionnable, et aucune reconnaissance de texte (OCR) ni aucun lien interactif ne sont ajoutés. Les polices, l’espacement et la pagination peuvent différer de la page d’origine. Vérifiez chaque page avant de vous fier au résultat.

Les scripts, les formulaires, les applications intégrées, le SVG et le MathML sont omis. Les ressources distantes et les dossiers de ressources placés à côté du fichier ne sont pas chargés. Les images ou styles manquants, les images illisibles et le contenu non pris en charge pour l’impression interrompent la conversion sans proposer de téléchargement partiel. Utilisez un document autonome avec des images intégrées ; les mises en page complexes de sites web et les polices intégrées ne sont pas prises en charge. Les styles adaptatifs destinés à l’écran ne déterminent pas le rendu des pages imprimées, et les formats de papier du document source sont remplacés par le format A4 fixe.

## Confidentialité et ressources du navigateur

Votre document reste dans ce navigateur. Le moteur de rendu se charge uniquement après la sélection d’un fichier, et le contenu des fichiers n’est jamais envoyé. Les documents volumineux peuvent demander du temps et de la mémoire, car chaque page est rendue sous forme d’image. Vous pouvez annuler, fermer ou remplacer le document. Aucune limite fixe de taille de fichier ou de nombre de pages n’est imposée ; les défaillances réelles liées aux ressources du navigateur produisent une erreur lorsqu’elles peuvent être détectées.
