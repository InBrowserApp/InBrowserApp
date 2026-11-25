## Ouvrir un modèle GLB ou glTF en ligne

Cliquez sur **Ouvrir des fichiers** ou déposez le modèle dans la visionneuse. Un fichier `.glb` regroupe une scène glTF dans un conteneur binaire, qui réunit souvent la géométrie et les textures dans le même fichier. Un fichier `.gltf` décrit la scène en JSON et peut faire référence à des fichiers associés. Si l’export contient par exemple `model.bin` et `albedo.png`, sélectionnez-les avec `model.gltf`. La visionneuse lit les fichiers sur votre appareil.

## Examiner les matériaux et lire les animations

Glissez pour faire pivoter le modèle, zoomez à la molette ou en pinçant et cliquez sur **Cadrer le modèle** pour retrouver la scène entière. Activez le mode **Filaire** pour voir les triangles sous les matériaux. Si le fichier contient des animations, sélectionnez une séquence et cliquez sur **Lire l’animation**. Le bouton **Essayer un exemple** ouvre un modèle animé.

## Ouvrir un modèle dont certaines ressources manquent

Si le modèle fait référence à un tampon de données ou à une image externe, sélectionnez le modèle et les fichiers correspondants ensemble. Conservez leurs noms d’origine. Si la visionneuse ne peut pas lire le format de compression des textures, exportez de nouveau le modèle avec des textures PNG ou JPEG. Consultez la [spécification glTF 2.0](https://registry.khronos.org/glTF/specs/2.0/glTF-2.0.html) pour en savoir plus sur les deux conteneurs.

## Ouvrir d’autres formats 3D

Utilisez la [Visionneuse OBJ](../obj-viewer/) pour les maillages Wavefront avec matériaux MTL ou la [Visionneuse STL](../stl-viewer/) pour examiner un maillage triangulaire avant l’impression 3D.

- [Visionneuse 3MF](../3mf-viewer/)

Utilisez le [Convertisseur glTF en GLB](../gltf-to-glb-converter/) pour réunir dans un seul fichier GLB les tampons de données et les textures auxquels le modèle glTF fait référence.
