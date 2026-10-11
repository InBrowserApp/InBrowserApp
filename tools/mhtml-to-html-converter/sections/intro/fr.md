## Convertir une archive web enregistrée localement

Ouvrez une archive locale `.mhtml` ou `.mht`, examinez la page principale convertie et téléchargez un fichier HTML UTF-8 autonome. Les ressources intégrées sont conservées dans le fichier pour permettre son ouverture hors ligne. Pour lire des archives récupérées ou incomplètes, utilisez la [Visionneuse MHTML](../mhtml-viewer/).

## Résultat et compatibilité

Les références content-location et content-ID prises en charge sont résolues à l’intérieur de l’archive. Le texte, la mise en forme de base, les tableaux, les liens, les images matricielles intégrées et les styles pris en charge sont conservés dans un document statique lisible. Le texte reste sélectionnable. Les signets internes restent dans le document et les liens externes ne s’ouvrent que lorsque vous les sélectionnez. Le zoom de l’aperçu ne modifie pas le fichier téléchargé. Les polices et les mises en page complexes peuvent différer de la page enregistrée d’origine.

Les scripts, les formulaires, les redirections, les applications intégrées, le SVG et le MathML sont omis. Les sessions du site web et les fonctions interactives ne sont pas restaurées. Les archives incomplètes, les encodages de texte non pris en charge, les pages supplémentaires et les ressources manquantes interrompent la conversion sans proposer de téléchargement partiel. Les images intégrées, y compris les images d’arrière-plan CSS, doivent pouvoir être décodées. Si la conversion échoue, enregistrez une capture complète du document principal seul. Les e-mails et les fichiers HTML simples nécessitent les outils correspondants.

## Confidentialité et ressources du navigateur

Les fichiers restent dans ce navigateur. Les ressources manquantes ne sont jamais récupérées sur votre ordinateur ni sur le site web en ligne, et le contenu des fichiers n’est jamais envoyé. Le HTML généré bloque les scripts et le chargement de ressources externes lors de son ouverture hors ligne. Suivre un lien externe est une action distincte qui peut contacter le site concerné. Vous pouvez annuler, fermer ou remplacer l’archive. Aucune limite fixe de taille de fichier ou de nombre de pages n’est imposée ; les archives volumineuses dépendent de la mémoire disponible du navigateur, et les défaillances liées aux ressources sont signalées lorsqu’elles peuvent être détectées.
