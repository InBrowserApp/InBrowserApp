## Convertir du texte enrichi localement

Ouvrez un document `.rtf` local, convertissez-le en PDF, examinez les pages obtenues et téléchargez le même PDF que celui affiché dans l’aperçu. Pour lire sans convertir, utilisez la [Visionneuse RTF](../rtf-viewer/).

## Apparence du PDF et compatibilité

Le moteur de conversion restitue les dimensions et l’orientation des pages, les en-têtes, les pieds de page, les sauts de page, les tableaux et les images PNG/JPEG intégrées prises en charge. Le texte pris en charge reste sélectionnable. Les encodages de caractères RTF d’origine et les séquences d’échappement Unicode sont transmis au moteur ; aucun OCR n’est ajouté au texte numérisé. Les polices manquantes sont remplacées par les polices fournies, ce qui peut modifier les sauts de ligne, l’espacement et la pagination. Les mises en page complexes peuvent différer de l’application d’origine. Vérifiez chaque page avant de vous fier au PDF.

Le PDF est un export statique. Les contrôles de formulaire utilisent leur apparence à l’impression. Les commentaires, les macros et les signatures numériques ne sont ni conservés ni vérifiés. Les objets intégrés, les ressources externes du document, les formats d’image et les instructions de champ non pris en charge sont rejetés. Les fichiers endommagés ou illisibles produisent une erreur sans téléchargement incomplet. Renommer l’extension ne change pas le format sous-jacent.

## Confidentialité et ressources du navigateur

La conversion s’exécute sur votre appareil. La première conversion télécharge environ 90 Mo de fichiers du moteur et de polices, que votre navigateur peut mettre en cache ; le document lui-même n’est jamais envoyé. Le moteur ne se charge qu’après la sélection d’un fichier. Un navigateur récent prenant en charge WebAssembly et la mémoire partagée est nécessaire. Les documents volumineux ou complexes peuvent demander du temps et de la mémoire. Vous pouvez annuler, fermer ou remplacer le fichier. Il n’y a pas de limite fixe de taille de fichier ni de nombre de pages.
