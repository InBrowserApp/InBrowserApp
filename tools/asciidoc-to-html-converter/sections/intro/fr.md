## Convertir un document AsciiDoc localement

Ouvrez un fichier local `.adoc` ou `.asciidoc`, examinez le document affiché et téléchargez un fichier HTML UTF-8 autonome. Le fichier s’ouvre hors ligne et conserve un texte sélectionnable. Pour examiner les avertissements de la source ou les inclusions indisponibles avant la conversion, utilisez la [Visionneuse AsciiDoc](../asciidoc-viewer/).

## Résultat et compatibilité

Les titres, les listes, les tableaux, les blocs de code, les notes, les citations, les notes de bas de page, les liens et les images matricielles intégrées prises en charge sont conservés avec un thème de lecture fixe. Les signets internes et les notes de bas de page restent dans le document ; les liens externes ne s’ouvrent que lorsque vous les sélectionnez. Les blocs de code et les tableaux larges défilent horizontalement. Le zoom de l’aperçu ne modifie pas le fichier téléchargé. Les polices et l’espacement peuvent différer de ceux d’autres outils AsciiDoc.

Utilisez une source autonome en UTF-8 ou en UTF-16 avec marqueur d’ordre des octets (BOM). Les fichiers inclus et les ressources externes d’images ou de styles ne sont pas chargés. Les inclusions indisponibles, les avertissements d’analyse, les attributs non résolus et les ressources manquantes ou illisibles interrompent l’export sans proposer de téléchargement partiel. Les images intégrées, y compris les images d’arrière-plan CSS, doivent pouvoir être décodées. Les macros personnalisées, les diagrammes, les extensions et les polices intégrées ne sont pas pris en charge. Les scripts, les formulaires, les applications intégrées, le SVG et le MathML sont omis. La syntaxe source non prise en charge peut rester sous forme de texte ordinaire.

## Confidentialité et ressources du navigateur

Les fichiers restent dans ce navigateur. Les ressources manquantes ne sont jamais récupérées sur votre ordinateur ou sur un site web, et le contenu des fichiers n’est jamais envoyé. Le HTML généré bloque les scripts et le chargement automatique des ressources externes. Suivre un lien externe est une action distincte qui peut contacter le site concerné. Vous pouvez annuler la conversion, fermer le document source ou le remplacer. Il n’existe aucune limite fixe de taille de fichier ou de nombre de pages ; les documents volumineux dépendent de la mémoire disponible dans le navigateur, et les défaillances des ressources sont signalées lorsqu’elles peuvent être détectées.
