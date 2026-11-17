## Inspectez des fichiers Parquet dans votre navigateur

Ouvrez ou déposez un fichier `.parquet` pour parcourir ses données et inspecter le type physique, l’annotation logique et la répétition de chaque champ. Les groupes imbriqués restent visibles dans le schéma. Le résumé indique le nombre de lignes, les colonnes, les groupes de lignes, la compression et le créateur du fichier, lorsqu’il est connu. Vous pouvez essayer l’exemple fourni sans choisir de fichier.

## Parcourez les données et exportez en CSV ou JSON

Les données se chargent une page à la fois. Utilisez les commandes de pagination pour parcourir le fichier et sélectionnez une cellule pour lire sa valeur complète. Passez à **Schéma** pour inspecter les champs. Utilisez **Exporter les données** pour télécharger la page actuelle ou toutes les lignes en CSV UTF-8 ou sous forme de tableau JSON. Les exports du fichier entier sont préparés par lots et peuvent être annulés.

Le CSV inclut les noms de colonnes et place entre guillemets les valeurs contenant des virgules, des guillemets ou des sauts de ligne. Les valeurs null deviennent des champs CSV vides et restent `null` en JSON. Les valeurs imbriquées utilisent le JSON ; les données binaires utilisent du texte hexadécimal. Pour préserver les entiers 64 bits, le JSON les écrit sous forme de chaînes de caractères. Les dates et horodatages utilisent le format texte ISO, avec une précision à la milliseconde. Les décimaux suivent la précision numérique du lecteur : cette visionneuse n’assure donc pas une conversion sans perte des décimaux ou horodatages de haute précision.

## Traitement local

Votre fichier est lu localement dans un worker en arrière-plan et n’est jamais envoyé. La visionneuse lit d’abord les métadonnées de fin de fichier, puis uniquement les plages de lignes nécessaires à la navigation. Le décodage des groupes de lignes Parquet peut néanmoins demander beaucoup de mémoire ; la taille des exports est limitée par la mémoire disponible dans votre navigateur. Les codecs non compressé, Snappy, Gzip, Brotli, Zstandard et LZ4 sont pris en charge par hyparquet et son paquet de compression. Les fichiers Parquet chiffrés ne sont pas pris en charge.
