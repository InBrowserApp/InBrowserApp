## Convertir des documents texte OpenDocument en local

Ouvrez un document OpenDocument `.odt` ou un modèle `.ott`, convertissez-le en PDF, examinez les pages obtenues et téléchargez le même PDF que celui affiché dans l’aperçu. Pour lire sans conversion, utilisez la [Visionneuse ODT](../odt-viewer/).

## Apparence du PDF et compatibilité

Le moteur de conversion restitue les styles de page, les formats de papier, l’orientation, les en-têtes, les pieds de page, les colonnes, les tableaux et les images intégrées. Les pages conservent l’ordre issu du rendu, y compris les pages vierges insérées par les styles de page. Le texte pris en charge reste sélectionnable ; aucun OCR n’est ajouté au texte numérisé. Les polices manquantes sont remplacées par des polices fournies avec l’outil, ce qui peut modifier les sauts de ligne, les espacements et la pagination. Les mises en page complexes peuvent différer de l’application d’origine. Vérifiez chaque page avant de vous fier au PDF.

Le PDF est un export statique. Les contrôles de formulaire reprennent leur apparence à l’impression. Les commentaires, les macros et les signatures numériques ne sont ni conservés ni vérifiés. Les objets intégrés, les médias et les ressources externes du document ne sont pas pris en charge. Les documents protégés, les archives endommagées ou la détection de contenu manquant provoquent une erreur, sans proposer de fichier incomplet au téléchargement. Renommer une extension ne change pas le format sous-jacent.

## Confidentialité et ressources du navigateur

La conversion s’exécute sur votre appareil. La première conversion télécharge environ 90 Mo de fichiers du moteur et de polices, que votre navigateur peut mettre en cache ; le document lui-même n’est jamais envoyé. Le moteur se charge uniquement après la sélection d’un fichier. Un navigateur récent prenant en charge WebAssembly et la mémoire partagée est nécessaire. Les documents volumineux ou complexes peuvent demander du temps et de la mémoire. Vous pouvez annuler, fermer ou remplacer le fichier. Il n’y a pas de limite fixe de taille de fichier ou de nombre de pages.
