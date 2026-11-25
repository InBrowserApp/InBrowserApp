## Vérifier un fichier GeoJSON

Ouvrez un fichier .geojson ou .json, ou collez un document GeoJSON et sélectionnez **Valider le GeoJSON**. Choisissez **Essayer un exemple** pour afficher une FeatureCollection valide. Vous pouvez modifier le contenu et relancer la validation. Les fichiers et le texte collé restent dans votre navigateur.

## Ce que vérifie le validateur

L’outil vérifie d’abord la syntaxe JSON, puis la structure GeoJSON, notamment les objets FeatureCollection, Feature et GeometryCollection ainsi que les différents types de géométrie. Les positions sont exprimées en WGS 84, avec la longitude avant la latitude. Le validateur vérifie les plages de coordonnées, le nombre minimal de positions dans les lignes et les anneaux, la fermeture des anneaux, les propriétés des entités et la structure des cadres englobants. Les collections d’entités vides et les entités dont la géométrie vaut null sont valides.

## Repérer et corriger une erreur

Un chemin d’erreur tel que `$.features[0].geometry.coordinates` désigne les coordonnées de la première entité. Corrigez le champ indiqué, puis relancez la validation. Le résultat porte sur la structure du fichier. Les propriétés topologiques, comme les auto-intersections ou les chevauchements, se vérifient séparément dans un SIG. Pour examiner visuellement le résultat validé, ouvrez-le dans la [Visionneuse GeoJSON](../geojson-viewer/).
