Générez des ULID localement dans votre navigateur pour des enregistrements, événements, journaux, jeux de données de test et systèmes distribués qui nécessitent des identifiants compacts avec des préfixes triables par date. Chaque valeur est créée sur cet appareil et peut être copiée ou téléchargée sans envoyer le lot à un autre service.

## Pourquoi utiliser ULID

ULID signifie Universally Unique Lexicographically Sortable Identifier. Il combine un horodatage Unix en millisecondes sur 48 bits avec 80 bits d’aléatoire, puis encode le résultat sous forme de chaîne Crockford Base32 de 26 caractères. Cette forme rend les ULID compatibles avec les URL, adaptés aux bases de données et naturellement triables par date de création.

## Heure actuelle ou personnalisée

Utilisez l’heure actuelle pour les enregistrements d’application courants, les clés d’importation et les données de test qui doivent refléter leur moment de création. Passez à un horodatage personnalisé lorsque vous avez besoin d’exemples d’apparence déterministe, de lignes ajoutées rétroactivement, d’événements rejoués ou de jeux de données de test qui doivent se trier autour d’un moment précis.

## Lots monotones

Lorsque le mode lot monotone est activé, les ID générés pour la même milliseconde incrémentent leur segment aléatoire afin que le lot reste trié lexicographiquement de haut en bas. Désactivez-le si vous préférez que chaque ligne utilise plutôt un nouveau segment aléatoire. Dans les deux modes, l’horodatage reste visible dans les dix premiers caractères.
