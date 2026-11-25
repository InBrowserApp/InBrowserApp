## Convertir un modèle glTF en un seul fichier GLB

Cliquez sur **Ouvrir des fichiers** pour sélectionner le modèle `.gltf` avec ses tampons de données `.bin` et ses textures. Si les textures se trouvent dans des sous-dossiers, cliquez sur **Ouvrir un dossier** pour que le convertisseur puisse suivre les chemins du modèle. Les fichiers glTF qui intègrent déjà ces données sont également pris en charge. Cliquez sur **Essayer un exemple** pour créer un fichier à partir d’une pyramide animée, puis sur **Télécharger le GLB**. Les fichiers sont traités dans votre navigateur.

## Ajouter un tampon de données ou une texture manquante

Un fichier JSON `.gltf` peut faire référence à des ressources telles que `model.bin` ou `textures/albedo.png`. Le convertisseur indique les chemins des fichiers manquants. Cliquez sur **Ajouter des fichiers** pour fournir les ressources manquantes tout en gardant le modèle ouvert. Conservez les noms d’origine. Si différents dossiers contiennent des fichiers de même nom, sélectionnez le dossier qui contient le modèle et les fichiers référencés pour conserver leurs chemins.

## Partager et examiner le GLB

Le GLB intègre la géométrie, les textures prises en charge et les autres données standard référencées par le modèle. Les maillages, les matériaux et les séquences d’animation sont conservés. Le convertisseur conserve l’encodage des textures et la compression des maillages d’origine. Le logiciel de destination doit donc lire ces formats. Les textures PNG et JPEG sont compatibles avec le plus grand nombre de logiciels glTF. Ouvrez uniquement le fichier téléchargé dans la [Visionneuse GLB / glTF](../gltf-viewer/) pour examiner ses dimensions, ses matériaux et son animation. [Format de fichier glTF 2.0](https://registry.khronos.org/glTF/specs/2.0/glTF-2.0.html)
