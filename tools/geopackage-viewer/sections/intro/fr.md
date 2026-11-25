## Ouvrir un GeoPackage

Choisissez ou déposez un fichier .gpkg, puis utilisez **Couche ou table** pour parcourir son contenu. Sélectionnez **Essayer un exemple** pour ouvrir un GeoPackage comprenant une couche de points et une couche de polygones. Le fichier est ouvert sur votre appareil. Une fois la page chargée, la carte hors ligne intégrée fonctionne sans demander de tuiles à un service en ligne.

## Explorer les couches vectorielles et leurs attributs

La carte se cadre sur la couche vectorielle sélectionnée. Cliquez sur un point, une ligne ou un polygone, ou choisissez-le dans la liste **Entités** pour consulter ses attributs. Si la couche indique un système de coordonnées de référence pris en charge, la visionneuse positionne ses entités en WGS 84. Vous pouvez également choisir une table non spatiale et parcourir ses enregistrements. L’aperçu affiche jusqu’à 500 enregistrements par couche pour que la carte reste réactive avec les gros fichiers.

## Ce que contient un GeoPackage

GeoPackage est un format de l’OGC qui stocke les données spatiales dans un seul fichier SQLite. Un GeoPackage peut contenir plusieurs couches vectorielles, des tables attributaires ordinaires et des tables de tuiles. Les entrées de tuiles figurent dans la liste des couches. Choisissez une couche vectorielle pour afficher ses géométries sur la carte. Pour un Shapefile Esri accompagné de fichiers distincts, utilisez la [Visionneuse Shapefile](../shapefile-viewer/).
