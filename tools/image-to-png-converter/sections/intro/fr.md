## Convertir une image en PNG

Ouvrez une image locale, examinez l’aperçu et téléchargez l’image sélectionnée au format PNG. L’image enregistrée conserve ses dimensions complètes en pixels, l’orientation appliquée et la transparence prise en charge. Les commandes de zoom, d’ajustement et d’arrière-plan n’affectent que l’aperçu ; elles ne redimensionnent pas le résultat et ne suppriment pas la transparence.

## Formats et sélection des images

Lisez les fichiers JPEG, PNG, GIF, BMP, WebP, les images fixes AVIF, les fichiers TIFF, ICO, les images fixes et collections HEIC/HEIF, les fichiers JPEG XL, JP2 et les flux codés JPEG 2000 (J2K). Le contenu du fichier est vérifié sans se fier à son extension. La prise en charge dépend de l’encodage du fichier. Pour les images vectorielles SVG, utilisez l’outil distinct de conversion SVG en PNG.

Pour les fichiers contenant plusieurs images, sélectionnez la page TIFF, la taille d’icône, l’image de la collection ou l’image d’animation avant le téléchargement. Chaque téléchargement contient un seul PNG fixe, dont le nom de fichier inclut le numéro de page ou d’image d’animation. Les images des animations GIF, WebP et JPEG XL sont recomposées en images complètes. Un PNG animé n’exporte que son image fixe par défaut, signalée comme image d’affiche ; il ne permet pas d’exporter les autres images ni de conserver l’animation.

## Fidélité et fichiers non pris en charge

Le résultat utilise des canaux de 8 bits. Les profondeurs de couleur élevées et le HDR sont réduits : la conversion en PNG ne restaure donc pas la précision de la source. Les profils colorimétriques intégrés sont conservés lorsqu’ils sont pris en charge, mais les couleurs peuvent différer de celles d’un éditeur avec gestion des couleurs. Les images auxiliaires, les cartes de profondeur et les métadonnées du conteneur ne sont pas conservées lors de la conversion.

Les séquences temporelles HEIF/AVIF, les compositions JPEG 2000 (JPX/JPF/JPM) et Motion JPEG 2000 (MJ2) ne sont pas pris en charge. Les images endommagées ou non prises en charge affichent une erreur au lieu de permettre un téléchargement réussi. Les images très volumineuses ou complexes peuvent dépasser les ressources du navigateur ou du décodeur ; aucune limite fixe de taille de fichier ou de nombre d’images n’est imposée.

## Traitement local et téléchargements

Les fichiers restent sur cet appareil. Annuler, fermer ou remplacer un fichier libère son décodeur et le téléchargement actuel. Changer d’image sélectionnée supprime le téléchargement précédent pendant la préparation de la suivante. Un fichier n’est enregistré que lorsque vous choisissez Télécharger le PNG. La Visionneuse d’images propose également le même téléchargement en PNG de l’image sélectionnée.
