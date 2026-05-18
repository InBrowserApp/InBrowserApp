Générez localement dans votre navigateur des identifiants UUID v1 lorsque vous avez besoin de valeurs qui incluent l'heure de création et un identifiant de nœud. Cet outil est utile pour les intégrations anciennes, les imports de bases de données, les jeux de données ordonnés et les systèmes qui attendent encore des UUID version 1 conformes à RFC 4122.

## Quand UUID v1 est utile

UUID v1 stocke un horodatage, une séquence d'horloge et une valeur de nœud de 48 bits dans une chaîne UUID standard de 36 caractères. Les ID générés peuvent ainsi être approximativement triés par heure de création tout en restant compatibles avec les systèmes qui acceptent des colonnes UUID ordinaires, des URL, des journaux et des charges utiles d'API.

## Confidentialité et identifiants de nœud

La génération UUID v1 classique utilisait l'adresse MAC réelle d'une carte réseau, ce qui peut exposer des informations matérielles. Cet outil commence plutôt avec une adresse MAC aléatoire administrée localement. Vous pouvez saisir une valeur de nœud spécifique pour correspondre à un système ancien, mais évitez d'utiliser de véritables adresses matérielles dans des exemples publics ou des données partagées.

## Séquence d'horloge et génération par lot

La séquence d'horloge est une valeur de 14 bits qui aide à éviter les collisions lorsque le même nœud génère des ID à peu près au même moment. La génération par lot conserve tous les ID dans la même milliseconde et incrémente le tick de 100 nanosecondes pour chaque ligne, afin que chaque valeur du résultat reste distincte.
