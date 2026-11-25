## Convertir un fichier STL en Wavefront OBJ

Cliquez sur **Ouvrir un fichier** ou déposez un fichier `.stl` dans le convertisseur. Il lit les fichiers STL ASCII et binaires et prépare un fichier `.obj` dans votre navigateur. Cliquez sur **Essayer un exemple** pour convertir un petit support de fixation, puis sur **Télécharger le OBJ** pour l’enregistrer.

## Vérifier le contenu du fichier OBJ

Le convertisseur écrit les triangles de la surface d’origine dans un fichier Wavefront OBJ. Il conserve les axes et l’échelle du maillage. Le format STL ne définit aucune unité de mesure. Si une arête mesure 40 unités dans le fichier source, elle mesure toujours 40 unités de coordonnées dans l’OBJ. Sélectionnez l’unité voulue lorsque vous l’importez dans un autre logiciel.

Le fichier téléchargé contient la géométrie du maillage. Le format STL standard décrit la surface de la pièce. Le fichier OBJ obtenu est donc fourni sans bibliothèque de matériaux ni textures.

## Afficher le résultat ou effectuer la conversion inverse

Ouvrez le fichier téléchargé dans la [Visionneuse OBJ](../obj-viewer/) pour examiner le résultat. Utilisez la [Visionneuse STL](../stl-viewer/) pour examiner le fichier source ou le [Convertisseur OBJ en STL](../obj-to-stl-converter/) pour effectuer la conversion inverse.
