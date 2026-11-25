## Convertir un fichier Wavefront OBJ en STL

Cliquez sur **Ouvrir un fichier** ou déposez un fichier `.obj` dans le convertisseur. Cliquez sur **Essayer un exemple** pour convertir un petit support de fixation. L’outil découpe les faces polygonales en triangles. Cliquez ensuite sur **Télécharger le STL** pour enregistrer le fichier `.stl` binaire. La conversion se fait sur votre appareil.

## Comprendre les changements lors de l’export STL

Le format STL enregistre une surface triangulée. La conversion écarte les matériaux, les images de texture, les coordonnées UV, les lignes isolées et les points isolés. Elle conserve les coordonnées et les axes d’origine. Sélectionnez l’unité voulue dans votre logiciel de tranchage avant d’imprimer. Une longueur de 40 unités de coordonnées dans l’OBJ, par exemple, reste de 40 unités dans le STL.

La conversion peut réussir même si le maillage présente des trous ou d’autres défauts géométriques. Vérifiez le résultat dans votre logiciel de tranchage avant d’imprimer.

## Afficher le résultat ou effectuer la conversion inverse

Utilisez la [Visionneuse STL](../stl-viewer/) pour ouvrir le fichier téléchargé ou la [Visionneuse OBJ](../obj-viewer/) pour examiner le modèle d’origine avec les matériaux que vous fournissez. Utilisez le [Convertisseur STL en OBJ](../stl-to-obj-converter/) pour effectuer la conversion inverse.
