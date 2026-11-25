## Réparer un fichier STL en ligne

Cliquez sur **Ouvrir un fichier** ou déposez un fichier `.stl` ASCII ou binaire dans l’outil. La réparation se fait sur votre appareil. Cliquez sur **Essayer un exemple** pour voir un petit maillage avec des faces en double, d’aire nulle et inversées. Comparez les résultats, puis cliquez sur **Télécharger le STL** pour enregistrer un nouveau fichier binaire avec les dimensions et les coordonnées d’origine.

## Ce qui change lors de la réparation du maillage

L’outil supprime les triangles strictement identiques et ceux d’aire nulle. Il compare l’orientation des faces voisines et la corrige lorsqu’une des deux orientations cohérentes exige d’inverser moins de faces que l’autre. Les points du maillage restent à leur place. Les bords ouverts, les orientations ambiguës et les jonctions non-manifold peuvent nécessiter une réparation manuelle. L’outil conserve les trous, les points presque confondus et les intersections. [Problèmes courants de maillage pour l’impression 3D](https://help.prusa3d.com/article/corrupted-3d-models-for-printing_2205)

## Comparer la topologie avant et après

Vérifiez les nombres de triangles, de faces en double et de faces dégénérées. Le rapport indique aussi les arêtes à orientation incohérente, les bords ouverts ainsi que les arêtes et les sommets non-manifold encore présents. Ouvrez le fichier téléchargé dans la [Visionneuse STL](../stl-viewer/) pour l’examiner en 3D. Pour calculer l’aire de surface ou le volume délimité, utilisez le [Vérificateur de volume et de topologie de maillage](../mesh-inspector/). Vous pouvez aussi cliquer sur **Réparer le STL** depuis un rapport d’inspection qui signale des problèmes de topologie.
