## Convertir un fichier GPX en GeoJSON

Ouvrez un fichier .gpx ou collez du XML GPX, puis sélectionnez **Convertir en GeoJSON**. Choisissez **Essayer un exemple** pour voir comment une trace, un itinéraire et un point de cheminement apparaissent dans le résultat. Copiez le GeoJSON ou téléchargez un fichier .geojson pour votre projet cartographique ou SIG. La conversion s’effectue dans votre navigateur et les données restent sur votre appareil.

## Conversion des traces, itinéraires et points de cheminement

Le résultat est une FeatureCollection GeoJSON. Les points de cheminement deviennent des points, les itinéraires deviennent des lignes et les traces conservent leurs segments continus séparés. Un segment ou un itinéraire qui ne contient qu’une position devient un point. Les champs descriptifs comme le nom et les notes restent associés à leur entité.

## Coordonnées, altitude et heure

GeoJSON indique la longitude avant la latitude. Les lignes qui traversent l’antiméridien sont scindées à 180° pour s’afficher sur les cartes du monde. Lorsque l’altitude est disponible, elle devient la troisième coordonnée, en mètres. Les heures associées aux points figurent dans les propriétés des entités. Pour les itinéraires et les segments de trace, elles suivent l’ordre des coordonnées pour rester associées aux bonnes positions. Vous pouvez ouvrir le résultat dans la [Visionneuse GeoJSON](../geojson-viewer/) ou explorer le GPX d’origine dans la [Visionneuse GPX et profil altimétrique](../gpx-viewer/).
