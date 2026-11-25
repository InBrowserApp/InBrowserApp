## Convertir un fichier STEP ou STP en STL

Cliquez sur **Ouvrir un fichier** ou déposez un fichier `.step` ou `.stp` dans le convertisseur. Il transforme les surfaces du modèle de CAO en triangles sur votre appareil et prépare un fichier STL binaire à télécharger. Cliquez sur **Essayer un exemple** pour convertir un support de fixation, puis sur **Télécharger le STL** pour enregistrer le résultat.

## Conserver les bonnes dimensions pour l’impression 3D

Le format STEP définit des dimensions physiques. Le convertisseur exporte les coordonnées en millimètres, y compris la position de chaque composant dans l’assemblage. Le format STL ne définit pas d’unité de mesure. Sélectionnez les millimètres lorsque vous ouvrez le résultat dans un logiciel de tranchage. Par exemple, une arête qui mesure un pouce dans le STEP s’étend sur 25,4 unités de coordonnées dans le STL.

## Vérifier le maillage exporté

Le STL contient les surfaces triangulées des pièces à leur position dans l’assemblage. Conservez le STEP pour les surfaces de CAO modifiables, les noms des composants et la structure de l’assemblage. Examinez le STL dans la [Visionneuse STL](../stl-viewer/) ou vérifiez le volume délimité et la topologie avec le [Vérificateur de volume et de topologie de maillage](../mesh-inspector/).

## Examiner ou exporter le modèle d’origine

Utilisez la [Visionneuse STEP](../step-viewer/) pour examiner les dimensions, faire pivoter le modèle de CAO et choisir **Exporter en STL** dans la barre d’outils. Si votre logiciel de tranchage importe les fichiers STEP, ouvrez le fichier d’origine et choisissez les paramètres de maillage dans ce logiciel. [Formats pris en charge par PrusaSlicer](https://help.prusa3d.com/article/supported-file-formats_1772)
