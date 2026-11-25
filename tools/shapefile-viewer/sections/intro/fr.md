## Ouvrir un Shapefile

Déposez une archive ZIP contenant votre Shapefile Esri dans la visionneuse. Vous pouvez aussi sélectionner le fichier .shp avec ses fichiers associés. Si le ZIP contient plusieurs Shapefiles, utilisez **Couche** pour passer de l’un à l’autre. Sélectionnez **Essayer un exemple** pour explorer un jeu de données à deux couches, l’une de points et l’autre de polygones. Vos fichiers sont lus dans votre navigateur et restent sur cet appareil.

## Quels fichiers du Shapefile sont nécessaires ?

Le fichier .shp contient les géométries et suffit pour afficher une couche en coordonnées géographiques. Ajoutez le fichier .dbf associé pour les attributs, le .prj pour le système de coordonnées de référence et, s’il est disponible, le .cpg pour l’encodage du texte des attributs. Gardez ensemble les fichiers d’une même couche et attribuez-leur le même nom de base. Le fichier d’index .shx peut rester dans l’archive ZIP ou dans la sélection.

## Explorer la carte et les attributs

La carte hors ligne se cadre sur la couche active. Utilisez les commandes de la carte pour modifier le zoom ou rétablir le cadrage. Sélectionnez une géométrie sur la carte ou dans la liste **Entités** pour afficher ses attributs. Si le système indiqué par le fichier .prj est pris en charge, la visionneuse transforme les coordonnées projetées pour les afficher sur la carte. Sans ce fichier, les valeurs comprises dans les plages de longitude et de latitude sont interprétées comme des coordonnées WGS 84. Si une couche nécessite une projection, rouvrez-la avec son fichier .prj pour la placer correctement.
