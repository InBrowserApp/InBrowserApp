## Ouvrir des fichiers DICOM

Sélectionnez **Ouvrir des fichiers DICOM** ou déposez un ou plusieurs fichiers dans la visionneuse. Pour parcourir une série de scanner (TDM) ou d’IRM, sélectionnez toutes les images de la série. Si les fichiers contiennent plusieurs séries, utilisez le sélecteur **Série** pour passer de l’une à l’autre. Les fichiers peuvent porter l’extension `.dcm` ou `.dicom`, ou ne pas avoir d’extension.

Utilisez la molette sur l’image, sélectionnez l’image au clavier puis appuyez sur la flèche haut ou bas, ou utilisez le curseur et les boutons de navigation. Sélectionnez **Essayer l’exemple** pour explorer une série de scanner synthétique avant d’ouvrir vos propres fichiers.

## Régler la largeur et le niveau de fenêtre

La largeur de fenêtre détermine l’étendue de la plage de gris affichée. Réduire la largeur augmente le contraste dans cette plage. Le niveau de fenêtre, aussi appelé centre de fenêtre, décale cette plage et modifie la luminosité de l’image. Saisissez les valeurs dans **Réglages du fenêtrage** ou faites glisser le pointeur sur l’image à l’horizontale pour modifier la largeur et à la verticale pour modifier le niveau. Sélectionnez **Réinitialiser** pour retrouver les réglages initiaux de la coupe affichée.

## Consulter les métadonnées DICOM

Ouvrez **Métadonnées** pour voir les tags du fichier affiché, notamment la modalité, la description de la série et les dimensions de l’image, lorsque ces informations sont disponibles. Recherchez par numéro de tag, nom d’attribut ou valeur. Pour un fichier contenant plusieurs images, le tableau affiche les attributs communs à l’ensemble du fichier. Les métadonnées peuvent contenir des informations permettant d’identifier une personne. Les fichiers et leurs tags sont traités sur cet appareil, sans envoi vers un serveur.

## Images DICOM prises en charge

La visionneuse ouvre les images DICOM en niveaux de gris dont les données de pixels sont au format JPEG sans perte ou non compressées. Elle prend aussi en charge les fichiers contenant plusieurs images. DICOM est un format conteneur. L’affichage d’une image dépend de l’encodage de ses pixels. Si l’image utilise un autre encodage, comme JPEG 2000, exportez-la en DICOM sans compression depuis votre logiciel d’imagerie. La visionneuse sert à consulter les fichiers et les images. Utilisez une station de travail clinique pour établir un diagnostic.
