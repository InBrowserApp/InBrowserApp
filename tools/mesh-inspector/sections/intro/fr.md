## Vérifier un maillage STL ou OBJ en ligne

Cliquez sur **Ouvrir un fichier** ou déposez un modèle `.stl` ou `.obj` dans l’outil. Le maillage est lu sur votre appareil. Les résultats donnent l’aire de surface, le volume délimité et les problèmes de topologie. Cliquez sur **Essayer un exemple** pour vérifier un support de fixation au maillage fermé avant d’examiner votre fichier.

## Interpréter l’aire de surface et le volume

Les coordonnées STL et OBJ ne définissent pas d’unité physique commune. Dans **Unité des coordonnées**, sélectionnez celle utilisée à l’export. L’aire s’exprime en unités carrées et le volume en unités cubes. Le choix de l’unité ajoute un libellé aux valeurs enregistrées en conservant leur échelle. Le support donné en exemple occupe un volume de 16 016 mm³ si ses coordonnées sont en millimètres.

L’aire de surface est la somme des aires des triangles du fichier, y compris toutes les copies des faces en double. Si le maillage passe les vérifications de topologie, l’outil calcule le volume à partir de l’orientation des faces. Les surfaces qui se recoupent et les composantes mal orientées ou qui se chevauchent peuvent fausser cette estimation. Pour un résultat important, comparez la valeur au modèle solide d’origine.

## Comprendre les résultats de topologie

- Une **arête de bord** appartient à un seul triangle. Ces arêtes délimitent les bords ouverts, y compris les trous.
- Une **arête non-manifold** appartient à plus de deux triangles. Un **sommet non-manifold** est l’extrémité d’une de ces arêtes ou le point de rencontre de groupes de faces disjoints.
- Il y a **orientation incohérente** lorsque deux triangles parcourent leur arête commune dans le même sens. Deux faces voisines bien orientées la parcourent en sens opposés.
- Les **faces dégénérées** ont une aire nulle. Les **faces en double** répètent le même triangle.

L’outil regroupe les positions exactement identiques en un seul sommet. Il identifie les composantes du maillage à partir des arêtes partagées entre leurs triangles. En cas de défaut topologique, l’outil affiche l’aire de surface et le nombre de problèmes détectés. Ces nombres peuvent vous aider à repérer ce qu’il faut corriger avant d’utiliser le volume.

## Examiner ou convertir le modèle

Utilisez la [Visionneuse STL](../stl-viewer/) ou la [Visionneuse OBJ](../obj-viewer/) pour examiner le modèle en 3D, notamment en mode filaire. Si votre prochaine étape exige un fichier STL, utilisez le [Convertisseur OBJ en STL](../obj-to-stl-converter/).

Si le rapport d’un STL signale des problèmes de topologie, cliquez sur **Réparer le STL** pour travailler avec le même fichier. L’outil de [Réparation de maillages STL](../stl-mesh-repair/) compare aussi les faces en double ou d’aire nulle, l’orientation des faces et les problèmes de topologie restants avant le téléchargement d’un nouveau STL.
